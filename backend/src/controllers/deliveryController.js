const inventoryService = require('../services/inventoryService');
const { DeliveryOrder } = require('../models');

const validateDelivery = async (req, res, next) => {
    try {
        const deliveryId = req.params.id;
        const userId = req.user.id;
        
        const delivery = await DeliveryOrder.findByPk(deliveryId);
        if (!delivery) return res.status(404).json({ success: false, message: 'Delivery not found' });
        
        if (delivery.status === 'Done') {
            return res.status(400).json({ success: false, message: 'Delivery already validated' });
        }

        const items = req.body.items || [];
        
        await inventoryService.deliverStock(deliveryId, items, userId);
        
        await delivery.update({ status: 'Done', validatedAt: new Date() });
        
        res.status(200).json({ success: true, message: 'Delivery validated and stock updated' });
    } catch (error) { next(error); }
};

module.exports = { validateDelivery };
