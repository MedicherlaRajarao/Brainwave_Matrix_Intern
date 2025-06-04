// ExpenseForm.js
import React, { useState } from 'react';
import { handleError } from '../utils';

function ExpenseForm({ addTransaction }) {
    const [expenseInfo, setExpenseInfo] = useState({
        amount: '',
        text: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpenseInfo(prev => ({ ...prev, [name]: value }));
    };

    const addExpenses = (e) => {
        e.preventDefault();
        const { amount, text } = expenseInfo;
        if (!amount || !text) {
            handleError('Please add Expense Details');
            return;
        }
        addTransaction(expenseInfo);
        setExpenseInfo({ amount: '', text: '' });
    };

    return (
        <div className='expense-form-container'>
            <h1>Expense Tracker</h1>
            <form className='expense-form' onSubmit={addExpenses}>
                <div className="form-group">
                    <label htmlFor='text'>Expense Detail</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='text'
                        placeholder='Enter expense description...'
                        value={expenseInfo.text}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor='amount'>Amount</label>
                    <input
                        onChange={handleChange}
                        type='number'
                        name='amount'
                        placeholder='Enter amount...'
                        value={expenseInfo.amount}
                    />
                </div>
                <button className="submit-btn" type='submit'>Add Transaction</button>
            </form>
        </div>
    );
}

export default ExpenseForm;