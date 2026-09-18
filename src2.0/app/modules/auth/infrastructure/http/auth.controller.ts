export class AuthController {
  constructor(private readonly authService: any) {}

  login() {
    return this.authService.login();
  }

  register() {
    return this.authService.register();
  }
}
