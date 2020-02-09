// var express = require('express');
import express from "express";
var app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send("<h1>Xin Chao Cac Ban</h1>");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
