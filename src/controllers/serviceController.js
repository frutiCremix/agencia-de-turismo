import { createService,searchSellerByUserId,getPriceService } from "../models/modelService.js";
//necesitamos saber los servicios que pertenecen al empleado
const createServiceHandler = (req, res) => {
  const { id_usuario } = req.body;
  //con la foranea de empleado recupero el id del empleado
  searchSellerByUserId(id_usuario, (error, results, fields) => {
    if (error) {
      res
        .status(500)
        .json({
          message: "error al realizar la consulta de recuperar empleado",
        });
    }
    if (!results.length > 0) {
      res.status(404).json({ message: "Empleado no encontrado" });
    }
    //una vez recuperado el id del empleado enviarlo para crear el servicio
    const idSeller=results[0].id_empleado;
    
    createService(idSeller,req.body,(error,results,fields)=>{
        if (error) {
            return res.status(500).json({
              message: "Error al crear el servicio",error:error
            });
          }
        res.status(201).json({ message: "Servicio creado correctamente" });
    });
  });
};
const getPricePackage = (req, res, next) => {
  const servicios = req.body.servicios;
  let totalPrice = 0;
  const promises = [];
  const sellers=[];
//cremos el array de promesas y las resolvemos todas juntas para devolver una sola respuesta
  servicios.forEach((idService) => {
    const promise = new Promise((resolve, reject) => {
      getPriceService(idService, (error, results, fields) => {
        if (error) {
          reject("Error en la consulta de los precios");
        } else if (!results.length > 0) {
          reject("Servicio no encontrado");
        } else {
          
          totalPrice += results[0].costo_servicio;
          sellers.push(results[0].empleado_id_empleado);
          resolve();
        }
      });
    });
    promises.push(promise);
  });

  Promise.all(promises)
    .then(() => {
      req.price = totalPrice;
      req.sellers=sellers;
      next();
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
};
export { createServiceHandler,getPricePackage };
