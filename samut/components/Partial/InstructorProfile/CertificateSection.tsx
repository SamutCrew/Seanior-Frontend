import { FaCertificate } from "react-icons/fa";
import { InstructorDescription } from "@/types/instructor";
import { Input } from "@heroui/react";

interface CertificateSectionProps {
  description: InstructorDescription | null;
  isEditing: boolean;
  formData: Partial<InstructorDescription>;
  setFormData: (data: Partial<InstructorDescription>) => void;
  isDarkMode: boolean;
}

const CertificateSection: React.FC<CertificateSectionProps> = ({
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

  return (
    <div className="p-6 border-t border-gray-700">
      <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"} mb-4`}>Certificates</h2>
      {isEditing ? (
        <div>
          <label className="block text-sm font-medium mb-2">Certifications</label>
          <textarea
            name="certification"
            value={formData.certification || ""}
            onChange={handleInputChange}
            rows={4}
            className={`w-full ${
              isDarkMode ? "bg-[#2a3a5a] border-[#3a4a6a] text-white" : "bg-white border-gray-300 text-gray-900"
            } rounded-md`}
            placeholder="List your Certifications..."
          />
        </div>
      ) : (
        <div>
          <p className={`${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
            {description?.certification || "No Certifications provided"}
          </p>
        </div>
      )}
    </div>
  );
};

export default CertificateSection;