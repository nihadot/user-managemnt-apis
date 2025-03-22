import { Router } from 'express';
import adminAuthRoutes from './adminAuthRoutes';
import userAuthRoutes from './userAuthRoutes';
import userRoute from "./usersRoute";
const router = Router();


router.use('/auth/admin', adminAuthRoutes);

router.use('/auth/user', userAuthRoutes);

router.use('/users', userRoute);







export default router;
