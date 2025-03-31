<?php

namespace App\Controllers;

use App\Libraries\DataBaseConnect;
use CodeIgniter\RESTful\ResourceController;
use Config\Services;

class RespuestasController extends ResourceController
{
    protected $format = 'json';
    protected DataBaseConnect $databaseConnect;
    protected $db;

    public function __construct()
    {
        $this->databaseConnect = Services::databaseConnect();
        $this->db = $this->databaseConnect->getConnection();
        $this->model = new \App\Models\RespuestasModel();
    }

    public function index()
    {
        $query = $this->obtenerAreas();
        $respuestasModelJson = [];
        foreach ($query->getResultArray() as $row) {
            $id_area = $row['id_area'];
            $respuestasModelJson[$id_area] = 0;
        }
        return $this->respond($respuestasModelJson, 200);
    }

    public function show($id_user = null)
    {
        if (!$id_user || !$this->validarIdUser($id_user)) {
            return $this->failNotFound('Usuario no encontrado.');
        }
        
        $respuestas = $this->db->table('test_respuestas')->select('id_respuesta')
        ->where('id_user',$id_user)->get()->getResultArray();

        $id_respuestas =  array_column($respuestas, 'id_respuesta');
    
        return $this->respond($id_respuestas,200);
    }

    public function create($id_user = null)
    {
        try {
            if (!$id_user || !$this->validarIdUser($id_user)) {
                return $this->failValidationErrors('El usuario no es valido.');
            }
                
            $dataRespuestas = $this->request->getJSON(true);
            if (empty($dataRespuestas) || !is_array($dataRespuestas)) {
                return $this->failValidationErrors('los datos no son validos.', 400);
            }
            if (!$this->validarRespuestas($dataRespuestas)) {
                return $this->failValidationErrors('Fallo en la validación de datos', 400);
            }

            $resultados = $this->resultados($dataRespuestas);
            $dataInsert = [
                'id_user'       => $id_user,
                'resultados'    => json_encode($dataRespuestas),
                'id_area'       => $resultados['id_area'],
                'puntos'        => $resultados['puntos'],
                'id_evaluacion' => $resultados['id_evaluacion'],
            ];

            $id_insertado = $this->model->insert($dataInsert);
            if (!$id_insertado) {
                $errors = $this->model->errors();
                return $this->failValidationErrors($errors, 400, 'error al registrar tu respuesta');
            }

            $completado = $this->completar($id_user);
            if (!$completado) {
                throw new \RuntimeException("No logramos guardar tu resultado.");
            }

            $resultadosListos =  [ 
                "exito" => true,
                "respuesta" => $id_insertado
            ];
            return $this->respond($resultadosListos, 201);

        } catch (\RuntimeException $e) {
            return $this->response->setStatusCode(400)
                ->setJSON([
                    "error"   => true,
                    "message" => $e->getMessage()
                ]);
        }  catch (\Throwable $e) {
            return $this->response->setStatusCode(500)
                ->setJSON([
                    "error"   => true,
                    "message" => $e->getMessage()
                ]);
        }
    }    

    private function validarIdUser(int $id_user): bool
    {
        $modelUser = new \App\Models\UserModel();
        return $modelUser->exists($id_user);
    }

    private function validarRespuestas(array $respuestas): bool
    {
        $keysRespuestas = array_keys($respuestas);

        $validIds = $this->obtenerAreas()->getResultArray();
        $validIds = array_column($validIds, 'id_area');

        foreach ($keysRespuestas as $key) {
            if (!in_array($key, $validIds)) { return false; }
        }

        return true;
    }

    private function completar(int $id_user) : bool 
    {
        $query = $this->db->table('test_user')
        ->select('test_completado')
        ->where('id_user', $id_user)
        ->where('id_status', 1)
        ->get();

        $row = $query->getRow();

        if (!$row) { return false; }
        if ($row->test_completado == 3) {
            return true;
        }

        $this->db->table('test_user')->where('id_user', $id_user)
        ->where('id_status', 1)->update(['test_completado' => 3]);
        return $this->db->affectedRows() > 0;
    }

    private function obtenerAreas() {
        return $this->db->table('test_areas')->select('id_area')
        ->where('id_status', 1)->get();
    }

    private function mayorAreaPuntaje(array $respuestas): array
    {
        try {
            if (empty($respuestas)) {
                throw new \RuntimeException("No hay respuestas para evaluar.");
            }

            $id_area = array_keys($respuestas, max($respuestas))[0];

            return [
                "id_area" => $id_area,
                "puntos" => $respuestas[$id_area]
            ];
        } catch (\Throwable $e) {
            throw new \RuntimeException( $e->getMessage(), 500, $e);
        }
    }

    private function resultados(array $respuestas): array
    {
        try {
            $resultAreaPuntaje = $this->mayorAreaPuntaje($respuestas);
            $puntos = $resultAreaPuntaje['puntos'];
            $id_area = $resultAreaPuntaje['id_area'];
            $evaluacion = $this->evaluar($puntos, $id_area);

            $response = [
                "id_area" => $id_area,
                "puntos" => $puntos,
                "id_evaluacion" => $evaluacion
            ];

            return $response;
        } catch (\Throwable $e) {
            throw new \RuntimeException($e->getMessage());
        }
    }

    private function evaluar(int $puntos, int $id_area): int
    {
        $query = $this->db->query(" SELECT 
        (SELECT COUNT(*) FROM test_preguntas WHERE id_area = ? AND id_status = 1) AS total_preguntas,
        (SELECT MAX(valor_inciso) FROM test_incisos WHERE id_status = 1) AS max_valor_inciso
        ", [$id_area]);

        $result = $query->getRow();
        $maxPuntaje = $result->total_preguntas * $result->max_valor_inciso;
        $porcentaje = ($puntos * 100) / $maxPuntaje;
        $porcentaje = number_format($porcentaje, 3);

        if (is_numeric($porcentaje)) {
            $evaluar = $this->db->table('test_evaluacion')->select('id_evaluacion')
            ->where("$porcentaje BETWEEN min_puntaje AND max_puntaje", null, false)->where('status', 1)
            ->get()->getRow();

            if (!$evaluar) {
                throw new \RuntimeException('No se encontró una evaluación para los puntos dados.');
            }
            return $evaluar->id_evaluacion;
        } else {
            throw new \InvalidArgumentException("El porcentaje debe ser un número.");
        }
    }
}