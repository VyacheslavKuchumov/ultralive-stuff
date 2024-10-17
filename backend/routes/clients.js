const express = require('express');
const router = express.Router();

const {
    getAllClients,
    getClientById,
    createClient,
    editClientById,
    deleteClientById
} = require('../controllers/clients');

router.get('/', getAllClients);
router.get('/:id', getClientById);
router.post('/', createClient);
router.put('/:id', editClientById);
router.delete('/:id', deleteClientById);

module.exports = router;
