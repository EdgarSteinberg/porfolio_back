import proyectModel from "../models/proyectsModel.js";

class ProyectDao{
    
    async getAllProyects(){
        return await proyectModel.find();
    }

    async getProyectById(pid){
        return await proyectModel.findOne({_id:pid});
    }

    async createProyect(proyect){
        return await proyectModel.create(proyect);
    }

    async updateProyect(pid, update){
        return proyectModel.updateOne({_id: pid}, update);
    }

    async deleteProyect(pid){
        return proyectModel.deleteOne({_id: pid})
    }
}

export default ProyectDao;