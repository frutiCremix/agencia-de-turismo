import connection from "../utils/conexionDB.js";

const clientCreate = ({ id }, callback) => {
  connection.query(
    "INSERT INTO cliente (usuario_id_usuario) VALUES (?)",
    [id],
    callback
  );
};

const searchClientById = (id, callback) => {
  connection.query(
    "SELECT * FROM cliente INNER JOIN usuario ON cliente.usuario_id_usuario = usuario.id_usuario where id_cliente = ?",
    [id],
    callback
  );
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
