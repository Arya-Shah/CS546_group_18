import express from 'express';
import routes from '../CS546_group_18/routes/index.js';
const app= express();
const port =3000;

app.use('/',routes);
app.listen(port,()=>{
    console.log("server running on port 3000");
})