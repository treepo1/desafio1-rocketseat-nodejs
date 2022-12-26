const express = require('express');
const cors = require('cors');
const errors = require("./errors.mjs");

const { v4: uuidv4 } = require('uuid');
const req = require('express/lib/request');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(user => user.username === username);

  if(!user) {
    response.status(400).json({error: errors.user.NOTFOUND})
  }

  request.user = user;

  return next()
}

app.post('/users', checksExistsUserAccount, (request, response) => {

  if(request.user) {
    return response.status(401).json({error:errors.user.ALREADYEXISTENT})
  }

  const { name, username } = request.body; 

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
  // Complete aqui
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;