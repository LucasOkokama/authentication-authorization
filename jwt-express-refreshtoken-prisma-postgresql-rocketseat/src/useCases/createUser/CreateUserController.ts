import { Request, Response } from 'express';
import { CreateUserUseCase } from './CreateUserUseCase';

class CreateUserController {
  async handle(request: Request, response: Response) {
    const { name, username, password } = request.body;

    const createUserUseCase = new CreateUserUseCase();
    const user = await createUserUseCase.execute({
      name,
      username,
      password,
    });

    response.status(201).json(user);
    return;
  }
}

export { CreateUserController };
