import React, { useEffect, useState } from "react";

const SuraqJauap = ({ username }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [passed, setPassed] = useState(false);
    const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch("http://localhost:8000/suraqjauap");
                const data = await response.json();
                setQuizzes(data);
            } catch (error) {
                console.error("Failed to fetch quizzes:", error);
            }
        };

        fetchQuizzes();
    }, []);

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await fetch(`http://localhost:8000/user/progress/${username}`);
                const data = await response.json();
                setCurrentLevel(data.currentLevel);
            } catch (error) {
                console.error("Failed to fetch user progress:", error);
            }
        };

        fetchProgress();
    }, [username]);

    const handleAnswerSelect = (quizIndex, questionIndex, optionIndex) => {
        setAnswers((prevAnswers) => ({
            ...prevAnswers,
            [quizIndex]: {
                ...prevAnswers[quizIndex],
                [questionIndex]: optionIndex,
            },
        }));
    };

    const clearAnswer = (quizIndex, questionIndex) => {
        setAnswers((prevAnswers) => {
            const newAnswers = { ...prevAnswers };
            if (newAnswers[quizIndex]) {
                delete newAnswers[quizIndex][questionIndex];
                if (Object.keys(newAnswers[quizIndex]).length === 0) {
                    delete newAnswers[quizIndex];
                }
            }
            return newAnswers;
        });
    };

    const handleSubmit = async (e, quizIndex) => {
        e.preventDefault();
        const userAnswers = answers[quizIndex] || {};
        const quiz = quizzes[quizIndex];
        let correctCount = 0;

        quiz.questions.forEach((question, questionIndex) => {
            const selectedOptionIndex = userAnswers[questionIndex];
            const selectedOption = question.options[selectedOptionIndex];
            if (selectedOption && selectedOption.isCorrect) {
                correctCount += 1;
            }
        });

        const scorePercentage = (correctCount / quiz.questions.length) * 100;
        setScore(scorePercentage);
        setShowResults(true);
        setShowCorrectAnswers(true);
        const passed = scorePercentage >= 70;
        setPassed(passed);

        if (passed) {
            alert("Жарайсың! Сен де барлығы дұрыс.");
        }

        try {
            const response = await fetch("http://localhost:8000/user/progress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    quizId: quiz._id,
                    level: quiz.level,
                    score: scorePercentage,
                }),
            });

            const data = await response.json();
            if (data.passed && data.nextLevel) {
                setCurrentLevel(data.nextLevel);
                setShowResults(false); // Reset results to load the new level
                setAnswers({});
                setShowCorrectAnswers(false);
            }
        } catch (error) {
            console.error("Failed to save progress:", error);
        }
    };

    const handleTryAgain = () => {
        setAnswers({});
        setShowResults(false);
        setShowCorrectAnswers(false);
    };

    if (!quizzes.length) {
        return <div>Loading...</div>;
    }


    const currentQuiz = quizzes.find((quiz) => quiz.level === currentLevel);

    return (
        <div className="suraq content__body">
            <div className="container">
                <div className="suraq__inner">
                    <h1 className="suraq__title title">SURAQ - JAUAP</h1>
                    <div className="suraq-desc">
                        <h2 className="suraq-desc__title">Level {currentQuiz.level}</h2>
                        {currentQuiz ? (
                            <div key={currentQuiz._id} className="quiz-block">
                                <p className="suraq-desc__text">{currentQuiz.passage}</p>
                                <div style={{ marginTop: "50px" }}>
                                    <form onSubmit={(e) => handleSubmit(e, quizzes.indexOf(currentQuiz))}>
                                        {!showResults && currentQuiz.questions.map((question, questionIndex) => (
                                            <div key={questionIndex} className="question">
                                                <h3 className="question__title">
                                                    {questionIndex + 1 + ". " + question.text}
                                                </h3>
                                                <ul className="question__list">
                                                    {question.options.map((option, optionIndex) => (
                                                        <li key={optionIndex} className="question__item">
                                                            <label
                                                                className={`${
                                                                    showCorrectAnswers
                                                                        ? question.options[question.answer] === option
                                                                            ? 'correct-answer'
                                                                            : answers[quizzes.indexOf(currentQuiz)]?.[questionIndex] === optionIndex
                                                                                ? 'incorrect-answer'
                                                                                : ''
                                                                        : ''
                                                                }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name={`question-${currentQuiz._id}-${questionIndex}`}
                                                                    value={optionIndex}
                                                                    checked={answers[quizzes.indexOf(currentQuiz)]?.[questionIndex] === optionIndex}
                                                                    onChange={() => handleAnswerSelect(quizzes.indexOf(currentQuiz), questionIndex, optionIndex)}
                                                                    disabled={showCorrectAnswers}
                                                                />
                                                                {option.text}
                                                            </label>
                                                        </li>
                                                    ))}
                                                </ul>
                                                {answers[quizzes.indexOf(currentQuiz)]?.[questionIndex] !== undefined && (
                                                    <button
                                                        type="button"
                                                        className="clear-button"

                                                        onClick={() => clearAnswer(quizzes.indexOf(currentQuiz), questionIndex)}
                                                    >
                                                        Clear Selected Answer
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        {!showResults && <button className="button button_check" type="submit">Submit</button>}
                                    </form>
                                    {showResults && (
                                        <div className="suraq__results">
                                            <h2>Нәтиже</h2>
                                            <p>{score.toFixed(2)}%</p>
                                            {passed ? (
                                                <p>Керемет, келесі деңгейге өттің...</p>
                                            ) : (
                                                <button className="button button_restart" onClick={handleTryAgain}>Қайтадан бастау</button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p>No available quizzes at this level.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuraqJauap;
