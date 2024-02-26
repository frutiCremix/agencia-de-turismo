import {
  createService,
  searchSellerByUserId,
  getPriceService,
  getAllService
} from "../models/modelService.js";
//necesitamos saber los servicios que pertenecen al empleado

const createServiceHandler = async (req, res) => {
  const id_usuario   = req.user;
  try {
    // Buscar el vendedor por ID de usuario
    const sellerId = await searchSellerByUserId(id_usuario);
  
    if (!sellerId) {
      return res.status(404).json({ message: "Vendedor no encontrado" });
    }

    // Crear el servicio utilizando los datos recibidos en el cuerpo de la solicitud (req.body)
    const serviceData = req.body;
    const resultsCreate = await createService(sellerId[0].id_vendedor, serviceData);

    if (!resultsCreate || resultsCreate.error || resultsCreate.length==0) {
      return res.status(500).json({ message: "Error al crear el servicio" });
    }
    // Si se crea el servicio correctamente, enviar una respuesta de éxito
    res.status(201).json({ message: "Servicio creado correctamente",service:resultsCreate[0]});
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor",error:error });
  }
};
const getPricePackage = async (req, res, next) => {
  //[1,5,3]<-- ids de servicios
 
  const servicios = req.body.id_servicios;
  let totalPrice = 0;
  const sellers = [];
  const promises = [];
//Creamos el array de promesas
//las resolvemos todas juntas para devolver una sola respuesta
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
      req.price={totalPrice};
      req.sellers={sellers};
      
      next();
  } catch (error) {
      res.status(500).json({ message: "Error interno del servidor",error:error });
  }
  
};
const getAllServiceHandler=async (req,res)=>{
  try{
  const results=await getAllService();
  if(!results || results.error || results.length==0){
    res.status(404).json({message:'no se encontraron servicios'})
  }
  res.json({message:'servicios',results:results})
  }catch(error){
    res.status(500).json({message:'error en la solicitud getAllService',error:error});
  }
}
export { createServiceHandler, getPricePackage,getAllServiceHandler };
