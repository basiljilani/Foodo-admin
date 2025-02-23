import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface MenuFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MenuFormData) => void;
  initialData?: Partial<MenuFormData>;
  restaurantId?: number;
}

export interface MenuFormData {
  name: string;
  description: string;
  price: number;
  restaurantId: number;
  image: string;
  isAvailable: boolean;
  preparationTime: string;
  allergens: string[];
  spicyLevel: 'none' | 'mild' | 'medium' | 'hot' | 'extra hot';
  isVegetarian: boolean;
  isVegan: boolean;
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

export default function MenuForm({ isOpen, onClose, onSubmit, initialData, restaurantId }: MenuFormProps) {
  const [formData, setFormData] = useState<MenuFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    restaurantId: restaurantId || initialData?.restaurantId || 0,
    image: initialData?.image || '',
    isAvailable: initialData?.isAvailable ?? true,
    preparationTime: initialData?.preparationTime || '',
    allergens: initialData?.allergens || [],
    spicyLevel: initialData?.spicyLevel || 'none',
    isVegetarian: initialData?.isVegetarian || false,
    isVegan: initialData?.isVegan || false,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'price') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleAllergensChange = (allergen: string) => {
    setFormData(prev => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter(a => a !== allergen)
        : [...prev.allergens, allergen],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSubmit(formData);
    onClose();
    toast.success('Menu item saved successfully!');
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
              <Dialog.Panel className="relative transform rounded-xl bg-white px-4 pb-4 pt-5 text-left shadow-card transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6">
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
                      {initialData ? 'Edit Menu Item' : 'Add New Menu Item'}
                    </Dialog.Title>
                    
                    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                      {/* Image Upload */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <div 
                            className="group relative h-40 w-40 overflow-hidden rounded-xl border-2 border-dashed border-surface-300 hover:border-primary-500 cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {imagePreview ? (
                              <img 
                                src={imagePreview} 
                                alt="Menu item preview" 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <PhotoIcon className="h-12 w-12 text-surface-400" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-surface-900/0 group-hover:bg-surface-900/50 transition-all">
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <span className="text-white text-sm font-medium">Change Image</span>
                              </div>
                            </div>
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-surface-700">
                            Item Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            className="input mt-1"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-surface-700">
                            Price *
                          </label>
                          <input
                            type="number"
                            name="price"
                            id="price"
                            required
                            min="0"
                            step="0.01"
                            className="input mt-1"
                            value={formData.price}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div>
                          <label htmlFor="preparationTime" className="block text-sm font-medium text-surface-700">
                            Preparation Time
                          </label>
                          <input
                            type="text"
                            name="preparationTime"
                            id="preparationTime"
                            className="input mt-1"
                            placeholder="e.g., 15-20 mins"
                            value={formData.preparationTime}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label htmlFor="description" className="block text-sm font-medium text-surface-700">
                            Description
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows={3}
                            className="input mt-1"
                            value={formData.description}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div>
                          <label htmlFor="spicyLevel" className="block text-sm font-medium text-surface-700">
                            Spicy Level
                          </label>
                          <select
                            name="spicyLevel"
                            id="spicyLevel"
                            className="input mt-1"
                            value={formData.spicyLevel}
                            onChange={handleInputChange}
                          >
                            {spicyLevels.map(level => (
                              <option key={level.value} value={level.value}>
                                {level.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="isVegetarian"
                              id="isVegetarian"
                              className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-600"
                              checked={formData.isVegetarian}
                              onChange={handleInputChange}
                            />
                            <label htmlFor="isVegetarian" className="ml-2 text-sm text-surface-700">
                              Vegetarian
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="isVegan"
                              id="isVegan"
                              className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-600"
                              checked={formData.isVegan}
                              onChange={handleInputChange}
                            />
                            <label htmlFor="isVegan" className="ml-2 text-sm text-surface-700">
                              Vegan
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              name="isAvailable"
                              id="isAvailable"
                              className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-600"
                              checked={formData.isAvailable}
                              onChange={handleInputChange}
                            />
                            <label htmlFor="isAvailable" className="ml-2 text-sm text-surface-700">
                              Available
                            </label>
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-surface-700 mb-2">
                            Allergens
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {allergens.map(allergen => (
                              <div key={allergen} className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`allergen-${allergen}`}
                                  className="h-4 w-4 rounded border-surface-300 text-primary-600 focus:ring-primary-600"
                                  checked={formData.allergens.includes(allergen)}
                                  onChange={() => handleAllergensChange(allergen)}
                                />
                                <label
                                  htmlFor={`allergen-${allergen}`}
                                  className="ml-2 text-sm text-surface-700"
                                >
                                  {allergen}
                                </label>
                              </div>
                            ))}
                          </div>
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
                        >
                          {initialData ? 'Save Changes' : 'Add Menu Item'}
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
