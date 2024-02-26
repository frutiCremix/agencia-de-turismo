import express, { json } from 'express';
import router  from './src/routes/router.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
const PORT= process.env.PORT||3001;
const app=express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//['https://example-agencia-de-viajes.netlify.app/',

app.use(cors());
/*{
  origin:['https://example-agencia-de-viajes.netlify.app','http://localhost:5173','http://localhost:3001'],credentials:true}));
*/
app.use(router);
// manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor', error: err.stack });
});
  

app.listen(PORT,()=>{
    console.log(`servidor a la escucha en https://agencia-de-turismo.onrender.com`);
});