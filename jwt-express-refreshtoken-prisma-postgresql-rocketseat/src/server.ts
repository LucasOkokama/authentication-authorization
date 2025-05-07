import 'express-async-errors';
import express, { NextFunction, Request, Response } from 'express';
import { router } from './routes';

const app = express();

app.use(express.json());
app.use(router);

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    response.json({
      status: 'Error',
      message: error.message,
    });
    return;
  }
);

app.listen(3000, () => {
  console.log(`Server is running or port 3000`);
});
