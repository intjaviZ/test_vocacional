<?php
namespace App\Controllers;

use App\Models\MunicipiosModel;
use CodeIgniter\RESTful\ResourceController;

class MunicipiosController extends ResourceController 
{
    public function show($id_estado = null)
    {
        $municipiosModel = new MunicipiosModel();
        if (!$id_estado || $id_estado > 32) {
            return $this->failNotFound('estado invalido');
        }

        $municipios = $municipiosModel->select('id_municipio, municipio')
        ->where('id_estado', $id_estado)->where('visible', 1)->findAll();
        return $this->respond($municipios);
    }
}