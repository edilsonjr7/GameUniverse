import express from 'express';
import db from '../models/index.js';
import { verifyToken } from '../middlewares/auth.js'; 

const router = express.Router();
const Carrinho = db.Carrinho;
const UsuarioJogos = db.sequelize.models.usuario_jogos; // Tabela de junção para a biblioteca

// ROTA: FINALIZAR COMPRA
// Rota: POST /api/compra/finalizar
router.post('/finalizar', verifyToken, async (req, res) => {
    // 1. O ID do usuário logado é injetado pelo middleware verifyToken
    const fk_usuario = req.userId; 

    try {
        // 2. BUSCA ITENS DO CARRINHO
        const itensCarrinho = await Carrinho.findAll({
            where: { fk_usuario: fk_usuario }
        });

        if (itensCarrinho.length === 0) {
            return res.status(400).json({ message: 'Seu carrinho está vazio.' });
        }
        
        // 3. REGISTRA JOGOS NA BIBLIOTECA (usuario_jogos)
        const jogosParaAdicionar = itensCarrinho.map(item => ({
            fk_usuario: fk_usuario,
            fk_jogos: item.fk_jogos,
            // A data_compra será preenchida automaticamente pelo DEFAULT CURRENT_TIMESTAMP no SQL
        }));
        
        // Insere todos os jogos no banco de dados na tabela de biblioteca
        await UsuarioJogos.bulkCreate(jogosParaAdicionar);

        // 4. LIMPA O CARRINHO
        await Carrinho.destroy({
            where: { fk_usuario: fk_usuario }
        });

        console.log(`[DB LOG] Usuário ID ${fk_usuario} finalizou a compra de ${itensCarrinho.length} jogos.`);
        
        // Nota: Você pode adicionar lógica de cálculo de valor total e pagamento aqui
        
        return res.status(200).json({ 
            message: 'Compra finalizada com sucesso! Jogos adicionados à sua biblioteca.',
            jogosComprados: jogosParaAdicionar.length 
        });

    } catch (error) {
        console.error("Erro ao finalizar compra:", error);
        // Pode ocorrer erro de chave duplicada se o jogo já estiver na biblioteca (ON DELETE RESTRICT)
        if (error.name === 'SequelizeUniqueConstraintError' || error.message.includes('Duplicate entry')) {
            return res.status(409).json({ message: 'Erro: Um ou mais jogos no carrinho já estão na sua biblioteca. Limpe o carrinho e tente novamente.' });
        }
        return res.status(500).json({ message: 'Erro interno do servidor ao processar a compra.' });
    }
});


// ROTA: LISTAR JOGOS COMPRADOS (BIBLIOTECA)
// Rota: GET /api/compra/biblioteca
router.get('/biblioteca', verifyToken, async (req, res) => {
    const fk_usuario = req.userId; // ID do usuário logado

    try {
        // Encontra todos os jogos comprados pelo usuário (através da tabela de junção)
        // Usa o alias 'biblioteca' configurado no models/usuario.js
        const biblioteca = await db.Usuario.findByPk(fk_usuario, {
            attributes: [], // Não precisamos dos dados do usuário novamente
            include: [{
                model: db.Jogos,
                as: 'biblioteca', 
                attributes: ['id_jogos', 'titulo', 'genero', 'imageUrl', 'data_lancamento'],
                through: { attributes: ['data_compra'] } // Inclui a data da compra da tabela de junção
            }]
        });

        if (!biblioteca || biblioteca.biblioteca.length === 0) {
            // Retorna status 200, mas com a mensagem de que a biblioteca está vazia.
            return res.status(200).json({ message: 'Sua biblioteca está vazia.', jogos: [] });
        }

        // Mapeia os resultados para um formato amigável para o frontend
        const jogosComprados = biblioteca.biblioteca.map(jogo => ({
            id: jogo.id_jogos,
            titulo: jogo.titulo,
            genero: jogo.genero,
            imageUrl: jogo.imageUrl,
            // Acessa a data de compra através do objeto da tabela de junção (usuario_jogos)
            dataCompra: jogo.usuario_jogos.data_compra 
        }));

        return res.status(200).json({ jogos: jogosComprados });

    } catch (error) {
        console.error("Erro ao buscar biblioteca:", error);
        return res.status(500).json({ message: 'Erro interno do servidor ao buscar a biblioteca.' });
    }
});


export default router;