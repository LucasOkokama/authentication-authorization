import { Router } from 'express';
import { CreateUserController } from './useCases/createUser/CreateUserController';
import { AuthenticateUserController } from './useCases/authenticateUser/AuthenticateUserController';
import { ensureAuthenticated } from './middleware/ensureAuthenticated';

const router = Router();

const createUserController = new CreateUserController();
const authenticateUserController = new AuthenticateUserController();

router.post('/users', createUserController.handle);
router.post('/login', authenticateUserController.handle);

router.get('/courses', ensureAuthenticated, (request, response) => {
  response.json([
    { id: 1, name: 'NodeJS' },
    { id: 2, name: 'ReactJS' },
    { id: 3, name: 'React Native' },
    { id: 4, name: 'Flutter' },
    { id: 5, name: 'Elixir' },
  ]);

  return;
});

export { router };
