// import multer from 'multer';
// import path from 'path';
// import __dirname from './constants.js';

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let folder = 'public/img'; // Carpeta predeterminada
//         if (file.fieldname === 'technologies') {
//             folder = 'public/technologies';
//         } else if (file.fieldname === 'profile') {
//             folder = 'public/profile';
//         }
//         else if (file.fieldname === 'certificates') {
//             folder = 'public/certificates';
//         }
//         else if (file.fieldname === 'skills') {
//             folder = 'public/skills';
//         }
//         else if (file.fieldname === 'image') {
//             folder = 'public/image';
//         }
//         // Construir la ruta completa usando path.join y __dirname
//         const fullPath = path.join(__dirname, '../../', folder);
//         console.log(`Ruta de carga de archivo: ${fullPath}`); // Mensaje de depuración (opcional)
//         cb(null, fullPath);
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });

//export const uploader = multer({ storage });

import multer from 'multer';
import path from 'path';
import __dirname from './constants.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'public/img';  // Carpeta predeterminada

        // Lógica para decidir la carpeta según el campo de formulario
        if (file.fieldname === 'skills_frontend') {
            folder = 'public/skills/frontend';
        } else if (file.fieldname === 'skills_backend') {
            folder = 'public/skills/backend';
        } else if (file.fieldname === 'skills_tools') {
            folder = 'public/skills/tools';
        } else if (file.fieldname === 'certificates') {
            folder = 'public/certificates';
        } else if (file.fieldname === 'image') {
            folder = 'public/image';
        } else if (file.fieldname === 'technologies') {
            folder = 'public/technologies';
        }

        // Construir la ruta completa usando path.join y __dirname
        const fullPath = path.join(__dirname, '../../', folder);
        console.log(`Ruta de carga de archivo: ${fullPath}`);  // Mensaje de depuración (opcional)
        cb(null, fullPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);  // Mantiene el nombre original del archivo
    }
});

export const uploader = multer({ storage });
