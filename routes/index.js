import usersRoutes from './auth_routes.js';
import userRoutes from './user_routes.js';


const constructorMethod = (app) => {
    app.use('/', usersRoutes);
    app.use('/user', userRoutes)

app.use('*', (req, res) => {
    return res.status(404).json({error: 'Not found'});
    });
};

export default constructorMethod;