//import connection from "../utils/conexionDB.js";
import { supabase } from "../utils/conectSupabase.js";
const createService = async (vendedor_id_vendedor, { name, description, service_destination, service_date, cost, service_code }) => {

    const { data, error } = await supabase
        .from('servicio')
        .insert([
            {
                name: name,
                description: description,
                service_destination: service_destination,
                service_date: service_date,
                cost: cost,
                service_code: service_code,
                vendedor_id_vendedor: vendedor_id_vendedor
            }
        ])
        .select('*');

    if (error) {
        console.error('Error al insertar el servicio:', error.message);
        return null; 
    }

    return data;
};
const searchSellerByUserId = async (id) => {
    // Realizar la consulta para obtener el ID del vendedor
    const { data, error } = await supabase
        .from('vendedor')
        .select('id_vendedor')
        .eq('usuario_id_usuario', id); // Suponiendo que solo esperas un resultado único

    if (error) {
        throw new error;
    }
    return data;
};
const getPriceService = async (id) => {
    const { data, error } = await supabase
        .from('servicio')
        .select('vendedor_id_vendedor,cost')
        .eq('id_servicio', id);

    if (error) {
        throw new Error('Error al obtener el precio del servicio desde Supabase');
    }
    return data;
};
const getAllService = async()=>{
    const { data, error } = await supabase
    .from('servicio')
    .select('*')
    .limit(10);
    if (error) {
        throw new Error('Error al obtener los servicios desde Supabase');
    }
    
    return data;
}
export {createService,searchSellerByUserId,getPriceService,getAllService}