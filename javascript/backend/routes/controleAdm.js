import express from 'express';
import db from '../models/index.js';
import { verifyToken, isAdmin } from '../middlewares/auth.js';

const router = express.Router();
const Usuario = db.Usuario;
const TipoUser = db.TipoUser; // Necessário para logar o tipo

// LISTAR USUÁRIOS 
// Apenas ADMs logados podem acessar
router.get('/listar', [verifyToken, isAdmin], async (req, res) => {
    const usuarios = await Usuario.findAll({
        attributes: ['id_usuario', 'nome', 'email', 'fk_tipo_user'], // Adicionado fk_tipo_user para mostrar o tipo
        include: [{ model: TipoUser, as: 'tipoUser', attributes: ['adm'] }] // Inclui status ADM
    });
    console.log(`[ADM] Listagem completa de ${usuarios.length} usuários retornada.`);
    usuarios.forEach(u => console.log(`[DB LOG] ID: ${u.id_usuario}, Nome: ${u.nome}, Tipo ID: ${u.fk_tipo_user}, É ADM: ${u.tipoUser.adm}`));

    res.json(usuarios.map(u => ({
        id_usuario: u.id_usuario,
        nome: u.nome,
        email: u.email,
        fk_tipo_user: u.fk_tipo_user,
        adm: u.tipoUser.adm
    })));
});

// ATUALIZAR USUÁRIO (ADM)
router.put('/atualizar/:id', [verifyToken, isAdmin], async (req, res) => {
    const id = req.params.id;
    const { nome, fk_tipo_user } = req.body;

    try {
        const [updated] = await Usuario.update({ nome, fk_tipo_user }, {
            where: { id_usuario: id }
        });

        if (updated) {
            console.log(`[DB LOG] Usuário ID ${id} atualizado. Novos dados: Nome=${nome}, Tipo ID=${fk_tipo_user}`);
            res.json({ message: 'Usuário atualizado com sucesso.' });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado.' });
        }
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        res.status(500).json({ message: 'Erro interno ao atualizar usuário.' });
    }
});

// EXCLUIR USUÁRIO 
// Apenas ADMs logados podem acessar
router.delete('/deletar/:id', [verifyToken, isAdmin], async (req, res) => { // as requisiçoes do [verifyToken, isAdmin precisam ser atendidas
    const id = req.params.id; // aqui ele mostra o ID do usuario que será deletado
    await Usuario.destroy({ where: { id_usuario: id } }); // o metodo destroy do sequelize remove o registro da tabela "usuario" onde o ID é igual ao capturado
    console.log(`[DB LOG] Usuário ID ${id} EXCLUÍDO.`);
    res.json({ message: 'Usuário excluído com sucesso.' }); // exibe a mensagem de sucesso para o front
});

export default router;
