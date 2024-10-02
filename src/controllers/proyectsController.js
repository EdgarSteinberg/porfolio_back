import ProyectDao from "../dao/proyectsDAo.js";

const proyectsDAO = new ProyectDao();

class ProyectsController {

    async getAllProyects() {
        try {
            return await proyectsDAO.getAllProyects();
        } catch (error) {
            console.log('Error al obtener todos los proyectos:', error.message);
            throw new Error(`Error al obtener todos los proyectos: ${error.message}`);
        }
    }

    async getAllProyectById(pid) {
        try {
            const result = await proyectsDAO.getProyectById(pid);
            return result;
        } catch (error) {
            console.log(`Error al obtener el proyecto con ID ${pid}:`, error.message);
            throw new Error(`Error al obtener el proyecto con ID ${pid}: ${error.message}`);
        }
    }

    async createProyect(proyect) {
        const { title, description, url, thumbnail, technologies } = proyect;

        if (!title || !description || !url) {
            throw new Error(`Debes completar todos los campos`)
        }

        try {
            const proyecto = await proyectsDAO.createProyect({ title, description, url, thumbnail, technologies });

            return proyecto
        } catch (error) {
            console.log('Error al crear el proyecto:', error.message);
            throw new Error(`Error al crear el proyecto: ${error.message}`);
        }
    };

    async updateProyect(pid, updates) {
        if (!pid || !updates) {
            throw new Error(`El ID del proyecto y los datos a actualizar son requeridos`);
        }

        try {
            const result = await proyectsDAO.updateProyect(pid, updates);
            if (!result) {
                throw new Error(`El proyecto con ID ${pid}, no existe`)
            }
            return result
        } catch (error) {
            console.log(`Error al actualizar el proyecto con ID: ${pid}`, error.message);
            throw new Error(`Error al actualizar el proyecto con ID: ${pid}: ${error.message}`)
        }
    }

    async deleteProyect(pid) {
        if (!pid) {
            throw new Error('El ID del proyecto es requerido');
        }

        try {
            const result = await proyectsDAO.deleteProyect(pid);
            if (result.deletedCount === 0) {
                throw new Error(`El proyecto con ID ${pid} no existe`);
            }
            return result;
        } catch (error) {
            console.log(`Error al eliminar el proyecto con ID ${pid}:`, error.message);
            throw new Error(`Error al eliminar el proyecto con ID ${pid}: ${error.message}`);
        }
    }
}

export default ProyectsController;