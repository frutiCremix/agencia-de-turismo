import { searchClientById, idUserByClientId,searchClientByUserId } from "../models/modelClient.js";
import { setUserAsInactiveById, modifyUserById } from "../models/modelUser.js";

const searchClientByIdHandler = async (req, res) => {
  const  id  = req.user;
  
  try {
    const idClient=await searchClientByUserId(id);
    if (!idClient||idClient.error|| idClient.length==0) {
      return res.status(404).json({ message: "Usuario no existe" });
    }
    const results = await searchClientById(idClient[0].id_cliente);
    console.log(results)
    if (!results||results.error|| results.length==0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.json({ message: "Cliente encontrado con exito", results:results });
  } catch (error) {
    res.status(500).json({ message: "Error en la consulta", error });
  }
};

const deleteClientByIdHandler = async (req, res) => {
  const id = req.user;
  try {
    const idClient=await searchClientByUserId(id);
   
    if (!idClient||idClient.error|| idClient.length==0) {
      return res.status(404).json({ message: "cliente no existe" });
    }

    const results = await idUserByClientId(idClient[0].id_cliente);

    if (!results || results.error || results.length==0) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    const userId = results[0].usuario_id_usuario;

    //salio todo bien ahora damos de baja el usuario de ese cliente
    const deletionResult = await setUserAsInactiveById(userId);
    
    if(!deletionResult || deletionResult.error || deletionResult.length === 0){
      return res.status(404).json({message:"Usuario no encontrado"});
    }
    return res.json({
      message:"Cliente dado de baja con exito",
      userId:id,
      clienteId:idClient[0].id_cliente,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error en la petición" });
  }
};

const modifyClientByIdHandler = async (req, res) => {
  const  id = req.user;
  const nuevoCliente = req.body;
try{
  const idClient=await searchClientByUserId(id);
 
    if (!idClient||idClient.error|| idClient.length==0) {
      return res.status(404).json({ message: "Usuario no existe" });
    }

  const results=await searchClientById(idClient[0].id_cliente);


  if (!results || results.error || results.length==0) {
    return res.status(404).json({ message: "Cliente no encontrado" });
  }
    const cliente = results[0];
    
    const idUser = cliente.usuario_id_usuario;
    
    if (typeof nuevoCliente.name !== 'undefined') {
      cliente.name = nuevoCliente.name;
    }
    if (typeof nuevoCliente.lastname !== 'undefined') {
      cliente.lastname = nuevoCliente.lastname;
    }
    if (typeof nuevoCliente.address !== 'undefined') {
      cliente.address = nuevoCliente.address;
    }
    if (typeof nuevoCliente.dni !== 'undefined') {
      cliente.dni = nuevoCliente.dni;
    }
    if (typeof nuevoCliente.birthdate !== 'undefined') {
      cliente.birthdate = nuevoCliente.birthdate;
    }
    if (typeof nuevoCliente.country !== 'undefined') {
      cliente.country = nuevoCliente.country;
    }
    if (typeof nuevoCliente.phone !== 'undefined') {
      cliente.phone = nuevoCliente.phone;
    }
    if (typeof nuevoCliente.email !== 'undefined') {
      cliente.email = nuevoCliente.email;
    }

    //enviar cliente al modelo del usuario
    const resultModify=await modifyUserById(idUser, cliente); 
//si me pasa la clave y no la manejo dispara este error.. ARREGLAR
    if(!resultModify||resultModify.error||resultModify.length==0){
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    
    res.json({message:"Cliente modificado con exito",idCliente:idClient[0].id_cliente,idUser:idUser});
  }catch(error){
    return res.status(500).json({ message: "Error en la consulta de modificacion",error:error.message });
  }
};

export {
  searchClientByIdHandler,
  deleteClientByIdHandler,
  modifyClientByIdHandler,
};
