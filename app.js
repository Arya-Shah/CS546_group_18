import express from 'express';
import session from 'express-session';
import engine  from 'express-handlebars';
import { authMiddleware } from './middleware.js';
import configRoutes from './routes/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(session({
name: 'AuthenticationState',
secret: 'some secret string!',
resave: false,
saveUninitialized: false
}));

app.use(async (req, res, next) => {
    let user = "";
    if (!req.session.user) {
        user = "( Non-Authenticated User )";
    } else {
        user = "( Authenticated User )";
    }
    console.log(
    "[" +
        new Date().toUTCString() +
        "]: " +
        req.method +
        " " +
        req.originalUrl +
        " " +
        user
    );
    next();
});
app.use(authMiddleware);
configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log('Your routes will be running on http://localhost:3000');
});
