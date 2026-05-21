import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [ping, setPing] = useState('Loading...');

  useEffect(() => {
    fetch('/api/ping')
      .then((res) => res.json())
      .then((data) => setPing(data.message || 'pong'))
      .catch(() => setPing('Unable to reach backend'));
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Inventory Lane</h1>
        <p>React frontend + Express backend monorepo</p>
      </header>

      <main className="content">
        <section className="card">
          <h2>Backend status</h2>
          <p>{ping}</p>
        </section>
      </main>
    </div>
  );
}

export default App;
