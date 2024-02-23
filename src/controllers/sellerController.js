import {
  searchSellerById,
  idUserBySellerId,
  deleteSellerById,
  modifySellerById,
} from "../models/modelSeller.js";
import { setUserAsInactiveById, modifyUserById } from "../models/modelUser.js";

const searchSellerByIdHandler = async(req, res) => {
  const {id} = req.params;
  try{
   const results=await searchSellerById(id);
   if (!results) {
    return res.status(404).json({ message: "Vendedor no encontrado" });
  }
  res.json({ message: "Vendedor encontrado con exito", results });
  }catch(error){
    res.status(500).json({ message: "Error en la consulta", error });
  }
  
};
const deleteSellerByIdHandler = (req, res) => {
  const { id } = req.params;

  idUserBySellerId(id, (error, results, fields) => {
    if (error) {
      return res.status(500).json({
        message:
          "Error en la petición de busqueda del usuario en la tabla empleado",
      });
    }
    if (!results.length > 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    const userId = results[0].usuario_id_usuario;

    //salio todo bien ahora eliminas el empleado y el usuario

    //antes de eliminar esto necesito eliminar todos los servicios a su cargo
    //solucionado al cambiarlo por baja logica
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
        message: "Usuario eliminado con éxito",
        userId: userId,
        sellerId: id,
      });
    });
  });
};

const modifySellerByIdHandler = (req, res) => {
  const { id } = req.params;
  const newSeller = req.body;

  searchSellerById(id, (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Error al buscar el empleado" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    const seller = results[0];
    const idUser = seller.id_usuario;
    //valores del usuario asociado
    if (newSeller.name) {
      seller.nombre = newSeller.name;
    }
    if (newSeller.lastname) {
      seller.apellido = newSeller.lastname;
    }
    if (newSeller.adress) {
      seller.direccion = newSeller.adress;
    }
    if (newSeller.dni) {
      seller.dni = newSeller.dni;
    }
    if (newSeller.date) {
      seller.fecha_nac = newSeller.date;
    }
    if (newSeller.nationality) {
      seller.nacionalidad = newSeller.nationality;
    }
    if (newSeller.phone) {
      seller.celular = newSeller.phone;
    }
    if (newSeller.email) {
      seller.email = newSeller.email;
    }

    //enviar cliente al modelo del usuario
    modifyUserById(idUser, seller, (error, results, fields) => {
      if (error) {
        return res
          .status(500)
          .json({
            message: "Error en la consulta de modificación de empleado",
          });
      }

      if (!results.affectedRows) {
        return res
          .status(404)
          .json({ message: "Empleado no encontrado para actualizar" });
      }

      //verificamos si tenemos sueldo y cargo actualizados

      if (newSeller.cargo) {
        seller.cargo = newSeller.cargo;
      }
      if (newSeller.sueldo) {
        seller.sueldo = newSeller.sueldo;
      }

      modifySellerById(id, seller, (error, results, fields) => {
        if (error) {
          return res
            .status(500)
            .json({
              message: "Error en la consulta de modificación de empleado",
            });
        }

        if (!results.affectedRows) {
          return res
            .status(404)
            .json({ message: "Empleado no encontrado para actualizar" });
        }
        res.json({ message: "Empleado actualizado con exito" });
      });
    });
  });
};

export {
  searchSellerByIdHandler,
  deleteSellerByIdHandler,
  modifySellerByIdHandler,
};
