const { equipment } = require('../models/equipment');
const { warehouse } = require('../models/warehouses');
const { equipment_type } = require('../models/equipment_types');
const { where } = require('sequelize');


// Function to get all equipment
const getAllEquipment = async (req, res) => {
    try {
        const data = await equipment.findAll({
            include: [
            {
              model: equipment_type,
              as: 'type',
              attributes: ['equipment_type_name'] // Specify the fields to fetch from `equipment_type`
            },
            {
              model: warehouse,
              as: 'storage',
              attributes: ['warehouse_name'] // Specify the fields to fetch from `warehouse`
            }
          ]
        });
        if (!data) return res.status(404).send({ message: 'Equipment not found' });
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

// Function to get equipment by ID
const getEquipmentById = async (req, res) => {
    try {
        const data = await equipment.findOne({ where: { equipment_id: req.params.id }, include: [
            {
              model: equipment_type,
              as: 'equipmentToEquipmentType',
              attributes: ['equipment_type_name'] // Specify the fields to fetch from `equipment_type`
            },
            {
              model: warehouse,
              as: 'equipmentToPlaceOfStorage',
              attributes: ['warehouse_name'] // Specify the fields to fetch from `warehouse`
            }
          ]
        });
        if (!data) return res.status(404).send({ message: 'Equipment not found' });
        return res.json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to add one equipment
const addOneEquipment = async (req, res) => {
    try {
        const { equipment_name, serial_number, equipment_type_name, warehouse_name, needs_maintenance, date_of_purchase, cost_of_purchase } = req.body; // Add all required fields
        
        const foundWarehouse = await warehouse.findOne({where: {warehouse_name: warehouse_name}})
        const foundEquipmentType = await equipment_type.findOne({where: {equipment_type_name: equipment_type_name}})
        
        if (foundWarehouse && foundEquipmentType){
            const newEquipment = await equipment.create({
                equipment_name,
                serial_number,
                equipment_type: foundEquipmentType.equipment_type_id,
                place_of_storage: foundWarehouse.warehouse_id,
                needs_maintenance,
                date_of_purchase,
                cost_of_purchase,
            });
            const data = await equipment.findAll({include: [
                {
                  model: equipment_type,
                  as: 'type',
                  attributes: ['equipment_type_name'] // Specify the fields to fetch from `equipment_type`
                },
                {
                  model: warehouse,
                  as: 'storage',
                  attributes: ['warehouse_name'] // Specify the fields to fetch from `warehouse`
                }
              ]
            });
        }else return res.status(500).send({ message: "something wrong with warehouses and equipment types...." });
        
        return res.status(201).json(data);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

// Function to edit equipment by ID
const editEquipmentById = async (req, res) => {
    try {
        const id = req.params.id;
        const { equipment_name, serial_number, equipment_type_name, warehouse_name, needs_maintenance, date_of_purchase, cost_of_purchase } = req.body; 
        
        const foundWarehouse = warehouse.findOne({where: {warehouse_name: warehouse_name}})
        const foundEquipmentType = equipment_type.findOne({where: {equipment_type_name: equipment_type_name}})
        const equipmentToUpdate = await equipment.findByPk(id);

        if (!equipmentToUpdate) return res.status(404).send({ message: 'Equipment not found' });

        await equipmentToUpdate.update({
            equipment_name,
            serial_number,
            equipment_type: foundEquipmentType.equipment_type_id,
            place_of_storage: foundWarehouse.warehouse_id,
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
