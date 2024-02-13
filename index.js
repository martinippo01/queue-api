const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/queueDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Define a basic schema and model
const Schema = mongoose.Schema;
const ExampleSchema = new Schema({
  name: String,
  age: Number,
});

const ExampleModel = mongoose.model('Example', ExampleSchema);

// Example route to create a new document
app.get('/create', async (req, res) => {
  try {
    const example = new ExampleModel({ name: 'John', age: 30 });
    await example.save();
    res.send('Document created successfully');
  } catch (error) {
    res.status(500).send('Error creating document');
  }
});


/******* MODELS **********/
const business = mongoose.model('business', new mongoose.Schema({
  name: String,
  id: Number
  },
  {
    collection: 'business'
  })
)
  
const user = mongoose.model('user', new mongoose.Schema({
  name: String,
  id: Number
  },
  {
    collection: 'user'
  })
)

/****************************************
 * Business
****************************************/
const BUSINESS_BASE_URL = '/business'
const WAITING_LIST = '/waiting'

app.get(BUSINESS_BASE_URL, async (req, res) => {
  try{
    const business_list = await business.find()
    res.status(200).json(business_list)
  }catch(e){
    res.status(500).json({error: `Erorr catched is "${e}"`})
  }
})

app.post(BUSINESS_BASE_URL, async (req, res) => {
  try{
    
  }catch(e){

  }
})

app.get(BUSINESS_BASE_URL + '/:id', async (req, res) => {
  const id = req.params.id;
  try{
    
  }catch(e){

  }
})

app.put(BUSINESS_BASE_URL + '/:id', async (req, res) => {
  const id = req.params.id;
  try{
    
  }catch(e){

  }
})

app.patch(BUSINESS_BASE_URL + '/:id', async (req, res) => {
  const id = req.params.id;
  try{
    
  }catch(e){

  }
})

// Waiting lists

app.get(BUSINESS_BASE_URL + '/:id' + WAITING_LIST, async (req, res) => {
  try{
    
  }catch(e){

  }
})

app.put(BUSINESS_BASE_URL + '/:id' + WAITING_LIST, async (req, res) => {
  try{
    
  }catch(e){

  }
})

/****************************************
 * Users
****************************************/



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
