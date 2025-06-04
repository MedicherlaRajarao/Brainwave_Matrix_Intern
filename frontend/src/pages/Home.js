import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpenseTable from './ExpenseTable';
import ExpenseDetails from './ExpenseDetails';
import ExpenseForm from './ExpenseForm';
import FinancialChart from './FinancialChart';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [incomeAmt, setIncomeAmt] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeComponent, setActiveComponent] = useState('dashboard');

    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Logged out');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    useEffect(() => {
        const amounts = expenses.map(item => item.amount);
        const income = amounts.filter(item => item > 0)
            .reduce((acc, item) => (acc += item), 0);
        const exp = amounts.filter(item => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1;
        setIncomeAmt(income);
        setExpenseAmt(exp);
    }, [expenses]);

    const deleteExpens = async (id) => {
        try {
            const url = `${APIUrl}/expenses/${id}`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                method: "DELETE"
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            handleSuccess(result?.message);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    };

    const fetchExpenses = async () => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    };

    const addTransaction = async (data) => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(data)
            };
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            const result = await response.json();
            handleSuccess(result?.message);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const navigateTo = (component) => {
        setActiveComponent(component);
    };

    const renderActiveComponent = () => {
        switch (activeComponent) {
            case 'details':
                return <ExpenseDetails incomeAmt={incomeAmt} expenseAmt={expenseAmt} />;
            case 'form':
                return <ExpenseForm addTransaction={addTransaction} />;
            case 'table':
                return <ExpenseTable expenses={expenses} deleteExpens={deleteExpens} />;
            case 'dashboard':
            default:
                return (
                    <div className="dashboard-content">
                        <h2>Dashboard Overview</h2>
                        <div className="dashboard-cards">
                            <div className="dashboard-card">
                                <h3>Total Balance</h3>
                                <p>₹{incomeAmt - expenseAmt}</p>
                            </div>
                            <div className="dashboard-card">
                                <h3>Total Income</h3>
                                <p className="income">₹{incomeAmt}</p>
                            </div>
                            <div className="dashboard-card">
                                <h3>Total Expenses</h3>
                                <p className="expense">₹{expenseAmt}</p>
                            </div>
                        </div>
                        <div className="chart-section">
          <h3>Financial Summary</h3>
          <FinancialChart income={incomeAmt} expense={expenseAmt} />
        </div>
                    </div>
                );
        }
    };

    return (
        <div className="app-container">
            {/* Header */}
            <header className="app-header">
                <div className="header-left">
                    <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <h1>Welcome, {loggedInUser}</h1>
                </div>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </header>

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <nav>
                    <ul>
                        <li>
                            <button 
                                className={activeComponent === 'dashboard' ? 'active' : ''}
                                onClick={() => navigateTo('dashboard')}
                            >
                                <i className="icon-dashboard"></i>
                                Dashboard
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeComponent === 'details' ? 'active' : ''}
                                onClick={() => navigateTo('details')}
                            >
                                <i className="icon-details"></i>
                                Expense Details
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeComponent === 'form' ? 'active' : ''}
                                onClick={() => navigateTo('form')}
                            >
                                <i className="icon-add"></i>
                                Add Expense
                            </button>
                        </li>
                        <li>
                            <button 
                                className={activeComponent === 'table' ? 'active' : ''}
                                onClick={() => navigateTo('table')}
                            >
                                <i className="icon-transactions"></i>
                                Transactions
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
            
            
            

            {/* Main Content */}
            <main className="main-content">
                {renderActiveComponent()}
            </main>
            

            <ToastContainer />
        </div>
    );
}

export default Home;