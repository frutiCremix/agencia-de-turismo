import { createSale } from "../models/modelSale.js";
import { searchClientByUserId } from "../models/modelClient.js";
import {createPackage} from '../models/modelPackage.js';
const createSaleHandler = (req, res) => {
  const { id_usuario } = req.user;
  const { medio_pago } = req.body;
  const {servicios} = req.body;
  const subtotal = req.price;
  //si son varios servicios de distintos empleados(vendedores se guara la cadena).
  // luego se separan los id para localizar a cada vendedor ej => 5-1-2

  const strEmployees = req.employees.map((e) => e.toString()).join("-");
  
//recuperamos el id del cliente mediante el id de la tabla usuario
  searchClientByUserId(id_usuario, (error, results, fields) => {
    if (error) {
      return res.status(500).json({ message: "Error al buscar el cliente" });
    }
    if (!results.length > 0) {
      return res.status(404).json({ message: "cliente no encontrado" });
    }
    const idClient = results[0].id_cliente;

    createSale(
      medio_pago,
      idClient,
      subtotal,
      strEmployees,
      (error, resultsSale, fields) => {
        if (error) {
          return res.status(500).json({
            message: "Error al crear la venta",
            error: error,
          });
        }
        //res.status(201).json({ message: "Venta creada correctamente" });
        //recuperar el numero de venta(id) y hacer la relacion con todos los servicios
       const num_venta=resultsSale.insertId;
      //devulve una promesa
        const promises=servicios.map((idServicio)=> createPackage(num_venta,idServicio));
        Promise.all(promises)
          .then(results => {
            res.status(201).json({message:"paquetes creado con exito"});
          })
          .catch(error => {
            res.status(500).json({message:"error al crear los paquetes",error:error});
          });
        
      }
    );
  });
};
export { createSaleHandler };
