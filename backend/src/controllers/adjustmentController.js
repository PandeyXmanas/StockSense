const inventoryService = require('../services/inventoryService');
const { InventoryAdjustment } = require('../models');

const validateAdjustment = async (req, res, next) => {
    try {
        const adjustmentId = req.params.id;
        const userId = req.user.id;
        
        const adjustment = await InventoryAdjustment.findByPk(adjustmentId);
        if (!adjustment) return res.status(404).json({ success: false, message: 'Adjustment not found' });
        
        if (adjustment.status === 'Done') {
            return res.status(400).json({ success: false, message: 'Adjustment already validated' });
        }

        // Processing a single item adjustment for simplicity in this endpoint.
        const { productId, locationId, countedQuantity, recordedQuantity } = req.body;
        
        const result = await inventoryService.adjustStock(adjustmentId, productId, locationId, countedQuantity, recordedQuantity, userId);
        
        await adjustment.update({ status: 'Done', validatedAt: new Date() });
        
        res.status(200).json({ success: true, data: result, message: 'Adjustment validated and stock updated' });
    } catch (error) { next(error); }
};

module.exports = { validateAdjustment };
