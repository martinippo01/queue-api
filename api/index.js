const express = require('express');
const cors = require('cors');
const path = require('path'); // Import path module
const csvParser = require('csv-parser');
const fs = require('fs');


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

app.get('/players', async (req, res) => {
  try{
    const acceptHeader = req.get('Accept');
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not specified
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page if not specified
    const startIdx = (page - 1) * limit;
    const endIdx = page * limit;

    const results = []
    const columns_to_show = ['full_name', 'age', 'Current Club', 'nationality', 'position']

    // Path to your CSV file
    const csvFilePath = './public/england-premier-league-players-2018-to-2019-stats.csv';

    // Read the CSV file
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (data) => {
        const filteredData = {};
        columns_to_show.forEach(column => {
          if(data[column]){
            filteredData[column] = data[column];
          }
        });
        results.push(filteredData)
      }
      )
      .on('end', () => {
        const paginatedResults = results.slice(startIdx, endIdx);
        if(paginatedResults.length === 0){
          console.log("empty")
          if(acceptHeader !== null && acceptHeader !== undefined && acceptHeader.includes('text/html'))
            res.status(404).send('<h1>Not Found</h1>');
          else
            res.status(404).send({message: 'Not Found'});
        }else{
          
        //res.json(paginatedResults); // Send the parsed CSV data as JSON response
        // Check the accept header
        if (acceptHeader !== null && acceptHeader !== undefined && acceptHeader.includes('text/html')) {
          // Return HTML response
          let base_html = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Premier League Players</title>
          </head>
          <body>
            <h1>Premier League Players</h1>
          `
          paginatedResults.forEach(
            (player_data) => {
              base_html += `<h3>${player_data.full_name}</h3>
                <ul>
                  <li>Current Club: ${player_data['Current Club']}</li>
                  <li>Nationality: ${player_data.nationality}</li>
                  <li>Position: ${player_data.position}</li>
                  <li>Age: ${player_data.age}</li>
                </ul>
              <br>`
            }
          );
          base_html += `</body></html>`
          res.status(200).send(base_html);
        } else {
          // Return plain text response
          res.status(200).send(paginatedResults);
        }
        }
      });
    }catch(e){
      res.status(500).send({'error': 'Internal server error'})
    }
})


app.get('/premier', async (req, res) =>{
  // res.status(302).send({
  //   'found': 'api.ippo.com.ar/players'
  // })
  res.redirect('/players');
})


app.get('/boom', async (req, res) => {
  res.status(500).json({ message: "My bad" })
})

app.get('/players/salary', async (req, res) => {
  res.status(403).send({
    'error': 'Cannot access this information'
  })
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
