import  {searchUserHandler}  from "../controllers/userController.js";
import { compare } from "./handleCrypt.js";

export function authenticate(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(401)
      .json({
        message: "credenciales no otorgadas",
        username: username,
        passoword: password,
      });
  }

//verificar en la bd
 // Verificar en la base de datos utilizando el controlador
 searchUserHandler(username, async (err, user) => {
  if (err) {
      return res.status(500).json({ message: "Error al verificar las credenciales" });
  }
  if (!user) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
  }
  // Si las credenciales son correctas, agregamos el usuario a la solicitud y llamamos a next()
  //si esta dado de baja no te podes loguear
  if(user.baja){
    return res.status(403).json({ message: "Usuario esta dado de baja.Crea otro usuario" });
  }
  const passwordMatch = await compare(password,user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "password incorrectas" });
    }
    else{req.user = user;
      //estos son datos de la tabla usuario ni de cliente ni de empleado
      //realizar la logica para dependiendo el rol devolver la info correspondiente
      next();}
  
  
});
}
export function isSeller(req, res, next) {
  const rol = req.user.rol;
  
  console.log(rol);
  
  if (rol !== "empleado") {
    return res.status(403).json({ message: "No tienes permisos necesarios" });
  }
  
  next(); // Solo llama a next() si el usuario tiene el rol adecuado
}