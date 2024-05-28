const express = require("express");
const SuraqJauap = require("../models/SuraqJauap");

const router = express.Router();

// Route to handle quiz submission
router.post("/admin/suraqjauap", async (req, res) => {
    const { passage, questions } = req.body;

    try {
        // Get the current highest level
        const highestLevelQuiz = await SuraqJauap.findOne().sort({ level: -1 });
        const nextLevel = highestLevelQuiz ? highestLevelQuiz.level + 1 : 1;

        const newQuiz = new SuraqJauap({
            level: nextLevel,
            passage,
            questions: questions.map((question) => ({
                text: question.text,
                options: question.options.map((option, index) => ({
                    text: option,
                    isCorrect: question.correctOption === index,
                })),
            })),
        });

        await newQuiz.save();
        res.status(201).json({ message: "Quiz created successfully!", level: nextLevel });
    } catch (error) {
        console.error("Error creating quiz:", error);
        res.status(500).json({ message: "Failed to create quiz", error: error.message });
    }
});

// Route to fetch all quizzes
router.get("/suraqjauap", async (req, res) => {
    try {
        const quizzes = await SuraqJauap.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch quizzes", error });
    }
});

module.exports = router;
