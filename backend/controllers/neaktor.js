const { project } = require("../models/projects");
const { equipment } = require("../models/equipment");
const { equipment_set } = require("../models/equipment_sets");

const { project_type } = require("../models/project_types");
const { user } = require("../models/users");
const { auth } = require("../models/auths");

function convertToISODate(russianDate) {
    // Step 1: Split the Russian date string into day, month, year
    const [day, month, year] = russianDate.split('.');
    
    // Step 2: Create the ISO date format
    const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    // Step 3: Return the ISO formatted date
    return isoDate;
}

const neaktorCreateProject = async (req, res) => {
  try {
    const {
      project_name,
      project_type_name,
      chief_engineer_email,
      shooting_start_date,
      shooting_end_date,
    } = req.body;

    const foundProjectType = await project_type.findOne({
      where: { project_type_name: project_type_name },
    });
    
    const foundAuth = await auth.findOne({
      where: { email: chief_engineer_email },
    });

    const foundUser = await user.findOne({
        where: { user_uid: foundAuth.auth_uid },
        });

    if (foundProjectType && foundAuth) {
      const newProject = await project.create({
        project_name,
        archived: false,
        project_type_id: foundProjectType.project_type_id, // Associate with the project type ID
        shooting_start_date: convertToISODate(shooting_start_date),
        shooting_end_date: convertToISODate(shooting_end_date),
        chief_engineer_id: foundUser.id,
      });

      return res.status(201).send({message: "Съёмка создана успешно!", newProject});
    } else {
      return res
        .status(500)
        .send({ message: "Ошибка. Такой площадки (project_type) или пользователя не существует" });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};



module.exports = {
    neaktorCreateProject,
  };