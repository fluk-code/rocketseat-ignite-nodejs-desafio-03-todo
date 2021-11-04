const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksExistsRepositorie(request, response, next) {
  const { id } = request.params

  const repository = repositories.find(repository => repository.id === id)
  if (!repository) {
    return response.status(404).json({ error: "Repository not found" })
  }

  request.repository = repository
  return next()
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository)

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checksExistsRepositorie, (request, response) => {
  const { repository } = request;
  const { title, url, techs } = request.body;

  if(repository.likes > 0) {
    return response.status(404).json({ error: "Repository has like" })
  }

  repository.title = title
  repository.url = url
  repository.techs = techs

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", checksExistsRepositorie, (request, response) => {
  const { repository } = request

  const repositoryIndex = repositories.indexOf();
  repositories.splice(repositoryIndex, 1);

  return response.status(204).end();
});

app.post("/repositories/:id/like", checksExistsRepositorie, (request, response) => {
  const { repository } = request

  repository.likes++

  return response.status(200).json(repository);
});

module.exports = app;

