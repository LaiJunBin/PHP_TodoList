<?php

    include_once('app/Todo.php');

    function list_all(){
        $todos = Todo::get();
        return Response()->json($todos);
    }

    function get($id){
        $todo = Todo::find(['id' => $id]);
        if($todo == null)
            return Response()->json([
                'status' => false,
                'message' => '找不到代辦事項!',
                'data' => ''
            ])->code(404);

        return Response()->json([
            'status' => true,
            'message' => '',
            'data' => $todo
        ]);
    }

    function create($request){
        $data = $request->json();

        try {
            Todo::create([
                'item' => $data['item']
            ]);
        } catch (Exception $e) {
            return Response()->json([
                'status' => false,
                'message' => '新增失敗!',
                'data' => ''
            ])->code(401);
        }

        return Response()->json([
            'status' => true,
            'message' => '',
            'data' => ''
        ]);
    }

    function update($request, $id){
        $data = $request->json();

        if(!Todo::contains(['id' => $id]))
            return Response()->json([
                'status' => false,
                'message' => '找不到代辦事項!',
                'data' => ''
            ])->code(404);

        try {
            Todo::update([
                'item' => $data['item']
            ], [
                'id' => $id
            ]);
        } catch (Exception $e) {
            return Response()->json([
                'status' => false,
                'message' => '修改失敗!',
                'data' => ''
            ])->code(401);
        }

        return Response()->json([
            'status' => true,
            'message' => '',
            'data' => ''
        ]);
    }

    function delete($request, $id){

        if(!Todo::contains(['id' => $id]))
            return Response()->json([
                'status' => false,
                'message' => '找不到代辦事項!',
                'data' => ''
            ])->code(404);

        Todo::delete(['id' => $id]);
        return Response()->json([
            'status' => true,
            'message' => '',
            'data' => ''
        ]);
    }

    function switchStatus($id){
        $todo = Todo::find(['id' => $id]);
        if($todo == null)
            return Response()->json([
                'status' => false,
                'message' => '找不到代辦事項!',
                'data' => ''
            ])->code(404);

        Todo::update([
            'is_success' => !$todo['is_success']
        ], [
            'id' => $id
        ]);

        return Response()->json([
            'status' => true,
            'message' => '',
            'data' => ''
        ]);
    }