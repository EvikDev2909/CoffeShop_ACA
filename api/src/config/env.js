import dotenv from 'dotenv';
dotenv.config({ quiet: true });

function findEnvVariable(name){
    const envVariable = process.env[name] || null;
    if(!envVariable){
        let errorMessage = `Se intento acceder a la variable de entorno ${name} la cual no retorna ningun valor.`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
    return envVariable;
}

const env = {
    PORT: findEnvVariable('PORT'),
    DB_URL: findEnvVariable('DATABASE_URL')
}

export default env;
