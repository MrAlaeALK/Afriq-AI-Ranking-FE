package com.pfa.pfaproject.controller;

import com.pfa.pfaproject.model.Indicator;
import com.pfa.pfaproject.service.IndicatorService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/indicator")
@AllArgsConstructor
public class IndicatorController {
    private final IndicatorService indicatorService;

    @GetMapping("/allindicators")
    public ResponseEntity<?> getAllIndicators() {
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(ResponseWrapper.success(indicatorService.findAll()));
    }

//    @PostMapping("/addIndicator")
//    public Indicator addIndicator(@RequestBody Indicator indicator) {
//        return indicatorService.save(indicator);
//    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getIndicator(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(ResponseWrapper.success(indicatorService.findById(id)));
    }
}
