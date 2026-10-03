const express = require('express');
const controller = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const schemas = require('../validation/schemas');

const router = express.Router();

router.post('/register', validate(schemas.register), controller.register);
router.post('/login', validate(schemas.login), controller.login);
router.get('/me', authenticate, controller.me);

module.exports = router;
