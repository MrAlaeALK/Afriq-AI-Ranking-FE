const ColorLegend = ({ colorScale }) => {
  let gradient = '';

  switch (colorScale) {
    case 'green-red':
      gradient = 'linear-gradient(to right, red, yellow, green)';
      break;
    case 'blue-red':
      gradient = 'linear-gradient(to right, red, purple, blue)';
      break;
    case 'purple-yellow':
      gradient = 'linear-gradient(to right, yellow, pink, purple)';
      break;
    default:
      gradient = 'linear-gradient(to right, red, yellow, green)';
  }

  return (
    <div style={{ width: '100%', marginTop: '20px' }}>
      <div
        style={{
          width: '100%',
          height: '30px',
          background: gradient,
          borderRadius: '5px',
          position: 'relative',
        }}
      >
        {[0, 20, 40, 60, 80, 100].map((val, idx) => (
          <div
            key={idx}
            className="absolute -top-4 transform -translate-x-1/2 text-xs font-bold text-gray-800 dark:text-gray-300"
            style={{
              left: `${val}%`,
            }}
          >
            {val}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ColorLegend;
