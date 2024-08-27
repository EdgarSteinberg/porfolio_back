import proyectModel from "../models/proyectsModel.js";

class ProyectsController{

    async getAllProyects() {
        try{
            return await proyectModel.find();
        }catch(error){
            console.log('Error al obtener todos los proyectos:', error.message);
            throw new Error(`Error al obtener todos los proyectos: ${error.message}`);
        }
    }

    async getAllProyectById(pid) {
        try{
            const result = await proyectModel.findOne({_id : pid})
            return result;
        }catch(error){
            console.log(`Error al obtener el proyecto con ID ${pid}:`, error.message);
            throw new Error(`Error al obtener el proyecto con ID ${pid}: ${error.message}`);
        }
    }

    async createProyect(proyect){
        const {title, description, url, thumbnail} = proyect;

        if(!title || !description || !url ) {
            throw new Error(`Debes completar todos los campos`)
        }

        try{
            const proyecto = await proyectModel.create({title, description , url, thumbnail});

            return proyecto
        }catch(error){
            console.log('Error al crear el proyecto:', error.message);
            throw new Error(`Error al crear el proyecto: ${error.message}`);
        }
    };

    async updateProyect(pid, updates){
        if(!pid || !updates) {
            throw new Error(`El ID del proyecto y los datos a actualizar son requeridos`);
        }

        try{
            const result = await proyectModel.updateOne({_id: pid}, updates);
            if (!result){
                throw new Error(`El proyecto con ID ${pid}, no existe`)
            }
            return result
        }catch(error){
            console.log(`Error al actualizar el proyecto con ID: ${pid}`, error.message);
            throw new Error(`Error al actualizar el proyecto con ID: ${pid}: ${error.message}`)
        }
    }

    async deleteProyect(pid){
        if (!pid) {
            throw new Error('El ID del proyecto es requerido');
        }

        try{
            const result = await proyectModel.deleteOne({_id: pid});
            if (result.deletedCount === 0) {
                throw new Error(`El proyecto con ID ${pid} no existe`);
            }
            return result;
        }catch(error){
            console.log(`Error al eliminar el proyecto con ID ${pid}:`, error.message);
            throw new Error(`Error al eliminar el proyecto con ID ${pid}: ${error.message}`);
        }
    }
}

export default ProyectsController;