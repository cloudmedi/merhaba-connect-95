import { Request, Response } from 'express';
import { LoginController } from './auth/LoginController';
import { RegisterController } from './auth/RegisterController';
import { TokenController } from './auth/TokenController';

export class AuthController {
  private loginController: LoginController;
  private registerController: RegisterController;
  private tokenController: TokenController;

  constructor() {
    this.loginController = new LoginController();
    this.registerController = new RegisterController();
    this.tokenController = new TokenController();
  }

  async login(req: Request, res: Response) {
    return this.loginController.login(req, res);
  }

  async register(req: Request, res: Response) {
    return this.registerController.register(req, res);
  }

  async verifyToken(req: Request, res: Response) {
    return this.tokenController.verifyToken(req, res);
  }
}