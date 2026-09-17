export interface Todo {
	id: number;
	userId: number;
	nombre: string;
	descripcion: string;
	createdAt: Date;
	estado: 'pendiente' | 'en progreso' | 'completado';
	prioridad: 'baja' | 'media' | 'alta';
}

