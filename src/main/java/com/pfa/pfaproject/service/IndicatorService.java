package com.pfa.pfaproject.service;

import com.pfa.pfaproject.exception.CustomException;
import com.pfa.pfaproject.model.Indicator;
import com.pfa.pfaproject.repository.IndicatorRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class IndicatorService {
    private final IndicatorRepository indicatorRepository;


    public List<Indicator> findAll(){
        return indicatorRepository.findAll();
    }

    public Indicator findById(Long id){
        return indicatorRepository.findById(id)
                .orElseThrow(() -> new CustomException("Indicator not found", HttpStatus.NOT_FOUND));
    }

    public Indicator save(Indicator indicator){
        return indicatorRepository.save(indicator);
    }

    public void delete(Long id){
        indicatorRepository.deleteById(id);
    }

    public Indicator findByName(String name){
        return indicatorRepository.findByName(name);
    }
}

