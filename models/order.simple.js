// Simple in-memory order storage for demo purposes
const orders = new Map();
let nextOrderId = 1;

const Order = {
    async create(userId, orderData) {
        try {
            const { items, totalAmount, deliveryAddress, paymentMethod, customerName, customerPhone, specialInstructions } = orderData;
            
            const order = {
                id: nextOrderId++,
                user_id: userId,
                items: items,
                total_amount: totalAmount,
                delivery_address: deliveryAddress,
                payment_method: paymentMethod,
                customer_name: customerName,
                customer_phone: customerPhone,
                special_instructions: specialInstructions || '',
                status: 'Pending',
                created_at: new Date(),
                updated_at: new Date()
            };
            
            orders.set(order.id, order);
            return order;
        } catch (error) {
            throw error;
        }
    },

    async findById(orderId) {
        try {
            return orders.get(orderId) || null;
        } catch (error) {
            throw error;
        }
    },

    async findByUserId(userId) {
        try {
            return Array.from(orders.values()).filter(order => order.user_id === userId);
        } catch (error) {
            throw error;
        }
    },

    async findAll() {
        try {
            return Array.from(orders.values());
        } catch (error) {
            throw error;
        }
    },

    async updateStatus(orderId, status) {
        try {
            const order = orders.get(orderId);
            if (order) {
                order.status = status;
                order.updated_at = new Date();
                orders.set(orderId, order);
                return order;
            }
            return null;
        } catch (error) {
            throw error;
        }
    },

    async delete(orderId) {
        try {
            return orders.delete(orderId);
        } catch (error) {
            throw error;
        }
    },

    async getOrderStats() {
        try {
            const allOrders = Array.from(orders.values());
            const totalOrders = allOrders.length;
            const totalRevenue = allOrders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);
            const pendingOrders = allOrders.filter(order => order.status === 'Pending').length;
            const completedOrders = allOrders.filter(order => order.status === 'Completed').length;
            
            return {
                totalOrders,
                totalRevenue,
                pendingOrders,
                completedOrders
            };
        } catch (error) {
            throw error;
        }
    }
};

module.exports = Order;
