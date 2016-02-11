var expensesData = [];

$(document).ready(function(){
    populateExpenses();
});

$('#buttonAddExpense').on('click', addExpense);

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

