(function () {
    // These variables will be provided by nuQuizSettings via wp_localize_script
    if (typeof nuQuizSettings === 'undefined') {
        console.error('nuQuizSettings not found. Quiz cannot initialize.');
        return;
    }

    let {
        nuQuizData,
        nuQuizId,
        nuQuizTitle,
        nuCourseUnit,
        nuNonce,
        nuAjaxUrl,
        nuSiteName,
        nuSiteUrl,
        nuSiteLogo,
        nuCertSettings,
        nuImpressions,
        nuAdUrl,
        isReadOnly,
        reportData
    } = nuQuizSettings;

    let nuReportUrl = ''; // Global to store the link for sharing

    const nuSiteNameClean = nuSiteName.replace(/\(|\)|\[|\]|\{|\}/g, '').trim();

    let nuCurrentIdx = 0;
    let nuScore = 0;
    let nuStudentId = 0;
    let nuStudentName = '';
    let nuUserAnswers = [];
    let nuStartTime = Date.now();
    let nuIsLoading = false;

    // --- PWA SUPPRESSION (Fixes "Nurses Revision requires Chrome" popups) ---
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
    });

    // REPORT VIEW MODE
    if (isReadOnly && reportData) {
        nuScore = parseInt(reportData.score);
        nuStudentName = reportData.studentName;
        nuUserAnswers = reportData.userAnswers;
        document.addEventListener('DOMContentLoaded', () => {
            const authScreen = document.getElementById('auth-screen');
            if (authScreen) authScreen.classList.add('hidden');
            nuFinishQuiz(true); // Pass true for ReadOnly mode
        });
    } else {
        // AUTO-LOGIN LOGIC FOR STANDARD QUIZ
        document.addEventListener('DOMContentLoaded', () => {
            const savedName = localStorage.getItem('nu_quiz_saved_name');
            const savedEmail = localStorage.getItem('nu_quiz_saved_email');
            const nameInput = document.getElementById('nu-student-name');
            const emailInput = document.getElementById('nu-student-email');
            
            if (savedName && nameInput) nameInput.value = savedName;
            if (savedEmail && emailInput) emailInput.value = savedEmail;
            
            // If we have both, immediately start the quiz!
            if (savedName && savedEmail) {
                // Short timeout to allow UI to render before jumping
                setTimeout(() => {
                    if (typeof window.nuStartQuiz === 'function') {
                        window.nuStartQuiz();
                    }
                }, 300);
            }
        });
    }

    function showLoading(btn, text) {
        if (!btn) return;
        btn.disabled = true;
        btn.dataset.originalText = btn.innerText;
        btn.innerText = text;
        nuIsLoading = true;
    }

    function hideLoading(btn) {
        if (!btn) return;
        btn.disabled = false;
        if (btn.dataset.originalText) btn.innerText = btn.dataset.originalText;
        nuIsLoading = false;
    }

    const cleanStr = (str) => {
        if (!str) return "";
        return String(str).replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    };

    const stripChoicePrefix = (value) => {
        return cleanStr(value)
            .replace(/^[A-H]\s*[\)\.\-:]\s*/i, '')
            .replace(/^[A-H]\s+/i, '')
            .trim();
    };

    const normalizeAnswerForCompare = (value) => {
        return stripChoicePrefix(value)
            .replace(/[“”‘’]/g, "'")
            .replace(/[^A-Za-z0-9\/\s]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    };
    window.nuNormalizeAnswerForCompare = normalizeAnswerForCompare;

    const getSelectedOptionAnswer = (selectedEl) => {
        if (!selectedEl) return '';
        if (selectedEl.dataset && selectedEl.dataset.answer) return cleanStr(selectedEl.dataset.answer);
        const copyEl = selectedEl.querySelector('.option-copy');
        if (copyEl && copyEl.textContent) return cleanStr(copyEl.textContent);
        return stripChoicePrefix(selectedEl.innerText || selectedEl.textContent || '');
    };

    const scrollQuizToTop = (behavior = 'smooth') => {
        const appRoot = document.getElementById('quiz-app-root');
        if (!appRoot) return;
        const targetTop = Math.max(0, window.scrollY + appRoot.getBoundingClientRect().top - 8);
        try {
            window.scrollTo({ top: targetTop, behavior });
        } catch (e) {
            window.scrollTo(0, targetTop);
        }
        document.documentElement.scrollTop = targetTop;
        document.body.scrollTop = targetTop;
    };

    window.nuStartQuiz = async function () {
        const nameInput = document.getElementById('nu-student-name');
        const emailInput = document.getElementById('nu-student-email');
        const startBtn = document.getElementById('nu-start-btn');

        if (nuIsLoading) return;
        if (!nameInput || !emailInput) return;

        const name = nameInput.value;
        const email = emailInput.value;

        if (!name || !email) return alert("Please fill in both fields.");

        // Persist login to local storage for automatic bypass later
        localStorage.setItem('nu_quiz_saved_name', name);
        localStorage.setItem('nu_quiz_saved_email', email);

        showLoading(startBtn, "Accessing Exam...");

        // FETCH QUESTIONS (LAZY LOADING)
        if (!isReadOnly && nuQuizData.length === 0) {
            try {
                const response = await fetch(nuAjaxUrl + '?t=' + Date.now(), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `action=nu_get_questions&security=${nuNonce}&quiz_id=${nuQuizId}`
                });
                const qJson = await response.json();
                if (qJson.success) {
                    nuQuizData = qJson.data;
                } else {
                    throw new Error(qJson.data || "Failed to load questions.");
                }
            } catch (err) {
                console.error("Fetch Error:", err);
                alert("Mobile/Connection Error: " + err.message + "\n\nPlease refresh or try a different browser.");
                hideLoading(startBtn);
                return;
            }
        }

        fetch(nuAjaxUrl + '?t=' + Date.now(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `action=nu_register_student&security=${nuNonce}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
        })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    nuStudentId = data.data.student_id;
                    nuStudentName = data.data.name;
                    document.getElementById('auth-screen').classList.add('hidden');
                    document.getElementById('quiz-screen').classList.remove('hidden');
                    nuLoadQuestion();
                } else {
                    alert("Error: " + (data.data || "Unknown error occurred. Please refresh and try again."));
                }
            })
            .catch(err => {
                console.error(err);
                alert("Network error. Please check your internet and try again.");
            })
            .finally(() => {
                hideLoading(startBtn);
            });
    }

    window.nuLoadQuestion = function () {
        try {
            const q = nuQuizData[nuCurrentIdx];
            if (!q) throw new Error("Question data not found at index " + nuCurrentIdx);

            const progressBar = document.getElementById('progress-bar');
            const questionText = document.getElementById('question-text');
            const container = document.getElementById('options-container');

            if (progressBar) progressBar.innerText = `Question ${nuCurrentIdx + 1} of ${nuQuizData.length}`;
            if (questionText) questionText.innerText = cleanStr(q.question_text) || "No question text available.";
            if (container) {
                container.innerHTML = '';

                if (q.type === 'fill') {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.id = 'nu-fill-input';
                    input.placeholder = 'Type your answer here...';
                    input.className = 'regular-text';
                    input.style.width = '100%';
                    input.style.padding = '12px';
                    container.appendChild(input);
                } else {
                    let options = q.options;
                    if (typeof options === 'string') {
                        try {
                            options = JSON.parse(options);
                        } catch (e) {
                            console.error("JSON parse error for options:", e);
                            try {
                                let cleaned = options.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                                if (cleaned.startsWith('"') && cleaned.endsWith('"')) cleaned = cleaned.substring(1, cleaned.length - 1);
                                options = JSON.parse(cleaned);
                            } catch (e2) {
                                try {
                                    let superClean = options.replace(/\\/g, '');
                                    options = JSON.parse(superClean);
                                } catch (e3) { options = []; }
                            }
                        }
                    }

                    if (Array.isArray(options) && options.length > 0) {
                        options.forEach(opt => {
                            const b = document.createElement('button');
                            b.className = 'option-item';
                            let displayOpt = String(opt);
                            if (displayOpt === displayOpt.toUpperCase() && displayOpt.length > 5) {
                                displayOpt = displayOpt.charAt(0).toUpperCase() + displayOpt.slice(1).toLowerCase();
                            }
                            b.innerText = cleanStr(displayOpt);
                            b.dataset.answer = cleanStr(displayOpt);
                            b.onclick = () => {
                                container.querySelectorAll('.option-item').forEach(btn => btn.classList.remove('selected'));
                                b.classList.add('selected');
                            };
                            container.appendChild(b);
                        });
                    } else {
                        container.innerHTML = '<p style="color:red">Error: No options found for this question.</p>';
                    }
                }
            }

            const feedbackContainer = document.getElementById('feedback-container');
            if (feedbackContainer) feedbackContainer.classList.add('hidden');

            const sBtn = document.getElementById('submit-btn');
            const nBtn = document.getElementById('next-btn');
            if (sBtn) {
                sBtn.classList.remove('hidden');
                sBtn.disabled = false;
            }
            if (nBtn) {
                nBtn.classList.add('hidden');
                nBtn.disabled = false;
            }
            nuIsLoading = false;
        } catch (e) {
            console.error("Error loading question:", e);
            alert("Error: " + e.message);
            nuIsLoading = false;
        }
    }

    window.nuSubmitAnswer = function () {
        if (nuIsLoading) return;
        try {
            const q = nuQuizData[nuCurrentIdx];
            let userAns = '';

            if (q.type === 'fill') {
                const fillInput = document.getElementById('nu-fill-input');
                userAns = fillInput ? fillInput.value.trim() : '';
                if (!userAns) return alert("Please type an answer.");
            } else {
                const selected = document.querySelector('#quiz-app-root .option-item.selected');
                if (!selected) return alert("Please select an answer.");
                userAns = getSelectedOptionAnswer(selected);
            }

            nuIsLoading = true;
            const submitBtn = document.getElementById('submit-btn');
            if (submitBtn) submitBtn.disabled = true;

            let isCorrect = false;
            const possibleAnswers = (q.correct_answer || "")
                .split('/')
                .map(a => normalizeAnswerForCompare(a))
                .filter(Boolean);
            const userNorm = normalizeAnswerForCompare(userAns);
            if (q.type === 'fill') isCorrect = possibleAnswers.includes(userNorm);
            else isCorrect = possibleAnswers.includes(userNorm);
            if (isCorrect) {
                nuScore++;
                if (typeof confetti === 'function') {
                    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
                }
            }

            nuUserAnswers.push({ q, userAns, isCorrect });

            const fb = document.getElementById('feedback-container');
            if (fb) {
                fb.className = `feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`;
                fb.innerHTML = `<strong>${isCorrect ? '✓ Correct' : '✗ Incorrect'}</strong><br>
                               Correct: ${cleanStr(q.correct_answer)}<br>
                               <div style="margin-top:10px"><b> EXPL:</b> ${cleanStr(q.explanation)}</div>
                               <div style="font-style:italic"><b> ANALOGY:</b> ${cleanStr(q.analogy)}</div>`;
                fb.classList.remove('hidden');
            }

            const sBtn = document.getElementById('submit-btn');
            const nBtn = document.getElementById('next-btn');
            if (sBtn) sBtn.classList.add('hidden');
            if (nBtn) nBtn.classList.remove('hidden');
        } catch (e) {
            console.error("Submit error:", e);
            alert("Error submitting answer. Please try again.");
        } finally {
            nuIsLoading = false;
        }
    }

    window.nuNextQuestion = function () {
        if (nuIsLoading) return;

        if (nuUserAnswers.length <= nuCurrentIdx) return;

        try {
            nuIsLoading = true;
            const nextBtn = document.getElementById('next-btn');
            if (nextBtn) nextBtn.disabled = true;

            nuCurrentIdx++;
            if (nuCurrentIdx < nuQuizData.length) {
                window.nuLoadQuestion();
                requestAnimationFrame(() => scrollQuizToTop('smooth'));
            }
            else nuFinishQuiz();
        } catch (e) {
            console.error("Next question error:", e);
            nuIsLoading = false;
            const nextBtn = document.getElementById('next-btn');
            if (nextBtn) nextBtn.disabled = false;
        }
    }

    window.nuFinishQuiz = function (isReadOnlyMode = false) {
        nuIsLoading = false;
        const quizScreen = document.getElementById('quiz-screen');
        const resultsScreen = document.getElementById('results-screen');
        if (quizScreen) quizScreen.classList.add('hidden');
        if (resultsScreen) resultsScreen.classList.remove('hidden');

        const total = (isReadOnly && reportData && reportData.totalQuestions) ? parseInt(reportData.totalQuestions) : nuQuizData.length;
        const perc = (total > 0) ? Math.round((nuScore / total) * 100) : 0;
        const finalScoreElem = document.getElementById('final-score');
        const finalGradeElem = document.getElementById('final-grade');

        if (finalScoreElem) finalScoreElem.innerText = `${nuScore}/${total}`;

        let grade = 'Retake';
        if (perc >= 75) grade = 'Distinction';
        else if (perc >= 65) grade = 'Credit';
        else if (perc >= 50) grade = 'Pass';
        if (finalGradeElem) finalGradeElem.innerText = `Grade: ${grade} (${perc}%)`;

        if (perc >= 70 && nuCertSettings.enabled) {
            const certBtn = document.getElementById('nu-cert-btn');
            if (certBtn) {
                certBtn.classList.remove('hidden');
                if (!isReadOnlyMode && typeof confetti === 'function') {
                    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
                }
            }
        }

        // Display Manual Impression & Ad
        let impText = '';
        if (grade === 'Distinction') impText = nuImpressions.distinction;
        else if (grade === 'Credit') impText = nuImpressions.credit;
        else if (grade === 'Pass') impText = nuImpressions.pass;
        else impText = nuImpressions.retake;

        let impContent = '';
        if (impText) {
            impContent += `
                <div class="card" style="border-left: 5px solid var(--nt-primary); background: #f0f9ff; margin-bottom: 20px;">
                    <h3 style="color: var(--nt-primary); margin-bottom: 10px;">🩺 ${nuSiteName.toUpperCase()} IMPRESSION</h3>
                    <p style="font-style: italic; line-height: 1.6; color: #1e40af;">"${impText}"</p>
                </div>
            `;
        }
        if (nuAdUrl) {
            impContent += `
                <div class="card" style="text-align: center; padding: 15px;">
                    <img src="${nuAdUrl}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);" alt="Advertisement">
                </div>
            `;
        }
        const resultsSummary = document.getElementById('results-summary');
        if (resultsSummary) resultsSummary.innerHTML = impContent;

        if (isReadOnlyMode) return;

        const data = new URLSearchParams();
        data.append('action', 'nu_submit_result');
        data.append('security', nuNonce);
        data.append('student_id', nuStudentId);
        data.append('quiz_id', nuQuizId);
        data.append('score', nuScore);
        data.append('total', nuQuizData.length);
        data.append('time_spent', Math.round((Date.now() - nuStartTime) / 1000));
        data.append('attempt_data', JSON.stringify(nuUserAnswers));
        data.append('page_url', window.location.href);

        fetch(nuAjaxUrl + '?t=' + Date.now(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: data.toString()
        })
            .then(r => r.json())
            .then(res => {
                if (res.success && res.data.report_url) {
                    nuReportUrl = res.data.report_url; // Store for backup share buttons
                    const backupContainer = document.getElementById('nu-backup-options');
                    if (backupContainer) backupContainer.classList.remove('hidden');
                }
                setTimeout(() => {
                    window.nuGeneratePDF();
                }, 1000);
            })
            .catch(err => {
                console.error("Submission error:", err);
            });
    }

    window.nuGeneratePDF = async function () {
        const pdfBtn = document.getElementById('nu-pdf-btn');
        if (nuIsLoading) return;
        showLoading(pdfBtn, "Preparing PDF...");

        try {
            const { jsPDF } = window.jspdf;
            if (!jsPDF) throw new Error("jsPDF library not found.");
            const doc = new jsPDF('p', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.width;
            const pageHeight = doc.internal.pageSize.height;
            const margin = 15;
            const contentWidth = pageWidth - (margin * 2);
            let y = 0;

            const cleanStr = (str) => {
                if (!str) return "";
                // Remove backslashes from WP content
                return String(str).replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\').replace(/\\/g, '');
            };

            const COLORS = {
                deep: [59, 7, 100],
                purple: [147, 51, 234],
                success: [22, 163, 74],
                error: [239, 68, 68],
                text: [31, 41, 55],
                muted: [107, 114, 128],
                bg: [250, 251, 255]
            };

            const drawHeader = async () => {
                doc.setFillColor(COLORS.deep[0], COLORS.deep[1], COLORS.deep[2]);
                doc.rect(0, 0, pageWidth, 55, 'F');

                if (nuSiteLogo) {
                    try {
                        const loadLogo = new Promise((resolve) => {
                            const img = new Image();
                            img.crossOrigin = "Anonymous";
                            img.onload = () => resolve(img);
                            img.onerror = () => resolve(null);
                            img.src = nuSiteLogo;
                        });
                        const logoImg = await loadLogo;
                        if (logoImg) {
                            const logoW = 35;
                            const logoH = (logoImg.height * logoW) / logoImg.width;
                            doc.addImage(logoImg, 'PNG', margin, 10, logoW, logoH);
                        }
                    } catch (e) { }
                }

                doc.setTextColor(255, 255, 255);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(22);
                doc.text("Performance Report", margin + 40, 20);

                doc.setFontSize(13);
                doc.text(`Exam: ${nuQuizTitle}`, margin + 40, 28);

                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.text(`Candidate: `, margin + 40, 35);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(34, 197, 94);
                doc.text(nuStudentName, margin + 40 + 20, 35);

                const total = (isReadOnly && reportData && reportData.totalQuestions) ? parseInt(reportData.totalQuestions) : nuQuizData.length;
                const perc = (total > 0) ? Math.round((nuScore / total) * 100) : 0;
                const pillY = 42;
                const drawPill = (txt, x, w) => {
                    doc.setFillColor(255, 255, 255, 0.2);
                    doc.roundedRect(x, pillY, w, 8, 4, 4, 'F');
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(9);
                    doc.text(txt, x + (w / 2), pillY + 5.5, { align: 'center' });
                };

                drawPill(`Score: ${nuScore}/${total}`, margin, 35);
                drawPill(`Percentage: ${perc}%`, margin + 40, 35);
                drawPill(`Date: ${new Date().toLocaleDateString()}`, margin + 80, 45);

                y = 65;
            };

            const drawFooter = () => {
                const totalPages = doc.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    doc.setPage(i);
                    doc.setDrawColor(230, 230, 230);
                    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(9);
                    doc.setTextColor(156, 163, 175);

                    doc.text("Generated by ", margin, pageHeight - 10);
                    const brandWidth = doc.getTextWidth("Generated by ");

                    doc.setTextColor(COLORS.purple[0], COLORS.purple[1], COLORS.purple[2]);
                    doc.setFont("helvetica", "bold");
                    doc.text(nuSiteName, margin + brandWidth, pageHeight - 10);
                    doc.link(margin + brandWidth, pageHeight - 13, 40, 5, { url: nuSiteUrl });

                    doc.setTextColor(156, 163, 175);
                    doc.setFont("helvetica", "normal");
                    doc.text("WhatsApp: 0726113908", pageWidth / 2, pageHeight - 10, { align: 'center' });

                    doc.setTextColor(156, 163, 175);
                    doc.setFont("helvetica", "normal");
                    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
                }
            };

            await drawHeader();

            nuUserAnswers.forEach((item, index) => {
                if (y > pageHeight - 75) { // Increased margin to prevent footer overlap
                    doc.addPage();
                    y = 20;
                }

                doc.setFillColor(COLORS.bg[0], COLORS.bg[1], COLORS.bg[2]);
                doc.setDrawColor(229, 231, 235);
                doc.roundedRect(margin, y, contentWidth, 20, 5, 5, 'FD');

                doc.setFont("helvetica", "bold");
                doc.setFontSize(11);
                doc.setTextColor(COLORS.purple[0], COLORS.purple[1], COLORS.purple[2]);
                doc.text(`Question ${index + 1}`, margin + 5, y + 8);

                const badgeX = pageWidth - margin - 25;
                doc.setFillColor(item.isCorrect ? 220 : 254, item.isCorrect ? 252 : 226, item.isCorrect ? 231 : 226);
                doc.roundedRect(badgeX, y + 3, 20, 6, 3, 3, 'F');
                doc.setTextColor(item.isCorrect ? COLORS.success[0] : COLORS.error[0], item.isCorrect ? COLORS.success[1] : COLORS.error[1], item.isCorrect ? COLORS.success[2] : COLORS.error[2]);
                doc.setFontSize(8);
                doc.text(item.isCorrect ? "CORRECT" : "INCORRECT", badgeX + 10, y + 7, { align: 'center' });

                y += 15;

                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                doc.setTextColor(COLORS.deep[0], COLORS.deep[1], COLORS.deep[2]);
                const qLines = doc.splitTextToSize(cleanStr(item.q.question_text), contentWidth - 10);
                doc.text(qLines, margin + 5, y);
                y += (qLines.length * 6) + 2;

                if (item.q.type !== 'fill') {
                    let optionsList = item.q.options;
                    if (typeof optionsList === 'string') {
                        try { optionsList = JSON.parse(optionsList); } catch (e) { optionsList = []; }
                    }
                    if (Array.isArray(optionsList)) {
                        optionsList.forEach((opt, optIdx) => {
                            const optLetter = String.fromCharCode(65 + optIdx);
                            const isUsers = (item.userAns === opt);
                            const isCorrectOpt = (item.q.correct_answer === opt);

                            if (y > pageHeight - 20) { doc.addPage(); y = 20; }

                            if (isCorrectOpt) {
                                doc.setFillColor(240, 253, 244); doc.setDrawColor(34, 197, 94);
                            } else if (isUsers && !item.isCorrect) {
                                doc.setFillColor(255, 245, 245); doc.setDrawColor(239, 68, 68);
                            } else {
                                doc.setFillColor(255, 255, 255); doc.setDrawColor(240, 240, 240);
                            }

                            doc.roundedRect(margin + 5, y, contentWidth - 10, 8, 2, 2, 'FD');
                            doc.setTextColor(156, 163, 175);
                            doc.setFont("helvetica", "bold"); doc.setFontSize(9);
                            doc.text(optLetter, margin + 8, y + 5.5);

                            doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
                            doc.setFont("helvetica", "normal");
                            doc.text(opt, margin + 15, y + 5.5);

                            y += 10;
                        });
                    }
                } else {
                    doc.setFont("helvetica", "normal"); doc.setFontSize(10);
                    doc.setTextColor(item.isCorrect ? COLORS.success[0] : COLORS.error[0], item.isCorrect ? COLORS.success[1] : COLORS.error[1], item.isCorrect ? COLORS.success[2] : COLORS.error[2]);
                    doc.text(`Your Answer: ${item.userAns}`, margin + 5, y);
                    y += 6;
                    if (!item.isCorrect) {
                        doc.setTextColor(COLORS.success[0], COLORS.success[1], COLORS.success[2]);
                        doc.text(`Correct Answer: ${item.q.correct_answer}`, margin + 5, y);
                        y += 6;
                    }
                }

                const drawInsight = (title, content, color) => {
                    if (y > pageHeight - 30) { doc.addPage(); y = 20; }
                    doc.setDrawColor(color[0], color[1], color[2]);
                    doc.line(margin + 5, y, margin + 5, y + 10);

                    doc.setFont("helvetica", "bold"); doc.setFontSize(9);
                    doc.setTextColor(color[0], color[1], color[2]);
                    doc.text(title, margin + 8, y + 4);

                    doc.setFont("helvetica", "normal"); doc.setTextColor(COLORS.muted[0], COLORS.muted[1], COLORS.muted[2]);
                    const lines = doc.splitTextToSize(content, contentWidth - 25);
                    doc.text(lines, margin + 8, y + 9);
                    y += (lines.length * 4.5) + 8;
                };

                if (item.q.explanation) drawInsight("EXPLANATION", cleanStr(item.q.explanation), COLORS.purple);
                if (item.q.analogy) drawInsight("ANALOGY", cleanStr(item.q.analogy), [14, 165, 233]);

                y += 10;
            });

            const total = (isReadOnly && reportData && reportData.totalQuestions) ? parseInt(reportData.totalQuestions) : nuQuizData.length;
            const perc = (total > 0) ? Math.round((nuScore / total) * 100) : 0;
            let grade = 'Retake';
            if (perc >= 75) grade = 'Distinction';
            else if (perc >= 65) grade = 'Credit';
            else if (perc >= 50) grade = 'Pass';

            let impText = '';
            if (grade === 'Distinction') impText = nuImpressions.distinction;
            else if (grade === 'Credit') impText = nuImpressions.credit;
            else if (grade === 'Pass') impText = nuImpressions.pass;
            else impText = nuImpressions.retake;

            if (impText) {
                if (y > pageHeight - 75) { doc.addPage(); y = 20; }
                doc.setFillColor(240, 249, 255);
                doc.setDrawColor(37, 99, 235);
                doc.roundedRect(margin, y, contentWidth, 30, 5, 5, 'FD');

                doc.setFont("helvetica", "bold"); doc.setFontSize(11);
                doc.setTextColor(37, 99, 235);
                doc.text(`${nuSiteName.toUpperCase()} IMPRESSION`, margin + 8, y + 8);

                doc.setFont("helvetica", "italic"); doc.setFontSize(10);
                doc.setTextColor(30, 64, 175);
                const impLines = doc.splitTextToSize(`"${impText}"`, contentWidth - 20);
                doc.text(impLines, margin + 8, y + 15);
                y += 40;
            }

            if (nuAdUrl) {
                const loadAd = new Promise((resolve) => {
                    const img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.onload = () => resolve(img);
                    img.onerror = () => resolve(null);
                    img.src = nuAdUrl;
                });

                const adImg = await loadAd;
                if (adImg) {
                    doc.addPage();
                    const adWidth = contentWidth;
                    const adHeight = (adImg.height * adWidth) / adImg.width;
                    const adY = (pageHeight - adHeight) / 2;
                    doc.addImage(adImg, 'PNG', margin, adY, adWidth, adHeight);
                }
            }

            drawFooter();

            // --- MOBILE ROBUSTNESS FIX ---
            const fileName = `${nuStudentName}_Report.pdf`;
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const isInApp = /FBAN|FBAV|Telegram|Instagram|Line|WhatsApp/i.test(navigator.userAgent);

            if (isMobile || isInApp) {
                const blob = doc.output('blob');
                const blobURL = URL.createObjectURL(blob);

                // Attempt direct download via invisible link (more stable than window.open)
                const link = document.createElement('a');
                link.href = blobURL;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // For in-app browsers, if it didn't download, show the manual fallback
                if (isInApp && !document.getElementById('manual-pdf-link')) {
                    const fallback = document.createElement('div');
                    fallback.id = 'manual-pdf-link';
                    fallback.style.cssText = "margin-top:10px;padding:15px;background:#fefce8;border:1px solid #fef08a;border-radius:8px;font-size:13px;color:#854d0e;text-align:center";
                    fallback.innerHTML = `
                        <b>⚠️ PDF Blocked?</b> In-app browsers (like Telegram) often block downloads. 
                        Please use the <b>"WhatsApp Share"</b> button below or 
                        <b>"Open in Browser"</b> at the top and try again.
                    `;
                    pdfBtn.parentNode.insertBefore(fallback, pdfBtn.nextSibling);
                }
            } else {
                doc.save(fileName);
            }

            hideLoading(pdfBtn);
        } catch (e) {
            console.error("PDF generation error:", e);
            alert("There was an error generating the PDF.");
            hideLoading(pdfBtn);
        }
    }

    window.nuGenerateCertificate = async function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('l', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const date = new Date().toLocaleDateString();

        const COLORS = {
            primary: [59, 7, 100],
            accent: [219, 39, 119],
            text: [30, 41, 59],
            muted: [71, 85, 105],
            gold: [193, 155, 62]
        };

        doc.setFillColor(252, 252, 255);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2], 0.05);
        doc.circle(0, 0, 80, 'F');

        doc.setFillColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2], 0.05);
        doc.circle(pageWidth, pageHeight, 100, 'F');

        doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
        doc.setLineWidth(1.5);
        doc.rect(8, 8, pageWidth - 16, pageHeight - 16);
        doc.setDrawColor(COLORS.gold[0], COLORS.gold[1], COLORS.gold[2]);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

        doc.setTextColor(COLORS.muted[0], COLORS.muted[1], COLORS.muted[2]);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.text("Nurses Revision School of Health Sciences", pageWidth / 2, 30, { align: 'center' });

        doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(48);
        doc.text("CERTIFICATE", pageWidth / 2, 50, { align: 'center' });

        doc.setFontSize(18);
        doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
        doc.text("OF ACHIEVEMENT", pageWidth / 2, 60, { align: 'center' });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(16);
        doc.setTextColor(COLORS.muted[0], COLORS.muted[1], COLORS.muted[2]);
        doc.text("THIS IS TO CERTIFY THAT", pageWidth / 2, 80, { align: 'center' });

        doc.setFont("helvetica", "bold");
        doc.setFontSize(36);
        doc.setTextColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2]);
        doc.text(nuStudentName.toUpperCase(), pageWidth / 2, 100, { align: 'center' });

        doc.setDrawColor(COLORS.gold[0], COLORS.gold[1], COLORS.gold[2]);
        doc.setLineWidth(0.8);
        doc.line(pageWidth / 2 - 60, 103, pageWidth / 2 + 60, 103);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(15);
        doc.setTextColor(COLORS.text[0], COLORS.text[1], COLORS.text[2]);
        const desc = `Has successfully completed the professional healthcare assessment for:`;
        doc.text(desc, pageWidth / 2, 115, { align: 'center' });

        doc.setFont("helvetica", "bolditalic");
        doc.setFontSize(22);
        doc.setTextColor(COLORS.accent[0], COLORS.accent[1], COLORS.accent[2]);
        doc.text(`"${nuQuizTitle}"`, pageWidth / 2, 130, { align: 'center' });

        const assets = [
            { url: 'https://nursesrevisionuganda.com/wp-content/uploads/2026/01/Nurses-Revision-2023-Stamp-1.png', x: 25, y: 145, w: 45 },
            { url: 'https://nursesrevisionuganda.com/wp-content/uploads/2026/01/qr-code-1.png', x: pageWidth - 60, y: 145, w: 35 }
        ];

        for (const asset of assets) {
            try {
                const img = await new Promise((resolve) => {
                    const i = new Image();
                    i.crossOrigin = "Anonymous";
                    i.onload = () => resolve(i);
                    i.onerror = () => resolve(null);
                    i.src = asset.url;
                });
                if (img) {
                    const aspect = img.height / img.width;
                    doc.addImage(img, 'PNG', asset.x, asset.y, asset.w, asset.w * aspect);
                }
            } catch (e) { }
        }

        doc.setTextColor(COLORS.muted[0], COLORS.muted[1], COLORS.muted[2]);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Issue Date: ${date}`, pageWidth / 2, 175, { align: 'center' });
        doc.text(`Verify online at nursesrevisionuganda.com`, pageWidth / 2, 180, { align: 'center' });

        // --- MOBILE ROBUSTNESS FIX ---
        const fileName = `${nuStudentName}_Certificate.pdf`;
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const isInApp = /FBAN|FBAV|Telegram|Instagram|Line|WhatsApp/i.test(navigator.userAgent);

        if (isMobile || isInApp) {
            const blob = doc.output('blob');
            const blobURL = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobURL;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            doc.save(fileName);
        }
    }

    window.nuShareToWhatsApp = function () {
        const text = `🎯 My Exam Result: ${nuScore}/${nuQuizData.length} (${Math.round((nuScore / nuQuizData.length) * 100)}%)\n📝 Exam: ${nuQuizTitle}\n🔗 View Report: ${nuReportUrl || window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }

    window.nuCopyReportLink = function () {
        const link = nuReportUrl || window.location.href;
        navigator.clipboard.writeText(link).then(() => {
            alert("📋 Report link copied to clipboard!");
        });
    }

    window.nuShareToWhatsApp = function () {
        const total = nuQuizData.length || (reportData && reportData.totalQuestions ? parseInt(reportData.totalQuestions) : 0);
        const percentage = total > 0 ? Math.round((nuScore / total) * 100) : 0;
        const text = `My quiz result: ${nuScore}/${total} (${percentage}%)\nQuiz: ${nuQuizTitle}\nReport: ${nuReportUrl || window.location.href}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    };

    window.nuCopyReportLink = function () {
        const link = nuReportUrl || window.location.href;
        navigator.clipboard.writeText(link).then(() => {
            alert("Report link copied to clipboard.");
        });
    };

    (function applyModernQuizLayer() {
        let nuStreak = 0;
        let nuBestStreak = 0;

        const cleanText = (str) => {
            if (!str) return "";
            return String(str).replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        };

        const escapeHtml = (str) => {
            return cleanText(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        };

        const normalize = (value) => {
            if (typeof window.nuNormalizeAnswerForCompare === 'function') {
                return window.nuNormalizeAnswerForCompare(value);
            }
            return cleanText(value).trim().toLowerCase();
        };

        const getTotalQuestions = () => {
            if (Array.isArray(nuQuizData) && nuQuizData.length > 0) return nuQuizData.length;
            if (isReadOnly && reportData && reportData.totalQuestions) return parseInt(reportData.totalQuestions);
            return 0;
        };

        const animateScreen = (screen) => {
            if (!screen) return;
            screen.classList.remove('nu-screen-enter');
            void screen.offsetWidth;
            screen.classList.add('nu-screen-enter');
        };

        const pulseChip = (element) => {
            if (!element) return;
            element.classList.remove('nu-chip-pulse');
            void element.offsetWidth;
            element.classList.add('nu-chip-pulse');
        };

        const setHint = (text, tone = '') => {
            const hint = document.getElementById('nu-question-hint');
            if (!hint) return;
            hint.textContent = text;
            hint.classList.remove('nu-question-hint-ready', 'nu-question-hint-correct', 'nu-question-hint-wrong');
            if (tone) hint.classList.add(`nu-question-hint-${tone}`);
        };

        const updateMeta = (answeredCurrent = false) => {
            const total = getTotalQuestions();
            const progress = document.getElementById('progress-bar');
            const fill = document.getElementById('nu-progress-fill');
            const scoreChip = document.getElementById('nu-score-chip');
            const streakChip = document.getElementById('nu-streak-chip');

            if (progress && total > 0) progress.textContent = `Question ${Math.min(nuCurrentIdx + 1, total)} of ${total}`;
            if (fill && total > 0) {
                const ratio = answeredCurrent ? (nuCurrentIdx + 1) / total : nuCurrentIdx / total;
                fill.style.width = `${Math.max(0, Math.min(100, Math.round(ratio * 100)))}%`;
            }
            if (scoreChip) scoreChip.textContent = `Score ${nuScore}`;
            if (streakChip) streakChip.textContent = `Streak ${nuStreak}`;
        };

        const decorateOptions = () => {
            const container = document.getElementById('options-container');
            const submitBtn = document.getElementById('submit-btn');
            if (!container) return;

            const fillInput = document.getElementById('nu-fill-input');
            if (fillInput) {
                fillInput.classList.add('nu-fill-input');
                fillInput.removeAttribute('style');
                if (!fillInput.dataset.nuBound) {
                    fillInput.addEventListener('input', () => {
                        if (submitBtn) submitBtn.disabled = !fillInput.value.trim();
                        setHint(
                            fillInput.value.trim() ? "Looks good. Tap Check Answer." : "Type your answer, then tap Check Answer.",
                            fillInput.value.trim() ? "ready" : ""
                        );
                    });
                    fillInput.dataset.nuBound = '1';
                }
                if (submitBtn) submitBtn.disabled = !fillInput.value.trim();
                setHint(fillInput.value.trim() ? "Looks good. Tap Check Answer." : "Type your answer, then tap Check Answer.");
                return;
            }

            const options = container.querySelectorAll('.option-item');
            options.forEach((option, index) => {
                if (!option.dataset.answer) option.dataset.answer = cleanText(option.innerText);
                option.type = 'button';

                if (!option.querySelector('.option-badge')) {
                    const label = option.dataset.answer;
                    option.textContent = '';
                    const badge = document.createElement('span');
                    const copy = document.createElement('span');
                    badge.className = 'option-badge';
                    copy.className = 'option-copy';
                    badge.textContent = String.fromCharCode(65 + index);
                    copy.textContent = label;
                    option.appendChild(badge);
                    option.appendChild(copy);
                }

                if (!option.dataset.nuBound) {
                    const prevOnClick = option.onclick;
                    option.onclick = () => {
                        if (typeof prevOnClick === 'function') prevOnClick();
                        if (submitBtn) submitBtn.disabled = false;
                        setHint("Nice pick. Tap Check Answer.", "ready");
                    };
                    option.dataset.nuBound = '1';
                }
            });

            if (submitBtn) {
                const hasSelected = !!container.querySelector('.option-item.selected');
                submitBtn.disabled = !hasSelected;
            }
            setHint("Pick one answer and keep momentum.");
        };

        const rewriteFeedback = (latestAnswer) => {
            const feedback = document.getElementById('feedback-container');
            if (!feedback || !latestAnswer || !latestAnswer.q) return;

            const isCorrect = !!latestAnswer.isCorrect;
            const q = latestAnswer.q;
            const explanation = cleanText(q.explanation);
            const analogy = cleanText(q.analogy);

            feedback.className = `feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`;
            feedback.innerHTML = `
                <div class="nu-feedback-head">
                    <span class="nu-feedback-title">${isCorrect ? 'Correct' : 'Not quite yet'}</span>
                    <span class="nu-feedback-points">${isCorrect ? '+1 point' : 'No point'}</span>
                </div>
                <p class="nu-feedback-line"><span class="nu-feedback-label">Correct answer</span><br>${escapeHtml(q.correct_answer)}</p>
                ${explanation ? `<p class="nu-feedback-line"><span class="nu-feedback-label">Why</span><br>${escapeHtml(explanation)}</p>` : ''}
                ${analogy ? `<p class="nu-feedback-line"><span class="nu-feedback-label">Memory hook</span><br>${escapeHtml(analogy)}</p>` : ''}
            `;
            feedback.classList.remove('hidden');
        };

        const rewriteResults = () => {
            const gradeEl = document.getElementById('final-grade');
            const resultsSummary = document.getElementById('results-summary');
            const titleEl = document.querySelector('#results-screen .nu-results-title');
            const copyEl = document.querySelector('#results-screen .nu-results-copy');

            let percentage = 0;
            if (gradeEl) {
                const gradeText = gradeEl.textContent || '';
                const match = gradeText.match(/(\d+)%/);
                percentage = match ? parseInt(match[1]) : 0;
                gradeEl.textContent = gradeText.replace(/^Grade:\s*/i, '');
            }

            if (titleEl) {
                if (percentage >= 80) titleEl.textContent = "Outstanding finish.";
                else if (percentage >= 60) titleEl.textContent = "Strong progress.";
                else titleEl.textContent = "Good push. Keep sharpening.";
            }
            if (nuBestStreak === 0 && Array.isArray(nuUserAnswers) && nuUserAnswers.length) {
                let rollingStreak = 0;
                nuUserAnswers.forEach((item) => {
                    rollingStreak = item.isCorrect ? rollingStreak + 1 : 0;
                    nuBestStreak = Math.max(nuBestStreak, rollingStreak);
                });
            }
            if (copyEl) copyEl.textContent = `Best streak: ${nuBestStreak}. Keep building your pace.`;

            if (resultsSummary) {
                let grade = 'Retake';
                if (percentage >= 75) grade = 'Distinction';
                else if (percentage >= 65) grade = 'Credit';
                else if (percentage >= 50) grade = 'Pass';

                let impressionText = '';
                if (grade === 'Distinction') impressionText = nuImpressions.distinction;
                else if (grade === 'Credit') impressionText = nuImpressions.credit;
                else if (grade === 'Pass') impressionText = nuImpressions.pass;
                else impressionText = nuImpressions.retake;

                let html = '';
                if (impressionText) {
                    html += `
                        <div class="nu-inline-panel">
                            <h3>${escapeHtml(nuSiteNameClean.toUpperCase())} Impression</h3>
                            <p>"${escapeHtml(impressionText)}"</p>
                        </div>
                    `;
                }
                if (nuAdUrl) {
                    html += `
                        <div class="nu-inline-panel nu-ad-panel">
                            <img src="${escapeHtml(nuAdUrl)}" class="nu-ad-image" alt="Advertisement">
                        </div>
                    `;
                }
                resultsSummary.innerHTML = html;
            }
        };

        const originalStart = window.nuStartQuiz;
        const originalLoad = window.nuLoadQuestion;
        const originalSubmit = window.nuSubmitAnswer;
        const originalNext = window.nuNextQuestion;
        const originalFinish = window.nuFinishQuiz;

        window.nuStartQuiz = async function () {
            nuStreak = 0;
            nuBestStreak = 0;
            await originalStart.apply(this, arguments);
            updateMeta(false);
            animateScreen(document.getElementById('quiz-screen'));
        };

        window.nuLoadQuestion = function () {
            originalLoad.apply(this, arguments);
            updateMeta(false);
            decorateOptions();
            const submitBtn = document.getElementById('submit-btn');
            const nextBtn = document.getElementById('next-btn');
            if (submitBtn) submitBtn.textContent = "Check Answer";
            if (nextBtn) nextBtn.textContent = (nuCurrentIdx + 1 >= getTotalQuestions()) ? "See Results" : "Next Question";
        };

        window.nuSubmitAnswer = function () {
            const previousCount = nuUserAnswers.length;
            originalSubmit.apply(this, arguments);
            if (nuUserAnswers.length <= previousCount) return;

            const latest = nuUserAnswers[nuUserAnswers.length - 1];
            if (!latest) return;

            if (latest.isCorrect) {
                nuStreak += 1;
                nuBestStreak = Math.max(nuBestStreak, nuStreak);
            } else {
                nuStreak = 0;
            }

            const question = latest.q || {};
            if (question.type !== 'fill') {
                const correctNorm = normalize(question.correct_answer || '');
                document.querySelectorAll('#quiz-app-root .option-item').forEach((option) => {
                    option.disabled = true;
                    const optionNorm = normalize(option.dataset.answer || option.innerText);
                    option.classList.remove('correct', 'wrong');
                    if (optionNorm === correctNorm) option.classList.add('correct');
                    if (option.classList.contains('selected') && optionNorm !== correctNorm) option.classList.add('wrong');
                });
            }

            rewriteFeedback(latest);
            updateMeta(true);
            pulseChip(document.getElementById('nu-score-chip'));
            pulseChip(document.getElementById('nu-streak-chip'));

            setHint(
                latest.isCorrect ? "Nice. Tap next and keep your rhythm." : "Close one. Read the tip, then keep moving.",
                latest.isCorrect ? "correct" : "wrong"
            );

            const nextBtn = document.getElementById('next-btn');
            if (nextBtn) nextBtn.textContent = (nuCurrentIdx + 1 >= getTotalQuestions()) ? "See Results" : "Next Question";
        };

        window.nuNextQuestion = function () {
            originalNext.apply(this, arguments);
            updateMeta(false);
            setTimeout(() => {
                const appRoot = document.getElementById('quiz-app-root');
                if (!appRoot) return;
                const targetTop = Math.max(0, window.scrollY + appRoot.getBoundingClientRect().top - 8);
                try {
                    window.scrollTo({ top: targetTop, behavior: 'smooth' });
                } catch (e) {
                    window.scrollTo(0, targetTop);
                }
            }, 60);
        };

        window.nuFinishQuiz = function () {
            originalFinish.apply(this, arguments);
            updateMeta(true);
            animateScreen(document.getElementById('results-screen'));
            rewriteResults();
        };
    })();

    function nuCheckInAppBrowser() {
        const isInApp = /FBAN|FBAV|Telegram|Instagram|Line|WhatsApp/i.test(navigator.userAgent);
        if (!isInApp) return;

        const notice = document.createElement('div');
        notice.style.cssText = `
            background: #fff7ed;
            color: #9a3412;
            padding: 15px;
            font-size: 14px;
            font-weight: 500;
            border-bottom: 2px solid #fdba74;
            text-align: center;
            position: sticky;
            top: 0;
            z-index: 9999;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        `;
        notice.innerHTML = `
            🚀 <b>Pro Tip:</b> In-app browsers block PDF downloads. 
            Tap the <span style="background:#ddd;padding:2px 6px;border-radius:4px">...</span> 
            and select <b>"Open in Browser"</b> to enable full saving support.
        `;
        const root = document.getElementById('quiz-app-root');
        if (root) root.insertBefore(notice, root.firstChild);
    }
    function nuCheckInAppBrowser() {
        const isInApp = /FBAN|FBAV|Telegram|Instagram|Line|WhatsApp/i.test(navigator.userAgent);
        if (!isInApp) return;

        const notice = document.createElement('div');
        notice.className = 'nu-browser-notice';
        notice.innerHTML = '<strong>Tip:</strong> In-app browsers may block PDF downloads. Use "Open in Browser" for full save support.';

        const root = document.getElementById('quiz-app-root');
        if (root) root.insertBefore(notice, root.firstChild);
    }

    function nuInitializeApp() {
        const root = document.getElementById('quiz-app-root');
        if (!root || root.hasAttribute('data-nu-loaded')) return;
        root.setAttribute('data-nu-loaded', 'true');

        // --- NUCLEAR PWA FIX (For Samsung/In-App Browsers) ---
        // Unregister service workers so the OS doesn't think it's an app
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function (registrations) {
                for (let registration of registrations) {
                    registration.unregister();
                }
            });
        }

        nuCheckInAppBrowser();

        const startBtn = document.getElementById('nu-start-btn');
        const submitBtn = document.getElementById('submit-btn');
        const nextBtn = document.getElementById('next-btn');
        const pdfBtn = document.getElementById('nu-pdf-btn');
        const certBtn = document.getElementById('nu-cert-btn');

        if (startBtn) startBtn.onclick = window.nuStartQuiz;
        if (submitBtn) submitBtn.onclick = window.nuSubmitAnswer;
        if (nextBtn) nextBtn.onclick = window.nuNextQuestion;
        if (pdfBtn) pdfBtn.onclick = window.nuGeneratePDF;
        if (certBtn) certBtn.onclick = window.nuGenerateCertificate;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', nuInitializeApp);
    } else {
        nuInitializeApp();
    }

    window.addEventListener('load', nuInitializeApp);
    setTimeout(nuInitializeApp, 1500);
})();
