const { project } = require("../models/projects");
const { equipment } = require("../models/equipment");
const { equipment_set } = require("../models/equipment_sets");


const getAllDataHelper = (id) => {
    return project.findOne({
        where: {project_id: id},
        include:[
            {
                model: equipment,
                include: [
                {
                    model: equipment_set,
                    as: "equipment_set",
                    attributes: ["equipment_set_name"],
                },
                ],
            }
        ]
        
      });
  }


const getEquipmentInProject = async (req, res) => {
    try {
      
  
      const foundProject = await getAllDataHelper(req.params.id)


      return res.status(200).send(foundProject);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
};

const addEquipmentToProject = async (req, res) => {
    try {
      const { project_id, equipment_id } = req.body;
  
      const foundProject = await project.findByPk(project_id);
      const foundEquipment = await equipment.findByPk(equipment_id);
  
      await foundProject.addEquipment(foundEquipment);
      const data = await getAllDataHelper(project_id)
      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
};
  
  const removeEquipmentFromProject = async (req, res) => {
    try {
      const { project_id, equipment_id } = req.body;
      const foundProject = await project.findByPk(project_id);
      const foundEquipment = await equipment.findByPk(equipment_id);
  
      await foundProject.removeEquipment(foundEquipment);
      const data = await getAllDataHelper(project_id)
      return res.status(200).send(data);
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
};


module.exports = {
    getEquipmentInProject,
    addEquipmentToProject,
    removeEquipmentFromProject,
};
  