import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import nodemailer from 'nodemailer';

const router = express.Router();
const Usuario = db.Usuario;
const TipoUser = db.TipoUser;

// === CADASTRO ===
router.post('/register', async (req, res) => {
    try {
        const { nome, email, senha, confirmacaoSenha } = req.body;
        if (!nome || !email || !senha || !confirmacaoSenha)
            return res.status(400).json({ message: 'Preencha todos os campos.' });

        if (senha !== confirmacaoSenha)
            return res.status(400).json({ message: 'As senhas não conferem.' });

        // Verifica se já existe usuário
        const existente = await Usuario.findOne({ where: { email } });
        if (existente)
            return res.status(400).json({ message: 'E-mail já cadastrado.' });

        const hashedPassword = await bcrypt.hash(senha, 10);

        const clienteTipo = await TipoUser.findOne({ where: { nome_tipo: 'Cliente Comum' } });

        const novoUsuario = await Usuario.create({
            nome,
            email,
            senha: hashedPassword,
            fk_tipo_user: clienteTipo.id_tipo_user
        });

       // Envia e-mail de confirmação
        // 1. GERAÇÃO DO TOKEN DE CONFIRMAÇÃO (NOVO PASSO)
        const confirmToken = jwt.sign(
            { email: novoUsuario.email },
            process.env.JWT_SECRET || 'SEGREDO_MUITO_SECRETO',
            { expiresIn: '15m' } // Token de curta duração para confirmação
        );
        
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        
        // 2. USO DO TOKEN NO LINK (MUDANÇA AQUI)
        // O link agora envia o token, não o e-mail: /confirmacao.html?token=...
        const linkConfirmacao = `${process.env.CLIENT_BASE_URL}/confirmacao.html?token=${confirmToken}`;

        await transporter.sendMail({
            from: `"GameStream Universe" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Confirme seu cadastro - GameStream Universe',
            html: `<h3>Bem-vindo(a), ${nome}!</h3><p>Confirme seu cadastro clicando no link abaixo:</p>
                   <a href="${linkConfirmacao}">${linkConfirmacao}</a>`
        });

        res.status(201).json({ message: 'Usuário cadastrado! Verifique seu e-mail para confirmar o cadastro.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao registrar usuário.' });
    }
});

// === CONFIRMAÇÃO DE E-MAIL (AGORA VIA TOKEN) ===
router.get('/confirm', async (req, res) => {
    try {
        const { token } = req.query; // Recebe o token

        if (!token) {
            return res.status(400).json({ message: 'Token de confirmação ausente.' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'SEGREDO_MUITO_SECRETO');
        } catch (err) {
            const msg = err.name === 'TokenExpiredError' 
                        ? 'O link de confirmação expirou.' 
                        : 'O link de confirmação é inválido.';
            return res.status(401).json({ message: msg });
        }

        const emailDoToken = decoded.email;

        const usuario = await Usuario.findOne({ where: { email: emailDoToken } });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        if (usuario.email_verificado)
            return res.json({ message: 'E-mail já estava confirmado. Você pode fazer login.' });

        usuario.email_verificado = true;
        await usuario.save();

        return res.json({ message: 'E-mail confirmado com sucesso! Você já pode fazer login.' });
        
    } catch (error) {
        console.error("Erro na confirmação de e-mail:", error);
        res.status(500).json({ message: 'Erro interno ao confirmar e-mail.' });
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

        // Verificação de senha
        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
        }
        
        // CÓDIGO DE DIAGNÓSTICO PARA VER O VALOR LIDO DO BANCO
        console.log("DIAGNÓSTICO: Valor de email_verificado lido pelo Sequelize:", usuario.email_verificado, typeof usuario.email_verificado); 

        // Verificação de e-mail
        // Remova a correção anterior e volte para a verificação simples, mas monitore o tipo
        if (!usuario.email_verificado) { 
            return res.status(403).json({ message: 'E-mail não verificado. Por favor, confirme seu cadastro.' });
        }

        // Gera o Token JWT
        const payload = {
            id: usuario.id_usuario,
            email: usuario.email,
            nome: usuario.nome,
            adm: usuario.tipoUser.adm 
        };
        
        // **IMPORTANTE**: Use o JWT_SECRET do seu .env
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'SEGREDO_MUITO_SECRETO', { expiresIn: '1h' });

        // Aqui retorna o token e o status de ADM/Cliente
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