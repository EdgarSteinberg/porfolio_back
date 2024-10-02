import cvModel from '../models/cvModel.js';

class CvDao {

    async getAllcv() {
        return await cvModel.find().lean();
    }

    async getCvById(cid) {
        return await cvModel.findOne({ _id: cid });
    }

    async createCv(cv) {
        return await cvModel.create(cv);
    }

    async updateCv(cid, update) {
        return await cvModel.findOneAndUpdate({ _id: cid }, update, { new: true });
    }

    async deleteCv(cid) {
        return await cvModel.deleteOne({ _id: cid });
    }
}
export default CvDao;