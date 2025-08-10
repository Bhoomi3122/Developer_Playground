import mongoose from 'mongoose';

const CodeSnippetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'Untitled Code' },
  tags: [{ type: String }],
  html: { type: String, default: '' },
  css: { type: String, default: '' },
  js: { type: String, default: '' }
}, { timestamps: true });

const CodeSnippet = mongoose.model('CodeSnippet', CodeSnippetSchema);

export default CodeSnippet;
