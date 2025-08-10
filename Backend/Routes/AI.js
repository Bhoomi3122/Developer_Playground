import express from 'express';
import { handleCodeInstruction } from '../Controllers/AIController.js';

const router = express.Router();

// POST /api/gemini/code-update
router.post('/', handleCodeInstruction);

export default router;
