<?php
namespace App\Controllers;

use App\Models\EstadosModel;
use CodeIgniter\RESTful\ResourceController;

class EstadosController extends ResourceController 
{
    public function index()
    {
        $estadoModel = new EstadosModel();

        // Obtenemos todos los registros de la tabla 'estados'
        $estados = $estadoModel->select('id_Estado, Estado')->where('visible', 1)->findAll(); // findAll() obtiene todos los registros de la tabla

        // Retornamos los resultados como una respuesta JSON
        return $this->respond($estados);
    }
}