const { project } = require("../models/projects");

const { project_type } = require("../models/project_types");
const { user } = require("../models/users");
// Function to get all projects
const getAllProjects = async (req, res) => {
  try {
    const data = await project.findAll({
      include: [
        {
          model: project_type,
          as: "type",
          attributes: ["project_type_name"], // Specify the fields to fetch from `project_types`
        },
        {
          model: user,
          as: "chiefEngineer",
          attributes: ["name"],
        },
      ],
    });

    if (!data) {
      return res.status(404).send({ message: "No projects found" });
    }

    return res.json(data);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).send({ message: error.message });
  }
};

// Function to get a project by ID
const getProjectById = async (req, res) => {
  try {
    const data = await project.findOne({
      where: { project_id: req.params.id },
      include: [
        {
          model: project_type,
          as: "type",
          attributes: ["project_type_name"],
        },
        {
          model: user,
          as: "chiefEngineer",
          attributes: ["name"],
        },
      ],
    });

    if (!data) return res.status(404).send({ message: "Project not found" });
    return res.json(data);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Function to create a new project
const createProject = async (req, res) => {
  try {
    const {
      project_name,
      project_type_name,
      chief_engineer_name,
      shooting_date,
    } = req.body;

    const foundProjectType = await project_type.findOne({
      where: { project_type_name: project_type_name },
    });
    const foundUser = await user.findOne({
      where: { name: chief_engineer_name },
    });

    if (foundProjectType) {
      const newProject = await project.create({
        project_name,
        project_type_id: foundProjectType.project_type_id, // Associate with the project type ID
        shooting_date,
        chief_engineer_id: foundUser.id,
      });

      return res.status(201).json(newProject);
    } else {
      return res
        .status(500)
        .send({ message: "Invalid client or project type." });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Function to edit a project by ID
const editProjectById = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      project_name,

      project_type_id,
      start_date,
      end_date,
      budget,
    } = req.body;

    const projectToUpdate = await project.findByPk(id);

    if (!projectToUpdate)
      return res.status(404).send({ message: "Project not found" });

    await projectToUpdate.update({
      project_name,
      project_type_id,
      start_date,
      end_date,
      budget,
    });

    return res.status(200).send({ message: "Project updated successfully" });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

// Function to delete a project by ID
const deleteProjectById = async (req, res) => {
  try {
    const id = req.params.id;
    const projectToDelete = await project.findByPk(id);

    if (!projectToDelete)
      return res.status(404).send({ message: "Project not found" });

    await projectToDelete.destroy();

    const data = await project.findAll({
      include: [
        {
          model: project_type,
          as: "type",
          attributes: ["project_type_name"],
        },
        {
          model: user,
          as: "chiefEngineer",
          attributes: ["name"],
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
  getAllProjects,
  getProjectById,
  createProject,
  editProjectById,
  deleteProjectById,
};
