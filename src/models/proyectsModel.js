import mongoose from 'mongoose';

const proyectsCollection = 'proyects';

const proyectSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: [String], default: [] },
    url: { type: [String], default: [], required: true },
    technologies: { type: [String], default: [] }
});

const proyectModel = mongoose.model(proyectsCollection, proyectSchema);

export default proyectModel;