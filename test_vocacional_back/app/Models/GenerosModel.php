<?php
namespace App\Models;
use CodeIgniter\Model;

class GenerosModel extends Model
{
    protected $table = 'test_genero';
    protected $primaryKey = 'id_genero';
    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    
    protected $allowedFields = [ 'genero' ];
}