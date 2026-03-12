import React, { useState } from "react";
import {
  FaUser,
  FaPlus,
  FaTimes,
  FaMapMarkerAlt,
  FaPhone,
  FaGlobe,
  FaEnvelope,
  FaVideo,
  FaLanguage,
  FaUpload,
  FaCalendarAlt,
  FaClock,
  FaArrowLeft,
} from "react-icons/fa";
import { registerExpert } from "../../services/expertService";
import { useNavigate, Link } from "react-router-dom";

const ExpertRegistrationPage = () => {
  // Main form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    experience: "",
    bio: "",
    languages: ["English"],
    profilePic: null,
    profilePicPreview: null,
    backgroundImage: null,
    backgroundImagePreview: null,
  });

  // Additional state for multi-part sections
  const [qualifications, setQualifications] = useState([{ value: "" }]);
  const [specialties, setSpecialties] = useState([{ value: "" }]);
  const [services, setServices] = useState([
    {
      name: "",
      format: "In-person/Online",
      duration: "50",
      price: "",
    },
  ]);
  const [availability, setAvailability] = useState({
    monday: { selected: false, startTime: "09:00", endTime: "17:00" },
    tuesday: { selected: false, startTime: "09:00", endTime: "17:00" },
    wednesday: { selected: false, startTime: "09:00", endTime: "17:00" },
    thursday: { selected: false, startTime: "09:00", endTime: "17:00" },
    friday: { selected: false, startTime: "09:00", endTime: "17:00" },
    saturday: { selected: false, startTime: "09:00", endTime: "17:00" },
    sunday: { selected: false, startTime: "09:00", endTime: "17:00" },
  });
  const [contact, setContact] = useState({
    phone: "",
    email: "",
    website: "",
    location: "",
  });
  const [faq, setFaq] = useState([
    { question: "What should I expect from our first session?", answer: "" },
    { question: "Do you accept insurance?", answer: "" },
    { question: "How often will we meet?", answer: "" },
  ]);

  // Current step in multi-step form
  const [currentStep, setCurrentStep] = useState(1);
  // Preview mode
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  // Helper function to handle main form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Helper function to handle file uploads
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0], // keep File object
        [`${name}Preview`]: URL.createObjectURL(files[0]), // create preview URL
      });
    }
  };

  // Helper functions for array fields
  const handleArrayChange = (index, value, stateSetter, stateArray) => {
    const newArray = [...stateArray];
    newArray[index].value = value;
    stateSetter(newArray);
  };

  const addArrayField = (stateSetter, stateArray) => {
    stateSetter([...stateArray, { value: "" }]);
  };

  const removeArrayField = (index, stateSetter, stateArray) => {
    const newArray = [...stateArray];
    newArray.splice(index, 1);
    stateSetter(newArray);
  };

  // Helper functions for services
  const handleServiceChange = (index, field, value) => {
    const newServices = [...services];
    newServices[index][field] = value;
    setServices(newServices);
  };

  const addService = () => {
    setServices([
      ...services,
      {
        name: "",
        format: "In-person/Online",
        duration: "50",
        price: "",
      },
    ]);
  };

  const removeService = (index) => {
    const newServices = [...services];
    newServices.splice(index, 1);
    setServices(newServices);
  };

  // Helper functions for FAQ
  const handleFaqChange = (index, field, value) => {
    const newFaq = [...faq];
    newFaq[index][field] = value;
    setFaq(newFaq);
  };

  const addFaq = () => {
    setFaq([...faq, { question: "", answer: "" }]);
  };

  const removeFaq = (index) => {
    const newFaq = [...faq];
    newFaq.splice(index, 1);
    setFaq(newFaq);
  };

  // Handle availability changes
  const handleAvailabilityChange = (day, field, value) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [field]: field === "selected" ? !availability[day].selected : value,
      },
    });
  };

  // Handle contact info changes
  const handleContactChange = (field, value) => {
    setContact((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle language selection
  const handleLanguageChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({
        ...formData,
        languages: [...formData.languages, value],
      });
    } else {
      setFormData({
        ...formData,
        languages: formData.languages.filter((lang) => lang !== value),
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    // Basic fields
    formDataToSend.append("name", formData.name);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("experience", formData.experience);
    formDataToSend.append("bio", formData.bio);

    // Languages
    if (formData.languages?.length) {
      formData.languages.forEach((lang) => {
        formDataToSend.append("languages", lang);
      });
    }

    // Profile & background images
    if (formData.profilePic) {
      formDataToSend.append("profilePic", formData.profilePic);
    }
    if (formData.backgroundImage) {
      formDataToSend.append("backgroundImage", formData.backgroundImage);
    }

    // Contact info - flatten to individual fields
    formDataToSend.append("phone", contact.phone);
    formDataToSend.append("email", contact.email);
    formDataToSend.append("website", contact.website);
    formDataToSend.append("location", contact.location);

    // Transform qualifications & specialties - extract values from objects to simple arrays
    const qualificationsArray = qualifications
      .map((q) => q.value)
      .filter((v) => v.trim() !== "");
    const specialtiesArray = specialties
      .map((s) => s.value)
      .filter((v) => v.trim() !== "");

    formDataToSend.append("qualifications", JSON.stringify(qualificationsArray));
    formDataToSend.append("specialties", JSON.stringify(specialtiesArray));

    // Services - already in correct format
    formDataToSend.append("services", JSON.stringify(services));

    // Transform availability from object to array with DateTime values
    const availabilityArray = Object.keys(availability).map((day) => {
      const dayData = availability[day];
      return {
        day: day,
        selected: dayData.selected,
        startTime: dayData.selected && dayData.startTime
          ? new Date(`1970-01-01T${dayData.startTime}:00Z`).toISOString()
          : null,
        endTime: dayData.selected && dayData.endTime
          ? new Date(`1970-01-01T${dayData.endTime}:00Z`).toISOString()
          : null,
      };
    });

    formDataToSend.append("availability", JSON.stringify(availabilityArray));

    // FAQs - rename from 'faq' to 'faqs'
    formDataToSend.append("faqs", JSON.stringify(faq));

    try {
      const data = await registerExpert(formDataToSend);
      console.log("Registration response:", data);
      navigate('/expert/pending');
    } catch (err) {
      console.error("Registration error:", err);
      alert("Error: " + (err || "Something went wrong!"));
    }
  };

  // Render form progress
  const renderProgress = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className="flex flex-col items-center flex-1"
            onClick={() => setCurrentStep(step)}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                step === currentStep
                  ? "bg-blue-600 text-white"
                  : step < currentStep
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step < currentStep ? "✓" : step}
            </div>
            <div className="text-xs text-gray-600 text-center">
              {step === 1 && "Basic Info"}
              {step === 2 && "Expertise"}
              {step === 3 && "Services"}
              {step === 4 && "Schedule"}
              {step === 5 && "Contact & FAQ"}
            </div>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={`line-${step}`}
            className={`h-1 flex-1 ${
              step < currentStep ? "bg-green-500" : "bg-gray-200"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );

  // Basic Information Step
  const renderBasicInfoStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Full Name*
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Dr. Jane Smith"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Professional Category*
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select your profession</option>
            <option value="Psychologist">Psychologist</option>
            <option value="Therapist">Therapist</option>
            <option value="Life Coach">Life Coach</option>
            <option value="Nutritionist">Nutritionist</option>
            <option value="Personal Trainer">Personal Trainer</option>
            <option value="Yoga Instructor">Yoga Instructor</option>
            <option value="Meditation Teacher">Meditation Teacher</option>
            <option value="Wellness Coach">Wellness Coach</option>
            <option value="Counselor">Counselor</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Years of Experience*
        </label>
        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select your experience</option>
          <option value="1-2 years">1-2 years</option>
          <option value="3-5 years">3-5 years</option>
          <option value="5-10 years">5-10 years</option>
          <option value="10+ years">10+ years</option>
          <option value="15+ years">15+ years</option>
          <option value="20+ years">20+ years</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Bio / Professional Summary*
        </label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows="4"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Describe your professional background, approach, and philosophy..."
          required
        ></textarea>
        <p className="text-sm text-gray-500 mt-1">
          Write a concise bio that highlights your expertise, approach, and what
          clients can expect working with you. (150-300 words recommended)
        </p>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Languages*
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            "English",
            "Spanish",
            "French",
            "German",
            "Mandarin",
            "Hindi",
            "Arabic",
            "Other",
          ].map((language) => (
            <div key={language} className="flex items-center">
              <input
                type="checkbox"
                id={`lang-${language}`}
                value={language}
                checked={formData.languages.includes(language)}
                onChange={handleLanguageChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor={`lang-${language}`}
                className="ml-2 text-gray-700"
              >
                {language}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Profile Photo*
          </label>
          <div className="flex items-start space-x-4">
            <div className="relative">
              {formData.profilePicPreview ? (
                <img
                  src={formData.profilePicPreview}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                  <FaUser className="text-gray-400 text-2xl" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition text-center">
                <FaUpload className="inline mr-2" />
                Upload Photo
                <input
                  type="file"
                  name="profilePic"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Upload a professional headshot (square format recommended)
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Cover/Background Image
          </label>
          <div className="flex items-start space-x-4">
            <div className="relative">
              {formData.backgroundImagePreview ? (
                <img
                  src={formData.backgroundImagePreview}
                  alt="Background Preview"
                  className="w-32 h-16 rounded object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-32 h-16 rounded bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                  <FaUpload className="text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="block w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition text-center">
                <FaUpload className="inline mr-2" />
                Upload Background
                <input
                  type="file"
                  name="backgroundImage"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Upload a wide banner image (recommended 1600x400)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Expertise Step
  const renderExpertiseStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Qualifications & Expertise
      </h2>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Professional Qualifications & Certifications*
        </label>
        <div className="space-y-3">
          {qualifications.map((qual, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={qual.value}
                onChange={(e) =>
                  handleArrayChange(
                    index,
                    e.target.value,
                    setQualifications,
                    qualifications
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Ph.D. in Clinical Psychology, Stanford University"
              />
              <button
                type="button"
                onClick={() =>
                  removeArrayField(index, setQualifications, qualifications)
                }
                disabled={qualifications.length === 1}
                className={`p-3 rounded-lg ${
                  qualifications.length === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-red-50 text-red-500 hover:bg-red-100"
                }`}
              >
                <FaTimes />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField(setQualifications, qualifications)}
            className="flex items-center justify-center w-full p-2 bg-gray-50 border border-gray-300 border-dashed rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            <FaPlus className="mr-2" /> Add Qualification
          </button>
        </div>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Areas of Expertise / Specialties*
        </label>
        <div className="space-y-3">
          {specialties.map((specialty, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={specialty.value}
                onChange={(e) =>
                  handleArrayChange(
                    index,
                    e.target.value,
                    setSpecialties,
                    specialties
                  )
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Anxiety & Panic Disorders"
              />
              <button
                type="button"
                onClick={() =>
                  removeArrayField(index, setSpecialties, specialties)
                }
                disabled={specialties.length === 1}
                className={`p-3 rounded-lg ${
                  specialties.length === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-red-50 text-red-500 hover:bg-red-100"
                }`}
              >
                <FaTimes />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayField(setSpecialties, specialties)}
            className="flex items-center justify-center w-full p-2 bg-gray-50 border border-gray-300 border-dashed rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            <FaPlus className="mr-2" /> Add Specialty
          </button>
        </div>
      </div>
    </div>
  );

  // Services Step
  const renderServicesStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Services Offered</h2>
      <p className="text-gray-600">
        Add the services you offer to clients, including format, duration, and
        pricing.
      </p>

      {services.map((service, index) => (
        <div
          key={index}
          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-800">Service #{index + 1}</h3>
            <button
              type="button"
              onClick={() => removeService(index)}
              disabled={services.length === 1}
              className={`p-1 rounded ${
                services.length === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-red-500 hover:bg-red-50"
              }`}
            >
              <FaTimes />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Service Name*
              </label>
              <input
                type="text"
                value={service.name}
                onChange={(e) =>
                  handleServiceChange(index, "name", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Individual Therapy Session"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Format*
              </label>
              <select
                value={service.format}
                onChange={(e) =>
                  handleServiceChange(index, "format", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="In-person/Online">In-person or Online</option>
                <option value="In-person">In-person only</option>
                <option value="Online">Online only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Duration (minutes)*
              </label>
              <input
                type="number"
                value={service.duration}
                onChange={(e) =>
                  handleServiceChange(index, "duration", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 50"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Price*
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="text"
                  value={service.price}
                  onChange={(e) =>
                    handleServiceChange(index, "price", e.target.value)
                  }
                  className="w-full p-2 pl-7 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 80"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addService}
        className="flex items-center justify-center w-full p-3 bg-gray-50 border border-gray-300 border-dashed rounded-lg text-gray-600 hover:bg-gray-100 transition"
      >
        <FaPlus className="mr-2" /> Add Another Service
      </button>
    </div>
  );

  // Availability Step
  const renderAvailabilityStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Availability</h2>
      <p className="text-gray-600">
        Set your regular working hours for client appointments.
      </p>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        {[
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ].map((day) => (
          <div
            key={day}
            className="py-3 border-b border-gray-200 last:border-b-0 flex flex-wrap items-center"
          >
            <div className="w-28">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`day-${day}`}
                  checked={availability[day].selected}
                  onChange={() =>
                    handleAvailabilityChange(day, "selected", null)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor={`day-${day}`}
                  className="ml-2 font-medium text-gray-700 capitalize"
                >
                  {day}
                </label>
              </div>
            </div>

            {availability[day].selected && (
              <div className="flex items-center gap-2 ml-2 mt-2 sm:mt-0">
                <div className="flex items-center">
                  <FaClock className="text-gray-400 mr-2" />
                  <select
                    value={availability[day].startTime}
                    onChange={(e) =>
                      handleAvailabilityChange(day, "startTime", e.target.value)
                    }
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[
                      "06:00",
                      "07:00",
                      "08:00",
                      "09:00",
                      "10:00",
                      "11:00",
                      "12:00",
                      "13:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                      "18:00",
                      "19:00",
                      "20:00",
                    ].map((time) => (
                      <option key={`start-${time}`} value={time}>
                        {time.split(":")[0] > 12
                          ? `${time.split(":")[0] - 12}:${
                              time.split(":")[1]
                            } PM`
                          : time.split(":")[0] === "12"
                          ? `${time} PM`
                          : `${time} AM`}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-gray-500">to</span>

                <select
                  value={availability[day].endTime}
                  onChange={(e) =>
                    handleAvailabilityChange(day, "endTime", e.target.value)
                  }
                  className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {[
                    "09:00",
                    "10:00",
                    "11:00",
                    "12:00",
                    "13:00",
                    "14:00",
                    "15:00",
                    "16:00",
                    "17:00",
                    "18:00",
                    "19:00",
                    "20:00",
                    "21:00",
                    "22:00",
                  ].map((time) => (
                    <option key={`end-${time}`} value={time}>
                      {time.split(":")[0] > 12
                        ? `${time.split(":")[0] - 12}:${time.split(":")[1]} PM`
                        : time.split(":")[0] === "12"
                        ? `${time} PM`
                        : `${time} AM`}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="font-medium text-blue-800 mb-2 flex items-center">
          <FaCalendarAlt className="mr-2" /> Appointment Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Minimum notice before booking (hours)
            </label>
            <input
              type="number"
              className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue="24"
              min="0"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Appointment interval (minutes)
            </label>
            <select
              className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              defaultValue="30"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  // Contact & FAQ Step
  const renderContactStep = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">
        Contact Information & FAQs
      </h2>

      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3">Contact Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              <FaPhone className="inline mr-2 text-gray-500" /> Phone Number*
            </label>
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) => handleContactChange("phone", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., +1 234 567 890"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              <FaEnvelope className="inline mr-2 text-gray-500" /> Email
              Address*
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) => handleContactChange("email", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., jane.smith@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              <FaGlobe className="inline mr-2 text-gray-500" /> Website
            </label>
            <input
              type="url"
              value={contact.website}
              onChange={(e) => handleContactChange("website", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., https://janesmith.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              <FaMapMarkerAlt className="inline mr-2 text-gray-500" /> Location
            </label>
            <input
              type="text"
              value={contact.location}
              onChange={(e) => handleContactChange("location", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., New York, NY"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {faq.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-200"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-700">FAQ #{index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  disabled={faq.length === 1}
                  className={`p-1 rounded ${
                    faq.length === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-red-500 hover:bg-red-50"
                  }`}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Question*
                  </label>
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) =>
                      handleFaqChange(index, "question", e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., What should I expect from our first session?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">
                    Answer*
                  </label>
                  <textarea
                    value={item.answer}
                    onChange={(e) =>
                      handleFaqChange(index, "answer", e.target.value)
                    }
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Provide a detailed answer..."
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addFaq}
            className="flex items-center justify-center w-full p-3 bg-gray-50 border border-gray-300 border-dashed rounded-lg text-gray-600 hover:bg-gray-100 transition"
          >
            <FaPlus className="mr-2" /> Add Another FAQ
          </button>
        </div>
      </div>
    </div>
  );

  // Preview Mode
  const renderPreview = () => (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-800">
        Preview Your Profile
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="relative">
          {formData.backgroundImage && (
            <img
              src={formData.backgroundImage}
              alt="Background"
              className="w-full h-48 object-cover rounded-t-lg"
            />
          )}
          <div className="absolute -bottom-12 left-6">
            {formData.profilePic ? (
              <img
                src={formData.profilePic}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center">
                <FaUser className="text-gray-400 text-3xl" />
              </div>
            )}
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-gray-800">
            {formData.name}
          </h3>
          <p className="text-gray-600">{formData.category}</p>
          <p className="text-gray-600">{formData.experience} of experience</p>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800">About Me</h4>
          <p className="text-gray-600 whitespace-pre-line">{formData.bio}</p>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800">Languages</h4>
          <div className="flex flex-wrap gap-2">
            {formData.languages.map((lang) => (
              <span
                key={lang}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800">
            Qualifications
          </h4>
          <ul className="list-disc list-inside text-gray-600">
            {qualifications.map((qual, index) => (
              <li key={index}>{qual.value}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800">Specialties</h4>
          <ul className="list-disc list-inside text-gray-600">
            {specialties.map((spec, index) => (
              <li key={index}>{spec.value}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800">Services</h4>
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-800">{service.name}</h5>
                <p className="text-gray-600">
                  {service.format} | {service.duration} minutes | $
                  {service.price}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800">Availability</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(availability).map(([day, details]) =>
              details.selected ? (
                <div key={day} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800 capitalize">{day}</p>
                  <p className="text-gray-600">
                    {details.startTime} - {details.endTime}
                  </p>
                </div>
              ) : null
            )}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800">Contact</h4>
          <div className="space-y-2 text-gray-600">
            <p>
              <FaPhone className="inline mr-2" /> {contact.phone}
            </p>
            <p>
              <FaEnvelope className="inline mr-2" /> {contact.email}
            </p>
            {contact.website && (
              <p>
                <FaGlobe className="inline mr-2" />{" "}
                <a
                  href={contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {contact.website}
                </a>
              </p>
            )}
            {contact.location && (
              <p>
                <FaMapMarkerAlt className="inline mr-2" /> {contact.location}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800">FAQs</h4>
          <div className="space-y-4">
            {faq.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-800">{item.question}</h5>
                <p className="text-gray-600 whitespace-pre-line">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setShowPreview(false)}
          className="flex items-center px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          <FaArrowLeft className="mr-2" /> Back to Edit
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Submit Profile
        </button>
      </div>
    </div>
  );

  // Main Render
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <Link
          to="/"
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">
          Expert Registration
        </h1>
      </div>

      {!showPreview ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          {renderProgress()}

          {currentStep === 1 && renderBasicInfoStep()}
          {currentStep === 2 && renderExpertiseStep()}
          {currentStep === 3 && renderServicesStep()}
          {currentStep === 4 && renderAvailabilityStep()}
          {currentStep === 5 && renderContactStep()}

          <div className="flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex items-center px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <FaArrowLeft className="mr-2" /> Previous
              </button>
            )}
            {currentStep < 5 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Next Step
              </button>
            )}
            {currentStep === 5 && (
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Preview & Submit
              </button>
            )}
          </div>
        </form>
      ) : (
        renderPreview()
      )}
    </div>
  );
};

export default ExpertRegistrationPage;
