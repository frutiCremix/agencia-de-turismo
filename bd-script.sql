-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema turicode
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema turicode
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema turicode
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `turicode` DEFAULT CHARACTER SET utf8mb3 ;
USE `turicode` ;

-- -----------------------------------------------------
-- Table `turicode`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `turicode`.`usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido` VARCHAR(45) NOT NULL,
  `direccion` VARCHAR(45) NOT NULL,
  `dni` INT NOT NULL,
  `fecha_nac` DATE NOT NULL,
  `nacionalidad` VARCHAR(45) NOT NULL,
  `celular` INT NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `rol` VARCHAR(45) NOT NULL,
  `baja` TINYINT(1) NULL DEFAULT '0',
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 15
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `turicode`.`cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `turicode`.`cliente` (
  `id_cliente` INT NOT NULL AUTO_INCREMENT,
  `usuario_id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_cliente`, `usuario_id_usuario`),
  INDEX `fk_cliente_usuario1_idx` (`usuario_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_cliente_usuario1`
    FOREIGN KEY (`usuario_id_usuario`)
    REFERENCES `turicode`.`usuario` (`id_usuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `turicode`.`empleado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `turicode`.`empleado` (
  `id_empleado` INT NOT NULL AUTO_INCREMENT,
  `cargo` VARCHAR(45) NOT NULL,
  `sueldo` DOUBLE NOT NULL,
  `usuario_id_usuario` INT NOT NULL,
  PRIMARY KEY (`id_empleado`, `usuario_id_usuario`),
  INDEX `fk_empleado_usuario1_idx` (`usuario_id_usuario` ASC) VISIBLE,
  CONSTRAINT `fk_empleado_usuario1`
    FOREIGN KEY (`usuario_id_usuario`)
    REFERENCES `turicode`.`usuario` (`id_usuario`))
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb3
COMMENT = '								';


-- -----------------------------------------------------
-- Table `turicode`.`servicio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `turicode`.`servicio` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `descripcion_breve` VARCHAR(100) NOT NULL,
  `destino_servicio` VARCHAR(45) NULL DEFAULT NULL,
  `fecha_servicio` DATETIME NOT NULL,
  `costo_servicio` DOUBLE NOT NULL,
  `codigo_servicio` INT NOT NULL,
  `empleado_id_empleado` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_servicio_empleado1_idx` (`empleado_id_empleado` ASC) VISIBLE,
  CONSTRAINT `fk_servicio_empleado1`
    FOREIGN KEY (`empleado_id_empleado`)
    REFERENCES `turicode`.`empleado` (`id_empleado`))
ENGINE = InnoDB
AUTO_INCREMENT = 19
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `turicode`.`venta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `turicode`.`venta` (
  `num_venta` INT NOT NULL AUTO_INCREMENT,
  `fecha_venta` DATE NOT NULL,
  `medio_pago` VARCHAR(45) NOT NULL,
  `cliente_id_cliente` INT NOT NULL,
  `subtotal` DOUBLE NOT NULL,
  `id_empleado` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`num_venta`, `cliente_id_cliente`),
  INDEX `fk_venta_cliente1_idx` (`cliente_id_cliente` ASC) VISIBLE,
  CONSTRAINT `fk_venta_cliente1`
    FOREIGN KEY (`cliente_id_cliente`)
    REFERENCES `turicode`.`cliente` (`id_cliente`))
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb3;


-- -----------------------------------------------------
-- Table `turicode`.`paquete`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `turicode`.`paquete` (
  `id_paquete` INT NOT NULL AUTO_INCREMENT,
  `venta_num_venta` INT NOT NULL,
  `servicio_id_servicio` INT NOT NULL,
  PRIMARY KEY (`id_paquete`, `venta_num_venta`, `servicio_id_servicio`),
  INDEX `fk_venta_has_servicio_servicio1_idx` (`servicio_id_servicio` ASC) VISIBLE,
  INDEX `fk_venta_has_servicio_venta1_idx` (`venta_num_venta` ASC) VISIBLE,
  CONSTRAINT `fk_venta_has_servicio_servicio1`
    FOREIGN KEY (`servicio_id_servicio`)
    REFERENCES `turicode`.`servicio` (`id`),
  CONSTRAINT `fk_venta_has_servicio_venta1`
    FOREIGN KEY (`venta_num_venta`)
    REFERENCES `turicode`.`venta` (`num_venta`))
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb3;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
