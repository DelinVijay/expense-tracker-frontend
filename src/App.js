import React, { useState } from 'react';
import ExpenseForm from './components/ExpenseForm';
import IncomeForm from './components/IncomeForm';
import Summary from './components/Summary';
import './styles.css';

function App() {
  const [income, setIncome] = useState([]); // Initialize as an empty array
  const [expenses, setExpenses] = useState([]);
  const [expenseList, setExpenseList] = useState([]);

  const addExpense = (expense) => {
    setExpenses((prevExpenses) => [...prevExpenses, expense.price]);
    setExpenseList((prevList) => [...prevList, expense]);
  };

  const addIncome = (income) => {
    setIncome((prevIncome) => [...prevIncome, income]);
  };

  return (
    <div className="app">
      <div className="main-content">
        <IncomeForm setIncome={addIncome} />
        <ExpenseForm addExpense={addExpense} />
      </div>
      <Summary income={income} expenses={expenseList} />
    </div>
  );
}

export default App;
