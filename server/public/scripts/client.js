$(document).ready(onReady);

let inputString = '';
let inputArray = [];

function onReady() {
  $(document).on('click','#clear', clearInput);
  $(document).on('click', '#key', createInput);
  $(document).on('click', '#equals', checkIfFieldHasValue);
  $(document).on('click', '#delete-all', deleteAll);
  $(document).on('click', '#delete', deleteIndividualRecord);
  $(document).on('click', '#run-again', showPreviousCalc);
  getResults();
}

/**
 * Create Input
 * This function captures the users inputs and assigns them to a string
 */
function createInput() {
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
    $('body').prepend(`
      <div class="error alert alert-danger alert-dismissible fade show">
        <em>Error: incorrect input value</em>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `);
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
      setValues(response[response.length - 1].equation, numberWithCommas(response[response.length - 1].value));
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

/**
 * Delete All
 * Deletes the entire array on the server side
 */
function deleteAll() {
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
 * Delete Individual Record
 * Sends the id of the record that the user selected to delete.
 */
function deleteIndividualRecord() {
  let id = $(this).closest('tr').data('id');
  $.ajax({
    url: `/result${id}`,
    type: 'DELETE',
    success: function(result) {
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
  setValues('',0);
}

/**
 * Show Previous Calc
 */
function showPreviousCalc() {
  setValues($(this).closest('tr').data('equation'), numberWithCommas($(this).closest('tr').data('value')));
}

/**
 * Set Values
 * Small reusable function to render the equation and value to the dom
 */
function setValues(equation, value) {
  $('#result-equation').text(equation);
  $('#result-value').text(value);
}

/**
 * Convert calc value to string and add thousand markers
 * This function was yanked form the web.
 */
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}