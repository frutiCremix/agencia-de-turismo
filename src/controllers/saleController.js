import { createSale } from "../models/modelSale.js";
import { searchClientByUserId } from "../models/modelClient.js";
import { createPackage } from "../models/modelPackage.js";
import {
  getAllServiceById,
  serviceSoldForUser,
} from "../models/modelService.js";
import { idSellerByUserId } from "../models/modelSeller.js";
const createSaleHandler = async (req, res) => {
  const id_usuario = req.user;

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
        res.status(500).json({
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
const getAllSalesforUserHandler = async (req, res) => {
  try {
    //recuperamos todos los servicios que ofrece el vendedor
    //primero obtener el id vendedor
    const resultIdSeller = await idSellerByUserId(req.user);
    //obtenemos todos lso servicios del vendedor
    const resultsService = await getAllServiceById(
      resultIdSeller[0].id_vendedor
    );
    
    //ahora hacer un join con paquete (servicios vendidos)
    const promises = resultsService.map(async (e) => {
      return await serviceSoldForUser(e.id_servicio);
    });
    const arr = await Promise.all(promises);
    res.json({ services_sold: arr });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Hubo un error al obtener las ventas del usuario",error:error.message });
  }
};
export { createSaleHandler, getAllSalesforUserHandler };
