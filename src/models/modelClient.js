//import connection from "../utils/conexionDB.js";
import {supabase} from '../utils/conectSupabase.js';

const clientCreate = async ( id ) => {
  try {
    const { data, error } = await supabase
      .from('cliente')
      .insert({ usuario_id_usuario: id });

    if (error) {
      throw new Error(`Error al crear el cliente: ${error.message}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

/*const searchClientById = (id, callback) => {
  connection.query(
    "SELECT * FROM cliente INNER JOIN usuario ON cliente.usuario_id_usuario = usuario.id_usuario where id_cliente = ?",
    [id],
    callback
  );
};*/
const searchClientById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('cliente')
      .select(`
        *,
        usuario:usuario_id_usuario(*)
      `)
      .eq('id_cliente', id)
      .single();


    if (error) {
      throw new Error(`Error al buscar el cliente con ID ${id}: ${error.message}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
};


const searchClientByUserId=(id,callback)=>{
  connection.query(
    "SELECT id_cliente FROM cliente WHERE usuario_id_usuario = ?",
    [id],
    callback
  );
}
//necesito el id del user antes de eliminar el cliente y luego eliminar al usuario
const idUserByClientId = (id, callback) => {
  connection.query(
    "SELECT * FROM cliente WHERE id_cliente = ?",
    [id],
    callback
  );
};

const deleteClientById = (id, callback) => {
  connection.query("DELETE FROM cliente WHERE id_cliente = ?", [id], callback);
};
export { clientCreate, searchClientById,searchClientByUserId, idUserByClientId, deleteClientById };
