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

  try {
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
    const results = await searchUserByUserName(username);
    if (results.length > 0) {
      return results[0];
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }

  /*searchUserByUserName(username, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length > 0) {
      callback(null, results[0]);
    } else {
      callback(null, null);
    }
  });*/
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
export const deleteUserByIdHandler = (req, res) => {
  const { id } = req.params;

  setUserAsInactiveById(id, (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Error en la petición" });
    }
    if (results && results.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.json({ message: "Usuario dado de baja con éxito", id: id });
  });
};
