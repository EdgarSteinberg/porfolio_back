import express from 'express';
import mongoose from 'mongoose';
import compression from 'express-compression';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import cors from 'cors';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import cluster from 'cluster';
import { cpus } from 'os';

// Utilidades y Rutas
import __dirname from './utils/constants.js';
import userRouter from './routes/userRouter.js';
import messageRouter from './routes/messageRouter.js';
import proyectRouter from './routes/proyectsRouter.js';
import gitHubRouter from './routes/github.js';
import aboutmeRouter from './routes/aboutmeRouter.js';
import cvRouter from './routes/cvRouter.js';
import addLogger from './utils/logger.js';


// Configuración de Passport
import initializePassport from './config/passportJWT.js';
import initializePassportGitHub from './config/passportGitHub.js';

// Inicializar variables de entorno
dotenv.config();

// Crear instancia de Express
const app = express();

// Middleware de compresión para optimizar respuestas
app.use(compression());

// Manejo de múltiples núcleos con Cluster
/* if (cluster.isPrimary) {
    // Crear un proceso por cada núcleo de la CPU disponible
    for (let i = 0; i < cpus().length; i++) {
        cluster.fork();
    }

    // Si un worker falla, crear uno nuevo
    cluster.on('disconnect', worker => {
        console.log(`PID instance ${worker.process.pid} down, creating a new one...`);
        cluster.fork();
    });
} else { */
    // Bloque de conexión a MongoDB
    const uri = process.env.MONGODB_URI;
    mongoose.connect(uri);

    // Middlewares generales
    app.use(addLogger);  // Logger personalizado
    app.use(express.json());  // Para parsear JSON
    app.use(express.urlencoded({ extended: true }));  // Para parsear datos de formularios
    //app.use(express.static('public'));  // Archivos estáticos

    // Opciones comentadas de `express.static`
     app.use(express.static(`${__dirname}/../../public`));
    // app.use(express.static(path.join(__dirname, 'public')));

    // Configuración de CORS (Descomentar si es necesario)
    // app.use(cors());

    // CORS configurado para permitir solicitudes desde el frontend local
    
  /*   app.use(cors({
        origin: ['https://porfolio-frontend.onrender.com', 'https://portafolio-steinberg-edgar.netlify.app', 'http://localhost:5173', 'https://edgar-steinberg-portfolio.netlify.app'], // Permite múltiples orígenes
        credentials: true
    })); */
    app.use(cors({
        origin: [ 'http://localhost:5173', 'https://edgar-steinberg-portfolio.netlify.app'], // Permite múltiples orígenes
        credentials: true
    }));

    // Middleware para parsear cookies
    app.use(cookieParser());

    // Inicializar Passport para autenticación
    initializePassport();
    initializePassportGitHub();
    app.use(passport.initialize());

    // Documentación Swagger
    const swaggerOptions = {
        definition: {
            openapi: '3.0.1',
            info: {
                title: 'API de Portafolio CV',
                description: 'Esta API proporciona endpoints para gestionar proyectos y usuarios en un portafolio personal. Incluye funcionalidades para registrar, actualizar, eliminar y visualizar proyectos y perfiles de usuario.',
            },
        },
        apis: [`${__dirname}/../docs/**/*.yaml`],  // Definir las rutas de la documentación Swagger
    };
    const specs = swaggerJsDoc(swaggerOptions);
    app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

    // Rutas de la API
    app.use('/api/users', userRouter);
    app.use('/api/messages', messageRouter);
    app.use('/api/proyects', proyectRouter);
    app.use('/api/gitHub', gitHubRouter);
    app.use('/api/aboutme', aboutmeRouter);
    app.use('/api/cv', cvRouter);


    // Ruta comentada para una página de inicio
    // app.get('/home', (req, res) => {
    //     res.send('Welcome to the application');
    // });

    // Manejo de errores 404
    app.use((req, res, next) => {
        res.status(404).send('Not Found');
    });

    // Iniciar el servidor
    const PORT = 8080;
    app.listen(PORT, () => {
        console.log(`Worker ${process.pid} is running and listening on http://localhost:${PORT}`);
    });
//}

// URL de referencia (manténla si la necesitas para documentación)
/// https://almondine-stealer-d91.notion.site/0fe6b4bc1c354ef99f0f88380a7e924a?v=ac85a3a9ef1c4616bcfff66e99ce10ea&p=a9105f3501fc432a9bf5773420089dd1&pm=s
