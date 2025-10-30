const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
const initDataFile = (filename, defaultData = []) => {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
  }
};

initDataFile('users.json', []);
initDataFile('products.json', []);
initDataFile('carts.json', []);
initDataFile('messages.json', []);
initDataFile('reviews.json', []);

// Database operations
class Database {
  static read(filename) {
    try {
      const filePath = path.join(DATA_DIR, filename);
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${filename}:`, error);
      return [];
    }
  }

  static write(filename, data) {
    try {
      const filePath = path.join(DATA_DIR, filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${filename}:`, error);
      return false;
    }
  }

  static getAll(collection) {
    return this.read(`${collection}.json`);
  }

  static getById(collection, id) {
    const items = this.getAll(collection);
    return items.find(item => item.id === id);
  }

  static create(collection, item) {
    const items = this.getAll(collection);
    items.push(item);
    this.write(`${collection}.json`, items);
    return item;
  }

  static update(collection, id, updates) {
    const items = this.getAll(collection);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      this.write(`${collection}.json`, items);
      return items[index];
    }
    return null;
  }

  static delete(collection, id) {
    const items = this.getAll(collection);
    const filtered = items.filter(item => item.id !== id);
    this.write(`${collection}.json`, filtered);
    return filtered.length < items.length;
  }
}

module.exports = Database;
