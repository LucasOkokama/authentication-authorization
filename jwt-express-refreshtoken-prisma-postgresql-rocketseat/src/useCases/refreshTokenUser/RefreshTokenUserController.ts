import { Request, Response } from 'express';
import { RefreshTokenUserUseCase } from './RefreshTokenUserUserCase';

class RefreshTokenUserController {
  async handle(request: Request, response: Response) {
    const { refresh_token } = request.body;

    const refreshTokenUserUseCase = new RefreshTokenUserUseCase();
    const token = await refreshTokenUserUseCase.execute(refresh_token);

    response.json({ token });
    return;
  }
}

export { RefreshTokenUserController };
