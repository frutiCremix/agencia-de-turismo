import { Router } from "express";
import {
  createUser,
  searchUserByIdHandler,
  deleteUserByIdHandler,
} from "../controllers/userController.js";
import {
  searchClientByIdHandler,
  deleteClientByIdHandler,
  modifyClientByIdHandler,
} from "../controllers/clientController.js";
import {
  searchSellerByIdHandler,
  deleteSellerByIdHandler,
  modifySellerByIdHandler,
} from "../controllers/sellerController.js";
import {
  createServiceHandler,
  getPricePackage,
  getAllServiceHandler,
  getServiceHandler,
  deleteServiceHandler,
  modifyServiceByIdHandler
} from "../controllers/serviceController.js";
import { createSaleHandler,getAllSalesforUserHandler } from "../controllers/saleController.js";

import { sign, verify } from "../utils/jwt.js";
import { authenticate, isSeller } from "../utils/auth.js";
const router = Router();

router.get("/", getAllServiceHandler);

router.get("/user",verify, searchUserByIdHandler);
router.post("/user", createUser);
router.delete("/user/:id", deleteUserByIdHandler);

router.get("/client",verify, searchClientByIdHandler);
router.delete("/client",verify, deleteClientByIdHandler);
router.patch("/client",verify, modifyClientByIdHandler);

router.get("/seller",verify, searchSellerByIdHandler);
router.delete("/seller",verify, deleteSellerByIdHandler);
router.patch("/seller",verify, modifySellerByIdHandler);

router.get("/service",verify,isSeller,getServiceHandler);
router.post("/service", verify, isSeller, createServiceHandler);
//crear ruta patch para service
//falta verificar que sea el usuario creador
router.patch("/service",verify,isSeller,modifyServiceByIdHandler);
//ruta delete service logica agregamos una columna de alta/baja
//falta verificar que sea el usuario creador
router.delete("/service/:id",verify,isSeller,deleteServiceHandler);

router.get('/sales',verify,getAllSalesforUserHandler)
router.post("/sales", verify, getPricePackage, createSaleHandler);

router.post("/login", authenticate, (req, res) => {
  const id_usuario = req.user.id_usuario; 
  const token = sign(id_usuario, "1h");
  res.json({ token: token});
});
//ruta de prueba para los jwt
router.get("/private", verify, (req, res) => {
  res.json({
    message: "todo Correcto maestro puede continuar",
    usuario: req.user,
  });
});

export default router;
