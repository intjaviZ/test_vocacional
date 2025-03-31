<?php

namespace App\Controllers;

use App\Transformers\UserTransformer;
use CodeIgniter\RESTful\ResourceController;

class UserController extends ResourceController
{
    protected $modelName = 'App\Models\UserModel';
    protected $format    = 'json';
    
    public function index()
    {
        $defaults['id_user'] = null;
        foreach ($this->model->allowedFields as $field) {
            switch ($field) {
                case 'id_estado':
                case 'id_ciudad':
                case 'id_genero':
                case 'test_completado':
                    $defaults[$field] = 0;
                    break;
                default:
                    $defaults[$field] = '';
                    break;
            }
        } //campos del modelo
        $defaults['permissions'] = false;
        return $this->respond($defaults);
    }

    public function create()
    {
        $dataUser = $this->request->getJSON(true);

        if (!is_array($dataUser)) return $this->failValidationErrors('Datos inválidos.');

        if (!$this->model->insert($dataUser)) {
            $errores = $this->model->errors();
            return $this->failValidationErrors($errores);
        }

        return $this->respond([
            'id_user' => $this->model->getInsertID(),
            'mensaje' => 'Listo para comenzar',
            'permissions' => true,
            'status' => 201
        ], 201);
    }

    public function obtenerUsuario()
    {
        $requestData = $this->request->getJSON();
        if (!isset($requestData->email)) {
            return $this->failValidationErrors('Ingresa un email');
        }

        $email = esc($requestData->email); // Protección contra inyección SQL
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->failValidationErrors('Email inválido.');
        }

        $user = $this->model->where('email', $email)->first();
        if (!$user) {
            return $this->failNotFound('No encontramos un usuario con este email.');
        }

        $filteredUser = UserTransformer::datosUsuario($this->model,$user);

        return $this->respond($filteredUser);
    }
    
}
