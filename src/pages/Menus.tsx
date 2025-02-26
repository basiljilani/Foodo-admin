import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon, FireIcon } from '@heroicons/react/24/outline';
import MenuForm, { MenuFormData } from '../components/MenuForm';
import CategoryForm, { CategoryFormData } from '../components/CategoryForm';
import { toast } from 'react-hot-toast';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  restaurantId: number;
  restaurantName: string;
  image: string;
  isAvailable: boolean;
  preparationTime: string;
  allergens: string[];
  spicyLevel: 'none' | 'mild' | 'medium' | 'hot' | 'extra hot';
  isVegetarian: boolean;
  isVegan: boolean;
}

interface Category {
  id: number;
  name: string;
  description: string;
  displayOrder: number;
}

// Sample data
const sampleCategories: Category[] = [
  { id: 1, name: 'Appetizers', description: 'Start your meal right', displayOrder: 1 },
  { id: 2, name: 'Main Course', description: 'Hearty main dishes', displayOrder: 2 },
  { id: 3, name: 'Desserts', description: 'Sweet endings', displayOrder: 3 },
  { id: 4, name: 'Beverages', description: 'Refreshing drinks', displayOrder: 4 },
];

const sampleMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    description: "Fresh tomatoes, mozzarella, basil",
    price: 12.99,
    categoryId: 2,
    restaurantId: 1,
    restaurantName: "Pizza Palace",
    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
    isAvailable: true,
    preparationTime: "20-25 mins",
    allergens: ["Milk", "Wheat"],
    spicyLevel: "none",
    isVegetarian: true,
    isVegan: false,
  },
  {
    id: 2,
    name: "Spicy Tuna Roll",
    description: "Fresh tuna, spicy mayo, cucumber",
    price: 14.99,
    categoryId: 1,
    restaurantId: 2,
    restaurantName: "Sushi Master",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    isAvailable: true,
    preparationTime: "15-20 mins",
    allergens: ["Fish", "Eggs"],
    spicyLevel: "medium",
    isVegetarian: false,
    isVegan: false,
  },
];

export default function Menus() {
  useEffect(() => {
    console.log('Menus component mounted');
    try {
      // Log initial state
      console.log('Initial categories:', sampleCategories);
      console.log('Initial menu items:', sampleMenuItems);
    } catch (error) {
      console.error('Error in Menus component:', error);
    }
  }, []);

  // Error boundary
  if (!Array.isArray(sampleCategories) || !Array.isArray(sampleMenuItems)) {
    console.error('Invalid data structure:', { sampleCategories, sampleMenuItems });
    return <div className="p-4">Error loading menu data</div>;
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  
  const [isMenuFormOpen, setIsMenuFormOpen] = useState(false);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const filteredMenuItems = sampleMenuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRestaurant = selectedRestaurant === 'all' || item.restaurantId.toString() === selectedRestaurant;
    const matchesCategory = !selectedCategory || item.categoryId === selectedCategory;
    
    return matchesSearch && matchesRestaurant && matchesCategory;
  });

  const handleAddMenuItem = (data: MenuFormData) => {
    if (!selectedCategory) {
      toast.error('Please select a category first');
      return;
    }
    // TODO: Implement with Supabase
    console.log('Adding menu item:', { ...data, categoryId: selectedCategory });
  };

  const handleEditMenuItem = (data: MenuFormData) => {
    // TODO: Implement with Supabase
    console.log('Editing menu item:', data);
  };

  const handleDeleteMenuItem = (id: number) => {
    // TODO: Implement with Supabase
    console.log('Deleting menu item:', id);
  };

  const handleAddCategory = (data: CategoryFormData) => {
    // TODO: Implement with Supabase
    console.log('Adding category:', data);
  };

  const handleEditCategory = (data: CategoryFormData) => {
    // TODO: Implement with Supabase
    console.log('Editing category:', data);
  };

  const getSpicyLevelIcon = (level: MenuItem['spicyLevel']) => {
    const levels = {
      none: 0,
      mild: 1,
      medium: 2,
      hot: 3,
      'extra hot': 4,
    };

    return Array(levels[level])
      .fill(0)
      .map((_, i) => (
        <FireIcon key={i} className="h-4 w-4 text-red-500" />
      ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-surface-900">Menu Management</h1>
        <div className="flex items-center space-x-4">
          <button
            className="btn btn-secondary"
            onClick={() => {
              setEditingCategory(null);
              setIsCategoryFormOpen(true);
            }}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Category
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (!selectedCategory) {
                toast.error('Please select a category first');
                return;
              }
              setEditingMenuItem(null);
              setIsMenuFormOpen(true);
            }}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Menu Item
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search menu items..."
            className="w-full pl-12 pr-4 py-3 text-lg bg-white border border-surface-200 rounded-xl focus:outline-none focus:border-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-64">
          <select
            className="input"
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
          >
            <option value="all">All Restaurants</option>
            <option value="1">Pizza Palace</option>
            <option value="2">Sushi Master</option>
          </select>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        <button
          className={`btn ${!selectedCategory ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setSelectedCategory(null)}
        >
          All Categories
        </button>
        {sampleCategories.map((category) => (
          <div key={category.id} className="inline-flex">
            <button
              className={`btn ${selectedCategory === category.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </button>
            <span
              className="ml-2 px-2 py-1 text-surface-400 hover:text-surface-500 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setEditingCategory(category);
                setIsCategoryFormOpen(true);
              }}
            >
              Edit
            </span>
          </div>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMenuItems.map((item) => (
          <div key={item.id} className="card group">
            <div className="relative h-48 w-full overflow-hidden rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-surface-900/50 flex items-center justify-center">
                  <span className="badge badge-danger">Not Available</span>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-surface-900">{item.name}</h3>
                <p className="text-lg font-semibold text-primary-600">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              
              <p className="mt-1 text-sm text-surface-500 line-clamp-2">
                {item.description}
              </p>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="badge bg-surface-100 text-surface-700">
                    {sampleCategories.find(category => category.id === item.categoryId)?.name}
                  </span>
                  {item.isVegetarian && (
                    <span className="badge bg-green-50 text-green-700">Veg</span>
                  )}
                  {item.isVegan && (
                    <span className="badge bg-green-50 text-green-700">Vegan</span>
                  )}
                </div>
                <div className="flex items-center">
                  {getSpicyLevelIcon(item.spicyLevel)}
                </div>
              </div>
              
              <div className="mt-4 text-sm text-surface-500">
                <p>Preparation: {item.preparationTime}</p>
                <p className="mt-1">Restaurant: {item.restaurantName}</p>
              </div>

              {item.allergens.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-surface-700">Allergens:</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {item.allergens.map(allergen => (
                      <span
                        key={allergen}
                        className="badge bg-yellow-50 text-yellow-700"
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditingMenuItem(item);
                    setIsMenuFormOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteMenuItem(item.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Forms */}
      <MenuForm
        isOpen={isMenuFormOpen}
        onClose={() => setIsMenuFormOpen(false)}
        onSubmit={editingMenuItem ? handleEditMenuItem : handleAddMenuItem}
        initialData={editingMenuItem || undefined}
      />

      <CategoryForm
        isOpen={isCategoryFormOpen}
        onClose={() => setIsCategoryFormOpen(false)}
        onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
        initialData={editingCategory || undefined}
      />
    </div>
  );
}
