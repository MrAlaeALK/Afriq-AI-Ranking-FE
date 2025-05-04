package com.pfa.pfaproject.service;

import com.pfa.pfaproject.config.JWT.JwtUtil;
import com.pfa.pfaproject.dto.Admin.LoginDTO;
import com.pfa.pfaproject.dto.Admin.RegisterDTO;
import com.pfa.pfaproject.dto.Rank.GenerateFinalScoreForCountryDTO;
import com.pfa.pfaproject.dto.Rank.GenerateRankOrFinalScoreDTO;
import com.pfa.pfaproject.dto.Score.AddOrUpdateScoreDTO;
import com.pfa.pfaproject.exception.CustomException;
import com.pfa.pfaproject.model.*;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class AdminBusinessService {
    private final BCryptPasswordEncoder passwordEncoder;
    private final AdminService adminService;
    private final CountryService countryService;
    private final IndicatorService indicatorService;
    private final ScoreService scoreService;
    private final RankService rankService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

//    public Admin register(Admin admin) {
//        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
//        return adminService.save(admin);
//    }
//
//    public String verify(Admin admin) {
//        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(admin.getUsername(),admin.getPassword()));
//        if(authentication.isAuthenticated()) {
//            return jwtUtil.generateToken(admin.getUsername(), admin.getAuthorities());
//        }
//        return "Username or password is incorrect";
//    }

    public String register(RegisterDTO adminToRegisterDTO) {
        if(adminService.existsByUsernameOrEmail(adminToRegisterDTO.username(), adminToRegisterDTO.email())) {
//            return "admin already exists";
            throw new CustomException("Admin already exists", HttpStatus.CONFLICT);
        }
        Admin admin = Admin.builder()
                .email(adminToRegisterDTO.email())
                .username(adminToRegisterDTO.username())
                .firstName(adminToRegisterDTO.firstName())
                .lastName(adminToRegisterDTO.lastName())
                .password(passwordEncoder.encode(adminToRegisterDTO.password()))
                .build();
        adminService.save(admin);
        return jwtUtil.generateToken(admin.getUsername(), admin.getAuthorities());
    }

    public String login(LoginDTO adminToLogin) {
        Admin admin = (adminToLogin.usernameOrEmail().contains("@") && adminToLogin.usernameOrEmail().contains("."))?
                adminService.findByEmail(adminToLogin.usernameOrEmail())
                : adminService.findByUsername(adminToLogin.usernameOrEmail());
        if(admin == null) {
//            return "Username or password is incorrect";
            throw new CustomException("Username or password is incorrect", HttpStatus.UNAUTHORIZED);
        }
        else{
            if(!passwordEncoder.matches(adminToLogin.password(), admin.getPassword())) {
//                return "Wrong password";
                throw new CustomException("Username or password is incorrect", HttpStatus.UNAUTHORIZED);
            }
        }
        return jwtUtil.generateToken(admin.getUsername(), admin.getAuthorities());
    }

    public Country adminAddCountry(Country country){
        if(countryService.findByName(country.getName()) == null) {
            return countryService.save(country);
        }
//        return "Country already exists";
        throw new CustomException("Country already exists", HttpStatus.CONFLICT);
    }

    public Indicator adminAddIndicator(Indicator indicator){
        if(indicatorService.findByName(indicator.getName()) == null){
            return indicatorService.save(indicator);
        }
        throw new CustomException("Indicator already exists", HttpStatus.CONFLICT);
    }

    //maybe I should merge add score and update in the same method
    public Score adminAddScore(AddOrUpdateScoreDTO addOrUpdateScoreDTO){
        if(scoreService.findByCountry_IdAndIndicator_IdAndYear(addOrUpdateScoreDTO.countryId(), addOrUpdateScoreDTO.indicatorId(), addOrUpdateScoreDTO.year()) == null) {
            Score newScore = Score.builder()
                    .score(addOrUpdateScoreDTO.score())
                    .year(addOrUpdateScoreDTO.year())
                    .country(countryService.findById(addOrUpdateScoreDTO.countryId()))
                    .indicator(indicatorService.findById(addOrUpdateScoreDTO.indicatorId()))
                    .build();
            return scoreService.save(newScore);
        }
        throw new CustomException("Score already exists", HttpStatus.CONFLICT);
    }

    public Score adminUpdateScore(AddOrUpdateScoreDTO addOrUpdateScoreDTO){
        Score score = scoreService.findByCountry_IdAndIndicator_IdAndYear(addOrUpdateScoreDTO.countryId(), addOrUpdateScoreDTO.indicatorId(), addOrUpdateScoreDTO.year());
        if (score == null){
            throw new CustomException("Score does not exist", HttpStatus.CONFLICT);
        }
        score.setScore(addOrUpdateScoreDTO.score());
        return scoreService.save(score);
    }

    public Rank generateFinalScoreForCountry(GenerateFinalScoreForCountryDTO generateFinalScoreForCountryDTO){
        if(rankService.findByCountryIdAndYear(generateFinalScoreForCountryDTO.countryId(),generateFinalScoreForCountryDTO.year()) == null){
            Country country = countryService.findById(generateFinalScoreForCountryDTO.countryId());
            List<Score> scores = country.getScores().stream()
                    .filter(score -> score.getYear() == generateFinalScoreForCountryDTO.year())
                    .toList();
            double finalScore = 0;
            int weightSum = 0;
            for(Score score : scores){
                weightSum += score.getIndicator().getWeight();
                finalScore += score.getIndicator().getWeight() * score.getScore();
            }
            finalScore = finalScore / weightSum;

            Rank newRank = Rank.builder()
                    .country(country)
                    .year(generateFinalScoreForCountryDTO.year())
                    .finalScore(finalScore)
                    .build();
            return rankService.save(newRank);
        }
        throw new CustomException("Rank already exists", HttpStatus.CONFLICT);
    }

    public List<Rank> generateFinalScore(GenerateRankOrFinalScoreDTO generateRankOrFinalScoreDTO){
        List<Country> countries = countryService.findAll();
        List<Rank> finalScores = new ArrayList<>();
        for(Country country : countries){
            Rank finalScore = generateFinalScoreForCountry(new GenerateFinalScoreForCountryDTO(country.getId(),generateRankOrFinalScoreDTO.year()));
            finalScores.add(finalScore);
        }
        return finalScores;
    }

    //could be useful
//    public void generateRanking(GenerateRankOrFinalScoreDTO generateRankOrFinalScoreDTO){
//        List<Rank> yearRanking = rankService.findByYearOrderByFinalScoreDesc(generateRankOrFinalScoreDTO.year());
//        int rank = 1;
//        for (Rank yearRank : yearRanking) {
//            yearRank.setRank(rank++);
//            rankService.save(yearRank);
//        }
//    }

    public List<Country> generateRanking(GenerateRankOrFinalScoreDTO generateRankOrFinalScoreDTO){
        List<Rank> yearRanking = rankService.findByYearOrderByFinalScoreDesc(generateRankOrFinalScoreDTO.year());
        int rank = 1;
        List<Country> countries = new ArrayList<>();
        for (Rank yearRank : yearRanking) {
            yearRank.setRank(rank++);
            rankService.save(yearRank);
            countries.add(yearRank.getCountry());
        }
        return countries;
    }

}

