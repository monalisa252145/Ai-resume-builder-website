package com.airesumebuilder.service;

import com.airesumebuilder.model.Resume;
import com.airesumebuilder.repository.ResumeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    public Resume createResume(Resume resume, String userId) {
        resume.setUserId(userId);
        if (resume.getTemplate() == null) {
            resume.setTemplate("classic");
        }
        return resumeRepository.save(resume);
    }

    public List<Resume> getAllResumes(String userId) {
        return resumeRepository.findByUserId(userId);
    }

    public Optional<Resume> getResumeById(String id, String userId) {
        return resumeRepository.findByIdAndUserId(id, userId);
    }

    public Optional<Resume> updateResume(String id, Resume updatedResume, String userId) {
        Optional<Resume> existing = resumeRepository.findByIdAndUserId(id, userId);
        if (existing.isPresent()) {
            Resume resume = existing.get();
            resume.setTitle(updatedResume.getTitle());
            resume.setPersonalInfo(updatedResume.getPersonalInfo());
            resume.setSummary(updatedResume.getSummary());
            resume.setEducation(updatedResume.getEducation());
            resume.setExperience(updatedResume.getExperience());
            resume.setSkills(updatedResume.getSkills());
            resume.setProjects(updatedResume.getProjects());
            resume.setCertifications(updatedResume.getCertifications());
            resume.setAchievements(updatedResume.getAchievements());
            resume.setLanguages(updatedResume.getLanguages());
            resume.setHobbies(updatedResume.getHobbies());
            resume.setTemplate(updatedResume.getTemplate());
            resume.setAtsScore(updatedResume.getAtsScore());
            return Optional.of(resumeRepository.save(resume));
        }
        return Optional.empty();
    }

    public boolean deleteResume(String id, String userId) {
        Optional<Resume> existing = resumeRepository.findByIdAndUserId(id, userId);
        if (existing.isPresent()) {
            resumeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
