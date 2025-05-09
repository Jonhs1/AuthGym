/* IMPORTS */
require('dotenv').config()  

const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const app = express()

// Config JSON response
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Models
const User = require('./models/user')

// Open Route 
app.get('/', (req, res) => {
    res.status(200).json({msg: "Bem vindo a nossa API!"})
})

//Private Route
app.get('/user/:id', async(req, res) =>{

    const id = req.params.id

    //checa se o usuário existe
    const user = await User.findById(id, '-password')

    if(!user){
        return res.status(404).json({msg: "Usuário não encontrado!"})
    }

    res.status(200).json({user})
})

function checkToken(req, res, next){

        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(" ")[1]

        if(!token){
            return res.status(401).json({msg: "Acesso negado!"})
        }

        try{

            const secret = process.env.SECRET

            jwt.verify(token, secret)

            next()

        }catch(error){
            res.status(400).json({msg: "Token Inválido!"})
        }

}

// Register User
app.post('/auth/register', async(req, res) => {
    // Para debug: verifique o que está chegando
    console.log('Body recebido:', req.body)
    
    // Verificação se req.body existe
    if (!req.body) {
        return res.status(400).json({msg: "Nenhum dado foi enviado!"})
    }
    
    const {name, email, password, confirmpassword} = req.body

    if(!name){
        return res.status(422).json({msg: "O nome é obrigatório!"})
    }

    if(!email){
        return res.status(422).json({msg: "O email é obrigatório!"})
    }

    if(!password){
        return res.status(422).json({msg: "A senha é obrigatória!"})
    }
    
    if(password !== confirmpassword){
        return res.status(422).json({msg: "As senhas não coincidem!"})
    }

    //vai checar se o user existe
    const userExists = await User.findOne({email: email})

    if(userExists){
        return res.status(422).json({msg: "Por favor! utilize outro email!"})
    }

    //cria a senha 
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    //cria o user
    const user = new User({
        name,
        email,
        password: passwordHash,
    })

    try{

        await user.save()

        res.status(201).json({msg: "Usuário cadastro com sucesso!!"})

    }catch(error){
        console.log(error)
        res.status(500).json({msg: "Erro no servidor, tente novamente mais tarde!"})
    }
})

//Login User
app.post('/auth/login', async(req, res) =>{

    const {email, password} = req.body

    //validações
    if (!req.body) {
        return res.status(400).json({msg: "Nenhum dado foi enviado!"})
    }

    if(!email){
        return res.status(422).json({msg: "O email é obrigatório!"})
    }

    if(!password){
        return res.status(422).json({msg: "A senha é obrigatória!"})
    }

    //checar se o usuário existe
    const user = await User.findOne({email: email})

    if(!user){
        return res.status(404).json({msg: "Esse usuário não existe!"})
    }

    //checar se a senha está correta
    const checkPassword = await bcrypt.compare(password, user.password)

    if(!checkPassword){
        return res.status(422).json({msg: "Senha incorreta!"})
    }

    try{
        const secret = process.env.SECRET

        const token = jwt.sign({
            id: user._id
        },
        secret,
    )

    res.status(200).json({msg: "Autenticação realizada com sucesso!", token})

    }catch{
        console.log(error)
        res.status(500).json({msg: "Erro no servidor, tente novamente mais tarde!"})

    }


})

// Credenciais
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster1.vfe7f6o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`).then(() => {
    app.listen(3000)
    console.log("Conectado com sucesso ao banco!")
}).catch((err) => console.log(err))