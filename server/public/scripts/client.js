$(document).ready(onReady);

let inputString = '';
let inputArray = [];
let counter = 1; // This will be the amount to change by
let count = 10;   // This will be the current count at any given time
let countInterval = null;

function onReady() {
  $(document).on('click','#clear', clearInput);
  $(document).on('click', '#key', createInput);
  $(document).on('click', '#equals', checkIfFieldHasValue);
  $(document).on('click', '#delete-all', deleteAll);
  $(document).on('click', '#delete', deleteIndividualRecord);
  $(document).on('click', '#run-again', showPreviousCalc);

  powerDrain(); // Start the power drain countdown

  // mouse enter moon
  $( "#moon" ).mouseover(function() {
    clearInterval(countInterval);
    $('.thought').css('visibility','visible').hide().fadeIn(4000);
    $('body').addClass('space-is-awesome');
    powerUp();
  });

  // mouse leave moon
  $( "#moon" ).mouseleave(function() {
    clearInterval(countInterval);
    $('.solar-power').removeClass('solar-panal-highlight');
    powerDrain();
  });

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
    $('#alert-container').hide().prepend(`
    <div class="error alert alert-danger alert-dismissible fade show">
      <em>Please input an equation</em>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `).fadeIn();
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
    $('#alert-container').prepend(`
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
                <td>${numberWithCommas(equation.value)}</td>
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
 * This function was yanked from the web.
 */
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Power Drain
 * drains the calculators power
 */
function powerDrain() {
    countInterval = setInterval(function(){  
      count = count -= counter;
      if(count >= 0) {
        $("#input1").attr('readonly', false);
        $('.btn').prop("disabled",false);
        $('#number').text(count);
      } else {
        stopInterval(countInterval);
        $("#input1").prop('disabled', true);
        $('.btn').prop("disabled",true);
        $('#alert-container').prepend(`
        <div class="error alert alert-danger alert-dismissible fade show">
          <em>You've run out of power! Hover over the moon to boost your calculators power level</em>
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      `);
      $("body .alert:first-child").hide();
      $("body .alert:first-child").fadeIn();
      }
    }, 1000);
}

/**
 * Power Up
 * Boosts the calculators power
 */
function powerUp() {
    countInterval = setInterval(function(){  
      count = count += counter;
      if(count >= -1) {
        $(".alert").fadeOut(2000, function() { $(".alert").remove(); });
        $('.btn').prop("disabled",false);
        $('.solar-power').addClass('solar-panal-highlight');
        $('#number').text(count);
      } else {
        stopInterval(countInterval);
        $("#input1").attr('readonly', true);
        $('.solar-power').removeClass('solar-panal-highlight');
      }
    }, 150);
  // }
}

/**
 * Stops the interval from running
 */
function stopInterval(countInterval) {
  clearInterval(countInterval);
}

