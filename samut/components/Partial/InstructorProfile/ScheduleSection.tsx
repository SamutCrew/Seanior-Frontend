import { FaCalendar } from "react-icons/fa";
import { InstructorDescription, Availability, AvailabilitySlot } from "@/types/instructor";
import { Input } from "@heroui/react";

interface ScheduleSectionProps {
  description: InstructorDescription | null;
  isEditing: boolean;
  formData: Partial<InstructorDescription>;
  setFormData: (data: Partial<InstructorDescription>) => void;
  isDarkMode: boolean;
}

const ScheduleSection: React.FC<ScheduleSectionProps> = ({
  description,
  isEditing,
  formData,
  setFormData,
  isDarkMode,
}) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleSlotChange = (day: string, index: number, field: keyof AvailabilitySlot, value: string) => {
    const updatedSchedule = { ...(formData.schedule || {}) };
    if (!updatedSchedule[day]) updatedSchedule[day] = [];
    updatedSchedule[day][index] = { ...updatedSchedule[day][index], [field]: value };
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  const addSlot = (day: string) => {
    const updatedSchedule = { ...(formData.schedule || {}) };
    if (!updatedSchedule[day]) updatedSchedule[day] = [];
    updatedSchedule[day].push({ startTime: "", endTime: "", location: "" });
    setFormData({ ...formData, schedule: updatedSchedule });
  };

  return (
    <div className="p-6 border-t border-gray-700">
      <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} mb-4`}>Schedule</h2>
      {isEditing ? (
        <div className="space-y-4">
          {days.map((day) => (
            <div key={day} className="p-4 bg-gray-800 rounded-md">
              <h3 className={`text-lg font-medium ${isDarkMode ? "text-white" : "text-gray-800"} mb-2`}>{day}</h3>
              {(formData.schedule?.[day] || []).map((slot: AvailabilitySlot, index: number) => (
                <div key={index} className="flex gap-4 mb-2">
                  <Input
                    name={`${day}[${index}].startTime`}
                    value={slot.startTime || ""}
                    onChange={(e) => handleSlotChange(day, index, "startTime", e.target.value)}
                    placeholder="Start Time"
                    className={`w-full ${
                      isDarkMode ? "bg-[#2a3a5a] border-[#3a4a6a] text-white" : "bg-white border-gray-300 text-gray-900"
                    } rounded-md`}
                  />
                  <Input
                    name={`${day}[${index}].endTime`}
                    value={slot.endTime || ""}
                    onChange={(e) => handleSlotChange(day, index, "endTime", e.target.value)}
                    placeholder="End Time"
                    className={`w-full ${
                      isDarkMode ? "bg-[#2a3a5a] border-[#3a4a6a] text-white" : "bg-white border-gray-300 text-gray-900"
                    } rounded-md`}
                  />
                  <Input
                    name={`${day}[${index}].location`}
                    value={slot.location || ""}
                    onChange={(e) => handleSlotChange(day, index, "location", e.target.value)}
                    placeholder="Location"
                    className={`w-full ${
                      isDarkMode ? "bg-[#2a3a5a] border-[#3a4a6a] text-white" : "bg-white border-gray-300 text-gray-900"
                    } rounded-md`}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addSlot(day)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Slot
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {days.map((day) => (
            <div key={day}>
              <h3 className={`text-lg font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{day}</h3>
              {description?.schedule?.[day]?.length ? (
                <ul className="list-disc pl-5">
                  {description.schedule[day].map((slot, index) => (
                    <li key={index} className={`${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                      {slot.startTime} - {slot.endTime} {slot.location ? `at ${slot.location}` : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={`${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>No schedule available</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleSection;