<?php
namespace App\Transformers;
use CodeIgniter\Model;

class UserTransformer
{
    public static function datosUsuario(Model $model, array $data): array
    {
        $allowedFields = $model->allowedFields;

        $filtered = [];
        $filtered['id_user'] = $data['id_user'];

        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $data)) {
                $filtered[$field] = $data[$field];
            }
        }

        $filtered['permissions'] = true;

        return $filtered;
    }
}
