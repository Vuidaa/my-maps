<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/','AppController@home');

//Markers
Route::get ('marker',			 'AppController@index'  );
Route::post('marker',			 'AppController@store'  );
Route::get ('marker/{id}',       'AppController@show'   );
Route::get ('marker/delete/{id}','AppController@destroy');

