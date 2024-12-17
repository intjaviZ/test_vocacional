<?php

namespace App\Controllers;

use App\Libraries\DatosGrafica;
use CodeIgniter\RESTful\ResourceController;
use Config\Services;

require_once(APPPATH . 'ThirdParty/JpGraph/src/jpgraph.php');
require_once(APPPATH . 'ThirdParty/JpGraph/src/jpgraph_pie.php');

class EmailController extends ResourceController
{
    protected DatosGrafica $datosGrafica;

    public function __construct()
    {
        $this->datosGrafica = Services::datosGrafica();
    }

    public function index(int $id_user = NULL)
    {
        if (!empty($id_user)) {
            $dataCorreo = $this->datosGrafica->pedirDatos($id_user);

            if (isset($dataCorreo['data']) && isset($dataCorreo['labels'])) {
                $nombre = $dataCorreo['nombre'];
                $email = $dataCorreo['email'];
                $evaluacion = $dataCorreo['evaluacion'];
                $area = $dataCorreo['area'];
                $carreras = $dataCorreo['carreras'];
                $urlResultados = 'http://192.168.1.195:5173/resultados/' . $email;

                // $imagen = $this->generateImage($data, $labels);

                // Codificar la imagen en Base64
                // $base64Image = 'data:image/png;base64,' . base64_encode($imagen);

                // Leer la plantilla HTML
                $plantillaPath = APPPATH . 'Views/plantilla.html';
                if (file_exists($plantillaPath)) {
                    $htmlContent = file_get_contents($plantillaPath);

                    // Reemplazar el marcador con la imagen en Base64
                    // $htmlContent = str_replace('{{grafica}}', $base64Image, $htmlContent);

                    if (!empty($carreras)) {
                        $listaCarreras = '';
                        foreach ($carreras as $carrera) {
                            $listaCarreras .= '<li>' . htmlspecialchars($carrera) . '</li>';
                        }
                    } else {
                        $listaCarreras = '<li>No hay carreras disponibles.</li>';
                    }
                    $htmlContent = str_replace('{{carreras}}', $listaCarreras, $htmlContent);
                    $htmlContent = str_replace('{{nombre}}', $nombre, $htmlContent);
                    $htmlContent = str_replace('{{area}}', $area, $htmlContent);
                    $htmlContent = str_replace('{{interes}}', $evaluacion, $htmlContent);
                    $htmlContent = str_replace('{{resultados}}', $urlResultados, $htmlContent);

                    // Preparar los datos para cURL
                $url = 'http://187.188.173.10/mail/sendMailUnisur.php';
                $asunto = 'Resultados Test Vocacional | UNIVERSIDAD DEL SUR';
                $destinatario = $email; // Reemplaza con el email correcto

                $postData = [
                    'email' => $destinatario,
                    'asunto' => $asunto,
                    'mensaje' => $htmlContent,
                ];

                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($postData));
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

                $response = curl_exec($ch);
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

                // Validar la respuesta
                if ($httpCode === 200 && $response === 'OK') {
                    echo $htmlContent;
                } else {
                    echo "Falla al enviar. Código HTTP: $httpCode. Respuesta: $response";
                }
                exit;
                }
                // header('Content-Type: image/png');
                // echo $imagen;  // Mostrar la imagen generada
                // exit;
            } else {
           return $this->respond($dataCorreo['message'], 400);     
            }
        }
    }

    // private function generateImage(array $data, array $labels)
    // {
        
    //     $graph = new \PieGraph(500, 420);
    //     $graph->ClearTheme();
    //     $graph->SetMargin(0, 0, 0, 50);
    //     $p1 = new \PiePlot($data);
    //     $p1->SetLegends($labels);
    //     $p1->value->SetFont(FF_VERDANA, FS_NORMAL);
    //     $p1->value->SetColor("black");

        
    //     $colors = ["#e48a32", "#541b78", "#8537bc", "#b75d0d", "#913d13"];
    //     $p1->SetSliceColors($colors);
    //     $p1->SetCenter(0.5, 0.45);

    //     // Agregar el gráfico al lienzo
    //     $graph->Add($p1);

    //     // Posicionar la leyenda debajo del gráfico
    //     $graph->legend->SetColumns(2); // Mostrar 3 columnas (puedes ajustar el número según el espacio)
    //     $graph->legend->SetFrameWeight(0); // Quitar borde alrededor de la leyenda
    //     $graph->legend->SetPos(0.5, 0.95, 'center', 'bottom'); // Centrar la leyenda debajo del gráfico
    //     $graph->legend->SetFont(FF_VERDANA, FS_NORMAL, 8);

    //     // Crear un buffer de la imagen
    //     ob_start(); // Inicia el almacenamiento en búfer de salida
    //     $graph->Stroke(); // Esto genera la imagen en el búfer de salida

    //     // Obtener el contenido del búfer (la imagen generada)
    //     $imageData = ob_get_contents();

    //     ob_end_clean(); // Limpiar el búfer de salida

    //     return $imageData; // Devolver la imagen generada
    // }
}
