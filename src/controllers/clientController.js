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

const deleteClientByIdHandler = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await idUserByClientId(id);

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
      userId:userId,
      clienteId:id,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error en la petición" });
  }
};

const modifyClientByIdHandler = async (req, res) => {
  const { id } = req.params;
  const nuevoCliente = req.body;
try{
  const results=await searchClientById(id);


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
    
    res.json({message:"Cliente modificado con exito",idCliente:id,idUser:idUser});
  }catch(error){
    return res.status(500).json({ message: "Error en la consulta de modificacion",error:error });
  }
};

export {
  searchClientByIdHandler,
  deleteClientByIdHandler,
  modifyClientByIdHandler,
};
