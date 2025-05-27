package com.pfa.pfaproject.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Country {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String name;
    private String code;
    private String region;
    @OneToMany(mappedBy = "country")
    List<Rank> rankingHistory;
    @OneToMany(mappedBy = "country")
    List<Score> scores;
}


