const ledgerService = require('../services/ledgerService');

const getHistory = async (req, res, next) => {
    try {
        const filters = {
            productId: req.query.productId,
            locationId: req.query.locationId,
            movementType: req.query.movementType
        };
        const history = await ledgerService.getLedgerHistory(filters);
        res.status(200).json({ success: true, data: history });
    } catch (error) {
        next(error);
    }
};

module.exports = { getHistory };
