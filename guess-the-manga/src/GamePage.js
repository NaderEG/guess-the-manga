import { useState, useEffect } from "react";
import { mangaData } from './mangaData';
import { useParams } from "react-router-dom";

const getDailyMangaIndex = (day, mangaListLength) => {
  return day % mangaListLength;
};

const getDaysSinceStart = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = now - start;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

export default function GamePage() {
  const { day } = useParams();
  const dayIndex = parseInt(day, 10) || getDaysSinceStart("2025-03-23");

  const savedProgress = JSON.parse(localStorage.getItem(`progress_${dayIndex}`)) || {
    attempts: 0,
    revealedHints: [''],
    feedback: "",
    gameOver: false,
  };
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState(savedProgress.feedback);
  const [attempts, setAttempts] = useState(savedProgress.attempts);
  const [panelStage, setPanelStage] = useState(0);
  const [hintIndex, setHintIndex] = useState(0);
  const [currentView, setCurrentView] = useState(savedProgress.attempts > 5 ? 5 : savedProgress.attempts);
  const [revealedHints, setRevealedHints] = useState(savedProgress.revealedHints);
  const [suggestions, setSuggestions] = useState([]);
  const [gameOver, setGameOver] = useState(savedProgress.gameOver);


  const mangaIndex = getDailyMangaIndex(dayIndex-1, mangaData.length);
  const currentManga = mangaData[mangaIndex];

  useEffect(() => {
    localStorage.setItem(
      `progress_${dayIndex}`,
      JSON.stringify({ attempts, revealedHints, feedback, gameOver })
    );
  }, [attempts, revealedHints, feedback, gameOver, dayIndex]);

  const handleGuess = (e) => {
    e.preventDefault();
    setSuggestions([]);
    if (guess.trim().toLowerCase() === currentManga.title.toLowerCase()) {
      setGameOver(true);
      setFeedback(`✅ Correct! The correct answer was: ${currentManga.title}`);
      return;
    }

    if (attempts >= 5) {
      setGameOver(true);
      setAttempts(attempts + 1)
      setFeedback(`❌ Game Over! The correct answer was: ${currentManga.title}`);
      return;
    }

    setFeedback('❌ Incorrect...');

    if (panelStage < 2) {
      setPanelStage(panelStage + 1);
    }

    if (hintIndex < currentManga.hints.length) {
      setRevealedHints([...revealedHints, currentManga.hints[hintIndex]]);
      setHintIndex(hintIndex + 1);
    }

    setGuess('');
    setAttempts(attempts + 1);
    setCurrentView(attempts + 1);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setGuess(value);

    if (value.length > 1) {
      const filteredSuggestions = mangaData
        .filter(manga => manga.title.toLowerCase().includes(value) || manga.secondaryTitle.toLowerCase().includes(value))
        .map(manga => manga.title);

      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div style={{
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#121212',
      minHeight: '100vh',
      color: '#ffffff',
    }}>
      <h1>Guess the Manga: Day {dayIndex}</h1>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Manga Panel */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          {/* Hint Box in Top Left of Image */}
          {currentView < revealedHints.length && (
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              backgroundColor: 'rgba(128, 128, 128, 0.8)',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '14px'
            }}>
              {revealedHints[currentView]}
            </div>
          )}

          <img
            src={currentManga.panels[currentView]}
            alt="Manga Panel"
            style={{ height: '300px', border: '2px solid black' }}
          />
        </div>
        {/* Guess Counter UI */}
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '5px' }}>
            {Array.from({ length: 6 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentView(index) && setHintIndex(index - 1)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: currentView === index ? '#555' : '#222',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  opacity: index <= attempts ? 1 : 0.5,
                  pointerEvents: index <= attempts ? 'auto' : 'none'
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
          
        </div>
      </div>
      
      {!gameOver ? (
        
        <div>
          <p>
            {attempts < 6
              ? `${6 - attempts} ${6 - attempts === 1 ? 'guess' : 'guesses'} remaining!`
              : ''}
          </p>
        <form onSubmit={handleGuess} style={{ marginTop: '15px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <input
              type='text'
              value={guess}
              onChange={handleInputChange}
              placeholder='Enter manga title...'
              style={{
                width: '250px',
                padding: '10px',
                borderRadius: '20px',
                border: '2px solid #444',
                backgroundColor: '#222',
                color: '#fff',
                fontSize: '16px',
                outline: 'none',
              }}
            />

            {suggestions.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '40px',  // Aligns below input
                left: '0',
                backgroundColor: '#222',
                color: 'white',
                width: '100%',  // Matches input width
                borderRadius: '10px',
                padding: '5px 0',
                boxShadow: '0px 4px 8px rgba(0,0,0,0.3)',
                zIndex: 10,
              }}>
                {suggestions.map((title, index) => (
                  <div
                    key={index}
                    onClick={() => { setGuess(title); setSuggestions([]); }} 
                    style={{
                      padding: '8px',
                      cursor: 'pointer',
                      transition: '0.2s',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    {title}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type='submit'
            style={{
              marginLeft: '10px',
              padding: '10px 20px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: '#2e51a2', // Vibrant blue
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: '0.2s ease-in-out',
            }}
          >
            Submit
          </button>
        </form>
        <p>{feedback}</p>
      </div>) : (<div>
        {attempts <= 5 ? (
          <div>
            <p>Good Job!</p><p>{feedback}</p>
          </div>
        ) : (<p>{feedback}</p>)}
        <button onClick={() => {
          var result = ''
          if (feedback.includes('✅')) {
            result = result + '🟥'.repeat(attempts) + '🟩'
          } else {
            result = result + '🟥'.repeat(attempts)
          }
          const shareText = `#GuessTheManga #23\n\n${result}\n\nhttps://GuessTheManga.com/23`;
          navigator.clipboard.writeText(shareText);

          alert('Copied to clipboard!');
        }}
        style={{
          marginTop: '15px',
          padding: '10px 20px',
          borderRadius: '20px',
          backgroundColor: '#2e51a2',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 'bold',
          transition: 'background-color 0.3s',
        }}>
          Share Result
        </button>
      </div>
    
    )}
    </div>
  );
}
