require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

const uuid = require('uuid/v4');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

const addresses = [];

app.get('/address', (req, res) => {
  res.json({ addresses });
});

app.post('/address', (req, res) => {
  const { firstName, lastName, address1, address2='', city, state, zip } = req.body;

  if(!firstName) {
    res.status(400).send('First name is required');
  }

  if(!lastName) {
    res.status(400).send('Last name is required');
  }

  if(!address1) {
    res.status(400).send('Address 1 is required');
  }

  if(!city) {
    res.status(400).send('City is required');
  }

  if(!state) {
    res.status(400).send('State is required');
  }

  if(!zip) {
    res.status(400).send('Zip is required');
  }

  if(state.length !== 2) {
    res.status(400).send('State must be 2 characters');
  }

  const numZip = Number.parseFloat(zip);

  if(zip.length !== 5 || Number.isNaN(numZip)) {
    res.status(400).send('Zip must be a 5 digit number');
  }

  const id = uuid();
  const newAddress = {
    id,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    numZip
  };

  addresses.push(newAddress);

  res
    .status(201)
    .location(`http://localhost:8000/address/${id}`)
    .json({id: id});
});

app.use((error, req, res, next) => {
  let response;
  if(NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;