package com.pfa.pfaproject.repository;

import com.pfa.pfaproject.model.Country;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CountryRepository extends JpaRepository<Country, Long> {
    public Country findByName(String name);
}

