import {
  userCreate,
  searchUserByUserName,
  searchUserById,
  setUserAsInactiveById,
} from "../models/modelUser.js";
import { clientCreate } from "../models/modelClient.js";
import { sellerCreate } from "../models/modelSeller.js";
import { encrypt } from "../utils/handleCrypt.js";

export const createUser = async (req, res) => {
  const body = req.body;
  const hash = encrypt(body.password);

//validaciones
  try {

    const existingUser = await searchUserByUserName(body.username);
    if (existingUser) {
      return res.status(400).json({ message: "El nombre de usuario ya está en uso" });
    }

    const insertedUser = await userCreate(body, hash);
    if (body.role === "cliente") {
      await clientCreate(insertedUser[0].id_usuario);
      res.send("Cliente creado con éxito");
    } else if (body.role === "vendedor") {
      await sellerCreate(body.job, body.salary, insertedUser[0].id_usuario);

      res.send("Empleado creado con éxito");
    } else {
      res.json({ message: "Usuario creado con éxito" });
    }
  } catch (error) {
    
    //contenplar la duplicacion del dni
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(500)
        .json({ message: "El nombre de usuario ya está en uso" });
    }
    console.error("Error al crear el usuario:", error);
    res.status(500).json({ message: "Error al crear el usuario" });
  }
};
export const searchUserHandler = async (username) => {
  
  try {
    //tenemos el id del usuario
    const results = await searchUserByUserName(username);
    //existe el id
    if (results|| !results.error || results.length>0) {
      
      return results;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};
export const searchUserByIdHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const results = await searchUserById(id); // Cambia results a user

    if (!results) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario encontrado con éxito", results });
  } catch (error) {
    res.status(500).json({ message: "Error en la consulta", error });
  }
};
export const deleteUserByIdHandler = async(req, res) => {
  const { id } = req.params;
try{
  const results=await setUserAsInactiveById(id);
  if(!results || results.error || results.length ==0){
    return res.status(404).json({message:"Usuario no encontrado"});
  }
  return res.json({message:"Usuario dado de baja con exito",userId:id});
}catch(error){ return res.status(500).json({message:"Error en la solicitud"});}
};
