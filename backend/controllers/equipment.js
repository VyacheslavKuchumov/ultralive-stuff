const { equipment } = require('../models/equipment');

// Function to get all equipment
const getAllEquipment = async (req, res) => {
    try {
        const data = await equipment.findAll({});
        if (!data) return res.status(404).send({ message: 'Equipment not found' });
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

// Function to get equipment by ID
const getEquipmentById = async (req, res) => {
    try {
        const data = await equipment.findOne({ where: { equipment_id: req.params.id } });
        if (!data) return res.status(404).send({ message: 'Equipment not found' });
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to add one equipment
const addOneEquipment = async (req, res) => {
    try {
        const { equipment_name, serial_number, place_of_storage, current_place_of_storage, needs_maintenance, date_of_purchase, cost_of_purchase } = req.body; // Add all required fields
        console.log
        const newEquipment = await equipment.create({
            equipment_name,
            serial_number,
            place_of_storage: parseInt(place_of_storage),
            current_place_of_storage: parseInt(current_place_of_storage) || null,
            needs_maintenance,
            date_of_purchase,
            cost_of_purchase,
        });
        const data = await equipment.findAll({});
        return res.status(201).json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to edit equipment by ID
const editEquipmentById = async (req, res) => {
    try {
        const id = req.params.id;
        const { equipment_name, serial_number, place_of_storage, current_place_of_storage, needs_maintenance, date_of_purchase, cost_of_purchase } = req.body; // Update all relevant fields
        const equipmentToUpdate = await equipment.findByPk(id);

        if (!equipmentToUpdate) return res.status(404).send({ message: 'Equipment not found' });

        await equipmentToUpdate.update({
            equipment_name,
            serial_number,
            place_of_storage,
            current_place_of_storage,
            needs_maintenance,
            date_of_purchase,
            cost_of_purchase,
        });
        const data = await equipment.findAll({});
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to delete equipment by ID
const deleteEquipmentById = async (req, res) => {
    try {
        const id = req.params.id;
        const equipmentToDelete = await equipment.findByPk(id);

        if (!equipmentToDelete) return res.status(404).send({ message: 'Equipment not found' });

        await equipmentToDelete.destroy();
        const data = await equipment.findAll({});
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Exporting the functions
module.exports = {
    getAllEquipment,
    addOneEquipment,
    editEquipmentById,
    deleteEquipmentById,
    getEquipmentById
}
