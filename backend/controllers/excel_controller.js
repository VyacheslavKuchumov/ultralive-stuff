const { sequelize } = require("../connection");

const { auth } = require("../models/auths");
const { equipment } = require("../models/equipment");
const { equipment_set } = require("../models/equipment_sets");
const { project_type } = require("../models/project_types");
const { project } = require("../models/projects");
const { set_type } = require("../models/set_types");
const { user } = require("../models/users");
const { warehouse } = require("../models/warehouses");

const exportDatabase = async (req, res) => {
  try {
    const tableDataArray = [];

    // Fetch data from each table and convert to JSON
    const addTableData = async (model, tableName) => {
      try {
        switch (tableName.toLowerCase()) {
          case "auth":
            const authFieldsToInclude = [
              "auth_uid",
              "AccessToken",
              "RefreshToken",
              "password",
              "email",
              "createdAt",
              "updatedAt",
            ];
            tableDataArray.push({
              table_name: tableName,
              table_data: (await model.findAll({})).map((row) => {
                // Create a new object with only the desired fields
                const newRow = {};
                authFieldsToInclude.forEach((field) => {
                  if (row[field] !== undefined) {
                    newRow[field] = row[field];
                  }
                });
                return newRow;
              }),
            });
            break;

          case "user":
            const userFieldsToInclude = [
              "user_uid",
              "name",
              "role",
              "createdAt",
              "updatedAt",
            ];
            tableDataArray.push({
              table_name: tableName,
              table_data: (await model.findAll({})).map((row) => {
                // Create a new object with only the desired fields
                const newRow = {};
                userFieldsToInclude.forEach((field) => {
                  if (row[field] !== undefined) {
                    newRow[field] = row[field];
                  }
                });
                return newRow;
              }),
            });
            break;

          case "warehouse":
            const warehouseFieldsToInclude = [
              "warehouse_name",
              "warehouse_adress",
            ];
            tableDataArray.push({
              table_name: tableName,
              table_data: (await model.findAll({})).map((row) => {
                // Create a new object with only the desired fields
                const newRow = {};
                warehouseFieldsToInclude.forEach((field) => {
                  if (row[field] !== undefined) {
                    newRow[field] = row[field];
                  }
                });
                return newRow;
              }),
            });
            break;

          case "set_type":
            const setTypeFieldsToInclude = ["set_type_name"];
            tableDataArray.push({
              table_name: tableName,
              table_data: (await model.findAll({})).map((row) => {
                // Create a new object with only the desired fields
                const newRow = {};
                setTypeFieldsToInclude.forEach((field) => {
                  if (row[field] !== undefined) {
                    newRow[field] = row[field];
                  }
                });
                return newRow;
              }),
            });
            break;

          case "equipment_set":
            const equipmentSetFieldMapping = {
              equipment_set_name: "equipment_set_name",
              description: "description",
              set_type_name: "set_type_name",
            };
            const equipmentSetData = await model.findAll({
              include: [
                {
                  model: set_type,
                  as: "type",
                  attributes: ["set_type_name"],
                },
              ],
            });
            tableDataArray.push({
              table_name: tableName,
              table_data: equipmentSetData.map((row) => {
                const newRow = {};
                Object.keys(equipmentSetFieldMapping).forEach(
                  (originalField) => {
                    if (row[originalField] !== undefined) {
                      newRow[equipmentSetFieldMapping[originalField]] =
                        row[originalField];
                    } else if (originalField === "set_type_name" && row.type) {
                      // Handle nested field mapping
                      newRow[equipmentSetFieldMapping[originalField]] =
                        row.type.set_type_name;
                    }
                  },
                );
                return newRow;
              }),
            });

            break;

          case "equipment":
            const equipmentFieldMapping = {
              equipment_set_name: "equipment_set_name",
              equipment_name: "equipment_name",
              serial_number: "serial_number",
              warehouse_name: "warehouse_name",
              current_storage: "current_storage",
              needs_maintenance: "needs_maintenance",
              date_of_purchase: "date_of_purchase",
              cost_of_purchase: "cost_of_purchase",
            };
            tableDataArray.push({
              table_name: tableName,
              table_data: (
                await model.findAll({
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
                })
              ).map((row) => {
                const newRow = {};
                Object.keys(equipmentFieldMapping).forEach((originalField) => {
                  if (row[originalField] !== undefined) {
                    newRow[equipmentFieldMapping[originalField]] =
                      row[originalField];
                  } else if (
                    originalField === "equipment_set_name" &&
                    row.equipment_set
                  ) {
                    // Handle nested field mapping
                    newRow[equipmentFieldMapping[originalField]] =
                      row.equipment_set.equipment_set_name;
                  } else if (
                    originalField === "warehouse_name" &&
                    row.storage
                  ) {
                    // Handle nested field mapping
                    newRow[equipmentFieldMapping[originalField]] =
                      row.storage.warehouse_name;
                  }
                });
                return newRow;
              }),
            });
            break;

          case "project_type":
            tableDataArray.push({
              table_name: tableName,
              table_data: (
                await model.findAll({ exclude: ["project_type_id"] })
              ).map((row) => row.toJSON()),
            });
            break;

          case "project":
            tableDataArray.push({
              table_name: tableName,
              table_data: (
                await model.findAll({ exclude: ["project_id"] })
              ).map((row) => row.toJSON()),
            });
            break;

          default:
            throw new Error(`Unknown model type: ${tableName}`);
        }
      } catch (error) {
        console.error(`Error processing row for model ${modelName}:`, error);
        // You can choose to skip this row or rethrow the error
        // For now, let's just log it and continue with the next row
      }
    };

    await addTableData(auth, "auth");
    await addTableData(user, "user");
    await addTableData(warehouse, "warehouse");
    await addTableData(set_type, "set_type");
    await addTableData(equipment_set, "equipment_set");
    await addTableData(equipment, "equipment");
    await addTableData(project_type, "project_type");
    await addTableData(project, "project");

    // Send the JSON data as a response
    res.json(tableDataArray);
  } catch (error) {
    console.error("Error exporting database:", error);
    res
      .status(500)
      .json({ error: "An error occurred while exporting the database." });
  }
};

const importDatabase = async (req, res) => {
  try {
    const data = req.body; // Assuming the data is sent as a JSON array

    if (!Array.isArray(data)) {
      return res
        .status(400)
        .json({ error: "Invalid input format. Expected an array." });
    }

    for (const item of data) {
      const { table_name, table_data } = item;

      try {
        await createModelByName(table_name, table_data);
      } catch (error) {
        console.error(`Error importing data for model ${table_name}:`, error);
        return res.status(500).json({
          error: "An error occurred while importing the database.",
        }); // Exit early to prevent further processing if a critical error occurs
      }
    }

    res.json({ message: "Data imported successfully." });
  } catch (error) {
    console.error("Error in importDatabase:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
};

// Helper function to get a model by its name
const createModelByName = async (modelName, tableData) => {
  for (const row of tableData) {
    try {
      switch (modelName.toLowerCase()) {
        case "auth":
          await auth.create(row);
          break;
        case "user":
          await user.create(row);
          break;
        case "warehouse":
          await warehouse.create(row);
          break;
        case "set_type":
          await set_type.create(row);
          break;
        case "equipment_set":
          const foundSetType = await set_type.findOne({
            where: { set_type_name: row.set_type_name },
          });
          if (!foundSetType) {
            throw new Error("Set type not found for equipment set.");
          }
          await equipment_set.create({
            equipment_set_name: row.equipment_set_name,
            description: row.description,
            set_type_id: foundSetType.set_type_id,
          });
          break;
        case "equipment":
          const foundWarehouse = await warehouse.findOne({
            where: { warehouse_name: row.warehouse_name },
          });
          if (!foundWarehouse) {
            throw new Error("Warehouse not found for equipment.");
          }

          const foundEquipmentSet = await equipment_set.findOne({
            where: { equipment_set_name: row.equipment_set_name },
          });
          if (!foundEquipmentSet) {
            throw new Error("Equipment set not found for equipment.");
          }

          await equipment.create({
            equipment_name: row.equipment_name,
            serial_number: row.serial_number,
            equipment_set_id: foundEquipmentSet.equipment_set_id, // Associate with the equipment set ID
            storage_id: foundWarehouse.warehouse_id, // Associate with the warehouse ID
            needs_maintenance: row.needs_maintenance,
            date_of_purchase: row.date_of_purchase,
            cost_of_purchase: row.cost_of_purchase,
          });
          break;

        case "project_type":
          break;
        case "project":
          break;

        default:
          throw new Error(`Unknown model type: ${modelName}`);
      }
    } catch (error) {
      console.error(`Error processing row for model ${modelName}:`, error);
      // You can choose to skip this row or rethrow the error
      // For now, let's just log it and continue with the next row
    }
  }
};

module.exports = {
  exportDatabase,
  importDatabase,
};
