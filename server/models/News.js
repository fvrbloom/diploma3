const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  sentence: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const News = mongoose.models.News || mongoose.model('News', newsSchema);

module.exports = News;
