import { FaSearch } from 'react-icons/fa';

interface SearchHeaderProps {
  searchType: 'teacher' | 'course';
  setSearchType: (type: 'teacher' | 'course') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  resultsCount: number;
  resultsText: string;
}

export const SearchHeader = ({
  searchType,
  setSearchType,
  searchTerm,
  setSearchTerm,
  resultsCount,
  resultsText
}: SearchHeaderProps) => (
  <div className="mb-8 max-w-4xl mx-auto">
    <div className="flex justify-center mb-4">
      <div className="inline-flex rounded-md shadow-sm">
        <button
          onClick={() => setSearchType('teacher')}
          className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
            searchType === 'teacher' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Search Teachers
        </button>
        <button
          onClick={() => setSearchType('course')}
          className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
            searchType === 'course' 
              ? 'bg-blue-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Search Courses
        </button>
      </div>
    </div>

    <div className="relative">
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={searchType === 'teacher' ? "Search swimming teachers by name or specialty..." : "Search swimming courses by title or focus..."}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>

    <div className="mt-4">
      <input
        type="text"
        className="w-full p-3 border-2 border-black rounded-lg text-black font-semibold text-center bg-white shadow-md"
        placeholder="Search results will appear below..."
        readOnly
        value={searchTerm ? `${resultsCount} ${resultsText.toLowerCase()} matching: ${searchTerm}` : ''}
      />
    </div>
  </div>
);