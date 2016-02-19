var expensesData = [];

$(document).ready(function(){
    populateExpenses();
});

function populateExpenses(){
    var expensesContent = '';
    var totalFeeMonthly = 0;
    var needToMakeMonthly = 0;
    var tax = 0.3;
    $.getJSON( '/expenses/expenselist', function(expenses){
        expensesData = expenses;
        $.each(expenses, function(){
            if( this.type == 'monthly' )        needToMakeMonthly += parseFloat(this.fee);
            else if( this.type == 'yearly' )    needToMakeMonthly += 1/12 * parseFloat(this.fee);
            else if( this.type == 'weekly' )    needToMakeMonthly += 4.357 * parseFloat(this.fee);
            else needToMakeMonthly += parseFloat(this.fee);
            totalFeeMonthly += (parseFloat(this.fee) !== null) ? parseFloat(this.fee) : 0;
            expensesContent += '<tr>';
            expensesContent += '<td>' + this.name + '</td>';
            expensesContent += '<td>' + this.type + '</td>';
            expensesContent += '<td>' + this.fee  + '</td>';
            expensesContent += '<td>' + this.day_of_month  + '</td>';
            expensesContent += '<td>' + '<a href="#" class="deleteExpenseLink" rel="' + this._id + '">delete</a>' + '</td>';
            expensesContent += '<td>' + '<a href="#" class="editExpenseLink" rel="' + this._id + '">edit</a>' + '</td>';
            expensesContent += '<tr>';
        });

        $('#needToMakeWeekly').html('$' + parseInt(needToMakeMonthly/(1-tax)/4.357) + ' weekly');
        $('#needToMakeMonthly').html('$' + parseInt(needToMakeMonthly/(1-tax)) + ' monthly');
        $('#needToMakeYearly').html('$' + parseInt(needToMakeMonthly*12/(1-tax)) + ' yearly');

        $('#expenseList table tbody').html(expensesContent);
        $('#totalFeeMonthly').html(totalFeeMonthly);
    });
}

function checkThenAddExpense(event){
    if(event.keyCode == '13'){
        addExpense();
    }
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
            $('#addExpense fieldset input').val('');
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

function editExpense(event){
    //todo
    $.ajax({
        type: 'PUT',
        url:  '/expenses/editexpense/' + $(this).attr('rel')
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
        url:  '/incomes/addincome', 
        dataType: 'JSON'
    }).done(function( response ){
        if(response.msg === 'success'){
            $('#addIncome fieldset input').val('');
        }
        else{
            console.log('Error Backend : %o', response.msg );
        }
    }).fail(function( response ){
        console.log('Error Ajax : %o', response);
    });
}

function loadIncomes(){
    $.ajax({
        type: 'GET',
        url:  '/incomes/loadincomes/'
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






