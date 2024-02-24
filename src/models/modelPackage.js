//import connection from "../utils/conexionDB.js";
import { supabase } from "../utils/conectSupabase.js";
export const createPackage = async (id_venta, idServicio) => {
  try {
    console.log('dentro de model paquete',id_venta,idServicio)
      // Insertar el paquete en la tabla correspondiente utilizando Supabase
      const { data, error } = await supabase
          .from('paquete')
          .insert([
              {
                  venta_id_venta: id_venta,
                  servicio_id_servicio: idServicio
              }
          ]);

      if (error) {
          throw new Error('Error al crear el paquete en Supabase');
      }

      return data;
  } catch (error) {
      throw error;
  }
};
