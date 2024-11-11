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
      const tableData = await model.findAll();
      tableDataArray.push({
        table_name: tableName,
        table_data: tableData.map((row) => row.toJSON()),
      });
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

      // Find the corresponding model
      const model = getModelByName(table_name);
      if (!model) {
        return res
          .status(400)
          .json({ error: `Invalid table name: ${table_name}` });
      }

      // Insert data into the model
      await model.bulkCreate(table_data, { ignoreDuplicates: true }); // Use ignoreDuplicates to avoid duplicate entries
    }

    res.json({ message: "Data imported successfully." });
  } catch (error) {
    console.error("Error importing database:", error);
    res
      .status(500)
      .json({ error: "An error occurred while importing the database." });
  }
};

// Helper function to get a model by its name
const getModelByName = (modelName) => {
  switch (modelName.toLowerCase()) {
    case "auth":
      return auth;
    case "equipment":
      return equipment;
    case "equipment_set":
      return equipment_set;
    case "project_type":
      return project_type;
    case "project":
      return project;
    case "set_type":
      return set_type;
    case "user":
      return user;
    case "warehouse":
      return warehouse;
    default:
      return null;
  }
};

module.exports = {
  exportDatabase,
  importDatabase,
};
