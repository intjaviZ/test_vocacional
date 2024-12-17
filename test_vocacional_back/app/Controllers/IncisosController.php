<?php

namespace App\Controllers;

use App\Models\IncisosModel;
use CodeIgniter\RESTful\ResourceController;

class IncisosController extends ResourceController
{
    public function index()
    {
        $incisosModel = new IncisosModel();
        $incisos = $incisosModel->select('id_inciso, inciso, valor_inciso')->findAll();;

        return $this->respond($incisos);
    }
}
