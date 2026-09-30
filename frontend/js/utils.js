function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('resumeDraft');
    window.location.href = 'login.html';
}

function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

function showToast(message, type = 'default') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100px)';
        toast.style.transition = 'all 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function formatDate(dateString) {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function debounce(fn, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function getUser() {
    try {
        return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (e) {
        return {};
    }
}

function setUserUI() {
    const user = getUser();
    const nameEl = document.getElementById('userName');
    const avatarEl = document.getElementById('userAvatar');
    const welcomeEl = document.getElementById('welcomeMsg');

    if (nameEl && user.name) nameEl.textContent = user.name;
    if (avatarEl && user.name) avatarEl.textContent = user.name.charAt(0).toUpperCase();
    if (welcomeEl && user.name) welcomeEl.textContent = 'Welcome back, ' + user.name + '! 👋';
}

function resumeToText(resume) {
    let text = '';
    if (resume.personalInfo) {
        text += resume.personalInfo.fullName + ' ' + resume.personalInfo.professionalTitle + ' ';
        text += resume.personalInfo.email + ' ' + resume.personalInfo.phone + ' ';
        text += resume.personalInfo.location + ' ';
    }
    if (resume.summary) text += resume.summary + ' ';
    if (resume.skills) text += resume.skills.join(' ') + ' ';
    if (resume.experience) {
        resume.experience.forEach(exp => {
            text += exp.jobTitle + ' ' + exp.company + ' ' + exp.description + ' ';
        });
    }
    if (resume.education) {
        resume.education.forEach(edu => {
            text += edu.degree + ' ' + edu.institution + ' ';
        });
    }
    if (resume.projects) {
        resume.projects.forEach(proj => {
            text += proj.name + ' ' + proj.description + ' ' + proj.technologies + ' ';
        });
    }
    if (resume.certifications) {
        resume.certifications.forEach(cert => {
            text += cert.name + ' ' + cert.organization + ' ';
        });
    }
    if (resume.achievements) text += resume.achievements.join(' ') + ' ';
    if (resume.languages) text += resume.languages.join(' ') + ' ';
    return text;
}
