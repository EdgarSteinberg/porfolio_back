//Configuración de Directorios y Exportación de __dirname
import { fileURLtoPath } from 'path';
import { dirname } from 'path';

const __filename = fileURLtoPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;