import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css';

function IncomeForm({ setIncome }) {
  const [income, setAmount] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = { income: parseFloat(income), date:date };

    try {
      await axios.post('https://backend-node-beryl.vercel.app/api/v1/users/createIncome', amount); // Ensure this matches your backend route
      setIncome((prevIncome) => [...prevIncome, amount]);
      setAmount('');
      setDate('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <label>
        <span>ENTER INCOME</span>
        <input
          className="input-box"
          type="number"
          value={income}
          onChange={(e) => setAmount(e.target.value)}
          required
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

export default IncomeForm;
