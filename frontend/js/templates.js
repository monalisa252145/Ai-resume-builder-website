// Resume Templates Rendering Engine with Live Demo Data, Dynamic Placeholders, Section Reordering & Studio Customization

const DEMO_RESUME = {
    personalInfo: {
        fullName: 'Alex Johnson',
        professionalTitle: 'Senior Full Stack Engineer',
        email: 'alex.johnson@example.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/alexjohnson',
        github: 'github.com/alexjohnson',
        portfolio: 'alexjohnson.dev'
    },
    summary: 'Results-driven Full Stack Software Engineer with 5+ years of experience architecting high-throughput microservices, scalable cloud distributed systems, and responsive modern web applications. Proven track record in reducing system latency by 35%, leading agile teams, and implementing automated CI/CD pipelines.',
    experience: [
        {
            jobTitle: 'Senior Software Engineer',
            company: 'TechCorp Solutions',
            location: 'San Francisco, CA',
            startDate: 'Jan 2022',
            endDate: 'Present',
            currentlyWorking: true,
            description: '• Architected and maintained resilient microservices using Java, Spring Boot, and MongoDB, cutting response times by 35%.\n• Spearheaded AWS cloud migration with Docker and Kubernetes, achieving 99.99% system reliability.\n• Mentored 6 software engineers and instituted automated CI/CD code verification pipelines.'
        },
        {
            jobTitle: 'Full Stack Developer',
            company: 'Nexus Innovations',
            location: 'Seattle, WA',
            startDate: 'Jun 2019',
            endDate: 'Dec 2021',
            currentlyWorking: false,
            description: '• Developed responsive full-stack features using JavaScript, HTML5/CSS3, and RESTful APIs serving 250,000+ monthly active users.\n• Optimized database indexing queries, reducing search latency across 500k+ records.'
        }
    ],
    education: [
        {
            degree: 'B.S. in Computer Science',
            institution: 'Stanford University',
            location: 'Stanford, CA',
            startYear: '2015',
            endYear: '2019',
            grade: '3.8 / 4.0 GPA'
        }
    ],
    skills: [
        'Java', 'Spring Boot', 'JavaScript (ES6+)', 'React.js', 'Node.js',
        'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes', 'REST APIs', 'Git', 'CI/CD'
    ],
    projects: [
        {
            name: 'Cloud E-Commerce Platform',
            technologies: 'Java, Spring Boot, MongoDB, React, Docker',
            link: 'https://github.com/alexjohnson/cloud-shop',
            description: 'Built a multi-tenant microservices e-commerce platform processing 10,000+ daily orders with Stripe payment gateway integration and distributed caching.'
        },
        {
            name: 'AI Document Intelligence Engine',
            technologies: 'Python, FastAPI, OpenAI API, JavaScript',
            link: 'https://github.com/alexjohnson/ai-doc-engine',
            description: 'Created an intelligent document parsing pipeline that automatically classifies, extracts metadata, and generates real-time ATS summaries.'
        }
    ],
    certifications: [
        {
            name: 'AWS Certified Solutions Architect – Associate',
            organization: 'Amazon Web Services',
            date: '2023',
            credentialUrl: 'https://aws.amazon.com'
        },
        {
            name: 'Oracle Certified Professional: Java SE Developer',
            organization: 'Oracle',
            date: '2022',
            credentialUrl: 'https://oracle.com'
        }
    ],
    achievements: [
        'Winner, National Cloud Computing Hackathon 2023 out of 300+ engineering teams',
        'Author of popular open-source developer tooling library with 15,000+ monthly downloads',
        'Speaker at DevCon 2024 on Scalable Backend Architecture & Microservices'
    ],
    languages: ['English (Native)', 'Spanish (Fluent)', 'German (Conversational)'],
    hobbies: ['Open Source Contributing', 'Technical Writing', 'Chess Strategy', 'Hiking']
};

function getActiveStyling() {
    return window.resumeDesign || {
        primaryColor: '#1976d2',
        headingColor: '#1976d2',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        backgroundColor: '#ffffff',
        fontFamily: "'Inter', sans-serif",
        nameFontSize: '22pt',
        headingFontSize: '13pt',
        bodyFontSize: '10.5pt',
        fontWeight: 'normal',
        lineHeight: '1.55',
        letterSpacing: '0.0px',
        textAlign: 'left',
        isBold: false,
        isItalic: false,
        isUnderline: false,
        textTransform: 'uppercase',
        pageMargin: '20mm',
        sectionSpacing: '14px',
        dividerStyle: 'solid',
        borderRadius: '4px',
        atsFriendlyMode: false,
        sectionOrder: ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements', 'languages', 'hobbies'],
        sectionVisibility: {
            summary: true, experience: true, education: true, skills: true,
            projects: true, certifications: true, achievements: true, languages: true, hobbies: true
        }
    };
}

// Fallback helper to return non-empty value or fallback
function phText(val, fallback) {
    if (val !== undefined && val !== null && String(val).trim().length > 0) {
        return escapeHtml(String(val).trim());
    }
    return escapeHtml(fallback || '');
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function renderTemplate(data, templateName, customStyles) {
    const design = customStyles || getActiveStyling();
    const info = (data && data.personalInfo) || {};
    const demo = DEMO_RESUME.personalInfo;

    const name = (info.fullName && info.fullName.trim()) || demo.fullName;
    const title = (info.professionalTitle && info.professionalTitle.trim()) || demo.professionalTitle;
    const email = (info.email && info.email.trim()) || demo.email;
    const phone = (info.phone && info.phone.trim()) || demo.phone;
    const location = (info.location && info.location.trim()) || demo.location;
    const linkedin = (info.linkedin && info.linkedin.trim()) || demo.linkedin;
    const github = (info.github && info.github.trim()) || demo.github;
    const portfolio = (info.portfolio && info.portfolio.trim()) || (info.website && info.website.trim()) || demo.portfolio;

    // Base template defaults
    let defaultColor = '#1976d2';
    let defaultFont = "'Inter', sans-serif";

    switch (templateName) {
        case 'modern': defaultColor = '#2196F3'; defaultFont = "'Inter', sans-serif"; break;
        case 'corporate': defaultColor = '#1a237e'; defaultFont = "Arial, sans-serif"; break;
        case 'elegant': defaultColor = '#4a148c'; defaultFont = "Georgia, serif"; break;
        case 'tech': defaultColor = '#00695c'; defaultFont = "'Courier New', monospace"; break;
        case 'creative': defaultColor = '#e65100'; defaultFont = "'Poppins', sans-serif"; break;
        case 'executive': defaultColor = '#212121'; defaultFont = "'Times New Roman', serif"; break;
        case 'student': defaultColor = '#1565c0'; defaultFont = "'Roboto', sans-serif"; break;
        case 'ats': defaultColor = '#37474f'; defaultFont = "Arial, sans-serif"; break;
        case 'twocol': defaultColor = '#6a1b9a'; defaultFont = "'Open Sans', sans-serif"; break;
        default: defaultColor = '#1976d2'; defaultFont = "'Inter', sans-serif"; break;
    }

    const primaryColor = design.primaryColor || defaultColor;
    const headingColor = design.headingColor || primaryColor;
    const bodyColor = design.bodyColor || '#334155';
    const borderColor = design.borderColor || '#e2e8f0';
    const bgColor = design.backgroundColor || '#ffffff';
    const font = design.fontFamily || defaultFont;
    const nameSize = design.nameFontSize || '22pt';
    const headSize = design.headingFontSize || '13pt';
    const bodySize = design.bodyFontSize || '10.5pt';
    const fWeight = design.fontWeight || 'normal';
    const lHeight = design.lineHeight || '1.55';
    const lSpacing = design.letterSpacing || '0.0px';
    const tAlign = design.textAlign || 'left';
    const tTransform = design.textTransform || 'uppercase';
    const bRadius = design.borderRadius || '4px';
    const dividerStyle = design.dividerStyle || 'solid';
    const secSpacing = design.sectionSpacing || '14px';

    const underlineStyle = design.isUnderline ? `text-decoration: underline; text-underline-offset: 4px; text-decoration-color: ${primaryColor};` : '';
    const italicStyle = design.isItalic ? 'font-style: italic;' : '';
    const boldStyle = design.isBold ? 'font-weight: 700;' : `font-weight: ${fWeight};`;

    // ATS mode override
    if (design.atsFriendlyMode || templateName === 'ats') {
        return `
        <div class="resume-render-wrapper" style="
            font-family: Arial, sans-serif;
            font-size: ${bodySize};
            letter-spacing: ${lSpacing};
            text-align: ${tAlign};
            line-height: ${lHeight};
            ${boldStyle}
            ${italicStyle}
            color: #111827;
            background: #ffffff;
            transition: all 0.2s ease;
        ">
            ${renderAtsMode(data || {}, name, title, email, phone, location, linkedin, github, portfolio, design)}
        </div>`;
    }

    let templateHtml = '';
    switch (templateName) {
        case 'modern':
            templateHtml = renderModern(data || {}, name, title, email, phone, location, linkedin, github, portfolio, primaryColor, headingColor, bodyColor, borderColor, underlineStyle, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle);
            break;
        case 'corporate':
            templateHtml = renderCorporate(data || {}, name, title, email, phone, location, linkedin, github, portfolio, primaryColor, headingColor, bodyColor, borderColor, underlineStyle, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle);
            break;
        case 'elegant':
            templateHtml = renderElegant(data || {}, name, title, email, phone, location, linkedin, github, portfolio, primaryColor, headingColor, bodyColor, borderColor, underlineStyle, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle);
            break;
        case 'tech':
            templateHtml = renderTech(data || {}, name, title, email, phone, location, linkedin, github, portfolio, primaryColor, headingColor, bodyColor, borderColor, underlineStyle, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle);
            break;
        case 'creative':
            templateHtml = renderCreative(data || {}, name, title, email, phone, location, linkedin, github, portfolio, primaryColor, headingColor, bodyColor, borderColor, underlineStyle, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle);
            break;
        case 'executive':
            templateHtml = renderExecutive(data || {}, name, title, email, phone, location, linkedin, github, portfolio, primaryColor, headingColor, bodyColor, borderColor, underlineStyle, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle);
            break;
        case 'student':
            templateHtml = renderStudent(data || {}, name, title, email, phone, location, linkedin, github, portfolio, primaryColor, headingColor, bodyColor, borderColor, underlineStyle, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle);
            break;
        case 'twocol':
            templateHtml = renderTwoColumn(data || {}, name, title, email, phone, location, linkedin, github, portfolio, primaryColor, headingColor, bodyColor, borderColor, underlineStyle, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle);
            break;
        case 'classic':
        default:
            templateHtml = renderClassic(data || {}, name, title, email, phone, location, linkedin, github, portfolio, primaryColor, headingColor, bodyColor, borderColor, underlineStyle, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle);
            break;
    }

    return `
    <div class="resume-render-wrapper" style="
        font-family: ${font};
        font-size: ${bodySize};
        letter-spacing: ${lSpacing};
        text-align: ${tAlign};
        line-height: ${lHeight};
        ${boldStyle}
        ${italicStyle}
        color: ${bodyColor};
        background: ${bgColor};
        transition: all 0.2s ease;
    ">
        ${templateHtml}
    </div>`;
}

// Section Title component respecting typography and custom colors
function sectionTitle(text, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle) {
    const borderCss = dividerStyle === 'none' ? 'none' : `2px ${dividerStyle || 'solid'} ${borderColor || headingColor}`;
    return `<div class="resume-section-heading" style="
        font-size: ${headSize || '13pt'};
        font-weight: 700;
        color: ${headingColor};
        border-bottom: ${borderCss};
        padding-bottom: 4px;
        margin: 14px 0 8px;
        text-transform: ${textTransform || 'uppercase'};
        letter-spacing: 0.5px;
        ${underlineStyle || ''}
    ">${escapeHtml(text)}</div>`;
}

// Dynamic section renderer obeying sectionOrder and sectionVisibility
function renderOrderedSections(data, headingColor, borderColor, underlineStyle, secSpacing, textTransform, headSize, dividerStyle) {
    const design = getActiveStyling();
    const order = design.sectionOrder || ['summary', 'experience', 'education', 'skills', 'projects', 'certifications', 'achievements', 'languages', 'hobbies'];
    const vis = design.sectionVisibility || {};

    let html = '';
    for (const secKey of order) {
        if (vis[secKey] === false) continue;

        switch (secKey) {
            case 'summary':
                html += renderSummaryBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle);
                break;
            case 'experience':
                html += renderExpBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle);
                break;
            case 'education':
                html += renderEduBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle);
                break;
            case 'skills':
                html += renderSkillsBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle);
                break;
            case 'projects':
                html += renderProjectsBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle);
                break;
            case 'certifications':
                html += renderCertBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle);
                break;
            case 'achievements':
                html += renderAchievementsBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle);
                break;
            case 'languages':
                html += renderLanguagesBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle);
                break;
            case 'hobbies':
                html += renderHobbiesBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle);
                break;
        }
    }
    return html;
}

// --- Section Block Renderers with Live Preview & Demo Defaults ---

function renderSummaryBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle) {
    const text = (data.summary && data.summary.trim().length > 0) ? data.summary.trim() : DEMO_RESUME.summary;

    return `
    <div class="resume-section-wrap" style="margin-bottom: 12px;">
        ${sectionTitle('Professional Summary', headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle)}
        <p style="margin: 0 0 8px; white-space: pre-wrap; font-size: 0.94em; line-height: 1.55;">${escapeHtml(text)}</p>
    </div>`;
}

function renderExpBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle) {
    const rawList = data.experience || [];
    const hasUserItems = rawList.length > 0 && rawList.some(e => (e.jobTitle || e.company || e.description || e.startDate || e.location));
    const list = hasUserItems ? rawList : DEMO_RESUME.experience;

    const itemsHtml = list.map(exp => {
        const title = phText(exp.jobTitle, 'Software Engineer');
        const company = phText(exp.company, 'Company Name');
        const startDate = phText(exp.startDate, 'Jan 2022');
        const endDate = exp.currentlyWorking ? 'Present' : phText(exp.endDate, 'Present');
        const location = exp.location ? escapeHtml(exp.location) : '';
        const desc = phText(exp.description, '• Responsible for designing, implementing, and maintaining software features and APIs.');

        return `
            <div style="margin-bottom: 11px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; font-weight: 700;">
                    <span style="font-size: 1.02em; color: ${headingColor};">${title} <span style="font-weight: 500; opacity: 0.88; color: inherit;">— ${company}</span></span>
                    <span style="font-size: 0.88em; font-weight: 600; opacity: 0.85;">${startDate} – ${endDate}</span>
                </div>
                ${location ? `<div style="font-size: 0.85em; opacity: 0.8; margin-top: 1px;">📍 ${location}</div>` : ''}
                <div style="font-size: 0.92em; white-space: pre-wrap; margin-top: 3px; line-height: 1.5;">${desc}</div>
            </div>
        `;
    }).join('');

    return `
    <div class="resume-section-wrap" style="margin-bottom: 12px;">
        ${sectionTitle('Work Experience', headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle)}
        ${itemsHtml}
    </div>`;
}

function renderEduBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle) {
    const rawList = data.education || [];
    const hasUserItems = rawList.length > 0 && rawList.some(e => (e.degree || e.institution || e.startYear));
    const list = hasUserItems ? rawList : DEMO_RESUME.education;

    const itemsHtml = list.map(edu => {
        const degree = phText(edu.degree, 'B.S. in Computer Science');
        const institution = phText(edu.institution, 'Stanford University');
        const startYear = phText(edu.startYear, '2015');
        const endYear = phText(edu.endYear, '2019');
        const location = edu.location ? escapeHtml(edu.location) : '';
        const grade = edu.grade ? escapeHtml(edu.grade) : '';

        return `
            <div style="margin-bottom: 9px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; font-weight: 700;">
                    <span style="font-size: 1.01em; color: ${headingColor};">${degree}</span>
                    <span style="font-size: 0.88em; font-weight: 600; opacity: 0.85;">${startYear} – ${endYear}</span>
                </div>
                <div style="font-size: 0.91em; opacity: 0.9; margin-top: 2px;">
                    ${institution}${location ? ` | ${location}` : ''}
                    ${grade ? `<span style="font-size: 0.88em; opacity: 0.85; margin-left: 8px;">• ${grade}</span>` : ''}
                </div>
            </div>
        `;
    }).join('');

    return `
    <div class="resume-section-wrap" style="margin-bottom: 12px;">
        ${sectionTitle('Education', headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle)}
        ${itemsHtml}
    </div>`;
}

function renderSkillsBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle) {
    const rawList = data.skills || [];
    const hasUserSkills = rawList.length > 0 && rawList.some(s => s && s.trim().length > 0);
    const list = hasUserSkills ? rawList.filter(s => s && s.trim().length > 0) : DEMO_RESUME.skills;

    const skillsHtml = list.map(s => `
        <span style="
            display: inline-block;
            background: #f1f5f9;
            color: #1e293b;
            padding: 3px 9px;
            margin: 2px 4px 4px 0;
            border-radius: 4px;
            font-size: 0.88em;
            font-weight: 500;
            border: 1px solid #cbd5e1;
        ">${escapeHtml(s)}</span>
    `).join('');

    return `
    <div class="resume-section-wrap" style="margin-bottom: 12px;">
        ${sectionTitle('Skills', headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle)}
        <div style="line-height: 1.8;">${skillsHtml}</div>
    </div>`;
}

function renderProjectsBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle) {
    const rawList = data.projects || [];
    const hasUserProjects = rawList.length > 0 && rawList.some(p => (p.name || p.description || p.technologies));
    const list = hasUserProjects ? rawList : DEMO_RESUME.projects;

    const itemsHtml = list.map(p => {
        const name = phText(p.name, 'Project Name');
        const tech = p.technologies ? escapeHtml(p.technologies) : '';
        const link = p.link ? escapeHtml(p.link) : '';
        const desc = phText(p.description, '• Full-stack web application designed with modern architecture and responsive UI.');

        return `
            <div style="margin-bottom: 9px;">
                <div style="display: flex; justify-content: space-between; align-items: baseline; font-weight: 700;">
                    <span style="font-size: 1.01em; color: ${headingColor};">${name}</span>
                    ${link ? `<a href="${link}" target="_blank" style="color:${headingColor}; font-size:0.85em; font-weight:500; text-decoration:none;">🔗 Link</a>` : ''}
                </div>
                ${tech ? `<div style="font-size: 0.85em; font-weight: 600; opacity: 0.82; margin: 2px 0;">Technologies: ${tech}</div>` : ''}
                <div style="font-size: 0.91em; line-height: 1.45; margin-top: 2px; white-space: pre-wrap;">${desc}</div>
            </div>
        `;
    }).join('');

    return `
    <div class="resume-section-wrap" style="margin-bottom: 12px;">
        ${sectionTitle('Projects', headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle)}
        ${itemsHtml}
    </div>`;
}

function renderCertBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle) {
    const rawList = data.certifications || [];
    const hasUserCerts = rawList.length > 0 && rawList.some(c => (c.name || c.organization));
    const list = hasUserCerts ? rawList : DEMO_RESUME.certifications;

    const itemsHtml = list.map(c => {
        const name = phText(c.name, 'Certification Name');
        const org = phText(c.organization, 'Issuing Organization');
        const date = phText(c.date, '2023');

        return `
            <div style="margin-bottom: 6px; display: flex; justify-content: space-between; align-items: baseline;">
                <div>
                    <strong style="color: ${headingColor};">${name}</strong>
                    <span style="font-size: 0.9em; opacity: 0.85;"> — ${org}</span>
                </div>
                <span style="font-size: 0.88em; opacity: 0.8; font-weight: 500;">${date}</span>
            </div>
        `;
    }).join('');

    return `
    <div class="resume-section-wrap" style="margin-bottom: 12px;">
        ${sectionTitle('Certifications', headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle)}
        ${itemsHtml}
    </div>`;
}

function renderAchievementsBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle) {
    const rawList = data.achievements || [];
    const hasUserList = rawList.length > 0 && rawList.some(a => a && a.trim().length > 0);
    const list = hasUserList ? rawList.filter(a => a && a.trim().length > 0) : DEMO_RESUME.achievements;

    const itemsHtml = `<ul style="margin: 0; padding-left: 18px; line-height: 1.5;">` + 
        list.map(a => `<li style="margin-bottom: 4px; font-size: 0.93em;">${escapeHtml(a)}</li>`).join('') + 
        `</ul>`;

    return `
    <div class="resume-section-wrap" style="margin-bottom: 12px;">
        ${sectionTitle('Achievements', headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle)}
        ${itemsHtml}
    </div>`;
}

function renderLanguagesBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle) {
    const rawList = data.languages || [];
    const hasUserList = rawList.length > 0 && rawList.some(l => l && l.trim().length > 0);
    const list = hasUserList ? rawList.filter(l => l && l.trim().length > 0) : DEMO_RESUME.languages;

    return `
    <div class="resume-section-wrap" style="margin-bottom: 12px;">
        ${sectionTitle('Languages', headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle)}
        <p style="margin: 0; font-size: 0.93em;">${escapeHtml(list.join(' • '))}</p>
    </div>`;
}

function renderHobbiesBlock(data, headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle) {
    const rawList = data.hobbies || [];
    const hasUserList = rawList.length > 0 && rawList.some(h => h && h.trim().length > 0);
    const list = hasUserList ? rawList.filter(h => h && h.trim().length > 0) : DEMO_RESUME.hobbies;

    return `
    <div class="resume-section-wrap" style="margin-bottom: 12px;">
        ${sectionTitle('Hobbies & Interests', headingColor, borderColor, underlineStyle, textTransform, headSize, dividerStyle)}
        <p style="margin: 0; font-size: 0.93em;">${escapeHtml(list.join(' • '))}</p>
    </div>`;
}

// =========================================================
// 10 INDIVIDUAL TEMPLATES
// =========================================================

// 1. CLASSIC TEMPLATE
function renderClassic(data, name, title, email, phone, location, linkedin, github, portfolio, color, headingColor, bodyColor, borderColor, underline, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle) {
    const contactParts = [email, phone, location].filter(Boolean).map(escapeHtml);
    const linkParts = [linkedin, github, portfolio].filter(Boolean).map(escapeHtml);

    return `
    <div>
        <div style="background: ${color}; color: white; padding: 22px; text-align: center; margin-bottom: ${secSpacing}; border-radius: ${bRadius}; border: 2px solid ${borderColor};">
            <div style="font-size: ${nameSize}; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">
                ${escapeHtml(name)}
            </div>
            <div style="font-size: 1.1em; margin-top: 4px; opacity: 0.95; font-weight: 500;">
                ${escapeHtml(title)}
            </div>
            <div style="font-size: 0.92em; margin-top: 8px; opacity: 0.92;">
                ${contactParts.join(' | ')}
            </div>
            ${linkParts.length > 0 ? `
            <div style="font-size: 0.88em; margin-top: 5px; display: flex; justify-content: center; flex-wrap: wrap; gap: 14px; opacity: 0.9;">
                ${linkParts.map(l => `<span>${l}</span>`).join('')}
            </div>` : ''}
        </div>
        ${renderOrderedSections(data, headingColor, borderColor, underline, secSpacing, tTransform, headSize, dividerStyle)}
    </div>`;
}

// 2. MODERN TEMPLATE
function renderModern(data, name, title, email, phone, location, linkedin, github, portfolio, color, headingColor, bodyColor, borderColor, underline, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle) {
    return `
    <div>
        <div style="background: ${color}; color: white; padding: 24px; border-radius: ${bRadius}; border: 2px solid ${borderColor}; margin-bottom: ${secSpacing};">
            <div style="font-size: ${nameSize}; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
                ${escapeHtml(name)}
            </div>
            <div style="font-size: 1.15em; margin-top: 4px; font-weight: 400; opacity: 0.95;">
                ${escapeHtml(title)}
            </div>
            <div style="font-size: 0.91em; margin-top: 12px; display: flex; flex-wrap: wrap; gap: 14px; opacity: 0.92;">
                ${email ? `<span>✉ ${escapeHtml(email)}</span>` : ''}
                ${phone ? `<span>📱 ${escapeHtml(phone)}</span>` : ''}
                ${location ? `<span>📍 ${escapeHtml(location)}</span>` : ''}
                ${linkedin ? `<span>🔗 ${escapeHtml(linkedin)}</span>` : ''}
                ${github ? `<span>💻 ${escapeHtml(github)}</span>` : ''}
                ${portfolio ? `<span>🌐 ${escapeHtml(portfolio)}</span>` : ''}
            </div>
        </div>
        ${renderOrderedSections(data, headingColor, borderColor, underline, secSpacing, tTransform, headSize, dividerStyle)}
    </div>`;
}

// 3. CORPORATE TEMPLATE
function renderCorporate(data, name, title, email, phone, location, linkedin, github, portfolio, color, headingColor, bodyColor, borderColor, underline, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle) {
    const contactLine = [email, phone, location].filter(Boolean).map(escapeHtml).join(' | ');
    const linkLine = [linkedin, github, portfolio].filter(Boolean).map(escapeHtml).join(' | ');

    return `
    <div>
        <div style="border-bottom: 3px solid ${color}; padding-bottom: 14px; margin-bottom: ${secSpacing};">
            <div style="font-size: ${nameSize}; font-weight: 800; color: ${color}; text-transform: uppercase; letter-spacing: 0.5px;">
                ${escapeHtml(name)}
            </div>
            <div style="font-size: 1.15em; color: #475569; font-weight: 600; margin-top: 2px;">
                ${escapeHtml(title)}
            </div>
            <div style="font-size: 0.91em; color: #64748b; margin-top: 6px;">
                ${contactLine}
            </div>
            ${linkLine ? `<div style="font-size: 0.88em; color: #64748b; margin-top: 3px;">${linkLine}</div>` : ''}
        </div>
        ${renderOrderedSections(data, headingColor, borderColor, underline, secSpacing, tTransform, headSize, dividerStyle)}
    </div>`;
}

// 4. ELEGANT TEMPLATE
function renderElegant(data, name, title, email, phone, location, linkedin, github, portfolio, color, headingColor, bodyColor, borderColor, underline, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle) {
    const contactLine = [email, phone, location].filter(Boolean).map(escapeHtml).join(' • ');
    const linkLine = [linkedin, github, portfolio].filter(Boolean).map(escapeHtml).join(' • ');

    return `
    <div>
        <div style="text-align: center; border-bottom: 1px solid ${borderColor}; padding-bottom: 16px; margin-bottom: ${secSpacing};">
            <div style="font-size: ${nameSize}; font-family: Georgia, serif; font-weight: 700; color: ${color}; letter-spacing: 2px; text-transform: uppercase;">
                ${escapeHtml(name)}
            </div>
            <div style="font-size: 1.1em; font-style: italic; color: #475569; margin-top: 4px;">
                ${escapeHtml(title)}
            </div>
            <div style="font-size: 0.9em; color: #64748b; margin-top: 8px; letter-spacing: 0.5px;">
                ${contactLine}
            </div>
            ${linkLine ? `<div style="font-size: 0.86em; color: #64748b; margin-top: 4px; letter-spacing: 0.5px;">${linkLine}</div>` : ''}
        </div>
        ${renderOrderedSections(data, headingColor, borderColor, underline, secSpacing, tTransform, headSize, dividerStyle)}
    </div>`;
}

// 5. TECH DEV TEMPLATE
function renderTech(data, name, title, email, phone, location, linkedin, github, portfolio, color, headingColor, bodyColor, borderColor, underline, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle) {
    return `
    <div>
        <div style="background: #0f172a; color: #38bdf8; padding: 20px; border-radius: ${bRadius}; margin-bottom: ${secSpacing}; border-left: 6px solid ${color};">
            <div style="font-size: ${nameSize}; font-weight: 700; color: #f8fafc; font-family: monospace;">
                &gt; ${escapeHtml(name)}
            </div>
            <div style="font-size: 1.05em; color: ${color}; margin-top: 4px; font-weight: 500; font-family: monospace;">
                // ${escapeHtml(title)}
            </div>
            <div style="font-size: 0.88em; color: #94a3b8; margin-top: 8px; font-family: monospace; display: flex; flex-wrap: wrap; gap: 10px;">
                ${email ? `<span>[email: ${escapeHtml(email)}]</span>` : ''}
                ${phone ? `<span>[phone: ${escapeHtml(phone)}]</span>` : ''}
                ${location ? `<span>[location: ${escapeHtml(location)}]</span>` : ''}
                ${github ? `<span>[github: ${escapeHtml(github)}]</span>` : ''}
                ${linkedin ? `<span>[linkedin: ${escapeHtml(linkedin)}]</span>` : ''}
                ${portfolio ? `<span>[web: ${escapeHtml(portfolio)}]</span>` : ''}
            </div>
        </div>
        ${renderOrderedSections(data, headingColor, borderColor, underline, secSpacing, tTransform, headSize, dividerStyle)}
    </div>`;
}

// 6. CREATIVE TEMPLATE
function renderCreative(data, name, title, email, phone, location, linkedin, github, portfolio, color, headingColor, bodyColor, borderColor, underline, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle) {
    return `
    <div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 4px solid ${color}; padding-bottom: 14px; margin-bottom: ${secSpacing};">
            <div>
                <div style="font-size: ${nameSize}; font-weight: 900; color: ${color}; letter-spacing: -0.5px; text-transform: uppercase;">
                    ${escapeHtml(name)}
                </div>
                <div style="font-size: 1.15em; color: #334155; font-weight: 600;">
                    ${escapeHtml(title)}
                </div>
            </div>
            <div style="text-align: right; font-size: 0.88em; color: #64748b; line-height: 1.4;">
                ${email ? `<div>${escapeHtml(email)}</div>` : ''}
                ${phone ? `<div>${escapeHtml(phone)}</div>` : ''}
                ${location ? `<div>${escapeHtml(location)}</div>` : ''}
                ${linkedin ? `<div>${escapeHtml(linkedin)}</div>` : ''}
                ${portfolio ? `<div>${escapeHtml(portfolio)}</div>` : ''}
            </div>
        </div>
        ${renderOrderedSections(data, headingColor, borderColor, underline, secSpacing, tTransform, headSize, dividerStyle)}
    </div>`;
}

// 7. EXECUTIVE TEMPLATE
function renderExecutive(data, name, title, email, phone, location, linkedin, github, portfolio, color, headingColor, bodyColor, borderColor, underline, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle) {
    const contactLine = [email, phone, location, linkedin, portfolio].filter(Boolean).map(escapeHtml).join(' | ');

    return `
    <div>
        <div style="border-left: 6px solid ${color}; padding-left: 18px; margin-bottom: ${secSpacing};">
            <div style="font-size: ${nameSize}; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">
                ${escapeHtml(name)}
            </div>
            <div style="font-size: 1.18em; color: ${color}; font-weight: 700; margin-top: 2px;">
                ${escapeHtml(title)}
            </div>
            <div style="font-size: 0.9em; color: #475569; margin-top: 6px;">
                ${contactLine}
            </div>
        </div>
        ${renderOrderedSections(data, headingColor, borderColor, underline, secSpacing, tTransform, headSize, dividerStyle)}
    </div>`;
}

// 8. STUDENT TEMPLATE
function renderStudent(data, name, title, email, phone, location, linkedin, github, portfolio, color, headingColor, bodyColor, borderColor, underline, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle) {
    const contactLine = [email, phone, location].filter(Boolean).map(escapeHtml).join(' | ');
    const linkLine = [linkedin, github, portfolio].filter(Boolean).map(escapeHtml).join(' | ');

    return `
    <div>
        <div style="background: #f8fafc; border: 2px solid ${color}; border-radius: ${bRadius}; padding: 18px; text-align: center; margin-bottom: ${secSpacing};">
            <div style="font-size: ${nameSize}; font-weight: 800; color: ${color}; text-transform: uppercase;">
                ${escapeHtml(name)}
            </div>
            <div style="font-size: 1.1em; color: #334155; font-weight: 600; margin-top: 2px;">
                ${escapeHtml(title)}
            </div>
            <div style="font-size: 0.9em; color: #64748b; margin-top: 6px;">
                ${contactLine}
            </div>
            ${linkLine ? `<div style="font-size: 0.86em; color: #64748b; margin-top: 3px;">${linkLine}</div>` : ''}
        </div>
        ${renderOrderedSections(data, headingColor, borderColor, underline, secSpacing, tTransform, headSize, dividerStyle)}
    </div>`;
}

// 9. TWO COLUMN TEMPLATE
function renderTwoColumn(data, name, title, email, phone, location, linkedin, github, portfolio, color, headingColor, bodyColor, borderColor, underline, bRadius, secSpacing, tTransform, headSize, nameSize, dividerStyle) {
    const contactLine = [email, phone, location].filter(Boolean).map(escapeHtml).join(' | ');
    const linkLine = [linkedin, github, portfolio].filter(Boolean).map(escapeHtml).join(' | ');

    return `
    <div>
        <div style="background: ${color}; color: white; padding: 20px; border-radius: ${bRadius}; margin-bottom: ${secSpacing};">
            <div style="font-size: ${nameSize}; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">
                ${escapeHtml(name)}
            </div>
            <div style="font-size: 1.1em; opacity: 0.95; font-weight: 500; margin-top: 2px;">
                ${escapeHtml(title)}
            </div>
            <div style="font-size: 0.9em; margin-top: 8px; opacity: 0.92;">
                ${contactLine}
            </div>
            ${linkLine ? `<div style="font-size: 0.86em; margin-top: 4px; opacity: 0.88;">${linkLine}</div>` : ''}
        </div>
        <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 20px;">
            <div>
                ${renderSummaryBlock(data, headingColor, borderColor, underline, tTransform, headSize, dividerStyle)}
                ${renderExpBlock(data, headingColor, borderColor, underline, tTransform, headSize, dividerStyle)}
                ${renderProjectsBlock(data, headingColor, borderColor, underline, tTransform, headSize, dividerStyle)}
            </div>
            <div>
                ${renderEduBlock(data, headingColor, borderColor, underline, tTransform, headSize, dividerStyle)}
                ${renderSkillsBlock(data, headingColor, borderColor, underline, tTransform, headSize, dividerStyle)}
                ${renderCertBlock(data, headingColor, borderColor, underline, tTransform, headSize, dividerStyle)}
                ${renderAchievementsBlock(data, headingColor, borderColor, underline, tTransform, headSize, dividerStyle)}
                ${renderLanguagesBlock(data, headingColor, borderColor, underline, tTransform, headSize, dividerStyle)}
                ${renderHobbiesBlock(data, headingColor, borderColor, underline, tTransform, headSize, dividerStyle)}
            </div>
        </div>
    </div>`;
}

// 10. ATS FRIENDLY MODE
function renderAtsMode(data, name, title, email, phone, location, linkedin, github, portfolio, design) {
    const headSize = (design && design.headingFontSize) || '12pt';
    const nameSize = (design && design.nameFontSize) || '20pt';
    const contactLine = [email, phone, location].filter(Boolean).map(escapeHtml).join(' | ');
    const linkLine = [linkedin, github, portfolio].filter(Boolean).map(escapeHtml).join(' | ');

    return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.45; font-size: 10.5pt;">
        <div style="border-bottom: 2px solid #111827; padding-bottom: 8px; margin-bottom: 14px; text-align: center;">
            <div style="font-size: ${nameSize}; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px;">
                ${escapeHtml(name)}
            </div>
            <div style="font-size: 1.1em; font-weight: 600; margin-top: 2px;">
                ${escapeHtml(title)}
            </div>
            <div style="font-size: 0.9em; margin-top: 4px;">
                ${contactLine}
            </div>
            ${linkLine ? `<div style="font-size: 0.88em; margin-top: 2px;">${linkLine}</div>` : ''}
        </div>
        ${renderOrderedSections(data, '#111827', '#111827', '', '12px', 'uppercase', headSize, 'solid')}
    </div>`;
}
