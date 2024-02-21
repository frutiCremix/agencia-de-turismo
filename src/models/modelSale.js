import connection from "../utils/conexionDB.js";

export const createSale=(medioPago,clienteId,subtotal,empleadosId,callback)=>{
    connection.query("INSERT INTO venta (fecha_venta,medio_pago,cliente_id_cliente,subtotal,id_empleado) values (NOW(),?,?,?,?)",[medioPago,clienteId,subtotal,empleadosId],callback);
}