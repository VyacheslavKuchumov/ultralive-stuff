const { user_stuffs } = require('../models/user_stuffs');

const getUserInfo = async (req, res) => {
  try {
    console.log("Fetching user info for user_id:", req.params.user_id);
    const current_user = await user_stuffs.findOne({ where: { user_id: req.params.user_id } });
    if (!current_user) {
      console.log("User not found for user_id:", req.params.user_id);
      return res.status(404).send({ message: 'User data not found' });
    }
    console.log("User info found:", current_user);
    return res.json(current_user);
  } catch (error) {
    console.error("Error fetching user info:", error);
    return res.status(500).send({ message: error.message });
  }
};

const postUserBioById = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { bio, avatar_pic, links } = req.body;

    console.log("Updating user bio for user_id:", user_id);
    console.log("Request body:", req.body);

    let current_user = await user_stuffs.findOne({ where: { user_id } });

    if (current_user) {
      console.log("User found, updating user bio:", user_id);
      await user_stuffs.update(
        { bio, avatar_pic, links },
        { where: { user_id } }
      );
    } else {
      console.log("User not found, creating new user bio:", user_id);
      await user_stuffs.create({ user_id, bio, avatar_pic, links });
    }

    console.log("User data updated successfully for user_id:", user_id);
    return res.json({ message: 'User data updated successfully' });
  } catch (error) {
    console.error("Error updating user bio:", error);
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  getUserInfo,
  postUserBioById,
};
