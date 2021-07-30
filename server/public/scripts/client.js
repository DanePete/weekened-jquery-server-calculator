console.log($);

$(document).ready(onReady);

let inputString = '';
let inputArray = [];

function onReady() {
  console.log('ready');
  // $(document).on('click','#submitBtn', bundle);
  $(document).on('click','#clear', clearInput);
  $(document).on('click', '#key', createInput);
  $(document).on('click', '#equals', bundle);
  getResults();
}

function createInput() {
  console.log($(this).data('key'));
  inputString += $(this).data('key');
  inputArray.push($(this).data('key'));
  console.log('input array', inputArray);
  console.log('input string',inputString);
  $("#input1").val(inputString);
  console.log('eval', eval(inputString));
  // $(this).data(key);
}

function bundle() {
  let val = $("#input1").val();
  console.log(val);
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
  getResults();
}

function getResults() {
  $.ajax({
    type: 'GET',
    url: '/result'
  }).then(function (response) {
    console.log('my rsponse asfresponse', response);
    for (let i = 0; i < response.length; i++) {
        let equation = response[i];
        $('#results').append(`
            <tr>
                <td>${equation}</td>
            </tr>
        `);
    }
  });
}

function clearInput() {
 $('#input1').val('');

}

