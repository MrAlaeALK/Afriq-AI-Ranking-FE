import Select from 'react-select';
import {useContext} from 'react';
import { CountriesRankingContext } from '../../context/CountriesRankingContext';
import { useTranslation } from 'react-i18next';

const CountrySelect = ({onSelectCountry}) => {

  const {countriesRanking} = useContext(CountriesRankingContext)
  const {t} = useTranslation();

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
        placeholder={t('selectCountry')}
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
