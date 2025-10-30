# MINIQUE Setup Guide

## Quick Start Guide

### 1. System Requirements

Before you begin, ensure you have the following installed:
- **Node.js**: Version 14.x or higher
- **npm**: Version 6.x or higher (comes with Node.js)
- **Git**: For cloning the repository

Check your versions:
```bash
node --version
npm --version
git --version
```

### 2. Installation Steps

#### Step 1: Clone or Download the Project
```bash
# If using git
git clone <repository-url>
cd MINIQUE

# Or download and extract the ZIP file
```

#### Step 2: Install Backend Dependencies
```bash
# Install all server dependencies
npm install
```

This will install:
- express (web framework)
- cors (cross-origin support)
- bcryptjs (password hashing)
- jsonwebtoken (authentication)
- multer (file uploads)
- uuid (unique IDs)
- dotenv (environment variables)
- express-validator (input validation)
- nodemon (development hot-reload)

#### Step 3: Configure Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# The .env file should contain:
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Important**: Change the `JWT_SECRET` to a random, secure string in production!

#### Step 4: Create Required Directories
```bash
# These should already exist, but just in case:
mkdir -p data uploads
```

#### Step 5: Start the Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

You should see:
```
🚀 MINIQUE server running on port 5000
📍 API: http://localhost:5000/api
```

#### Step 6: Access the Application

Open your web browser and navigate to:
```
http://localhost:5000
```

### 3. Testing the Application

#### Test the API
```bash
# Health check
curl http://localhost:5000/api/health

# Should return:
# {"status":"OK","message":"MINIQUE API is running!"}
```

#### Create a Test User
1. Open the application in your browser
2. Click "Register" in the navigation
3. Fill out the registration form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
4. Click "Register"

#### Create a Test Product
1. After logging in, click "List an Item"
2. Fill out the product form:
   - Title: Cute Baby Onesie
   - Description: Gently used baby onesie in excellent condition
   - Price: 5.00
   - Category: Bodysuits
   - Size: 3-6m
   - Gender: Unisex
   - Condition: Excellent
3. Upload an image (optional)
4. Click "List Item"

### 4. Project Structure Explained

```
MINIQUE/
│
├── server/                    # Backend (Node.js/Express)
│   ├── index.js              # Main server entry point
│   ├── config/               # Configuration files
│   │   └── db.js            # Simple JSON file database
│   ├── middleware/           # Express middleware
│   │   └── auth.js          # JWT authentication
│   └── routes/              # API endpoints
│       ├── auth.js          # Login/Register
│       ├── products.js      # Product CRUD
│       ├── users.js         # User profiles
│       ├── cart.js          # Shopping cart
│       └── messages.js      # Messaging system
│
├── client/                   # Frontend (HTML/CSS/JS)
│   ├── index.html           # Main page
│   ├── css/
│   │   └── styles.css       # All styles
│   └── js/
│       └── app.js           # Frontend logic
│
├── data/                     # JSON database files
│   ├── users.json           # User accounts
│   ├── products.json        # Product listings
│   ├── carts.json           # Shopping carts
│   ├── messages.json        # User messages
│   └── reviews.json         # Product reviews
│
├── uploads/                  # User-uploaded images
│
├── package.json             # Dependencies
├── .env                     # Environment variables
├── .env.example            # Example environment file
├── .gitignore              # Git ignore rules
└── README.md               # Documentation
```

### 5. Development Workflow

#### Making Changes to the Backend
1. Edit files in the `server/` directory
2. If using `npm run dev`, the server will auto-reload
3. Test your changes via the browser or API calls

#### Making Changes to the Frontend
1. Edit files in the `client/` directory
2. Refresh your browser to see changes
3. Check the browser console for errors (F12)

#### Adding New API Endpoints
1. Create or edit a route file in `server/routes/`
2. Import and use the route in `server/index.js`
3. Update the frontend `client/js/app.js` to call the new endpoint

### 6. Common Issues and Solutions

#### Issue: Port 5000 already in use
**Solution**: Change the PORT in `.env` file or stop the other process:
```bash
# Find process using port 5000
lsof -i :5000  # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or change port in .env
PORT=5001
```

#### Issue: Module not found errors
**Solution**: Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Cannot POST to API
**Solution**: Make sure:
- Server is running
- API URL is correct in `client/js/app.js` (line 2)
- CORS is enabled (already configured)

#### Issue: Images not uploading
**Solution**: Check:
- `uploads/` directory exists and has write permissions
- File size is under 5MB
- File is an image (jpg, png, gif, webp)

#### Issue: Authentication errors
**Solution**:
- Clear browser localStorage: Open DevTools (F12) → Application → Local Storage → Clear
- Check JWT_SECRET in `.env` matches
- Token might be expired (7 day expiry)

### 7. Database Management

The application uses simple JSON files for data storage.

#### View Data
```bash
# View all users
cat data/users.json

# View all products
cat data/products.json
```

#### Reset Data
```bash
# Clear all data (start fresh)
echo "[]" > data/users.json
echo "[]" > data/products.json
echo "[]" > data/carts.json
echo "[]" > data/messages.json
echo "[]" > data/reviews.json
```

#### Backup Data
```bash
# Create a backup
cp -r data data_backup_$(date +%Y%m%d)
```

### 8. Production Deployment

#### Prepare for Production
1. Set environment to production:
```bash
NODE_ENV=production
```

2. Change JWT_SECRET to a secure random string:
```bash
# Generate a secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

3. Build optimizations:
- Minify CSS/JS files
- Optimize images
- Enable gzip compression
- Set up HTTPS

#### Deploy to a Server
1. Upload files to your server
2. Install dependencies: `npm install --production`
3. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server/index.js --name minique
pm2 save
pm2 startup
```

4. Set up a reverse proxy (nginx/Apache)
5. Configure your domain and SSL certificate

### 9. Advanced Configuration

#### Change API URL (for deployment)
Edit `client/js/app.js`, line 2:
```javascript
const API_URL = 'https://your-domain.com/api';
```

#### Add More Categories
Edit both:
- `client/index.html` (category grid)
- `client/js/app.js` (filter options)

#### Customize Styles
Edit `client/css/styles.css`:
```css
:root {
    --primary: #ff6b9d;  /* Change primary color */
    --secondary: #6bcfff; /* Change secondary color */
}
```

### 10. Security Best Practices

1. **Never commit `.env` file** (already in .gitignore)
2. **Change default JWT_SECRET** before deploying
3. **Use HTTPS** in production
4. **Regularly update dependencies**: `npm update`
5. **Validate all user inputs** (already implemented)
6. **Limit file upload sizes** (already set to 5MB)
7. **Use strong passwords** for user accounts

### 11. Useful Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Check for outdated packages
npm outdated

# Update packages
npm update

# Install a new package
npm install <package-name>

# Check server logs
tail -f logs/server.log  # if logging is set up

# View all running processes
ps aux | grep node
```

### 12. Getting Help

- Check the main README.md for feature documentation
- Open an issue on GitHub
- Check the browser console (F12) for frontend errors
- Check the server console for backend errors
- Review the API endpoints in the README

---

**You're all set!** Start building your baby clothes marketplace! 🚀👶

If you encounter any issues not covered here, feel free to reach out or open an issue on GitHub.
