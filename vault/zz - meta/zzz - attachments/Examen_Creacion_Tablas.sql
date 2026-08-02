
CREATE TABLE usuarios(
id bigint NOT NULL PRIMARY KEY AUTO_INCREMENT,
nombre varchar(20),
apellido varchar(20) DEFAULT NULL,
correo varchar(30) NOT NULL UNIQUE KEY,
contrasena varchar(30) NOT NULL,
fecha_nacim date NOT NULL,
ciudad varchar(100) DEFAULT NULL,
fecha_registro datetime DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE eventos(
id bigint NOT NULL PRIMARY KEY AUTO_INCREMENT,
nombre varchar(100),
descripcion text DEFAULT NULL,
fecha datetime NOT NULL,
lugar varchar(100),
organizador_id bigint NOT NULL,
FOREIGN KEY(organizador_id) REFERENCES usuarios (id)
ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE participantes(
evento_id bigint NOT NULL PRIMARY KEY,
usuario_id bigint NOT NULL,
fecha_inscripcion DATETIME NOT NULL,
FOREIGN KEY(evento_id) REFERENCES eventos (id)
ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY(usuario_id) REFERENCES usuarios (id)
ON DELETE CASCADE ON UPDATE CASCADE);