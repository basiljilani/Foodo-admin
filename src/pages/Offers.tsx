import { useState } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  ClipboardIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface Offer {
  id: number;
  title: string;
  code: string;
  discount: string;
  validUntil: string;
  type: 'new_user' | 'flash_deal' | 'weekend' | 'partnership';
  status: 'active' | 'expired' | 'scheduled';
  usageCount: number;
}

const sampleOffers: Offer[] = [
  {
    id: 1,
    title: "Welcome Discount",
    code: "WELCOME50",
    discount: "50% OFF",
    validUntil: "2024-03-31",
    type: "new_user",
    status: "active",
    usageCount: 156
  },
  {
    id: 2,
    title: "Weekend Special",
    code: "WEEKEND25",
    discount: "25% OFF",
    validUntil: "2024-03-30",
    type: "weekend",
    status: "scheduled",
    usageCount: 0
  },
];

export default function Offers() {
  const [offers] = useState<Offer[]>(sampleOffers);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleAddOffer = () => {
    toast.success('Add Offer clicked - Implement form');
  };

  const handleEditOffer = (id: number) => {
    toast.success(`Edit Offer ${id} clicked - Implement form`);
  };

  const handleDeleteOffer = (id: number) => {
    toast.success(`Delete Offer ${id} clicked - Implement confirmation`);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusColor = (status: Offer['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: Offer['type']) => {
    switch (type) {
      case 'new_user':
        return 'bg-purple-100 text-purple-800';
      case 'flash_deal':
        return 'bg-blue-100 text-blue-800';
      case 'weekend':
        return 'bg-indigo-100 text-indigo-800';
      case 'partnership':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Offers</h1>
        <button
          onClick={handleAddOffer}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Offer
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <div key={offer.id} className="card">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium text-gray-900">{offer.title}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditOffer(offer.id)}
                  className="text-primary-600 hover:text-primary-900"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteOffer(offer.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="mt-2 flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(offer.status)}`}>
                {offer.status}
              </span>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(offer.type)}`}>
                {offer.type.replace('_', ' ')}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                <code className="text-sm font-mono">{offer.code}</code>
                <button
                  onClick={() => handleCopyCode(offer.code)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {copiedCode === offer.code ? (
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  ) : (
                    <ClipboardIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-lg font-semibold text-primary-600">{offer.discount}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Valid until: {offer.validUntil}</span>
                <span>Used: {offer.usageCount} times</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
