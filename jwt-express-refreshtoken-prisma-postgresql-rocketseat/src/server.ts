import express, { json } from 'express';
import { router } from './routes';

const app = express();

app.use(express.json());
app.use(router);

app.listen(3000, () => {
  console.log(`Server is running or port 3000`);
});
