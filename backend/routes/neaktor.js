const express = require("express");
const router = express.Router();

const {
  neaktorCreateProject

} = require("../controllers/neaktor");

// Define routes for project operations

router.post("/project", neaktorCreateProject);


module.exports = router;
