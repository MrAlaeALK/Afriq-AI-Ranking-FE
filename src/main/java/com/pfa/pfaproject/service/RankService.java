package com.pfa.pfaproject.service;


import com.pfa.pfaproject.exception.CustomException;
import com.pfa.pfaproject.model.Rank;
import com.pfa.pfaproject.repository.RankRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class RankService {
    private final RankRepository rankRepository;

    public RankService(RankRepository rankRepository) {
        this.rankRepository = rankRepository;
    }

    public List<Rank> findAll(){
        return rankRepository.findAll();
    }

    public Rank findById(Long id){
        return rankRepository.findById(id)
                .orElseThrow(() -> new CustomException("rank not found", HttpStatus.NOT_FOUND));
    }

    public Rank save(Rank rank){
        return rankRepository.save(rank);
    }

    public void delete(long id){
        rankRepository.deleteById(id);
    }

    public List<Rank> findByYearOrderByFinalScoreDesc(int year){
        return rankRepository.findAllByYearOrderByFinalScoreDesc(year);
    }

    public Rank findByCountryIdAndYear(Long countryId, int year){
        return rankRepository.findByCountry_IdAndYear(countryId,year);
    }
}

