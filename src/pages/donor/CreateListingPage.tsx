import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { FoodCategory, FoodType } from '../../types';
import { FoodSafetyNotice } from '../../components/common/FoodSafetyNotice';
import { 
  PlusCircle, 
  Utensils, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';

const CATEGORIES: FoodCategory[] = [
  'Cooked Meals',
  'Bakery & Bread',
  'Fruits & Vegetables',
  'Packaged Food',
  'Dairy & Beverages',
  'Desserts & Sweets',
  'Other',
];

const FOOD_TYPES: FoodType[] = [
  'Vegetarian',
  'Vegan',
  'Non-vegetarian',
  'Eggetarian',
  'Other',
];

const COMMON_ALLERGENS = [
  'None',
  'Dairy',
  'Gluten (Wheat)',
  'Peanuts / Tree Nuts',
  'Eggs',
  'Soy',
  'Mustard Seeds',
  'Sesame',
];

const PRESET_IMAGES = [
  { label: 'Cooked Rice / Pulao', url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&q=80' },
  { label: 'South Indian / Idli Sambar', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80' },
  { label: 'Roti & Dal', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80' },
  { label: 'Biryani Bowl', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&q=80' },
  { label: 'Artisan Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
  { label: 'Fresh Produce / Fruit', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80' },
  { label: 'Meal Boxes', url: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=600&q=80' },
  { label: 'Sandwiches', url: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80' },
];

export const CreateListingPage: React.FC = () => {
  const { user } = useAuth();
  const { createListing } = useData();
  const navigate = useNavigate();

  // Form states with sensible defaults for quick testing
  const now = new Date();
  const defaultPrep = new Date(now.getTime() - 60 * 60 * 1000).toISOString().slice(0, 16);
  const defaultStart = new Date(now.getTime() + 30 * 60 * 1000).toISOString().slice(0, 16);
  const defaultEnd = new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString().slice(0, 16);
  const defaultUseBy = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Cooked Meals');
  const [foodType, setFoodType] = useState<FoodType>('Vegetarian');
  const [quantity, setQuantity] = useState<number | ''>(20);
  const [unit, setUnit] = useState('portions');
  const [preparationTime, setPreparationTime] = useState(defaultPrep);
  const [storageConditions, setStorageConditions] = useState('Hot Insulated Containers (above 60°C)');
  const [allergens, setAllergens] = useState<string[]>(['None']);
  const [pickupAddress, setPickupAddress] = useState(user?.address || '104, 100 Feet Road, Indiranagar');
  const [city, setCity] = useState(user?.city || 'Bangalore');
  const [area, setArea] = useState(user?.area || 'Indiranagar');
  const [pickupStart, setPickupStart] = useState(defaultStart);
  const [pickupEnd, setPickupEnd] = useState(defaultEnd);
  const [useByType, setUseByType] = useState<'Use-by' | 'Best-before'>('Use-by');
  const [useByDateTime, setUseByDateTime] = useState(defaultUseBy);
  const [handlingInstructions, setHandlingInstructions] = useState('Keep sealed in thermal packaging. Consume warm within 4 hours.');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [safetyAcknowledged, setSafetyAcknowledged] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user) return null;

  const handleAllergenToggle = (item: string) => {
    if (item === 'None') {
      setAllergens(['None']);
      return;
    }

    let updated = allergens.filter(a => a !== 'None');
    if (updated.includes(item)) {
      updated = updated.filter(a => a !== item);
      if (updated.length === 0) updated = ['None'];
    } else {
      updated.push(item);
    }
    setAllergens(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Food title is required.');
      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError('Quantity must be greater than zero.');
      return;
    }

    if (new Date(pickupEnd) <= new Date(pickupStart)) {
      setError('Pickup window end time must be after start time.');
      return;
    }

    if (new Date(useByDateTime) <= new Date(pickupStart)) {
      setError('Use-by / best-before time must be after the pickup window.');
      return;
    }

    if (!safetyAcknowledged) {
      setError('Mandatory food safety acknowledgement must be checked.');
      return;
    }

    setSubmitting(true);
    try {
      createListing(
        {
          donorId: user.id,
          donorName: user.name,
          donorType: user.orgType,
          donorPhone: user.phone,
          title: title.trim(),
          description: description.trim() || 'Freshly prepared surplus food packaged under clean conditions.',
          category,
          foodType,
          totalQuantity: Number(quantity),
          unit,
          preparationTime: new Date(preparationTime).toISOString(),
          listedAt: new Date().toISOString(),
          storageConditions,
          allergens,
          pickupAddress,
          city,
          area,
          pickupStart: new Date(pickupStart).toISOString(),
          pickupEnd: new Date(pickupEnd).toISOString(),
          useByType,
          useByDateTime: new Date(useByDateTime).toISOString(),
          handlingInstructions: handlingInstructions.trim(),
          safetyAcknowledged: true,
          imageUrl,
        },
        user
      );

      navigate('/donor/my-listings');
    } catch (err: any) {
      setError(err.message || 'Failed to publish listing');
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Surplus Food Listing</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Provide transparent preparation, storage, allergen, and pickup information.
          </p>
        </div>
      </div>

      <FoodSafetyNotice compact />

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs sm:text-sm text-rose-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        
        {/* Section 1: Food Details */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-800 flex items-center gap-2">
            <Utensils className="w-4 h-4" />
            <span>1. Food Classification & Quantity</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Food Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Vegetable Biryani with Mirchi ka Salan"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Food Description & Contents
            </label>
            <textarea
              rows={2}
              placeholder="Detailed description of ingredients, packaging, and portion size..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 resize-none bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as FoodCategory)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Dietary Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={foodType}
                onChange={e => setFoodType(e.target.value as FoodType)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
              >
                {FOOD_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Total Available Quantity <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                required
                value={quantity}
                onChange={e => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Unit of Measurement <span className="text-rose-500">*</span>
              </label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
              >
                <option value="portions">portions</option>
                <option value="kg">kg</option>
                <option value="boxes">boxes</option>
                <option value="packets">packets</option>
                <option value="trays">trays</option>
                <option value="litres">litres</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Storage & Allergen Info */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>2. Safety, Storage & Allergens</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preparation Time <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={preparationTime}
                onChange={e => setPreparationTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Current Storage Conditions <span className="text-rose-500">*</span>
              </label>
              <select
                value={storageConditions}
                onChange={e => setStorageConditions(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
              >
                <option value="Hot Insulated Containers (above 60°C)">Hot Insulated Containers (above 60°C)</option>
                <option value="Chilled Display Cabinet (4°C)">Chilled Display Cabinet (4°C)</option>
                <option value="Refrigerated Walk-in Cooler (0-4°C)">Refrigerated Walk-in Cooler (0-4°C)</option>
                <option value="Dry, Ambient Room Temperature">Dry, Ambient Room Temperature</option>
                <option value="Cool Ambient (15-20°C)">Cool Ambient (15-20°C)</option>
                <option value="Deep Frozen (-18°C)">Deep Frozen (-18°C)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Contains Allergens (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_ALLERGENS.map(item => {
                const checked = allergens.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleAllergenToggle(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      checked
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Expiry Standard <span className="text-rose-500">*</span>
              </label>
              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="useByType"
                    value="Use-by"
                    checked={useByType === 'Use-by'}
                    onChange={() => setUseByType('Use-by')}
                    className="text-brand-800"
                  />
                  <span><strong>Use-by</strong> (Perishable / safety critical)</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="useByType"
                    value="Best-before"
                    checked={useByType === 'Best-before'}
                    onChange={() => setUseByType('Best-before')}
                    className="text-brand-800"
                  />
                  <span><strong>Best-before</strong> (Dry / bakery)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Use-by / Best-before Deadline <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={useByDateTime}
                onChange={e => setUseByDateTime(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Special Handling Instructions
            </label>
            <input
              type="text"
              value={handlingInstructions}
              onChange={e => setHandlingInstructions(e.target.value)}
              placeholder="e.g., Maintain in sealed containers, reheat thoroughly before serving."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
            />
          </div>
        </div>

        {/* Section 3: Pickup Window & Location */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-800 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>3. Pickup Logistics & Window</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pickup Window Opens <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={pickupStart}
                onChange={e => setPickupStart(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pickup Window Closes (Strict Deadline) <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={pickupEnd}
                onChange={e => setPickupEnd(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pickup Address / Kitchen Door <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={pickupAddress}
                onChange={e => setPickupAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Locality / Area <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={area}
                onChange={e => setArea(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-700 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Image Selector */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold uppercase tracking-wider text-brand-800 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>4. Food Image Illustration</span>
          </h3>

          <p className="text-xs text-slate-500">
            Choose a representative culinary image for the card preview:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_IMAGES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setImageUrl(preset.url)}
                className={`p-1.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  imageUrl === preset.url
                    ? 'border-brand-700 ring-2 ring-brand-700/20 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-full h-16 object-cover rounded-lg"
                />
                <span className="block text-[11px] font-medium text-slate-700 mt-1 truncate">
                  {preset.label}
                </span>
                {imageUrl === preset.url && (
                  <span className="absolute top-2 right-2 bg-brand-800 text-white p-0.5 rounded-full shadow">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mandatory Food Safety Acknowledgement */}
        <div className="pt-4 border-t border-slate-100">
          <label className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/80 border border-amber-300 cursor-pointer text-xs sm:text-sm text-amber-950">
            <input
              type="checkbox"
              required
              checked={safetyAcknowledged}
              onChange={e => setSafetyAcknowledged(e.target.checked)}
              className="mt-0.5 rounded text-brand-700 focus:ring-brand-700"
            />
            <span className="leading-relaxed">
              <strong>Mandatory Safety Acknowledgement:</strong> "I confirm that the food information, preparation time, storage conditions, allergens, and pickup details provided are accurate. I will follow applicable local food-safety and handling requirements."
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/donor/my-listings')}
            className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting || !safetyAcknowledged}
            className="px-7 py-3 bg-brand-800 hover:bg-brand-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-brand-300" />
            <span>{submitting ? 'Publishing...' : 'Publish Surplus Food Listing'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
