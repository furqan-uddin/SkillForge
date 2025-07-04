//src/pages/CareerForm.jsx
import { useState } from "react";

const CareerForm = () => {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const options = [
    "Web Development",
    "AI/ML",
    "Cybersecurity",
    "Cloud Computing",
    "Mobile App Development",
    "Blockchain",
    "UI/UX Design",
  ];

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Selected Interests:", selectedInterests);
    // Later: Save to backend or localStorage
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 dark:bg-gray-800 dark:text-white">
      <h2 className="text-3xl font-bold mb-6">Select Your Career Interests</h2>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col space-y-4 w-full max-w-md"
      >
        {options.map((interest) => (
          <label
            key={interest}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              value={interest}
              checked={selectedInterests.includes(interest)}
              onChange={() => toggleInterest(interest)}
              className="w-5 h-5"
            />
            <span>{interest}</span>
          </label>
        ))}
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          Save Interests
        </button>
      </form>
    </div>
  );
};

export default CareerForm;
