const inventoryService = require('../services/inventoryService');
const { Receipt } = require('../models'); // Mocked receipt model

const validateReceipt = async (req, res, next) => {
    try {
        const receiptId = req.params.id;
        const userId = req.user.id;
        // In reality, we fetch the receipt and items from the database.
        // Mocking the database fetch here for the contract:
        const receipt = await Receipt.findByPk(receiptId);
        if (!receipt) return res.status(404).json({ success: false, message: 'Receipt not found' });
        
        if (receipt.status === 'Done') {
            return res.status(400).json({ success: false, message: 'Receipt already validated' });
        }

        // Mock items payload from request for simplicity in this step.
        // Typically, this would be fetched via associations: receipt.getReceiptItems()
        const items = req.body.items || [];
        
        await inventoryService.receiveStock(receiptId, items, userId);
        
        // Update document status
        await receipt.update({ status: 'Done', validatedAt: new Date() });
        
        res.status(200).json({ success: true, message: 'Receipt validated and stock updated' });
    } catch (error) { next(error); }
};

module.exports = { validateReceipt };
