console.log($);

$(document).ready(onReady);

let inputString = '';
let inputArray = [];

function onReady() {
  console.log('ready');
  // $(document).on('click','#submitBtn', bundle);
  $(document).on('click','#clear', clearInput);
  $(document).on('click', '#key', createInput);
  $(document).on('click', '#equals', checkIfFieldHasValue);
  // $(document).on('click', '#equals', bundle);
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
    alert('yeah ya did not do anything..');
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
  inputString = '';
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
    $('#result').text(response[response.length - 1].value);
    $('#results').find('tbody').empty();
    for (let i = 0; i < response.length; i++) {
        let equation = response[i];
        $('#results tbody').append(`
            <tr>
                <td>${equation.equation}</td>
                <td>${equation.value}</td>
            </tr>
        `);
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

