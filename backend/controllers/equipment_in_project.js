const { project } = require("../models/projects");
const { equipment } = require("../models/equipment");
const { warehouse } = require("../models/warehouses");
const { equipment_set } = require("../models/equipment_sets");
const { set_type } = require("../models/set_types");
const { Op } = require("sequelize");


const getAllDataHelper = async (id) => {
    const proj = await project.findOne({
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
    const equipmentIdsInProject = proj.equipment.map((e) => e.equipment_id);
    const equipment_in_project = await equipment.findAll({
        where: {equipment_id: {
              [Op.in]: equipmentIdsInProject, // Sequelize operator for exclusion
          },
        },
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

    ],
    });
    
    
    
    

    // Retrieve all available equipment excluding those in the project
    const available_equipment = await equipment.findAll({
      where: {
          equipment_id: {
              [Op.notIn]: equipmentIdsInProject, // Sequelize operator for exclusion
          },
      },
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

    ],
    });

    const uniqueSetNames = [...new Set(available_equipment.map(eq => eq.equipment_set.equipment_set_name))];

    const setsInProject = await equipment_set.findAll({
      where: {
        equipment_set_name: {
          [Op.in]: uniqueSetNames
        }
      },
      include: [
        {
          model: set_type,
          as: "type",
        },
      ],
    });
    return {project:proj, equipment_in_project, available_equipment, sets_in_project: setsInProject}
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
      const { project_id, equipment_id, equipment_set_id } = req.body;
  
      const foundProject = await project.findByPk(project_id);
      const foundEquipment = await equipment.findByPk(equipment_id);
  
      await foundProject.addEquipment(foundEquipment);
      const proj = await getAllDataHelper(project_id)

      const bruhProj = await project.findOne({
        where: {project_id: project_id},
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
    const equipmentIdsInProject = bruhProj.equipment.map((e) => e.equipment_id);

      const equip = async () => {
        const foundSet = await equipment_set.findByPk(equipment_set_id);
        const foundEquipment = await equipment.findAll({where: {equipment_set_id: foundSet.equipment_set_id,
        equipment_id: {
            [Op.notIn]: equipmentIdsInProject,} // Sequelize operator for inclusion
        },});

        return foundEquipment;
      }
      setTimeout(async () => {
        data = {project: proj, equipment: await equip()}
        return res.status(200).send(data);
      }
      , 500);
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

const addSetToProject = async (req, res) => {
  try {
    const { project_id, equipment_set_id } = req.body;

    const foundProject = await project.findByPk(project_id);
    const foundEquipment = await equipment.findAll({where: {equipment_set_id: equipment_set_id}});
    foundEquipment.forEach(async (element) => {
      await foundProject.addEquipment(element);
    });
    setTimeout(async () => {
      console.log("done");
      const data = await getAllDataHelper(project_id)
      return res.status(200).send(data);
    }, 500);
    
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const removeSetFromProject = async (req, res) => {
  try {
    const { project_id, equipment_set_name} = req.body;
    const foundProject = await project.findByPk(project_id);
    const foundSet = await equipment_set.findOne({ where: {equipment_set_name: equipment_set_name}});
    const foundEquipment = await equipment.findAll({where: {equipment_set_id: foundSet.equipment_set_id}});
    foundEquipment.forEach(async (element) => {
      await foundProject.removeEquipment(element);
    });
    setTimeout(async () => {
      console.log("done");
      const data = await getAllDataHelper(project_id)
    
      return res.status(200).send(data);
    }, 500);
    
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const getAvailableEquipmentInSet = async (req, res) => {
  try {
    const {project_id, equipment_set_id}  = req.body;
    console.error(req.body);
    const foundSet = await equipment_set.findByPk(equipment_set_id);
    const bruhProj = await project.findOne({
      where: {project_id: project_id},
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
    const equipmentIdsInProject = bruhProj.equipment.map((e) => e.equipment_id);
    const foundEquipment = await equipment.findAll({where: {equipment_set_id: foundSet.equipment_set_id,
      equipment_id: {
            [Op.notIn]: equipmentIdsInProject,}
          }
        });
    return res.status(200).send(foundEquipment);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}


module.exports = {
    getEquipmentInProject,
    addEquipmentToProject,
    removeEquipmentFromProject,
    removeSetFromProject,
    addSetToProject,
    getAvailableEquipmentInSet
};
  