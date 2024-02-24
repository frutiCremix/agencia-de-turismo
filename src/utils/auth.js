import { searchUserHandler } from "../controllers/userController.js";
import { compare } from "./handleCrypt.js";

export async function authenticate(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(401).json({
      message: "credenciales no otorgadas",
      username: username,
      passoword: password,
    });
  }
  try {
    const resulstSearchUser = await searchUserHandler(username);

    if (!resulstSearchUser) {
      return res.status(404).json({ message: "usuario no encontrado" });
    }
    if (resulstSearchUser.user_state == false) {
      return res
        .status(403)
        .json({ message: "Usuario esta dado de baja.Crea otro usuario" });
    }
    //usuario existe
    const passwordMatch = await compare(password, resulstSearchUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "password incorrectas" });
    } else {
      req.user = resulstSearchUser;
      next();
    }
  } catch (error) {
    return res.status(500).json({
      message: "error en la consulta de busqueda por username",
      error: error,
    });
  }
} //verificar rol y user_status
export function isSeller(req, res, next) {
 
  if (req.user.role !== "vendedor") {
    return res.status(403).json({ message: "No tienes permisos necesarios" });
  }
  if(req.user.user_state==false){
    return res.status(403).json({ message: "Usuario dado de baja para crear servicio.crea otro usuario" });
  }

  next(); // Solo llama a next() si el usuario tiene el rol adecuado
}
