const express = require("express");
const router = express.Router();

const {

  addEquipmentToProject,
  removeEquipmentFromProject,
  getEquipmentInProject
} = require("../controllers/equipment_in_project");


router.get("/:id", getEquipmentInProject);
router.post("/add", addEquipmentToProject);
router.put("/del", removeEquipmentFromProject);

module.exports = router;
