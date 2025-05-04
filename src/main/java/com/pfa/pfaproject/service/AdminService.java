package com.pfa.pfaproject.service;


import com.pfa.pfaproject.model.Admin;
import com.pfa.pfaproject.repository.AdminRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class AdminService implements UserDetailsService {
    private final AdminRepository adminRepository;
//    private final BCryptPasswordEncoder passwordEncoder;
//    private final AuthenticationManager authenticationManager;
//    private final JwtUtil jwtUtil;

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("admin not found"));
    }

    public Admin save(Admin admin){
        return adminRepository.save(admin);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return adminRepository.findByUsername(username);
    }

    public Admin findByUsernameOrEmail(String username, String email) {
        return adminRepository.findByUsernameOrEmail(username, email);
    }

    public Admin findByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    public Admin findByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    public boolean existsByUsernameOrEmail(String username, String email) {
        return adminRepository.existsByUsernameOrEmail(username, email);
    }

    public void delete(Long id) {
        adminRepository.deleteById(id);
    }

//    business logic for authentification (to consider if putting here is the right choice)
//    public Admin register(Admin admin) {
//        admin.setPassword(passwordEncoder.encode(admin.getPassword()));
//        return adminRepository.save(admin);
//    }
//
//    public String verify(Admin admin) {
//        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(admin.getUsername(),admin.getPassword()));
//        if(authentication.isAuthenticated()) {
//            return jwtUtil.generateToken(admin.getUsername(), admin.getAuthorities());
//        }
//        return "failure";
//    }
}

