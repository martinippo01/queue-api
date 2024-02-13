const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

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
  userName: String,
  id: Number
  },
  {
    collection: 'user'
  })
)

// -------------------------------------------- ENDPOINTS --------------------------------------------

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
  res.status(501).json({message: "Working"})
})

app.get(BUSINESS_BASE_URL + '/:id', async (req, res) => {
  const id = req.params.id;
  try{
    
  }catch(e){

  }
  res.status(501).json({message: "Working"})
})

app.put(BUSINESS_BASE_URL + '/:id', async (req, res) => {
  const id = req.params.id;
  try{
    
  }catch(e){

  }
  res.status(501).json({message: "Working"})
})

app.patch(BUSINESS_BASE_URL + '/:id', async (req, res) => {
  const id = req.params.id;
  try{
    
  }catch(e){

  }
  res.status(501).json({message: "Working"})
})

// Waiting lists

app.get(BUSINESS_BASE_URL + '/:id' + WAITING_LIST, async (req, res) => {
  try{
    
  }catch(e){

  }
  res.status(501).json({message: "Working"})
})

app.put(BUSINESS_BASE_URL + '/:id' + WAITING_LIST, async (req, res) => {
  try{
    
  }catch(e){

  }
  res.status(501).json({message: "Working"})
})

/****************************************
 * Users
****************************************/
const USER_BASE_URL = '/users'

app.get(USER_BASE_URL, async (req, res) => {
  try{
    const resp = await user.find()
    res.status(200).json(resp)
  }catch(e){
    res.status(500).json({message: `error is ${e}`})
  }
})

app.post(USER_BASE_URL, async (req, res) => {
  try{
    const {userName} = req.body
    // Use the aggregation framework to calculate the next nro_cliente
    const nextIdPipeline = [
      {
        $sort: { id: -1 }
      },
      {
        $limit: 1
      },
      {
        $project: {
          _id: 0,
          id: { $add: ["$id", 1] }
        }
      }
    ];
    let [nextId] = await user.aggregate(nextIdPipeline)
    if (nextId === null || nextId === undefined){
      nextId = 1;
    }

    user.insertMany({
      id: nextId.id,
      userName: userName
    })
    
    res.status(201).json((await user.find({id: nextId.id}))[0])
  }catch(e){
    res.status(500).json({message: `error is ${e}`})
  }
})

app.get(`${USER_BASE_URL}/:id`, async (req, res) => {
  const userId = req.params.id;

  try {
    // Find the user by ID
    const userFound = await user.findOne({ id: userId });

    if (!userFound) {
      // If user is not found, return a 404 Not Found response
      return res.status(404).json({ message: 'User not found' });
    }

    // If user is found, return the user data
    res.status(200).json(userFound);
  } catch (error) {
    // If an error occurs, return a 500 Internal Server Error response
    res.status(500).json({ message: `Error: ${error.message}` });
  }
});




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
