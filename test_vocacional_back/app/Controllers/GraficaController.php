<?php

namespace App\Controllers;

use App\Libraries\DataBaseConnect;
use App\Libraries\DatosGrafica;
use CodeIgniter\RESTful\ResourceController;
use Config\Services;

class GraficaController extends ResourceController
{
    protected DataBaseConnect $databaseConnect;
    protected DatosGrafica $datosGrafica;
    protected $db;

    public function __construct()
    {
        $this->databaseConnect = Services::databaseConnect();
        $this->db = $this->databaseConnect->getConnection();
        $this->datosGrafica = Services::datosGrafica();
    }

    public function index(int $id_user = NULL)
    {
        if (!empty($id_user)) {
            $datos = $this->datosGrafica->pedirDatos($id_user);

            return $this->respond($datos,200);
        } else {
            return $this->failNotFound('no logramos obtener datos que generen una respuesta','404');
        }
    }
}
