// ExpenseDetails.js
import React from 'react';

function ExpenseDetails({ incomeAmt, expenseAmt }) {
    return (
        <div className="expense-details-container">
            <div className="balance-display">
                Your Balance is ₹{incomeAmt - expenseAmt}
            </div>
            <div className="amounts-container">
                <div className="amount-card income-card">
                    <h3>Income</h3>
                    <p className="amount">₹{incomeAmt}</p>
                </div>
                <div className="amount-card expense-card">
                    <h3>Expense</h3>
                    <p className="amount">₹{expenseAmt}</p>
                </div>
            </div>
        </div>
    );
}

export default ExpenseDetails;