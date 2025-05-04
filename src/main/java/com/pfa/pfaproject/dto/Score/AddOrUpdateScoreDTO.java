package com.pfa.pfaproject.dto.Score;

public record AddOrUpdateScoreDTO(
        Long countryId,
        Long indicatorId,
        int year,
        double score
) {
}
