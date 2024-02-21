import connection from "../utils/conexionDB.js";
const userCreate = (
  {
    name,
    lastname,
    adress,
    dni,
    date,
    nationality,
    phone,
    email,
    rol,
    baja=false,
    username,
  },
  hash,
  callback
) => {
  // Validar que todos los campos requeridos estén presentes
  if (
    !name ||
    !lastname ||
    !adress ||
    !dni ||
    !date ||
    !nationality ||
    !phone ||
    !email ||
    !rol ||
    !username ||
    !hash
  ) {
    const error = new Error("Todos los campos son obligatorios.");
    return callback(error);
  }

  // Validar el formato del correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    const error = new Error(
      "El correo electrónico no tiene un formato válido."
    );
    return callback(error);
  }
  // Validar el formato de la fecha (yyyy-mm-dd)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    const error = new Error("La fecha debe tener el formato yyyy-mm-dd.");
    return callback(error);
  }

  connection.query(
    "INSERT INTO usuario (nombre,apellido,direccion,dni,fecha_nac,nacionalidad,celular,email,rol,baja,username,password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      name,
      lastname,
      adress,
      dni,
      date,
      nationality,
      phone,
      email,
      rol,
      baja,
      username,
      hash,
    ],
    callback
  );
};
const searchUserByUserName = (username, callback) => {
  connection.query(
    "SELECT * FROM usuario WHERE username = ?",
    [username],
    callback
  );
};
const searchUserById=(id,callback)=>{
  connection.query("SELECT * FROM usuario WHERE id_usuario = ?", [id], callback);
}
//damos la baja logica
const setUserAsInactiveById = (id, callback) => {
  connection.query("UPDATE usuario SET baja = TRUE WHERE id_usuario = ?", [id], callback);
};

const modifyUserById = (
  id,
  { nombre, apellido, direccion, dni, fecha_nac, nacionalidad, celular, email },
  callback
) => {
  connection.query(
    "UPDATE usuario SET nombre = ?, apellido = ?, direccion = ?, dni = ?, fecha_nac = ?, nacionalidad = ?, celular = ?, email = ? WHERE id_usuario = ?",
    [nombre, apellido, direccion, dni, fecha_nac, nacionalidad, celular, email, id],callback);
};

export { userCreate, searchUserByUserName,searchUserById, setUserAsInactiveById, modifyUserById };
