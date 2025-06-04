const CriterionCard = ({ icon, title, description, bgColor, textColor }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div className={`w-12 h-12 ${bgColor} ${textColor} rounded-full flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h4 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white transition-colors duration-300">
        {title}
      </h4>
      <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
        {description}
      </p>
    </div>
  );
};

export default CriterionCard;
