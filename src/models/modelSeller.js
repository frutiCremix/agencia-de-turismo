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
      .eq('id_vendedor', id);
      

    if (error) {
      throw new Error(`Error al buscar el vendedor con ID ${id}: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    throw error;
  }
   
  
};

const idUserBySellerId = async (id) => {
  try {
    const { data, error } = await supabase
      .from('vendedor')
      .select('*')
      .eq('id_vendedor', id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const deleteSellerById=(id,callback)=>{
  connection.query("DELETE FROM empleado WHERE id_empleado = ?",[id],callback);
}
const modifySellerById = async (id, { job, salary }) => {
  try {
    const { data, error } = await supabase
      .from('vendedor')
      .update({ job: job, salary: salary })
      .eq('id_vendedor', id)
      .select('*');

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};


  export {sellerCreate,searchSellerById,idUserBySellerId,deleteSellerById,modifySellerById};