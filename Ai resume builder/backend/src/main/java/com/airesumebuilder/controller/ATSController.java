package com.airesumebuilder.controller;

import com.airesumebuilder.dto.ATSRequest;
import com.airesumebuilder.dto.ATSResponse;
import com.airesumebuilder.service.ATSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ats")
public class ATSController {

    @Autowired
    private ATSService atsService;

    @PostMapping("/analyze")
    public ResponseEntity<ATSResponse> analyze(@RequestBody ATSRequest request) {
        return ResponseEntity.ok(atsService.analyzeResume(request));
    }
}
