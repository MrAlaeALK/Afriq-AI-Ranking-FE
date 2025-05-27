package com.pfa.pfaproject.controller;

import com.pfa.pfaproject.model.Country;
import com.pfa.pfaproject.service.CountryService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/country")
@AllArgsConstructor
public class CountryController {
    private final CountryService countryService;

    @GetMapping("/allcountries")
    public ResponseEntity<?> getAllCountries() {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(countryService.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCountry(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(ResponseWrapper.success(countryService.findById(id)));
    }
}