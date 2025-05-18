import Select from 'react-select';
import {useContext} from 'react';
import { CountriesRankingContext } from '../../context/CountriesRankingContext';

const CountrySelect = ({onSelectCountry}) => {

  const {countriesRanking} = useContext(CountriesRankingContext)

  function fetchingcountriesRankingNames() {
    const countriesRankingNames = countriesRanking.map(country => ({
      value: country.countryName,
      label: country.countryName
    }))
    return countriesRankingNames.sort((a, b) => a.label.localeCompare(b.label))
  }

  const handleChange = (selectedOption) => {
    onSelectCountry(selectedOption ? selectedOption.value : '');
  };

  return (
    <div style={{ minWidth: '250px' }}>
      <Select
        options={fetchingcountriesRankingNames()}
        onChange={handleChange}
        isClearable
        placeholder="Sélectionner un pays..."
        styles={{
          control: (base) => ({
            ...base,
            fontSize: '14px',
            borderRadius: '4px',
          }),
        }}
      />
    </div>
  );
};

export default CountrySelect;
