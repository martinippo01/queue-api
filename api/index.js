const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

// Allow all cross-origin requests
app.use(cors());

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
    if(business_list === null || business_list === undefined || business_list.length === 0){
      res.status(204).json([])
    }else{
      res.status(200).json(business_list)
    }
  }catch(e){
    res.status(500).json({error: `Erorr catched is "${e}"`})
  }
})

app.post(BUSINESS_BASE_URL, async (req, res) => {
  try{
    const {name} = req.body
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
    let [nextId] = await business.aggregate(nextIdPipeline)
    if(nextId === null || nextId === undefined) nextId = {id: 1} ;

    business.insertMany({
      name: name,
      id: nextId.id
    })
    res.status(201).json(await business.find({id: nextId.id}))
  }catch(e){
    console.error(e);
    res.status(500).json({ error: "Failed to create business" });
  }
})

app.get(BUSINESS_BASE_URL + '/:id', async (req, res) => {
  try{
    const id = req.params.id;

    const businessFound = await business.find({id: id})
    
    if (!businessFound) {
      // If business is not found, return a 404 Not Found response
      return res.status(404).json({ message: 'Business not found' });
    }

    // If business is found, return the business data
    res.status(200).json(businessFound);
  }catch(e){
    console.error(e);
    res.status(500).json({ error: "Failed to get business" });
  }
})

// Update a business by ID
app.put(`${BUSINESS_BASE_URL}/:id`, async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  try {
    const businessFound = await business.find({id: id})
    if (!businessFound) {
      // If business is not found, return a 404 Not Found response
      return res.status(404).json({ message: 'Business not found' });
    }
    // Find and update the business by ID
    await business.updateOne({ id: id }, { name: name });
    res.status(200).json({ message: 'Business updated successfully' });
  } catch (error) {
    res.status(500).json({ message: `Error updating business: ${error.message}` });
  }
});

// Delete a business by ID
app.delete(`${BUSINESS_BASE_URL}/:id`, async (req, res) => {
  const id = req.params.id;
  try {
    // Find and delete the business by ID
    await business.deleteOne({ id: id });
    res.status(200).json({ message: 'Business deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Error deleting business: ${error.message}` });
  }
});


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
      nextId = {id: 1}
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

// Delete a user by ID
app.delete(`${USER_BASE_URL}/:id`, async (req, res) => {
  const id = req.params.id;
  try {
    // Find and delete the user by ID
    await user.deleteOne({ id: id });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Error deleting user: ${error.message}` });
  }
});

// Update a user by ID
app.put(`${USER_BASE_URL}/:id`, async (req, res) => {
  const id = req.params.id;
  const { userName } = req.body;
  try {
    // Find and update the user by ID
    await user.updateOne({ id: id }, { userName: userName });
    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: `Error updating user: ${error.message}` });
  }
});




app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
