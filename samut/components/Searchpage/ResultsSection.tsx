import { InstructorCard } from './InstructorCard';
import CourseCard from '../Course/CourseCard';

interface ResultsSectionProps {
  resultsCount: number;
  resultsText: string;
  searchType: 'instructor' | 'course';
  filteredInstructors: any[];
  filteredCourses: any[];
}

export const ResultsSection = ({
  resultsCount,
  resultsText,
  searchType,
  filteredInstructors,
  filteredCourses
}: ResultsSectionProps) => (
  <div>
    <h2 className="text-xl font-semibold text-gray-800 mb-6">
      {resultsCount} {resultsText} Found
    </h2>

    {resultsCount === 0 ? (
      <div className="text-center py-12">
        <p className="text-gray-500">No {resultsText.toLowerCase()} match your search criteria</p>
      </div>
    ) : searchType === 'instructor' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstructors.map((instructor) => (
          <div key={instructor.user_id} className="relative">
            <InstructorCard instructor={instructor} />
          </div>
        ))}
      </div>
    ) : 
    (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="relative">
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    )}
  </div>
);