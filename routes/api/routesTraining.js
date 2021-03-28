const UserModel = require('../../models/UserModel')
const TrainingModel = require('../../models/TrainingModel')
const { sign, verify } = require('../../jwt')

// Athentication Middleware
const authMiddleware = async (req, res, next) => {
    try {
        const [hashType, token] = req.headers.authorization.split(' ')
        const payload = await verify(token)
        const user = await UserModel.findById(payload.user)
        if(!user) { return res.status(401).json({}) }
        req.auth = user
        next()        
    } catch (err) { res.status(401).json({ message: err }) }
}

module.exports = app => {

    app.get('/api/training', authMiddleware, async (req, res, next) => {
        const preConfigErrorMsg = 'Não há treinos para exibir.'
        try {
            const trainings = await TrainingModel.find()
            if(!trainings) throw Error(preConfigErrorMsg)
            res.status(200).json(trainings)
        } catch (err) {
            res.status(400).json({ title: preConfigErrorMsg, message: err })
        }
    })

    // Create New User
    app.post('/api/training/register', authMiddleware, async (req, res, next) => {
        const preConfigErrorMsg = 'Houve um erro ao tentar criar treino.'
        try {
            const newTraining = new TrainingModel(req.body)
            const trainingResult = await newTraining.save();
            if(!trainingResult) throw Error(preConfigErrorMsg)
            res.status(201).json(newTraining)
        } catch (err) {
            res.status(400).json({ title: preConfigErrorMsg, message: err })
        }
    })

}