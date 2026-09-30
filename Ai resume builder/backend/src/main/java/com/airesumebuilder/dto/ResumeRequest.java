package com.airesumebuilder.dto;

import com.airesumebuilder.model.Resume;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeRequest {
    private String title;
    private Resume.PersonalInfo personalInfo;
    private String summary;
    private List<Resume.Education> education;
    private List<Resume.Experience> experience;
    private List<String> skills;
    private List<Resume.Project> projects;
    private List<Resume.Certification> certifications;
    private List<String> achievements;
    private List<String> languages;
    private List<String> hobbies;
    private String template;
    private Integer atsScore;
}
