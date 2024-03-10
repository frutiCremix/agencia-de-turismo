import {
  createService,
  searchSellerByUserId,
  getPriceService,
  getAllService,
  getAllServiceById,
  getServiceById,
  setServiceAsInactiveById,
  modifyServiceById
} from "../models/modelService.js";
import { idSellerByUserId } from "../models/modelSeller.js";
//necesitamos saber los servicios que pertenecen al empleado

const createServiceHandler = async (req, res) => {
  const id_usuario = req.user;
  try {
    // Buscar el vendedor por ID de usuario
    const sellerId = await searchSellerByUserId(id_usuario);

    if (!sellerId) {
      return res.status(404).json({ message: "Vendedor no encontrado" });
    }

    const serviceData = req.body;
    const resultsCreate = await createService(
      sellerId[0].id_vendedor,
      serviceData
    );

    if (!resultsCreate || resultsCreate.error || resultsCreate.length == 0) {
      return res.status(500).json({ message: "Error al crear el servicio" });
    }

    res
      .status(201)
      .json({
        message: "Servicio creado correctamente",
        service: resultsCreate[0],
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error });
  }
};
const getPricePackage = async (req, res, next) => {
  //[1,5,3]<-- ids de servicios

  const servicios = req.body.id_servicios;
  let totalPrice = 0;
  const sellers = [];
  const promises = [];
  //Creamos el array de promesas
  //las resolvemos todas juntas
  servicios.forEach((idService) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const serviceData = await getPriceService(idService);
        if (!serviceData) {
          reject("Servicio no encontrado");
        } else {
          totalPrice += serviceData[0].cost;
          sellers.push(serviceData[0].vendedor_id_vendedor);
          resolve();
        }
      } catch (error) {
        reject("Error en la consulta de los precios");
      }
    });
    promises.push(promise);
  });

  // Esperamos a que se resuelvan todas las promesas
  try {
    await Promise.all(promises);
    req.price = { totalPrice };
    req.sellers = { sellers };

    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error interno del servidor", error: error.message });
  }
};
const getAllServiceHandler = async (req, res) => {
  try {
    const results = await getAllService();
    if (!results || results.error || results.length == 0) {
      res.status(404).json({ message: "no se encontraron servicios" });
    }
    res.json({ message: "servicios", results: results });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error en la solicitud getAllService", error: error });
  }
};
const getServiceHandler = async (req, res) => {
  const id = req.user;

  try {
    const seller = await idSellerByUserId(id);

    if (!seller || seller.error || seller.length == 0) {
      return res.status(404).json({ message: "Vendedor no existe" });
    }
    const results = await getAllServiceById(seller[0].id_vendedor);

    if (!results || results.error || results.length == 0) {
      res
        .status(404)
        .json({
          message: "vendedor no posee servicios cargados",
          idSeller: idSeller,
          idUser: id,
        });
    }
    res.json({ message: "servicios encontrados con exito", results: results });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "error en la peticion de obetner servicios por id_vendedor",
        error: error.message,
      });
  }
};
const deleteServiceHandler = async (req, res) => {
  const  id_servicio  = req.params.id;
  //verificar que el servicio pertenesca al vendedor
  //usar el id del token para evitar hackeos. y recuperar el vendedor
  try {
    const results = await setServiceAsInactiveById(id_servicio);
    res.json({ message: "dado de baja con exito", servicio: results });
  } catch (error) {
    res.status(500).json({message:"error en la peticion de dar de baja el servicio por id",
    error: error.message,})
  }
};

const modifyServiceByIdHandler = async (req, res) => {
  const newService = req.body;
try{
  
  const service=await getServiceById(newService.id_service);
 
    if (!service||service.error|| service.length==0) {
      return res.status(404).json({ message: "Servicio no existe" });
    }

   
    if (typeof newService.name !== 'undefined') {
        service.name = newService.name;
    }
    if (typeof newService.description !== 'undefined') {
      service.description = newService.description;
    }
    if (typeof newService.service_destination !== 'undefined') {
      service.service_destination = newService.service_destination;
    }
    if (typeof newService.service_date !== 'undefined') {
      service.service_date = newService.service_date;
    }
    if (typeof newService.cost !== 'undefined') {
      service.cost = newService.cost;
    }
    if (typeof newService.service_code !== 'undefined') {
      service.service_code = newService.service_code;
    }
    if (typeof newService.service_state !== 'undefined') {
      service.service_state = newService.service_state;
    }
   
    const resultModify=await modifyServiceById(newService.id_service, service); 

    if(!resultModify||resultModify.error||resultModify.length==0){
      return res.status(404).json({ message: "Error al modificar servicio no encontrado" });
    }
    
    res.json({message:"Servicio modificado con exito",idServicio:service[0].id_servicio});
  }catch(error){
    return res.status(500).json({ message: "Error en la consulta de modificacion",error:error });
  }
};


export {
  createServiceHandler,
  getPricePackage,
  getAllServiceHandler,
  getServiceHandler,
  deleteServiceHandler,
  modifyServiceByIdHandler
};
