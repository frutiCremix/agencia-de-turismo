import {
  searchSellerById,
  idUserBySellerId,
  deleteSellerById,
  modifySellerById,
  idSellerByUserId
} from "../models/modelSeller.js";
import { setUserAsInactiveById, modifyUserById } from "../models/modelUser.js";

const searchSellerByIdHandler = async (req, res) => {
  const  id  = req.user;
 
  try {
    const idSeller=await idSellerByUserId(id);
    console.log(idSeller)
    if (!idSeller||idSeller.error||idSeller.length==0) {
      return res.status(404).json({ message: "Vendedor no existe" });
    }
    const results = await searchSellerById(idSeller[0].id_vendedor);
    if (!results||results.error||results.length==0) {
      return res.status(404).json({ message: "Vendedor no encontrado" });
    }
    res.json({ message: "Vendedor encontrado con exito", results });
  } catch (error) {
    res.status(500).json({ message: "Error en la consulta", error:error.message });
  }
};
const deleteSellerByIdHandler = async (req, res) => {
  const  id  = req.user;

  try {
    const idSeller=await idSellerByUserId(id);
    
    if (!idSeller||idSeller.error||idSeller.length==0) {
      return res.status(404).json({ message: "Vendedor no existe" });
    }

    const results = await idUserBySellerId(idSeller[0].id_vendedor);

    if (!results || results.error || results.length == 0) {
      return res.status(404).json({ message: "Vendedor no encontrado" });
    }

    const userId = results[0].usuario_id_usuario;

    const deletionResult = await setUserAsInactiveById(userId);

    if (!deletionResult || deletionResult.error) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.json({
      message: "Vendedor dado de baja con exito",
      userId: id,
      VendedorId: idSeller[0].id_vendedor,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error en la petición" });
  }
};

const modifySellerByIdHandler = async (req, res) => {
  const  id  = req.user;
  const newSeller = req.body;
  try {
    const idSeller=await idSellerByUserId(id);
    
    if (!idSeller||idSeller.error||idSeller.length==0) {
      return res.status(404).json({ message: "Vendedor no existe" });
    }

    const results = await searchSellerById(idSeller[0].id_vendedor);
   
    if (!results || results.error || results.length == 0) {
      return res.status(404).json({ message: "Vendedor no encontrado" });
    }
    const seller = results[0];
   
    
    if (typeof newSeller.name !== "undefined") {
      seller.name = newSeller.name;
    }
    if (typeof newSeller.lastname !== "undefined") {
      seller.lastname = newSeller.lastname;
    }
    if (typeof newSeller.address !== "undefined") {
      seller.address = newSeller.address;
    }
    if (typeof newSeller.dni !== "undefined") {
      seller.dni = newSeller.dni;
    }
    if (typeof newSeller.birthdate !== "undefined") {
      seller.birthdate = newSeller.birthdate;
    }
    if (typeof newSeller.country !== "undefined") {
      seller.country = newSeller.country;
    }
    if (typeof newSeller.phone !== "undefined") {
      seller.phone = newSeller.phone;
    }
    if (typeof newSeller.email !== "undefined") {
      seller.email = newSeller.email;
    }

    const resultModify = await modifyUserById(id, seller);

    if (!resultModify || resultModify.error || resultModify.length == 0) {
      return res
        .status(404)
        .json({ message: "Usuario Vendedor no encontrado" });
    }
    //verificamos si tenemos sueldo y cargo actualizados

    if (typeof newSeller.job !== "undefined") {
      seller.job = newSeller.job;
    }
    if (typeof newSeller.salary !== "undefined") {
      seller.salary = newSeller.salary;
    }

    const resultModifySeller = await modifySellerById(seller.id_vendedor, seller);
   ////
    console.log(resultModifySeller)
    if (
      !resultModifySeller ||
      resultModifySeller.error ||
      resultModifySeller.length == 0
    ) {
      return res.status(404).json({ message: "Vendedor no encontrado" });
    }
    return res.json({ message: "Vendedor modificado con éxito" ,idSeller:seller.id_vendedor,idUser:id});

  } catch (error) {
    return res.status(500).json({ message: "Error en la petición",error:error.message });
  }
};

export {
  searchSellerByIdHandler,
  deleteSellerByIdHandler,
  modifySellerByIdHandler,
};
