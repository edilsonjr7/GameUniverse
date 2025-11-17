// Arquivo: backend/routes/jogosController.js (Sugestão de Implementação)

import express from 'express';
import db from '../models/index.js'; // Importa todos os Models
// import { verifyToken } from '../middlewares/auth.js'; // Se quiser proteger a rota

const router = express.Router();

// ROTA: GET /api/jogos/detalhes/:id
// Objetivo: Retornar todos os detalhes de um jogo, incluindo o nome do Desenvolvedor.
router.get('/detalhes/:id', async (req, res) => {
    try {
        const idJogo = req.params.id;

        // 1. Busca o jogo pelo ID e inclui o Desenvolvedor (Usuario)
        const jogo = await db.Jogos.findByPk(idJogo, {
            // Inclui o modelo Usuario (Desenvolvedor) usando o alias 'desenvolvedor'
            include: [{ 
                model: db.Usuario, 
                as: 'desenvolvedor', 
                attributes: ['nome'] // Puxa apenas o nome do desenvolvedor
            }]
        });

        if (!jogo) {
            return res.status(404).json({ message: 'Jogo não encontrado no catálogo.' });
        }

        // 2. Mapeia o resultado para o formato que o Frontend espera
        res.json({
            id_jogos: jogo.id_jogos,
            titulo: jogo.titulo,
            genero: jogo.genero,
            preco: parseFloat(jogo.preco), // Garante que o preço seja um número
            descricao: jogo.descricao,
            imageUrl: jogo.imageUrl,
            data_lancamento: jogo.data_lancamento,
            
            // Novos campos do banco de dados (após a alteração do SQL)
            requisitos_minimo: jogo.requisitos_minimo,
            requisitos_recomendado: jogo.requisitos_recomendado,
            
            // Nome do Desenvolvedor (usando o dado da tabela Usuario)
            desenvolvedorNome: jogo.desenvolvedor ? jogo.desenvolvedor.nome : 'Desenvolvedor Removido'
        });

    } catch (error) {
        console.error("Erro ao buscar detalhes do jogo:", error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar detalhes do jogo.' });
    }
});

export default router;