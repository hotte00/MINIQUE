# MINIQUE 🍼

**Fancy Second-Hand Baby Clothes Marketplace Platform**

A beautiful, modern web application for buying and selling second-hand baby clothes. Built as a toy project in ROKAF by Hojune Kim and Minseob Lee.

![MINIQUE](https://img.shields.io/badge/MINIQUE-Marketplace-ff6b9d?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

### 🛍️ For Buyers
- **Browse Products**: Search and filter through a wide selection of baby clothes
- **Advanced Filters**: Filter by category, size, gender, condition, and price
- **Product Details**: View detailed information, multiple images, and seller profiles
- **Shopping Cart**: Add items to cart and manage your purchases
- **Favorites**: Save items you love for later
- **Messaging**: Contact sellers directly through the built-in messaging system
- **User Profiles**: View seller profiles and their other listings

### 👔 For Sellers
- **Easy Listing**: List items with multiple images and detailed descriptions
- **Product Management**: Track views and manage your listings
- **Direct Communication**: Respond to buyer inquiries through messages
- **Profile Dashboard**: View all your listings in one place

### 🔐 Security & User Management
- **Secure Authentication**: JWT-based authentication system
- **User Registration & Login**: Easy account creation and management
- **Protected Routes**: Secure API endpoints for authenticated users

## 🎨 Design Features

- **Modern UI**: Beautiful gradient design with smooth animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Intuitive Navigation**: Easy-to-use interface with clear categorization
- **Real-time Updates**: Dynamic content loading without page refreshes
- **Image Gallery**: Multiple product images with thumbnail preview
- **Category Cards**: Visual category browsing with icons

## 🚀 Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **JSON File Storage** - Simple file-based database
- **JWT** - Secure authentication
- **Multer** - File upload handling
- **bcrypt** - Password hashing

### Frontend
- **HTML5** - Modern semantic markup
- **CSS3** - Custom styling with CSS variables and flexbox/grid
- **Vanilla JavaScript** - ES6+ features
- **Font Awesome** - Icon library
- **Fetch API** - Asynchronous data requests

## 📦 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd MINIQUE

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start the server
npm run dev
```

The application will be available at `http://localhost:5000`

For detailed setup instructions, see [SETUP.md](SETUP.md)

## 📁 Project Structure

```
MINIQUE/
├── server/                 # Backend code
│   ├── index.js           # Main server file
│   ├── config/            # Configuration files
│   │   └── db.js          # Database operations
│   ├── middleware/        # Custom middleware
│   │   └── auth.js        # Authentication middleware
│   └── routes/            # API routes
│       ├── auth.js        # Authentication routes
│       ├── products.js    # Product routes
│       ├── users.js       # User routes
│       ├── cart.js        # Shopping cart routes
│       └── messages.js    # Messaging routes
├── client/                # Frontend code
│   ├── index.html         # Main HTML file
│   ├── css/
│   │   └── styles.css     # Styles
│   └── js/
│       └── app.js         # Frontend JavaScript
├── data/                  # JSON data files
├── uploads/               # Uploaded images
├── package.json           # Project dependencies
├── .env                   # Environment variables
├── README.md             # This file
└── SETUP.md              # Detailed setup guide
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/:id` - Update product (auth required)
- `DELETE /api/products/:id` - Delete product (auth required)
- `POST /api/products/:id/favorite` - Toggle favorite (auth required)

### Users
- `GET /api/users/profile` - Get current user profile (auth required)
- `GET /api/users/:id` - Get user public profile
- `GET /api/users/:id/products` - Get user's products

### Shopping Cart
- `GET /api/cart` - Get user's cart (auth required)
- `POST /api/cart/items` - Add item to cart (auth required)
- `DELETE /api/cart/items/:itemId` - Remove item from cart (auth required)

### Messages
- `GET /api/messages/conversations` - Get all conversations (auth required)
- `GET /api/messages/:userId` - Get messages with specific user (auth required)
- `POST /api/messages` - Send message (auth required)

## 🎯 Categories

- **Bodysuits** - Basic bodysuits and onesies
- **Outerwear** - Jackets, coats, and sweaters
- **Pants & Bottoms** - Pants, shorts, and leggings
- **Dresses** - Dresses and skirts
- **Sleepwear** - Pajamas and sleep sacks
- **Accessories** - Hats, mittens, socks, and more

## 📏 Sizes

Newborn, 0-3m, 3-6m, 6-9m, 9-12m, 12-18m, 18-24m, 2T, 3T, 4T

## 🏷️ Condition Ratings

- **Like New** - Barely worn, excellent condition
- **Excellent** - Gently used, no visible wear
- **Good** - Used but well maintained
- **Fair** - Shows signs of wear but functional

## 🌟 Future Enhancements

- [ ] Payment gateway integration
- [ ] Order management system
- [ ] Review and rating system
- [ ] Email notifications
- [ ] Image optimization
- [ ] Search autocomplete
- [ ] Social media sharing
- [ ] Admin dashboard

## 🤝 Contributing

This is a toy project, but contributions are welcome! Feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use this project for learning and development.

## 👥 Authors

- **Hojune Kim** - Developer
- **Minseob Lee** - Developer

Made with ❤️ in ROKAF

## 🙏 Acknowledgments

- Font Awesome for icons
- UI Avatars for user avatars
- The Node.js and Express.js communities

---

**MINIQUE** - Making sustainable fashion accessible for the next generation! 🌱👶
