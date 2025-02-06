<?php

namespace App\Controllers;

use App\Models\IncisosModel;
use CodeIgniter\RESTful\ResourceController;

class IncisosController extends ResourceController
{
    public function index()
    {
        $incisosModel = new IncisosModel();
        $incisos = $incisosModel->getIncisos();

        return $this->respond($incisos);
    }
}
