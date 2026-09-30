package com.airesumebuilder.controller;

import com.airesumebuilder.dto.AIRequest;
import com.airesumebuilder.dto.AIResponse;
import com.airesumebuilder.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/summary")
    public ResponseEntity<AIResponse> generateSummary(@RequestBody AIRequest request) {
        return ResponseEntity.ok(aiService.generateSummary(request));
    }

    @PostMapping("/experience")
    public ResponseEntity<AIResponse> improveExperience(@RequestBody AIRequest request) {
        return ResponseEntity.ok(aiService.improveExperience(request));
    }

    @PostMapping("/project")
    public ResponseEntity<AIResponse> improveProject(@RequestBody AIRequest request) {
        return ResponseEntity.ok(aiService.improveProject(request));
    }

    @PostMapping("/skills")
    public ResponseEntity<AIResponse> suggestSkills(@RequestBody AIRequest request) {
        return ResponseEntity.ok(aiService.suggestSkills(request));
    }

    @PostMapping("/improve-resume")
    public ResponseEntity<AIResponse> improveResume(@RequestBody AIRequest request) {
        return ResponseEntity.ok(aiService.improveResume(request));
    }
}
