import dayjs from 'dayjs';
import { client } from '../prisma/client';

class GenerateRefreshToken {
  async execute(userId: string) {
    const expiresIn = dayjs().add(30, 'second').unix();

    const generateRefreshToken = await client.refreshToken.create({
      data: {
        expiresIn,
        userId,
      },
    });

    return generateRefreshToken;
  }
}

export { GenerateRefreshToken };
