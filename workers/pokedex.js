const express = require("express");
const bodyParser = require("body-parser");
const pokedex = require("./pokedex.json");
const Fuse = require('fuse.js');

const app = express();
app.use(bodyParser.json());

const { POKEDEX_PAGE_SIZE } = process.env;

const search = q => {
  const fuse = new Fuse(pokedex, {
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ["name.english", "name.japanese", "name.chinese", "type"]
  });
  return fuse.search(q);
};

app.get("/", (req, res) => {
  const start = ((req.query.page || 1) - 1) * POKEDEX_PAGE_SIZE;
  let list = [];
  if (req.query.q) {
    list = search(req.query.q).slice(start, start + POKEDEX_PAGE_SIZE);
  } else {
    list = pokedex.slice(start, start + POKEDEX_PAGE_SIZE);
  }
  res.json(list);
});

app.listen(3002, () => console.log("Pokedex service listening on 3002"));
