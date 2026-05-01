import app from './app.js';
import env from './config/env.js';
import { TestConnecion } from './db/testConnection.js'

async function main(){
    await TestConnecion();

    app.listen(env.PORT, () => {
    console.log(`API is running on: http://localhost:${env.PORT}`);
    })
}

main().catch((error) => {
    console.error('Error starting server', error);
    process.exit(1);
})
