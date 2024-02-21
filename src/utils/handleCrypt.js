import bcrypt from 'bcryptjs';

const salt=10;

function encrypt(password){
    let pEncriptada=bcrypt.hashSync(password,salt);

    return pEncriptada;
}

async function compare(password, hash) {
   
        const result = await bcrypt.compare(password, hash);
        return result;
    
}

export {encrypt,compare};