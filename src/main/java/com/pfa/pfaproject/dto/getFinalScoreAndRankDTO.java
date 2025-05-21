package com.pfa.pfaproject.dto;

public record getFinalScoreAndRankDTO(
        Long countryId,
        String countryName,
        String countryCode,
        double finalScore,
        int rank
) {
}
