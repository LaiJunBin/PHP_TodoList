// JavaScript File

$(function () {

    const items_div = document.getElementById('items');
    const form_item = document.getElementById('form_item');
    const updateItemModal = document.getElementById('updateItemModal');
    const form_update_item = updateItemModal.querySelector('#form_update_item')
    const form_update_id = updateItemModal.querySelector('#form_update_id')

    function getTodos() {
        return fetch('/todos').then(res => res.json());
    }

    function getTodo(id) {
        return fetch(`/todos/${id}`).then(res => res.json());
    }

    function createTodo(item) {
        return fetch('/todos', {
            method: 'POST',
            body: JSON.stringify({
                item
            })
        }).then(res => res.json());
    }

    function updateTodo(id, item) {
        return fetch(`/todos/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                item
            })
        }).then(res => res.json());
    }

    function deleteTodo(id) {
        return fetch(`/todos/${id}`, {
            method: 'DELETE',
        }).then(res => res.json());
    }

    function switchTodoStatus(id) {
        return fetch(`/todos/${id}/success`, {
            method: 'POST',
        }).then(res => res.json());
    }

    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }

    function appendTodo(todo) {
        todo['is_success'] = todo['is_success'] == 1;
        let item_div = createElementFromHTML(`
                    <div class="item ${todo['is_success']==1?'item-success':''}" data-id="${todo['id']}">
                        <h4 class="card-title">ID: ${todo['id']}</h4>
                        <p class="card-text">${todo['item']}</p>
                        <p class="card-text">建立於:${todo['created_at']}</p>
                        <button class="btn btn-${todo['is_success']==1?'secondary':'success'} switch-status-btn">${todo['is_success']==1?'Cancel':'Success'}</button>
                        <button class="btn btn-warning update-btn">Update</button>
                        <button class="btn btn-danger delete-btn">Delete</button>
                    </div>
                `);

        item_div.querySelector('.switch-status-btn').addEventListener('click', function () {
            switchTodoStatus(todo['id']).then(res => {
                todo['is_success'] = !todo['is_success'];
                this.classList.remove('btn-success');
                this.classList.remove('btn-secondary');
                this.classList.add(todo['is_success'] == 1 ? 'btn-secondary' : 'btn-success');
                this.innerText = todo['is_success'] == 1 ? 'Cancel' : 'Success';

                if (!todo['is_success'])
                    item_div.classList.remove('item-success');
                else
                    item_div.classList.add('item-success');

            }).catch(err => {
                console.log(err);
            });
        });

        item_div.querySelector('.delete-btn').addEventListener('click', function () {
            deleteTodo(todo['id']).then(res => {
                items_div.removeChild(item_div);
                if (items_div.children.length == 0)
                    items_div.innerHTML = `<div class="alert alert-warning">沒有代辦事項</div>`;
            }).catch(err => {
                console.log(err);
            });
        });

        item_div.querySelector('.update-btn').addEventListener('click', function () {
            form_update_item.value = todo['item'];
            form_update_id.value = todo['id'];
            $(updateItemModal).modal();
        });

        items_div.appendChild(item_div);
    }

    async function renderTodos() {
        getTodos().then(todos => {
            if (todos.length > 0)
                items_div.innerHTML = '';
            todos.forEach(todo => {
                appendTodo(todo);
            });
        });
    }

    document.getElementById('addTodoBtn').addEventListener('click', function () {
        let item = form_item.value;
        if (item === '')
            return;

        form_item.value = "";

        createTodo(item).then(res => {
            renderTodos();
        }).catch(err => {
            console.log(err);
        })
    });

    document.getElementById('saveItemButton').addEventListener('click', function () {
        let item = form_update_item.value;
        let id = form_update_id.value;

        if (item === '')
            return;

        form_update_item.value = '';

        updateTodo(id, item).then(res => {
            items_div.querySelector(`[data-id="${id}"]`).querySelector('.card-text').innerText = item;
            $(updateItemModal).modal('hide');
        }).catch(err => {
            console.log(err);
        })
    });

    document.getElementById('searchTodoBtn').addEventListener('click', function () {
        let id = document.getElementById('form_item_id').value;

        if (id === '')
            return;

        getTodo(id).then(res => {
            if (res.status) {
                document.getElementById('cancalSearchTodoBtn').disabled = false;
                items_div.innerHTML = '';
                appendTodo(res.data);
            } else {
                items_div.innerHTML = `<div class="alert alert-warning">${res['message']}</div>`;
            }
        }).catch(err => {
            console.log(err);
        })
    });

    document.getElementById('cancalSearchTodoBtn').addEventListener('click', function () {
        renderTodos().then(() => {
            this.disabled = true;
        });
    });

    renderTodos();
});