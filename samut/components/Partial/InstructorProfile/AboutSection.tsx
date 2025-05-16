import { FaInfoCircle } from "react-icons/fa";
import { InstructorDescription, Specialization } from "@/types/instructor";
import { Input } from "@heroui/react";

interface AboutSectionProps {
  description: InstructorDescription | null;
  isEditing: boolean;
  formData: Partial<InstructorDescription>;
  setFormData: (data: Partial<InstructorDescription>) => void;
  isDarkMode: boolean;
}

const AboutSection: React.FC<AboutSectionProps> = ({
  description,
  isEditing,
  formData,
  setFormData,
  isDarkMode,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSpecializationChange = (index: number, field: keyof Specialization, value: string) => {
    const updatedSpecializations = [...(formData.specializations || [])];
    updatedSpecializations[index] = { ...updatedSpecializations[index], [field]: value };
    setFormData({ ...formData, specializations: updatedSpecializations });
  };

  const addSpecialization = () => {
    setFormData({
      ...formData,
      specializations: [...(formData.specializations || []), { title: "", description: "" }],
    });
  };

  return (
    <div className="p-6 border-t border-gray-700">
      <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} mb-4`}>About</h2>
      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Specialty</label>
            <Input
              name="specialty"
              value={formData.specialty || ""}
              onChange={handleInputChange}
              className={`w-full ${
                isDarkMode ? "bg-[#2a3a5a] border-[#3a4a6a] text-white" : "bg-white border-gray-300 text-gray-900"
              } rounded-md`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio || ""}
              onChange={handleInputChange}
              rows={4}
              className={`w-full ${
                isDarkMode ? "bg-[#2a3a5a] border-[#3a4a6a] text-white" : "bg-white border-gray-300 text-gray-900"
              } rounded-md`}
              placeholder="Tell us about yourself..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Specializations</label>
            {formData.specializations?.map((spec, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-800 rounded-md">
                <Input
                  name={`specializations[${index}].title`}
                  value={spec.title || ""}
                  onChange={(e) => handleSpecializationChange(index, "title", e.target.value)}
                  placeholder="Specialization Title"
                  className={`w-full mb-2 ${
                    isDarkMode ? "bg-[#2a3a5a] border-[#3a4a6a] text-white" : "bg-white border-gray-300 text-gray-900"
                  } rounded-md`}
                />
                <textarea
                  name={`specializations[${index}].description`}
                  value={spec.description || ""}
                  onChange={(e) => handleSpecializationChange(index, "description", e.target.value)}
                  rows={3}
                  placeholder="Specialization Description"
                  className={`w-full ${
                    isDarkMode ? "bg-[#2a3a5a] border-[#3a4a6a] text-white" : "bg-white border-gray-300 text-gray-900"
                  } rounded-md`}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addSpecialization}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Add Specialization
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Specialty</h3>
            <p className={`${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
              {description?.specialty || "No specialty specified"}
            </p>
          </div>
          <div>
            <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Bio</h3>
            <p className={`${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
              {description?.bio || "No bio provided"}
            </p>
          </div>
          <div>
            <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Specializations</h3>
            {description?.specializations?.length ? (
              <ul className="list-disc pl-5">
                {description.specializations.map((spec, index) => (
                  <li key={index} className={`${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
                    <strong>{spec.title}</strong>: {spec.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>No specializations provided</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutSection;