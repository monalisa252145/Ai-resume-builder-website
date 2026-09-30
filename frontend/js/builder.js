// Resume Builder & Customization Studio Controller
checkAuth();

let currentResumeId = null;
let currentTemplate = 'classic';

// PHASE 1: Clean initial state with ZERO hardcoded demo data
let resumeData = {
    title: '',
    template: 'classic',
    personalInfo: {
        fullName: '',
        professionalTitle: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: '',
        portfolio: ''
    },
    summary: '',
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
    hobbies: []
};

// PHASE 4: Distinct Design & Layout Settings Architecture
window.resumeDesign = {
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
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
        achievements: true,
        languages: true,
        hobbies: true
    }
};

// Undo / Redo History Stacks (Phase 14)
const undoStack = [];
const redoStack = [];
const MAX_HISTORY = 30;

function pushDesignHistory() {
    undoStack.push(JSON.stringify(window.resumeDesign));
    if (undoStack.length > MAX_HISTORY) undoStack.shift();
    redoStack.length = 0; // Clear redo on new action
    updateUndoRedoButtons();
}

function updateUndoRedoButtons() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    if (undoBtn) undoBtn.disabled = undoStack.length === 0;
    if (redoBtn) redoBtn.disabled = redoStack.length === 0;
}

function undoCustomization() {
    if (undoStack.length === 0) return;
    redoStack.push(JSON.stringify(window.resumeDesign));
    const previous = JSON.parse(undoStack.pop());
    window.resumeDesign = previous;
    syncDesignControlsToState();
    updatePreview();
    updateUndoRedoButtons();
}

function redoCustomization() {
    if (redoStack.length === 0) return;
    undoStack.push(JSON.stringify(window.resumeDesign));
    const next = JSON.parse(redoStack.pop());
    window.resumeDesign = next;
    syncDesignControlsToState();
    updatePreview();
    updateUndoRedoButtons();
}

// Keyboard shortcuts for Undo / Redo
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undoCustomization();
    } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redoCustomization();
    }
});

let autoSaveTimer = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const resumeId = urlParams.get('id');
    const templateParam = urlParams.get('template');

    if (templateParam) {
        currentTemplate = templateParam;
        resumeData.template = templateParam;
    }

    if (resumeId) {
        currentResumeId = resumeId;
        await loadResumeFromBackend(resumeId);
    } else {
        checkLocalDraft();
        populateForm(resumeData);
    }

    renderSkillsList();
    renderEducationList();
    renderExperienceList();
    renderProjectsList();
    renderCertificationsList();
    renderSectionReorderList();
    renderVisibilitySwitches();
    highlightSelectedTemplateTab(currentTemplate);
    syncDesignControlsToState();
    updatePreview();
});

// Check if draft exists in local storage
function checkLocalDraft() {
    const draft = localStorage.getItem('resumeDraft');
    if (draft && !currentResumeId) {
        try {
            const parsedDraft = JSON.parse(draft);
            if (parsedDraft && (parsedDraft.personalInfo?.fullName || parsedDraft.title)) {
                const draftAlert = document.getElementById('draftAlert');
                if (draftAlert) {
                    draftAlert.innerHTML = `
                        <div class="alert alert-info" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                            <span>📋 We found an unsaved local draft. Would you like to recover it?</span>
                            <div style="display:flex; gap:8px;">
                                <button class="btn btn-primary btn-sm" onclick="recoverDraft()">Recover</button>
                                <button class="btn btn-secondary btn-sm" onclick="discardDraft()">Discard</button>
                            </div>
                        </div>`;
                }
            }
        } catch (e) {
            localStorage.removeItem('resumeDraft');
        }
    }
}

function recoverDraft() {
    const draft = localStorage.getItem('resumeDraft');
    if (draft) {
        resumeData = JSON.parse(draft);
        currentTemplate = resumeData.template || 'classic';
        populateForm(resumeData);
        renderSkillsList();
        renderEducationList();
        renderExperienceList();
        renderProjectsList();
        renderCertificationsList();
        highlightSelectedTemplateTab(currentTemplate);
        updatePreview();
        showToast('Draft recovered successfully!', 'success');
    }
    document.getElementById('draftAlert').innerHTML = '';
}

function discardDraft() {
    localStorage.removeItem('resumeDraft');
    document.getElementById('draftAlert').innerHTML = '';
    showToast('Local draft discarded', 'default');
}

// Load from Spring Boot backend
async function loadResumeFromBackend(id) {
    try {
        setSaveStatus('Loading...');
        const res = await API.get('/api/resumes/' + id);
        if (res && res.success && res.data) {
            resumeData = res.data;
            currentTemplate = resumeData.template || 'classic';
            populateForm(resumeData);
            setSaveStatus('💾 Ready');
        } else {
            showToast('Failed to load resume details', 'error');
        }
    } catch (e) {
        showToast('Error connecting to backend server', 'error');
    }
}

function getVal(id, altId) {
    const el = document.getElementById(id) || (altId ? document.getElementById(altId) : null);
    return el ? el.value.trim() : '';
}

function setVal(id, altId, val) {
    const el = document.getElementById(id) || (altId ? document.getElementById(altId) : null);
    if (el) el.value = val || '';
}

// Populate HTML inputs from resumeData
function populateForm(data) {
    if (!data) return;
    setVal('resumeTitle', null, data.title);
    if (data.template) currentTemplate = data.template;

    const info = data.personalInfo || {};
    setVal('fullName', null, info.fullName);
    setVal('professionalTitle', 'jobTitle', info.professionalTitle || info.jobTitle);
    setVal('email', null, info.email);
    setVal('phone', null, info.phone);
    setVal('location', null, info.location);
    setVal('linkedin', null, info.linkedin);
    setVal('github', null, info.github);
    setVal('portfolio', 'website', info.portfolio || info.website);

    setVal('summary', null, data.summary);
    setVal('achievements', null, Array.isArray(data.achievements) ? data.achievements.join('\n') : (data.achievements || ''));
    setVal('languages', null, Array.isArray(data.languages) ? data.languages.join(', ') : (data.languages || ''));
    setVal('hobbies', null, Array.isArray(data.hobbies) ? data.hobbies.join(', ') : (data.hobbies || ''));
}

// Collect data from form into resumeData object
function collectFormData() {
    resumeData.title = getVal('resumeTitle') || 'Untitled Resume';
    resumeData.template = currentTemplate;

    resumeData.personalInfo = {
        fullName: getVal('fullName'),
        professionalTitle: getVal('professionalTitle', 'jobTitle'),
        email: getVal('email'),
        phone: getVal('phone'),
        location: getVal('location'),
        linkedin: getVal('linkedin'),
        github: getVal('github'),
        portfolio: getVal('portfolio', 'website')
    };

    resumeData.summary = getVal('summary');

    const achText = getVal('achievements');
    resumeData.achievements = achText ? achText.split('\n').map(s => s.trim()).filter(Boolean) : [];

    const langText = getVal('languages');
    resumeData.languages = langText ? langText.split(',').map(s => s.trim()).filter(Boolean) : [];

    const hobText = getVal('hobbies');
    resumeData.hobbies = hobText ? hobText.split(',').map(s => s.trim()).filter(Boolean) : [];

    return resumeData;
}

// Update live preview immediately (Phase 22)
function updatePreview() {
    collectFormData();
    const previewContainer = document.getElementById('resumePreview');
    if (!previewContainer) return;

    previewContainer.style.padding = window.resumeDesign.pageMargin || '20mm';
    previewContainer.innerHTML = renderTemplate(resumeData, currentTemplate, window.resumeDesign);
}

// Auto-save scheduler
function scheduleAutoSave() {
    setSaveStatus('Saving...');
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        saveDraftLocally();
    }, 1200);
}

function saveDraftLocally() {
    collectFormData();
    localStorage.setItem('resumeDraft', JSON.stringify(resumeData));
    setSaveStatus('Saved (Draft)');
}

function setSaveStatus(status) {
    const el = document.getElementById('saveStatus');
    if (!el) return;
    el.className = 'save-status';
    if (status.includes('Saving')) {
        el.classList.add('saving');
        el.textContent = '⏳ Saving...';
    } else if (status.includes('Saved')) {
        el.classList.add('saved');
        el.textContent = '✅ Saved';
    } else {
        el.textContent = status;
    }
}

// Save Resume to Backend
async function saveResume() {
    collectFormData();
    setSaveStatus('Saving...');
    try {
        let res;
        if (currentResumeId) {
            res = await API.put('/api/resumes/' + currentResumeId, resumeData);
        } else {
            res = await API.post('/api/resumes', resumeData);
        }

        if (res && res.success && res.data) {
            currentResumeId = res.data.id;
            setSaveStatus('Saved');
            showToast('Resume saved successfully!', 'success');
            localStorage.removeItem('resumeDraft');
            const newUrl = window.location.pathname + '?id=' + currentResumeId;
            window.history.replaceState(null, '', newUrl);
        } else {
            showToast('Failed to save resume: ' + (res.message || 'Unknown error'), 'error');
            setSaveStatus('Error saving');
        }
    } catch (e) {
        showToast('Error connecting to backend server', 'error');
        setSaveStatus('Error saving');
    }
}

// =========================================================
// CUSTOMIZE RESUME STUDIO CONTROLLERS (Phases 5-17)
// =========================================================

function switchStudioTab(tabId, btn) {
    document.querySelectorAll('.studio-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.studio-tab-pane').forEach(p => p.classList.remove('active'));

    if (btn) btn.classList.add('active');
    const targetPane = document.getElementById(tabId);
    if (targetPane) targetPane.classList.add('active');
}

// Preset Palettes (Phase 6)
const PALETTES = {
    blue: { primary: '#1976d2', heading: '#1976d2', body: '#334155', border: '#e2e8f0', bg: '#ffffff' },
    navy: { primary: '#0f172a', heading: '#0f172a', body: '#334155', border: '#38bdf8', bg: '#ffffff' },
    emerald: { primary: '#059669', heading: '#065f46', body: '#334155', border: '#a7f3d0', bg: '#ffffff' },
    purple: { primary: '#7c3aed', heading: '#6d28d9', body: '#334155', border: '#ddd6fe', bg: '#ffffff' },
    orange: { primary: '#ea580c', heading: '#c2410c', body: '#334155', border: '#fed7aa', bg: '#ffffff' },
    burgundy: { primary: '#991b1b', heading: '#7f1d1d', body: '#334155', border: '#fecaca', bg: '#ffffff' },
    corporate: { primary: '#475569', heading: '#1e293b', body: '#334155', border: '#cbd5e1', bg: '#ffffff' },
    minimal: { primary: '#18181b', heading: '#18181b', body: '#27272a', border: '#e4e4e7', bg: '#ffffff' }
};

function applyPresetPalette(key, chip) {
    pushDesignHistory();
    const p = PALETTES[key];
    if (!p) return;

    window.resumeDesign.primaryColor = p.primary;
    window.resumeDesign.headingColor = p.heading;
    window.resumeDesign.bodyColor = p.body;
    window.resumeDesign.borderColor = p.border;
    window.resumeDesign.backgroundColor = p.bg;

    document.querySelectorAll('.palette-preset-chip').forEach(c => c.classList.remove('active'));
    if (chip) chip.classList.add('active');

    syncDesignControlsToState();
    updatePreview();
}

function updateDesignColor(key, value) {
    pushDesignHistory();
    window.resumeDesign[key] = value;
    syncDesignControlsToState();
    updatePreview();
}

function setFontFamily(font) {
    pushDesignHistory();
    window.resumeDesign.fontFamily = font;
    updatePreview();
}

function adjustSizeProp(prop, delta) {
    pushDesignHistory();
    let currentVal = parseFloat(window.resumeDesign[prop] || '10');
    currentVal = Math.max(7, Math.min(36, currentVal + delta));
    const unit = prop.toLowerCase().includes('spacing') ? 'px' : 'pt';
    window.resumeDesign[prop] = currentVal.toFixed(1) + unit;
    syncDesignControlsToState();
    updatePreview();
}

function setFontWeight(val) {
    pushDesignHistory();
    window.resumeDesign.fontWeight = val;
    updatePreview();
}

function setLineHeight(val) {
    pushDesignHistory();
    window.resumeDesign.lineHeight = val;
    updatePreview();
}

function setTextAlign(align, btn) {
    pushDesignHistory();
    window.resumeDesign.textAlign = align;
    document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    updatePreview();
}

function toggleBold() {
    pushDesignHistory();
    window.resumeDesign.isBold = !window.resumeDesign.isBold;
    document.getElementById('boldToggleBtn')?.classList.toggle('active', window.resumeDesign.isBold);
    updatePreview();
}

function toggleUnderline() {
    pushDesignHistory();
    window.resumeDesign.isUnderline = !window.resumeDesign.isUnderline;
    document.getElementById('underlineToggleBtn')?.classList.toggle('active', window.resumeDesign.isUnderline);
    updatePreview();
}

function toggleItalic() {
    pushDesignHistory();
    window.resumeDesign.isItalic = !window.resumeDesign.isItalic;
    document.getElementById('italicToggleBtn')?.classList.toggle('active', window.resumeDesign.isItalic);
    updatePreview();
}

function setTextTransform(val) {
    pushDesignHistory();
    window.resumeDesign.textTransform = val;
    updatePreview();
}

function setPageMargins(val) {
    pushDesignHistory();
    window.resumeDesign.pageMargin = val;
    updatePreview();
}

function setSectionSpacing(val) {
    pushDesignHistory();
    window.resumeDesign.sectionSpacing = val;
    updatePreview();
}

function setDividerStyle(val) {
    pushDesignHistory();
    window.resumeDesign.dividerStyle = val;
    updatePreview();
}

function setBorderRadius(val) {
    pushDesignHistory();
    window.resumeDesign.borderRadius = val;
    updatePreview();
}

function toggleAtsMode(force) {
    pushDesignHistory();
    if (typeof force === 'boolean') {
        window.resumeDesign.atsFriendlyMode = force;
    } else {
        window.resumeDesign.atsFriendlyMode = !window.resumeDesign.atsFriendlyMode;
    }
    const chk = document.getElementById('atsModeCheckbox');
    if (chk) chk.checked = window.resumeDesign.atsFriendlyMode;
    const label = document.getElementById('atsModeLabel');
    if (label) label.textContent = window.resumeDesign.atsFriendlyMode ? 'ON' : 'OFF';
    updatePreview();
}

// Reset ONLY design settings (Phase 15)
function resetDesignSettings() {
    pushDesignHistory();
    window.resumeDesign = {
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
    syncDesignControlsToState();
    renderSectionReorderList();
    renderVisibilitySwitches();
    updatePreview();
    showToast('Design settings reset to default', 'default');
}

// Reset all resume data with clear confirmation
function resetAllFormData() {
    if (!confirm('Are you sure you want to clear all entered resume content? This cannot be undone.')) return;
    resumeData = {
        title: '',
        template: currentTemplate,
        personalInfo: { fullName: '', professionalTitle: '', email: '', phone: '', location: '', linkedin: '', github: '', portfolio: '' },
        summary: '',
        education: [],
        experience: [],
        skills: [],
        projects: [],
        certifications: [],
        achievements: [],
        languages: [],
        hobbies: []
    };
    populateForm(resumeData);
    renderSkillsList();
    renderEducationList();
    renderExperienceList();
    renderProjectsList();
    renderCertificationsList();
    localStorage.removeItem('resumeDraft');
    updatePreview();
    showToast('Resume data cleared', 'default');
}

// Sync UI controls with current window.resumeDesign state
function syncDesignControlsToState() {
    const d = window.resumeDesign;
    const pPicker = document.getElementById('primaryColorPicker');
    const pHex = document.getElementById('primaryColorHex');
    if (pPicker) pPicker.value = d.primaryColor;
    if (pHex) pHex.value = d.primaryColor.toUpperCase();

    const hPicker = document.getElementById('headingColorPicker');
    const hHex = document.getElementById('headingColorHex');
    if (hPicker) hPicker.value = d.headingColor;
    if (hHex) hHex.value = d.headingColor.toUpperCase();

    const bPicker = document.getElementById('bodyColorPicker');
    const bHex = document.getElementById('bodyColorHex');
    if (bPicker) bPicker.value = d.bodyColor;
    if (bHex) bHex.value = d.bodyColor.toUpperCase();

    const brdPicker = document.getElementById('borderColorPicker');
    const brdHex = document.getElementById('borderColorHex');
    if (brdPicker) brdPicker.value = d.borderColor;
    if (brdHex) brdHex.value = d.borderColor.toUpperCase();

    const bgPicker = document.getElementById('bgColorPicker');
    const bgHex = document.getElementById('bgColorHex');
    if (bgPicker) bgPicker.value = d.backgroundColor;
    if (bgHex) bgHex.value = d.backgroundColor.toUpperCase();

    const fSelect = document.getElementById('fontFamilySelect');
    if (fSelect && d.fontFamily) fSelect.value = d.fontFamily;

    const nVal = document.getElementById('nameFontSizeVal');
    if (nVal) nVal.textContent = d.nameFontSize;

    const hVal = document.getElementById('headingFontSizeVal');
    if (hVal) hVal.textContent = d.headingFontSize;

    const bVal = document.getElementById('bodyFontSizeVal');
    if (bVal) bVal.textContent = d.bodyFontSize;

    const lsVal = document.getElementById('letterSpacingVal');
    if (lsVal) lsVal.textContent = d.letterSpacing;

    const fwSelect = document.getElementById('fontWeightSelect');
    if (fwSelect) fwSelect.value = d.fontWeight;

    const lhSelect = document.getElementById('lineHeightSelect');
    if (lhSelect) lhSelect.value = d.lineHeight;

    const mSelect = document.getElementById('marginSelect');
    if (mSelect) mSelect.value = d.pageMargin;

    const spSelect = document.getElementById('sectionSpacingSelect');
    if (spSelect) spSelect.value = d.sectionSpacing;

    const divSelect = document.getElementById('dividerStyleSelect');
    if (divSelect) divSelect.value = d.dividerStyle;

    const radSelect = document.getElementById('borderRadiusSelect');
    if (radSelect) radSelect.value = d.borderRadius;

    const ttSelect = document.getElementById('textTransformSelect');
    if (ttSelect) ttSelect.value = d.textTransform;

    document.getElementById('boldToggleBtn')?.classList.toggle('active', d.isBold);
    document.getElementById('underlineToggleBtn')?.classList.toggle('active', d.isUnderline);
    document.getElementById('italicToggleBtn')?.classList.toggle('active', d.isItalic);

    const atsChk = document.getElementById('atsModeCheckbox');
    if (atsChk) atsChk.checked = d.atsFriendlyMode;
    const atsLbl = document.getElementById('atsModeLabel');
    if (atsLbl) atsLbl.textContent = d.atsFriendlyMode ? 'ON' : 'OFF';
}

// =========================================================
// SECTION REORDERING & DRAG-AND-DROP (Phase 9 & 10)
// =========================================================

const SECTION_LABELS = {
    summary: '📝 Professional Summary',
    experience: '💼 Work Experience',
    education: '🎓 Education',
    skills: '⚡ Skills',
    projects: '🚀 Projects',
    certifications: '🏆 Certifications',
    achievements: '🎖️ Achievements',
    languages: '🌐 Languages',
    hobbies: '🎨 Hobbies & Interests'
};

function renderSectionReorderList() {
    const container = document.getElementById('sectionReorderContainer');
    if (!container) return;

    const order = window.resumeDesign.sectionOrder || Object.keys(SECTION_LABELS);
    container.innerHTML = order.map((secKey, idx) => `
        <div class="reorder-item" draggable="true" data-index="${idx}" data-key="${secKey}">
            <div class="reorder-left">
                <span class="reorder-handle">☰</span>
                <span>${SECTION_LABELS[secKey] || secKey}</span>
            </div>
            <div class="reorder-actions">
                <button type="button" class="reorder-btn" onclick="moveSectionUp(${idx})" ${idx === 0 ? 'disabled' : ''} title="Move Up">▲</button>
                <button type="button" class="reorder-btn" onclick="moveSectionDown(${idx})" ${idx === order.length - 1 ? 'disabled' : ''} title="Move Down">▼</button>
            </div>
        </div>
    `).join('');

    initReorderDragAndDrop();
}

function moveSectionUp(index) {
    if (index <= 0) return;
    pushDesignHistory();
    const order = window.resumeDesign.sectionOrder;
    const temp = order[index];
    order[index] = order[index - 1];
    order[index - 1] = temp;
    renderSectionReorderList();
    updatePreview();
}

function moveSectionDown(index) {
    const order = window.resumeDesign.sectionOrder;
    if (index >= order.length - 1) return;
    pushDesignHistory();
    const temp = order[index];
    order[index] = order[index + 1];
    order[index + 1] = temp;
    renderSectionReorderList();
    updatePreview();
}

function initReorderDragAndDrop() {
    const items = document.querySelectorAll('.reorder-item');
    let draggedItem = null;

    items.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedItem = item;
            item.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        item.addEventListener('dragend', () => {
            if (draggedItem) draggedItem.classList.remove('dragging');
            draggedItem = null;
        });

        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        item.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!draggedItem || draggedItem === item) return;

            const fromIndex = parseInt(draggedItem.getAttribute('data-index'), 10);
            const toIndex = parseInt(item.getAttribute('data-index'), 10);

            pushDesignHistory();
            const order = window.resumeDesign.sectionOrder;
            const movedItem = order.splice(fromIndex, 1)[0];
            order.splice(toIndex, 0, movedItem);

            renderSectionReorderList();
            updatePreview();
        });
    });
}

// =========================================================
// SECTION VISIBILITY TOGGLES (Phase 11)
// =========================================================

function renderVisibilitySwitches() {
    const container = document.getElementById('visibilitySwitchesContainer');
    if (!container) return;

    const vis = window.resumeDesign.sectionVisibility;
    container.innerHTML = Object.keys(SECTION_LABELS).map(secKey => {
        const isChecked = vis[secKey] !== false;
        return `
            <div class="visibility-item">
                <span class="visibility-label">${SECTION_LABELS[secKey]}</span>
                <label class="switch-toggle">
                    <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleSectionVisibility('${secKey}', this.checked)">
                    <span class="switch-slider"></span>
                </label>
            </div>
        `;
    }).join('');
}

function toggleSectionVisibility(secKey, isVisible) {
    pushDesignHistory();
    window.resumeDesign.sectionVisibility[secKey] = isVisible;
    updatePreview();
}

// =========================================================
// TEMPLATE SELECTION (Phase 13)
// =========================================================

function selectTemplate(templateName, btn) {
    currentTemplate = templateName;
    resumeData.template = templateName;

    document.querySelectorAll('.template-tab').forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');

    updatePreview();
    scheduleAutoSave();
}

function highlightSelectedTemplateTab(templateName) {
    document.querySelectorAll('.template-tab').forEach(t => {
        if (t.textContent.toLowerCase().includes(templateName.toLowerCase())) {
            t.classList.add('active');
        } else {
            t.classList.remove('active');
        }
    });
}

// =========================================================
// DYNAMIC SECTION LISTS: Skills, Education, Exp, Projects, Certs
// =========================================================

// 1. Skills
function renderSkillsList() {
    const container = document.getElementById('skillsContainer');
    if (!container) return;
    container.innerHTML = (resumeData.skills || []).map((skill, index) => `
        <span class="skill-tag">
            ${escapeHtml(skill)}
            <button type="button" onclick="removeSkill(${index})">&times;</button>
        </span>
    `).join('');
}

function addSkill() {
    const input = document.getElementById('skillInput');
    const skill = input.value.trim();
    if (skill) {
        if (!resumeData.skills) resumeData.skills = [];
        resumeData.skills.push(skill);
        input.value = '';
        renderSkillsList();
        updatePreview();
        scheduleAutoSave();
    }
}

function addSkillOnEnter(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addSkill();
    }
}

function removeSkill(index) {
    resumeData.skills.splice(index, 1);
    renderSkillsList();
    updatePreview();
    scheduleAutoSave();
}

// 2. Education
function renderEducationList() {
    const container = document.getElementById('educationList');
    if (!container) return;
    container.innerHTML = (resumeData.education || []).map((edu, idx) => `
        <div class="entry-item">
            <button type="button" class="remove-btn" onclick="removeEducation(${idx})">✕ Remove</button>
            <div class="two-col-row">
                <div class="form-group">
                    <label>Degree / Certificate</label>
                    <input type="text" placeholder="e.g. B.Tech in Computer Science" value="${escapeHtml(edu.degree || '')}" oninput="updateEdu(${idx}, 'degree', this.value)">
                </div>
                <div class="form-group">
                    <label>Institution / University</label>
                    <input type="text" placeholder="Enter university/college name" value="${escapeHtml(edu.institution || '')}" oninput="updateEdu(${idx}, 'institution', this.value)">
                </div>
            </div>
            <div class="two-col-row">
                <div class="form-group">
                    <label>Start Year</label>
                    <input type="text" placeholder="e.g. 2018" value="${escapeHtml(edu.startYear || '')}" oninput="updateEdu(${idx}, 'startYear', this.value)">
                </div>
                <div class="form-group">
                    <label>End Year</label>
                    <input type="text" placeholder="e.g. 2022" value="${escapeHtml(edu.endYear || '')}" oninput="updateEdu(${idx}, 'endYear', this.value)">
                </div>
            </div>
            <div class="two-col-row">
                <div class="form-group" style="margin-bottom:0;">
                    <label>Location</label>
                    <input type="text" placeholder="e.g. Bengaluru, India" value="${escapeHtml(edu.location || '')}" oninput="updateEdu(${idx}, 'location', this.value)">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label>Grade / CGPA</label>
                    <input type="text" placeholder="e.g. 8.8 CGPA" value="${escapeHtml(edu.grade || '')}" oninput="updateEdu(${idx}, 'grade', this.value)">
                </div>
            </div>
        </div>
    `).join('');
}

function addEducation() {
    if (!resumeData.education) resumeData.education = [];
    resumeData.education.push({ degree: '', institution: '', location: '', startYear: '', endYear: '', grade: '' });
    renderEducationList();
    updatePreview();
    scheduleAutoSave();
}

function updateEdu(idx, field, value) {
    if (resumeData.education[idx]) {
        resumeData.education[idx][field] = value;
        updatePreview();
        scheduleAutoSave();
    }
}

function removeEducation(idx) {
    resumeData.education.splice(idx, 1);
    renderEducationList();
    updatePreview();
    scheduleAutoSave();
}

// 3. Experience
function renderExperienceList() {
    const container = document.getElementById('experienceList');
    if (!container) return;
    container.innerHTML = (resumeData.experience || []).map((exp, idx) => `
        <div class="entry-item">
            <button type="button" class="remove-btn" onclick="removeExperience(${idx})">✕ Remove</button>
            <div class="two-col-row">
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" placeholder="Enter job title" value="${escapeHtml(exp.jobTitle || '')}" oninput="updateExp(${idx}, 'jobTitle', this.value)">
                </div>
                <div class="form-group">
                    <label>Company Name</label>
                    <input type="text" placeholder="Enter company name" value="${escapeHtml(exp.company || '')}" oninput="updateExp(${idx}, 'company', this.value)">
                </div>
            </div>
            <div class="two-col-row">
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="text" placeholder="e.g. Jul 2022" value="${escapeHtml(exp.startDate || '')}" oninput="updateExp(${idx}, 'startDate', this.value)">
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <input type="text" placeholder="e.g. Present" value="${escapeHtml(exp.endDate || '')}" oninput="updateExp(${idx}, 'endDate', this.value)" ${exp.currentlyWorking ? 'disabled' : ''}>
                </div>
            </div>
            <div class="form-group">
                <label>Location</label>
                <input type="text" placeholder="e.g. Bengaluru, India" value="${escapeHtml(exp.location || '')}" oninput="updateExp(${idx}, 'location', this.value)">
            </div>
            <div class="form-group" style="margin-bottom:0;">
                <label>Job Responsibilities & Achievements</label>
                <textarea rows="3" placeholder="Describe your key responsibilities and impact..." oninput="updateExp(${idx}, 'description', this.value)">${escapeHtml(exp.description || '')}</textarea>
            </div>
        </div>
    `).join('');
}

function addExperience() {
    if (!resumeData.experience) resumeData.experience = [];
    resumeData.experience.push({ jobTitle: '', company: '', location: '', startDate: '', endDate: '', currentlyWorking: false, description: '' });
    renderExperienceList();
    updatePreview();
    scheduleAutoSave();
}

function updateExp(idx, field, value) {
    if (resumeData.experience[idx]) {
        resumeData.experience[idx][field] = value;
        updatePreview();
        scheduleAutoSave();
    }
}

function removeExperience(idx) {
    resumeData.experience.splice(idx, 1);
    renderExperienceList();
    updatePreview();
    scheduleAutoSave();
}

// 4. Projects
function renderProjectsList() {
    const container = document.getElementById('projectsList');
    if (!container) return;
    container.innerHTML = (resumeData.projects || []).map((proj, idx) => `
        <div class="entry-item">
            <button type="button" class="remove-btn" onclick="removeProject(${idx})">✕ Remove</button>
            <div class="two-col-row">
                <div class="form-group">
                    <label>Project Name</label>
                    <input type="text" placeholder="Enter project name" value="${escapeHtml(proj.name || '')}" oninput="updateProj(${idx}, 'name', this.value)">
                </div>
                <div class="form-group">
                    <label>Technologies Used</label>
                    <input type="text" placeholder="e.g. Java, Spring Boot, MongoDB" value="${escapeHtml(proj.technologies || '')}" oninput="updateProj(${idx}, 'technologies', this.value)">
                </div>
            </div>
            <div class="form-group">
                <label>Project Link / Repo</label>
                <input type="text" placeholder="e.g. github.com/yourname/project" value="${escapeHtml(proj.link || '')}" oninput="updateProj(${idx}, 'link', this.value)">
            </div>
            <div class="form-group" style="margin-bottom:0;">
                <label>Description</label>
                <textarea rows="2" placeholder="Describe your project and results..." oninput="updateProj(${idx}, 'description', this.value)">${escapeHtml(proj.description || '')}</textarea>
            </div>
        </div>
    `).join('');
}

function addProject() {
    if (!resumeData.projects) resumeData.projects = [];
    resumeData.projects.push({ name: '', technologies: '', link: '', description: '' });
    renderProjectsList();
    updatePreview();
    scheduleAutoSave();
}

function updateProj(idx, field, value) {
    if (resumeData.projects[idx]) {
        resumeData.projects[idx][field] = value;
        updatePreview();
        scheduleAutoSave();
    }
}

function removeProject(idx) {
    resumeData.projects.splice(idx, 1);
    renderProjectsList();
    updatePreview();
    scheduleAutoSave();
}

// 5. Certifications
function renderCertificationsList() {
    const container = document.getElementById('certificationsList');
    if (!container) return;
    container.innerHTML = (resumeData.certifications || []).map((cert, idx) => `
        <div class="entry-item">
            <button type="button" class="remove-btn" onclick="removeCertification(${idx})">✕ Remove</button>
            <div class="two-col-row">
                <div class="form-group">
                    <label>Certification Name</label>
                    <input type="text" placeholder="e.g. Oracle Certified Professional" value="${escapeHtml(cert.name || '')}" oninput="updateCert(${idx}, 'name', this.value)">
                </div>
                <div class="form-group">
                    <label>Issuing Organization</label>
                    <input type="text" placeholder="e.g. Oracle, AWS, Google" value="${escapeHtml(cert.organization || '')}" oninput="updateCert(${idx}, 'organization', this.value)">
                </div>
            </div>
            <div class="two-col-row">
                <div class="form-group" style="margin-bottom:0;">
                    <label>Issue Date / Year</label>
                    <input type="text" placeholder="e.g. 2023" value="${escapeHtml(cert.date || '')}" oninput="updateCert(${idx}, 'date', this.value)">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label>Credential URL</label>
                    <input type="text" placeholder="e.g. credly.com/your-badge" value="${escapeHtml(cert.credentialUrl || '')}" oninput="updateCert(${idx}, 'credentialUrl', this.value)">
                </div>
            </div>
        </div>
    `).join('');
}

function addCertification() {
    if (!resumeData.certifications) resumeData.certifications = [];
    resumeData.certifications.push({ name: '', organization: '', date: '', credentialUrl: '' });
    renderCertificationsList();
    updatePreview();
    scheduleAutoSave();
}

function updateCert(idx, field, value) {
    if (resumeData.certifications[idx]) {
        resumeData.certifications[idx][field] = value;
        updatePreview();
        scheduleAutoSave();
    }
}

function removeCertification(idx) {
    resumeData.certifications.splice(idx, 1);
    renderCertificationsList();
    updatePreview();
    scheduleAutoSave();
}

// Collapsible Sections
function toggleSection(sectionId) {
    const content = document.getElementById(sectionId);
    const toggle = document.getElementById(sectionId + '-toggle');
    if (content) {
        content.classList.toggle('collapsed');
        if (toggle) {
            toggle.textContent = content.classList.contains('collapsed') ? '▶' : '▼';
        }
    }
}

// AI Summary Generator
async function generateSummary() {
    const jobTitle = document.getElementById('professionalTitle').value.trim() || 'Software Developer';
    const skills = resumeData.skills ? resumeData.skills.join(', ') : '';
    const btn = document.getElementById('summaryAiBtn');

    if (btn) {
        btn.disabled = true;
        btn.textContent = '🤖 Generating...';
    }

    try {
        const res = await API.post('/api/ai/generate-summary', {
            jobTitle: jobTitle,
            skills: skills,
            experienceLevel: 'mid-level'
        });

        if (res && res.success && res.data) {
            document.getElementById('summary').value = res.data;
            updatePreview();
            scheduleAutoSave();
            showToast('AI Summary generated!', 'success');
        } else {
            showToast('AI generation failed. Please type manually.', 'error');
        }
    } catch (e) {
        showToast('Error contacting AI service', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = '🤖 Generate with AI';
        }
    }
}

// AI Skill Suggestions
async function suggestSkills() {
    const jobTitle = document.getElementById('professionalTitle').value.trim() || 'Software Developer';
    const btn = document.getElementById('skillsAiBtn');

    if (btn) {
        btn.disabled = true;
        btn.textContent = '🤖 Suggesting...';
    }

    try {
        const res = await API.post('/api/ai/suggest-skills', {
            jobTitle: jobTitle
        });

        if (res && res.success && Array.isArray(res.data)) {
            const currentSkills = new Set(resumeData.skills || []);
            res.data.forEach(s => currentSkills.add(s));
            resumeData.skills = Array.from(currentSkills);
            renderSkillsList();
            updatePreview();
            scheduleAutoSave();
            showToast('Skills suggested & added!', 'success');
        } else {
            showToast('Could not fetch suggestions', 'error');
        }
    } catch (e) {
        showToast('Error contacting AI service', 'error');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = '🤖 Suggest Skills';
        }
    }
}

// PDF Download
async function downloadPdf() {
    if (!currentResumeId) {
        await saveResume();
    }
    if (currentResumeId) {
        window.open(API_BASE_URL + '/api/resumes/' + currentResumeId + '/pdf?token=' + getToken(), '_blank');
    } else {
        showToast('Please save your resume first before downloading PDF', 'error');
    }
}

// Analyze ATS
function analyzeResume() {
    if (currentResumeId) {
        window.location.href = 'analyzer.html?id=' + currentResumeId;
    } else {
        showToast('Please save your resume first before analyzing', 'default');
    }
}
