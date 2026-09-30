package com.airesumebuilder.controller;

import com.airesumebuilder.model.Resume;
import com.airesumebuilder.model.User;
import com.airesumebuilder.repository.UserRepository;
import com.airesumebuilder.service.PdfService;
import com.airesumebuilder.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/resumes")
public class PdfController {

    @Autowired
    private PdfService pdfService;

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}/pdf")
    public ResponseEntity<?> downloadPdf(@PathVariable String id, @AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userRepository.findByEmail(userDetails.getUsername()).orElse(null);
            if (user == null) return ResponseEntity.status(401).body(Map.of("success", false, "message", "Unauthorized"));

            Optional<Resume> resume = resumeService.getResumeById(id, user.getId());
            if (resume.isEmpty()) return ResponseEntity.status(404).body(Map.of("success", false, "message", "Resume not found"));

            byte[] pdfBytes = pdfService.generatePdf(resume.get());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "resume.pdf");

            return ResponseEntity.ok().headers(headers).body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "PDF generation failed"));
        }
    }
}
