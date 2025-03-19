<?php

namespace App\Controllers;


use App\Libraries\DatosGrafica;
use App\Libraries\GenerarImagen;
use CodeIgniter\RESTful\ResourceController;
use Config\Services;

class Imagen extends ResourceController
{
    protected DatosGrafica $datosGrafica;
    protected GenerarImagen $generarImagen;


    public function __construct()
    {
        $this->datosGrafica = Services::datosGrafica();
        $this->generarImagen = Services::generarImagen();
    }

    public function show($id_respuesta = null)
    {
        try {
            $datos = $this->datosGrafica->grafica($id_respuesta);
            $data = $datos['data'];
            $labels = $datos['labels'];
            $imageData = $this->generarImagen->generateImage($data, $labels);

            return $this->response->setHeader('Content-Type', 'image/jpg')
            ->setHeader('Content-Disposition', 'inline; filename="grafica.jpg"')
            ->setBody($imageData);
        } catch (\Throwable $th) {
            return $this->fail($th->getMessage(), 400);
        }
    }
}
