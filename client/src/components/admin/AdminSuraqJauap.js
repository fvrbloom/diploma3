import React, { useState } from "react";

const AdminSuraqJauap = () => {
    const [questions, setQuestions] = useState([{ text: "", options: ["", "", "", ""], correctOption: null }]);
    const [passage, setPassage] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [level, setLevel] = useState(null);

    const handlePassageChange = (e) => {
        setPassage(e.target.value);
    };

    const handleQuestionChange = (index, e) => {
        const newQuestions = [...questions];
        newQuestions[index].text = e.target.value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (questionIndex, optionIndex, e) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].options[optionIndex] = e.target.value;
        setQuestions(newQuestions);
    };

    const handleCorrectOptionChange = (questionIndex, optionIndex) => {
        const newQuestions = [...questions];
        newQuestions[questionIndex].correctOption = optionIndex;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { text: "", options: ["", "", "", ""], correctOption: null }]);
    };

    const deleteQuestion = (index) => {
        const newQuestions = questions.filter((_, questionIndex) => questionIndex !== index);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if all fields are filled
        if (passage.trim() === "" || questions.some(q => q.text.trim() === "" || q.options.some(o => o.trim() === "") || q.correctOption === null)) {
            alert("All fields are required, and a correct option must be selected for each question!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8000/admin/suraqjauap", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ passage, questions }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Quiz created successfully at level ${data.level}!`);
                setLevel(data.level);
                setPassage("");
                setQuestions([{ text: "", options: ["", "", "", ""], correctOption: null }]);
            } else {
                const data = await response.json();
                alert(`Failed to create quiz: ${data.message}`);
            }
        } catch (error) {
            alert("An error occurred while creating the quiz");
        }
    };

    return (
        <div>
            <h1>Admin Suraq Jauap</h1>
            {level && <p> New level: {level+1}</p>}
            <button onClick={() => setShowForm(!showForm)} className="admin-button">
                {showForm ? "Hide Form" : "Add Level"}
            </button>
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Passage:</label>
                        <textarea
                            value={passage}
                            onChange={handlePassageChange}
                            rows="4"
                            cols="50"
                            placeholder="Enter the passage here..."
                            required
                        />
                    </div>
                    {questions.map((question, questionIndex) => (
                        <div key={questionIndex} className="question-block">
                            <label>Question {questionIndex + 1}:</label>
                            <input
                                type="text"
                                value={question.text}
                                onChange={(e) => handleQuestionChange(questionIndex, e)}
                                placeholder={`Enter question ${questionIndex + 1}`}
                                required
                            />
                            <div className="options">
                                {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex}>
                                        <label>Option {optionIndex + 1}:</label>
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => handleOptionChange(questionIndex, optionIndex, e)}
                                            placeholder={`Enter option ${optionIndex + 1}`}
                                            required
                                        />
                                        <input
                                            type="radio"
                                            name={`correctOption-${questionIndex}`}
                                            checked={question.correctOption === optionIndex}
                                            onChange={() => handleCorrectOptionChange(questionIndex, optionIndex)}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>
                            <button type="button" className="admin-button delete-button" onClick={() => deleteQuestion(questionIndex)}>Delete Question</button>
                        </div>
                    ))}
                    <button type="button" className="admin-button" onClick={addQuestion}>Add Question</button>
                    <button type="submit" className="admin-button">Submit</button>
                </form>
            )}
        </div>
    );
};

export default AdminSuraqJauap;