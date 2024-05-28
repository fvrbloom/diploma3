import React, { useEffect, useState } from "react";

const SuraqJauap = ({ username }) => {
    const [quizzes, setQuizzes] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(1);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [passed, setPassed] = useState(false);

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

    const handleAnswerChange = (quizIndex, questionIndex, optionIndex) => {
        setAnswers({
            ...answers,
            [quizIndex]: {
                ...answers[quizIndex],
                [questionIndex]: optionIndex,
            },
        });
    };

    const clearAnswer = (quizIndex, questionIndex) => {
        const newAnswers = { ...answers };
        if (newAnswers[quizIndex]) {
            delete newAnswers[quizIndex][questionIndex];
            if (Object.keys(newAnswers[quizIndex]).length === 0) {
                delete newAnswers[quizIndex];
            }
        }
        setAnswers(newAnswers);
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
        setPassed(scorePercentage >= 70);

        try {
            console.log("Sending progress data:", {
                username,
                quizId: quiz._id,
                level: quiz.level,
                score: scorePercentage,
            });
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
            }
        } catch (error) {
            console.error("Failed to save progress:", error);
        }
    };

    const handleTryAgain = () => {
        setAnswers({});
        setShowResults(false);
    };

    if (!quizzes.length) {
        return <div>Loading...</div>;
    }

    const currentQuiz = quizzes.find((quiz) => quiz.level === currentLevel);

    return (
        <div>
            <h1>Suraq Jauap Quizzes</h1>
            {currentQuiz ? (
                <div key={currentQuiz._id} className="quiz-block">
                    <p>{currentQuiz.passage}</p>
                    <form onSubmit={(e) => handleSubmit(e, quizzes.indexOf(currentQuiz))}>
                        {!showResults && currentQuiz.questions.map((question, questionIndex) => (
                            <div key={questionIndex} className="question-block">
                                <p>{question.text}</p>
                                <div className="options">
                                    {question.options.map((option, optionIndex) => (
                                        <div key={optionIndex}>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name={`question-${currentQuiz._id}-${questionIndex}`}
                                                    value={optionIndex}
                                                    checked={answers[quizzes.indexOf(currentQuiz)]?.[questionIndex] === optionIndex}
                                                    onChange={() => handleAnswerChange(quizzes.indexOf(currentQuiz), questionIndex, optionIndex)}
                                                />
                                                {option.text}
                                            </label>
                                        </div>
                                    ))}
                                </div>
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
                        {!showResults && <button type="submit">Submit</button>}
                    </form>
                    {showResults && (
                        <div className="results">
                            <h2>Results</h2>
                            <p>Your Score: {score.toFixed(2)}%</p>
                            {passed ? (
                                <p>Excellent! Proceeding to next level...</p>
                            ) : (
                                <button onClick={handleTryAgain}>Try Again</button>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <p>No available quizzes at this level.</p>
            )}
            <div className="levels">
                <h2>Available Levels</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Level</th>
                            <th>Passage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map((quiz) => (
                            <tr key={quiz._id}>
                                <td>{quiz.level}</td>
                                <td>{quiz.passage}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SuraqJauap;
