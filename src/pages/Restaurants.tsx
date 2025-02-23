import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, MagnifyingGlassIcon, MapPinIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';
import RestaurantForm from '../components/RestaurantForm';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface Restaurant {
  id: number;
  name: string;
  description: string;
  image: string;
  opening_hours: string;
  tags: string[];
  category: string;
  price_range: string;
  distance: string;
  estimated_time: string;
  featured: boolean;
  rating: number;
  created_at?: string;
  updated_at?: string;
}

interface RestaurantFormData {
  name: string;
  description: string;
  image: string;
  opening_hours: string;
  tags: string[];
  category: string;
  price_range: string;
  distance: string;
  estimated_time: string;
  featured: boolean;
  rating?: number; // Make rating optional
}

const categories = [
  { id: 'all', name: 'All', icon: '🍽️' },
  { id: 'biryani', name: 'Biryani', icon: '🍚' },
  { id: 'karahi', name: 'Karahi', icon: '🥘' },
  { id: 'bbq', name: 'BBQ', icon: '🍖' },
  { id: 'nihari', name: 'Nihari', icon: '🥣' },
  { id: 'paratha', name: 'Paratha', icon: '🫓' },
  { id: 'chaat', name: 'Chaat', icon: '🥘' },
  { id: 'dessert', name: 'Mithai', icon: '🍯' },
];

export default function Restaurants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

  // Fetch restaurants
  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
      toast.error('Failed to fetch restaurants');
    }
  };

  const handleSubmit = async (formData: RestaurantFormData) => {
    try {
      const data = {
        ...formData,
        rating: formData.rating || 4.5, // Provide default rating if undefined
      };

      if (editingRestaurant) {
        // Handle update
        const { error: updateError } = await supabase
          .from('restaurants')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingRestaurant.id);

        if (updateError) throw updateError;
        toast.success('Restaurant updated successfully!');
      } else {
        // Handle create
        const { error: insertError } = await supabase
          .from('restaurants')
          .insert([{
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }]);

        if (insertError) throw insertError;
        toast.success('Restaurant added successfully!');
      }

      setIsFormOpen(false);
      setEditingRestaurant(null);
      fetchRestaurants();
    } catch (error) {
      console.error('Error saving restaurant:', error);
      toast.error('Failed to save restaurant');
    }
  };

  const handleDeleteRestaurant = async (id: string) => {
    try {
      const { error } = await supabase
        .from('restaurants')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Restaurant deleted successfully');
      fetchRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
      toast.error('Failed to delete restaurant');
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || restaurant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-surface-900">Restaurants</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingRestaurant(null);
            setIsFormOpen(true);
          }}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Restaurant
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search restaurants..."
            className="w-full pl-12 pr-4 py-3 text-lg bg-white border border-surface-200 rounded-xl focus:outline-none focus:border-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <motion.div
            key={restaurant.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-xl shadow-card overflow-hidden group"
          >
            {/* Restaurant Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              {restaurant.featured && (
                <div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Featured
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-4 right-4 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="btn btn-white btn-sm"
                  onClick={() => {
                    setEditingRestaurant(restaurant);
                    setIsFormOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteRestaurant(restaurant.id.toString())}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-surface-900">{restaurant.name}</h3>
                  <p className="text-sm text-surface-500 line-clamp-2 mt-1">
                    {restaurant.description}
                  </p>
                </div>
                <div className="flex items-center space-x-1 bg-primary-50 text-primary-700 px-2 py-1 rounded">
                  <StarIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">{restaurant.rating}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-sm text-surface-600">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  {restaurant.opening_hours}
                </div>
                <div className="flex items-center text-sm text-surface-600">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {restaurant.distance} • {restaurant.estimated_time}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {restaurant.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-surface-100 text-surface-700 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
                <span className="px-2 py-1 bg-surface-100 text-surface-700 rounded text-xs">
                  {restaurant.price_range}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Restaurant Form Modal */}
      <RestaurantForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRestaurant(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingRestaurant || undefined}
      />
    </div>
  );
}
