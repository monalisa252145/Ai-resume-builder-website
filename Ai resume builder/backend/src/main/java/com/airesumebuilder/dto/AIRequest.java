package com.airesumebuilder.dto;

import lombok.Data;

@Data
public class AIRequest {
    private String type;
    private String profession;
    private String skills;
    private String experience;
    private String education;
    private String description;
    private String jobRole;
    private String resumeText;
}
