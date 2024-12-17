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
        $userModelJson = [
            'id_user'          => null,
            'nombre_user'      => '',
            'apellido_paterno' => '',
            'apellido_materno' => '',
            'email'            => '',
            'telefono'         => '',
            'id_estado'        => 0,
            'id_ciudad'        => 0,
            'id_genero'        => 0,
            'permissions'      => false,
        ];
        return $this->respond($userModelJson,200);
    }

    public function create()
    {
        $dataUser = $this->request->getJSON(true);

        if (!is_array($dataUser)) {
            return $this->failValidationErrors('Datos inválidos.');
        }

        if (!$this->model->insert($dataUser)) {

            $errors = $this->model->errors();

            if (isset($errors['email']) &&  $errors['email'] === 'El correo electrónico ya está registrado en el sistema.') {
                return $this->respond([
                    'mensaje' => 'Tu usuario ya ha sido creado antes',
                    'permissions' => false
                ], 400);
            }
            return $this->failValidationErrors($errors);
        }
        return $this->respond([
            'id_user' => $this->model->getInsertID(),
            'mensaje' => 'Tu usuario ha sido creado',
            'permissions' => true,
            'status' => 200
        ], 200);
    }

    public function show($email = null)
    {
        // Busca el usuario por email
        $user = $this->model->where('email', $email)->first();

        // Si no se encuentra, devuelve un error 404
        if (!$user) {
            return $this->failNotFound('No encontramos un usuario con este email.');
        }

        $filteredUser = UserTransformer::transform($user);

        return $this->respond($filteredUser);
    }
}
