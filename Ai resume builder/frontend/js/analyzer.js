// ATS Resume Analyzer JavaScript
checkAuth();

let userResumes = [];
let selectedResume = null;

document.addEventListener('DOMContentLoaded', async () => {
    await loadUserResumes();

    const urlParams = new URLSearchParams(window.location.search);
    const resumeId = urlParams.get('id');
    if (resumeId) {
        const select = document.getElementById('resumeSelect');
        if (select) {
            select.value = resumeId;
            loadResumeText();
        }
    }
});

async function loadUserResumes() {
    try {
        const res = await API.get('/api/resumes');
        if (res && res.success && res.data) {
            userResumes = res.data;
            const select = document.getElementById('resumeSelect');
            if (select) {
                userResumes.forEach(r => {
                    const opt = document.createElement('option');
                    opt.value = r.id;
                    opt.textContent = `${r.title || 'Untitled'} (${r.template || 'Classic'})`;
                    select.appendChild(opt);
                });
            }
        }
    } catch (e) {
        console.error('Failed to load user resumes:', e);
    }
}

function loadResumeText() {
    const select = document.getElementById('resumeSelect');
    const resumeId = select.value;
    if (!resumeId) {
        selectedResume = null;
        return;
    }

    selectedResume = userResumes.find(r => r.id === resumeId);
    if (selectedResume) {
        const text = resumeToText(selectedResume);
        document.getElementById('resumeText').value = text.trim();
    }
}

async function analyzeATS() {
    const resumeText = document.getElementById('resumeText').value.trim();
    const jobDescription = document.getElementById('jobDescription').value.trim();
    const btn = document.getElementById('analyzeBtn');

    if (!resumeText) {
        showToast('Please enter or select resume text', 'warning');
        return;
    }
    if (!jobDescription) {
        showToast('Please enter a job description to compare against', 'warning');
        return;
    }

    const originalText = btn.innerHTML;
    btn.innerHTML = '⏳ Analyzing Compatibility...';
    btn.disabled = true;

    try {
        const res = await API.post('/api/ats/analyze', {
            resumeText: resumeText,
            jobDescription: jobDescription
        });

        if (res && res.success) {
            displayResults(res);

            // If a saved resume was analyzed, update its atsScore in the backend
            if (selectedResume && selectedResume.id) {
                try {
                    selectedResume.atsScore = res.score;
                    await API.put('/api/resumes/' + selectedResume.id, selectedResume);
                } catch (err) {
                    console.error('Failed to update resume atsScore in backend:', err);
                }
            }

            showToast('ATS Analysis completed!', 'success');
        } else {
            showToast(res.message || 'ATS Analysis failed. Please try again.', 'error');
        }
    } catch (e) {
        showToast('Unable to connect to ATS analysis service.', 'error');
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
}

function displayResults(data) {
    const resultsContainer = document.getElementById('analyzerResults');
    resultsContainer.style.display = 'block';

    // Animate Score Counter
    const targetScore = data.score || 0;
    const scoreNumber = document.getElementById('scoreNumber');
    const scoreCircle = document.getElementById('scoreCircle');
    let currentScore = 0;

    const interval = setInterval(() => {
        if (currentScore >= targetScore) {
            scoreNumber.textContent = targetScore;
            clearInterval(interval);
        } else {
            currentScore++;
            scoreNumber.textContent = currentScore;
        }
    }, 15);

    // Color styling based on score
    scoreCircle.className = 'score-circle';
    if (targetScore >= 70) {
        scoreCircle.classList.add('good');
    } else if (targetScore >= 40) {
        scoreCircle.classList.add('medium');
    } else {
        scoreCircle.classList.add('poor');
    }

    // Summary description
    const summaryEl = document.getElementById('scoreSummary');
    if (summaryEl) {
        summaryEl.textContent = data.summary || `Your resume matches approximately ${targetScore}% of the job requirements.`;
    }

    // Matched Keywords
    const matchedEl = document.getElementById('matchedKeywords');
    if (matchedEl) {
        if (data.matchedKeywords && data.matchedKeywords.length > 0) {
            matchedEl.innerHTML = data.matchedKeywords.map(k => `<span class="keyword-tag matched">✓ ${escapeHtml(k)}</span>`).join('');
        } else {
            matchedEl.innerHTML = '<span style="color:#64748b; font-size:13px;">No direct keyword matches found.</span>';
        }
    }

    // Missing Keywords
    const missingEl = document.getElementById('missingKeywords');
    if (missingEl) {
        if (data.missingKeywords && data.missingKeywords.length > 0) {
            missingEl.innerHTML = data.missingKeywords.map(k => `<span class="keyword-tag missing">+ ${escapeHtml(k)}</span>`).join('');
        } else {
            missingEl.innerHTML = '<span style="color:#10b981; font-size:13px;">Great job! No critical keywords missing.</span>';
        }
    }

    // Strengths
    const strengthsList = document.getElementById('strengthsList');
    if (strengthsList) {
        if (data.strengths && data.strengths.length > 0) {
            strengthsList.innerHTML = data.strengths.map(s => `<li>${escapeHtml(s)}</li>`).join('');
        } else {
            strengthsList.innerHTML = '<li>Good overall foundation.</li>';
        }
    }

    // Improvements
    const improvementsList = document.getElementById('improvementsList');
    if (improvementsList) {
        if (data.improvements && data.improvements.length > 0) {
            improvementsList.innerHTML = data.improvements.map(imp => `<li>${escapeHtml(imp)}</li>`).join('');
        } else {
            improvementsList.innerHTML = '<li>Keep tailoring your resume to target specific job postings.</li>';
        }
    }

    // Smooth scroll down to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
