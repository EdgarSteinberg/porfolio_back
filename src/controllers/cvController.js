import CvDao from "../dao/cvDao.js";

const cvDao = new CvDao();

class cvController {
    async getCv() {
        try {
            return await cvDao.getAllcv();
        } catch (error) {
            console.error(`Error al obtener los CVs:`, error.message);
            throw new Error(`Error al obtener los CVs: ${error.message}`);
        }
    }

    async getCvById(cid) {
        try {
            if (!cid) throw new Error(`El CV con ID: ${cid} no existe`);

            const result = await cvDao.getCvById(cid);
            if (!result) throw new Error(`El CV con ID: ${cid} no existe`);

            return result;
        } catch (error) {
            console.error(`Error al obtener el CV con ID: ${cid}`, error.message);
            throw new Error(`Error al obtener el CV con ID: ${cid}: ${error.message}`);
        }
    }

    async createCv(cv) {
        try {
            const { empresa, fechaInicio, fechaFin, puesto, descripcionTareas, tecnologias } = cv;

            if (!empresa || !fechaInicio || !puesto || !descripcionTareas) {
                throw new Error(`Debes completar todos los campos requeridos para crear el CV`);
            }

            const result = await cvDao.createCv({ empresa, fechaInicio, fechaFin, puesto, descripcionTareas, tecnologias });

            return result;
        } catch (error) {
            console.error(`Error al crear el CV:`, error.message);
            throw new Error(`Error al crear el CV: ${error.message}`);
        }
    }

    async updateCv(cid, update) {
        try {
            if (!cid || !update) throw new Error(`Debes proporcionar un ID y los datos a actualizar`);

            const result = await cvDao.updateCv(cid, update);
            if (!result) throw new Error(`El CV con ID: ${cid} no existe`);

            return result;
        } catch (error) {
            console.error(`Error al actualizar el CV con ID: ${cid}`, error.message);
            throw new Error(`Error al actualizar el CV con ID: ${cid}: ${error.message}`);
        }
    }

    async deleteCv(cid) {
        try {
            if (!cid) throw new Error(`Debes proporcionar un ID para eliminar el CV`);

            const result = await cvDao.deleteCv(cid);
            if (result.deletedCount === 0) throw new Error(`El CV con ID: ${cid} no existe`);

            return result;
        } catch (error) {
            console.error(`Error al eliminar el CV con ID: ${cid}`, error.message);
            throw new Error(`Error al eliminar el CV con ID: ${cid}: ${error.message}`);
        }
    }
}

export default cvController;
