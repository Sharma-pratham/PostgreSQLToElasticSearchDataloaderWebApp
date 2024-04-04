//header imports
const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require("body-parser");
const cors = require('cors');



//file imports
const companiesRoutes = require('./routes/companiesRoutes')
const contactsRoutes = require('./routes/contactsRoutes')
const elasticRoutes = require('./routes/elasticRoutes')


//express app starup
const app = express()

//Prerequisistes
app.use(express.json())
app.use(bodyParser.json()); 
app.use(cors());


//routes
app.use('/api/companies',companiesRoutes)
app.use('/api/contacts',contactsRoutes)
app.use('/api/elastic',elasticRoutes)


//get request to root
app.get('/', (request, response) => {
    response.json({ info: 'A project to see postgreSQL in action with elasticsearch' })
  })

//Designating port to listen for requests
app.listen(4000, () => {
    console.log('listening on port 4000')
})