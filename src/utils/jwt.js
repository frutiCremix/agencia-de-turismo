import jwt from 'jsonwebtoken';

const secretKey='secreto_ninja';

export function sign(u,exp){
    //hacerl la logica para verificar en la bd y ver el rol
    return jwt.sign({user: u },secretKey,{expiresIn: exp});
}

export function verify(req,res,next){
    const token=req.headers['authorization'];

    if(!token){
        return res.status(403).json({menssage: 'Token no proporcionado'});
    }
    //le sacamos el "Bearer "
    const formatedToken=token.split(" ")[1];

    jwt.verify(formatedToken,secretKey,(err,decoded)=>{
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token expirado' });
            } else {
                return res.status(401).json({ message: 'Token inválido' });
            }
        }
       
        req.user=decoded.user;
        next();
    });
    
}