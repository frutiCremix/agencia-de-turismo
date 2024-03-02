//import connection from "../utils/conexionDB.js";
import {supabase} from '../utils/conectSupabase.js';
const userCreate = async (
  {
    name,
    lastname,
    address,
    dni,
    birthdate,
    country,
    phone,
    email,
    role,
    user_state = true,
    username,
  },
  hash
) => {
  // Validar que todos los campos requeridos estén presentes
  if (!name || !lastname || !address || !dni || !birthdate || !country || !phone || !email || !role || !username || !hash) {
    throw new Error("Todos los campos son obligatorios.");
  }

  // Validar el formato del correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("El correo electrónico no tiene un formato válido.");
  }

  // Validar el formato de la fecha (yyyy-mm-dd)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(birthdate)) {
    throw new Error("La fecha debe tener el formato yyyy-mm-dd.");
  }
  if (role !== "cliente" && role !== "vendedor") {
    throw new Error("El rol debe ser 'cliente' o 'vendedor'.");
  }
  const phoneRegex = /^\d{8,}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error("El número de teléfono debe contener solo números.");
  }

  try {
    const { data, error } = await supabase
      .from("usuario")
      .insert({
        name,
        lastname,
        address,
        dni,
        birthdate,
        country,
        phone,
        email,
        role,
        user_state,
        username,
        password: hash,
      })
      .select('*');// Utiliza .single() para asegurarte de que solo se inserte un registro y obtener ese registro

    if (error) {
      throw new Error(`Error al insertar el usuario: ${error.message}`);
    }

    return data; // Devuelve los datos insertados
  } catch (error) {
    throw error;
  }
};
const searchUserByUserName = async (username) => {
  try{
    const {data,error} = await supabase
    .from('usuario')
    .select('*')
    .eq('username',username)
  if(error){
    throw error;
  }
  if (data && data.length > 0 && data[0].id_usuario) {
    
    
    return data[0];

  } else {
    throw new Error("No se pudo obtener el ID del usuario insertado.");
  } 
  }catch(error){
    throw error;
  }
  
};
const searchUserById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select('*')
      .eq('id_usuario', id);

    if (error) {
      throw error;
    }
    return data ? data[0] : null; 
  } catch (error) {
    throw error;
  }
};

const setUserAsInactiveById = async (id) => {
  try {
     const { data, error } = await supabase
      .from('usuario')
      .update({ user_state: false })
      .eq('id_usuario', id)
      .select('*');
    if (error) {
      throw error;
    }
    
    return data;
    
  } catch (error) {
    throw error;
  }
};


const modifyUserById = async (
  id,
  { name, lastname, address, dni, birthdate, country, phone, email }
) => {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .update({
        name: name,
        lastname: lastname,
        address: address,
        dni: dni,
        birthdate: birthdate,
        country: country,
        phone: phone,
        email: email
      })
      .eq('id_usuario', id)
      .select('*');

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    throw error;
  }
};

export { userCreate, searchUserByUserName,searchUserById, setUserAsInactiveById, modifyUserById };
