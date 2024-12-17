<?php
namespace App\Models;
use CodeIgniter\Model;
use Config\Services;

class PreguntasModel extends Model
{
    protected $table = 'test_preguntas';
    protected $primaryKey = 'id_pregunta';
    protected $useAutoIncrement = true;

    protected $returnType = 'array';
    
    protected $allowedFields = [ 'pregunta', 'id_area' ];

    public function getRandomPreguntas()
    {
        $db = Services::databaseConnect()->getConnection();
        $query = $db->query("SELECT id_pregunta, pregunta, id_area FROM {$this->table} ORDER BY RAND()");
        return $query->getResultArray();
    }
}