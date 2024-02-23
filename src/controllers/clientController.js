import { searchClientById, idUserByClientId } from "../models/modelClient.js";
import { setUserAsInactiveById, modifyUserById } from "../models/modelUser.js";

const searchClientByIdHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await searchClientById(id);
    if (!results) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json({ message: "Cliente encontrado con exito", results });
  } catch (error) {
    res.status(500).json({ message: "Error en la consulta", error });
  }
};

const deleteClientByIdHandler = (req, res) => {
  const { id } = req.params;

  idUserByClientId(id, (error, results, fields) => {
    if (error) {
      return res.status(500).json({
        message:
          "Error en la petición de busqueda del usuario en la tabla cliente",
      });
    }
    if (!results.length > 0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    const userId = results[0].usuario_id_usuario;

    //salio todo bien ahora damos de baja el usuario de ese cliente

    setUserAsInactiveById(userId, (error, results, fields) => {
      if (error) {
        return res.status(500).json({
          message: "Error en la petición de eliminacion del usuario",
        });
      }
      if (!results.affectedRows) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      return res.json({
        message: "Usuario dado de baja con éxito",
        userId: userId,
        clientId: id,
      });
    });
  });
};

const modifyClientByIdHandler = (req, res) => {
  const { id } = req.params;
  const nuevoCliente = req.body;

  searchClientById(id, (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Error al buscar el cliente" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "cliente no encontrado" });
    }

    const cliente = results[0];
    const idUser = cliente.id_usuario;
    if (nuevoCliente.name) {
      cliente.nombre = nuevoCliente.name;
    }
    if (nuevoCliente.lastname) {
      cliente.apellido = nuevoCliente.lastname;
    }
    if (nuevoCliente.adress) {
      cliente.direccion = nuevoCliente.adress;
    }
    if (nuevoCliente.dni) {
      cliente.dni = nuevoCliente.dni;
    }
    if (nuevoCliente.date) {
      cliente.fecha_nac = nuevoCliente.date;
    }
    if (nuevoCliente.nationality) {
      cliente.nacionalidad = nuevoCliente.nationality;
    }
    if (nuevoCliente.phone) {
      cliente.celular = nuevoCliente.phone;
    }
    if (nuevoCliente.email) {
      cliente.email = nuevoCliente.email;
    }

    //enviar cliente al modelo del usuario
    modifyUserById(idUser, cliente, (error, results, fields) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "Error en la consulta de modificación de usuario" });
      }

      if (!results.affectedRows) {
        return res
          .status(404)
          .json({ message: "Usuario no encontrado para actualizar" });
      }
      res.json({ message: "Usuario actualizado con exito" });
    });
  });
};

export {
  searchClientByIdHandler,
  deleteClientByIdHandler,
  modifyClientByIdHandler,
};
