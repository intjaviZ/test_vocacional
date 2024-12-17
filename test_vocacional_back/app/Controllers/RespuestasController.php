<?php

namespace App\Controllers;

use App\Libraries\DataBaseConnect;
use CodeIgniter\RESTful\ResourceController;
use Config\Services;

class RespuestasController extends ResourceController
{
    protected DataBaseConnect $databaseConnect;
    protected $db;

    public function __construct()
    {
        $this->databaseConnect = Services::databaseConnect();
        $this->db = $this->databaseConnect->getConnection();
    }

    protected $modelName = 'App\Models\RespuestasModel';
    protected $format    = 'json';

    public function index()
    {
        $builder = $this->db->table('test_areas');

        // Ejecuta la consulta
        $query = $builder->select('id_area')->get();

        // Resultado
        $respuestasModelJson = [];
        foreach ($query->getResultArray() as $row) {
            $id_area = $row['id_area'];
            $respuestasModelJson[$id_area] = 0; // Añade el id_area como clave y 0 como valor
        }

        // Retorna el JSON
        return $this->respond($respuestasModelJson, 200);
    }
    public function create($id_user = null)
    {
        try {
            if ($id_user) {
                if ($this->validateIdUser($id_user)) {
                    $dataRespuestas = $this->request->getJSON(true);

                    if (empty($dataRespuestas) || !is_array($dataRespuestas)) {
                        return $this->failValidationErrors('El cuerpo de la solicitud debe ser un JSON válido.');
                    } else if (!$this->validateRespuestas($dataRespuestas)) {
                        return $this->failValidationErrors('fallo en la validación de datos', 400);
                    }

                    $resultados = $this->resultados($dataRespuestas);

                    $dataInsert = [
                        'id_user'       => 0,
                        'resultados'    => new \stdClass(), // Objeto vacío
                        'id_area'       => 0,
                        'puntos'        => 0,
                        'id_evaluacion' => 0,
                    ];

                    $dataInsert['id_user'] = $id_user;
                    $dataInsert['resultados'] = json_encode($dataRespuestas);
                    $dataInsert['id_area'] = $resultados['id_area'];
                    $dataInsert['puntos'] = $resultados['puntos'];
                    $dataInsert['id_evaluacion'] = $resultados['id_evaluacion'];

                    if (!$this->model->insert($dataInsert)) {
                        $errors = $this->model->errors();
                        return $this->failValidationErrors($errors, 400, 'error al registrar tu respuesta');
                    } else {
                        $resultadosListos = $this->respondResultados($id_user);
                        return $this->respond($resultadosListos, 201, 'created');
                    }
                }
            }
            return $this->failValidationErrors('El id_user es obligatorio.');
        } catch (\Throwable $e) {
            return $this->response->setStatusCode(500)
                ->setJSON([
                    "error" => true,
                    "message" => 'Error al procesar la solicitud: ' . $e->getMessage()
                ]);
        }
    }
    public function show($id_user = null)
    {
        try {
            if ($id_user) {
                $id_user = (int) $id_user;
                if ($this->validateIdUser($id_user)) {
                    $resultados = $this->respondResultados($id_user);
                    return $this->respond($resultados, 200, 'ok');
                }
            }
            return $this->failValidationErrors('El id_user es obligatorio.');
        } catch (\Throwable $e) {
            return $this->response->setStatusCode(500)
                ->setJSON([
                    "error" => true,
                    "message" => 'Error al procesar la solicitud: ' . $e->getMessage()
                ]);
        }
    }
    public function obtenerEstructura()
    {
        $estructura = $this->estructura();
        return $this->respond($estructura, 200);
    }


    private function estructura()
    {
        return [
            'id_user'       => null,
            'resultados'    => new \stdClass(), // Objeto vacío
            'area'       => "",
            'puntos'        => 0,
            'evaluacion' => "",
        ];
    }

    /**
     * valida si el id recibido se puede asociar a un usuario
     * 
     * @param int $id_user id que recibe create
     * @return bool si el id está en test_users retorna true
     */
    private function validateIdUser(int $id_user): bool
    {
        $modelUser = new \App\Models\UserModel();

        if (!$modelUser->exists($id_user)) {
            return false;
        }
        return true;
    }

    /**
     * Valida si las claves de respuestas son id_area válidos en la tabla test_areas.
     *
     * @param array $respuestas Arreglo de claves y valores de respuestas.
     * @return bool Retorna true si todas las claves son válidas, de lo contrario false.
     */
    private function validateRespuestas(array $respuestas): bool
    {
        // Extraer las claves de respuestas
        $keys = array_keys($respuestas);

        // Obtener los id_area válidos de la base de datos
        $builder = $this->db->table('test_areas');
        $validIds = $builder->select('id_area')->get()->getResultArray();

        // Convertir los id_area en un arreglo simple
        $validIds = array_column($validIds, 'id_area');

        // Validar si todas las claves existen en los id_area
        foreach ($keys as $key) {
            if (!in_array($key, $validIds)) {
                return false; // Si alguna clave no es válida, retorna false
            }
        }

        return true; // Todas las claves son válidas
    }

    private function mayorAreaPuntaje(array $respuestas): array
    {
        try {
            $claveMayorValor = array_key_first($respuestas);
            $mayorValor = $respuestas[$claveMayorValor];
            foreach ($respuestas as $clave => $valor) {
                if ($valor > $mayorValor) {
                    $mayorValor = $valor;
                    $claveMayorValor = $clave;
                }
            }

            $response = [
                "id_area" => $claveMayorValor,
                "puntos" => $mayorValor
            ];
            return $response;
        } catch (\Throwable $e) {
            throw new \RuntimeException('Error al procesar los resultados: ' . $e->getMessage(), 500, $e);
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
            throw new \RuntimeException('Error al validar los datos: ' . $e->getMessage());
        }
    }

    private function evaluar(int $puntos, int $id_area): int
    {
        $preguntasArea = $this->db->table('test_preguntas')->where('id_area', $id_area)->countAllResults();

        $maxInciso = $this->db->table('test_incisos')->select('valor_inciso')->orderBy('valor_inciso', 'DESC')
            ->limit(1)->get()->getRow();

        $maxPuntaje = $preguntasArea * $maxInciso->valor_inciso;
        $porcentaje = ($puntos * 100) / $maxPuntaje;
        $porcentaje = number_format($porcentaje, 3);

        if (is_numeric($porcentaje)) {
            $evaluar = $this->db->table('test_evaluacion')->select('id_evaluacion')
                ->where("$porcentaje BETWEEN min_puntaje AND max_puntaje", null, false)->get()->getRow();

            if (!$evaluar) {
                throw new \RuntimeException('No se encontró una evaluación para los puntos dados.');
            }
            return $evaluar->id_evaluacion;
        } else {
            throw new \InvalidArgumentException("El porcentaje debe ser un número.");
        }
    }

    private function respondResultados(int $id_user): array
    {
        $query = $this->db->table('test_respuestas')
            ->select('test_areas.nombre_area, test_evaluacion.evaluacion, test_respuestas.resultados, test_respuestas.puntos')
            ->join('test_areas', 'test_areas.id_area = test_respuestas.id_area')
            ->join('test_evaluacion', 'test_evaluacion.id_evaluacion = test_respuestas.id_evaluacion')
            ->where('test_respuestas.id_user', $id_user)->orderBy('test_respuestas.fecha', 'DESC')->limit(1);

        $rows = $query->get()->getRow();

        if (!$rows) {
            return [
                'error' => true,
                'message' => 'No se encontraron resultados para el usuario especificado.',
            ];
        }


        $area = $rows->nombre_area;
        $puntos = $rows->puntos;
        $evaluacion = $rows->evaluacion;
        $resultados = is_string($rows->resultados) ? json_decode($rows->resultados, true) : $rows->resultados;

        // Aseguramos que 'resultados' sea un JSON válido (cadena) para la respuesta
        if (is_array($resultados)) {
            $resultados = json_encode($resultados);
        } else {
            // Si 'resultados' no es un array válido, se asigna un objeto vacío como JSON
            $resultados = json_encode(new \stdClass());
        }

        $respond = $this->estructura();

        $respond['id_user']     = $id_user;
        $respond['resultados']  = $resultados;
        $respond['area']        = $area;
        $respond['puntos']      = $puntos;
        $respond['evaluacion']  = $evaluacion;

        return $respond;
    }
}
