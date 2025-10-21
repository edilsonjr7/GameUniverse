// Esse arquivo faz a autenticação dos usuarios/adm

import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    // Tenta obter o token do cabeçalho Authorization (Bearer token)
    const authHeader = req.headers['authorization'];
    
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Nenhum token fornecido ou token inválido.' });
    }

  
    const tokenValue = authHeader.slice(7); 

    jwt.verify(tokenValue, process.env.JWT_SECRET || 'SEGREDO_MUITO_SECRETO', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Falha na autenticação do token ou token expirado.' });
        }
        // Anexa as informações decodificadas do usuário na requisição
        req.userId = decoded.id;
        req.userAdm = decoded.adm; 
        next();
    });
};

const isAdmin = (req, res, next) => {
    // Checa o valor ADM decodificado pelo verifyToken
    if (!req.userAdm) { 
        return res.status(403).json({ message: 'Requer privilégios de Administrador.' });
    }
    next();
};

export { verifyToken, isAdmin };