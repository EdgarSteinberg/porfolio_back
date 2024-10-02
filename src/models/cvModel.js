import mongoose from 'mongoose';

const cvCollecion = 'cv';
//const cvCollecion = 'cv_test';

const cvSchema = mongoose.Schema({
    empresa: { type: String, required: true },
    fechaInicio: { type: Date, required: true }, // Para mayor flexibilidad en fechas
    fechaFin: { type: Date }, // Campo opcional si es un empleo actual
    puesto: { type: String, required: true },
    descripcionTareas: { type: String, required: true },
    tecnologias: [{ type: String }]
});

const cvModel = mongoose.model(cvCollecion, cvSchema);

export default cvModel;