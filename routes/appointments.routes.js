const express = require('express');
const controller = require('../controllers/appointments.controller');
const { authenticate } = require('../middleware/auth');
const { roleGuard } = require('../middleware/roleGuard');
const { validate } = require('../middleware/validate');
const schemas = require('../validation/schemas');

const router = express.Router();

router.get('/', validate(schemas.appointmentQuery, 'query'), controller.getAll);
router.get('/:id', validate(schemas.idParam, 'params'), controller.getById);
router.post('/', authenticate, validate(schemas.appointment), controller.create);
router.put('/:id', authenticate, validate(schemas.idParam, 'params'), validate(schemas.appointment), controller.update);
router.delete('/:id', authenticate, roleGuard('admin'), validate(schemas.idParam, 'params'), controller.remove);

module.exports = router;
