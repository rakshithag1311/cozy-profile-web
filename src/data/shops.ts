export interface Shop {
  id: string;
  name: string;
  category: string;
  distance: string;
  image: string;
  prepTime: string;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const shops: Shop[] = [
  {
    id: 'shop-1',
    name: 'Sharma General Store',
    category: 'Grocery',
    distance: '0.3 km',
    image: '🛒',
    prepTime: '10–15 mins'
  },
  {
    id: 'shop-2',
    name: 'Annapurna Bakery',
    category: 'Bakery',
    distance: '0.5 km',
    image: '🥐',
    prepTime: '15–20 mins'
  },
  {
    id: 'shop-3',
    name: 'Quick Stop Convenience',
    category: 'Convenience',
    distance: '0.8 km',
    image: '🏪',
    prepTime: '5–10 mins'
  },
  {
    id: 'shop-4',
    name: 'Green Basket Organics',
    category: 'Organic',
    distance: '1.2 km',
    image: '🥬',
    prepTime: '10–15 mins'
  },
  {
    id: 'shop-5',
    name: 'Chai & Bites Cafe',
    category: 'Cafe',
    distance: '0.4 km',
    image: '☕',
    prepTime: '10–15 mins'
  },
  {
    id: 'shop-6',
    name: 'Mumbai Snack Corner',
    category: 'Snacks',
    distance: '0.6 km',
    image: '🍿',
    prepTime: '10–15 mins'
  }
];

export const shopItems: Record<string, ShopItem[]> = {
  'shop-1': [
    { id: 'item-1-1', name: 'Amul Taza Milk (1L)', price: 54, description: 'Fresh toned milk' },
    { id: 'item-1-2', name: 'Farm Eggs (12 pcs)', price: 84, description: 'Fresh country eggs' },
    { id: 'item-1-3', name: 'Aashirvaad Atta (5kg)', price: 265, description: 'Whole wheat flour' },
    { id: 'item-1-4', name: 'Toor Dal (1kg)', price: 145, description: 'Premium quality dal' },
    { id: 'item-1-5', name: 'Saffola Gold Oil (1L)', price: 189, description: 'Refined cooking oil' }
  ],
  'shop-2': [
    { id: 'item-2-1', name: 'Butter Croissant', price: 65, description: 'Flaky butter croissant' },
    { id: 'item-2-2', name: 'Chocolate Muffin', price: 55, description: 'Rich chocolate muffin' },
    { id: 'item-2-3', name: 'Masala Bun', price: 25, description: 'Spiced bread bun' },
    { id: 'item-2-4', name: 'Pav (4 pcs)', price: 20, description: 'Soft dinner rolls' },
    { id: 'item-2-5', name: 'Fruit Cake Slice', price: 45, description: 'Mixed fruit cake' }
  ],
  'shop-3': [
    { id: 'item-3-1', name: 'Bisleri Water (1L)', price: 20, description: 'Packaged drinking water' },
    { id: 'item-3-2', name: 'Lays Chips (Large)', price: 30, description: 'Classic salted chips' },
    { id: 'item-3-3', name: 'Maggi Noodles (4 pack)', price: 56, description: 'Instant masala noodles' },
    { id: 'item-3-4', name: 'Dairy Milk Silk', price: 85, description: 'Premium chocolate bar' },
    { id: 'item-3-5', name: 'Red Bull (250ml)', price: 115, description: 'Energy drink' }
  ],
  'shop-4': [
    { id: 'item-4-1', name: 'Organic Spinach (250g)', price: 40, description: 'Farm fresh palak' },
    { id: 'item-4-2', name: 'Quinoa (500g)', price: 220, description: 'Organic white quinoa' },
    { id: 'item-4-3', name: 'Almond Milk (1L)', price: 299, description: 'Unsweetened almond milk' },
    { id: 'item-4-4', name: 'Organic Honey (500g)', price: 350, description: 'Raw forest honey' },
    { id: 'item-4-5', name: 'Mixed Dry Fruits (250g)', price: 275, description: 'Premium assorted nuts' }
  ],
  'shop-5': [
    { id: 'item-5-1', name: 'Masala Chai', price: 30, description: 'Authentic Indian tea' },
    { id: 'item-5-2', name: 'Cold Coffee', price: 80, description: 'Creamy cold coffee' },
    { id: 'item-5-3', name: 'Veg Sandwich', price: 60, description: 'Grilled vegetable sandwich' },
    { id: 'item-5-4', name: 'Samosa (2 pcs)', price: 30, description: 'Crispy potato samosa' },
    { id: 'item-5-5', name: 'Paneer Puff', price: 35, description: 'Flaky paneer pastry' }
  ],
  'shop-6': [
    { id: 'item-6-1', name: 'Vada Pav', price: 20, description: 'Mumbai style vada pav' },
    { id: 'item-6-2', name: 'Pav Bhaji', price: 60, description: 'Buttery pav bhaji plate' },
    { id: 'item-6-3', name: 'Bhel Puri', price: 30, description: 'Tangy puffed rice mix' },
    { id: 'item-6-4', name: 'Dahi Puri (6 pcs)', price: 45, description: 'Crispy with sweet yogurt' },
    { id: 'item-6-5', name: 'Pani Puri (6 pcs)', price: 30, description: 'Classic golgappa' }
  ]
};

export const getShopById = (id: string): Shop | undefined => {
  return shops.find(shop => shop.id === id);
};

export const getShopItems = (shopId: string): ShopItem[] => {
  return shopItems[shopId] || [];
};
