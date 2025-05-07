import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authToken = request.headers.authorization;

  if (!authToken) {
    response.status(401).json({
      message: 'Token is missing',
    });
    return;
  }

  const token = authToken.split(' ')[1];

  await verify(token, process.env.JWT_ACCESS_SECRET, (err, decode) => {
    if (err) {
      response.status(401).json({
        message: 'Token invalid',
      });
      return;
    }

    next();
  });
}
