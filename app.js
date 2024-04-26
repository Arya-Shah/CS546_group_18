import express from 'express';
import routes from '../CS546_group_18/routes/index.js';
import exphbs from 'express-handlebars';
const app= express();
import {fileURLToPath} from 'url';
import {dirname} from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const staticDir = express.static(__dirname + '/public');
app.use('/public', staticDir);
const port =3000;
const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
      asJSON: (obj, spacing) => {
        if (typeof spacing === 'number')
          return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
  
        return new Handlebars.SafeString(JSON.stringify(obj));
      }
    },
    // partialsDir: ['views/partials/']
  });
app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');
app.use('/',routes);
app.listen(port,()=>{
    console.log("server running on port 3000");
})