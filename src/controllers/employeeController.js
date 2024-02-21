import {
  searchEmployeeById,
  idUserByEmployeeId,
  deleteEmployeeById,
  modifyEmployeeById,
} from "../models/modelEmployee.js";
import { setUserAsInactiveById, modifyUserById } from "../models/modelUser.js";

const searchEmployeeByIdHandler = (req, res) => {
  const id = req.params.id.split("=")[1];
  const numId = parseInt(id, 10);
  searchEmployeeById({ id: numId }, (error, results, fields) => {
    if (error) {
      console.error("error al recuperar el cliente", error);
      return res.status(500).json({ message: "Error al buscar el cliente" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "cliente no encontrado" });
    }
    const client = results;
    res.send(client);
  });
};
const deleteEmployeeByIdHandler = (req, res) => {
  const { id } = req.params;

  idUserByEmployeeId(id, (error, results, fields) => {
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
        employeeId: id,
      });
    });
  });
};

const modifyEmployeeByIdHandler = (req, res) => {
  const { id } = req.params;
  const newEmployee = req.body;

  searchEmployeeById(id, (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Error al buscar el empleado" });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    const employee = results[0];
    const idUser = employee.id_usuario;
    //valores del usuario asociado
    if (newEmployee.name) {
      employee.nombre = newEmployee.name;
    }
    if (newEmployee.lastname) {
      employee.apellido = newEmployee.lastname;
    }
    if (newEmployee.adress) {
      employee.direccion = newEmployee.adress;
    }
    if (newEmployee.dni) {
      employee.dni = newEmployee.dni;
    }
    if (newEmployee.date) {
      employee.fecha_nac = newEmployee.date;
    }
    if (newEmployee.nationality) {
      employee.nacionalidad = newEmployee.nationality;
    }
    if (newEmployee.phone) {
      employee.celular = newEmployee.phone;
    }
    if (newEmployee.email) {
      employee.email = newEmployee.email;
    }

    //enviar cliente al modelo del usuario
    modifyUserById(idUser, employee, (error, results, fields) => {
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

      if (newEmployee.cargo) {
        employee.cargo = newEmployee.cargo;
      }
      if (newEmployee.sueldo) {
        employee.sueldo = newEmployee.sueldo;
      }

      modifyEmployeeById(id, employee, (error, results, fields) => {
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
  searchEmployeeByIdHandler,
  deleteEmployeeByIdHandler,
  modifyEmployeeByIdHandler,
};
