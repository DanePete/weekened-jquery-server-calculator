const express = require('express');
const bodyParser = require('body-parser');
const { response } = require('express');
const app = express();
const PORT = 5000;
let bundleCalculations = [];

// Get Response from client

// This must be added before GET & POST routes.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

// Serve up static files (HTML, CSS, Client JS)
app.use(express.static('server/public'));

app.post('/bundle', function(request, response) {
  let equation = request.body;
  bundleCalculations.push({equation: equation.val, value: eval(equation.val)});
  console.log(bundleCalculations);
  let ok = 200;
  response.send(ok);
});

/**
 * 
 */
app.get('/result', function(request, response) {
  response.send(bundleCalculations);
});

app.delete('/result', function(req, response) {
  bundleCalculations = [];
  console.log('request param', req.params.id);
  response.send(bundleCalculations);
});

app.delete('/result:id', function(req, response) {
  bundleCalculations.splice(req.params.id, 1);
  console.log('request param', req.params.id);
  response.send(bundleCalculations);
});


app.listen(PORT, () => {
  //console.log ('Server is running on port', PORT)
  console.log (`Connect to: http://localhost:${PORT}`);
})
