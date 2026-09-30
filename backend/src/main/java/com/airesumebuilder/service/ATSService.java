package com.airesumebuilder.service;

import com.airesumebuilder.dto.ATSRequest;
import com.airesumebuilder.dto.ATSResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class ATSService {

    public ATSResponse analyzeResume(ATSRequest request) {
        String resumeText = request.getResumeText().toLowerCase();
        String jobDesc = request.getJobDescription().toLowerCase();

        String[] jobWords = jobDesc.split("[\\s,\\.\\!\\?\\;\\:]+");
        List<String> matchedKeywords = new ArrayList<>();
        List<String> missingKeywords = new ArrayList<>();

        List<String> commonWords = Arrays.asList("the", "a", "an", "and", "or", "but", "in", "on", "at", "to",
                "for", "of", "with", "by", "from", "is", "are", "was", "were", "be", "been", "have", "has",
                "will", "would", "can", "could", "should", "may", "might", "that", "this", "these", "those");

        for (String word : jobWords) {
            if (word.length() > 3 && !commonWords.contains(word)) {
                if (resumeText.contains(word)) {
                    if (!matchedKeywords.contains(word)) {
                        matchedKeywords.add(word);
                    }
                } else {
                    if (!missingKeywords.contains(word) && missingKeywords.size() < 15) {
                        missingKeywords.add(word);
                    }
                }
            }
        }

        int totalKeywords = matchedKeywords.size() + missingKeywords.size();
        int score = totalKeywords > 0 ? (int) ((matchedKeywords.size() * 100.0) / totalKeywords) : 50;
        score = Math.min(Math.max(score, 10), 95);

        List<String> strengths = new ArrayList<>();
        List<String> improvements = new ArrayList<>();

        if (resumeText.contains("experience") || resumeText.contains("worked")) {
            strengths.add("Resume includes work experience section");
        }
        if (resumeText.contains("education") || resumeText.contains("degree") || resumeText.contains("university")) {
            strengths.add("Education section is present");
        }
        if (resumeText.contains("skills")) {
            strengths.add("Skills section included");
        }
        if (resumeText.contains("project")) {
            strengths.add("Projects section adds value");
        }
        if (matchedKeywords.size() > 5) {
            strengths.add("Good keyword coverage from job description");
        }

        if (missingKeywords.size() > 5) {
            improvements.add("Add more keywords from the job description: " + String.join(", ", missingKeywords.subList(0, Math.min(5, missingKeywords.size()))));
        }
        if (!resumeText.contains("achievement") && !resumeText.contains("accomplished")) {
            improvements.add("Add quantifiable achievements to strengthen your resume");
        }
        if (!resumeText.contains("leadership") && jobDesc.contains("leadership")) {
            improvements.add("Mention leadership experience if applicable");
        }
        improvements.add("Ensure contact information is at the top of the resume");
        improvements.add("Use action verbs to start each bullet point");

        String summary = "Your resume matches approximately " + score + "% of the job requirements. " +
                matchedKeywords.size() + " keywords matched out of " + totalKeywords + " identified.";

        ATSResponse atsResponse = new ATSResponse();
        atsResponse.setSuccess(true);
        atsResponse.setScore(score);
        atsResponse.setMatchedKeywords(matchedKeywords.subList(0, Math.min(10, matchedKeywords.size())));
        atsResponse.setMissingKeywords(missingKeywords);
        atsResponse.setStrengths(strengths);
        atsResponse.setImprovements(improvements);
        atsResponse.setSummary(summary);

        return atsResponse;
    }
}
