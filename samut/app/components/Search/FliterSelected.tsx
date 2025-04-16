import { useState } from "react";

export default function SearchSection() {
  const [mode, setMode] = useState("course");
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log(`Searching for ${mode}: ${query}`);
    // You can add real search logic here
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg space-y-4">
      {/* Mode Selector */}
      <div>
        <label className="label text-base font-semibold text-gray-700">Search Type</label>
        <select
          className="select select-bordered w-full"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="course">Find Course</option>
          <option value="teacher">Find Teacher</option>
        </select>
      </div>

      {/* Search Input + Button */}
      <div className="flex">
        <input
          type="text"
          className="input input-bordered w-full rounded-r-none bg-white text-gray-900 placeholder:text-gray-500"
          placeholder={`Search ${mode === "course" ? "Courses" : "Teachers"}`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="btn btn-primary rounded-l-none"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  );
}
