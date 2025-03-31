<?php
namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table = 'test_user';
    protected $primaryKey = 'id_user';
    protected $useAutoIncrement = true;

    protected $returnType     = 'array';
    protected $useSoftDeletes = false;

    protected $allowedFields = [
        'nombre_user',
        'apellido_paterno',
        'apellido_materno',
        'email',
        'telefono',
        'id_estado',
        'id_ciudad',
        'id_genero',
        'test_completado'
    ];

    protected bool $allowEmptyInserts = false;
    protected bool $updateOnlyChanged = true;

    // validationRules no añadido pero si lo tengo
    protected $validationRules      = [
        'nombre_user'      => 'required|string|min_length[3]|max_length[25]',
        'apellido_paterno' => 'required|string|min_length[3]|max_length[25]',
        'apellido_materno' => 'required|string|min_length[3]|max_length[25]',
        'email'            => 'required|valid_email|max_length[50]|is_unique[test_user.email]',
        'telefono'         => 'required|numeric|exact_length[10]',
        'id_estado'        => 'required|numeric',
        'id_ciudad'        => 'required|numeric',
        'id_genero'        => 'required|numeric'
    ];

    protected $validationMessages = [
        'nombre_user' => [
            'required'   => 'El nombre es obligatorio.',
            'string'     => 'El nombre debe ser una cadena de caracteres.',
            'min_length' => 'El nombre debe tener al menos {param} caracteres.',
            'max_length' => 'El nombre no puede exceder los {param} caracteres.'
        ],
        'apellido_paterno' => [
            'required'   => 'El apellido paterno es obligatorio.',
            'string'     => 'El apellido paterno debe ser una cadena de caracteres.',
            'min_length' => 'El apellido paterno debe tener al menos {param} caracteres.',
            'max_length' => 'El apellido paterno no puede exceder los {param} caracteres.'
        ],
        'apellido_materno' => [
            'required'   => 'El apellido materno es obligatorio.',
            'string'     => 'El apellido materno debe ser una cadena de caracteres.',
            'min_length' => 'El apellido materno debe tener al menos {param} caracteres.',
            'max_length' => 'El apellido materno no puede exceder los {param} caracteres.'
        ],
        'email' => [
            'required'   => 'El correo electrónico es obligatorio.',
            'valid_email' => 'El correo electrónico debe ser válido.',
            'max_length' => 'El correo electrónico no puede exceder los {param} caracteres.',
            'is_unique'  => 'Este correo ya fue usado antes.'
        ],
        'telefono' => [
            'required'   => 'El número de teléfono es obligatorio.',
            'numeric'    => 'El número de teléfono debe contener solo números.',
            'exact_length' => 'El número de teléfono debe tener exatcamente 10 digitos'
        ],
        'id_estado' => [
            'required'   => 'El estado es obligatorio.',
            'numeric'    => 'El estado debe ser un número válido.'
        ],
        'id_ciudad' => [
            'required'   => 'La ciudad es obligatoria.',
            'numeric'    => 'La ciudad debe ser un número válido.'
        ],
        'id_genero' => [
            'required'   => 'El género es obligatorio.',
            'numeric'    => 'El género debe ser un número válido.'
        ]
    ];
    
    protected $skipValidation       = false;
    protected $cleanValidationRules = true;


    /**
     * Verifica si un id_user existe.
     *
     * @param int|null $idUser
     * @return bool
     */
    public function exists(?int $idUser): bool
    {
        return $this->where('id_user', $idUser)->where('id_status', 1)->first() !== null;
    }
}