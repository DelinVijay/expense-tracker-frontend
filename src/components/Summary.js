import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles.css';
function Summary() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [noResultsMessage, setNoResultsMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch income and expenses on component mount
  const fetchIncomeAndExpenses = async () => {
    setIsLoading(true);
    try {
      const incomeResponse = await axios.get('https://backend-node-beryl.vercel.app/api/v1/users/readIncome');
      const incomeData = incomeResponse.data.data || [];
      setTotalIncome(incomeData.reduce((total, entry) => total + (entry.income || 0), 0));

      const expensesResponse = await axios.get('https://backend-node-beryl.vercel.app/api/v1/users/readExpense');
      const expenseData = expensesResponse.data.data || [];
      setTotalExpenses(expenseData.reduce((total, entry) => total + (entry.price || 0), 0));
      setFilteredExpenses(expenseData); // Initialize filtered expenses with all expenses
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeAndExpenses();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setNoResultsMessage('Please enter a search query.');
      setFilteredExpenses([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.get(`https://backend-node-beryl.vercel.app/api/v1/users/readSpecificExpense/?item=${searchQuery}`);
      const filtered = response.data.data || [];
      setFilteredExpenses(filtered);
      setNoResultsMessage(filtered.length === 0 ? 'No results found.' : '');
    } catch (error) {
      console.error('Error fetching filtered expenses:', error);
      setNoResultsMessage('Error fetching results.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all expenses?')) {
      try {
        setIsLoading(true);
        await axios.delete('https://backend-node-beryl.vercel.app/api/v1/users/deleteExpense');
        // Clear state and re-fetch data after successful deletion
        setTotalExpenses(0);
        setFilteredExpenses([]);
        setNoResultsMessage('All expenses have been cleared.');
        await fetchIncomeAndExpenses(); // Re-fetch data
      } catch (error) {
        console.error('Error clearing all expenses:', error);
        setNoResultsMessage('Error clearing expenses.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClear = async () => {
    if (window.confirm('Are you sure you want to clear your income?')) {
      try {
        setIsLoading(true);
        await axios.delete('https://backend-node-beryl.vercel.app/api/v1/users/deleteIncome');
        setTotalIncome(0);
        setNoResultsMessage('Income has been cleared.');
        await fetchIncomeAndExpenses(); // Re-fetch data
      } catch (error) {
        console.error('Error clearing income:', error);
        setNoResultsMessage('Error clearing income.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const balance = totalIncome - totalExpenses;

  return (
    <div className="summary">
      <h2>Summary</h2>
      <p>Total Income: {formatCurrency(totalIncome)}</p>
      <p>Total Expenses: {formatCurrency(totalExpenses)}</p>
      <p>Balance: {formatCurrency(balance)}</p>
      <button onClick={handleClearAll} className="btn btn-clear">Clear All Expenses</button>
      <button onClick={handleClear} className="btn btn-clear">Clear Your Income</button>
      <div className="search">
        <h3>Search Expenses</h3>
        <input
          type="text"
          placeholder="Search by item"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input-box"
        />
        <button onClick={handleSearch} className="btn">Search</button>
        <div className="results">
          {isLoading ? (
            <p>Loading...</p>
          ) : noResultsMessage ? (
            <p>{noResultsMessage}</p>
          ) : (
            filteredExpenses.length > 0 ? (
              filteredExpenses.map((expense, i) => (
                <div key={i} className="expense-item">
                  <p>Item: {expense.item}</p>
                  <p>Price: {formatCurrency(expense.price)}</p>
                </div>
              ))
            ) : (
              <p>No expenses to show.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
export default Summary;
