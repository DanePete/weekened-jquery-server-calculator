const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');
const math = require('mathjs');
const app = express();
const PORT = 5500;
let bundleCalculations = [];

// Get Response from client

// This must be added before GET & POST routes.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

// Serve up static files (HTML, CSS, Client JS)
app.use(express.static('server/public'));

/**
 * App Post
 * Retrieves the inputs from the user and pushes an object into the Bundle Calculations Array
 */
app.post('/bundle', function(request, response) {
  let equation = request.body;
  bundleCalculations.push({equation: equation.val, value: math.evaluate(equation.val)}); // Fine... I won't use eval, but you didn't say i couldn't use mathjs :p
  let ok = 200;
  response.send(ok);
});

/**
 * App Get Result
 * Returns the Bundle Calculations array (a collection of equations)
 */
app.get('/result', function(request, response) {
  response.send(bundleCalculations);
});

/**
 * App Delete
 * Clears out the Bundle Calculations array
 */
app.delete('/result', function(req, response) {
  bundleCalculations = [];
  response.send(bundleCalculations);
});

/**
 * App Delete
 * Removes individual array items by id
 */
app.delete('/result:id', function(req, response) {
  bundleCalculations.splice(req.params.id, 1);
  response.send(bundleCalculations);
});

/**
 * listen YO!
 */
app.listen(PORT, () => {
  console.log (`Connect to: http://localhost:${PORT}`);
})
