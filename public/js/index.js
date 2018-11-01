//Button Collapse Filter Handler & Input Jquery
// =============================
$("#day-filter").on("click", function (event) {
  event.preventDefault();
  $("#month-filter-form").attr("class", "collapse");
  $("#year-filter-form").attr("class", "collapse")
});

$("#month-filter").on("click", function (event) {
  event.preventDefault();
  $("#day-filter-form").attr("class", "collapse");
  $("#year-filter-form").attr("class", "collapse")
});

$("#year-filter").on("click", function (event) {
  event.preventDefault();
  $("#day-filter-form").attr("class", "collapse");
  $("#month-filter-form").attr("class", "collapse")
});

// Year pre-filled Dates
$("#year-date-start").attr("value", "1950");
$("#year-date-end").attr("value", moment().format("YYYY"));
$("#year-date-end").attr("max", moment().format("YYYY"));

// Day pre-filled Dates
$("#month-date-end").attr("value", moment().format("YYYY-MM"));
$("#month-date-end").attr("max", moment().format("YYYY-MM"));

// Day pre-filled Dates
$("#day-date-end").attr("value", moment().format("YYYY-MM-DD"));
$("#day-date-end").attr("max", moment().format("YYYY-MM-DD"));

// Event Handlers
//==============================
// ADD TRANSFER HANDLER
$("#submit-button").on("click", function (event) {
  event.preventDefault();
  // varruct the object to be sent to the server using the form data.
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
  // Posts varructed data object to the server THEN reloads page.
  $.post("/api/transaction", data, {timeout: 500}).then(function () {
    location.reload();
  });
});

//Update A Transaction
$(document).on("click", "button.update", function (event) {
  event.preventDefault();
  //grab id from transaction and set to var
  var id = $(this).data("id");
  //set all the data to a variable ready to swap out
  var updatedData = {
    type: $("select.typeUp" + id)
      .children("option:selected").val(),
    category: $("select.categoryUp" + id)
      .children("option:selected").val(),
    date: $(".date-input" + id).val(),
    amount: $(".amount-input" + id).val(),
    memo: $(".memo-input" + id).val()
  };
  //tells me what im pulling
  console.log("id: " + id);
  console.log("Data Type: " + updatedData.type);
  console.log("Data Category: " + updatedData.category);
  console.log("Data Date: " + updatedData.date);
  console.log("Data Amount: " + updatedData.amount);
  console.log("Data Memo: " + updatedData.memo);
  //ajax call to api route
  $.ajax("/api/transaction/" + id, {
    method: "PUT",
    data: updatedData
  }).then(function () {
    location.reload();
  });
});
//Delete A Transaction
$(document).on("click", "i.delete", function (event) {
  event.preventDefault();
  var id = $(this).data("id");
  $.ajax({
    method: "DELETE",
    url: "/api/transaction/" + id
  }).then(function () {
    location.reload();
  });
});
// ADD FILTER HANDLER
$(".apply-filter-button").on("click", function (event) {
  event.preventDefault();
  if ($(this).attr("data-timeMetric") === "d") {
    var startDay = $("#day-date-start").val().replace(/-/g, "");
    var endDay = $("#day-date-end").val().replace(/-/g, "");
    sessionStorage.removeItem("filterStorage");
    sessionStorage.setItem("filterStorage", "yearmonthday/" + startDay + "/" + endDay)
  } else if ($(this).attr("data-timeMetric") === "m") {
    var startMonth = $("#month-date-start").val().replace(/-/g, "");
    var endMonth = $("#month-date-end").val().replace(/-/g, "");
    sessionStorage.removeItem("filterStorage");
    sessionStorage.setItem("filterStorage", "yearmonth/" + startMonth + "/" + endMonth)
  } else if ($(this).attr("data-timeMetric") === "y") {
    var startYear = $("#year-date-start").val();
    var endYear = $("#year-date-end").val();
    sessionStorage.removeItem("filterStorage");
    sessionStorage.setItem("filterStorage", "year/" + startYear + "/" + endYear)
  }
  location.reload();
});

// show user name next to logout
$('#log-user').text(sessionStorage.getItem('User'));
$('#log-user').css("color", "white");

// Charts
// ============================================================
if (sessionStorage.getItem("filterStorage") === undefined) {
  sessionStorage.setItem("filterStorage", "year/" + moment().subtract(1, "year").format("YYYY") + "/" + moment().format("YYYY"));
};
// Get Data from Database to use in all charts. Uses filter variable above.
$.get("/api/transaction/" + sessionStorage.getItem("filterStorage")).then(function (result) {
  var entertainmentCount = 0;
  var billsCount = 0;
  var personalCareCount = 0;
  var miscCount = 0;
  var foodAndGroceriesCount = 0;
  var gasolineCount = 0;
  var vacationCount = 0;
  var entertainmentTotal = 0;
  var billsTotal = 0;
  var personalCareTotal = 0;
  var miscTotal = 0;
  var foodAndGroceriesTotal = 0;
  var gasolineTotal = 0;
  var vacationTotal = 0;
  var withdrawCount = 0;
  var depositCount = 0;
  for (i = 0; i < result.length; i++) {
    if (result[i].category === "Entertainment") {
      entertainmentTotal += parseFloat(result[i].amount);
      entertainmentCount++;
    } else if (result[i].category === "Bills") {
      billsTotal += parseFloat(result[i].amount);
      billsCount++;
    } else if (result[i].category === "Personal Care") {
      personalCareTotal += parseFloat(result[i].amount);
      personalCareCount++;
    } else if (result[i].category === "Food and Groceries") {
      foodAndGroceriesTotal += parseFloat(result[i].amount);
      foodAndGroceriesCount++;
    } else if (result[i].category === "Gasoline") {
      gasolineTotal += parseFloat(result[i].amount);
      gasolineCount++;
    } else if (result[i].category === "Vacation") {
      vacationTotal += parseFloat(result[i].amount);
      vacationCount++;
    } else {
      miscTotal += parseFloat(result[i].amount);
      miscCount++;
    }
    if (result[i].type === "Withdraw") {
      withdrawCount++;
    } else {
      depositCount++;
    }
  }

  // ===================================================================

  // Spending By Category -- Doughnut Chart
  var ctx = $("#countPerCategoryDoughnut");
  var spendChartDoughnut = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Bills", "Personal Care", "Entertainment", "Food & Groceries", "Gasoline", "Vacation", "Misc."],
      datasets: [{
        label: "Spending Per Category",
        data: [billsCount, personalCareCount, entertainmentCount, foodAndGroceriesCount, gasolineCount, vacationCount, miscCount],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(65, 244, 107, 0.2)',
          'rgba(244, 157, 65, 0.2)',
          'rgba(244, 65, 160, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(65, 244, 107, 1)',
          'rgba(244, 157, 65, 1)',
          'rgba(244, 65, 160, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
    }
  });

  // Spending By Category --- Bar Chart Creation
  var ctx = $("#countPerCategoryBar");
  var spendChartBar = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Bills", "Personal Care", "Entertainment", "Food & Groceries", "Gasoline", "Vacation", "Misc."],
      datasets: [{
        data: [billsCount, personalCareCount, entertainmentCount, foodAndGroceriesCount, gasolineCount, vacationCount, miscCount],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(65, 244, 107, 0.2)',
          'rgba(244, 157, 65, 0.2)',
          'rgba(244, 65, 160, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(65, 244, 107, 1)',
          'rgba(244, 157, 65, 1)',
          'rgba(244, 65, 160, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      legend: {
        display: false
      }
    }
  });

  // Spending By Category --- Pie Chart
  var ctx = $("#countPerCategoryPie");
  var spendChartPie = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ["Bills", "Personal Care", "Entertainment", "Food & Groceries", "Gasoline", "Vacation", "Misc."],
      datasets: [{
        label: 'Spending Per Category',
        data: [billsCount, personalCareCount, entertainmentCount, foodAndGroceriesCount, gasolineCount, vacationCount, miscCount],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(65, 244, 107, 0.2)',
          'rgba(244, 157, 65, 0.2)',
          'rgba(244, 65, 160, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(65, 244, 107, 1)',
          'rgba(244, 157, 65, 1)',
          'rgba(244, 65, 160, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
    }
  });

  // =====================================================================================

  // Category Totals -- Doughnut Chart
  var ctx = $("#categoryTotalDoughnut");
  var categoryTotalDoughnut = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Bills", "Personal Care", "Entertainment", "Food & Groceries", "Gasoline", "Vacation", "Misc."],
      datasets: [{
        label: "Spending Per Category",
        data: [billsTotal, personalCareTotal, entertainmentTotal, foodAndGroceriesTotal, gasolineTotal, vacationTotal, miscTotal],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(65, 244, 107, 0.2)',
          'rgba(244, 157, 65, 0.2)',
          'rgba(244, 65, 160, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(65, 244, 107, 1)',
          'rgba(244, 157, 65, 1)',
          'rgba(244, 65, 160, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
    }
  });

  // Category Totals --- Bar Chart
  var ctx = $("#categoryTotalBar");
  var categoryTotalBar = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Bills", "Personal Care", "Entertainment", "Food & Groceries", "Gasoline", "Vacation", "Misc."],
      datasets: [{
        label: 'Spending Per Category',
        data: [billsTotal, personalCareTotal, entertainmentTotal, foodAndGroceriesTotal, gasolineTotal, vacationTotal, miscTotal],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(65, 244, 107, 0.2)',
          'rgba(244, 157, 65, 0.2)',
          'rgba(244, 65, 160, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(65, 244, 107, 1)',
          'rgba(244, 157, 65, 1)',
          'rgba(244, 65, 160, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      legend: {
        display: false
      }
    }
  });

  // Category Totals --- Pie Chart
  var ctx = $("#categoryTotalPie");
  var categoryTotalPie = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ["Bills", "Personal Care", "Entertainment", "Food & Groceries", "Gasoline", "Vacation", "Misc."],
      datasets: [{
        label: 'Category Totals',
        data: [billsTotal, personalCareTotal, entertainmentTotal, foodAndGroceriesTotal, gasolineTotal, vacationTotal, miscTotal],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(65, 244, 107, 0.2)',
          'rgba(244, 157, 65, 0.2)',
          'rgba(244, 65, 160, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(65, 244, 107, 1)',
          'rgba(244, 157, 65, 1)',
          'rgba(244, 65, 160, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
    }
  });
})


$.get("/api/transaction/").then(function (result) {
  //TIME LINE CHART
  // ====================================================================
  // generate array of months
  var xaxis = [];
  for (i = 0; i < 30; i++) {
    var date = moment().subtract(1 * i, 'days').format('MMM Do')
    xaxis.unshift(date)
  }
  console.log(xaxis)

  //enterain
  var entertain = [];
  for (var j = 0; j < xaxis.length; j++) {
    for (var i = 0; i < result.length; i++) {
      if (result[i].category == "Entertainment" && moment(result[i].date).format('MMM Do') == xaxis[j]) {
        entertain.push(result[i])
      }
    }
  }
  //check
  for (var i = 0; i < entertain.length; i++) {
    console.log("date: " + moment(entertain[i].date).format('MMM Do'));
    console.log("amount: " + entertain[i].amount);
  }
  // relate with fuck up x axis
  var entertainmentSum = [];
  for (var i = 0; i < xaxis.length; i++) {
    entertainmentSum[i] = "null";
    for (var j = 0; j < entertain.length; j++) {
      if (moment(entertain[j].date).format('MMM Do') == xaxis[i]) {
        entertainmentSum[i] = entertain[j].amount
      }
    }
  }

  //====
  // //Bills
  var bill = [];
  for (var j = 0; j < xaxis.length; j++) {
    for (var i = 0; i < result.length; i++) {
      if (result[i].category == "Bills" && moment(result[i].date).format('MMM Do') == xaxis[j]) {
        bill.push(result[i])
      }
    }
  }
  for (var i = 0; i < bill.length; i++) {
    console.log("date: " + moment(bill[i].date).format('MMM Do'));
    console.log("amount: " + bill[i].amount);
  }
  var billSum = [];
  for (var i = 0; i < xaxis.length; i++) {
    billSum[i] = "null";
    for (var j = 0; j < bill.length; j++) {
      if (moment(bill[j].date).format('MMM Do') == xaxis[i]) {
        billSum[i] = bill[j].amount
      }
    }
  }

  //====
  // Personalcare
  var pcare = [];
  for (var j = 0; j < xaxis.length; j++) {
    for (var i = 0; i < result.length; i++) {
      if (result[i].category == "Personal Care" && moment(result[i].date).format('MMM Do') == xaxis[j]) {
        pcare.push(result[i])
      }
    }
  }
  for (var i = 0; i < pcare.length; i++) {
    console.log("date: " + moment(pcare[i].date).format('MMM Do'));
    console.log("amount: " + pcare[i].amount);
  }
  var pcareSum = [];
  for (var i = 0; i < xaxis.length; i++) {
    pcareSum[i] = "null";
    for (var j = 0; j < pcare.length; j++) {
      if (moment(pcare[j].date).format('MMM Do') == xaxis[i]) {
        pcareSum[i] = pcare[j].amount
      }
    }
  }

  //====
  // plot this 
  var ctx = $("#mainTimeChart");
  var spendChartLine = new Chart(ctx, {

    type: 'line',
    data: {
      labels: xaxis,
      datasets: [{
        label: 'Entertainment',
        backgroundColor: 'rgba(255,255,0,0.5)',
        borderColor: 'rgba(255,255,0,0.5)',
        fill: false,
        data: entertainmentSum
      }, {
        label: 'Bills',
        backgroundColor: 'rgba(0,0,255,0.5)',
        borderColor: 'rgba(0,0,255,0.5)',
        fill: false,
        data: billSum
      }, {
        label: 'Personal Care',
        backgroundColor: 'rgba(0,255,0,0.5)',
        borderColor: 'rgba(0,255,0,0.5)',
        fill: false,
        data: pcareSum
      }
      ]
    },
    options: {
      spanGaps: true,
      responsive: true,
      title: {
        display: true,
        text: 'Past 30 days history by category'
      },
      scales: {
        xAxes: [{
          display: true,
        }],
        yAxes: [{
          display: true,
          ticks: {
            suggestedMin: 0,
            suggestedMax: 20
          },
          showLines: true
        }]
      }
    }
  })

  // ====================================================================
  // Analytical LINE CHART
  // ====================================================================
  // generate an array [0,1,2,3 ... 29]
  var twentyNineArray = [];
  for (var i = 0; i < 30; i++) {
    twentyNineArray[i] = i;
  }

  //linear Regression
  function linearRegress(array) {
    //Personal Care
    // generate 2 arrays: y and x
    var ArrayX = [];
    var ArrayY = [];
    for (var i = 0; i < array.length; i++) {
      if (array[i] !== "null") {
        ArrayY.push(parseInt(array[i]));
        ArrayX.push(i);
      }
    }
    console.log("ArrayX: " + ArrayX);
    console.log("ArrayY: " + ArrayY);

    // calculate the average x and average y
    var sumX = ArrayX.reduce((a, b) => a + b, 0)
    var AvgX = sumX / ArrayX.length;
    var sumY = ArrayY.reduce((a, b) => a + b, 0)
    var AvgY = sumY / ArrayY.length;
    console.log("AvgX: " + AvgX);
    console.log("AvgY: " + AvgY);

    // calculate r
    // difference from average x to x terms (x bar - xi)
    var diffX = ArrayX.map(x => x - AvgX);
    console.log("map-x: " + diffX)
    // difference from average y to y terms (y bar - yi)
    var diffY = ArrayY.map(y => y - AvgY);
    console.log("map-y: " + diffY)
    // standard deviation of x and y: SDx = sqrt(sumation((xi-xbar)^2)/n
    var SqrDiffX = diffX.map(x => x * x)
    var SqrDiffY = diffY.map(y => y * y)
    console.log("SqrDiffX: " + SqrDiffX)
    console.log("SqrDiffY: " + SqrDiffY)
    var sqdx = SqrDiffX.reduce((a, b) => a + b, 0)
    var sqdy = SqrDiffY.reduce((a, b) => a + b, 0)
    var sqdxy = sqdx * sqdy
    var rDen = Math.sqrt(sqdxy)
    var rNumArray = [];
    for (var i = 0; i < ArrayX.length; i++) {
      var sumDxTimesDy = diffX[i] * diffY[i]
      rNumArray.push(sumDxTimesDy)
    }
    console.log("rNumArray : " + rNumArray)
    var rNum = rNumArray.reduce((a, b) => a + b, 0)
    console.log("rNum: " + rNum)
    var r = rNum / rDen
    var stdDX = Math.sqrt(sqdx) / ArrayX.length;
    var stdDY = Math.sqrt(sqdy) / ArrayY.length;
    console.log("r :" + r)
    console.log("stdDx: " + stdDX)
    console.log("stdDy:" + stdDY)
    var slope = r * stdDY / stdDX;
    var sxx = slope * AvgX
    var intercept = AvgY - sxx;
    // return formula and variables
    console.log("y=" + intercept + "+" + slope + "x");
    return [slope, intercept];
  }

  // LR for Personal Care
  var lrpcare = linearRegress(pcareSum);
  var linearRegPcare = [];
  for (var i = 0; i < twentyNineArray.length; i++) {
    var y = lrpcare[1] + lrpcare[0] * twentyNineArray[i]
    linearRegPcare.push(y)
  }
  console.log("linearRegPcare: " + linearRegPcare)

  // LR for bills
  var lrbill = linearRegress(billSum);
  var linearRegBill = [];
  for (var i = 0; i < twentyNineArray.length; i++) {
    var y = lrbill[1] + lrbill[0] * twentyNineArray[i]
    linearRegBill.push(y)
  }
  console.log("linearRegBill: " + linearRegBill)

  // LR for Entertainment
  var lrentertain = linearRegress(entertainmentSum);
  var linearRegEntertain = [];
  for (var i = 0; i < twentyNineArray.length; i++) {
    var y = lrentertain[1] + lrentertain[0] * twentyNineArray[i]
    linearRegEntertain.push(y)
  }

  // Advice
  // if (lrentertain[1]>0){
  //   $('.msg').append('<li> The spending on "Entertainment" is increasing. Remember: Saving is a good habit.</li>')
  // } else {
  //   $('.msg').append('<li> The spending on "Entertainment" is decreasing. Life needs balance</li>')
  // }
  // if (lrbill[1]>0){
  //   $('.msg').append('<li> The spending on "Bills" is increasing. Sorry for being ripped of by Duke Energy.</li>')
  // } else {
  //   $('.msg').append('<li> The spending on "Bills" is decreasing. Good Job!</li>')
  // }
  // if (lrpcare[1]>0){
  //   $('.msg').append('<li> The spending on "Personal Care" is increasing. Money can not buy health but health does cost money!</li>')
  // } else {
  //   $('.msg').append('<li> The spending on "Personal Care" is decreasing. Good Job for taking good care of your body!</li>')
  // }
  console.log("linearRegEntertain: " + linearRegEntertain)

  // plot this 
  var ctx = $("#analTimeChart");
  var spendChartLine = new Chart(ctx, {

    type: 'line',
    data: {
      labels: xaxis,
      datasets: [{
        label: 'Trend of Entertainment',
        backgroundColor: 'rgba(255,255,0,1)',
        borderColor: 'rgba(255,255,0,1)',
        fill: false,
        data: linearRegEntertain
      }, {
        label: 'Trend of Bills',
        backgroundColor: 'rgba(0,0,255,1)',
        borderColor: 'rgba(0,0,255,1)',
        fill: false,
        data: linearRegBill
      }, {
        label: 'Trend of Personal Care',
        backgroundColor: 'rgba(0,255,0,1)',
        borderColor: 'rgba(0,255,0,1)',
        fill: false,
        data: linearRegPcare
      }, {
        label: 'Entertainment',
        backgroundColor: 'rgba(255,255,0,0.1)',
        borderColor: 'rgba(255,255,0,0.1)',
        fill: false,
        data: entertainmentSum
      }, {
        label: 'Bills',
        backgroundColor: 'rgba(0,0,255,0.1)',
        borderColor: 'rgba(0,0,255,0.1)',
        fill: false,
        data: billSum
      }, {
        label: 'Personal Care',
        backgroundColor: 'rgba(0,255,0,0.1)',
        borderColor: 'rgba(0,255,0,0.1)',
        fill: false,
        data: pcareSum
      }
      ]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: 'Past 30 days Linear Regression'
      },
      scales: {
        xAxes: [{
          display: true,
        }],
        yAxes: [{
          display: true,
          ticks: {
            suggestedMin: 0,
            suggestedMax: 200
          },
          showLines: true
        }]
      }
    }
  })
});

