import aboutmeModel from "../models/aboutmeModel.js";


class AboutmeDao {
    async getAllAboutme() {
        return await aboutmeModel.find();
    }

    async getAboutmeById(aid) {
        return await aboutmeModel.findOne({ _id: aid });
    }

    async createAboutme(about) {
        return await aboutmeModel.create(about);
    }

    async updateAboutme(aid, update) {
        return await aboutmeModel.updateOne({ _id: aid }, update);
    }
    async deleteAboutme(aid) {
        return await aboutmeModel.deleteOne({ _id: aid });
    }
}

export default AboutmeDao;