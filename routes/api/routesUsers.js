const UserModel = require('../../models/UserModel')
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

    // Authenticate User
    app.get('/api/signin', async (req, res, next) => {
        const preConfigErrorMsg = 'Não foi possível efetuar o login com estas credenciais.'
        try {
            const [hashType, hash] = req.headers.authorization.split(' ')
            const [email, password] = Buffer.from(hash, 'base64').toString().split(':')
            const user = await UserModel.findOne({ email, password })
            if(!user) throw Error(preConfigErrorMsg)

            const token = sign({ user: user.id })

            res.status(200).json({ user, token })
        } catch (err) {
            res.status(401).json({ title: preConfigErrorMsg, message: err })
        }
    })

    // GET All Users
    app.get('/api/users', authMiddleware, async (req, res, next) => {
        const preConfigErrorMsg = 'Não há usuários para exibir.'
        try {
            const users = await UserModel.find()
            if(!users) throw Error(preConfigErrorMsg)
            res.status(200).json(users)
        } catch (err) {
            res.status(401).json({ title: preConfigErrorMsg, message: err })
        }
    })

    // GET User By Id
    app.get('/api/users/:id', authMiddleware, async (req, res, next) => {
        const preConfigErrorMsg = preConfigErrorMsg
        try {
            const user = await UserModel.findById(req.params.id)
            if(!user) throw Error(preConfigErrorMsg)
            res.status(200).json(user)
        } catch (err) {
            res.status(401).json({ title: preConfigErrorMsg, message: err })
        }
    })

    // Create New User
    app.post('/api/signup', async (req, res, next) => {
        const preConfigErrorMsg = 'Houve um erro ao tentar criar usuário.'
        try {
            const newUser = new UserModel(req.body)
            const userResult = await newUser.save();
            if(!userResult) throw Error(preConfigErrorMsg)

            const { password, ...user } = userResult.toObject()

            const token = sign({ user: user.id })

            res.status(201).json({ user, token })
        } catch (err) {
            res.status(400).json({ title: preConfigErrorMsg, message: err })
        }
    })

    // Update an User
    app.patch('/api/users/:id', authMiddleware, async (req, res, next) => {
        const preConfigErrorMsg = 'Houve um erro ao tentar atualizar informações do usuário.'
        try {
            const user = await UserModel.findByIdAndUpdate(req.params.id, req.body)
            if(!user) throw Error(preConfigErrorMsg)
            res.status(200).json({ success: true })
        } catch (err) {
            res.status(401).json({ title: preConfigErrorMsg, message: err })
        }
    })

    // Delete an User
    app.delete('/api/users/:id', authMiddleware, async (req, res, next) => {
        const preConfigErrorMsg = 'Não foi possível deletar usuário.'
        try {
            const user = await UserModel.findByIdAndDelete(req.params.id)
            if(!user) throw Error(preConfigErrorMsg)
            res.status(200).json({ success: true })
        } catch (err) {
            res.status(401).json({ title: preConfigErrorMsg, message: err })
        }
    })

    // Get Logged User
    app.get('/api/me', authMiddleware, (req, res) => {
        res.send(req.auth)
    })

}