const mongoose = require('mongoose');

const CodeSnippetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  name: { type: String, default: 'Untitled Code' }, // replaces 'title'
  
  tags: [{ type: String }], // array of tags like ["HTML", "CSS", "JavaScript"]
  
  html: { type: String, default: '' },
  css: { type: String, default: '' },
  js: { type: String, default: '' },

  // optional: id field (optional, MongoDB already generates _id)
  // id: { type: String }, // only if you want a custom string ID

}, { timestamps: true });

module.exports = mongoose.model('CodeSnippet', CodeSnippetSchema);
