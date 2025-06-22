const express = require('express');
const router = express.Router();
const auth = require('../Middleware/authMiddleware');
const codeController = require('../Controllers/codeController');

router.post('/save', auth, codeController.saveCode);
router.get('/my-codes', auth, codeController.getUserCodes);
router.delete('/delete/:id',auth,codeController.deleteCodeSnippet);
module.exports = router;
