package com.airesumebuilder.service;

import com.airesumebuilder.dto.AuthResponse;
import com.airesumebuilder.dto.LoginRequest;
import com.airesumebuilder.dto.RegisterRequest;
import com.airesumebuilder.model.Resume;
import com.airesumebuilder.model.User;
import com.airesumebuilder.repository.ResumeRepository;
import com.airesumebuilder.repository.UserRepository;
import com.airesumebuilder.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ResumeRepository resumeRepository;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(false, "Email already registered", null, null, null, null);
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser.getEmail());

        return new AuthResponse(true, "Registration successful", token, savedUser.getId(), savedUser.getName(), savedUser.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        // Auto-seed demo account if not exists
        boolean isDemo1 = "arjun@demo.com".equalsIgnoreCase(request.getEmail()) && "demo123".equals(request.getPassword());
        boolean isDemo2 = "arjunsingh9708916@gmail.com".equalsIgnoreCase(request.getEmail()) && "Arjun@303109".equals(request.getPassword());

        if (user == null && (isDemo1 || isDemo2)) {
            user = new User();
            user.setName("Arjun Singh");
            user.setEmail(request.getEmail().toLowerCase());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user = userRepository.save(user);

            // Create sample resume for demo user
            Resume sampleResume = new Resume();
            sampleResume.setUserId(user.getId());
            sampleResume.setTitle("Software Developer Resume");
            sampleResume.setTemplate("classic");
            sampleResume.setAtsScore(85);

            Resume.PersonalInfo info = new Resume.PersonalInfo();
            info.setFullName("Arjun Singh");
            info.setProfessionalTitle("Full Stack Java Developer");
            info.setEmail("arjun.singh@example.com");
            info.setPhone("+91 98765 43210");
            info.setLocation("Bengaluru, India");
            info.setLinkedin("linkedin.com/in/arjun-singh-dev");
            info.setGithub("github.com/arjunsingh");
            info.setPortfolio("arjunsingh.dev");
            sampleResume.setPersonalInfo(info);

            sampleResume.setSummary("Detail-oriented and results-driven Full Stack Developer with 3+ years of experience in Java, Spring Boot, MongoDB, and modern web technologies. Passionate about building scalable applications.");

            Resume.Education edu = new Resume.Education();
            edu.setDegree("B.Tech in Computer Science and Engineering");
            edu.setInstitution("National Institute of Technology (NIT)");
            edu.setLocation("Bengaluru, India");
            edu.setStartYear("2018");
            edu.setEndYear("2022");
            edu.setGrade("8.8 CGPA");
            sampleResume.setEducation(java.util.List.of(edu));

            Resume.Experience exp = new Resume.Experience();
            exp.setJobTitle("Software Engineer");
            exp.setCompany("Tech Solutions Inc.");
            exp.setLocation("Bengaluru, India");
            exp.setStartDate("Jul 2022");
            exp.setEndDate("Present");
            exp.setCurrentlyWorking(true);
            exp.setDescription("• Developed and maintained high-throughput REST APIs using Spring Boot and MongoDB.\n• Reduced database query latency by 35% through query indexing and schema optimization.\n• Collaborated in an agile team of 8 to deliver quarterly release milestones on time.");
            sampleResume.setExperience(java.util.List.of(exp));

            sampleResume.setSkills(java.util.List.of("Java", "Spring Boot", "MongoDB", "JavaScript", "HTML5", "CSS3", "REST APIs", "Git", "Docker", "Microservices"));

            Resume.Project proj1 = new Resume.Project();
            proj1.setName("AI Resume Builder Platform");
            proj1.setTechnologies("Java, Spring Boot, MongoDB, Vanilla JS");
            proj1.setDescription("Architected a full-stack resume builder with automated ATS scoring, live template rendering, and PDF generation.");
            proj1.setLink("https://github.com/arjunsingh/ai-resume-builder");
            sampleResume.setProjects(java.util.List.of(proj1));

            Resume.Certification cert = new Resume.Certification();
            cert.setName("Oracle Certified Professional: Java SE 17 Developer");
            cert.setOrganization("Oracle");
            cert.setDate("2023");
            cert.setCredentialUrl("https://oracle.com/verify");
            sampleResume.setCertifications(java.util.List.of(cert));

            sampleResume.setAchievements(java.util.List.of(
                    "Winner of National Level Hackathon 2022 among 150+ competing teams",
                    "Published a technical blog on microservices optimization with 10k+ readers"
            ));
            sampleResume.setLanguages(java.util.List.of("English (Fluent)", "Hindi (Native)"));
            sampleResume.setHobbies(java.util.List.of("Open Source Contributing", "Tech Blogging", "Chess", "Cycling"));

            resumeRepository.save(sampleResume);
        }

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(false, "Invalid email or password", null, null, null, null);
        }

        String token = jwtService.generateToken(user.getEmail());
        return new AuthResponse(true, "Login successful", token, user.getId(), user.getName(), user.getEmail());
    }

    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}
