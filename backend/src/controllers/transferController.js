const inventoryService = require('../services/inventoryService');
const { InternalTransfer } = require('../models');

const validateTransfer = async (req, res, next) => {
    try {
        const transferId = req.params.id;
        const userId = req.user.id;
        
        const transfer = await InternalTransfer.findByPk(transferId);
        if (!transfer) return res.status(404).json({ success: false, message: 'Transfer not found' });
        
        if (transfer.status === 'Done') {
            return res.status(400).json({ success: false, message: 'Transfer already validated' });
        }

        const items = req.body.items || [];
        
        // Mocking source and dest from request for now
        const fromLocationId = req.body.fromLocationId;
        const toLocationId = req.body.toLocationId;
        
        await inventoryService.transferStock(transferId, items, fromLocationId, toLocationId, userId);
        
        await transfer.update({ status: 'Done', validatedAt: new Date() });
        
        res.status(200).json({ success: true, message: 'Transfer validated and stock updated' });
    } catch (error) { next(error); }
};

module.exports = { validateTransfer };
