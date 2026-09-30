checkAuth();
setUserUI();

let resumeToDelete = null;
let allResumes = [];

async function loadDashboard() {
    try {
        const data = await API.get('/api/resumes');
        if (data && data.success) {
            allResumes = data.data || [];
            renderStats(allResumes);
            renderResumes(allResumes);
        } else {
            document.getElementById('resumesList').innerHTML = '<div class="alert alert-error">Failed to load resumes.</div>';
        }
    } catch (e) {
        document.getElementById('resumesList').innerHTML = '<div class="alert alert-warning">Unable to connect to server. Please make sure the backend is running.</div>';
    }
}

function renderStats(resumes) {
    document.getElementById('totalResumes').textContent = resumes.length;

    if (resumes.length > 0) {
        const sorted = [...resumes].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
        document.getElementById('lastUpdated').textContent = formatDate(sorted[0].updatedAt || sorted[0].createdAt);

        const withScore = resumes.filter(r => r.atsScore);
        if (withScore.length > 0) {
            const avg = Math.round(withScore.reduce((sum, r) => sum + r.atsScore, 0) / withScore.length);
            document.getElementById('avgAtsScore').textContent = avg + '%';
        } else {
            document.getElementById('avgAtsScore').textContent = 'N/A';
        }
    }
}

function renderResumes(resumes) {
    const container = document.getElementById('resumesList');
    if (resumes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">📄</div>
                <h3>No Resumes Yet</h3>
                <p>Create your first resume to get started</p>
                <a href="builder.html" class="btn btn-primary">+ Create Resume</a>
            </div>`;
        return;
    }

    const templateNames = {
        classic: 'Classic Professional', modern: 'Modern Minimal', corporate: 'Corporate',
        elegant: 'Elegant', tech: 'Tech Developer', creative: 'Creative',
        executive: 'Executive', student: 'Student', ats: 'ATS Simple', twocol: 'Two Column'
    };

    container.innerHTML = `<div class="resumes-grid">${resumes.map(resume => {
        const score = resume.atsScore;
        const scoreClass = score >= 70 ? 'good' : score >= 40 ? 'medium' : 'poor';
        const scoreText = score ? score + '%' : 'Not analyzed';
        return `
        <div class="resume-card">
            <div class="resume-card-title">${escapeHtml(resume.title || 'Untitled Resume')}</div>
            <div class="resume-card-meta">📐 ${templateNames[resume.template] || 'Classic'}</div>
            <div class="resume-card-meta">📅 ${formatDate(resume.updatedAt || resume.createdAt)}</div>
            ${score ? `<div class="ats-score-badge ${scoreClass}">🎯 ATS: ${scoreText}</div>` : ''}
            <div class="resume-card-actions">
                <button class="btn btn-primary" onclick="editResume('${resume.id}')">✏️ Edit</button>
                <button class="btn btn-secondary" onclick="downloadResumePdf('${resume.id}')">📥 PDF</button>
                <button class="btn btn-danger" onclick="deleteResume('${resume.id}')">🗑️</button>
            </div>
        </div>`;
    }).join('')}</div>`;
}

function editResume(id) {
    window.location.href = 'builder.html?id=' + id;
}

async function downloadResumePdf(id) {
    try {
        showToast('Generating PDF...', 'default');
        const blob = await API.downloadPdf('/api/resumes/' + id + '/pdf');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume.pdf';
        a.click();
        URL.revokeObjectURL(url);
        showToast('PDF downloaded!', 'success');
    } catch (e) {
        showToast('PDF generation failed. Please try again.', 'error');
    }
}

function deleteResume(id) {
    resumeToDelete = id;
    document.getElementById('deleteModal').classList.remove('hidden');
}

function closeDeleteModal() {
    resumeToDelete = null;
    document.getElementById('deleteModal').classList.add('hidden');
}

async function confirmDelete() {
    if (!resumeToDelete) return;
    try {
        await API.delete('/api/resumes/' + resumeToDelete);
        closeDeleteModal();
        showToast('Resume deleted', 'success');
        loadDashboard();
    } catch (e) {
        showToast('Failed to delete resume', 'error');
        closeDeleteModal();
    }
}

loadDashboard();
