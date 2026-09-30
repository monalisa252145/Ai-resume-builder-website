package com.airesumebuilder.service;

import com.airesumebuilder.model.Resume;
import com.lowagie.text.DocumentException;
import org.springframework.stereotype.Service;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class PdfService {

    public byte[] generatePdf(Resume resume) throws Exception {
        String html = buildHtmlResume(resume);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(html);
        renderer.layout();
        renderer.createPDF(outputStream);
        outputStream.close();
        return outputStream.toByteArray();
    }

    private String buildHtmlResume(Resume resume) {
        String template = resume.getTemplate() != null ? resume.getTemplate() : "classic";
        Resume.PersonalInfo info = resume.getPersonalInfo();

        String name = info != null && info.getFullName() != null && !info.getFullName().trim().isEmpty() 
            ? info.getFullName() 
            : (resume.getTitle() != null && !resume.getTitle().trim().isEmpty() ? resume.getTitle() : "Resume");
        String title = info != null && info.getProfessionalTitle() != null ? info.getProfessionalTitle() : "";
        String email = info != null && info.getEmail() != null ? info.getEmail() : "";
        String phone = info != null && info.getPhone() != null ? info.getPhone() : "";
        String location = info != null && info.getLocation() != null ? info.getLocation() : "";
        String linkedin = info != null && info.getLinkedin() != null ? info.getLinkedin() : "";
        String github = info != null && info.getGithub() != null ? info.getGithub() : "";

        String headerBg = getHeaderColor(template);
        String accentColor = getAccentColor(template);

        StringBuilder html = new StringBuilder();
        html.append("<?xml version='1.0' encoding='UTF-8'?>");
        html.append("<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>");
        html.append("<html xmlns='http://www.w3.org/1999/xhtml'><head><meta charset='UTF-8'/>");
        html.append("<style>");
        html.append("body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; font-size: 11pt; }");
        html.append(".header { background: " + headerBg + "; color: white; padding: 20px; margin-bottom: 20px; }");
        html.append(".header h1 { margin: 0; font-size: 22pt; }");
        html.append(".header p { margin: 4px 0; font-size: 10pt; opacity: 0.9; }");
        html.append(".section { margin-bottom: 16px; }");
        html.append(".section-title { font-size: 13pt; font-weight: bold; color: " + accentColor + "; border-bottom: 2px solid " + accentColor + "; padding-bottom: 4px; margin-bottom: 8px; }");
        html.append(".item { margin-bottom: 10px; }");
        html.append(".item-title { font-weight: bold; font-size: 11pt; }");
        html.append(".item-subtitle { color: #555; font-size: 10pt; }");
        html.append(".skills-list { display: inline; }");
        html.append(".skill { display: inline-block; background: #f0f0f0; padding: 3px 8px; margin: 2px; border-radius: 3px; font-size: 10pt; }");
        html.append("</style></head><body>");

        html.append("<div class='header'>");
        html.append("<h1>" + escapeHtml(name) + "</h1>");
        if (!title.isEmpty()) html.append("<p>" + escapeHtml(title) + "</p>");
        String contactLine = "";
        if (!email.isEmpty()) contactLine += email + " | ";
        if (!phone.isEmpty()) contactLine += phone + " | ";
        if (!location.isEmpty()) contactLine += location;
        if (!contactLine.isEmpty()) html.append("<p>" + escapeHtml(contactLine.replaceAll(" \\| $", "")) + "</p>");
        if (!linkedin.isEmpty()) html.append("<p>" + escapeHtml(linkedin) + "</p>");
        if (!github.isEmpty()) html.append("<p>" + escapeHtml(github) + "</p>");
        html.append("</div>");

        if (resume.getSummary() != null && !resume.getSummary().isEmpty()) {
            html.append("<div class='section'><div class='section-title'>Professional Summary</div>");
            html.append("<p>" + escapeHtml(resume.getSummary()) + "</p></div>");
        }

        if (resume.getExperience() != null && !resume.getExperience().isEmpty()) {
            html.append("<div class='section'><div class='section-title'>Work Experience</div>");
            for (Resume.Experience exp : resume.getExperience()) {
                html.append("<div class='item'>");
                html.append("<div class='item-title'>" + escapeHtml(exp.getJobTitle()) + " - " + escapeHtml(exp.getCompany()) + "</div>");
                html.append("<div class='item-subtitle'>" + escapeHtml(exp.getStartDate()) + " - " + (exp.isCurrentlyWorking() ? "Present" : escapeHtml(exp.getEndDate())) + " | " + escapeHtml(exp.getLocation()) + "</div>");
                if (exp.getDescription() != null) html.append("<p>" + escapeHtml(exp.getDescription()) + "</p>");
                html.append("</div>");
            }
            html.append("</div>");
        }

        if (resume.getEducation() != null && !resume.getEducation().isEmpty()) {
            html.append("<div class='section'><div class='section-title'>Education</div>");
            for (Resume.Education edu : resume.getEducation()) {
                html.append("<div class='item'>");
                html.append("<div class='item-title'>" + escapeHtml(edu.getDegree()) + "</div>");
                html.append("<div class='item-subtitle'>" + escapeHtml(edu.getInstitution()) + " | " + escapeHtml(edu.getStartYear()) + " - " + escapeHtml(edu.getEndYear()) + "</div>");
                if (edu.getGrade() != null && !edu.getGrade().isEmpty()) html.append("<p>Grade: " + escapeHtml(edu.getGrade()) + "</p>");
                html.append("</div>");
            }
            html.append("</div>");
        }

        if (resume.getSkills() != null && !resume.getSkills().isEmpty()) {
            html.append("<div class='section'><div class='section-title'>Skills</div>");
            for (String skill : resume.getSkills()) {
                html.append("<span class='skill'>" + escapeHtml(skill) + "</span>");
            }
            html.append("</div>");
        }

        if (resume.getProjects() != null && !resume.getProjects().isEmpty()) {
            html.append("<div class='section'><div class='section-title'>Projects</div>");
            for (Resume.Project project : resume.getProjects()) {
                html.append("<div class='item'>");
                html.append("<div class='item-title'>" + escapeHtml(project.getName()) + "</div>");
                if (project.getTechnologies() != null) html.append("<div class='item-subtitle'>Technologies: " + escapeHtml(project.getTechnologies()) + "</div>");
                if (project.getDescription() != null) html.append("<p>" + escapeHtml(project.getDescription()) + "</p>");
                html.append("</div>");
            }
            html.append("</div>");
        }

        if (resume.getCertifications() != null && !resume.getCertifications().isEmpty()) {
            html.append("<div class='section'><div class='section-title'>Certifications</div>");
            for (Resume.Certification cert : resume.getCertifications()) {
                html.append("<div class='item'>");
                html.append("<div class='item-title'>" + escapeHtml(cert.getName()) + "</div>");
                html.append("<div class='item-subtitle'>" + escapeHtml(cert.getOrganization()) + " | " + escapeHtml(cert.getDate()) + "</div>");
                html.append("</div>");
            }
            html.append("</div>");
        }

        if (resume.getAchievements() != null && !resume.getAchievements().isEmpty()) {
            html.append("<div class='section'><div class='section-title'>Achievements</div><ul>");
            for (String ach : resume.getAchievements()) {
                html.append("<li>" + escapeHtml(ach) + "</li>");
            }
            html.append("</ul></div>");
        }

        if (resume.getLanguages() != null && !resume.getLanguages().isEmpty()) {
            html.append("<div class='section'><div class='section-title'>Languages</div>");
            html.append("<p>" + String.join(", ", resume.getLanguages()) + "</p></div>");
        }

        html.append("</body></html>");
        return html.toString();
    }

    private String getHeaderColor(String template) {
        return switch (template != null ? template.toLowerCase() : "classic") {
            case "modern" -> "#2196F3";
            case "corporate" -> "#1a237e";
            case "elegant" -> "#4a148c";
            case "tech" -> "#00695c";
            case "creative" -> "#e65100";
            case "executive" -> "#212121";
            case "student" -> "#1565c0";
            case "ats" -> "#37474f";
            case "twocol", "two-column" -> "#6a1b9a";
            default -> "#1976d2";
        };
    }

    private String getAccentColor(String template) {
        return switch (template != null ? template.toLowerCase() : "classic") {
            case "modern" -> "#2196F3";
            case "corporate" -> "#1a237e";
            case "elegant" -> "#4a148c";
            case "tech" -> "#00695c";
            case "creative" -> "#e65100";
            case "executive" -> "#212121";
            case "student" -> "#1565c0";
            case "ats" -> "#37474f";
            case "twocol", "two-column" -> "#6a1b9a";
            default -> "#1976d2";
        };
    }

    private String escapeHtml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
    }
}
