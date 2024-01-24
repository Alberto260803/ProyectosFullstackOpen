import { useState } from 'react';

const Button = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ good, neutral, bad, all, avg, positive }) => {
  if (all === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    );
  }

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={all} />
          <StatisticLine text="average" value={avg} />
          <StatisticLine text="positive" value={`${positive} %`} />
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [all, setAll] = useState(0);
  const [avg, setAvg] = useState(0);
  const [positive, setPositive] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);
    const updatedGood = good + 1;
    const total = updatedGood + neutral + bad;
    setAll(total);
    setAvg((updatedGood - bad) / total);
    setPositive((updatedGood / total) * 100);
  };

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
    const updatedNeutral = neutral + 1;
    const total = good + updatedNeutral + bad;
    setAll(total);
    setPositive((good / total) * 100);
  };

  const handleBadClick = () => {
    setBad(bad + 1);
    const updatedBad = bad + 1;
    const total = good + neutral + updatedBad;
    setAll(total);
    setAvg((good - updatedBad) / total);
    setPositive((good / total) * 100);
  };

  return (
    <div>
      <h1>give feedback</h1>
      <Button onClick={handleGoodClick} text="good" />
      <Button onClick={handleNeutralClick} text="neutral" />
      <Button onClick={handleBadClick} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} all={all} avg={avg} positive={positive} />
    </div>
  );
};

export default App;
