<?php

namespace Config;

use App\Libraries\DataBaseConnect;
use App\Libraries\DatosGrafica;
use App\Libraries\GenerarImagen;
use CodeIgniter\Config\BaseService;

/**
 * Services Configuration file.
 *
 * Services are simply other classes/libraries that the system uses
 * to do its job. This is used by CodeIgniter to allow the core of the
 * framework to be swapped out easily without affecting the usage within
 * the rest of your application.
 *
 * This file holds any application-specific services, or service overrides
 * that you might need. An example has been included with the general
 * method format you should use for your service methods. For more examples,
 * see the core Services file at system/Config/Services.php.
 */
class Services extends BaseService
{
    /*
     * public static function example($getShared = true)
     * {
     *     if ($getShared) {
     *         return static::getSharedInstance('example');
     *     }
     *
     *     return new \CodeIgniter\Example();
     * }
     */

    public static function databaseConnect(bool $getShared = true) : DataBaseConnect
    {
        if ($getShared) {
            return static::getSharedInstance('databaseConnect');
        }
        return new DataBaseConnect();
    }
    public static function datosGrafica(bool $getShared = true) : DatosGrafica
    {
        if ($getShared) {
            return static::getSharedInstance('datosGrafica');
        }
        return new DatosGrafica();
    }
    public static function generarImagen(bool $getShared = true) : GenerarImagen
    {
        if ($getShared) {
            return static::getSharedInstance('generarImagen');
        }
        return new GenerarImagen();
    }
}
