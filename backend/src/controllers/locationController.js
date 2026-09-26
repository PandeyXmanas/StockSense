const locationService = require('../services/locationService');

const getAll = async (req, res, next) => {
    try {
        const locations = await locationService.getAllLocations();
        res.status(200).json({ success: true, data: locations });
    } catch (error) { next(error); }
};

const create = async (req, res, next) => {
    try {
        const location = await locationService.createLocation(req.body);
        res.status(201).json({ success: true, data: location });
    } catch (error) { next(error); }
};

module.exports = { getAll, create };
