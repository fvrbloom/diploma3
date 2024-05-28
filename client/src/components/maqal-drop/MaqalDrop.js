import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

const ItemType = 'WORD';

const Word = ({ word, index, moveWord }) => {
  const [, ref] = useDrag({
    type: ItemType,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (item.index !== index) {
        moveWord(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="word-container">
      {word}
    </div>
  );
};

const NewsArticle = ({ article, onLevelComplete, currentLevel }) => {
  const [shuffledWords, setShuffledWords] = useState([]);
  const [message, setMessage] = useState('');
  const [levelUp, setLevelUp] = useState(false);

  useEffect(() => {
    const words = article.sentence.split(/(\s+|[.,!?;])/).filter(word => word.trim().length > 0);
    setShuffledWords(shuffleArray(words.slice()));
  }, [article.sentence]);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const moveWord = useCallback((fromIndex, toIndex) => {
    setShuffledWords((prevWords) =>
      update(prevWords, {
        $splice: [
          [fromIndex, 1],
          [toIndex, 0, prevWords[fromIndex]],
        ],
      })
    );
  }, []);

  const checkOrder = () => {
    const correctOrder = article.sentence.split(/(\s+|[.,!?;])/).filter(word => word.trim().length > 0);
    if (JSON.stringify(shuffledWords) === JSON.stringify(correctOrder)) {
      setMessage('Керемет!');
      setLevelUp(true);
      onLevelComplete();
    } else {
      setMessage('Дұрыс емес. Қайтадан қараңыз.');
      setLevelUp(false);
    }
  };

  return (
    <div className="news-article">
      <DndProvider backend={HTML5Backend}>
        <div className="level-indicator">
          <p className="level-up">Level {currentLevel + 1}</p>
          <div className="words-container">
            {shuffledWords.map((word, index) => (
              <Word key={index} index={index} word={word} moveWord={moveWord} />
            ))}
          </div>
        </div>
      </DndProvider>
      <img className="maqal-check" src='./icons/square-check-solid (1).svg' onClick={checkOrder} alt="Check order" />
      {message && <p className="message">{message}</p>}
      <hr className="separator" />
    </div>
  );
};

function MaqalDrop() {
  const [news, setNews] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/news');
        setNews(response.data.reverse()); // Reverse the order of news items here
      } catch (error) {
        console.error(error);
      }
    };
    fetchNews();
  }, []);

  const handleLevelComplete = () => {
    setCurrentLevel(prevLevel => prevLevel + 1);
  };

  return (
    <div className="maqal content__body">
      <div className='container'>
        <div className='maqal__inner'>
          <h1 className='maqal__title title'>MAQAL DROP</h1>
          <div className="maqal-section">
            {news.length === 0 ? (
              <p className='maqal-soz'>No news available</p>
            ) : (
              news.map((article, index) => (
                index <= currentLevel && (
                  <NewsArticle key={article._id} article={article} onLevelComplete={handleLevelComplete} currentLevel={index} />
                )
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MaqalDrop;
