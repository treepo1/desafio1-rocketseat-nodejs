const express = require('express');
const cors = require('cors');
const errors = require("./errors.js");

const { v4: uuidv4 } = require('uuid');
const req = require('express/lib/request');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  request.user = user;

  return next()
}

app.post('/users', checksExistsUserAccount, (request, response) => {

  const { name, username } = request.body; 

  const userExists = users.some(user => user.username === username)

  if(request.user || userExists) {
    response.status(400).json({error:errors.user.ALREADYEXISTENT})
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(newUser);

  response.status(201).json(newUser)

});


app.get('/todos', checksExistsUserAccount, (request, response) => {
  const user = request.user

  response.json(user.todos)

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  const user = request.user;

  user.todos.push(todo);

  response.status(201).json(todo)


});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { id } = request.params;
  const { title, deadline }  = request.body;

  const user = request.user;

  const todo = user.todos.find(todo => todo.id === id)

  if(!todo) {
    response.status(404).json({error: errors.todos.NOTFOUND})
  }

  if(title) todo.title = title;
  if(deadline) todo.deadline = deadline;

  response.json(todo) 



});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {

  const user = request.user;

  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id)

  if(!todo) {
    response.status(404).json({error: errors.todos.NOTFOUND})
  }

  todo.done = true;

  response.status(200).json(todo);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const user = request.user;

  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id)

  if(!todo) {
    response.status(404).json({error: errors.todos.NOTFOUND})
  }

  user.todos = user.todos.filter(todo => todo.id !== id);

  response.status(204).send();
});

module.exports = app;