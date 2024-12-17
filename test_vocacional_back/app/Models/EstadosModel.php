<?php
namespace App\Models;
use CodeIgniter\Model;

class EstadosModel extends Model
{
    protected $table = 'estados';
    protected $primaryKey = 'id_Estado';
    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    
    protected $allowedFields = [ 'Estado', 'Visible' ];
}