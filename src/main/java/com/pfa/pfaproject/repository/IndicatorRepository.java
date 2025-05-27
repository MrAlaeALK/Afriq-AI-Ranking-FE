package com.pfa.pfaproject.repository;

import com.pfa.pfaproject.model.Indicator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IndicatorRepository extends JpaRepository<Indicator, Long> {
    public Indicator findByName(String name);
}

