import express from 'express';
import db from '../models/index.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js'; // Importa os middlewares

const router = express.Router();
const Usuario = db.Usuario;

// LISTAR USUÁRIOS 
// Apenas ADMs logados podem acessar
router.get('/listar', [verifyToken, isAdmin], async (req,res)=>{
    const usuarios = await Usuario.findAll({
        attributes: ['id_usuario','nome','email']
    });
    res.json(usuarios);
});

// EXCLUIR USUÁRIO 
// Apenas ADMs logados podem acessar
router.delete('/deletar/:id', [verifyToken, isAdmin], async (req,res)=>{
    const id = req.params.id;
    await Usuario.destroy({where:{id_usuario:id}});
    res.json({message:'Usuário excluído com sucesso.'});
});

export default router;