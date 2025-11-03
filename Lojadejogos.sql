-- -----------------------------------------------------
-- ESQUEMA OTIMIZADO: lojajogos
-- -----------------------------------------------------
CREATE DATABASE lojajogos_v2;
USE lojajogos_v2;

-- -----------------------------------------------------
-- Tabela `Tipo_user` (Permissões - OTIMIZADA)
-- Tipos 1=Cliente, 2=ADM, 3=Desenvolvedor
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tipo_user` (
  `id_tipo_user` INT NOT NULL, -- Removido AUTO_INCREMENT pois os IDs são fixos (1, 2, 3)
  `nome_tipo` VARCHAR(45) NOT NULL,
  `is_adm` TINYINT(1) NOT NULL DEFAULT 0, -- Usando TINYINT(1) para booleanos (0=Não, 1=Sim)
  `is_dev` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id_tipo_user`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(50) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `senha` VARCHAR(100) NOT NULL, -- Armazena o HASH da senha
  `telefone` VARCHAR(100) NULL,
  `fk_tipo_user` INT NOT NULL DEFAULT 1, -- Padrão: Cliente Comum (ID 1)
  `email_verificado` TINYINT(1) NOT NULL DEFAULT 0,
  `data_cadastro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `email_UNIQUE` (`email`),
  CONSTRAINT `fk_Usuario_Tipo_user`
    FOREIGN KEY (`fk_tipo_user`)
    REFERENCES `Tipo_user` (`id_tipo_user`)
    ON DELETE RESTRICT -- Impede apagar o tipo se houver usuários
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `Jogos` (Adicionado FK para o Desenvolvedor que postou)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Jogos` (
  `id_jogos` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(100) NOT NULL,
  `genero` VARCHAR(45) NULL,
  `descricao` TEXT NULL,
  `preco` DECIMAL(10,2) NOT NULL,
  `data_lancamento` DATE NULL,
  `status` VARCHAR(100) NULL, -- Ex: 'Disponível', 'Em breve'
  `fk_desenvolvedor` INT NULL, -- Novo: Quem postou o jogo (FK para Usuario)
  PRIMARY KEY (`id_jogos`),
  CONSTRAINT `fk_Jogos_Desenvolvedor`
    FOREIGN KEY (`fk_desenvolvedor`)
    REFERENCES `Usuario` (`id_usuario`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `Carrinho` (Otimizada com PK Composta)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Carrinho` (
  `fk_usuario` INT NOT NULL,
  `fk_jogos` INT NOT NULL,
  `data_adicao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fk_usuario`, `fk_jogos`), -- PK Composta (um usuário só pode ter 1 unidade de um jogo no carrinho)
  CONSTRAINT `fk_Carrinho_Usuario`
    FOREIGN KEY (`fk_usuario`)
    REFERENCES `Usuario` (`id_usuario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Carrinho_Jogos`
    FOREIGN KEY (`fk_jogos`)
    REFERENCES `Jogos` (`id_jogos`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `usuario_jogos` (Biblioteca/Jogos Comprados)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuario_jogos` (
  `fk_usuario` INT NOT NULL,
  `fk_jogos` INT NOT NULL,
  `data_compra` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`fk_usuario`, `fk_jogos`),
  CONSTRAINT `fk_usuario_jogos_Usuario`
    FOREIGN KEY (`fk_usuario`)
    REFERENCES `Usuario` (`id_usuario`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_usuario_jogos_Jogos`
    FOREIGN KEY (`fk_jogos`)
    REFERENCES `Jogos` (`id_jogos`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- SEEDING: Tipos de usuário essenciais
-- -----------------------------------------------------
INSERT INTO `Tipo_user` (`id_tipo_user`, `nome_tipo`, `is_adm`, `is_dev`) VALUES
(1, 'Cliente Comum', 0, 0),
(2, 'Administrador', 1, 0),
(3, 'Desenvolvedor', 0, 1);

select * from tipo_user;
select * from usuario;