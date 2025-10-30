# Demo Data Guide

This guide helps you populate the MINIQUE marketplace with sample data for testing and demonstration purposes.

## Quick Demo Setup

### Option 1: Using the Web Interface

1. **Start the Server**
   ```bash
   npm run dev
   ```

2. **Create Demo Users**
   - Navigate to http://localhost:5000
   - Click "Register" and create accounts:
     - User 1: `seller@example.com` / `password123`
     - User 2: `buyer@example.com` / `password123`

3. **Add Sample Products** (as seller@example.com)
   - Click "List an Item"
   - Create products with these examples:

### Sample Product Ideas

#### Product 1: Cute Cotton Onesie
- **Title**: Organic Cotton Baby Onesie - Blue
- **Description**: Super soft organic cotton onesie in excellent condition. Worn only a few times. Perfect for newborns to 3 months.
- **Price**: $8.00
- **Category**: Bodysuits
- **Size**: 0-3m
- **Gender**: Boy
- **Condition**: Like New

#### Product 2: Winter Jacket
- **Title**: Cozy Winter Jacket with Hood
- **Description**: Warm and comfortable winter jacket. Features soft fleece lining and adorable bear ears on the hood. Great condition!
- **Price**: $15.00
- **Category**: Outerwear
- **Size**: 6-9m
- **Gender**: Unisex
- **Condition**: Excellent

#### Product 3: Floral Dress
- **Title**: Beautiful Floral Summer Dress
- **Description**: Adorable floral print dress perfect for summer. Lightweight and comfortable. Minor signs of wear but still looks great.
- **Price**: $12.00
- **Category**: Dresses
- **Size**: 12-18m
- **Gender**: Girl
- **Condition**: Good

#### Product 4: Pajama Set
- **Title**: Dinosaur Pajama Set
- **Description**: Two-piece pajama set with cute dinosaur print. Includes matching top and pants. Very soft and perfect for bedtime.
- **Price**: $10.00
- **Category**: Sleepwear
- **Size**: 18-24m
- **Gender**: Boy
- **Condition**: Excellent

#### Product 5: Baby Leggings
- **Title**: Stretchy Cotton Leggings - 3 Pack
- **Description**: Set of 3 comfortable cotton leggings in pink, purple, and white. Elastic waistband. Gently used.
- **Price**: $6.00
- **Category**: Pants
- **Size**: 9-12m
- **Gender**: Girl
- **Condition**: Good

#### Product 6: Hat and Mittens Set
- **Title**: Winter Hat and Mittens Set
- **Description**: Adorable knitted hat with pom-pom and matching mittens. Keeps baby warm in cold weather. Like new condition.
- **Price**: $5.00
- **Category**: Accessories
- **Size**: 3-6m
- **Gender**: Unisex
- **Condition**: Like New

## Option 2: Manual JSON Data

If you want to directly add data to the JSON files, here's how:

### Create Sample Users (data/users.json)
```json
[
  {
    "id": "user-001",
    "email": "seller@example.com",
    "password": "$2a$10$YourHashedPasswordHere",
    "name": "Sarah Seller",
    "avatar": "https://ui-avatars.com/api/?name=Sarah+Seller&background=random",
    "createdAt": "2025-01-15T10:00:00.000Z",
    "role": "user"
  },
  {
    "id": "user-002",
    "email": "buyer@example.com",
    "password": "$2a$10$YourHashedPasswordHere",
    "name": "Bob Buyer",
    "avatar": "https://ui-avatars.com/api/?name=Bob+Buyer&background=random",
    "createdAt": "2025-01-15T11:00:00.000Z",
    "role": "user"
  }
]
```

### Create Sample Products (data/products.json)
```json
[
  {
    "id": "prod-001",
    "title": "Organic Cotton Baby Onesie - Blue",
    "description": "Super soft organic cotton onesie in excellent condition. Worn only a few times. Perfect for newborns to 3 months.",
    "price": 8.00,
    "category": "bodysuits",
    "size": "0-3m",
    "gender": "boy",
    "condition": "like-new",
    "sellerId": "user-001",
    "images": [
      "https://via.placeholder.com/400x400/87CEEB/ffffff?text=Blue+Onesie"
    ],
    "createdAt": "2025-01-20T10:00:00.000Z",
    "status": "available",
    "views": 15,
    "favorites": []
  },
  {
    "id": "prod-002",
    "title": "Cozy Winter Jacket with Hood",
    "description": "Warm and comfortable winter jacket. Features soft fleece lining and adorable bear ears on the hood. Great condition!",
    "price": 15.00,
    "category": "outerwear",
    "size": "6-9m",
    "gender": "unisex",
    "condition": "excellent",
    "sellerId": "user-001",
    "images": [
      "https://via.placeholder.com/400x400/8B4513/ffffff?text=Winter+Jacket"
    ],
    "createdAt": "2025-01-20T11:00:00.000Z",
    "status": "available",
    "views": 23,
    "favorites": ["user-002"]
  }
]
```

## Testing Features

### Test the Search Function
1. Type "onesie" in the search bar
2. Should return products with "onesie" in title or description

### Test Filters
1. Select "Bodysuits" from Category filter
2. Select "0-3m" from Size filter
3. Select "Boy" from Gender filter
4. Products should update automatically

### Test Shopping Cart
1. Login as buyer@example.com
2. Click "Add to Cart" on a product
3. Click cart icon to view cart
4. Remove item from cart

### Test Messaging
1. Login as buyer@example.com
2. View a product from seller@example.com
3. Click "Contact Seller"
4. Send a message
5. Login as seller@example.com
6. Check messages to see the conversation

### Test Favorites
1. Login as any user
2. Click the heart icon on a product
3. Heart should turn red
4. Go to Profile → Favorites to see saved items

### Test User Profile
1. Login as seller@example.com
2. Click on your name in navigation
3. View your listed products
4. Click on a product to edit/view details

## Demo Scenarios

### Scenario 1: New Parent Shopping
1. Browse categories looking for winter clothes
2. Filter by size 6-9m and gender unisex
3. Add winter jacket to cart
4. Contact seller with questions
5. Complete checkout

### Scenario 2: Parent Selling Outgrown Clothes
1. Register new account
2. List 3-5 items with photos and descriptions
3. Set competitive prices
4. Respond to buyer messages
5. View product views and favorites

### Scenario 3: Deal Hunting
1. Sort products by "Price: Low to High"
2. Save favorite items with heart icon
3. Compare multiple products
4. Message sellers for bundle deals
5. Make purchases

## Realistic Test Data Tips

### Pricing Guide
- Bodysuits: $4-12
- Outerwear: $10-25
- Dresses: $8-20
- Sleepwear: $8-15
- Pants: $5-15
- Accessories: $3-10

### Condition Descriptions
- **Like New**: "Worn once or twice", "Tags still on", "Perfect condition"
- **Excellent**: "Gently used", "No stains or tears", "Minimal wear"
- **Good**: "Well-maintained", "Some signs of use", "Still plenty of life"
- **Fair**: "Shows wear", "Some fading", "Still functional"

### Description Templates

**For Bodysuits:**
"[Brand name] baby onesie in [color]. Made from [material]. Features [unique details]. [Condition note]. Perfect for [season/occasion]."

**For Outerwear:**
"[Type] jacket/coat for babies. [Material] with [special features]. Keeps baby warm in [weather]. [Condition and wear details]."

**For Dresses:**
"Adorable [style] dress in [color/pattern]. Made from [material]. Perfect for [occasions]. [Size details and fit notes]."

## Generating More Data

### Quick Product Generator Ideas
1. **Color variations**: Create same item in different colors
2. **Size ranges**: List similar items in multiple sizes
3. **Seasonal items**: Winter coats, summer dresses, etc.
4. **Branded items**: Gap, Carter's, Old Navy, etc.
5. **Sets**: Matching tops and bottoms, multi-packs

### Image Resources (Free Placeholder Services)
- https://via.placeholder.com/400x400
- https://picsum.photos/400/400
- Use descriptive text for placeholders

## Cleanup Commands

### Reset All Data
```bash
# Clear all JSON files
echo "[]" > data/users.json
echo "[]" > data/products.json
echo "[]" > data/carts.json
echo "[]" > data/messages.json
echo "[]" > data/reviews.json

# Clear uploads
rm -rf uploads/*
```

### Backup Demo Data
```bash
# Save current state
cp -r data data_demo_backup
```

### Restore Demo Data
```bash
# Restore from backup
cp -r data_demo_backup/* data/
```

## Performance Testing

### Load Test with Multiple Products
1. Create 20-30 products across all categories
2. Test search performance
3. Test filter combinations
4. Check page load times

### User Interaction Test
1. Create 3-5 user accounts
2. Have each list 5-10 products
3. Create cart items for each user
4. Send messages between users
5. Favorite multiple products

---

**Happy Testing!** 🎉

For more information, see the main [README.md](README.md) and [SETUP.md](SETUP.md)
