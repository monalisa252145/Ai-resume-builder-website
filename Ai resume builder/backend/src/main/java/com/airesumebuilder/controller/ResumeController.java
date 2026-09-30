package com.airesumebuilder.controller;

import com.airesumebuilder.model.Resume;
import com.airesumebuilder.model.User;
import com.airesumebuilder.repository.UserRepository;
import com.airesumebuilder.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/resumes")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private UserRepository userRepository;

    private String getUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
        return user != null ? user.getId() : null;
    }

    @PostMapping
    public ResponseEntity<?> createResume(@RequestBody Resume resume, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = getUserId(userDetails);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
        Resume created = resumeService.createResume(resume, userId);
        return ResponseEntity.ok(Map.of("success", true, "data", created));
    }

    @GetMapping
    public ResponseEntity<?> getAllResumes(@AuthenticationPrincipal UserDetails userDetails) {
        String userId = getUserId(userDetails);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
        List<Resume> resumes = resumeService.getAllResumes(userId);
        return ResponseEntity.ok(Map.of("success", true, "data", resumes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getResume(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = getUserId(userDetails);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
        Optional<Resume> resume = resumeService.getResumeById(id, userId);
        if (resume.isEmpty()) return ResponseEntity.status(404).body(Map.of("success", false, "message", "Resume not found"));
        return ResponseEntity.ok(Map.of("success", true, "data", resume.get()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateResume(@PathVariable String id, @RequestBody Resume resume, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = getUserId(userDetails);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
        Optional<Resume> updated = resumeService.updateResume(id, resume, userId);
        if (updated.isEmpty()) return ResponseEntity.status(404).body(Map.of("success", false, "message", "Resume not found"));
        return ResponseEntity.ok(Map.of("success", true, "data", updated.get()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteResume(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        String userId = getUserId(userDetails);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));
        boolean deleted = resumeService.deleteResume(id, userId);
        if (!deleted) return ResponseEntity.status(404).body(Map.of("success", false, "message", "Resume not found"));
        return ResponseEntity.ok(Map.of("success", true, "message", "Resume deleted"));
    }
}
