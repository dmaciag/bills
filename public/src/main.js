var expensesData = [];
var incomesData  = [];

var pieData = [];
var barDat  = {};

var myPieChart = '';
var myBarChart = '';

var totalIncomeMonthlyAfterTax = 0;
var totalExpensesMonthly = 0;

$(document).ready(function(){
    populateExpenses();
    populateIncomes();

});


function populateExpenses(){

    var expensesContent = '';
    var totalFeeMonthly = 0;
    var needToMakeMonthly = 0;
    var totalMonthlyCost = 0;
    var tax = 0.3;

    $.getJSON( '/expenses/expenselist', function(expenses){
        expensesData = expenses;
        $.each(expenses, function(){
            var dayOfMonth  = (this.day_of_month != null ) ? this.day_of_month : 'N/A';
            var companyName = (this.company_name != null ) ? this.company_name : 'N/A';
            var monthlyCost = 0;
            if( this.pay_period == 'Monthly' )     monthlyCost = this.monthly;
            else if( this.pay_period == 'Weekly' ) monthlyCost = this.weekly*52/12;
            else if( this.pay_period == 'Yearly')  monthlyCost = this.yearly/12;
            else                                   monthlyCost = null;

            totalFeeMonthly += (parseFloat(this.fee) !== null) ? parseFloat(this.fee) : 0;
            expensesContent += '<tr>';
            expensesContent += '<td>' + this.name_of_expense + '</td>';
            expensesContent += '<td>' + companyName + '</td>';
            expensesContent += '<td>' + this.pay_period + '</td>';
            expensesContent += '<td>' + parseInt(monthlyCost)  + '</td>';
            expensesContent += '<td>' + dayOfMonth + '</td>';
            expensesContent += '<td>' + '<a href="#" class="deleteExpenseLink" rel="' + this._id + '">delete</a>' + '</td>';
            expensesContent += '<tr>';

            totalMonthlyCost += parseInt(monthlyCost);

        });

        totalExpensesMonthly = totalMonthlyCost;

        $('#expenseList table tbody').html(expensesContent);
        $('#totalFeeMonthly').html(totalMonthlyCost);
    }).then(function(){       
        loadGraphs();
    });
}

function addExpense(event){
    if(event != null)
        event.preventDefault();

    var expense = {
        'name'          : $('#addExpense fieldset input#inputExpenseName').val(),
        'type'          : $('#addExpense fieldset input#inputExpenseType').val(), 
        'fee'           : $('#addExpense fieldset input#inputExpenseFee').val(),
        'day_of_month'  : $('#addExpense fieldset input#inputDayOfMonth').val()
    };

    $.ajax({
        type:'POST',
        data: expense,
        url:  '/expenses/addexpense', 
        dataType: 'JSON'
    }).done(function( response ){
        if(response.msg === 'success'){
            populateExpenses();
        }
        else{
            console.log('Error Backend : %o', response.msg );
        }
    }).fail(function( response ){
        console.log('Error Ajax : %o', response);
    });
}

function deleteExpense(event){
    $.ajax({
        type: 'DELETE',
        url:  '/expenses/deleteexpense/' + $(this).attr('rel')
    }).done(function(response){
        if( response.msg != 'success'){
            console.log('Error backend : %o', response.msg);
        }
        else{
            populateExpenses();
        }
    }).fail(function(response){
        console.log('Error ajax : $o', response);
    });
}

function goToIncome(){
    window.location.href = '/income';
}

function goToExpense(){
    window.location.href = '/expense';
}

function addIncome(event){
    if(event != null)
        event.preventDefault();

    var income = {
        'name'          : $('#addExpense fieldset input#inputExpenseName').val(),
        'type'          : $('#addExpense fieldset input#inputExpenseType').val(), 
        'fee'           : $('#addExpense fieldset input#inputExpenseFee').val(),
        'day_of_month'  : $('#addExpense fieldset input#inputDayOfMonth').val()
    };

    $.ajax({
        type:'POST',
        data: income,
        url:  '/income/addincome', 
        dataType: 'JSON'
    }).done(function( response ){
        if(response.msg === 'success'){
            console.log(totalExpensesMonthly);
        }
        else{
            console.log('Error Backend : %o', response.msg );
        }
    }).fail(function( response ){
        console.log('Error Ajax : %o', response);
    });

}

function changeIncomeInputFields(){

    var placeHolderSalary = 0;
    
    if( $('.payPeriodSelect').val() == 'Hourly')        placeHolderSalary = 30;
    else if( $('.payPeriodSelect').val() == 'Weekly')   placeHolderSalary = 700;
    else if( $('.payPeriodSelect').val() == 'Monthly')  placeHolderSalary = 2000;
    else if( $('.payPeriodSelect').val() == 'Yearly' )  placeHolderSalary = 75000;

    if( $('.payPeriodSelect').val() == 'Hourly' && !$('#hoursPerWeek').length ){
        $(this).append('<li id="hoursPerWeekLi"><label for="hours_per_week">Hours Per Week</label><input id="hoursPerWeek" class="field-short" type="text" placeholder="40" name="hours_per_week"/></li>');
    }
    else if( $('.payPeriodSelect').val() != 'Hourly' && $('#hoursPerWeek').length ){
        $('#hoursPerWeekLi').remove();
    }

    $('.salaryTerm').text($('.payPeriodSelect').val() + ' ');
    $('.salary').attr('placeholder', placeHolderSalary);
    $('.salary').attr('name', $('.payPeriodSelect').val().toLowerCase());
}

function changeExpenseInputFields(){

    var placeHolderFee = 0;
    
    if( $('.payPeriodSelect').val() == 'Weekly')        placeHolderFee = 40;
    else if( $('.payPeriodSelect').val() == 'Monthly')  placeHolderFee = 350;
    else if( $('.payPeriodSelect').val() == 'Yearly' )  placeHolderFee = 2000;

    $('.salaryTerm').text($('.payPeriodSelect').val() + ' ');
    $('.salary').attr('placeholder', placeHolderFee);
    $('.salary').attr('name', $('.payPeriodSelect').val().toLowerCase());

    if( $('.payPeriodSelect').val() != 'Monthly' && $('#dayOfMonthLi').length){
        $('#dayOfMonthLi').remove();
    }
    else if( $('.payPeriodSelect').val() == 'Monthly'){
        $(this).append('<li id="dayOfMonthLi"><label for="day_of_month">Day of Month</label><input id="dayOfMonth" class="field-short" type="text" placeholder="15" name="day_of_month"/></li>');
    }
}

function populateIncomes(){

    var incomesContent = '';

    var totalIncomeMonthly = 0;
    var totalIncomeYearly  = 0;
    var totalIncomeWeekly  = 0;

    var taxRate = 0.3;

    $.getJSON( '/incomes/incomelist', function(income){
        incomesData = income;
        $.each(income, function(){
            
            var hourly  = 0;
            var weekly  = 0;
            var monthly = 0;
            var yearly  = 0;
            
            var workHoursPerWeek = ( this.hours_per_week != null) ? this.hours_per_week : 40; //FT

            if(this.monthly != null){
                hourly  = this.monthly*12/52/workHoursPerWeek;
                weekly  = this.monthly*12/52;
                monthly = this.monthly;
                yearly  = this.monthly*12;
            }
            else if(this.yearly !=null){
                hourly  = this.yearly/52/workHoursPerWeek;
                weekly  = this.yearly/52;
                monthly = this.yearly/12;
                yearly  = this.yearly;
            }
            else if(this.weekly != null){
                hourly  = this.weekly/workHoursPerWeek;
                weekly  = this.weekly;
                monthly = this.weekly*52/12;
                yearly  = this.weekly*52;
            }
            else if(this.hourly !=null){
                hourly  = this.hourly;
                weekly  = this.hourly*workHoursPerWeek;
                monthly = this.hourly*workHoursPerWeek*52/12;
                yearly  = this.hourly*workHoursPerWeek*52;
            }
            else return false;

            totalIncomeWeekly  += parseInt(weekly);
            totalIncomeMonthly += parseInt(monthly);
            totalIncomeYearly  += parseInt(yearly);


            incomesContent += '<tr>';
            incomesContent += '<td>' + this.name_of_worker + '</td>';
            incomesContent += '<td>' + this.company_name + '</td>';
            incomesContent += '<td>' + this.company_title + '</td>';
            incomesContent += '<td>' + workHoursPerWeek  + '</td>';
            incomesContent += '<td>' + parseInt(hourly)  + '</td>';
            incomesContent += '<td>' + parseInt(weekly)  + '</td>';
            incomesContent += '<td>' + parseInt(monthly)  + '</td>';
            incomesContent += '<td>' + parseInt(yearly)  + '</td>';
            incomesContent += '<td>' + '<a href="#" class="deleteIncomeLink" rel="' + this._id + '">delete</a>' + '</td>';
            incomesContent += '<tr>';
        });

        $('#incomeList table tbody').html(incomesContent);

        $('#totalIncomeWeekly').html(totalIncomeWeekly);
        $('#totalIncomeMonthly').html(totalIncomeMonthly);
        $('#totalIncomeYearly').html(totalIncomeYearly);

        totalIncomeMonthlyAfterTax = parseInt(totalIncomeMonthly*(1-taxRate));

        $('#totalIncomeWeeklyAfterTax').html(parseInt(totalIncomeWeekly*(1-taxRate)));
        $('#totalIncomeMonthlyAfterTax').html(parseInt(totalIncomeMonthly*(1-taxRate)));
        $('#totalIncomeYearlyAfterTax').html(parseInt(totalIncomeYearly*(1-taxRate)));

    }).then(function(){
        loadGraphs();
    });
}

function deleteIncome(event){
    $.ajax({
        type: 'DELETE',
        url:  '/incomes/deleteincome/' + $(this).attr('rel')
    }).done(function(response){
        if( response.msg != 'success'){
            console.log('Error backend : %o', response.msg);
        }
        else{
            populateIncomes();
        }
    }).fail(function(response){
        console.log('Error ajax : $o', response);
    });
}

function loadGraphs(){
    
    var barData = [];
    var labels  = [];

    var monthlyIncomeAfterTax = totalIncomeMonthlyAfterTax;
    var monthlyExpenses = totalExpensesMonthly;

    var leftOverMonthly = monthlyIncomeAfterTax - monthlyExpenses;

    expensesData.forEach(function(expense){
        var fee = 0;
        if( expense.monthly != null)      fee = expense.monthly;
        else if( expense.weekly != null ) fee = expense.weekly*52/12;
        else if( expense.yearly != null ) fee = expense.yearly/12;
        barData.push(fee);
        labels.push(expense.name_of_expense);
    });

    if( leftOverMonthly < 0){
        leftOverMonthly = 0;
    }

    pieData =   [
                    {
                        value : monthlyExpenses,
                        label : "Expenses",
                        color : "#F7464A"
                    },
                    {
                        value : leftOverMonthly,
                        label : "Left Over",
                        color : "rgba(0,220,0,0.6)"
                    }
                ];

    barData =   {
                    labels : labels,
                    datasets : [
                        {
                            label: "Expenses",
                            fillColor: "rgba(220,220,220,0.6)",
                            strokeColor: "rgba(220,220,220,0.8)",
                            highlightFill: "rgba(220,220,220,0.75)",
                            highlightStroke: "rgba(220,220,220,1)",
                            data: barData
                        }
                    ]
                };
    if( $("#pieChart").length ){
        var pieChart = $("#pieChart").get(0).getContext("2d");
        myPieChart = new Chart(pieChart).Pie(pieData, { scaleFontColor: "#000" });
    }
    if( $("#barChart").length ){
        var barChart = $("#barChart").get(0).getContext("2d");
        myBarChart = new Chart(barChart).Bar(barData, { scaleFontColor: "#000" });
    }
}

