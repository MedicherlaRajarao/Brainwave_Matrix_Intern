// ExpenseTable.js
import React from 'react';

const ExpenseTable = ({ expenses, deleteExpens }) => {
    return (
        <div className="expense-list-container">
            <h2>Transactions</h2>
            <div className="expense-list">
                {expenses.length === 0 ? (
                    <p className="empty-state">No transactions yet</p>
                ) : (
                    expenses.map((expense, index) => (
                        <div key={index} className="expense-item">
                            <div className="expense-description">{expense.text}</div>
                            <div className={`expense-amount ${expense.amount > 0 ? 'income' : 'expense'}`}>
                                ₹{Math.abs(expense.amount)}
                            </div>
                            <button 
                                className="delete-button" 
                                onClick={() => deleteExpens(expense._id)}
                                aria-label="Delete transaction"
                            >
                                ×
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ExpenseTable;