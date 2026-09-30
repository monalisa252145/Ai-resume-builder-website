package com.airesumebuilder.service;

import com.airesumebuilder.dto.AIRequest;
import com.airesumebuilder.dto.AIResponse;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class AIService {

    @Value("${ai.api.key}")
    private String apiKey;

    @Value("${ai.api.url}")
    private String apiUrl;

    @Value("${ai.model}")
    private String model;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AIResponse generateSummary(AIRequest request) {
        String prompt = "Write a professional resume summary in 3-4 sentences for a " + request.getProfession() +
                " with skills in " + request.getSkills() + ". Experience: " + request.getExperience() +
                ". Education: " + request.getEducation() + ". Make it ATS-friendly and impactful.";
        return callAI(prompt);
    }

    public AIResponse improveExperience(AIRequest request) {
        String prompt = "Improve this job description into 4-5 professional resume bullet points using action verbs and quantifiable results:\n" +
                request.getDescription() + "\nReturn only the bullet points, one per line starting with •";
        return callAI(prompt);
    }

    public AIResponse improveProject(AIRequest request) {
        String prompt = "Improve this project description for a resume. Make it professional, highlight technologies and impact:\n" +
                request.getDescription() + "\nReturn a 2-3 sentence professional description.";
        return callAI(prompt);
    }

    public AIResponse suggestSkills(AIRequest request) {
        String prompt = "Suggest 10 relevant technical and soft skills for a " + request.getJobRole() +
                " role. Current skills: " + request.getSkills() +
                ". Return only a comma-separated list of skill names.";
        return callAI(prompt);
    }

    public AIResponse improveResume(AIRequest request) {
        String prompt = "Analyze this resume text and provide 5 specific improvement suggestions to make it more ATS-friendly and professional:\n" +
                request.getResumeText() + "\nFormat as numbered list.";
        return callAI(prompt);
    }

    private AIResponse callAI(String prompt) {
        try {
            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("model", model);

            ArrayNode messages = objectMapper.createArrayNode();
            ObjectNode message = objectMapper.createObjectNode();
            message.put("role", "user");
            message.put("content", prompt);
            messages.add(message);
            requestBody.set("messages", messages);
            requestBody.put("max_tokens", 500);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(apiUrl))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(requestBody)))
                    .build();

            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            JsonNode jsonResponse = objectMapper.readTree(response.body());

            if (response.statusCode() == 200) {
                String content = jsonResponse.path("choices").get(0).path("message").path("content").asText();
                return new AIResponse(true, "Success", content);
            } else {
                return new AIResponse(false, "AI service error", null);
            }
        } catch (Exception e) {
            return new AIResponse(false, "AI service is currently unavailable. You can continue editing your resume manually.", null);
        }
    }
}
