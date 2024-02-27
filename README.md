# Proyecto para la hackacode

## como iniciar el proyecto
- npm init
- npm install
- npm run dev (despliegue de servidor local con nodemon)

## rutas
rutas para crear usuarios
usuario cliente  
#### POST /user
- Content-Type: application/json
```
{   
    "name":"nombre",
    "lastname":"apellido",
    "address":"direccion",
    "dni":"123456",
    "birthdate":"1993-08-07",
    "country":"argentina",
    "phone":"12345678",
    "email":"email@hotmail.com",
    "role":"cliente",(2 roles cliente o vendedor)
    "user_state":true,
    "username":"username",//(username unicos no se repiten)
    "password":"1234", //(contraseña encriptada acuerdatela bien XD)
    "job":"vendedor", //---> (solo empleado)
    "salary":1000 //---> (solo empleado)
}
```
## siguiente paso loguear el usuario
### login cliente
#### POST /login
- Content-Type: application/json
```
{
    "username":"username",
    "password":"1234"
}
```
ejemplo de respuesta
respuesta ---> token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9

## creacion de servicio solo para usuarios con rol vendedor
POST /service
- Content-Type: application/json
- Authorization: Bearer token
```
{
    "name":"entrada a eventos",
    "description":"cosquin rock",
    "service_destination":"cordoba",
    "service_date":"2024-2-15",
    "cost":"30000",
    "service_code":7 /*( 
                          cod 1: Hotel por noche/s
                          cod2: Alquiler de auto 
                          cod3: Pasajes de colectivo
                          cod4: Pasajes de avión
                          cod5: Pasajes de tren
                          cod6: Excursiones
                          cod7: Entradas a Eventos
                        )*/
}
```
## creacion de venta (un usuario dispara el evento de compra)

#### POST /sales
- Content-Type: application/json
- Authorization: Bearer token
```
{
    "id_servicios":[12,13,14],  ---> los servicios son los id de la tabla servicio
    "payment_method":"mercado-pago"
}
```
### rutas PATCH modificaciones
//modificamos cliente se puede enviar menos datos
#### PATCH /client
- Content-Type: application/json
- authorization: Bearer token
```
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
```
### modificamos empleado se puede enviar menos datos
PATCH  /seller
- Content-Type: application/json
- Authorization: Bearer token
```
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
```
### rutas delete
- se elimina por id cliente/empleado y automaticamente se elimina el usuario asociado
- actualizacion se cambio por baja logica el usuario se agrego user_state=false/true 
- ya no se utiliza la baja fisica en la bd.Se conservan los datos

user
#### DELETE http://localhost:{puerto}/user/id
cliente 
#### DELETE /client
Authorization: Bearer token
empleado
#### DELETE /seller
Authorization: Bearer token
