import connection from "../utils/conexionDB.js";

const createService=(id,{nombreServico,descripcion,destino,fecha,costo,codigo_servicio},callback)=>{
//calcular fecha
    connection.query("INSERT INTO servicio (nombre,descripcion_breve,destino_servicio,fecha_servicio,costo_servicio,codigo_servicio,empleado_id_empleado)values(?,?,?,?,?,?,?)",[nombreServico,descripcion,destino,fecha,costo,codigo_servicio,id],callback);
}
const searchSellerByUserId=(id,callback)=>{
    connection.query("SELECT id_empleado FROM empleado where usuario_id_usuario = ?",[id],callback);
}      
const getPriceService=(id,callback)=>{
    connection.query("SELECT empleado_id_empleado,costo_servicio FROM servicio where id = ?",[id],callback);
}
export {createService,searchSellerByUserId,getPriceService}