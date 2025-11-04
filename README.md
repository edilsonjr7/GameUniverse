📚 GameStream Universe: Loja de Jogos Online
Este é o projeto visa uma plataforma  de loja de jogos online construída com Node.js e MySQL, focada em diferentes níveis de acesso: Cliente, Administrador e Desenvolvedor.

✨ Funcionalidades

Perfil                Acesso Restrito	                    Funcionalidades
Cliente	              Login, Token JWT	                  Navegação na loja, Adicionar/Excluir jogos do Carrinho, Finalizar Compra e acesso à Biblioteca (biblioteca.html).
Administrador         Token JWT, Middleware isAdmin   	  Acesso ao Painel ADM (Admin.html) para Listar, Modificar (Tipo/Nome) e Excluir todos os usuários do sistema.
Desenvolvedor 	      Token JWT, Middleware isDeveloper	  Acesso ao painel para Publicar Novos Jogos (Admin_PostarJogo.html).
