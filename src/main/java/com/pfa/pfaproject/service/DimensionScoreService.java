package com.pfa.pfaproject.service;

import com.pfa.pfaproject.dto.Score.getScoresByYearDTO;
import com.pfa.pfaproject.model.DimensionScore;
import com.pfa.pfaproject.model.Score;
import com.pfa.pfaproject.repository.DimensionScoreRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class DimensionScoreService {
    private final DimensionScoreRepository dimensionScoreRepository;

    public DimensionScore save(DimensionScore dimensionScore) {
        return dimensionScoreRepository.save(dimensionScore);
    }

    public List<DimensionScore> findAll() {
        return dimensionScoreRepository.findAll();
    }

//    public List<DimensionScore> findByYear(int year) {
//        return dimensionScoreRepository.findByYear(year);
//    }

    public DimensionScore findByCountryIdAndDimensionIdAndYear(Long countryId, Long dimensionId, int year) {
        return dimensionScoreRepository.findByCountry_IdAndDimension_IdAndYear(countryId, dimensionId, year);
    }

    public List<getScoresByYearDTO> findByYear(int year){

        List<DimensionScore> scoreList= dimensionScoreRepository.findByYear(year);
        List<getScoresByYearDTO> responses= new ArrayList<>();
        for(DimensionScore score : scoreList){
            responses.add(new getScoresByYearDTO(score.getCountry().getName(), score.getDimension().getName(), score.getScore()));
        }
        return responses;
    }
}
