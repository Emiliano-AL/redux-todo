import * as Redux from 'redux'
import { createStore, combineReducers } from 'redux'
// import { stat } from 'fs';

//nodes
let input = document.getElementById('input');
let lista = document.getElementById('lista');
let emailLst = document.getElementById('emailLst');
let addemail = document.getElementById('addEmail');
let todos = {
    0:{
        text: 'Ir al cine',
        done: false
    },
    1:{
        text: 'Cenar',
        done: true
    },
    2:{
        text: 'Dormir',
        done: false
    }
}

//fucntions
function drawEmails(){
    emailLst.innerHTML = "";
    //Actualizar los todos antes de dibujar
    let emails = store.getState().emails;
    emails.map (email => {
        let li = document.createElement('li');
        li.innerHTML = `<span>${email}</span>
                    <span id="${email}">X</span>`;
        setEmailClickListener(li);
        emailLst.appendChild(li);
    })
}

function setEmailClickListener(li){
    li.addEventListener('click', e =>{
        let email = e.target.id
        store.dispatch({
            type: 'DELETE_MAIL',
            email
        })
    })
}

function drawTodos(){
    lista.innerHTML = "";
    //Actualizar los todos antes de dibujar
    todos = store.getState().todos;

    for(let key in todos){
        let li = document.createElement('li');
        // li.id = key;
        let classDone = todos[key].done ? 'done': '';
        li.innerHTML = `
            <span id="${key}" class="${classDone}">${todos[key].text}</span>
            <span data-id=${key} data-action="delete">X</span>`;
        setListeners(li);
        lista.appendChild(li);
    }
}

function setListeners(li){
    li.addEventListener('click', e => {
        if(e.target.getAttribute('data-action') === 'delete'){
            let key = e.target.getAttribute('data-id');
            store.dispatch({
                type: 'DELETE_TODO',
                id: key
            })
            // delete todos[key];
            // drawTodos();
            return;
        }
        let key = e.target.id;
        todos[key].done = ! todos[key].done;
        store.dispatch({
            type: 'UPDATE_TODO',
            todo:  todos[key]
        })
        // todos[key].done = !todos[key].done;

        // drawTodos();
    })
}



//listeners
input.addEventListener('keydown', e =>{
    if(e.key === 'Enter'){
        let text = e.target.value;
        let todo = {text, done:false};
        store.dispatch({
            type: 'ADD_TODO',
            todo
        })

        // let id = Object.keys(todos).length;
        // todos[id] = {text, done:false};
        // drawTodos();
    }
});


addemail.addEventListener('keydown', e =>{
    if(e.key === 'Enter'){
        let email = e.target.value;
        store.dispatch({
            type: 'ADD_MAIL',
            email
        })
    }
})

/* REDUX */
// Segungo reducer 
function mailRaducer(state = {}, action){
    switch(action.type){
        case 'ADD_MAIL':
            return [ ...state, action.email]
        case 'DELETE_MAIL':
            return [...state.filter(mail => mail !== action.email )]
        default:
            return state;
    }
}

//reducer -- cambia los datos
function todosReducer(state = {}, action){
    switch(action.type){
        case 'ADD_TODO':
            action.todo["id"] = Object.keys(state).length;
            return { ...state, [Object.keys(state).length]: action.todo}
        case 'UPDATE_TODO':
            return { ...state, [action.todo.id]: action.todo}
        case 'DELETE_TODO':
            delete state[action.id]
            return {...state}
        default:
            return state;
    }
}

//Cobinar reducer
let rootReducer = combineReducers({
    todos: todosReducer,
    emails: mailRaducer
})

//store
let store = createStore(rootReducer, {
    emails:["email.20@mail.com"],
    todos:{
        0:{
            text: 'cenar',
            done:true,
            id:0
        }
    }
});

//Suatituir los todos
// todos = store.getState();

//Suscribe -- Que hacer cuando hay cambios 
store.subscribe(() => {
    drawTodos()
    drawEmails()
})

//initi
drawTodos();
drawEmails();