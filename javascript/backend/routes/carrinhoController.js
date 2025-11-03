import express from 'express';
import db from '../models/index.js';
// Ajuste o caminho de auth.js se necessário
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();
const Carrinho = db.Carrinho;

// ROTA 1: ADICIONAR ITEM AO CARRINHO (PROTEGIDA)
// Rota: POST /api/cart/add
router.post('/add', verifyToken, async (req, res) => {
    // req.userId é injetado pelo middleware verifyToken
    const fk_usuario = req.userId;
    const { gameId } = req.body; // gameId é enviado pelo carrinho.js

    if (!gameId) {
        return res.status(400).json({ message: 'ID do jogo é obrigatório.' });
    }

    try {
        // 1. Verifica se o item já existe (evita duplicatas no banco)
        const existingItem = await Carrinho.findOne({
            where: { fk_usuario, fk_jogos: gameId }
        });

        if (existingItem) {
            return res.status(409).json({ message: 'O jogo já está no carrinho.' });
        }

        // 2. Cria o novo item no banco
        await Carrinho.create({
            fk_usuario,
            fk_jogos: gameId
        });

        return res.status(200).json({ message: 'Item adicionado ao carrinho no servidor.' });

    } catch (error) {
        console.error("Erro ao adicionar item ao carrinho no DB:", error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});


// ROTA 2: REMOVER ITEM DO CARRINHO (PROTEGIDA)
// Rota: DELETE /api/cart/remove/:gameId
router.delete('/remove/:gameId', verifyToken, async (req, res) => {
    const fk_usuario = req.userId;
    const gameId = req.params.gameId;

    try {
        const deletedCount = await Carrinho.destroy({
            where: {
                fk_usuario,
                fk_jogos: gameId
            }
        });

        if (deletedCount === 0) {
            return res.status(404).json({ message: 'Item não encontrado no seu carrinho.' });
        }

        return res.status(200).json({ message: 'Item removido do carrinho no servidor.' });

    } catch (error) {
        console.error("Erro ao remover item do carrinho no DB:", error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

export default router;