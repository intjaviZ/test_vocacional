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
    private function usuarioValido(int $id_user): bool
    {
        if (empty($id_user)) return false;
        if (!is_numeric($id_user) || (int)$id_user != $id_user) return false;
        if ($id_user <= 0) return false;

        return true;
    }

    public function usuario(int $id_user): array
    {
        try {
            if (!$this->usuarioValido($id_user)) {
                throw new \Exception("El usuario no es valido.");
            }
            $datosUsuario = $this->datosUsuario($id_user);
            $response = [
                'id_user'    => $datosUsuario['id_user'],
                'nombre'     => $datosUsuario['nombre'],
                'evaluacion' => $datosUsuario['evaluacion'],
                'area'       => $datosUsuario['area']
            ];
            return $response;
        } catch (\Throwable $th) {
            throw new \Exception($th->getMessage());
        }
    }
    public function grafica(int $id_user): array
    {
        try {
            if (!$this->usuarioValido($id_user)) {
                throw new \Exception("El usuario no es valido.");
            }
            $datosGrafica = $this->datosGrafica($id_user);
            $response = [
                'data'   => $datosGrafica['data'],
                'labels' => $datosGrafica['labels']
            ];
            return $response;
        } catch (\Throwable $th) {
            throw new \Exception($th->getMessage());
        }
    }
    public function correo(int $id_user): array
    {
        try {
            if (!$this->usuarioValido($id_user)) {
                throw new \Exception("El usuario no es valido.");
            }
            $datosUsuario = $this->datosUsuario($id_user);
            $carreras = $this->pedirCarreras($id_user);
            $email = $this->pedirEmail($id_user);
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
    private function datosUsuario(int $id_user): array
    {
        $usuario = $this->db->table('test_respuestas')
            ->select('test_user.id_user, test_user.nombre_user, test_evaluacion.evaluacion, test_areas.nombre_area')
            ->join('test_user', 'test_user.id_user = test_respuestas.id_user')
            ->join('test_evaluacion', 'test_evaluacion.id_evaluacion = test_respuestas.id_evaluacion')
            ->join('test_areas', 'test_areas.id_area = test_respuestas.id_area')
            ->where('test_respuestas.id_user', $id_user)->where('test_respuestas.id_status', 3)
            ->orderBy('test_respuestas.fecha', 'DESC')->limit(1)
            ->get()->getRow();

        if (empty($usuario)) {
            throw new \Exception("No se encontraron resultados para el usuario.");
        }
        return [
            'id_user'    => intval($usuario->id_user),
            'nombre'     => $usuario->nombre_user,
            'evaluacion' => $usuario->evaluacion,
            'area'       => $usuario->nombre_area
        ];
    }

    private function datosGrafica(int $id_user): array
    {
        $resultados = $this->pedirResultados($id_user);
        $claves = array_keys($resultados);
        $data = array_values($resultados);
        $labels = $this->pedirAreas($claves);
        return [
            'data'   => $data,
            'labels' => $labels
        ];
    }

    private function pedirResultados(int $id_user): array
    {
        $resultado = $this->db->table('test_respuestas')->select('resultados')
            ->where('id_user', $id_user)->where('id_status', 3)
            ->orderBy('fecha', 'DESC')->limit(1)->get()->getRow();

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

    private function pedirCarreras(int $id_user): array
    {
        $id_area = $this->db->table('test_respuestas')->select('id_area')
            ->where('id_user', $id_user)->where('id_status', 3)
            ->orderBy('fecha', 'DESC')->limit(1)
            ->get()->getRow()->id_area;

        $carreas = $this->db->table('test_carreras')->select('nombre_carrera')
            ->where('id_area', $id_area)->where('id_status', 1)->get();

        $nombre_carreras = array_column($carreas->getResultArray(), 'nombre_carrera');

        if (empty($nombre_carreras)) {
            throw new \Exception("No se encontraron resultados para el usuario.");
        }
        return $nombre_carreras;
    }

    private function pedirEmail(int $id_user): string
    {
        $result = $this->db->table('test_user')->select('email')
            ->where('id_user', $id_user)->where('id_status', 1)->where('test_completado', 3)
            ->orderBy('fecha', 'DESC')->limit(1)->get()->getRow();

        if (!$result || !$result->email) {
            throw new \Exception("No encontramos el correo del usuario.");
        }
        return $result->email;
    }
}
