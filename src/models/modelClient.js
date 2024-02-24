//import connection from "../utils/conexionDB.js";
import { supabase } from "../utils/conectSupabase.js";

const clientCreate = async (id) => {
  try {
    const { data, error } = await supabase
      .from("cliente")
      .insert({ usuario_id_usuario: id });

    if (error) {
      throw new Error(`Error al crear el cliente: ${error.message}`);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

const searchClientById = async (id) => {
  try {
    const { data, error } = await supabase
      .from("cliente")
      .select(
        `
        *,
        usuario:usuario_id_usuario(*)
      `
      )
      .eq("id_cliente", id);

    if (error) {
      throw new Error(
        `Error al buscar el cliente con ID ${id}: ${error.message}`
      );
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const searchClientByUserId = async (id) => {
  try {
      // Realizar la consulta para obtener el ID del cliente
      const { data, error } = await supabase
          .from('cliente')
          .select('id_cliente')
          .eq('usuario_id_usuario', id);
           // Suponiendo que solo esperas un solo resultado

      if (error) {
          throw new Error('Error al buscar el cliente en Supabase');
      }
      
      return data;
  } catch (error) {
      throw error;
  }
};
//necesito el id del user antes de eliminar el cliente y luego eliminar al usuario
const idUserByClientId = async (id) => {
  try {
    const { data, error } = await supabase
      .from("cliente")
      .select("*")
      .eq("id_cliente", id);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const deleteClientById = (id, callback) => {
  connection.query("DELETE FROM cliente WHERE id_cliente = ?", [id], callback);
};
export {
  clientCreate,
  searchClientById,
  searchClientByUserId,
  idUserByClientId,
  deleteClientById,
};
