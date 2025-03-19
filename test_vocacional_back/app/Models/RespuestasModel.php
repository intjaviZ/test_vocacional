<?php
namespace App\Models;
use CodeIgniter\Model;
use Config\Services;

class RespuestasModel extends Model
{
    protected $table = 'test_respuestas';
    protected $primaryKey = 'id_respuesta';
    protected $useAutoIncrement = true;

    protected $returnType     = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = [
        'id_user',
        'resultados',
        'id_area',
        'puntos',
        'id_evaluacion',
        'id_status'
    ];
    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    protected $validationRules = [
        'id_user'       => 'required|integer',
        'resultados'    => 'required|valid_json',
        'id_area'       => 'required|integer',
        'puntos'        => 'required|integer|greater_than[0]|less_than_equal_to[32]',
        'id_evaluacion' => 'required|integer|greater_than[0]|less_than_equal_to[3]'
    ];

    protected $validationMessages = [
        'id_user' => [
            'required' => 'El campo "id_user" es obligatorio.',
            'integer'  => 'El campo "id_user" debe ser un número entero.',
        ],
        'resultados' => [
            'required'    => 'El campo "resultados" es obligatorio.',
            'valid_json'  => 'El campo "resultados" debe contener un JSON válido.',
        ],
        'id_area' => [
            'required' => 'El campo "id_area" es obligatorio.',
            'integer'  => 'El campo "id_area" debe ser un número entero.',
        ],
        'puntos' => [
            'required'             => 'El campo "puntos" es obligatorio.',
            'integer'              => 'El campo "puntos" debe ser un número entero.',
            'greater_than'         => 'El campo "puntos" debe ser mayor que 0.',
            'less_than_equal_to'   => 'El campo "puntos" no debe exceder 32.',
        ],
        'id_evaluacion' => [
            'required'             => 'El campo "id_evaluación" es obligatorio.',
            'integer'              => 'El campo "id_evaluación" debe ser un número entero.',
            'greater_than'         => 'El campo "id_evaluación" debe ser mayor que 0.',
            'less_than_equal_to'   => 'El campo "id_evaluación" no debe exceder 3.',
        ],
    ];
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;

    public function actualizarStatus(int $id_respuesta) {
        $db = Services::databaseConnect()->getConnection();
        return $db->table('test_respuestas')
        ->where('id_respuesta', $id_respuesta)
        ->update(['id_status' => 3]);
    }
}