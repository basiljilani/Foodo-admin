import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  initialData?: Partial<CategoryFormData>;
}

export interface CategoryFormData {
  id?: number;
  name: string;
  description: string;
  displayOrder: number;
}

export default function CategoryForm({ isOpen, onClose, onSubmit, initialData }: CategoryFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: CategoryFormData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      displayOrder: parseInt(formData.get('displayOrder') as string) || 0,
    };

    if (!data.name) {
      toast.error('Category name is required');
      return;
    }

    onSubmit(data);
    onClose();
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-surface-50 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-surface-50 text-surface-400 hover:text-surface-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-surface-900">
                      {initialData ? 'Edit Category' : 'Add Category'}
                    </Dialog.Title>
                    <div className="mt-6">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-surface-900">
                            Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="input mt-1"
                            defaultValue={initialData?.name}
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-surface-900">
                            Description
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows={3}
                            className="input mt-1"
                            defaultValue={initialData?.description}
                          />
                        </div>

                        <div>
                          <label htmlFor="displayOrder" className="block text-sm font-medium text-surface-900">
                            Display Order
                          </label>
                          <input
                            type="number"
                            name="displayOrder"
                            id="displayOrder"
                            className="input mt-1"
                            defaultValue={initialData?.displayOrder || 0}
                          />
                        </div>

                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                          <button type="submit" className="btn btn-primary w-full sm:ml-3 sm:w-auto">
                            {initialData ? 'Save Changes' : 'Add Category'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary mt-3 w-full sm:mt-0 sm:w-auto"
                            onClick={onClose}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
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
