<?php
namespace App\Controllers;

use App\Models\EstadosModel;
use CodeIgniter\RESTful\ResourceController;

class EstadosController extends ResourceController 
{
    public function index()
    {
        $estadoModel = new EstadosModel();
        $estados = $estadoModel->select('id_Estado, Estado')->where('visible', 1)->findAll();

        return $this->respond($estados);
    }
}