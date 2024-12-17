<?php
namespace App\Models;
use CodeIgniter\Model;

class MunicipiosModel extends Model
{
    protected $table = 'municipio';
    protected $primaryKey = 'id_municipio';
    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    
    protected $allowedFields = [ 'municipio', 'id_estado' ];
}