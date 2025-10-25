import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';


const router = express.Router();
const Usuario = db.Usuario;
const TipoUser = db.TipoUser;

// === CADASTRO E LOGIN AUTOMÁTICO (SEM CONFIRMAÇÃO) ===
router.post('/register', async (req, res) => {
    try {
        const { nome, email, senha, confirmacaoSenha } = req.body;
        if (!nome || !email || !senha || !confirmacaoSenha)
            return res.status(400).json({ message: 'Preencha todos os campos.' });

        if (senha !== confirmacaoSenha)
            return res.status(400).json({ message: 'As senhas não conferem.' });

        const existente = await Usuario.findOne({ where: { email } });
        if (existente)
            return res.status(400).json({ message: 'E-mail já cadastrado.' });

        const hashedPassword = await bcrypt.hash(senha, 10);
        const clienteTipo = await TipoUser.findOne({ where: { nome_tipo: 'Cliente Comum' } });

        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha: hashedPassword,
            fk_tipo_user: clienteTipo.id_tipo_user,
            email_verificado: true // AGORA É TRUE POR PADRÃO
        });

        // SIMULAÇÃO DE LOGIN BEM-SUCEDIDO APÓS CADASTRO (Novo Requisito)
        const payload = {
            id: novoUsuario.id_usuario,
            email: novoUsuario.email,
            nome: novoUsuario.nome,
            adm: clienteTipo.adm // Deve ser false
        };
        
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'SEGREDO_MUITO_SECRETO', { expiresIn: '1h' });

        res.status(201).json({ 
            message: 'Cadastro realizado com sucesso! Redirecionando...',
            token,
            user: { 
                id: novoUsuario.id_usuario,
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                adm: clienteTipo.adm
            }
        });

    } catch (error) {
        console.error("Erro no registro:", error);
        res.status(500).json({ message: 'Erro ao registrar usuário.' });
    }
});


// === LOGIN ===
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

       const usuario = await Usuario.findOne({ 
            where: { email },
            include: [{ model: TipoUser, as: 'tipoUser' }]
        });

        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
        }
        


        const payload = {
            id: usuario.id_usuario,
            email: usuario.email,
            nome: usuario.nome,
            adm: usuario.tipoUser.adm,
            developer: usuario.tipoUser.developer 
        };
        
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'SEGREDO_MUITO_SECRETO', { expiresIn: '1h' });

        res.json({ 
            message: 'Login realizado com sucesso!',
            token,
            user: { 
                id: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email,
                adm: usuario.tipoUser.adm
            }
        });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

export default router;