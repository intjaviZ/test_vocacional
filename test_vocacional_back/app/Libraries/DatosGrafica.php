<?php

namespace App\Libraries;

use Config\Services;

class DatosGrafica {
    protected DataBaseConnect $databaseConnect;
    protected $db;

    public function __construct()
    {
        $this->databaseConnect = Services::databaseConnect();
        $this->db = $this->databaseConnect->getConnection();
    }

    public function pedirDatos(int $id_user): array
    {
        try {
            $queryJoinRespuestas = $this->pedirjoinsRespuestas($id_user);
            $queryCarreras = $this->pedirCarreras($id_user);

            $resultadosArray = json_decode($queryJoinRespuestas['resultados'], true);
            $claves = array_keys($resultadosArray);
            $valores = array_values($resultadosArray);
            $queryAreas = $this->pedirAreas($claves);


            $response = [
                'nombre' => $queryJoinRespuestas['nombre_user'],
                'email' => $queryJoinRespuestas['email'],
                'evaluacion' => $queryJoinRespuestas['evaluacion'],
                'area' => $queryJoinRespuestas['area'],
                'carreras' => $queryCarreras['carreras'],
                'data' => $valores,
                'labels' => $queryAreas
            ];
            return $response;
        } catch (\Throwable $th) {
            return [
                'error'   =>  $th->getMessage(),
                'status'  => '400',
                'message' => 'Error al obtener los datos. Intente más tarde.',
            ];
        }
    }

    private function pedirjoinsRespuestas(int $id_user): array
    {
        try {
            $queryJoinRespuestas = $this->db->table('test_respuestas')
                ->select('test_user.nombre_user, test_user.email, test_evaluacion.evaluacion, test_areas.nombre_area, test_respuestas.resultados')
                ->join('test_user', 'test_user.id_user = test_respuestas.id_user')
                ->join('test_evaluacion', 'test_evaluacion.id_evaluacion = test_respuestas.id_evaluacion')
                ->join('test_areas', 'test_areas.id_area = test_respuestas.id_area')
                ->where('test_respuestas.id_user', $id_user)->orderBy('test_respuestas.fecha', 'DESC')->limit(1)
                ->get()->getResult();

            if (empty($queryJoinRespuestas)) {
                throw new \Exception("No se encontraron resultados para el usuario.");
            }
            return [
                'nombre_user' => $queryJoinRespuestas[0]->nombre_user,
                'email'       => $queryJoinRespuestas[0]->email,
                'evaluacion'  => $queryJoinRespuestas[0]->evaluacion,
                'area'        => $queryJoinRespuestas[0]->nombre_area,
                'resultados'  => $queryJoinRespuestas[0]->resultados
            ];
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    private function pedirCarreras(int $id_user): array
    {
        try {
            $subqueryFecha = $this->db->table('test_respuestas')
                ->selectMax('fecha')
                ->where('id_user', $id_user)
                ->getCompiledSelect();

            $queryCarreras = $this->db->table('test_respuestas')
                ->select('test_carreras.nombre_carrera')
                ->join('test_carreras', 'test_carreras.id_area = test_respuestas.id_area')
                ->where('test_respuestas.id_user', $id_user)
                ->where("test_respuestas.fecha = ($subqueryFecha)", null, false)
                ->get()->getResultArray();

            if (empty($queryCarreras)) {
                throw new \Exception("No se encontraron resultados para el usuario.");
            }
            return [
                'carreras' => array_column($queryCarreras, 'nombre_carrera')
            ];
        } catch (\Throwable $th) {
            throw $th;
        }
    }
    private function pedirAreas(array $claves): array
    {
        try {
            $nombre_areas = $this->db->table('test_areas')->select('nombre_area')
                ->whereIn('id_area', $claves)
                ->get()->getResult();
            $areas = array_map(function ($area) {
                return $area->nombre_area;  // Accede a la propiedad 'nombre_area' de cada objeto
            }, $nombre_areas);

            if (empty($areas)) {
                throw new \Exception("No se encontraron resultados para el usuario.");
            }

            return $areas;
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}