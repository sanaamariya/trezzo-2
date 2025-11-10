const Sentiment = require('sentiment');
const sentiment = new Sentiment();

function analyze(text) {
  if (!text) return { score: 0, comparative: 0, label: 'neutral' };
  const result = sentiment.analyze(text);
  let label = 'neutral';
  if (result.score > 0) label = 'positive';
  else if (result.score < 0) label = 'negative';
  return { score: result.score, comparative: result.comparative, label };
}

module.exports = { analyze };