import auth_routes from './auth_routes.js';
import userRoutes from './user_routes.js';
import property_routes from './property_routes.js';
import thread_routes from './thread_routes.js';
import report_routes from './report_routes.js';
import moderator_routes from './moderator_routes.js';


const constructorMethod = (app) => {
    app.use('/', auth_routes);
    app.use('/report', report_routes);
    app.use('/moderator', moderator_routes);
    app.use('/user', userRoutes);
    app.use('/property', property_routes);
    app.use('/thread', thread_routes);
app.use('*', (req, res) => {
    res.status(400).render('error', { error: "Page Not Found", form: req.body });
    });
};

export default constructorMethod;