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
  openingHours: string;
  tags: string[];
  category: string;
  priceRange: string;
  distance: string;
  estimatedTime: string;
  featured: boolean;
  rating?: number;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      let imageUrl = initialData?.image || '';

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      } else if (!initialData?.image) {
        toast.error('Please upload an image');
        return;
      }

      const data: RestaurantFormData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        image: imageUrl,
        openingHours: formData.get('openingHours') as string,
        tags: selectedTags,
        category: formData.get('category') as string,
        priceRange: formData.get('priceRange') as string,
        distance: formData.get('distance') as string,
        estimatedTime: formData.get('estimatedTime') as string,
        featured: formData.get('featured') === 'on',
        rating: parseFloat(formData.get('rating') as string) || undefined,
      };

      if (!data.name || !data.description) {
        toast.error('Please fill in all required fields');
        return;
      }

      onSubmit(data);
      onClose();
      toast.success('Restaurant saved successfully!');
    } catch (error) {
      toast.error('Failed to save restaurant');
      console.error('Error saving restaurant:', error);
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

                    <form onSubmit={handleSubmit} className="mt-6">
                      <div className="space-y-6">
                        {/* Image Upload */}
                        <div className="flex justify-center">
                          <div className="relative">
                            <div
                              className="group relative h-48 w-48 overflow-hidden rounded-xl border-2 border-dashed border-surface-300 hover:border-primary-500 cursor-pointer"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              {imagePreview ? (
                                <img
                                  src={imagePreview}
                                  alt="Restaurant preview"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <PhotoIcon className="h-12 w-12 text-surface-400" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-surface-900/0 group-hover:bg-surface-900/50 transition-all">
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <span className="text-white text-sm font-medium">
                                    {imagePreview ? 'Change Image' : 'Upload Image'}
                                  </span>
                                </div>
                              </div>
                              {isUploading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-surface-900/50">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                </div>
                              )}
                            </div>
                            <input
                              ref={fileInputRef}
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                            <p className="mt-2 text-sm text-surface-500 text-center">
                              Click to upload or drag and drop
                              <br />
                              PNG, JPG up to 5MB
                            </p>
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
                            <label htmlFor="category" className="block text-sm font-medium text-surface-700">
                              Category
                            </label>
                            <select
                              name="category"
                              id="category"
                              defaultValue={initialData?.category || 'biryani'}
                              className="input mt-1"
                            >
                              {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label htmlFor="priceRange" className="block text-sm font-medium text-surface-700">
                              Price Range
                            </label>
                            <select
                              name="priceRange"
                              id="priceRange"
                              defaultValue={initialData?.priceRange || '$$'}
                              className="input mt-1"
                            >
                              {priceRanges.map(range => (
                                <option key={range} value={range}>
                                  {range}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label htmlFor="openingHours" className="block text-sm font-medium text-surface-700">
                              Opening Hours
                            </label>
                            <input
                              type="text"
                              name="openingHours"
                              id="openingHours"
                              placeholder="e.g. 11:00 AM - 11:00 PM"
                              defaultValue={initialData?.openingHours}
                              className="input mt-1"
                            />
                          </div>

                          <div>
                            <label htmlFor="estimatedTime" className="block text-sm font-medium text-surface-700">
                              Estimated Delivery Time
                            </label>
                            <input
                              type="text"
                              name="estimatedTime"
                              id="estimatedTime"
                              placeholder="e.g. 20-30 min"
                              defaultValue={initialData?.estimatedTime}
                              className="input mt-1"
                            />
                          </div>

                          <div>
                            <label htmlFor="distance" className="block text-sm font-medium text-surface-700">
                              Distance
                            </label>
                            <input
                              type="text"
                              name="distance"
                              id="distance"
                              placeholder="e.g. 1.2 km"
                              defaultValue={initialData?.distance}
                              className="input mt-1"
                            />
                          </div>
                        </div>

                        {/* Rating */}
                        <div>
                          <label htmlFor="rating" className="block text-sm font-medium text-surface-900">
                            Rating
                          </label>
                          <input
                            type="number"
                            name="rating"
                            id="rating"
                            min="0"
                            max="5"
                            step="0.1"
                            defaultValue={initialData?.rating || 4.5}
                            className="mt-2 block w-full rounded-md border-0 py-1.5 text-surface-900 shadow-sm ring-1 ring-inset ring-surface-300 placeholder:text-surface-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                          />
                        </div>

                        {/* Tags */}
                        <div>
                          <label className="block text-sm font-medium text-surface-700 mb-2">
                            Tags
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {['Pakistani', 'BBQ', 'Biryani', 'Traditional', 'Fast Food', 'Karahi', 'Street Food', 'Desserts'].map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => handleTagToggle(tag)}
                                className={`px-3 py-1 rounded-full text-sm ${selectedTags.includes(tag) ? 'bg-primary-500 text-white' : 'bg-surface-100 text-surface-700 hover:bg-surface-200'}`}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Featured Toggle */}
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            name="featured"
                            id="featured"
                            defaultChecked={initialData?.featured}
                            className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-600"
                          />
                          <label htmlFor="featured" className="ml-2 text-sm text-surface-700">
                            Featured Restaurant
                          </label>
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end gap-3">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={onClose}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Uploading...
                            </>
                          ) : initialData ? (
                            'Save Changes'
                          ) : (
                            'Add Restaurant'
                          )}
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
