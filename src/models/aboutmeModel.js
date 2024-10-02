import mongoose from 'mongoose';

const aboutmeCollection = 'aboutme';
//const aboutmeCollection = 'aboutme_tests';

const aboutmeSchema = mongoose.Schema({
    image: { type: [String], required: true },  // Nombre del archivo de la imagen principal
    description: { type: String, required: true },
    skills: {
        frontend: [
            {
                title: { type: String, required: true },  // Nombre de la habilidad
                image: { type: String, required: true },  // Archivo de imagen asociado a la habilidad
            }
        ],
        backend: [
            {
                title: { type: String, required: true },
                image: { type: String, required: true },
            }
        ],
        tools: [
            {
                title: { type: String, required: true },
                image: { type: String, required: true },
            }
        ]
    },
    certificates: { type: [String], required: true }, 
});

const aboutmeModel = mongoose.model(aboutmeCollection, aboutmeSchema)

export default aboutmeModel