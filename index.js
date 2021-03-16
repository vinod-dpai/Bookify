const express = require('express');
const debug = require('debug')('app');
const chalk = require('chalk');
const path = require('path');
const axios = require('axios');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.set('views', path.join('src', 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(port, () => {
  debug(`litening on ${chalk.green(port)}`);
});
