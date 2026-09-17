export interface CreateTodoSchema {
	userId: number;
	nombre: string;
	descripcion: string;
}

export interface UpdateTodoSchema {
	nombre?: string;
	descripcion?: string;
}
