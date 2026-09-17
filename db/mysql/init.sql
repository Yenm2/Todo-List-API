USE app;

CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_todo_usuario
        FOREIGN KEY (user_id) REFERENCES usuarios(id)
        ON DELETE CASCADE
);

INSERT INTO usuarios (nombre, password)
VALUES ('menny', 'menny');


INSERT INTO todo (user_id, nombre, descripcion)
VALUES
	(1, 'todo1','prueba'),
	(1, 'todo2','prueba1'),
	(1, 'todo3','prueba2'),
	(1, 'todo4','prueba3'),
	(1, 'todo5','prueba4'),
	(1, 'todo6','prueba5'),
	(1, 'todo7','prueba6'),
	(1, 'todo8','prueba7');
