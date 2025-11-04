# 🎮 GameStream Universe  

> Plataforma completa de loja de jogos online com controle de acesso por níveis (Cliente, ADM e Dev).  
> Projeto desenvolvido como trabalho acadêmico para [Nome da Disciplina / Faculdade].

---

## 🏷️ Badges

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Framework-Express-blue)
![MySQL](https://img.shields.io/badge/Database-MySQL-orange)
![Sequelize](https://img.shields.io/badge/ORM-Sequelize-blue)
![JWT](https://img.shields.io/badge/Auth-JWT-yellow)
![Status](https://img.shields.io/badge/Status-Working-success)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

---

## 📚 Sobre o Projeto

O **GameStream Universe** simula uma plataforma de venda de jogos com autenticação, permissões de usuário e gerenciamento de catálogo e compras.

O sistema implementa três perfis com permissões distintas:

| Perfil | Permissão |
|---|---|
| Cliente | Navegar, adicionar ao carrinho, comprar e acessar biblioteca |
| Desenvolvedor | Postar novos jogos na plataforma |
| Administrador | Gerenciar usuários (listar, editar e excluir) |

---

## ✨ Funcionalidades

✅ Login e Registro com JWT  
✅ Permissões por nível de usuário (Middleware)  
✅ Catálogo de jogos  
✅ Carrinho de compras + biblioteca pós-compra  
✅ Painel de administrador  
✅ Painel de desenvolvedor para publicar jogos  
✅ Banco MySQL com Sequelize

---

## 🧠 Arquitetura

Frontend (HTML, CSS, JS)
↕
API Node.js (Express)
↕
MySQL + Sequelize


---

## 🛠️ Tecnologias

| Área | Tecnologia |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express |
| Banco | MySQL |
| ORM | Sequelize |
| Segurança | JWT |
| Ferramentas | Git, NPM |

---

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/SEU_USUARIO/GameStream-Universe.git
cd GameStream-Universe

2. Configurar variáveis de ambiente

Crie o arquivo .env no backend:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=SUA_SENHA
DB_NAME=lojajogos_v2

JWT_SECRET=SUA_CHAVE_SECRETA

3. Instalar dependências
npm install

4. Rodar o backend
no terminal dentro da pasta backend rode
node server.js

📎 Principais Rotas
| Método | Rota                    | Função              |
| ------ | ----------------------- | ------------------- |
| POST   | `/api/auth/register`    | Registrar usuário   |
| POST   | `/api/auth/login`       | Login               |
| GET    | `/api/user/listar`      | ADM listar usuários |
| DELETE | `/api/user/deletar/:id` | ADM excluir usuário |
| POST   | `/api/dev/postar`       | Dev publicar jogo   |
| POST   | `/api/compra/finalizar` | Finalizar compra    |

