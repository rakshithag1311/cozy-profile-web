export interface Shop {
  id: string;
  name: string;
  category: string;
  distance: string;
  image: string;
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
    name: 'Fresh Mart Grocery',
    category: 'Grocery',
    distance: '0.3 km',
    image: '🛒'
  },
  {
    id: 'shop-2',
    name: 'Golden Bakery',
    category: 'Bakery',
    distance: '0.5 km',
    image: '🥐'
  },
  {
    id: 'shop-3',
    name: 'Daily Essentials',
    category: 'Convenience',
    distance: '0.8 km',
    image: '🏪'
  },
  {
    id: 'shop-4',
    name: 'Green Valley Organics',
    category: 'Organic',
    distance: '1.2 km',
    image: '🥬'
  },
  {
    id: 'shop-5',
    name: 'Quick Bites Cafe',
    category: 'Cafe',
    distance: '0.4 km',
    image: '☕'
  }
];

export const shopItems: Record<string, ShopItem[]> = {
  'shop-1': [
    { id: 'item-1-1', name: 'Fresh Milk (1L)', price: 3.50, description: 'Farm fresh whole milk' },
    { id: 'item-1-2', name: 'Organic Eggs (12)', price: 5.00, description: 'Free-range organic eggs' },
    { id: 'item-1-3', name: 'Whole Wheat Bread', price: 2.50, description: 'Freshly baked' },
    { id: 'item-1-4', name: 'Mixed Vegetables', price: 4.00, description: 'Seasonal vegetables mix' },
    { id: 'item-1-5', name: 'Orange Juice (1L)', price: 4.50, description: '100% pure orange juice' }
  ],
  'shop-2': [
    { id: 'item-2-1', name: 'Croissant', price: 2.50, description: 'Buttery French croissant' },
    { id: 'item-2-2', name: 'Chocolate Muffin', price: 3.00, description: 'Rich chocolate muffin' },
    { id: 'item-2-3', name: 'Sourdough Loaf', price: 5.50, description: 'Artisan sourdough bread' },
    { id: 'item-2-4', name: 'Cinnamon Roll', price: 3.50, description: 'Warm cinnamon roll with icing' },
    { id: 'item-2-5', name: 'Bagel (Plain)', price: 2.00, description: 'Fresh baked bagel' }
  ],
  'shop-3': [
    { id: 'item-3-1', name: 'Bottled Water (500ml)', price: 1.00, description: 'Pure mineral water' },
    { id: 'item-3-2', name: 'Energy Bar', price: 2.50, description: 'High protein energy bar' },
    { id: 'item-3-3', name: 'Chips (Large)', price: 3.00, description: 'Salted potato chips' },
    { id: 'item-3-4', name: 'Instant Noodles', price: 1.50, description: 'Quick cooking noodles' },
    { id: 'item-3-5', name: 'Chocolate Bar', price: 2.00, description: 'Premium dark chocolate' }
  ],
  'shop-4': [
    { id: 'item-4-1', name: 'Organic Spinach', price: 4.00, description: 'Fresh organic spinach' },
    { id: 'item-4-2', name: 'Quinoa (500g)', price: 6.50, description: 'Premium organic quinoa' },
    { id: 'item-4-3', name: 'Almond Milk (1L)', price: 5.00, description: 'Unsweetened almond milk' },
    { id: 'item-4-4', name: 'Organic Honey', price: 8.00, description: 'Raw organic honey' },
    { id: 'item-4-5', name: 'Mixed Nuts (250g)', price: 7.00, description: 'Organic mixed nuts' }
  ],
  'shop-5': [
    { id: 'item-5-1', name: 'Espresso', price: 2.50, description: 'Double shot espresso' },
    { id: 'item-5-2', name: 'Latte', price: 4.00, description: 'Creamy cafe latte' },
    { id: 'item-5-3', name: 'Avocado Toast', price: 6.50, description: 'Sourdough with fresh avocado' },
    { id: 'item-5-4', name: 'Fruit Smoothie', price: 5.50, description: 'Mixed berry smoothie' },
    { id: 'item-5-5', name: 'Club Sandwich', price: 7.00, description: 'Classic triple-decker' }
  ]
};

export const getShopById = (id: string): Shop | undefined => {
  return shops.find(shop => shop.id === id);
};

export const getShopItems = (shopId: string): ShopItem[] => {
  return shopItems[shopId] || [];
};
