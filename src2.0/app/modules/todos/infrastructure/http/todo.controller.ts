export class TodoController {
  constructor(private readonly todoService: any) {}

  create() {
    return this.todoService.create();
  }

  update() {
    return this.todoService.update();
  }

  findAll() {
    return this.todoService.findAll();
  }
}
