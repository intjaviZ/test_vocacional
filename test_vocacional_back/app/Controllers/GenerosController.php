<?php
namespace App\Controllers;

use App\Models\GenerosModel;
use CodeIgniter\RESTful\ResourceController;

class GenerosController extends ResourceController
{
    public function index()
    {
        $generosModel = new GenerosModel();

        $generos = $generosModel->select('id_genero, genero')->where('id_status', 1)->findAll();

        return $this->respond($generos);
    }
}