import { compare } from 'bcryptjs';
import { client } from '../../prisma/client';
import { sign } from 'jsonwebtoken';

interface IRequest {
  username: string;
  password: string;
}

class AuthenticateUserUseCase {
  async execute({ username, password }: IRequest) {
    const userAlreadyExists = await client.user.findFirst({
      where: {
        username,
      },
    });
    if (!userAlreadyExists) {
      throw new Error('User or password incorrect');
    }

    const passwordMatch = await compare(password, userAlreadyExists.password);
    if (!passwordMatch) {
      throw new Error('User or password incorrect');
    }

    const token = sign({ username }, process.env.JWT_ACCESS_SECRET, {
      subject: userAlreadyExists.id,
      expiresIn: '20s',
    });

    return { token };
  }
}

export { AuthenticateUserUseCase };
