const { user } = require('../models/users')

const getUserByUid = async (req, res) => {
    try {
        const current_user = await user.findOne({ where: { user_uid: req.params?.uid } })
        console.log("test")
        if (!current_user) return res.status(404).send({ message: 'User not found' })
        return res.json(current_user)
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}

const getUserByName = async (req, res) => {
    try {
        const current_user = await user.findOne({ where: { name: req.params?.name } })
        if (!current_user) return res.status(404).send({ message: 'User not found' })
        return res.json(current_user)
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}

const updateLike = async (req,res)=>{
    const {likes} = req.body
    try{
        const current_user=await user.update({likes: likes},
            {where: {uid:req.userUid}})
        if (!current_user) return res.status(404)
        return res.json(current_user)
    } catch (error){
        return res.status(500).send({message:error.message})
        
    }

}
module.exports = {
    getUserByUid,
    updateLike,
    getUserByName
}
