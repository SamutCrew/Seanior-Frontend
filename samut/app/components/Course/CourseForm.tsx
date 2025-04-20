"use client"

import { useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';

interface Location {
  address: string;
  lat?: number;
  lng?: number;
}

interface CourseFormProps {
  initialData?: {
    title: string;
    focus: string;
    level: string;
    duration: string;
    schedule: string;
    price: number;
    location: Location;
  };
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

const levels = ['Beginner', 'Intermediate', 'Advanced'];
const focuses = [
  'Technique Improvement',
  'Water Confidence',
  'Race Techniques',
  'Endurance Training',
  'Stroke Correction'
];

export default function CourseForm({ initialData, onSubmit, onCancel }: CourseFormProps) {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    focus: '',
    level: '',
    duration: '',
    schedule: '',
    price: 0,
    location: {
      address: ''
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        address: e.target.value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" >
        {/* Title */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 ">Course Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="bg-white w-full p-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            required
          />
        </div>

        {/* Focus */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Focus Area</label>
          <select
            name="focus"
            value={formData.focus}
            onChange={handleChange}
            className="bg-white w-full p-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            required
          >
            <option value="">Select focus area</option>
            {focuses.map(focus => (
              <option key={focus} value={focus}>{focus}</option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skill Level</label>
          <select
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="bg-white w-full p-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            required
          >
            <option value="">Select level</option>
            {levels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g. 8 weeks"
            className="bg-white w-full p-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            required
          />
        </div>

        {/* Schedule */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
          <input
            type="text"
            name="schedule"
            value={formData.schedule}
            onChange={handleChange}
            placeholder="e.g. Mon/Wed 5-6pm"
            className="bg-white w-full p-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="bg-white w-full p-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            required
            min="0"
          />
        </div>

        {/* Location */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={formData.location.address}
            onChange={handleLocationChange}
            placeholder="Pool location or address"
            className="bg-white w-full p-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            required
          />
        </div>
      </div>

      {/* Description - Would be added in a real implementation */}

      <div className="flex justify-end gap-4 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-white flex items-center gap-2 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
          >
            <FaTimes /> Cancel
          </button>
        )}
        <button
          type="submit"
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-lg"
        >
          <FaSave /> Save Course
        </button>
      </div>
    </form>
  );
}