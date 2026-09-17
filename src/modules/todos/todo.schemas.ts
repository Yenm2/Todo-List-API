export interface CreateTodoSchema {
	userId: number;
	nombre: string;
	descripcion: string;
}

export interface UpdateTodoSchema {
	nombre?: string;
	descripcion?: string;
	estado?: 'pendiente' | 'en progreso' | 'completado';
	prioridad?: 'baja' | 'media' | 'alta';
}
