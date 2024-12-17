<?php
namespace App\Models;
use CodeIgniter\Model;

class IncisosModel extends Model
{
    protected $table = 'test_incisos';
    protected $primaryKey = 'id_inciso';
    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    
    protected $allowedFields = [ 'inciso', 'valor_inciso' ];

}