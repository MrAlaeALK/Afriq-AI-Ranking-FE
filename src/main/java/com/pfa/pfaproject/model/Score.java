package com.pfa.pfaproject.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private double score;
    private int year;
    @ManyToOne
    @JsonBackReference(value = "country")
    private Country country;
    @ManyToOne
    @JsonBackReference(value = "indicator")
    private Indicator indicator;
}

