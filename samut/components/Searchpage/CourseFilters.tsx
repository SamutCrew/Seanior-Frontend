import { CourseFilters } from "../../types/teacher";

interface CourseFiltersProps {
  filters: CourseFilters;
  setFilters: (filters: CourseFilters) => void;
}

export const CourseFiltersComponent = ({
  filters,
  setFilters,
}: CourseFiltersProps) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Course Focus</label>
      <select
        className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
        value={filters.focus}
        onChange={(e) => setFilters({ ...filters, focus: e.target.value })}
      >
        <option value="">All Focus Areas</option>
        <option value="Technique">Technique Improvement</option>
        <option value="Endurance">Endurance Training</option>
        <option value="Competition">Competition Prep</option>
        <option value="Safety">Water Safety</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Course Level</label>
      <select
        className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
        value={filters.level}
        onChange={(e) => setFilters({ ...filters, level: e.target.value })}
      >
        <option value="">All Levels</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
      <select
        className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
        value={filters.duration}
        onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
      >
        <option value="">Any Duration</option>
        <option value="4 weeks">4 Weeks</option>
        <option value="6 weeks">6 Weeks</option>
        <option value="8 weeks">8 Weeks</option>
        <option value="12 weeks">12 Weeks</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Schedule</label>
      <select
        className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
        value={filters.schedule}
        onChange={(e) => setFilters({ ...filters, schedule: e.target.value })}
      >
        <option value="">Any Time</option>
        <option value="Morning">Morning</option>
        <option value="Afternoon">Afternoon</option>
        <option value="Evening">Evening</option>
        <option value="Weekend">Weekend</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
      <select
        className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
        value={filters.minRating}
        onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
      >
        <option value="0">Any Rating</option>
        <option value="3">3+ Stars</option>
        <option value="4">4+ Stars</option>
        <option value="4.5">4.5+ Stars</option>
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
      <select
        className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
        value={filters.priceRange}
        onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
      >
        <option value="">Any Price</option>
        <option value="0-200">$0-$200</option>
        <option value="200-400">$200-$400</option>
        <option value="400-600">$400-$600</option>
        <option value="600-">$600+</option>
      </select>
    </div>
  </div>
);