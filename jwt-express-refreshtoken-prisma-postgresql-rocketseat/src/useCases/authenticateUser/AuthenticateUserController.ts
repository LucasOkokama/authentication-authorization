import { Request, Response } from 'express';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

class AuthenticateUserController {
  async handle(request: Request, response: Response) {
    const { username, password } = request.body;

    const authenticateUserUserCase = new AuthenticateUserUseCase();
    const token = await authenticateUserUserCase.execute({
      username,
      password,
    });

    response.json(token);
    return;
  }
}

export { AuthenticateUserController };
