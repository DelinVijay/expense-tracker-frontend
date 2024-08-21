import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css';

function ExpenseForm({ addExpense }) {
  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const expense = { item, price: parseFloat(price), date };

    try {
      const response = await axios.post('https://backend-node-beryl.vercel.app/api/v1/users/createExpense', expense);
      // Assuming the response contains the expense with a unique id
      addExpense(response.data); // Use the response data directly
      setItem('');
      setPrice('');
      setDate('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>
        <span>ENTER ITEM</span>
        <input
          type="text"
          value={item}
          onChange={(e) => setItem(e.target.value)}
          required
          className="input-box"
        />
      </label>
      <label>
        <span>ENTER PRICE</span>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="input-box"
        />
      </label>
      <label>
        <span>ENTER DATE</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="input-box"
        />
      </label>
      <button type="submit" className="btn">ADD</button>
    </form>
  );
}

export default ExpenseForm;
