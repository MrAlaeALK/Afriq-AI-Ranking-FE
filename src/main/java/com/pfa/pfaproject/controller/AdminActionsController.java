package com.pfa.pfaproject.controller;

import com.pfa.pfaproject.dto.Rank.GenerateFinalScoreForCountryDTO;
import com.pfa.pfaproject.dto.Rank.GenerateRankOrFinalScoreDTO;
import com.pfa.pfaproject.dto.Score.AddOrUpdateScoreDTO;
import com.pfa.pfaproject.model.Country;
import com.pfa.pfaproject.model.Indicator;
import com.pfa.pfaproject.model.Score;
import com.pfa.pfaproject.service.AdminBusinessService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/dashboard")
@AllArgsConstructor
public class AdminActionsController {
    private final AdminBusinessService adminBusinessService;

    @PostMapping("/addCountry")
    public ResponseEntity<?> addCoutry(@RequestBody Country country) {
        Country addedCountry = adminBusinessService.adminAddCountry(country);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseWrapper.success(addedCountry));
    }

    @PostMapping("/addIndicator")
    public ResponseEntity<?> addIndicator(@RequestBody Indicator indicator) {
        Indicator addedIndicator = adminBusinessService.adminAddIndicator(indicator);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseWrapper.success(addedIndicator));
    }

    @PostMapping("/addScore")
    public ResponseEntity<?> addScore(@RequestBody AddOrUpdateScoreDTO addOrUpdateScoreDTO) {
        Score score = adminBusinessService.adminAddScore(addOrUpdateScoreDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseWrapper.success(score));
    }

    @PutMapping("/updateScore")
    public ResponseEntity<?> updateScore(@RequestBody AddOrUpdateScoreDTO addOrUpdateScoreDTO) {
        Score score = adminBusinessService.adminUpdateScore(addOrUpdateScoreDTO);
        return ResponseEntity.status(HttpStatus.OK).body(ResponseWrapper.success(score));
    }

    @PostMapping("/generateFinalScoreForCountry")
    public ResponseEntity<?> generateFinalScoreForCountry(@RequestBody GenerateFinalScoreForCountryDTO generateFinalScoreForCountryDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ResponseWrapper.success(adminBusinessService.generateFinalScoreForCountry(generateFinalScoreForCountryDTO)));
    }

    @PostMapping("/generateFinalScore")
    public ResponseEntity<?> generateFinalScore(@RequestBody GenerateRankOrFinalScoreDTO generateRankOrFinalScoreDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(ResponseWrapper.success(adminBusinessService.generateFinalScore(generateRankOrFinalScoreDTO)));
    }

//    @PostMapping("/generateRank")
//    public ResponseEntity<?> generateRanking(@RequestBody GenerateRankOrFinalScoreDTO generateRankOrFinalScoreDTO) {
//        adminBusinessService.generateRanking(generateRankOrFinalScoreDTO);
//        return ResponseEntity.status(HttpStatus.OK).body(ResponseWrapper.success("Rank generated for year "+ generateRankOrFinalScoreDTO.year()));
//    }

    @PostMapping("/generateRank")
    public ResponseEntity<?> generateRanking(@RequestBody GenerateRankOrFinalScoreDTO generateRankOrFinalScoreDTO) {
        return ResponseEntity.status(HttpStatus.OK).body(ResponseWrapper.success(adminBusinessService.generateRanking(generateRankOrFinalScoreDTO)));
    }
}
