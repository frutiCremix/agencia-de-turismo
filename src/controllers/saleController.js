import { createSale } from "../models/modelSale.js";
import { searchClientByUserId } from "../models/modelClient.js";
import { createPackage } from "../models/modelPackage.js";

const createSaleHandler = async (req, res) => {
  
  const  id_usuario  = req.user;
  
  const { payment_method } = req.body;
  const { id_servicios } = req.body;
  const { sellers } = req.sellers;
  const subtotal = req.price.totalPrice;
  //si son varios servicios de distintos vendedores(sellers se guarda la cadena).
  // luego se separan los id para localizar a cada vendedor ej => 5-1-2
  const strSellers = sellers.map((e) => e.toString()).join("-");
  //recuperamos el id del cliente mediante el id de la tabla usuario
  try {
    const resultSearchClient = await searchClientByUserId(id_usuario);
    if (
      !resultSearchClient ||
      resultSearchClient.error ||
      !resultSearchClient.length > 0
    ) {
      return res.status(404).json({ message: "cliente no encontrado" });
    }

    const idClient = resultSearchClient[0].id_cliente;

    const resultsSale = await createSale(
      payment_method,
      idClient,
      subtotal,
      strSellers
    );
    const id_venta = resultsSale[0].id_venta;

    //res.status(201).json({ message: "Venta creada correctamente" });
    //recuperar el numero de venta(id) y hacer la relacion con todos los servicios

    //devuelve una promesa
    const promises = id_servicios.map((idServicio) =>
      createPackage(id_venta, idServicio)
    );
    Promise.all(promises)
      .then((results) => {
        res.status(201).json({ message: "paquetes creado con exito" });
      })
      .catch((error) => {
        res
          .status(500)
          .json({
            message: "error al crear los paquetes",
            error: error.message,
          });
      });
  } catch (error) {
    return res.status(500).json({
      message: "Error al crear la venta",
      error: error.message,
    });
  }
};
export { createSaleHandler };
