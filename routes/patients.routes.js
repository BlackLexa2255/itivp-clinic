const express = require('express');
const patientsController = require('../controllers/patients.controller');

const router = express.Router();

router.get('/', patientsController.getAll);
router.get('/:id', patientsController.getById);
router.post('/', patientsController.create);
router.put('/:id', patientsController.update);
router.delete('/:id', patientsController.remove);

module.exports = router;
