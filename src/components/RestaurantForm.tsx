import { Fragment, useState, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface RestaurantFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RestaurantFormData) => void;
  initialData?: Partial<RestaurantFormData>;
}

export interface RestaurantFormData {
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
  rating?: number;
  menu_categories?: {
    name: string;
    description: string;
    displayOrder: number;
    menu_items: {
      name: string;
      description: string;
      price: number;
      image: string;
      isAvailable: boolean;
      preparationTime: string;
      allergens: string[];
      spicyLevel: string;
      isVegetarian: boolean;
      isVegan: boolean;
    }[];
  }[];
}

const categories = [
  { id: 'biryani', name: 'Biryani' },
  { id: 'karahi', name: 'Karahi' },
  { id: 'bbq', name: 'BBQ' },
  { id: 'nihari', name: 'Nihari' },
  { id: 'paratha', name: 'Paratha' },
  { id: 'chaat', name: 'Chaat' },
  { id: 'dessert', name: 'Mithai' },
];

const priceRanges = ['$', '$$', '$$$', '$$$$'];

export default function RestaurantForm({ isOpen, onClose, onSubmit, initialData }: RestaurantFormProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('restaurant-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      if (!data?.path) {
        throw new Error('No path returned from upload');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('restaurant-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = imagePreview;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Get form values using refs
      const form = formRef.current;
      if (!form) {
        throw new Error('Form not found');
      }

      const nameInput = form.querySelector<HTMLInputElement>('[name="name"]');
      const descriptionInput = form.querySelector<HTMLTextAreaElement>('[name="description"]');
      const openingHoursInput = form.querySelector<HTMLInputElement>('[name="openingHours"]');
      const phoneInput = form.querySelector<HTMLInputElement>('[name="phone"]');
      const emailInput = form.querySelector<HTMLInputElement>('[name="email"]');
      const addressInput = form.querySelector<HTMLInputElement>('[name="address"]');

      if (!nameInput || !descriptionInput || !openingHoursInput || !phoneInput || !emailInput || !addressInput) {
        throw new Error('Required form fields not found');
      }

      // Parse opening hours into JSON format
      const openingHoursJson = {
        hours: openingHoursInput.value,
        // You can expand this structure based on your needs
      };

      // Create restaurant data matching the database schema
      const restaurantData = {
        name: nameInput.value,
        description: descriptionInput.value,
        image_url: imageUrl,
        opening_hours: openingHoursJson,
        cuisine: selectedTags,
        delivery_fee: 100, // Default values
        min_order: 500,
        phone: phoneInput.value,
        email: emailInput.value,
        address: addressInput.value,
        rating: 0.0,
        review_count: 0,
        is_top_restaurant: false
      };

      // First create the restaurant
      const { data: restaurant, error: restaurantError } = await supabase
        .from('restaurants')
        .insert([restaurantData])
        .select()
        .single();

      if (restaurantError) throw restaurantError;

      // Create default menu categories
      const defaultCategories = ['Starters', 'Main Course', 'Desserts', 'Beverages'];
      const { data: categories, error: categoriesError } = await supabase
        .from('menu_categories')
        .insert(
          defaultCategories.map((name, index) => ({
            restaurant_id: restaurant.id,
            name,
            description: `${name} menu items`,
            display_order: index + 1
          }))
        )
        .select();

      if (categoriesError) throw categoriesError;

      toast.success('Restaurant created successfully!');
      onSubmit({
        ...restaurantData,
        image: imageUrl
      });
      onClose();
    } catch (error) {
      console.error('Error creating restaurant:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create restaurant');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-surface-900/75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-card transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-lg bg-white text-surface-400 hover:text-surface-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-surface-900">
                      {initialData ? 'Edit Restaurant' : 'Add New Restaurant'}
                    </Dialog.Title>

                    <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-6">
                      <div className="space-y-6">
                        {/* Image Upload */}
                        <div>
                          <label className="block text-sm font-medium text-surface-700">
                            Restaurant Image
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-surface-300 border-dashed rounded-lg relative">
                            <div className="space-y-1 text-center">
                              {imagePreview ? (
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="mx-auto h-32 w-32 object-cover rounded-lg"
                                />
                              ) : (
                                <PhotoIcon className="mx-auto h-12 w-12 text-surface-400" />
                              )}
                              <div className="flex text-sm text-surface-600">
                                <label
                                  htmlFor="image-upload"
                                  className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500"
                                >
                                  <span>Upload a file</span>
                                  <input
                                    id="image-upload"
                                    name="image"
                                    type="file"
                                    className="sr-only"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    ref={fileInputRef}
                                  />
                                </label>
                              </div>
                              <p className="text-xs text-surface-500">
                                PNG, JPG, GIF up to 5MB
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Basic Info */}
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-surface-700">
                            Restaurant Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            defaultValue={initialData?.name}
                            className="input mt-1"
                          />
                        </div>

                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-surface-700">
                            Description *
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            required
                            rows={3}
                            defaultValue={initialData?.description}
                            className="input mt-1"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label htmlFor="openingHours" className="block text-sm font-medium text-surface-700">
                              Opening Hours *
                            </label>
                            <input
                              type="text"
                              name="openingHours"
                              id="openingHours"
                              required
                              placeholder="e.g. 11:00 AM - 11:00 PM"
                              defaultValue={initialData?.opening_hours}
                              className="input mt-1"
                            />
                          </div>

                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-surface-700">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              name="phone"
                              id="phone"
                              required
                              placeholder="e.g. +1234567890"
                              defaultValue={initialData?.phone}
                              className="input mt-1"
                            />
                          </div>

                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-surface-700">
                              Email *
                            </label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              required
                              placeholder="restaurant@example.com"
                              defaultValue={initialData?.email}
                              className="input mt-1"
                            />
                          </div>

                          <div>
                            <label htmlFor="address" className="block text-sm font-medium text-surface-700">
                              Address *
                            </label>
                            <input
                              type="text"
                              name="address"
                              id="address"
                              required
                              placeholder="Full restaurant address"
                              defaultValue={initialData?.address}
                              className="input mt-1"
                            />
                          </div>
                        </div>

                        {/* Tags */}
                        <div>
                          <label className="block text-sm font-medium text-surface-700">
                            Cuisine Types *
                          </label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {categories.map(category => (
                              <button
                                key={category.id}
                                type="button"
                                onClick={() => handleTagToggle(category.id)}
                                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                                  selectedTags.includes(category.id)
                                    ? 'bg-primary-100 text-primary-800'
                                    : 'bg-surface-100 text-surface-800'
                                }`}
                              >
                                {category.name}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={isSubmitting}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Create Restaurant'}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
