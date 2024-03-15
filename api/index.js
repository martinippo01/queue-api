const express = require('express');
const cors = require('cors');
const path = require('path'); // Import path module

const app = express();
const port = 3000;

// Allow all cross-origin requests
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// -------------------------------------------- ENDPOINTS --------------------------------------------

/****************************************
 * Business
****************************************/

app.get('/test', async (req, res) => {
  const acceptHeader = req.get('Accept');

  // Check the accept header
  if (acceptHeader.includes('text/html')) {
    // Return HTML response
    res.status(200).send('<h1>This is HTML content</h1>');
  } else {
    // Return plain text response
    res.status(200).send('This is plain text content');
  }
})

/****************************************
 * Users
****************************************/

app.get('/helloworld', async (req, res) => {
  res.status(200).json({ message: "Hello world" })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
