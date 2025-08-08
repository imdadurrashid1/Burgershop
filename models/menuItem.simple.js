// Simple in-memory menu items storage for demo purposes
const menuItems = new Map();

// Add sample menu items
const sampleMenuItems = [
    { id: 1, name: 'Classic Burger', price: 250, category: 'Burgers', description: 'Juicy beef patty with fresh vegetables', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500' },
    { id: 2, name: 'Cheese Burger', price: 300, category: 'Burgers', description: 'Classic burger with melted cheese', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500' },
    { id: 3, name: 'Chicken Burger', price: 280, category: 'Burgers', description: 'Grilled chicken breast with special sauce', image: 'https://images.unsplash.com/photo-1606755962773-d324e2dabd39?w=500' },
    { id: 4, name: 'BBQ Bacon Burger', price: 350, category: 'Burgers', description: 'Smoky BBQ sauce with crispy bacon', image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=500' },
    { id: 5, name: 'Veggie Burger', price: 220, category: 'Burgers', description: 'Plant-based patty with fresh vegetables', image: 'https://images.unsplash.com/photo-1525059696034-4967a729002e?w=500' },
    
    { id: 6, name: 'French Fries', price: 120, category: 'Sides', description: 'Crispy golden fries', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500' },
    { id: 7, name: 'Onion Rings', price: 140, category: 'Sides', description: 'Crispy battered onion rings', image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500' },
    { id: 8, name: 'Chicken Wings', price: 180, category: 'Sides', description: 'Spicy buffalo wings', image: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500' },
    
    { id: 9, name: "Imdadur's JuiceCola", price: 35, category: 'Drinks', description: 'Our signature cola mixed with fresh fruit juice', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500' },
    { id: 10, name: 'Coca-Cola', price: 25, category: 'Drinks', description: 'Classic Coca-Cola', image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500' },
    { id: 11, name: 'Fresh Orange Juice', price: 90, category: 'Drinks', description: 'Freshly squeezed orange juice', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500' },
    { id: 12, name: 'Watermelon Juice', price: 80, category: 'Drinks', description: 'Fresh watermelon juice', image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=500' },
    
    { id: 13, name: 'Chocolate Milkshake', price: 150, category: 'Desserts', description: 'Rich chocolate milkshake', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500' },
    { id: 14, name: 'Vanilla Ice Cream', price: 120, category: 'Desserts', description: 'Creamy vanilla ice cream', image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500' },
    { id: 15, name: 'Apple Pie', price: 180, category: 'Desserts', description: 'Homemade apple pie', image: 'https://images.unsplash.com/photo-1621743478914-cc8a86d7e7b5?w=500' }
];

// Initialize menu items
sampleMenuItems.forEach(item => {
    menuItems.set(item.id, item);
});

const MenuItem = {
    async findAll() {
        try {
            return Array.from(menuItems.values());
        } catch (error) {
            throw error;
        }
    },

    async findByCategory(category) {
        try {
            return Array.from(menuItems.values()).filter(item => 
                item.category.toLowerCase() === category.toLowerCase()
            );
        } catch (error) {
            throw error;
        }
    },

    async findById(id) {
        try {
            return menuItems.get(parseInt(id)) || null;
        } catch (error) {
            throw error;
        }
    },

    async findByName(name) {
        try {
            for (let item of menuItems.values()) {
                if (item.name.toLowerCase() === name.toLowerCase()) {
                    return item;
                }
            }
            return null;
        } catch (error) {
            throw error;
        }
    },

    async create(itemData) {
        try {
            const id = Math.max(...Array.from(menuItems.keys())) + 1;
            const newItem = { id, ...itemData };
            menuItems.set(id, newItem);
            return newItem;
        } catch (error) {
            throw error;
        }
    },

    async update(id, itemData) {
        try {
            const existingItem = menuItems.get(parseInt(id));
            if (existingItem) {
                const updatedItem = { ...existingItem, ...itemData };
                menuItems.set(parseInt(id), updatedItem);
                return updatedItem;
            }
            return null;
        } catch (error) {
            throw error;
        }
    },

    async delete(id) {
        try {
            return menuItems.delete(parseInt(id));
        } catch (error) {
            throw error;
        }
    }
};

module.exports = MenuItem;
