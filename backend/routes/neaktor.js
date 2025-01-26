const express = require("express");
const router = express.Router();

const {
  neaktorCreateProject,
  neaktorEditProject,
  neaktorDeleteProject,
  neaktorArchiveProject,

  neaktorCreateProjectType,
  neaktorEditProjectType,

} = require("../controllers/neaktor");

// Define routes for project operations

router.post("/project/create", neaktorCreateProject);
router.post("/project/edit", neaktorEditProject);
router.post("/project/delete", neaktorDeleteProject);
router.post("/project/archive", neaktorArchiveProject);

router.post("/project_type/create", neaktorCreateProjectType);
router.post("/project_type/edit", neaktorEditProjectType);


module.exports = router;
