package com.pfa.pfaproject.repository;

import com.pfa.pfaproject.model.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
    public Score findByCountry_IdAndIndicator_IdAndYear(Long countryId, Long indicatorId, int year);
    public Score findByYear(int year);
}


