-- -----------------------------------------------------
-- Esquema: lojajogos
create database lojajogos;
use lojajogos;

-- -----------------------------------------------------
-- Tabela `Tipo_user`
-- Chave Primária: id_tipo_user
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Tipo_user` (
  `id_tipo_user` INT NOT NULL AUTO_INCREMENT,
  `nome_tipo` VARCHAR(45) NOT NULL DEFAULT 'Cliente',
  `adm` VARCHAR(45) NULL, -- Campo original do diagrama
  `dev` VARCHAR(45) NULL, -- Campo original do diagrama
  PRIMARY KEY (`id_tipo_user`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `Usuario`
-- Chave Primária: id_usuario
-- Chave Estrangeira: fk_tipo_user (para Tipo_user)
-- -----------------------------------------------------
CREATE TABLE usuario (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(50) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `senha` VARCHAR(100) NOT NULL,
  `telefone` VARCHAR(100) NULL,
  `fk_tipo_user` INT NOT NULL, -- Adaptado do 'Tipo_user_id_tipo_us...'
  `email_verificado` BOOLEAN NOT NULL DEFAULT 0, -- Adicionado para sua funcionalidade de confirmação
  `data_cadastro` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Adicionado
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  INDEX `fk_Usuario_Tipo_user_idx` (`fk_tipo_user` ASC),
  CONSTRAINT `fk_Usuario_Tipo_user`
    FOREIGN KEY (`fk_tipo_user`)
    REFERENCES `Tipo_user` (`id_tipo_user`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `Jogos`
-- Chave Primária: id_jogos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Jogos` (
  `id_jogos` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(100) NOT NULL,
  `genero` VARCHAR(45) NULL,
  `descricao` TEXT NULL,
  `preco` DECIMAL(10,2) NOT NULL,
  `data_lancamento` DATE NULL,
  `status` VARCHAR(100) NULL,
  PRIMARY KEY (`id_jogos`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `Avaliacao`
-- Chaves Estrangeiras: fk_usuario, fk_jogos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Avaliacao` (
  `id_avaliacao` INT NOT NULL AUTO_INCREMENT,
  `classificacao` INT NULL,
  `texto_avaliacao` TEXT NULL,
  `data` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fk_usuario` INT NOT NULL,
  `fk_jogos` INT NOT NULL,
  PRIMARY KEY (`id_avaliacao`),
  INDEX `fk_Avaliacao_Usuario_idx` (`fk_usuario` ASC),
  INDEX `fk_Avaliacao_Jogos_idx` (`fk_jogos` ASC),
  CONSTRAINT `fk_Avaliacao_Usuario`
    FOREIGN KEY (`fk_usuario`)
    REFERENCES `Usuario` (`id_usuario`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Avaliacao_Jogos`
    FOREIGN KEY (`fk_jogos`)
    REFERENCES `Jogos` (`id_jogos`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `Carrinho`
-- Chaves Estrangeiras: fk_usuario, fk_jogos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Carrinho` (
  `id_carrinho` INT NOT NULL AUTO_INCREMENT,
  `fk_usuario` INT NOT NULL,
  `fk_jogos` INT NOT NULL,
  `data_adicao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Adicionado
  PRIMARY KEY (`id_carrinho`),
  INDEX `fk_Carrinho_Usuario_idx` (`fk_usuario` ASC),
  INDEX `fk_Carrinho_Jogos_idx` (`fk_jogos` ASC),
  CONSTRAINT `fk_Carrinho_Usuario`
    FOREIGN KEY (`fk_usuario`)
    REFERENCES `Usuario` (`id_usuario`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Carrinho_Jogos`
    FOREIGN KEY (`fk_jogos`)
    REFERENCES `Jogos` (`id_jogos`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `usuario_jogos` (Jogos Comprados)
-- Chaves Estrangeiras: fk_usuario, fk_jogos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `usuario_jogos` (
  `fk_usuario` INT NOT NULL,
  `fk_jogos` INT NOT NULL,
  `data_compra` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Adicionado para monitoramento do ADM
  PRIMARY KEY (`fk_usuario`, `fk_jogos`), -- PK Composta
  INDEX `fk_usuario_jogos_Jogos_idx` (`fk_jogos` ASC),
  CONSTRAINT `fk_usuario_jogos_Usuario`
    FOREIGN KEY (`fk_usuario`)
    REFERENCES `Usuario` (`id_usuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_usuario_jogos_Jogos`
    FOREIGN KEY (`fk_jogos`)
    REFERENCES `Jogos` (`id_jogos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `Notication` (Tabela Mestra de Notificações)
-- Chave Primária: id_notication
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Notication` (
  `id_notication` INT NOT NULL AUTO_INCREMENT,
  `texto` TEXT NOT NULL, -- Adicionado
  `data` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Adicionado
  PRIMARY KEY (`id_notication`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `Notication_Usuario` (Notificações por Usuário)
-- Chaves Estrangeiras: fk_notication, fk_usuario
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Notication_Usuario` (
  `fk_notication` INT NOT NULL,
  `fk_usuario` INT NOT NULL,
  `lida` BOOLEAN NOT NULL DEFAULT 0, -- Adicionado para rastreio
  PRIMARY KEY (`fk_notication`, `fk_usuario`),
  INDEX `fk_Notication_Usuario_Usuario_idx` (`fk_usuario` ASC),
  CONSTRAINT `fk_Notication_Usuario_Notication`
    FOREIGN KEY (`fk_notication`)
    REFERENCES `Notication` (`id_notication`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Notication_Usuario_Usuario`
    FOREIGN KEY (`fk_usuario`)
    REFERENCES `Usuario` (`id_usuario`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Tabela `Notication_Jogos` (Notificações relacionadas a um Jogo)
-- Chaves Estrangeiras: fk_notication, fk_jogos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Notication_Jogos` (
  `fk_notication` INT NOT NULL,
  `fk_jogos` INT NOT NULL,
  PRIMARY KEY (`fk_notication`, `fk_jogos`),
  INDEX `fk_Notication_Jogos_Jogos_idx` (`fk_jogos` ASC),
  CONSTRAINT `fk_Notication_Jogos_Notication`
    FOREIGN KEY (`fk_notication`)
    REFERENCES `Notication` (`id_notication`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Notication_Jogos_Jogos`
    FOREIGN KEY (`fk_jogos`)
    REFERENCES `Jogos` (`id_jogos`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- INSERÇÃO DE DADOS INICIAIS (SEEDING)
-- Tipos de usuário essenciais para o login e ADM
-- -----------------------------------------------------
INSERT INTO `Tipo_user` (`id_tipo_user`, `nome_tipo`, `adm`, `dev`) VALUES
(1, 'Cliente Comum', 'Não', 'Não'),
(2, 'Administrador', 'Sim', 'Não'),
(3, 'Desenvolvedor', 'Não', 'Sim');

select * from tipo_user;