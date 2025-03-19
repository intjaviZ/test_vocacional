<?php

namespace App\Libraries;

use Config\Services;

class DatosGrafica
{
    protected DataBaseConnect $databaseConnect;
    protected $db;

    public function __construct()
    {
        $this->databaseConnect = Services::databaseConnect();
        $this->db = $this->databaseConnect->getConnection();
    }
    private function idValido(int $id): bool
    {
        if (empty($id)) return false;
        if (!is_numeric($id) || (int)$id != $id) return false;
        if ($id <= 0) return false;

        return true;
    }

    public function usuario(int $id_respuesta): array
    {
        try {
            if (!$this->idValido($id_respuesta)) {
                throw new \Exception("El usuario no es valido.");
            }
            $datosUsuario = $this->datosUsuario($id_respuesta);
            $response = [
                'id_user'    => $datosUsuario['id_user'],
                'nombre'     => $datosUsuario['nombre'],
                'evaluacion' => $datosUsuario['evaluacion'],
                'area'       => $datosUsuario['area'],
                'status_email'       => $datosUsuario['status']
            ];
            return $response;
        } catch (\Throwable $th) {
            throw new \Exception($th->getMessage());
        }
    }
    public function grafica(int $id_respuesta): array
    {
        try {
            if (!$this->idValido($id_respuesta)) {
                throw new \Exception("El usuario no es valido.");
            }
            $datosGrafica = $this->datosGrafica($id_respuesta);
            $response = [
                'data'   => $datosGrafica['data'],
                'labels' => $datosGrafica['labels']
            ];
            return $response;
        } catch (\Throwable $th) {
            throw new \Exception($th->getMessage());
        }
    }
    public function correo(int $id_respuesta): array
    {
        try {
            if (!$this->idValido($id_respuesta) || $this->verificarEnviado($id_respuesta)) {
                throw new \Exception("No se pudo enviar el correo.");
            }
            $datosUsuario = $this->datosUsuario($id_respuesta);
            $carreras = $this->pedirCarreras($id_respuesta);
            $email = $this->pedirEmail($id_respuesta);
            $response = [
                'id_user'    => $datosUsuario['id_user'],
                'email'      => $email,
                'nombre'     => $datosUsuario['nombre'],
                'evaluacion' => $datosUsuario['evaluacion'],
                'area'       => $datosUsuario['area'],
                'carreras'   => $carreras
            ];
            return $response;
        } catch (\Throwable $th) {
            throw new \Exception($th->getMessage());
        }
    }
    private function datosUsuario(int $id_respuesta): array
    {
        $usuario = $this->db->table('test_respuestas')
            ->select('test_user.id_user, test_user.nombre_user, 
            test_evaluacion.evaluacion, test_areas.nombre_area, test_respuestas.id_status')
            ->join('test_user', 'test_user.id_user = test_respuestas.id_user')
            ->join('test_evaluacion', 'test_evaluacion.id_evaluacion = test_respuestas.id_evaluacion')
            ->join('test_areas', 'test_areas.id_area = test_respuestas.id_area')
            ->where('test_respuestas.id_respuesta', $id_respuesta)
            ->get()->getRow();

        if (empty($usuario)) {
            throw new \Exception("No se encontraron resultados para el usuario.");
        }
        return [
            'id_user'    => intval($usuario->id_user),
            'nombre'     => $usuario->nombre_user,
            'evaluacion' => $usuario->evaluacion,
            'area'       => $usuario->nombre_area,
            'status'     => intval($usuario->id_status)
        ];
    }

    private function datosGrafica(int $id_respuesta): array
    {
        $resultados = $this->pedirResultados($id_respuesta);
        $claves = array_keys($resultados);
        $data = array_values($resultados);
        $labels = $this->pedirAreas($claves);
        return [
            'data'   => $data,
            'labels' => $labels
        ];
    }

    private function pedirResultados(int $id_respuesta): array
    {
        $resultado = $this->db->table('test_respuestas')->select('resultados')
            ->where('id_respuesta', $id_respuesta)->get()->getRow();

        if (!$resultado) {
            throw new \Exception("No se encontraron resultados para el usuario.");
        }

        $arrayResultados = json_decode($resultado->resultados, true);
        return $arrayResultados;
    }

    private function pedirAreas(array $claves): array
    {
        $nombre_areas = $this->db->table('test_areas')->select('nombre_area')
            ->whereIn('id_area', $claves)
            ->get()->getResult();

        $areas = array_map(function ($area) {
            return $area->nombre_area;
        }, $nombre_areas);

        if (empty($areas)) {
            throw new \Exception("No se encontraron resultados para el usuario.");
        }
        return $areas;
    }

    private function pedirCarreras(int $id_respuesta): array
    {

        $carreas = $this->db->table('test_respuestas')
            ->select('test_carreras.nombre_carrera')
            ->join('test_carreras','test_carreras.id_area = test_respuestas.id_area')
            ->where('test_respuestas.id_respuesta', $id_respuesta)->get();

        $nombre_carreras = array_column($carreas->getResultArray(), 'nombre_carrera');

        if (empty($nombre_carreras)) {
            throw new \Exception("No se encontraron resultados para el usuario.");
        }
        return $nombre_carreras;
    }

    private function pedirEmail(int $id_respuesta): string
    {
        $result = $this->db->table('test_respuestas')->select('test_user.email')
            ->join('test_user', 'test_user.id_user = test_respuestas.id_user')
            ->where('test_respuestas.id_respuesta', $id_respuesta)
            ->get()->getRow();

        if (!$result || !$result->email) {
            throw new \Exception("No encontramos el correo del usuario.");
        }
        return $result->email;
    }

    private function verificarEnviado(int $id_respuesta) : bool {
        $status = $this->db->table('test_respuestas')->select('id_status')
        ->where('id_respuesta',$id_respuesta)->get()->getRow();

        if ($status->id_status == 3) {
            return true;
        }

        return false;
    }
}
