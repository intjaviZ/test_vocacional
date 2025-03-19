<?php

namespace App\Controllers;

use App\Libraries\DatosGrafica;
use CodeIgniter\RESTful\ResourceController;
use Config\Services;

class GraficaController extends ResourceController
{
    protected DatosGrafica $datosGrafica;

    public function __construct()
    {
        $this->datosGrafica = Services::datosGrafica();
    }

    public function show($id_respuesta = null)
    {
        try {
            if (empty($id_respuesta)) {
                return $this->failNotFound('no logramos obtener datos que generen una respuesta', 404);
            }
            $usuario = $this->datosGrafica->usuario($id_respuesta);
            $datos = $this->datosGrafica->grafica($id_respuesta);
    
            $response = [
                'usuario' => $usuario,
                'datos'   => $datos
            ];
            return $this->respond($response, 200);
        } catch (\Throwable $th) {
            return $this->failNotFound('Error: ' . $th->getMessage(), '404');
        }
    }
}
