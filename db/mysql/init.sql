USE app;

CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
	password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todo (
    id BIGINT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios (nombre, password)
VALUES ('menny', 'menny');


INSERT INTO todo (id, nombre, descripcion)
VALUES
	('1', 'todo1','prueba'),
	('1', 'todo2','prueba1'),
	('1', 'todo3','prueba2'),
	('1', 'todo4','prueba3'),
	('1', 'todo5','prueba4'),
	('1', 'todo6','prueba5'),
	('1', 'todo7','prueba6'),
	('1', 'todo8','prueba7');

