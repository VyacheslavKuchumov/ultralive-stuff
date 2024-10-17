const { client } = require('../models/clients');

// Function to get all clients
const getAllClients = async (req, res) => {
    try {
        const data = await client.findAll({});
        if (!data) {
            return res.status(404).send({ message: 'No clients found' });
        }
        return res.status(200).send(data);
    } catch (error) {
        console.error('Error fetching clients:', error);
        return res.status(500).send({ message: error.message });
    }
};

// Function to get a client by ID
const getClientById = async (req, res) => {
    try {
        const data = await client.findOne({ where: { client_id: req.params.id } });
        if (!data) return res.status(404).send({ message: 'Client not found' });
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to create a new client
const createClient = async (req, res) => {
    try {
        const { client_name } = req.body;
        const newClient = await client.create({ client_name });
        const data = await client.findAll({});
        if (!data) {
            return res.status(404).send({ message: 'No clients found' });
        }
        return res.status(201).send(data);
        
    } catch (error) {
        console.error('Error creating client:', error);
        return res.status(500).send({ message: error.message });
    }
};

// Function to update a client by ID
const editClientById = async (req, res) => {
    try {
        const id = req.params.id;
        const { client_name } = req.body;

        const clientToUpdate = await client.findByPk(id);
        if (!clientToUpdate) return res.status(404).send({ message: 'Client not found' });

        await clientToUpdate.update({ client_name });
        const data = await client.findAll({});
        if (!data) {
            return res.status(404).send({ message: 'No clients found' });
        }
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to delete a client by ID
const deleteClientById = async (req, res) => {
    try {
        const id = req.params.id;
        const clientToDelete = await client.findByPk(id);

        if (!clientToDelete) return res.status(404).send({ message: 'Client not found' });

        await clientToDelete.destroy();

        const data = await client.findAll({});
        if (!data) {
            return res.status(404).send({ message: 'No clients found' });
        }
        return res.status(200).send(data);
        
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Exporting the functions
module.exports = {
    getAllClients,
    getClientById,
    createClient,
    editClientById,
    deleteClientById
};
