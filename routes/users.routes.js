const express = require('express');
const controller = require('../controllers/users.controller');
const { authenticate } = require('../middleware/auth');
const { roleGuard } = require('../middleware/roleGuard');
const { validate } = require('../middleware/validate');
const schemas = require('../validation/schemas');

const router = express.Router();

// Список пользователей доступен модератору и администратору, удаление – только администратору
router.get('/', authenticate, roleGuard('moderator'), controller.getAll);
router.delete('/:id', authenticate, roleGuard('admin'), validate(schemas.idParam, 'params'), controller.remove);

module.exports = router;
