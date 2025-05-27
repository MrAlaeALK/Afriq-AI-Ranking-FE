package com.pfa.pfaproject.service;


import com.pfa.pfaproject.exception.CustomException;
import com.pfa.pfaproject.model.Score;
import com.pfa.pfaproject.repository.ScoreRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ScoreService {
    private final ScoreRepository scoreRepository;

    public ScoreService(ScoreRepository scoreRepository) {
        this.scoreRepository = scoreRepository;
    }

    public List<Score> findAll(){
        return scoreRepository.findAll();
    }

    public Score findById(Long id){
        return scoreRepository.findById(id)
                .orElseThrow(() -> new CustomException("score not found", HttpStatus.NOT_FOUND));
    }

    public Score save(Score score){
        return scoreRepository.save(score);
    }

    public void delete(Long id){
        scoreRepository.deleteById(id);
    }

    public Score findByCountry_IdAndIndicator_IdAndYear(Long countryId, Long indicatorId, int year){
        return scoreRepository.findByCountry_IdAndIndicator_IdAndYear(countryId, indicatorId, year);
    }

    public Score findByYear(int year){
        return scoreRepository.findByYear(year);
    }
}

