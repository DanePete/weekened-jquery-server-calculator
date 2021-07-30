console.log($);

$(document).ready(onReady);

let inputString = '';
let inputArray = [];

function onReady() {
  $(document).on('click','#clear', clearInput);
  $(document).on('click', '#key', createInput);
  $(document).on('click', '#equals', checkIfFieldHasValue);
  $(document).on('click', '#delete-all', DeleteAll);
  $(document).on('click', '#run-again', showPreviousCalc);
  getResults();
}

/**
 * Create Input
 * This function captures the users inputs and assigns them to a string
 */
function createInput() {
  console.log($(this).data('key'));
  inputString += $(this).data('key');
  inputArray.push($(this).data('key'));
  $("#input1").val(inputString);
}

/**
 * Check If Field Has Value
 * Simply checks if our input field has a value
 */
function checkIfFieldHasValue() {
  if($('#input1').val()) {
    bundle();
  } else {
    alert("yeah you didn't type anything in buddy");
  }
}

/**
 * Bundle
 * Preps and sends our data to the server
 */
function bundle() {
  let val = $("#input1").val();
  $.ajax({
    method: 'POST',
    url: '/bundle',
    data: {val: val}
  }).then((response) => {
    console.log('POST /bundle', response);
  }).catch((error) => {
    console.log('failed', error);
    $('body').prepend('<h2>ERROR</h2>');
  });
  $('#input1').val('');
  inputString = ''; // Sets our input string back to empty
  getResults(); 
}

/**
 * Get Results
 * Returns the Calculated Data back from the server
 */
function getResults() {
  $.ajax({
    type: 'GET',
    url: '/result'
  }).then(function (response) {
    if(response[response.length - 1]) {
      setValues(response[response.length - 1].equation, response[response.length - 1].value);
    }
    $('#results').find('tbody').empty();
    for (let i = 0; i < response.length; i++) {
        let equation = response[i];
        $('#results tbody').append(`
            <tr data-id="${i}" data-equation="${equation.equation}" data-value="${equation.value}">
                <td>${equation.equation}</td>
                <td>${equation.value}</td>
                <td><button id="run-again" class="btn btn-warning">RUN AGAIN</button></td>
                <td><button id="delete" class="btn btn-danger">DELETE</button></td>
            </tr>
        `);
    }
  });
}

function DeleteAll() {
  $.ajax({
    url: '/result',
    type: 'DELETE',
    success: function(result) {
        // Do something with the result
        $('#result-value').text(0);
        $('#result-equation').text('');
        getResults();
    }
  });
} 

/**
 * Clear Input
 * Clears the input..
 */
function clearInput() {
  inputString = '';
 $('#input1').val('');
}

/**
 * Show Previous Calc
 */
function showPreviousCalc() {
  setValues($(this).closest('tr').data('equation'), $(this).closest('tr').data('value'));
}

function setValues(equation, value) {
  $('#result-equation').text(equation);
  $('#result-value').text(value);
}
