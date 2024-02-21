import mysql from 'mysql2';

const connection= mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'turicode'
});

connection.connect((error)=>{
    if(error)throw error;
    console.log('conexion a la base de datos exitosa');
});

export default connection;