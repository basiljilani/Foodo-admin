import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, MagnifyingGlassIcon, MapPinIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';
import RestaurantForm from '../components/RestaurantForm';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  openingHours: string;
  tags: string[];
  category: string;
  priceRange: string;
  description: string;
  distance: string;
  estimatedTime: string;
  featured: boolean;
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRestaurant = async (data: Restaurant) => {
    try {
      const { error } = await supabase
        .from('restaurants')
        .insert([{
          name: data.name,
          description: data.description,
          image: data.image,
          opening_hours: data.openingHours,
          tags: data.tags,
          category: data.category,
          price_range: data.priceRange,
          distance: data.distance,
          estimated_time: data.estimatedTime,
          featured: data.featured,
          rating: data.rating
        }]);

      if (error) {
        throw error;
      }

      toast.success('Restaurant added successfully');
      setIsFormOpen(false);
      fetchRestaurants();
    } catch (error) {
      console.error('Error adding restaurant:', error);
      toast.error('Failed to add restaurant');
    }
  };

  const handleEditRestaurant = async (data: Restaurant) => {
    if (!editingRestaurant?.id) return;

    try {
      const { error } = await supabase
        .from('restaurants')
        .update({
          name: data.name,
          description: data.description,
          image: data.image,
          opening_hours: data.openingHours,
          tags: data.tags,
          category: data.category,
          price_range: data.priceRange,
          distance: data.distance,
          estimated_time: data.estimatedTime,
          featured: data.featured,
          rating: data.rating
        })
        .eq('id', editingRestaurant.id);

      if (error) {
        throw error;
      }

      toast.success('Restaurant updated successfully');
      setIsFormOpen(false);
      setEditingRestaurant(null);
      fetchRestaurants();
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast.error('Failed to update restaurant');
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
                  onClick={() => handleDeleteRestaurant(restaurant.id)}
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
                  {restaurant.openingHours}
                </div>
                <div className="flex items-center text-sm text-surface-600">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {restaurant.distance} • {restaurant.estimatedTime}
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
                  {restaurant.priceRange}
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
        onSubmit={editingRestaurant ? handleEditRestaurant : handleAddRestaurant}
        initialData={editingRestaurant || undefined}
      />
    </div>
  );
}
