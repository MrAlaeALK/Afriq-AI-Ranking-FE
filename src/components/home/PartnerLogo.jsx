const PartnerLogo = ({ name, longName }) => {
  return (
    <div className="text-center">
      <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto flex items-center justify-center mb-3 transition-colors duration-300">
        <span className="text-gray-500 dark:text-gray-300 font-semibold">
          {name}
        </span>
      </div>
      <p className="font-medium text-gray-800 dark:text-gray-100 transition-colors duration-300">
        {longName}
      </p>
    </div>
  );
};

export default PartnerLogo;
