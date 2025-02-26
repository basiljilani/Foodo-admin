import { Fragment, useState, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface MenuItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MenuItemFormData) => void;
  categories: Array<{ id: string; name: string }>;
  initialData?: Partial<MenuItemFormData>;
}

export interface MenuItemFormData {
  name: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
  is_available: boolean;
  preparation_time: string;
  allergens: string[];
  spicy_level: 'none' | 'mild' | 'medium' | 'hot' | 'extra hot';
  is_vegetarian: boolean;
  is_vegan: boolean;
}

const allergens = [
  'Milk',
  'Eggs',
  'Fish',
  'Shellfish',
  'Tree Nuts',
  'Peanuts',
  'Wheat',
  'Soy',
];

const spicyLevels = [
  { value: 'none', label: 'Not Spicy' },
  { value: 'mild', label: 'Mild' },
  { value: 'medium', label: 'Medium' },
  { value: 'hot', label: 'Hot' },
  { value: 'extra hot', label: 'Extra Hot' },
];

export default function MenuItemForm({ isOpen, onClose, onSubmit, categories, initialData }: MenuItemFormProps) {
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>(initialData?.allergens || []);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData?.image_url || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);

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
        .from('menu-item-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('menu-item-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      let imageUrl = imagePreview;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const data: MenuItemFormData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        category_id: formData.get('category_id') as string,
        image_url: imageUrl,
        is_available: formData.get('is_available') === 'on',
        preparation_time: formData.get('preparation_time') as string,
        allergens: selectedAllergens,
        spicy_level: formData.get('spicy_level') as MenuItemFormData['spicy_level'],
        is_vegetarian: formData.get('is_vegetarian') === 'on',
        is_vegan: formData.get('is_vegan') === 'on'
      };

      onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to save menu item');
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      {initialData ? 'Edit Menu Item' : 'Add Menu Item'}
                    </Dialog.Title>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      {/* Basic Information */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            defaultValue={initialData?.name}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            Price
                          </label>
                          <input
                            type="number"
                            name="price"
                            id="price"
                            step="0.01"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            defaultValue={initialData?.price}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          defaultValue={initialData?.description}
                        />
                      </div>

                      <div>
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <select
                          name="category_id"
                          id="category_id"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                          defaultValue={initialData?.category_id}
                          required
                        >
                          <option value="">Select a category</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Image</label>
                        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                          <div className="space-y-1 text-center">
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="mx-auto h-32 w-32 object-cover rounded-md"
                              />
                            ) : (
                              <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                            )}
                            <div className="flex text-sm text-gray-600">
                              <label
                                htmlFor="image-upload"
                                className="relative cursor-pointer rounded-md bg-white font-medium text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:text-primary-500"
                              >
                                <span>Upload a file</span>
                                <input
                                  id="image-upload"
                                  name="image-upload"
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                  ref={fileInputRef}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Details */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="preparation_time" className="block text-sm font-medium text-gray-700">
                            Preparation Time
                          </label>
                          <input
                            type="text"
                            name="preparation_time"
                            id="preparation_time"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            placeholder="e.g., 15-20 mins"
                            defaultValue={initialData?.preparation_time}
                          />
                        </div>

                        <div>
                          <label htmlFor="spicy_level" className="block text-sm font-medium text-gray-700">
                            Spicy Level
                          </label>
                          <select
                            name="spicy_level"
                            id="spicy_level"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                            defaultValue={initialData?.spicy_level || 'none'}
                          >
                            {spicyLevels.map(level => (
                              <option key={level.value} value={level.value}>
                                {level.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Allergens */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Allergens</label>
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          {allergens.map(allergen => (
                            <label key={allergen} className="inline-flex items-center">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                checked={selectedAllergens.includes(allergen)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedAllergens([...selectedAllergens, allergen]);
                                  } else {
                                    setSelectedAllergens(selectedAllergens.filter(a => a !== allergen));
                                  }
                                }}
                              />
                              <span className="ml-2 text-sm text-gray-600">{allergen}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Dietary Preferences */}
                      <div className="space-y-2">
                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              type="checkbox"
                              name="is_vegetarian"
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              defaultChecked={initialData?.is_vegetarian}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="is_vegetarian" className="font-medium text-gray-700">
                              Vegetarian
                            </label>
                          </div>
                        </div>

                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              type="checkbox"
                              name="is_vegan"
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              defaultChecked={initialData?.is_vegan}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="is_vegan" className="font-medium text-gray-700">
                              Vegan
                            </label>
                          </div>
                        </div>

                        <div className="relative flex items-start">
                          <div className="flex h-5 items-center">
                            <input
                              type="checkbox"
                              name="is_available"
                              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              defaultChecked={initialData?.is_available ?? true}
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="is_available" className="font-medium text-gray-700">
                              Available
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          className="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto"
                          disabled={isUploading}
                        >
                          {isUploading ? 'Uploading...' : initialData ? 'Save Changes' : 'Add Item'}
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
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
