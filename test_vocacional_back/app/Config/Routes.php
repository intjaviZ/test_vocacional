<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

$routes->group('testvc', ['filter' => 'cors'], static function (RouteCollection $routes): void {
    
    $routes->get('/', 'Home::index');
    $routes->get('pedirEstados', 'EstadosController::index');
    $routes->get('pedirGeneros', 'GenerosController::index');
    $routes->get('pedirCiudades/(:num)', 'MunicipiosController::index/$1');
    $routes->get('pedirPreguntas', 'PreguntasController::index');
    $routes->get('pedirIncisos', 'IncisosController::index');

    $routes->get('modelUser', 'UserController::index');
    $routes->get('modelRespuestas', 'RespuestasController::index');
    $routes->get('modelResultados', 'RespuestasController::obtenerEstructura');
    
    
    $routes->get('pedirResultados/(:num)', 'RespuestasController::show/$1');
    $routes->get('pedirGrafica/(:num)', 'GraficaController::index/$1');
    $routes->get('piechart/(:num)', 'EmailController::index/$1');

    $routes->post('pedirUser', 'UserController::getUser');
    $routes->post('crearUser', 'UserController::create');
    $routes->post('subirResultados/(:num)', 'RespuestasController::create/$1');

    $routes->options('(:any)', static function () {
        // Implement processing for normal non-preflight OPTIONS requests,
        // if necessary.
        $response = response();
        $response->setStatusCode(204);
        $response->setHeader('Allow:', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');

        return $response;
    });

});
