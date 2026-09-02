const express = require('express');
const appointmentsController = require('../controllers/appointments.controller');

const router = express.Router();

router.get('/', appointmentsController.getAll);
router.get('/:id', appointmentsController.getById);
router.post('/', appointmentsController.create);
router.put('/:id', appointmentsController.update);
router.delete('/:id', appointmentsController.remove);

module.exports = router;
