#Proyecto para la hackacode

## como iniciar el proyecto
npm init
npm install
npm run dev (despliegue de servidor local con nodemon)

##rutas
rutas para crear usuarios
usuario cliente  http://localhost:{puerto}/user
-Content-Type: application/json

{   
    "name":"nombre",
    "lastname":"apellido",
    "adress":"direccion",
    "dni":"123456",
    "date":"1993-08-07",
    "nationality":"argentina",
    "phone":"12345678",
    "email":"email@hotmail.com",
    "rol":"cliente",(2 roles cliente o empleado)
    "baja":false,
    "username":"username",(username unicos no se repiten)
    "password":"1234", (contraseña encriptada acuerdatela bien XD)
    "cargo":"vendedor", ---> (solo empleado)
    "sueldo":1000 ---> (solo empleado)
}

## siguiente paso loguear el usuario
### login cliente
POST http://localhost:{puerto}/login
Content-Type: application/json

{
    "username":"username",
    "password":"1234"
}
ejemplo de respuesta
respuesta ---> token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

## creacion de servicio solo para usuarios con rol empleado
POST http://localhost:{puerto}/service
-Content-Type: application/json
-Authorization: Bearer token

{
    "id_usuario": id,
    "nombreServico":"entrada a eventos",
    "descripcion":"cosquin rock",
    "destino":"cordoba",
    "fecha":"2024-2-15",
    "costo":"30000",
    "codigo_servicio":7 ( 
                          cod 1: Hotel por noche/s
                          cod2: Alquiler de auto 
                          cod3: Pasajes de colectivo
                          cod4: Pasajes de avión
                          cod5: Pasajes de tren
                          cod6: Excursiones
                          cod7: Entradas a Eventos
                        )
}

## creacion de venta (un usuario dispara el evento de compra)

POST http://localhost:{puerto}/sales
Content-Type: application/json
Authorization: Bearer token

{
    "servicios":[12,13,14],     ---> los servicios son los id de la tabla servicio
    "medio_pago":"mercado-pago"
}

### rutas PATCH modificaciones
//modificamos cliente se puede enviar menos datos
PATCH http://localhost:{puerto}/client/id <--- id del cliente
Content-Type: application/json

{   
    "name":"nuevo",
    "lastname":"nuevo",
    "adress":"nuevo",
    "dni":"123456",
    "date":"1993-08-07",
    "nationality":"argentina",
    "phone":"12345678",
    "email":"nuevo@hotmail.com"
}
### modificamos empleado se puede enviar menos datos
PATCH  http://localhost:{puerto}/employee/id <-- id del empleado
Content-Type: application/json

{   
    "name":"sebas",
    "lastname":"",
    "adress":"ezeiza",
    "dni":"123456",
    "date":"1993-08-07",
    "nationality":"argentina",
    "phone":"12345678",
    "email":"nuevo@hotmail.com",
    "cargo":"gerente",
    "sueldo":"15000"
}

### rutas delete se elimina por id cliente/empleado y automaticamente se elimina el usuario asociado
//actualizacion se cambio por baja logica el usuario se agrego baja=false/true
//ya no se utiliza la baja fisica en la bd.Se conservan los datos

//user
DELETE http://localhost:{puerto}/user/id

//cliente 
DELETE http://localhost:{puerto}/client/id


//empleado
DELETE http://localhost:{puerto}/employee/id
