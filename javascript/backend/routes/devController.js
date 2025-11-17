import express from 'express';
import db from '../models/index.js';
import { verifyToken, isDeveloper } from '../middlewares/auth.js'; 

const router = express.Router();
const Jogos = db.Jogos;
const Usuario = db.Usuario; // Necessário para incluir o nome do Desenvolvedor

// ----------------------------------------------------
// RF04.1 | RF04.5: CADASTRAR NOVO JOGO (POST /postar)
// ----------------------------------------------------
router.post('/postar', [verifyToken, isDeveloper], async (req, res) => {
    const fk_desenvolvedor = req.userId; 
    
    const { 
        titulo, descricao, genero, preco, imageUrl, data_lancamento, 
        requisitos_minimo, requisitos_recomendado 
    } = req.body;

    if (!titulo || !genero || !preco || !imageUrl) {
        return res.status(400).json({ message: 'Campos obrigatórios ausentes.' });
    }

    try {
        const novoJogo = await Jogos.create({
            titulo,
            descricao,
            genero,
            preco,
            imageUrl,
            data_lancamento: data_lancamento || null,
            status: 'Disponível',
            fk_desenvolvedor,
            requisitos_minimo,
            requisitos_recomendado 
        });

        return res.status(201).json({ 
            message: `Jogo "${titulo}" publicado com sucesso!`,
            jogoId: novoJogo.id_jogos 
        });
    } catch (error) {
        console.error('Erro ao cadastrar jogo:', error);
        return res.status(500).json({ message: 'Erro interno ao publicar o jogo.' });
    }
});


// --------------------------------------------------------------------------------------
// RF04.2: CONSULTAR JOGO - Listagem dos jogos postados pelo Desenvolvedor (GET /meus-jogos)
// --------------------------------------------------------------------------------------
router.get('/meus-jogos', [verifyToken, isDeveloper], async (req, res) => {
    const fk_desenvolvedor = req.userId;

    try {
        const meusJogos = await Jogos.findAll({
            where: { fk_desenvolvedor },
            attributes: [
                'id_jogos', 'titulo', 'genero', 'preco', 'imageUrl', 'status', 
                'requisitos_minimo', 'requisitos_recomendado', 'descricao', 'data_lancamento'
            ],
            order: [['id_jogos', 'DESC']]
        });

        return res.status(200).json({ jogos: meusJogos });

    } catch (error) {
        console.error('Erro ao consultar jogos do desenvolvedor:', error);
        return res.status(500).json({ message: 'Erro interno ao buscar seus jogos.' });
    }
});


// ----------------------------------------------------
// RF04.3: EDITAR INFORMAÇÕES DO JOGO (PUT /editar/:id)
// ----------------------------------------------------
router.put('/editar/:id', [verifyToken, isDeveloper], async (req, res) => {
    const fk_desenvolvedor = req.userId;
    const id_jogo = req.params.id;
    
    const { 
        titulo, descricao, genero, preco, imageUrl, data_lancamento, 
        requisitos_minimo, requisitos_recomendado, status 
    } = req.body;

    try {
        const jogo = await Jogos.findOne({ 
            where: { id_jogos: id_jogo, fk_desenvolvedor: fk_desenvolvedor } 
        });

        if (!jogo) {
            return res.status(404).json({ message: 'Jogo não encontrado ou você não tem permissão para editá-lo.' });
        }

        const [updated] = await Jogos.update({
            titulo,
            descricao,
            genero,
            preco,
            imageUrl,
            data_lancamento,
            requisitos_minimo,
            requisitos_recomendado,
            status 
        }, {
            where: { id_jogos: id_jogo }
        });

        if (updated) {
            return res.status(200).json({ message: `Jogo ID ${id_jogo} atualizado com sucesso.` });
        } else {
            return res.status(200).json({ message: 'Nenhuma alteração detectada.' });
        }

    } catch (error) {
        console.error('Erro ao editar jogo:', error);
        return res.status(500).json({ message: 'Erro interno ao editar o jogo.' });
    }
});


// ----------------------------------------------------
// RF04.4: EXCLUIR JOGO (DELETE /excluir/:id)
// ----------------------------------------------------
router.delete('/excluir/:id', [verifyToken, isDeveloper], async (req, res) => {
    const fk_desenvolvedor = req.userId;
    const id_jogo = req.params.id;

    try {
        const deletedRows = await Jogos.destroy({
            where: { 
                id_jogos: id_jogo, 
                fk_desenvolvedor: fk_desenvolvedor 
            }
        });

        if (deletedRows > 0) {
            return res.status(200).json({ message: `Jogo ID ${id_jogo} excluído com sucesso.` });
        } else {
            return res.status(404).json({ message: 'Jogo não encontrado ou você não tem permissão para excluí-lo.' });
        }
    } catch (error) {
        console.error('Erro ao excluir jogo:', error);
        return res.status(500).json({ message: 'Erro interno ao excluir o jogo.' });
    }
});


// ----------------------------------------------------
// ROTA GET PARA BUSCAR DETALHES (EDIÇÃO)
// ----------------------------------------------------
router.get('/jogo/:id', [verifyToken, isDeveloper], async (req, res) => {
    const fk_desenvolvedor = req.userId;
    const id_jogo = req.params.id;

    try {
        const jogo = await Jogos.findOne({
            where: { id_jogos: id_jogo, fk_desenvolvedor: fk_desenvolvedor },
            attributes: [
                'id_jogos', 'titulo', 'descricao', 'genero', 'preco', 'imageUrl', 
                'data_lancamento', 'status', 'requisitos_minimo', 'requisitos_recomendado'
            ]
        });

        if (!jogo) {
            return res.status(404).json({ message: 'Jogo não encontrado.' });
        }

        return res.status(200).json(jogo);

    } catch (error) {
        console.error('Erro ao buscar jogo:', error);
        return res.status(500).json({ message: 'Erro interno ao buscar os detalhes do jogo.' });
    }
});


export default router;
