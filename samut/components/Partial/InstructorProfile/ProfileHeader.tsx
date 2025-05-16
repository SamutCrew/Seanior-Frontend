import { FaMapMarkerAlt, FaSwimmer, FaClock } from "react-icons/fa";
import { InstructorDescription } from "@/types/instructor";
import { Input } from "@heroui/react";

interface ProfileHeaderProps {
  description: InstructorDescription | null;
  isEditing: boolean;
  formData: Partial<InstructorDescription>;
  setFormData: (data: Partial<InstructorDescription>) => void;
  isDarkMode: boolean;
  address: string;
  setAddress: (address: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  description,
  isEditing,
  formData,
  setFormData,
  isDarkMode,
  address,
  setAddress,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="p-6">
      <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} mb-4`}>Instructor Profile</h2>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Styles</label>
            <Input
              name="styles"
              value={formData.styles || ""}
              onChange={handleInputChange}
              placeholder="e.g., Freestyle, Butterfly, Backstroke, Breaststroke"
              className={`w-full ${
                isDarkMode ? "bg-[#2a3a5a] border-[#3a4a6a] text-white" : "bg-white border-gray-300 text-gray-900"
              } rounded-md`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Experience (years)</label>
            <Input
              name="experience"
              type="number"
              value={formData.experience || ""}
              onChange={handleInputChange}
              className={`w-full ${
                isDarkMode ? "bg-[#2a3a5a] border-[#3a4a6a] text-white" : "bg-white border-gray-300 text-gray-900"
              } rounded-md`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Contact Hours</label>
            <Input
              name="contactHours"
              value={formData.contactHours || ""}
              onChange={handleInputChange}
              placeholder="e.g., Starting from $85/hr"
              className={`w-full ${
                isDarkMode ? "bg-[#2a3a5a] border-[#3a4a6a] text-white" : "bg-white border-gray-300 text-gray-900"
              } rounded-md`}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FaSwimmer className="text-blue-500" />
            <p className={`${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
              {description?.styles || "No styles specified"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-blue-500" />
            <p className={`${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
              {description?.experience ? `${description.experience} years experience` : "No experience specified"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-blue-500" />
            <p className={`${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
              {address || "No address specified"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-blue-500" />
            <p className={`${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
              {description?.contactHours || "No contact hours specified"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;