import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';
import MenuItemForm from './MenuItemForm';
import CategoryForm from './CategoryForm';

interface MenuManagerProps {
  restaurantId: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  display_order: number;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
  is_available: boolean;
  preparation_time: string;
  allergens: string[];
  spicy_level: string;
  is_vegetarian: boolean;
  is_vegan: boolean;
}

export default function MenuManager({ restaurantId }: MenuManagerProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [isMenuItemFormOpen, setIsMenuItemFormOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    fetchMenuData();
  }, [restaurantId]);

  const fetchMenuData = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .order('display_order');

      if (categoriesError) throw categoriesError;

      // Fetch menu items
      const { data: menuItemsData, error: menuItemsError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('restaurant_id', restaurantId);

      if (menuItemsError) throw menuItemsError;

      setCategories(categoriesData || []);
      setMenuItems(menuItemsData || []);
    } catch (error) {
      console.error('Error fetching menu data:', error);
      toast.error('Failed to load menu data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (categoryData: Omit<Category, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('menu_categories')
        .insert([{
          ...categoryData,
          restaurant_id: restaurantId
        }])
        .select()
        .single();

      if (error) throw error;

      setCategories([...categories, data]);
      toast.success('Category added successfully');
      setIsCategoryFormOpen(false);
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleAddMenuItem = async (menuItemData: Omit<MenuItem, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([{
          ...menuItemData,
          restaurant_id: restaurantId
        }])
        .select()
        .single();

      if (error) throw error;

      setMenuItems([...menuItems, data]);
      toast.success('Menu item added successfully');
      setIsMenuItemFormOpen(false);
    } catch (error) {
      console.error('Error adding menu item:', error);
      toast.error('Failed to add menu item');
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setMenuItems(menuItems.filter(item => item.id !== itemId));
      toast.success('Menu item deleted successfully');
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Failed to delete menu item');
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading menu data...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        <div className="space-x-2">
          <button
            onClick={() => setIsCategoryFormOpen(true)}
            className="btn btn-secondary"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Category
          </button>
          <button
            onClick={() => setIsMenuItemFormOpen(true)}
            className="btn btn-primary"
            disabled={categories.length === 0}
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Menu Item
          </button>
        </div>
      </div>

      {/* Categories Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(category => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory(category);
                    setIsCategoryFormOpen(true);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Menu Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm font-medium mt-2">Rs. {item.price}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingMenuItem(item);
                      setIsMenuItemFormOpen(true);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMenuItem(item.id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forms */}
      {isCategoryFormOpen && (
        <CategoryForm
          isOpen={isCategoryFormOpen}
          onClose={() => {
            setIsCategoryFormOpen(false);
            setSelectedCategory(null);
          }}
          onSubmit={handleAddCategory}
          initialData={selectedCategory || undefined}
        />
      )}

      {isMenuItemFormOpen && (
        <MenuItemForm
          isOpen={isMenuItemFormOpen}
          onClose={() => {
            setIsMenuItemFormOpen(false);
            setEditingMenuItem(null);
          }}
          onSubmit={handleAddMenuItem}
          categories={categories}
          initialData={editingMenuItem || undefined}
        />
      )}
    </div>
  );
}
