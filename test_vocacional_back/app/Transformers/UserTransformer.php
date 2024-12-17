<?php
namespace App\Transformers;

class UserTransformer
{
    public static function transform(array $user): array
    {
        return [
            'id_user'          => $user['id_user'],
            'nombre_user'      => $user['nombre_user'],
            'apellido_paterno' => $user['apellido_paterno'],
            'apellido_materno' => $user['apellido_materno'],
            'email'            => $user['email'],
            'telefono'         => $user['telefono'],
            'id_estado'        => $user['id_estado'],
            'id_ciudad'        => $user['id_ciudad'],
            'id_genero'        => $user['id_genero'],
            'permissions'      => true,
        ];
    }
}
