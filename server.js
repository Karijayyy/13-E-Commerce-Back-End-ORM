const express = require('express');
const routes = require('./routes');
// import sequelize connection & env 
const mysql2 = require('mysql2');
const dotenv = require('dotenv');

//require connection
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server

  sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
  });