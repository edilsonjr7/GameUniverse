// Arquivo: backend/routes/devController.js

import express from 'express';
import db from '../models/index.js';
// Importa os middlewares de segurança
import { verifyToken, isDeveloper } from '../middlewares/auth.js'; 

const router = express.Router();
const Jogos = db.Jogos;

// ROTA: POSTAR NOVO JOGO (PROTEGIDA)
// Rota: POST /api/dev/postar
// Requisito: Apenas Desenvolvedores (isDeveloper) podem postar
router.post('/postar', [verifyToken, isDeveloper], async (req, res) => {
    // req.userId é o ID do Desenvolvedor que postou (injetado por verifyToken)
    const fk_desenvolvedor = req.userId; 
    
    // Campos necessários enviados pelo Admin_PostarJogo.html
    const { titulo, descricao, genero, preco, imageUrl, data_lancamento } = req.body;

    // Validação básica
    if (!titulo || !genero || !preco || !imageUrl) {
        return res.status(400).json({ message: 'Campos obrigatórios (Título, Gênero, Preço, URL Imagem) ausentes.' });
    }

    try {
        // Cria o novo jogo no banco de dados
        const novoJogo = await Jogos.create({
            titulo,
            descricao,
            genero,
            preco,
            imageUrl,
            data_lancamento: data_lancamento || null,
            status: 'Disponível', // Status padrão
            fk_desenvolvedor 
        });

        console.log(`[DB LOG] Novo Jogo postado por ID ${fk_desenvolvedor}: ${novoJogo.titulo}`);
        return res.status(201).json({ 
            message: `Jogo "${titulo}" publicado com sucesso!`,
            jogoId: novoJogo.id_jogos 
        });

    } catch (error) {
        console.error("Erro ao postar novo jogo:", error);
        return res.status(500).json({ message: 'Erro interno do servidor ao publicar o jogo.' });
    }
});

export default router;
