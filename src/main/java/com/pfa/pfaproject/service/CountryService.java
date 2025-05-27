package com.pfa.pfaproject.service;


import com.pfa.pfaproject.exception.CustomException;
import com.pfa.pfaproject.model.Country;
import com.pfa.pfaproject.repository.CountryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class CountryService {
    private final CountryRepository countryRepository;

    public CountryService(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    public List<Country> findAll() {
        return countryRepository.findAll();
    }

    public Country findById(Long id) {
        return countryRepository.findById(id)
                .orElseThrow(() -> new CustomException("Country not found", HttpStatus.NOT_FOUND));
    }

    public Country save(Country country) {
        return countryRepository.save(country);
    }
    public void delete(Long id) {
        countryRepository.deleteById(id);
    }

    public Country findByName(String name) {
        return countryRepository.findByName(name);
    }
}

