const fs = require('fs');
const path = require('path');

// Create a simple in-memory user storage for demo purposes
const users = new Map();
const orders = new Map();
const menuItems = new Map();

// Add default admin user
users.set('admin@imdadurburger.com', {
    id: 1,
    name: 'Admin User',
    email: 'admin@imdadurburger.com',
    password_hash: '$2a$10$XgXB8bi4Qi4pYYmP8Q5ZKuGz6JqZZ4Q4h4X4X4X4X4X4X4X4X4X4X', // admin123
    role: 'admin',
    verified: true,
    phone: '1234567890',
    address: 'Admin Address'
});

// Add some sample menu items
const sampleMenuItems = [
    { id: 1, name: 'Classic Burger', price: 250, category: 'Burgers', description: 'Juicy beef patty with fresh vegetables' },
    { id: 2, name: 'Cheese Burger', price: 300, category: 'Burgers', description: 'Classic burger with melted cheese' },
    { id: 3, name: 'Chicken Burger', price: 280, category: 'Burgers', description: 'Grilled chicken breast with special sauce' },
    { id: 4, name: "Imdadur's JuiceCola", price: 35, category: 'Drinks', description: 'Our signature cola mixed with fresh fruit juice' },
    { id: 5, name: 'French Fries', price: 120, category: 'Sides', description: 'Crispy golden fries' }
];

sampleMenuItems.forEach(item => {
    menuItems.set(item.id, item);
});

// Simple database interface
const simpleDB = {
    users: {
        findByEmail: async (email) => {
            return users.get(email) || null;
        },
        create: async (userData) => {
            const id = users.size + 1;
            const user = { id, ...userData };
            users.set(userData.email, user);
            return user;
        },
        findById: async (id) => {
            for (let user of users.values()) {
                if (user.id === id) return user;
            }
            return null;
        }
    },
    menuItems: {
        findAll: async () => {
            return Array.from(menuItems.values());
        },
        findByCategory: async (category) => {
            return Array.from(menuItems.values()).filter(item => item.category === category);
        }
    },
    orders: {
        create: async (orderData) => {
            const id = orders.size + 1;
            const order = { id, ...orderData, created_at: new Date() };
            orders.set(id, order);
            return order;
        },
        findAll: async () => {
            return Array.from(orders.values());
        }
    }
};

module.exports = simpleDB;
