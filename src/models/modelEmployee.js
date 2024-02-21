import connection from "../utils/conexionDB.js";

const employeeCreate=({cargo,sueldo,id},callback)=>{
    connection.query("INSERT INTO empleado (cargo,sueldo,usuario_id_usuario) VALUES (?,?,?)",[cargo,sueldo,id],callback);
  };

const searchEmployeeById=(id,callback)=>{

    connection.query("SELECT * FROM empleado INNER JOIN usuario ON empleado.usuario_id_usuario = usuario.id_usuario where id_empleado = ?",[id], callback);
  
};

const idUserByEmployeeId=(id,callback)=>{
  connection.query("SELECT * FROM empleado WHERE id_empleado = ?",[id],callback);
}
const deleteEmployeeById=(id,callback)=>{
  connection.query("DELETE FROM empleado WHERE id_empleado = ?",[id],callback);
}
const modifyEmployeeById=(id,{cargo,sueldo},callback)=>{
  connection.query(
    "UPDATE empleado SET cargo = ?,sueldo = ? WHERE id_empleado = ?",
    [cargo,sueldo,id],callback);

}


  export {employeeCreate,searchEmployeeById,idUserByEmployeeId,deleteEmployeeById,modifyEmployeeById};