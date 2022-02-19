const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find(
    user => user.username === username
  );

  if(!user){
    response.status(400).json({error: "Username not found"});
  }

  return next();
}

app.post('/users', (request, response) => {
  const {name, username} = request.body;
  
  const usernameExist = users.some(
    (user) =>  user.username === username
  );

  if(usernameExist){
    return response.status(400).json({error: "Username already exists!"});
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: []
  });

  const userInsert = users.find(user => user.username == username);

  return response.status(200).json(userInsert);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request.headers;

  const userSearch =  users.find(user => user.username === username);
  return response.status(200).json(userSearch.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline} = request.body;
  const {username} = request.headers;

  const userUpdateTodos =  users.find(user => user.username === username);

  userUpdateTodos.todos.push({
    id: uuidv4(),
	  title,
	  done: false, 
	  deadline: new Date(deadline), 
	  created_at: new Date()
  })

  return response.status(200).json(userUpdateTodos);
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