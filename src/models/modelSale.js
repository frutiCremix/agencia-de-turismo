//import connection from "../utils/conexionDB.js";
import { supabase } from "../utils/conectSupabase.js";
export const createSale = async (payment_method, idClient, subtotal, strSellers) => {
    try {
        // Insertar la venta en la tabla correspondiente utilizando Supabase
        const { data, error } = await supabase
            .from('venta')
            .insert([
                {
                    payment_method: payment_method,
                    cliente_id_cliente: idClient,
                    subtotal: subtotal,
                    ids_vendedores: strSellers
                }
            ])
            .select('*');

        if (error) {
            throw new Error('Error al crear la venta en Supabase');
        }
        return data;
    } catch (error) {
        throw error;
    }
};
