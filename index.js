import express, { json } from 'express';
import router  from './src/routes/router.js';


const PORT= process.env.PORT||3001;
const app=express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(router);


app.listen(PORT,()=>{
    console.log(`servidor a la escucha en http://localhost:${PORT}`);
});