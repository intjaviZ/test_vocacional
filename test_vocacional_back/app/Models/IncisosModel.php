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

    public function getIncisos()
    {
        $incisos = $this->select('id_inciso, inciso, valor_inciso')->findAll();

        foreach ($incisos as &$inciso) {
            $inciso['valor_inciso'] = intval($inciso['valor_inciso']);
        }

        return $incisos;
    }
}