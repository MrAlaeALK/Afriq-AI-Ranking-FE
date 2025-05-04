package com.pfa.pfaproject.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Indicator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String normalizationType;
    private int weight;
    @OneToMany(mappedBy = "indicator")
    List<Score> scores; //one score for each country
}