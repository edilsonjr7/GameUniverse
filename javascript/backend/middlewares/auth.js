// Arquivo: backend/middlewares/auth.js (VERSÃO FINAL E CORRIGIDA)

import jwt from 'jsonwebtoken';
// ⚠️ IMPORTAÇÃO CRÍTICA: Necessário para acessar Usuario e TipoUser
import db from '../models/index.js'; 

// Middleware 1: Verifica se o token JWT é válido
export const verifyToken = (req, res, next) => {
    // Busca o token no cabeçalho 'Authorization: Bearer <token>'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
    }

    try {
        // Usa a chave secreta do .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ChaveParaAutenticar4343@55');
        req.userId = decoded.id; // ID do usuário injetado no Request
        next();
    } catch (error) {
        console.error("Erro ao verificar token:", error);
        return res.status(403).json({ message: 'Token inválido ou expirado. Por favor, faça login novamente.' });
    }
};

// Middleware 2: Verifica se o usuário é Administrador
export const isAdmin = async (req, res, next) => {
    try {
        const usuario = await db.Usuario.findByPk(req.userId, {
            // Inclui o TipoUser para acessar a flag 'adm'
            include: [{ model: db.TipoUser, as: 'tipoUser' }]
        });

        if (!usuario || !usuario.tipoUser.adm) {
            return res.status(403).json({ message: 'Acesso negado: Apenas Administradores.' });
        }
        next();
    } catch (error) {
        console.error("Erro ao verificar ADM:", error);
        res.status(500).json({ message: 'Erro interno do servidor ao verificar permissão.' });
    }
};


// Middleware 3: Verifica se o usuário é Desenvolvedor (NOVA LÓGICA)
export const isDeveloper = async (req, res, next) => {
    try {
        const usuario = await db.Usuario.findByPk(req.userId, {
            // Inclui o TipoUser para acessar a flag 'developer'
            include: [{ model: db.TipoUser, as: 'tipoUser' }]
        });
        
        // Acesso negado se não for Desenvolvedor
        if (!usuario || !usuario.tipoUser.developer) {
            return res.status(403).json({ message: 'Acesso negado: Apenas Desenvolvedores.' });
        }
        next();
    } catch (error) {
        console.error("Erro ao verificar Desenvolvedor:", error);
        res.status(500).json({ message: 'Erro interno do servidor ao verificar permissão.' });
    }
};