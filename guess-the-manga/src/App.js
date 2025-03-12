import { useState } from 'react';

const mangaData = [
  { 
    title: 'Naruto', 
    panels: ['/images/naruto1.png', '/images/naruto2.png', '/images/naruto3.png', '/images/naruto4.png', '/images/naruto5.png', '/images/naruto6.png']
  },
  { 
    title: 'Attack on Titan', 
    panels: ['/images/aot1.png', '/images/aot2.png', '/images/aot3.png', '/images/aot4.png', '/images/aot5.png', '/images/aot6.png']
  },
  { 
    title: 'One Piece', 
    panels: ['/images/onepiece1.png', '/images/onepiece2.png', '/images/onepiece3.png', '/images/onepiece4.png', '/images/onepiece5.png', '/images/onepiece6.png']
  }
];

export default function App() {
  const [currentManga, setCurrentManga] = useState(mangaData[Math.floor(Math.random() * mangaData.length)]);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [panelStage, setPanelStage] = useState(0);

  const handleGuess = (e) => {
    e.preventDefault();
    if (attempts >= 5) {
      setFeedback(`Game Over! The correct answer was: ${currentManga.title}`);
      return;
    }
    if (guess.trim().toLowerCase() === currentManga.title.toLowerCase()) {
      setFeedback('Correct!');
    } else {
      setFeedback('Incorrect...');
      if (panelStage < 5) {
        setPanelStage(panelStage+1);
      }
    }
    setGuess('');
    setAttempts(attempts+1)
  };

  return (
    <div style = {{ textAlign: 'center', padding: '20px' }}>
      <h1>Guess the Manga</h1>
      <img src={currentManga.panels[panelStage]} alt="Manga Panel" style={{ height: '300px', border: '2px solid black' }} />
      <form onSubmit={handleGuess}>
        <input 
        type='text'
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder='Enter guess'
        />
        <button type='submit'>Submit</button>
      </form>
      <p>{feedback}</p>
    </div>
  );
}
