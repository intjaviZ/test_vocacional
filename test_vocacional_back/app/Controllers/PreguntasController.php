<?php

namespace App\Controllers;

use App\Models\PreguntasModel;
use CodeIgniter\RESTful\ResourceController;

class PreguntasController extends ResourceController
{
    public function index()
    {
        $preguntasModel = new PreguntasModel();
        $preguntas = $preguntasModel->getRandomPreguntas();

        return $this->respond($preguntas);
    }
}
