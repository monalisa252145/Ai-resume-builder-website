package com.airesumebuilder.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "resumes")
public class Resume {

    @Id
    private String id;

    private String userId;
    private String title;

    private PersonalInfo personalInfo;
    private String summary;
    private List<Education> education;
    private List<Experience> experience;
    private List<String> skills;
    private List<Project> projects;
    private List<Certification> certifications;
    private List<String> achievements;
    private List<String> languages;
    private List<String> hobbies;

    private String template;
    private Integer atsScore;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PersonalInfo {
        private String fullName;
        private String professionalTitle;
        private String email;
        private String phone;
        private String location;
        private String linkedin;
        private String github;
        private String portfolio;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Education {
        private String degree;
        private String institution;
        private String location;
        private String startYear;
        private String endYear;
        private String grade;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Experience {
        private String jobTitle;
        private String company;
        private String location;
        private String startDate;
        private String endDate;
        private boolean currentlyWorking;
        private String description;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Project {
        private String name;
        private String description;
        private String technologies;
        private String link;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Certification {
        private String name;
        private String organization;
        private String date;
        private String credentialUrl;
    }
}
