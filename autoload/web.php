<?php

    include('./route.php');


    // Route File
    // Route::method('url/{params}','controller@function');
    // Example:

    // 首頁
    Route::get('/','MainController@index');

    Route::get('/todos', 'TodoController@list_all');
    Route::get('/todos/{id}', 'TodoController@get');
    Route::post('/todos', 'TodoController@create');
    Route::post('/todos/{id}/success', 'TodoController@switchStatus');
    Route::patch('/todos/{id}', 'TodoController@update');
    Route::delete('/todos/{id}', 'TodoController@delete');

