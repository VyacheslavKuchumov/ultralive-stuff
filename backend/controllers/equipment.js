const { equipment } = require("../models/equipment");
const { warehouse } = require("../models/warehouses");
const { equipment_set } = require("../models/equipment_sets");
const { set_type } = require("../models/set_types");
const { project } = require("../models/projects");

const getAllEquipment = async (req, res) => {
  try {
    const data = await equipment.findAll({
      include: [
        {
          model: equipment_set,
          as: "equipment_set",
          attributes: ["equipment_set_name"],
          include: [
            {
              model: set_type,
              as: "type",
            },
          ],
        },
        {
          model: warehouse,
          as: "storage",
          attributes: ["warehouse_name"],
        },
        {
          model: project,
        },
      ],
    });

    if (!data) {
      return res.status(404).send({ message: "No equipment found" });
    }

    return res.json(data);
  } catch (error) {
    console.error("Error fetching equipment:", error); // Log the specific error
    return res.status(500).send({ message: error.message });
  }
};

// Function to get equipment by ID
const getEquipmentById = async (req, res) => {
  try {
    const data = await equipment.findOne({
      where: { equipment_id: req.params.id },
      include: [
        {
          model: equipment_set,
          as: "equipment_set",
          attributes: ["equipment_set_name"], // Specify the fields to fetch from `equipment_set`
        },
        {
          model: warehouse,
          as: "storage",
          attributes: ["warehouse_name"], // Specify the fields to fetch from `warehouse`
        },
      ],
    });
    if (!data) return res.status(404).send({ message: "Equipment not found" });
    return res.json(data);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Function to add one equipment
const createEquipment = async (req, res) => {
  try {
    const {
      equipment_name,
      serial_number,
      equipment_set_name,
      warehouse_name,
      needs_maintenance,
      date_of_purchase,
      cost_of_purchase,
    } = req.body; // Add all required fields

    const foundWarehouse = await warehouse.findOne({
      where: { warehouse_name: warehouse_name },
    });
    const foundEquipmentSet = await equipment_set.findOne({
      where: { equipment_set_name: equipment_set_name },
    });

    if (foundWarehouse && foundEquipmentSet) {
      const newEquipment = await equipment.create({
        equipment_name,
        serial_number,
        equipment_set_id: foundEquipmentSet.equipment_set_id, // Associate with the equipment set ID
        storage_id: foundWarehouse.warehouse_id, // Associate with the warehouse ID
        needs_maintenance,
        date_of_purchase,
        cost_of_purchase,
      });

      return res.status(201);
    } else {
      return res
        .status(500)
        .send({ message: "Invalid warehouse or equipment set." });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// не забыть что теперь поля называютя по другому: storage_id и equipment_set_id
const editEquipmentById = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      equipment_name,
      serial_number,
      equipment_set_name,
      warehouse_name,
      current_storage_name,
      needs_maintenance,
      date_of_purchase,
      cost_of_purchase,
    } = req.body;

    const equipmentToUpdate = await equipment.findByPk(id);

    if (!equipmentToUpdate)
      return res.status(404).send({ message: "Equipment not found" });

    const foundWarehouse = await warehouse.findOne({
      where: { warehouse_name: warehouse_name },
    });
    const foundEquipmentSet = await equipment_set.findOne({
      where: { equipment_set_name: equipment_set_name },
    });

    await equipmentToUpdate.update({
      equipment_name,
      serial_number,
      equipment_set_id: foundEquipmentSet.equipment_set_id, // Directly update using IDs
      storage_id: foundWarehouse.warehouse_id, // Directly update using IDs
      current_storage: current_storage_name,
      needs_maintenance,
      date_of_purchase,
      cost_of_purchase,
    });

    return res.status(200).send({ message: "updated succesfully" }); // Return the updated equipment
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Function to delete equipment by ID
const deleteEquipmentById = async (req, res) => {
  try {
    const id = req.params.id;
    const equipmentToDelete = await equipment.findByPk(id);

    if (!equipmentToDelete)
      return res.status(404).send({ message: "Equipment not found" });

    await equipmentToDelete.destroy();
    const data = await equipment.findAll({
      include: [
        {
          model: equipment_set,
          as: "equipment_set",
          attributes: ["equipment_set_name"], // Specify the fields to fetch from `equipment_set`
        },
        {
          model: warehouse,
          as: "storage",
          attributes: ["warehouse_name"], // Specify the fields to fetch from `warehouse`
        },
      ],
    });
    return res.status(200).send(data);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Exporting the functions
module.exports = {
  getAllEquipment,
  createEquipment,
  editEquipmentById,
  deleteEquipmentById,
  getEquipmentById,
};
