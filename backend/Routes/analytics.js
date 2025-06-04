// routes/analytics.js
const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

// Get financial data for charts
router.get('/financial-summary', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all expenses for the user
    const expenses = await Expense.find({ user: userId });
    
    // Calculate totals
    const income = expenses
      .filter(e => e.amount > 0)
      .reduce((sum, e) => sum + e.amount, 0);
      
    const expense = expenses
      .filter(e => e.amount < 0)
      .reduce((sum, e) => sum + Math.abs(e.amount), 0);
    
    // Get monthly breakdown
    const monthlyData = await Expense.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      { 
        $group: {
          _id: { 
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          income: {
            $sum: {
              $cond: [{ $gt: ["$amount", 0] }, "$amount", 0]
            }
          },
          expense: {
            $sum: {
              $cond: [{ $lt: ["$amount", 0] }, { $abs: "$amount" }, 0]
            }
          }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    res.json({
      totals: {
        income,
        expense,
        balance: income - expense
      },
      monthlyData
    });
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;