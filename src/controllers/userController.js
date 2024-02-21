import { userCreate, searchUserByUserName,searchUserById,setUserAsInactiveById } from "../models/modelUser.js";
import { clientCreate } from "../models/modelClient.js";
import { employeeCreate } from "../models/modelEmployee.js";
import { encrypt } from "../utils/handleCrypt.js";

export const createUser = (req, res) => {
  const body = req.body;
  const hash = encrypt(body.password);

  userCreate(body, hash, (error, results, fields) => {
    
    if (error) {
      if(error.code == 'ER_DUP_ENTRY'){
        return res.status(500).json({ message: "Username ya se encuentra en uso" });
      }
      console.error("Error al crear el usuario:", error);
      return res.status(500).json({ message: "Error al crear el usuario" });
    }
   

    if (results.insertId) {
      if (body.rol == "cliente") {
        clientCreate({ id: results.insertId }, (error, results, fields) => {
          if (error) {
            console.error("Error al crear el cliente:", error);
            return res
              .status(500)
              .json({ message: "Error al crear el cliente" });
          }
          res.send("cliente generado con exito");
        });
      } else if (body.rol == "empleado") {
        employeeCreate(
          { cargo: body.cargo, sueldo: body.sueldo, id: results.insertId },
          (error, results, fields) => {
            if (error) {
              console.error("Error al crear el empleado:", error);
              return res
                .status(500)
                .json({ message: "Error al crear empleado" });
            }
            res.send("empleado generado con exito");
          }
        );
      }
    }

    // res.json({ message: "usuario creado con exito" });
  });
};
export const searchUserHandler = (username, callback) => {
  // Aquí deberías obtener los datos de la solicitud, por ejemplo:
  // Llamamos al modelo para buscar al usuario
  searchUserByUserName(username, (err, results) => {
    if (err) {
      return callback(err, null);
    }
    if (results.length > 0) {
      callback(null, results[0]);
    } else {
      callback(null, null);
    }
  });
};
export const searchUserByIdHandler=(req,res)=>{
  const {id}=req.params;
  searchUserById(id,(error,results,fields)=>{
    if(error){
      res.status(500).json({message:"error en la consulta",error:error});
    }
    if(!results.length>0){res.status(404).json({message:"usuario no encontrado"});}
    const user=results[0];
    res.json({message:"usuario encontrado con exito",user:user});
  });

}
export const deleteUserByIdHandler = (req, res) => {
  const { id } = req.params;

  setUserAsInactiveById(id, (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Error en la petición" });
    }
    if (results && results.affectedRows === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    return res.json({ message: "Usuario dado de baja con éxito", id: id});
  });
};
