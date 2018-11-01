

// On submit button click.
$("#submit-button").on("click", function (event) {
  event.preventDefault();
  
  // Construct the object to be sent to the server using the form data.
  var data = {
    type: $("select.type")
      .children("option:selected")
      .val(),
    category: $("select.category")
      .children("option:selected")
      .val(),
    date: $("#date-input").val(),
    amount: $("#amount-input").val(),
    memo: $("#memo-input").val()
  };

  console.log(data);
  // Posts constructed data object to the server THEN reloads page.
  $.post("/api/transaction", data).then(function () {
    location.reload();
  });
});
