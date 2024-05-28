const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
});

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    options: [optionSchema],
});

const suraqJauapSchema = new mongoose.Schema({
    level: { type: Number, required: true, unique: true },
    passage: { type: String, required: true },
    questions: [questionSchema],
});

const SuraqJauap = mongoose.model("SuraqJauap", suraqJauapSchema);

module.exports = SuraqJauap;
