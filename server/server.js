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
  console.log('Ready to take in an equation');
  console.log('request.route.path is', request.route.path);
  console.log('request.body', request.body);
  let equation = request.body;
  console.log('equation', eval(equation.val));
  bundleCalculations.push({equation: equation.val, value: eval(equation.val)});
  console.log(bundleCalculations);
  let ok = 200;
  response.send(ok);
});

app.get('/result', function(request, response) {
  console.log('Ready to send back the result');
  console.log('request.route.path is', request.route.path);
  response.send(bundleCalculations);
});


app.listen(PORT, () => {
  //console.log ('Server is running on port', PORT)
  console.log (`Connect to: http://localhost:${PORT}`);
})
