const TestimonialCard = ({ avatar, name, title, quote, bgColor }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center mb-4">
        <div className={`w-12 h-12 ${bgColor} rounded-full mr-4`}></div>
        <div>
          <h5 className="font-semibold text-gray-900 dark:text-white transition-colors duration-300">{name}</h5>
          <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{title}</p>
        </div>
      </div>
      <p className="text-gray-600 dark:text-gray-300 italic transition-colors duration-300">{quote}</p>
    </div>
  );
};
export default TestimonialCard;
