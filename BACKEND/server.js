import express from 'express'
import { PrismaClient } from './generated/prisma/index.js'
import cors from 'cors'

const prisma = new PrismaClient()

const app = express()
app.use(express.json())
app.use(cors())


app.get('/users', async(req, res) => {
    try {
        const filtro = {}

        if(req.query.name) filtro.name = req.query.name;
        if(req.query.email) filtro.email = req.query.email;
        if(req.query.password) filtro.password = req.query.password;

        const user = await prisma.user.findMany({
            where: filtro
        })

        res.status(200).json(user)

    } catch (error){
        console.error("Erro ao buscar o usuário!", error);
        res.status(500).json({ error: "Erro ao buscar o usuário!" });
    }


})

app.post('/users', async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }
        })

        res.status(201).json("Usuário criado com sucesso!")
    } catch(error){
        console.error("Erro ao criar o usuário!", error)
        res.status(500).json("Erro ao criar o usuário!")
    }

})

app.put('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.update({
            where: {
                id: req.params.id
            },
            data: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }
        })

        res.status(200).json("Usuário editado com sucesso!")

    } catch(error){
        console.error("Erro ao editar o usuário!", error)
        res.status(500).json("Erro ao editar o usuário!")
    }

})

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await prisma.user.delete({
            where: {
                id: req.params.id
            }
        })

        res.status(200).json("Usuário deletado com sucesso!")
        
    } catch(error){
        console.error("Erro ao deletar o usuário!", error)
        res.status(500).json("Erro ao deletar o usuário!")
    }

})

app.listen(3000)


