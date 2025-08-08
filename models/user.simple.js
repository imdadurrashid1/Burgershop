const bcrypt = require('bcryptjs');

// Simple in-memory user storage for demo purposes
const users = new Map();

// Add default admin user
const adminPasswordHash = '$2a$10$eJCTqVzu9Fq2kNgli3O2YOPwUeLa/QbZQrRuKx0A0kEpZadoCAhx6'; // admin123
users.set('admin@imdadurburger.com', {
    id: 1,
    name: 'Admin User',
    email: 'admin@imdadurburger.com',
    password_hash: adminPasswordHash,
    role: 'admin',
    verified: true,
    phone: '1234567890',
    address: 'Admin Address'
});

let nextUserId = 2;

// User Data Access Layer - Simple In-Memory Version
const User = {
  async create({ name, email, password, phone, address, role = 'user' }) {
    try {
      const password_hash = await bcrypt.hash(password, 10);
      const user = {
        id: nextUserId++,
        name,
        email,
        password_hash,
        phone,
        address,
        role,
        verified: true,
        created_at: new Date()
      };
      users.set(email, user);
      return user;
    } catch (error) {
      throw error;
    }
  },

  async findByEmail(email) {
    try {
      return users.get(email) || null;
    } catch (error) {
      throw error;
    }
  },

  async findById(id) {
    try {
      for (let user of users.values()) {
        if (user.id === id) return user;
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  async updateVerification(id, verified) {
    try {
      for (let [email, user] of users.entries()) {
        if (user.id === id) {
          user.verified = verified;
          users.set(email, user);
          return user;
        }
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  async updatePassword(id, newPassword) {
    try {
      const password_hash = await bcrypt.hash(newPassword, 10);
      for (let [email, user] of users.entries()) {
        if (user.id === id) {
          user.password_hash = password_hash;
          users.set(email, user);
          return user;
        }
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  async getAllUsers() {
    try {
      return Array.from(users.values());
    } catch (error) {
      throw error;
    }
  },

  async deleteUser(id) {
    try {
      for (let [email, user] of users.entries()) {
        if (user.id === id) {
          users.delete(email);
          return true;
        }
      }
      return false;
    } catch (error) {
      throw error;
    }
  },

  async comparePassword(user, password) {
    try {
      return await bcrypt.compare(password, user.password_hash);
    } catch (error) {
      throw error;
    }
  }
};

module.exports = User;
