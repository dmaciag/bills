var expensesData = [];

$(document).ready(function(){
    populateExpenses();
});

function populateExpenses(){
    var expensesContent = '';
    $.getJSON( '/expenses/expenselist', function(expenses){
        expensesData = expenses;
        $.each(expenses, function(){
            expensesContent += '<tr>';
            expensesContent += '<td>' + this.name + '</td>';
            expensesContent += '<td>' + this.type + '</td>';
            expensesContent += '<td>' + this.fee  + '</td>';
            expensesContent += '<td>' + this.day_of_month  + '</td>';
            expensesContent += '<td>' + '<a href="#" class="delete_expense" rel="' + this._id + '">delete</a>' + '</td>';
            expensesContent += '<tr>';
        });

        $('#expenseList table tbody').html(expensesContent);
    });
}

function addExpense(event){
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
        if(response.msg === 'good'){
            $('#addExpense fieldset input').val('');
            populateExpenses();
        }
        else{
            console.log('Error Backend : %o', response.msg );
        }
    }).fail(function( response ){
        console.log('Error Ajax : %o', response);
    });
};
