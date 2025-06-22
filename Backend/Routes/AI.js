const express = require('express');
const router = express.Router();
const { handleCodeInstruction } = require('../Controllers/AIController');

// POST /api/gemini/code-update
router.post('/', handleCodeInstruction);

module.exports = router;
