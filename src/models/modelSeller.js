//import connection from "../utils/conexionDB.js";
import {supabase} from '../utils/conectSupabase.js';

const sellerCreate = async ( job, salary, id ) => {
  try {
    const { data, error } = await supabase
      .from('vendedor')
      .insert({ job, salary, usuario_id_usuario: id })
      .select('*');
    if (error) {
      throw new Error(`Error al crear el empleado: ${error.message}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
};


const searchSellerById=async (id)=>{
  try {
    const { data, error } = await supabase
      .from('vendedor')
      .select(`
        *,
        usuario:usuario_id_usuario(*)
      `)
      .eq('id_vendedor', id)
      .single();

    if (error) {
      throw new Error(`Error al buscar el vendedor con ID ${id}: ${error.message}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
   
  
};

const idUserBySellerId=(id,callback)=>{
  connection.query("SELECT * FROM empleado WHERE id_empleado = ?",[id],callback);
}
const deleteSellerById=(id,callback)=>{
  connection.query("DELETE FROM empleado WHERE id_empleado = ?",[id],callback);
}
const modifySellerById=(id,{cargo,sueldo},callback)=>{
  connection.query(
    "UPDATE empleado SET cargo = ?,sueldo = ? WHERE id_empleado = ?",
    [cargo,sueldo,id],callback);

}


  export {sellerCreate,searchSellerById,idUserBySellerId,deleteSellerById,modifySellerById};