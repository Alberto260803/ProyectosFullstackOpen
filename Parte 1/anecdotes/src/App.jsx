import { useState } from 'react';

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast is to go well.'
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  const handleNextAnecdote = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    setSelected(randomIndex);
  };

  const handleVote = () => {
    // Hacer una copia del array de votos para mantener la inmutabilidad del estado
    const newVotes = [...votes];
    // Incrementar el voto para la anécdota seleccionada
    newVotes[selected] += 1;
    // Actualizar el estado con los nuevos votos
    setVotes(newVotes);
  };

  // Encontrar el índice de la anécdota con el mayor número de votos
  const indexOfMaxVotes = votes.indexOf(Math.max(...votes));

  return (
    <div>
      <h2>Anecdote of the day</h2>
      <p>{anecdotes[selected]}</p>
      <p>Votes: {votes[selected]}</p>
      <button onClick={handleVote}>Vote</button>
      <button onClick={handleNextAnecdote}>Next anecdote</button>

      <h2>Top Voted Anecdote</h2>
      {votes[indexOfMaxVotes] > 0 ? (
        <>
          <p>{anecdotes[indexOfMaxVotes]}</p>
          <p>Votes: {votes[indexOfMaxVotes]}</p>
        </>
      ) : (
        <p>No votes yet</p>
      )}
    </div>
  );
};

export default App;
