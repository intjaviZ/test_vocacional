<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Libraries\DatosGrafica;
use Config\Services;

class EmailController extends ResourceController
{
    protected DatosGrafica $datosGrafica;

    public function __construct()
    {
        $this->datosGrafica = Services::datosGrafica();
    }
    private function idValido(int $id): bool
    {
        if (empty($id)) return false;
        if (!is_numeric($id) || (int)$id != $id) return false;
        if ($id <= 0) return false;

        return true;
    }

    public function enviarCorreo()
    {
        try {
            $id_respuesta = $this->request->getJSON(true);
            if (empty($id_respuesta) || !is_array($id_respuesta) || !isset($id_respuesta['id'])) {
                throw new \Exception("No pudimos enviar tu información.");
            }

            $id = $id_respuesta['id'];
            if (!$this->idValido($id)) {
                throw new \Exception("No pudimos enviar el correo.");
            }

            $dataCorreo = $this->datosGrafica->correo($id);
            $plantilla = $this->prepararPlantilla($dataCorreo, $id);
            // comentado para evitar sobrecarga del servicio en pruebas
            // $destinatario = $dataCorreo['email'];
            // $enviado = $this->prepararCorreo($destinatario, $plantilla);
            // if (!$enviado) {
            //     throw new \Exception("Error en el envío del correo");
            // }
            if (!$this->actualizarStatus(($id))) {
                throw new \Exception("Ocurrió un problema inesperado");
            }

            return $this->respond([
                "enviado" => true
            ], 200);
        } catch (\Throwable $th) {
            return $this->fail($th->getMessage(), 400);
        }
    }

    private function prepararPlantilla(array $datosCorreo, int $id_respuesta): string
    {
        try {
            $nombre = $datosCorreo['nombre'];
            $evaluacion = $datosCorreo['evaluacion'];
            $area = $datosCorreo['area'];
            $carreras = $datosCorreo['carreras'];
            $urlImagen = 'https://kenya-rhythm-designs-handled.trycloudflare.com/testvc/imagen/' . $id_respuesta;
            $urlResultados = 'https://helena-ceiling-improvements-expert.trycloudflare.com/reingresar';

            $plantillaPath = APPPATH . 'Views/plantilla.html';
            if (!file_exists($plantillaPath)) {
                throw new \Exception("Ocurrió un problema.");
            }

            $htmlContent = file_get_contents($plantillaPath);

            if (empty($carreras)) {
                $listaCarreras = '<li>No hay carreras disponibles.</li>';
            } else {
                $listaCarreras = '';
                foreach ($carreras as $carrera) {
                    $listaCarreras .= '<li>' . htmlspecialchars($carrera) . '</li>';
                }
            }


            $htmlContent = str_replace('{{nombre}}', $nombre, $htmlContent);
            $htmlContent = str_replace('{{area}}', $area, $htmlContent);
            $htmlContent = str_replace('{{interes}}', $evaluacion, $htmlContent);
            $htmlContent = str_replace('{{urlImagen}}', $urlImagen, $htmlContent);
            $htmlContent = str_replace('{{carreras}}', $listaCarreras, $htmlContent);
            $htmlContent = str_replace('{{resultados}}', $urlResultados, $htmlContent);

            return $htmlContent;
        } catch (\Throwable $th) {
            throw new \Exception($th->getMessage());
        }
    }

    private function prepararCorreo($destinatario, $contenido): bool
    {
        $url = 'http://187.188.173.10/mail/sendMailUnisur.php';
        $asunto = 'Resultados Test Vocacional | UNIVERSIDAD DEL SUR';

        $postData = [
            'email' => $destinatario,
            'asunto' => $asunto,
            'mensaje' => $contenido,
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200 || $response === 'OK') {
            return true;
        } else {
            return false;
        }
    }

    private function actualizarStatus(int $id_respuesta)
    {
        try {
            $model = new \App\Models\RespuestasModel();
            return $model->actualizarStatus($id_respuesta);
        } catch (\Throwable $th) {
            return false;
        }
    }
}
