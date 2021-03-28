const Users = require('../../models/Users')
const jwt = require('jsonwebtoken')
const { sign, verify } = require('../../jwt')

const authMiddleware = async (req, res, next) => {
    const [, token] = req.headers.authorization.split(' ')
    try {
        const payload = await verify(token)
        const user = await Users.findById(payload.user)
        if(!user) { return res.status(401).json({}) }
        req.auth = user
        next()        
    } catch (err) { res.status(401).json({ message: err }) }
}

module.exports = app => {

    // Authenticate User
    app.get('/api/signin', async (req, res, next) => {
        const [hashType, hash] = req.headers.authorization.split(' ')
        const [email, password] = Buffer.from(hash, 'base64').toString().split(':')
        try {
            const user = await Users.findOne({ email, password })
            if(!user) throw Error('Não foi possível efetuar o login com estas credenciais.')

            const token = sign({ user: user.id })

            res.status(200).json({ user, token })
        } catch (err) {
            res.status(401).json({ message: err })
        }
    })

    // GET All Users
    app.get('/api/users', authMiddleware, async (req, res, next) => {
        try {
            const users = await Users.find()
            if(!users) throw Error('Não há usuários para exibir.')
            res.status(200).json(users)
        } catch (err) {
            res.status(400).json({ message: err })
        }
    })

    // GET User By Id
    app.get('/api/users/:id', async (req, res, next) => {
        try {
            const user = await Users.findById(req.params.id)
            if(!user) throw Error('Usuário não Encontrado.')
            res.status(200).json(user)
        } catch (err) {
            res.status(400).json({ message: err })
        }
    })

    // Create New User
    app.post('/api/signup', async (req, res, next) => {
        const newUser = new Users(req.body)
        try {
            const userResult = await newUser.save();
            if(!userResult) throw Error('Houve um erro ao tentar criar usuário.')

            const { password, ...user } = userResult.toObject()

            const token = sign({ user: user.id })

            res.status(201).json({ user, token })
        } catch (err) {
            res.status(400).json({ message: err })
        }
    })

    // Update an User
    app.patch('/api/users/:id', async (req, res, next) => {
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, req.body)
            if(!user) throw Error('Houve um erro ao tentar atualizar informações do usuário.')
            res.status(200).json({ success: true })
        } catch (err) {
            res.status(400).json({ message: err })
        }
    })

    // Delete an User
    app.delete('/api/users/:id', async (req, res, next) => {
        try {
            const user = await Users.findByIdAndDelete(req.params.id)
            if(!user) throw Error('Não foi possível deletar usuário.')
            res.status(200).json({ success: true })
        } catch (err) {
            res.status(400).json({ message: err })
        }
    })

    // Get Logged User
    app.get('/api/me', authMiddleware, (req, res) => {
        res.send(req.auth)
    })

}