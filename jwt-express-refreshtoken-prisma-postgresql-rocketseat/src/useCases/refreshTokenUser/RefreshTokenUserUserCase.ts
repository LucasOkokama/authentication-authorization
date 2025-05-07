import { client } from '../../prisma/client';
import { GenerateTokenProvider } from '../../provider/GenerateTokenProvider';

class RefreshTokenUserUseCase {
  async execute(refresh_token) {
    const refreshToken = await client.refreshToken.findFirst({
      where: {
        id: refresh_token,
      },
    });

    if (!refreshToken) {
      throw new Error('Refresh token invalid');
    }

    const generateTokenProvider = new GenerateTokenProvider();
    const token = generateTokenProvider.execute(refreshToken.userId);

    return token;
  }
}

export { RefreshTokenUserUseCase };
