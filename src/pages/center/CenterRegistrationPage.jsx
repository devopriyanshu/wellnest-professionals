import React, { useState, useEffect } from "react";
import {
  FaCamera,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaGlobe,
  FaEnvelope,
  FaClock,
  FaDollarSign,
  FaCalendarAlt,
  FaUsers,
  FaDumbbell,
  FaInfoCircle,
  FaUpload,
  FaPlus,
  FaMinus,
  FaTrash,
  FaArrowLeft,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { registerCenter } from "../../services/centerService";
import { useAuth } from "../../context/AuthContext";

const WellnessCenterRegistration = () => {
  const navigate = useNavigate();
  // We don't need useAuth from context here because ProtectedRoute handles it, 
  // but we can assume they are logged in.
  
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const [basicData, setBasicData] = useState({
    name: "",
    category: "",
    description: "",
    address: "",
    longitude: "",
    latitude: "",
    phone: "",
    email: "",
    website: "",
  });
  const [images, setImages] = useState([]);
  const [centerImage, setCenterImage] = useState(null);

  const [amenities, setAmenities] = useState([{ value: "" }]);
  const [equipment, setEquipment] = useState([{ value: "" }]);
  const [services, setServices] = useState([
    {
      name: "",
      icon: "💪",
      description: "",
    },
    {
      name: "",
      icon: "🧘",
      description: "",
    },
  ]);
  const [trainers, setTrainers] = useState([
    {
      name: "",
      specialty: "",
      bio: "",
      image: null,
    },
  ]);
  const [pricingData, setPricingData] = useState({
    monthly: "",
    annual: "",
    dayPass: "",
    classPackages: "",
    personalTraining: "",
  });
  const [offers, setOffers] = useState("");
  const [schedule, setSchedule] = useState([
    { day: "Monday", isOpen: false, openingTime: "", closingTime: "" },
    { day: "Tuesday", isOpen: false, openingTime: "", closingTime: "" },
    { day: "Wednesday", isOpen: false, openingTime: "", closingTime: "" },
    { day: "Thursday", isOpen: false, openingTime: "", closingTime: "" },
    { day: "Friday", isOpen: false, openingTime: "", closingTime: "" },
    { day: "Saturday", isOpen: false, openingTime: "", closingTime: "" },
    { day: "Sunday", isOpen: false, openingTime: "", closingTime: "" },
  ]);

  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (e, setState) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  // Helper functions for array with objects
  const handleObjectArrayChange = (index, field, value, setState) => {
    setState((prevState) => {
      const newState = [...prevState];
      newState[index] = { ...newState[index], [field]: value };
      return newState;
    });
  };

  const addObjectArrayItem = (setState, defaultItem) => {
    setState((prevState) => [...prevState, { ...defaultItem }]);
  };

  const removeObjectArrayItem = (index, setState) => {
    setState((prevState) => prevState.filter((_, i) => i !== index));
  };
  const handleCenterImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCenterImage({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      });
    }
  };

  // Available emojis for services
  const availableIcons = [
    "💪",
    "🧘",
    "🔥",
    "🧠",
    "🏋️",
    "🥗",
    "👯",
    "🔄",
    "🏃",
    "🧗",
    "⚽",
    "🏊",
    "🧁",
    "☕",
    "🍵",
    "🌿",
  ];

  // Handle file uploads for images
  const handleImageUpload = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter((file) => {
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        const maxSize = 5 * 1024 * 1024; // 5MB
        return validTypes.includes(file.type) && file.size <= maxSize;
      });

      if (validFiles.length === 0) {
        alert("Please upload valid image files (JPEG, PNG, GIF) under 5MB.");
        return;
      }

      const newImages = validFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      }));

      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  // Handle trainer image upload
  const handleTrainerImageUpload = (e, index) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newTrainers = [...trainers];
      newTrainers[index] = {
        ...newTrainers[index],
        image: {
          file,
          preview: URL.createObjectURL(file),
          name: file.name,
        },
      };

      setTrainers(newTrainers);
    }
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append basicData fields
    Object.entries(basicData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append main image
    if (centerImage?.file) {
      formData.append("centerImage", centerImage.file);
    }

    // Append gallery images
    images.forEach((img) => {
      formData.append("images", img.file);
    });

    // Transform amenities & equipment - extract values from objects to simple arrays
    const amenitiesArray = amenities
      .map((a) => a.value)
      .filter((v) => v.trim() !== "");
    const equipmentArray = equipment
      .map((e) => e.value)
      .filter((v) => v.trim() !== "");

    formData.append("amenities", JSON.stringify(amenitiesArray));
    formData.append("equipment", JSON.stringify(equipmentArray));

    // Transform services - extract just the service names to simple array
    const servicesArray = services
      .map((s) => s.name)
      .filter((v) => v.trim() !== "");

    formData.append("services", JSON.stringify(servicesArray));

    // Transform trainers - rename 'specialty' to 'specialization'
    const trainersArray = trainers.map((trainer) => ({
      name: trainer.name,
      specialization: trainer.specialty, // Rename field
      bio: trainer.bio,
    }));

    formData.append("trainers", JSON.stringify(trainersArray));

    // Transform pricing from object to array
    const pricingArray = Object.entries(pricingData)
      .filter(([key, value]) => value && value.trim() !== "")
      .map(([key, value]) => {
        // Remove $ sign if present
        const price = value.replace("$", "").trim();
        
        // Map key to plan name and duration
        const planMapping = {
          monthly: { planName: "Monthly", duration: "month" },
          annual: { planName: "Annual", duration: "year" },
          dayPass: { planName: "Day Pass", duration: "day" },
          classPackages: { planName: "Class Packages", duration: "package" },
          personalTraining: { planName: "Personal Training", duration: "session" },
        };

        const plan = planMapping[key] || { planName: key, duration: "session" };
        
        return {
          planName: plan.planName,
          price: price,
          duration: plan.duration,
        };
      });

    formData.append("pricing", JSON.stringify(pricingArray));

    // Append offers
    formData.append("offers", offers);

    // Transform schedule - convert times to DateTime format
    const scheduleArray = schedule.map((day) => ({
      day: day.day,
      isOpen: day.isOpen,
      openingTime: day.isOpen && day.openingTime
        ? new Date(`1970-01-01T${day.openingTime}:00Z`).toISOString()
        : null,
      closingTime: day.isOpen && day.closingTime
        ? new Date(`1970-01-01T${day.closingTime}:00Z`).toISOString()
        : null,
    }));

    formData.append("schedule", JSON.stringify(scheduleArray));

    try {
      const data = await registerCenter(formData);
      console.log("Registration response:", data);
      navigate('/center/pending');
    } catch (err) {
      console.error("Registration error:", err);
      alert("Error: " + (err || "Something went wrong!"));
    }
  };

  // Render basic information section
  const renderBasicInfoSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">Basic Information</h2>
      <p className="text-gray-600">
        Tell us about your wellness center and how customers can reach you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Center Name*
          </label>
          <input
            type="text"
            name="name"
            value={basicData.name}
            onChange={(e) => handleChange(e, setBasicData)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            placeholder="e.g., ZenFit Wellness Hub"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Category*
          </label>
          <select
            name="category"
            value={basicData.category}
            onChange={(e) => handleChange(e, setBasicData)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            required
          >
            <option value="">Select a category</option>
            <option value="Gym & Yoga Center">Gym & Yoga Center</option>
            <option value="Yoga Studio">Yoga Studio</option>
            <option value="Fitness Center">Fitness Center</option>
            <option value="Meditation Center">Meditation Center</option>
            <option value="Wellness Spa">Wellness Spa</option>
            <option value="Health Club">Health Club</option>
            <option value="CrossFit Box">CrossFit Box</option>
            <option value="Pilates Studio">Pilates Studio</option>
            <option value="Holistic Wellness Center">
              Holistic Wellness Center
            </option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Center Image*
          </label>
          <div className="flex items-start space-x-4">
            {centerImage?.preview ? (
              <img
                src={centerImage.preview}
                alt="Main Preview"
                className="w-32 h-32 rounded-lg object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-32 h-32 rounded-lg bg-gray-200 flex items-center justify-center border-2 border-gray-300">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleCenterImageUpload}
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">
            Description*
          </label>
          <textarea
            name="description"
            value={basicData.description}
            onChange={(e) => handleChange(e, setBasicData)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 h-32"
            placeholder="Tell potential customers about your center's philosophy, mission, and what makes you unique..."
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">
            Address*
          </label>

          {/* Address parts */}
          <div className="flex flex-col space-y-2 mb-2">
            <input
              type="text"
              placeholder="Street"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
              required
              onChange={(e) =>
                setBasicData({
                  ...basicData,
                  address: `${e.target.value}, ${basicData.city || ""}, ${
                    basicData.state || ""
                  }, ${basicData.zip || ""}`,
                })
              }
            />
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="City"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                required
                onChange={(e) =>
                  setBasicData({
                    ...basicData,
                    address: `${basicData.address.split(",")[0] || ""}, ${
                      e.target.value
                    }, ${basicData.state || ""}, ${basicData.zip || ""}`,
                    city: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="State"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                required
                onChange={(e) =>
                  setBasicData({
                    ...basicData,
                    address: `${basicData.address.split(",")[0] || ""}, ${
                      basicData.city || ""
                    }, ${e.target.value}, ${basicData.zip || ""}`,
                    state: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="ZIP"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                required
                onChange={(e) =>
                  setBasicData({
                    ...basicData,
                    address: `${basicData.address.split(",")[0] || ""}, ${
                      basicData.city || ""
                    }, ${basicData.state || ""}, ${e.target.value}`,
                    zip: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* Latitude & Longitude */}
          <div className="flex space-x-2 mb-2">
            <input
              type="number"
              placeholder="Latitude"
              value={basicData.latitude || ""}
              onChange={(e) =>
                setBasicData({ ...basicData, latitude: e.target.value })
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
              step="any"
              required
            />
            <input
              type="number"
              placeholder="Longitude"
              value={basicData.longitude || ""}
              onChange={(e) =>
                setBasicData({ ...basicData, longitude: e.target.value })
              }
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
              step="any"
              required
            />
            <button
              type="button"
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setBasicData({
                        ...basicData,
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                      });
                    },
                    (error) => {
                      console.error("Error fetching location:", error);
                      alert("Could not fetch location. Please enter manually.");
                    }
                  );
                } else {
                  alert("Geolocation is not supported by your browser.");
                }
              }}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Use Current Location
            </button>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Phone Number*
          </label>
          <div className="flex items-center">
            <FaPhoneAlt className="text-green-500 mr-2" />
            <input
              type="tel"
              name="phone"
              value={basicData.phone}
              onChange={(e) => handleChange(e, setBasicData)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
              placeholder="+1 (123) 456-7890"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Email Address*
          </label>
          <div className="flex items-center">
            <FaEnvelope className="text-red-500 mr-2" />
            <input
              type="email"
              name="email"
              value={basicData.email}
              onChange={(e) => handleChange(e, setBasicData)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
              placeholder="info@yourwellnesscenter.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Website
          </label>
          <div className="flex items-center">
            <FaGlobe className="text-purple-500 mr-2" />
            <input
              type="url"
              name="website"
              value={basicData.website}
              onChange={(e) => handleChange(e, setBasicData)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
              placeholder="www.yourwellnesscenter.com"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Render image upload section
  const renderImagesSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">Photo Gallery</h2>
      <p className="text-gray-600">
        Add photos of your wellness center to showcase your facilities. We
        recommend adding at least 4 high-quality images.
      </p>

      <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
        <FaCamera className="mx-auto text-4xl text-gray-400 mb-3" />
        <p className="mb-3 text-gray-600">
          Drag and drop your images here or click to browse
        </p>
        <input
          type="file"
          id="image-upload"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <label
          htmlFor="image-upload"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-block"
        >
          <FaUpload className="inline mr-2" /> Upload Images
        </label>
      </div>

      {images.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Uploaded Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative bg-white border border-gray-200 rounded-lg overflow-hidden group"
              >
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <div className="p-2 bg-white border-t border-gray-200">
                  <p className="text-xs text-gray-600 truncate">{image.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // Render amenities and equipment section
  const renderAmenitiesEquipmentSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">
        Amenities & Equipment
      </h2>
      <p className="text-gray-600">
        List the amenities and equipment available at your wellness center.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Amenities Section */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-blue-700">Amenities</h3>
          <p className="text-sm text-gray-600 mb-4">
            E.g., Towel Service, Locker Rooms, Showers, etc.
          </p>

          {amenities.map((amenity, index) => (
            <div key={index} className="flex items-center mb-3">
              <div className="h-2 w-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
              <input
                type="text"
                value={amenity.value}
                onChange={(e) =>
                  handleArrayChange(
                    index,
                    e.target.value,
                    setAmenities,
                    amenities
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                placeholder={`Amenity ${index + 1}`}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    removeArrayField(index, setAmenities, amenities)
                  }
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <FaMinus />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => addArrayField(setAmenities, amenities)}
            className="flex items-center text-blue-600 font-medium hover:text-blue-800 mt-2"
          >
            <FaPlus className="mr-1" /> Add Amenity
          </button>
        </div>

        {/* Equipment Section */}
        <div>
          <h3 className="text-lg font-medium mb-3 text-blue-700">Equipment</h3>
          <p className="text-sm text-gray-600 mb-4">
            E.g., Treadmills, Free Weights, Yoga Mats, etc.
          </p>

          {equipment.map((equipmentItem, index) => (
            <div key={index} className="flex items-center mb-3">
              <div className="h-2 w-2 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
              <input
                type="text"
                value={equipmentItem.value}
                onChange={(e) =>
                  handleArrayChange(
                    index,
                    e.target.value,
                    setEquipment,
                    equipment
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                placeholder={`Equipment ${index + 1}`}
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    removeArrayField(index, setEquipment, equipment)
                  }
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <FaMinus />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => addArrayField(setEquipment, equipment)}
            className="flex items-center text-blue-600 font-medium hover:text-blue-800 mt-2"
          >
            <FaPlus className="mr-1" /> Add Equipment
          </button>
        </div>
      </div>
    </div>
  );

  // Render services section
  const renderServicesSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">Services</h2>
      <p className="text-gray-600">
        Add the services that your wellness center offers to customers.
      </p>

      {services.map((service, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-blue-700">
              Service {index + 1}
            </h3>
            {index > 1 && (
              <button
                type="button"
                onClick={() => removeObjectArrayItem(index, setServices)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Service Name*
              </label>
              <input
                type="text"
                value={service.name}
                onChange={(e) =>
                  handleObjectArrayChange(
                    index,
                    "name",
                    e.target.value,
                    setServices
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                placeholder="e.g., Personal Training"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Icon
              </label>
              <div className="relative">
                <select
                  value={service.icon}
                  onChange={(e) =>
                    handleObjectArrayChange(
                      index,
                      "icon",
                      e.target.value,
                      setServices
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                >
                  {availableIcons.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon} -{" "}
                      {icon === "💪"
                        ? "Strength"
                        : icon === "🧘"
                        ? "Yoga"
                        : icon === "🔥"
                        ? "Heat"
                        : icon === "🧠"
                        ? "Mind"
                        : icon === "🏋️"
                        ? "Weight"
                        : icon === "🥗"
                        ? "Nutrition"
                        : icon === "👯"
                        ? "Group"
                        : icon === "🔄"
                        ? "Recovery"
                        : icon === "🏃"
                        ? "Running"
                        : icon === "🧗"
                        ? "Climbing"
                        : icon === "⚽"
                        ? "Sports"
                        : icon === "🏊"
                        ? "Swimming"
                        : icon === "🧁"
                        ? "Bakery"
                        : icon === "☕"
                        ? "Coffee"
                        : icon === "🍵"
                        ? "Tea"
                        : icon === "🌿"
                        ? "Herbal"
                        : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-gray-700 font-medium mb-2">
                Description*
              </label>
              <textarea
                value={service.description}
                onChange={(e) =>
                  handleObjectArrayChange(
                    index,
                    "description",
                    e.target.value,
                    setServices
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                placeholder="Describe what this service includes..."
                rows={2}
                required
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          addObjectArrayItem(setServices, {
            name: "",
            icon: "💪",
            description: "",
          })
        }
        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <FaPlus className="mr-2" /> Add Service
      </button>
    </div>
  );

  // Render trainers section
  const renderTrainersSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">Trainers & Staff</h2>
      <p className="text-gray-600">
        Introduce your trainers and their expertise.
      </p>

      {trainers.map((trainer, index) => (
        <div
          key={index}
          className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 mb-4"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-blue-700">
              Trainer {index + 1}
            </h3>
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeObjectArrayItem(index, setTrainers)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Name*
                  </label>
                  <input
                    type="text"
                    value={trainer.name}
                    onChange={(e) =>
                      handleObjectArrayChange(
                        index,
                        "name",
                        e.target.value,
                        setTrainers
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Trainer's full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Specialty*
                  </label>
                  <input
                    type="text"
                    value={trainer.specialty}
                    onChange={(e) =>
                      handleObjectArrayChange(
                        index,
                        "specialty",
                        e.target.value,
                        setTrainers
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                    placeholder="e.g., Yoga & Meditation"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Bio*
                  </label>
                  <textarea
                    value={trainer.bio}
                    onChange={(e) =>
                      handleObjectArrayChange(
                        index,
                        "bio",
                        e.target.value,
                        setTrainers
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
                    placeholder="Brief description of trainer's experience and qualifications"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Profile Photo
              </label>
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                {trainer.image ? (
                  <div className="relative h-40">
                    <img
                      src={trainer.image.preview}
                      alt={`Trainer ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleObjectArrayChange(
                          index,
                          "image",
                          null,
                          setTrainers
                        )
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <input
                      type="file"
                      id={`trainer-image-${index}`}
                      accept="image/*"
                      onChange={(e) => handleTrainerImageUpload(e, index)}
                      className="hidden"
                    />
                    <label
                      htmlFor={`trainer-image-${index}`}
                      className="cursor-pointer"
                    >
                      <FaCamera className="mx-auto text-3xl text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload photo
                      </p>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          addObjectArrayItem(setTrainers, {
            name: "",
            specialty: "",
            bio: "",
            image: null,
          })
        }
        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <FaPlus className="mr-2" /> Add Trainer
      </button>
    </div>
  );

  // Render pricing section
  const renderPricingSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">Pricing & Offers</h2>
      <p className="text-gray-600">
        Set your membership pricing and any special offers.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-gray-700 font-medium mb-3">
            Monthly Membership*
          </label>
          <div className="flex items-center">
            <FaDollarSign className="text-green-500 mr-1" />
            <input
              type="text"
              name="monthly"
              value={pricingData.monthly}
              onChange={(e) => handleChange(e, setPricingData)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
              placeholder="e.g., 99.99"
              required
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-gray-700 font-medium mb-3">
            Annual Membership*
          </label>
          <div className="flex items-center">
            <FaDollarSign className="text-green-500 mr-1" />
            <input
              type="text"
              name="annual"
              value={pricingData.annual}
              onChange={(e) => handleChange(e, setPricingData)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
              placeholder="e.g., 999.99"
              required
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-gray-700 font-medium mb-3">
            Day Pass*
          </label>
          <div className="flex items-center">
            <FaDollarSign className="text-green-500 mr-1" />
            <input
              type="text"
              name="dayPass"
              value={pricingData.dayPass}
              onChange={(e) => handleChange(e, setPricingData)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
              placeholder="e.g., 19.99"
              required
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-gray-700 font-medium mb-3">
            Class Packages*
          </label>
          <div className="flex items-center">
            <FaDollarSign className="text-green-500 mr-1" />
            <input
              type="text"
              name="classPackages"
              value={pricingData.classPackages}
              onChange={(e) => handleChange(e, setPricingData)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
              placeholder="e.g., 199.99"
              required
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-gray-700 font-medium mb-3">
            Personal Training*
          </label>
          <div className="flex items-center">
            <FaDollarSign className="text-green-500 mr-1" />
            <input
              type="text"
              name="personalTraining"
              value={pricingData.personalTraining}
              onChange={(e) => handleChange(e, setPricingData)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
              placeholder="e.g., 49.99"
              required
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-gray-700 font-medium mb-3">
            Special Offers
          </label>
          <textarea
            value={offers}
            onChange={(e) => setOffers(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            placeholder="Describe any special offers or discounts..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  // Toggle day open/closed status
  const toggleDay = (index, isOpen) => {
    setSchedule((prev) => {
      const newSchedule = [...prev];
      newSchedule[index] = {
        ...newSchedule[index],
        isOpen,
        // Reset times when closing the day
        openingTime: isOpen ? newSchedule[index].openingTime : "",
        closingTime: isOpen ? newSchedule[index].closingTime : "",
      };
      return newSchedule;
    });
  };

  // Update time for a specific day and field
  const updateTime = (index, field, value) => {
    setSchedule((prev) => {
      const newSchedule = [...prev];
      newSchedule[index] = {
        ...newSchedule[index],
        [field]: value,
      };
      return newSchedule;
    });
  };

  // Render schedule section
  const renderScheduleSection = () => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-xl font-semibold text-blue-700 mb-4">
        Weekly Schedule
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Select the days your center is open and set the operating hours for each
        day.
      </p>

      {schedule.map((daySchedule, index) => (
        <div
          key={daySchedule.day}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b pb-4 last:border-b-0"
        >
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={daySchedule.isOpen}
              onChange={(e) => toggleDay(index, e.target.checked)}
              id={`day-${daySchedule.day}`}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label
              htmlFor={`day-${daySchedule.day}`}
              className="font-medium w-24 cursor-pointer"
            >
              {daySchedule.day}
            </label>
          </div>

          {daySchedule.isOpen ? (
            <div className="flex gap-4 flex-wrap md:flex-nowrap">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">
                  Opening Time
                </label>
                <input
                  type="time"
                  value={daySchedule.openingTime}
                  onChange={(e) =>
                    updateTime(index, "openingTime", e.target.value)
                  }
                  className="border rounded px-3 py-2 w-full"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">
                  Closing Time
                </label>
                <input
                  type="time"
                  value={daySchedule.closingTime}
                  onChange={(e) =>
                    updateTime(index, "closingTime", e.target.value)
                  }
                  className="border rounded px-3 py-2 w-full"
                  required
                  min={daySchedule.openingTime}
                />
              </div>
            </div>
          ) : (
            <span className="text-gray-400 text-sm">Closed</span>
          )}
        </div>
      ))}
    </div>
  );

  // // Render review and submit section
  const renderReviewSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-700">Review & Submit</h2>
      <p className="text-gray-600">
        Review your information before submitting.
      </p>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">
          Basic Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Center Name
            </label>
            <p className="text-gray-600">{basicData.name}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category
            </label>
            <p className="text-gray-600">{basicData.category}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <p className="text-gray-600 whitespace-pre-line">
              {basicData.description}
            </p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Address
            </label>
            <p className="text-gray-600">{basicData.address}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phone Number
            </label>
            <p className="text-gray-600">{basicData.phone}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <p className="text-gray-600">{basicData.email}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Website
            </label>
            <p className="text-gray-600">{basicData.website}</p>
          </div>
        </div>
      </div>

      {/* Gallery section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Gallery</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image.preview || URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Amenities & Equipment */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">
          Amenities & Equipment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-blue-700 mb-2">
              Amenities
            </h4>
            <ul className="list-disc list-inside text-gray-600">
              {amenities.map((amenity, index) => (
                <li key={index}>{amenity.value}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-medium text-blue-700 mb-2">
              Equipment
            </h4>
            <ul className="list-disc list-inside text-gray-600">
              {equipment.map((equipment, index) => (
                <li key={index}>{equipment.value}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Services</h3>
        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-blue-700 mb-2">
                {service.name}
              </h4>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Trainers */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Trainers</h3>
        <div className="space-y-4">
          {trainers.map((trainer, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-lg font-medium text-blue-700 mb-2">
                {trainer.name}
              </h4>
              <p className="text-gray-600">{trainer.specialty}</p>
              <p className="text-gray-600 whitespace-pre-line">{trainer.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Monthly Membership
            </label>
            <p className="text-gray-600">${pricingData.monthly}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Annual Membership
            </label>
            <p className="text-gray-600">${pricingData.annual}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Day Pass
            </label>
            <p className="text-gray-600">${pricingData.dayPass}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Class Packages
            </label>
            <p className="text-gray-600">${pricingData.classPackages}</p>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Personal Training
            </label>
            <p className="text-gray-600">${pricingData.personalTraining}</p>
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">
          Schedule Preview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-medium text-blue-700 mb-2">
              Operating Hours
            </h4>
            <div className="space-y-3">
              {schedule.map((day) => (
                <div
                  key={day.day}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-600 font-medium w-24">
                    {day.day}
                  </span>
                  {day.isOpen ? (
                    <span className="text-gray-600">
                      {day.openingTime || "Not set"} -{" "}
                      {day.closingTime || "Not set"}
                    </span>
                  ) : (
                    <span className="text-gray-400">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
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

  // Render navigation and progress bar
  const renderNavigation = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {[1, 2, 3, 4, 5, 6, 7].map((step) => (
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
              {step === 2 && "Gallery"}
              {step === 3 && "Amenities & Equipment"}
              {step === 4 && "Services"}
              {step === 5 && "Trainers"}
              {step === 6 && "Pricing"}
              {step === 7 && "Schedule"}
              {/* {step === 8 && "Review & Submit"} */}
            </div>
          </div>
        ))}
      </div>
      <div className="flex mt-2">
        {[1, 2, 3, 4, 5, 6].map((step) => (
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

  // Main render
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mt-4">
          Center Registration
        </h1>
      </div>

      {!showPreview ? (
        <form onSubmit={handleSubmit} className="space-y-8">
          {renderNavigation()}

          {currentStep === 1 && renderBasicInfoSection()}
          {currentStep === 2 && renderImagesSection()}
          {currentStep === 3 && renderAmenitiesEquipmentSection()}
          {currentStep === 4 && renderServicesSection()}
          {currentStep === 5 && renderTrainersSection()}
          {currentStep === 6 && renderPricingSection()}
          {currentStep === 7 && renderScheduleSection()}
          {/* {currentStep === 8 && renderReviewSection()} */}

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
            {currentStep < 7 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Next Step
              </button>
            )}
            {currentStep === 7 && (
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
        renderReviewSection()
      )}
    </div>
  );
};

export default WellnessCenterRegistration;
