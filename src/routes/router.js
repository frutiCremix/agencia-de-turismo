import {Router} from 'express';
import {createUser,searchUserByIdHandler,deleteUserByIdHandler} from '../controllers/userController.js'
import {searchClientByIdHandler,deleteClientByIdHandler,modifyClientByIdHandler} from '../controllers/clientController.js';
import {searchSellerByIdHandler,deleteSellerByIdHandler,modifySellerByIdHandler} from '../controllers/sellerController.js';
import {createServiceHandler,getPricePackage} from'../controllers/serviceController.js';
import {createSaleHandler} from '../controllers/saleController.js';


import {sign, verify} from '../utils/jwt.js';
import {authenticate,isSeller} from'../utils/auth.js';
const router = Router();

router.get('/user/:id',searchUserByIdHandler);
router.post('/user',createUser);
router.delete('/user/:id',deleteUserByIdHandler);


router.get('/client/:id',searchClientByIdHandler);
router.delete('/client/:id',deleteClientByIdHandler);
router.patch('/client/:id',modifyClientByIdHandler);


router.get('/seller/:id',searchSellerByIdHandler);
router.delete('/seller/:id',deleteSellerByIdHandler);
router.patch('/seller/:id',modifySellerByIdHandler);

router.post('/service',verify,isSeller,createServiceHandler);

router.post('/sales',verify,getPricePackage,createSaleHandler);

router.post('/login',authenticate,(req,res)=>{
    const token=sign(req.user,"1h");
    console.log({token: token,user:req.user})
    res.json({token: token,user:req.user});
});
//ruta de prueba para los jwt
router.get('/private',verify,(req,res)=>{
    res.json({message: 'todo Correcto maestro puede continuar',usuario:req.user});
});




export default router;