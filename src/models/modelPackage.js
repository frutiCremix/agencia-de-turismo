import connection from "../utils/conexionDB.js";

export const createPackage=(num_venta,idServicio)=>{
    return new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO paquete (venta_num_venta, servicio_id_servicio) VALUES (?, ?)",
          [num_venta, idServicio],
          (error, results, fields) => {
            if (error) {
              reject(error); // Rechazar la promesa en caso de error
            } else {
              resolve(results); // Resolver la promesa con los resultados
            }
          }
        );
      });
}