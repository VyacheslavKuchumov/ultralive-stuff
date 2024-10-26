const express = require("express");
const router = express.Router();

const {
  getAllProjects,
  editProjectById,
  deleteProjectById,
  createProject,
  getProjectById,
  addEquipmentToProject,
  removeEquipmentFromProject,
} = require("../controllers/projects");

// Define routes for project operations
router.get("/", getAllProjects);
router.get("/search/:id", getProjectById);
router.post("/", createProject);
router.delete("/:id", deleteProjectById);
router.put("/:id", editProjectById);

router.post("/equipment", addEquipmentToProject);
router.put("/equipment/del", removeEquipmentFromProject);

module.exports = router;
