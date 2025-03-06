<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

$routes->group('testvc', ['filter' => 'cors'], static function (RouteCollection $routes): void {
    
    $routes->get('/', 'Home::index');

    $routes->resource('estados', ['controller' => 'EstadosController']);
    $routes->resource('generos', ['controller' => 'GenerosController']);
    $routes->resource('municipios', ['controller' => 'MunicipiosController']);
    $routes->resource('preguntas', ['controller' => 'PreguntasController']);
    $routes->resource('incisos', ['controller' => 'IncisosController']);

    $routes->resource('usuario', ['controller' => 'UserController']);
    $routes->post('pedirUsuario', 'UserController::obtenerUsuario');

    $routes->resource('respuestas', ['controller' => 'RespuestasController']);
    $routes->post('subirResultados/(:num)', 'RespuestasController::create/$1');
    
    $routes->resource('grafica', ['controller' => 'GraficaController']);
    $routes->resource('imagen',['controller' => 'Imagen']);
    $routes->post('email', 'EmailController::enviarCorreo');
    $routes->resource('email', ['controller' => 'EmailController']);

    $routes->options('(:any)', static function () {
        // Implement processing for normal non-preflight OPTIONS requests,
        // if necessary.
        $response = response();
        $response->setStatusCode(204);
        $response->setHeader('Allow:', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');

        return $response;
    });

});
