import express from 'express';
import auth from '../Middleware/authMiddleware.js';
import {
  saveCode,
  getUserCodes,
  deleteCodeSnippet
} from '../Controllers/codeController.js';

const router = express.Router();

router.post('/save', auth, saveCode);
router.get('/my-codes', auth, getUserCodes);
router.delete('/delete/:id', auth, deleteCodeSnippet);

export default router;
