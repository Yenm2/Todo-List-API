export interface CreateTodoSchema {
	nombre: string;
	descripcion: string;
}

export interface UpdateTodoSchema {
	nombre?: string;
	descripcion?: string;
}
