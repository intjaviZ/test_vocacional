<?php
namespace App\Controllers;

use App\Models\MunicipiosModel;
use CodeIgniter\RESTful\ResourceController;

class MunicipiosController extends ResourceController 
{
    public function index($id_estado = null)
    {
        $municipiosModel = new MunicipiosModel();

        if ($id_estado) {
            $municipios = $municipiosModel->select('id_municipio, municipio')
            ->where('id_estado', $id_estado)
            ->findAll();
            return $this->respond($municipios);
        }
        // Retornamos los resultados como una respuesta JSON
        return $this->failNotFound('id_estado es requerido');
    }
}