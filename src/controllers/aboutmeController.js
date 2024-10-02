import AboutmeDao from "../dao/aboutmeDao.js";

const aboutmeDao = new AboutmeDao();

class aboutmeController {

    async getAboutme() {
        try {
            return await aboutmeDao.getAllAboutme();
        } catch (error) {
            console.log('Error al obtener el aboutme', error.message);
            throw new Error(`Error al obtener aboutme ${error.message}`);
        }
    }

    async getAboutmeById(aid) {
        try {
            const result = await aboutmeDao.getAboutmeById(aid)
            if (!result) {
                throw new Error(`No se encontró el aboutme con ID: ${aid}`);
            }
            return result
        } catch (error) {
            console.log(`Error el ID: ${aid} no existe`, error.message);
            throw new Error(`Error el ID: ${aid} no existe ${error.message}`);
        }
    }

    async createAboutme(aboutme) {
        try {
            const { image, description, skills, certificates } = aboutme;

            // Verificación de los campos principales
            if (!image || !description || !skills || !certificates) {
                throw new Error(`Debes completar todos los campos`);
            }

            // Validación específica para las subcategorías de skills
            if (!skills.frontend || !skills.backend || !skills.tools) {
                throw new Error(`Debes proporcionar las skills de frontend, backend y tools`);
            }

            // Crear el documento en MongoDB
            const result = await aboutmeDao.createAboutme({
                image,
                description,
                skills: {
                    frontend: skills.frontend.map(skill => ({
                        title: skill.title,  // Título de la habilidad de frontend
                        image: skill.image   // Imagen asociada a la habilidad
                    })),
                    backend: skills.backend.map(skill => ({
                        title: skill.title,  // Título de la habilidad de backend
                        image: skill.image   // Imagen asociada a la habilidad
                    })),
                    tools: skills.tools.map(skill => ({
                        title: skill.title,  // Título de la herramienta
                        image: skill.image   // Imagen asociada a la herramienta
                    }))
                },
                certificates
            });

            return result;
        } catch (error) {
            console.log('Debe completar todos los campos', error.message);
            throw new Error(`Error al crear el aboutme: ${error.message}`);
        }
    }


    async updateAboutme(aid, update) {
        if (!aid) throw new Error(`El ID es requerido`);

        try {
            // Preparamos las operaciones de actualización
            const updateOps = {};

            // Verificar si `update` contiene el campo `skills` que es un array
            if (update.skills && Array.isArray(update.skills)) {
                updateOps.$push = { skills: { $each: update.skills } };
                delete update.skills; // Eliminar el campo `skills` de `update` para evitar sobrescritura
            }

            // Añadir otras operaciones de actualización para los campos que no sean arrays
            if (Object.keys(update).length > 0) {
                updateOps.$set = update;
            }

            const result = await aboutmeDao.updateAboutme(aid, { $set: update });
            if (result.matchedCount === 0) {
                throw new Error(`El aboutme con ID ${aid} no existe`);
            }
            return result;
        } catch (error) {
            console.log(`Error actualizando el aboutme con ID: ${aid}`, error.message);
            throw new Error(`Error al actualizar el aboutme con ID: ${aid} ${error.message}`);
        }
    }

    async deleteAboutme(aid) {
        try {
            const result = await aboutmeDao.deleteAboutme(aid);
            if (!result) {
                throw new Error(`No se encontró el aboutme con ID: ${aid}`);
            }
            return result;
        } catch (error) {
            console.log('Error al eliminar aboutme', error.message);
            throw new Error(`Error el iD: ${aid} no existe ${error.message}`);
        }
    }
}

export default aboutmeController;