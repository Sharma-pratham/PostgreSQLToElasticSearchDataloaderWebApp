const path = require('path');
const fs = require('fs');
const { Client } = require('@elastic/elasticsearch');

const certificatePath = 'C:\\Users\\sharm\\http_ca.crt';

const client = new Client({
  node: 'https://localhost:9200/',
  auth: {
    username: "elastic",
    password: "PQmdgFOR-TnVlRgC+rKv"
  },
  tls: {
    ca: fs.readFileSync(certificatePath),
    rejectUnauthorized: false // Be cautious with this in production
  }
});

module.exports = client;
