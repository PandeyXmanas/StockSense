const { Location } = require('../models');

const getAllLocations = async () => {
    return await Location.findAll();
};

const createLocation = async (data) => {
    return await Location.create(data);
};

module.exports = {
    getAllLocations,
    createLocation
};
