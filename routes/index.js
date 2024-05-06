import authRoutes from './auth_routes.js';
import userRoutes from './user_routes.js';
import property_routes from './property_routes.js';


const constructorMethod = (app) => {
    app.use('/', authRoutes);

    app.use('/landlordReview', userRoutes);
    app.use('/user', userRoutes);

    app.use('/addProperty', property_routes);
    app.use('/propertyReview', property_routes);
    app.use('/property', property_routes);


app.use('*', (req, res) => {
    return res.status(404).json({error: 'Not found'});
    });
};

export default constructorMethod;