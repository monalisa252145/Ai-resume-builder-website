package com.airesumebuilder.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ATSResponse {
    private boolean success;
    private int score;
    private List<String> matchedKeywords;
    private List<String> missingKeywords;
    private List<String> strengths;
    private List<String> improvements;
    private String summary;
}
