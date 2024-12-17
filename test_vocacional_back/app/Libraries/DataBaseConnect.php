<?php

namespace App\Libraries;

use CodeIgniter\Database\BaseConnection;
use Config\Database;

class DataBaseConnect
{
    protected BaseConnection $db;

    public function __construct()
    {
        // Cargar la conexión predeterminada a la base de datos desde la configuración
        $this->db = Database::connect();
    }

    /**
     * Devuelve la instancia de la conexión a la base de datos.
    */
    public function getConnection(): BaseConnection
    {
        return $this->db;
    }
}
