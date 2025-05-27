import { useRef } from 'react';
import { Legend, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import { getColor } from './Data';

export default function RadarChartDisplay({ chartData, countryData }) {
  // Référence pour le conteneur entier (incluant le titre et le logo)
  const containerRef = useRef(null);

  // Télécharger le graphique complet en PNG
  const downloadChart = () => {
    if (typeof window !== 'undefined') {
      // Dynamiquement importer html2canvas
      import('html2canvas').then(html2canvas => {
        if (!containerRef.current) return;

        const options = {
          backgroundColor: '#fff',
          scale: 2,
          logging: false,
          useCORS: true
        };

        html2canvas.default(containerRef.current, options).then(canvas => {
          const link = document.createElement('a');
          let filename = 'comparaison';
          countryData.forEach(c => {
            filename += `-${c.countryName.toLowerCase()}`;
          });

          link.download = `${filename}.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }).catch(err => {
          console.error("Erreur html2canvas:", err);
          alert("Une erreur est survenue lors du téléchargement. Veuillez réessayer.");
        });
      }).catch(err => {
        console.error("Erreur d'importation html2canvas:", err);
        alert("Une erreur est survenue. La bibliothèque de capture d'écran n'a pas pu être chargée.");
      });
    }
  };

//this is just an ai generated solution to make flags appear in the legend through building a custom legend
// but the problem is that those flags are not exported in the downloaded image since they are svg so it simply overcomplicates things
// i would say that the name and color are enough but i will leave this code if you want flags
// const CustomLegend = ({ payload }) => {
//   return (
//     <ul className="flex flex-wrap justify-center gap-4 list-none p-0 m-0">
//       {payload.map((entry, index) => {
//         const [flag, ...nameParts] = entry.value.split(" ");
//         const name = nameParts.join(" ");
//         const country = countryData.find(c => c.countryName === name);

//         return (
//           <li key={index} className="flex items-center space-x-2">
//             {/* Color square like Recharts default */}
//             <div
//               className="w-3 h-3 rounded-sm"
//               style={{ backgroundColor: entry.color }}
//             ></div>

//             {/* Flag image */}
//             <img
//               src={`/public/flags/${country.countryCode}.svg`} // assume public/flags folder
//               alt={country.countryName}
//               className="w-5 h-3 object-cover"
//             />

//             {/* Country name */}
//             <span className="text-sm text-gray-800" style={{ color: entry.color }}>{country.countryName}</span>
//           </li>
//         );
//       })}
//     </ul>
//   );
// };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8" >
      <div className="flex justify-end mb-4">

        <button
          onClick={downloadChart}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Télécharger PNG
        </button>
      </div>
      <div ref={containerRef}>
        <h2 className="text-xl font-semibold mb-4">Score par Indicateur</h2>
        <img src="/images/afriq_ai_logo.jpeg" alt="Logo Afriq'AI" className="h-10 w-auto mb-4" />

        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
              <PolarGrid stroke="#ddd" strokeDasharray="4 4" />
              <PolarAngleAxis
                dataKey="indicator"
                tick={{ fill: "#333", fontSize: 13, fontWeight: 'bold' }}
              />
              <PolarRadiusAxis
                domain={[0, 100]}
                tick={{ fill: "#666", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#f9f9f9", borderRadius: 10 }}
              />
              <Legend
                layout="horizontal"
                verticalAlign="top"
                align="center"
                wrapperStyle={{ fontSize: 13 }}
                // content={<CustomLegend/>}
              />
              {countryData.map((country, index) => (
                <Radar
                  key={country.countryId}
                  name={`${country.countryName}`}
                  dataKey={`${country.countryName}`}
                  stroke={getColor(index)}
                  strokeWidth={2}
                  fill={getColor(index)}
                  fillOpacity={0.4}
                  dot={{ r: 2 }}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}