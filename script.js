document.addEventListener('DOMContentLoaded', () => {
    // Hide the context panel as soon as the DOM is ready to prevent it from flashing.
    const contextPanel = document.getElementById('context-panel');
    if (contextPanel) {
        contextPanel.style.display = 'none';
    }

    async function main() {
        // --- State Variables ---
        let trials = [];
        let currentTrialIndex = 0;
        let currentPart = 1;
        let userAnswers = [];
        let experimentStarted = false;
        let dataFile = '';

        // --- DOM Elements ---
        const participantIdInput = document.getElementById('participant-id');
        const mainPanel = document.getElementById('main-panel');
        const mainWrapper = document.getElementById('main-wrapper');
        const contextKeywordEl = document.getElementById('context-keyword');
        const contextSituationEl = document.getElementById('context-situation');
        const contextQuestionEl = document.getElementById('context-question');
        const contextQuestionContainer = document.getElementById('context-question-container');
        const contextContentEl = document.querySelector('.context-content');
        const part1QuestionContainer = document.getElementById('part1-question-container');
        const part4QuestionContainer = document.getElementById('part4-question-container');
        const part7QuestionContainer = document.getElementById('part7-question-container');
        const tocList = document.getElementById('toc-list');
        const tocCounter = document.getElementById('toc-counter');
        const contextUserAnswer = document.getElementById('context-user-answer');
        const part1Container = document.getElementById('part1-container');
        const part2Container = document.getElementById('part2-container');
        const part3Container = document.getElementById('part3-container');
        const part4Container = document.getElementById('part4-container');
        const part7Container = document.getElementById('part7-container');
        const completionContainer = document.getElementById('completion-container');
        const startContainer = document.getElementById('start-container');
        const instructionContainer = document.getElementById('instruction-container');
        const instructionContainer2 = document.getElementById('instruction-container-2');
        const startExperimentButton = document.getElementById('start-experiment-button');
        startExperimentButton.disabled = true;
        const nextInstructionButton = document.getElementById('next-instruction-button');
        const beginExperimentButton = document.getElementById('begin-experiment-button');
        const instructionButton = document.getElementById('instruction-button');
        const answerTextEl = document.getElementById('answer-text');
        const noSpecificAnswerEl = document.getElementById('no-specific-answer');
        const refUserAnswerEl = document.getElementById('ref-user-answer');
        const candidateRadios = document.querySelectorAll('input[name="candidate"]');
        const satisfactionRadios = document.querySelectorAll('input[name="satisfaction"]');
        const improvementFeedback = document.getElementById('improvement-feedback');
        const improvementCheckboxes = document.querySelectorAll('input[name="improvement-feedback"]');
        const improveFbNoneCheckbox = document.getElementById('improve-fb-none');
        const improveFbNoneText = document.getElementById('improve-fb-none-text');
        const satisfactionAndFeedbackSection = document.getElementById('satisfaction-and-feedback-section');
        const finalReviewSection = document.getElementById('final-review-section');
        const unchosenFeedbackTitle = document.getElementById('unchosen-feedback-title');
        const feedbackCheckboxes = document.querySelectorAll('input[name="feedback"]');
        const fbNoneCheckbox = document.getElementById('fb-none');
        const fbNoneText = document.getElementById('fb-none-text');
        const finalAnswerText = document.getElementById('final-answer-text');
        const noSpecificFinalAnswerEl = document.getElementById('no-specific-final-answer');
        const part7AnswerTextEl = document.getElementById('part7-answer-text');
        const noSpecificPart7AnswerEl = document.getElementById('no-specific-part7-answer');
        const nsaKeyword = document.getElementById('nsa-keyword');
        const nsfaKeyword = document.getElementById('nsfa-keyword');
        const nspaKeyword = document.getElementById('nspa-keyword');
        const prevButtons = document.querySelectorAll('.prev-button');
        const nextButtons = document.querySelectorAll('.next-button');

        participantIdInput.addEventListener('input', () => {
            const id = parseInt(participantIdInput.value, 10);
            const groupA_IDs = [3, 4, 5];
            const groupB_IDs = [7, 10, 11];

            if (groupA_IDs.includes(id)) {
                dataFile = 'exp2_GroupA.jsonl';
                startExperimentButton.disabled = false;
            } else if (groupB_IDs.includes(id)) {
                dataFile = 'exp2_GroupB.jsonl';
                startExperimentButton.disabled = false;
            } else {
                dataFile = '';
                startExperimentButton.disabled = true;
            }
        });

        async function runExperiment() {
            // --- Data Loading ---
            const response = await fetch(dataFile);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            trials = text.trim().split('\n').map(line => JSON.parse(line));
            userAnswers = trials.map(() => ({ part1: {}, part2: {}, part3: {}, part4: {}, part5: {}, part6: {}, part7: {}, part8: {}, part9: {} }));

            // --- TOC ---
            generateTOC();
            startContainer.style.display = 'none';
            instructionContainer.style.display = 'block';
        }

        // --- TOC ---
        function generateTOC() {
            tocList.innerHTML = '';
            trials.forEach((trial, index) => {
                const keywordContainer = document.createElement('div');
                keywordContainer.classList.add('toc-keyword-container');
                const keywordEl = document.createElement('div');
                keywordEl.classList.add('toc-keyword');
                keywordEl.textContent = trial.keyword;
                keywordEl.dataset.index = index;
                keywordEl.addEventListener('click', () => {
                    const currentlyActive = document.querySelector('.toc-keyword-container.active');
                    if (currentlyActive && currentlyActive !== keywordContainer) {
                        currentlyActive.classList.remove('active');
                    }
                    keywordContainer.classList.toggle('active');
                });
                keywordContainer.appendChild(keywordEl);
                const questionsList = document.createElement('ul');
                questionsList.classList.add('toc-questions-list');
                const questions = [{ name: 'Event', part: 1 }, { name: 'Property', part: 4 }, { name: 'Emotion', part: 7 }];
                questions.forEach(q => {
                    const questionEl = document.createElement('li');
                    questionEl.textContent = q.name;
                    questionEl.dataset.index = index;
                    questionEl.dataset.part = q.part;
                    questionEl.addEventListener('click', handleTOCClick);
                    questionsList.appendChild(questionEl);
                });
                keywordContainer.appendChild(questionsList);
                tocList.appendChild(keywordContainer);
            });
        }

        function updateTOC() {
            const keywordContainers = tocList.querySelectorAll('.toc-keyword-container');
            let completedCount = 0;
            keywordContainers.forEach((container, index) => {
                const trialAnswers = userAnswers[index];
                const isCompleted = Object.keys(trialAnswers).every(part => trialAnswers[part] && Object.keys(trialAnswers[part]).length > 0);
                container.classList.remove('status-completed', 'status-not-started');
                if (isCompleted) {
                    container.classList.add('status-completed');
                    completedCount++;
                } else {
                    container.classList.add('status-not-started');
                }
                if (index === currentTrialIndex) {
                    container.classList.add('active');
                    const questionItems = container.querySelectorAll('li');
                    questionItems.forEach(item => {
                        const part = parseInt(item.dataset.part, 10);
                        if (part === currentPart) {
                            item.classList.add('active');
                        }
                        else {
                            item.classList.remove('active');
                        }
                    });
                } else {
                    container.classList.remove('active');
                }
            });
            tocCounter.textContent = `(${completedCount}/${trials.length})`;
        }

        function handleTOCClick(event) {
            const index = parseInt(event.target.dataset.index, 10);
            const part = parseInt(event.target.dataset.part, 10);
            if (index !== currentTrialIndex || part !== currentPart) {
                saveCurrentState();
                currentTrialIndex = index;
                currentPart = part;
                showView(currentTrialIndex, currentPart);
            }
        }

        function showInstructions() {
            saveCurrentState();
            contextPanel.style.display = 'none';
            mainPanel.style.width = '100%';
            mainWrapper.style.maxWidth = '1200px';
            part1Container.style.display = 'none';
            part2Container.style.display = 'none';
            part3Container.style.display = 'none';
            part4Container.style.display = 'none';
            part7Container.style.display = 'none';
            instructionContainer.style.display = 'block';
            beginExperimentButton.textContent = "Resume Experiment";
        }

        function showView(trialIndex, part) {
            part1Container.style.display = 'none';
            part2Container.style.display = 'none';
            part3Container.style.display = 'none';
            part4Container.style.display = 'none';
            part7Container.style.display = 'none';
            completionContainer.style.display = 'none';
            startContainer.style.display = 'none';
            instructionContainer.style.display = 'none';
            instructionContainer2.style.display = 'none';
            if (trialIndex >= trials.length) {
                contextPanel.style.display = 'none';
                mainPanel.style.width = '100%';
                mainPanel.style.padding = '0';
                completionContainer.style.display = 'block';
                return;
            }
            contextPanel.style.display = 'flex';
            mainPanel.style.padding = '20px';
            const trial = trials[trialIndex];
            contextKeywordEl.textContent = trial.keyword;
            contextSituationEl.innerHTML = getHighlightedHTML(trial.situation, trial.keyword, false);
            let question = '';
            if (part === 1 || part === 4 || part === 7) {
                mainWrapper.style.maxWidth = '1200px';
                mainPanel.style.width = '50%';
                contextPanel.style.width = '50%';
                contextUserAnswer.style.display = 'none';
            } else {
                mainWrapper.style.maxWidth = '1200px';
                mainPanel.style.width = '60%';
                contextPanel.style.width = '40%';
                contextUserAnswer.style.display = 'block';
            }
            if (part === 1) {
                contextQuestionContainer.querySelector('hr').style.display = 'none';
                part1QuestionContainer.appendChild(contextQuestionContainer);
                question = trial.question;
                nsaKeyword.textContent = trial.keyword;
                part1Container.style.display = 'block';
            } else if (part === 4) {
                contextQuestionContainer.querySelector('hr').style.display = 'none';
                part4QuestionContainer.appendChild(contextQuestionContainer);
                question = `Q: What are the prominent <strong>properties</strong> of the <span class="highlight">${trial.keyword}</span> in this situation? In your interpretation, what properties stand out as most meaningful or relevant in this context?`;
                nsfaKeyword.textContent = trial.keyword;
                part4Container.style.display = 'block';
            } else if (part === 7) {
                contextQuestionContainer.querySelector('hr').style.display = 'none';
                part7QuestionContainer.appendChild(contextQuestionContainer);
                question = `Q: Which <b>emotions or wishes</b> does the <span class="highlight">${trial.keyword}</span> evoke in the situation?`;
                nspaKeyword.textContent = trial.keyword;
                part7Container.style.display = 'block';
            } else {
                contextQuestionContainer.querySelector('hr').style.display = 'block';
                contextContentEl.appendChild(contextQuestionContainer);
                if (part === 2) {
                    question = trial.question;
                    part2Container.style.display = 'block';
                } else if (part === 3) {
                    question = trial.question;
                    part3Container.style.display = 'block';
                } else if (part === 5) {
                    question = `Q: What are the prominent <strong>properties</strong> of the <span class="highlight">${trial.keyword}</span> in this situation? In your interpretation, what properties stand out as most meaningful or relevant in this context?`;
                    part2Container.style.display = 'block';
                } else if (part === 6) {
                    question = `Q: What are the prominent <strong>properties</strong> of the <span class="highlight">${trial.keyword}</span> in this situation? In your interpretation, what properties stand out as most meaningful or relevant in this context?`;
                    part3Container.style.display = 'block';
                } else if (part === 8) {
                    question = `Q: Which <b>emotions or wishes</b> does the <span class="highlight">${trial.keyword}</span> evoke in the situation?`;
                    part2Container.style.display = 'block';
                } else if (part === 9) {
                    question = `Q: Which <b>emotions or wishes</b> does the <span class="highlight">${trial.keyword}</span> evoke in the situation?`;
                    part3Container.style.display = 'block';
                }
            }
            contextQuestionEl.innerHTML = getHighlightedHTML(question, trial.keyword, true);
            loadState(trialIndex, part);
            updateButtonStates();
            updateTOC();
        }

        function getImprovementFeedback() {
            const feedback = [];
            document.querySelectorAll('input[name="improvement-feedback"]:checked').forEach(checkbox => {
                if (checkbox.value === 'none') {
                    if (improveFbNoneText.value) feedback.push(`Other: ${improveFbNoneText.value}`);
                } else {
                    feedback.push(checkbox.value);
                }
            });
            return { feedback: feedback, noneText: improveFbNoneText.value };
        }

        function saveCurrentState() {
            if (currentTrialIndex >= trials.length) return;
            const trialAnswers = userAnswers[currentTrialIndex];
            if (currentPart === 1) {
                trialAnswers.part1.answer = noSpecificAnswerEl.checked ? "Nothing specific" : answerTextEl.value;
                trialAnswers.part1.noSpecific = noSpecificAnswerEl.checked;
            } else if (currentPart === 2) {
                const candidate = document.querySelector('input[name="candidate"]:checked');
                const satisfaction = document.querySelector('input[name="satisfaction"]:checked');
                trialAnswers.part2.candidateChoice = candidate ? candidate.value : null;
                trialAnswers.part2.satisfaction = satisfaction ? satisfaction.value : null;
                const improvementData = getImprovementFeedback();
                trialAnswers.part2.improvementFeedback = improvementData.feedback;
                trialAnswers.part2.improvementFbNoneText = improvementData.noneText;
            } else if (currentPart === 3) {
                const feedback = [];
                document.querySelectorAll('input[name="feedback"]:checked').forEach(checkbox => {
                    if (checkbox.value === 'none') {
                        if (fbNoneText.value) feedback.push(`Other: ${fbNoneText.value}`);
                    } else {
                        feedback.push(checkbox.value);
                    }
                });
                trialAnswers.part3.unchosenFeedback = feedback;
                trialAnswers.part3.fbNoneText = fbNoneText.value;
            } else if (currentPart === 4) {
                trialAnswers.part4.finalAnswer = noSpecificFinalAnswerEl.checked ? "Nothing specific" : finalAnswerText.value;
                trialAnswers.part4.noSpecificFinal = noSpecificFinalAnswerEl.checked;
            } else if (currentPart === 5) {
                const candidate = document.querySelector('input[name="candidate"]:checked');
                const satisfaction = document.querySelector('input[name="satisfaction"]:checked');
                trialAnswers.part5.candidateChoice = candidate ? candidate.value : null;
                trialAnswers.part5.satisfaction = satisfaction ? satisfaction.value : null;
                const improvementData = getImprovementFeedback();
                trialAnswers.part5.improvementFeedback = improvementData.feedback;
                trialAnswers.part5.improvementFbNoneText = improvementData.noneText;
            } else if (currentPart === 6) {
                const feedback = [];
                document.querySelectorAll('input[name="feedback"]:checked').forEach(checkbox => {
                    if (checkbox.value === 'none') {
                        if (fbNoneText.value) feedback.push(`Other: ${fbNoneText.value}`);
                    } else {
                        feedback.push(checkbox.value);
                    }
                });
                trialAnswers.part6.unchosenFeedback = feedback;
                trialAnswers.part6.fbNoneText = fbNoneText.value;
            } else if (currentPart === 7) {
                trialAnswers.part7.answer = noSpecificPart7AnswerEl.checked ? "Nothing specific" : part7AnswerTextEl.value;
                trialAnswers.part7.noSpecific = noSpecificPart7AnswerEl.checked;
            } else if (currentPart === 8) {
                const candidate = document.querySelector('input[name="candidate"]:checked');
                const satisfaction = document.querySelector('input[name="satisfaction"]:checked');
                trialAnswers.part8.candidateChoice = candidate ? candidate.value : null;
                trialAnswers.part8.satisfaction = satisfaction ? satisfaction.value : null;
                const improvementData = getImprovementFeedback();
                trialAnswers.part8.improvementFeedback = improvementData.feedback;
                trialAnswers.part8.improvementFbNoneText = improvementData.noneText;
            } else if (currentPart === 9) {
                const feedback = [];
                document.querySelectorAll('input[name="feedback"]:checked').forEach(checkbox => {
                    if (checkbox.value === 'none') {
                        if (fbNoneText.value) feedback.push(`Other: ${fbNoneText.value}`);
                    } else {
                        feedback.push(checkbox.value);
                    }
                });
                trialAnswers.part9.unchosenFeedback = feedback;
                trialAnswers.part9.fbNoneText = fbNoneText.value;
            }
        }

        function loadImprovementFeedback(partAnswers) {
            improvementCheckboxes.forEach(checkbox => checkbox.checked = false);
            if (partAnswers.improvementFeedback) {
                partAnswers.improvementFeedback.forEach(fb => {
                    if (fb.startsWith('Other:')) {
                        const noneCheckbox = document.querySelector('input[name="improvement-feedback"][value="none"]');
                        if (noneCheckbox) noneCheckbox.checked = true;
                        improveFbNoneText.value = fb.replace('Other: ', '');
                        improveFbNoneText.disabled = false;
                    } else {
                        const checkbox = document.querySelector(`input[name="improvement-feedback"][value="${fb}"]`);
                        if (checkbox) checkbox.checked = true;
                    }
                });
            }
            improveFbNoneText.disabled = !document.querySelector('input[name="improvement-feedback"][value="none"]:checked');
            if (partAnswers.satisfaction && partAnswers.satisfaction !== '5') {
                improvementFeedback.style.display = 'block';
            } else {
                improvementFeedback.style.display = 'none';
            }
        }

        function loadState(trialIndex, part) {
            const trialAnswers = userAnswers[trialIndex];
            if (part === 1) {
                answerTextEl.value = trialAnswers.part1.answer || '';
                noSpecificAnswerEl.checked = trialAnswers.part1.noSpecific || false;
                answerTextEl.disabled = noSpecificAnswerEl.checked;
            } else if (part === 2 || part === 5 || part === 8) {
                const partKey = `part${part}`;
                const prevPartKey = part === 2 ? 'part1' : (part === 5 ? 'part4' : 'part7');
                const candidatesKey = part === 2 ? 'candidates' : (part === 5 ? 'candidates2' : 'candidates3');

                refUserAnswerEl.textContent = userAnswers[trialIndex][prevPartKey].answer || '';
                
                const candidateA = trials[trialIndex][candidatesKey].A;
                const candidateB = trials[trialIndex][candidatesKey].B;
                const candidateSelectionEl = part2Container.querySelector('.candidate-selection');
                const satisfactionQuestionEl = satisfactionAndFeedbackSection.querySelector('.satisfaction-rating h2.label');

                // Always display candidate selection, regardless of whether they are both 'None'
                candidateSelectionEl.style.display = 'block'; // Ensure it's visible

                document.getElementById('candidate-a').innerHTML = createSpacedHTML(candidateA);
                document.getElementById('candidate-b').innerHTML = createSpacedHTML(candidateB);

                if (candidateA === 'None' && candidateB === 'None') {
                    satisfactionQuestionEl.textContent = "Q: Both models answered 'None'. How satisfied are you with this answer?";
                    satisfactionAndFeedbackSection.style.display = 'block'; // Show satisfaction directly

                    // Disable candidate radios as selection is not needed
                    candidateRadios.forEach(radio => {
                        radio.checked = false;
                        radio.disabled = true;
                    });
                    
                    satisfactionRadios.forEach(radio => {
                        radio.disabled = false;
                        radio.checked = radio.value === trialAnswers[partKey].satisfaction;
                    });
                    loadImprovementFeedback(trialAnswers[partKey]);

                } else {
                    // Existing logic for different/non-None answers
                    satisfactionQuestionEl.textContent = "Q: How satisfied are you with your chosen answer?";

                    candidateRadios.forEach(radio => {
                        radio.disabled = false; // Ensure they are enabled for normal comparison
                        radio.checked = radio.value === trialAnswers[partKey].candidateChoice;
                    });
                    
                    if (trialAnswers[partKey].candidateChoice) {
                        satisfactionAndFeedbackSection.style.display = 'block';
                        satisfactionRadios.forEach(radio => {
                            radio.disabled = false;
                            radio.checked = radio.value === trialAnswers[partKey].satisfaction;
                        });
                        loadImprovementFeedback(trialAnswers[partKey]);
                    } else {
                        satisfactionAndFeedbackSection.style.display = 'none';
                        satisfactionRadios.forEach(radio => {
                            radio.disabled = true;
                            radio.checked = false;
                        });
                    }
                }
            } else if (part === 3) {
                refUserAnswerEl.textContent = userAnswers[trialIndex].part1.answer || '';
                const { candidateChoice } = trialAnswers.part2;
                const unchosenChoice = candidateChoice === 'A' ? 'B' : 'A';
                finalReviewSection.innerHTML = `<div class="user-submission-review"><h2 class="label">Your Answer:</h2><p>${trialAnswers.part1.answer || ''}</p></div><div class="candidate-selection"><h2 class="label">Q: Choose the better answer between:</h2><div id="candidate-choices-wrapper"><div class="candidate-choice"><label class="candidate-label ${candidateChoice === 'A' ? '' : 'highlight-negative'}"><div class="candidate-title">Answer A</div><div class="candidate-content">${createSpacedHTML(trials[trialIndex].candidates.A)}</div></label></div><div class="candidate-choice"><label class="candidate-label ${candidateChoice === 'B' ? '' : 'highlight-negative'}"><div class="candidate-title">Answer B</div><div class="candidate-content">${createSpacedHTML(trials[trialIndex].candidates.B)}</div></label></div></div></div>`;
                unchosenFeedbackTitle.innerHTML = `Q: What did you NOT like about the answer you did not choose? (Answer ${unchosenChoice})<br><span class="subtitle">Choose all that apply:</span>`;
                feedbackCheckboxes.forEach(checkbox => checkbox.checked = false);
                if (trialAnswers.part3.unchosenFeedback) {
                    trialAnswers.part3.unchosenFeedback.forEach(fb => {
                        if (fb.startsWith('Other:')) {
                            const noneCheckbox = document.querySelector('input[name="feedback"][value="none"]');
                            if (noneCheckbox) noneCheckbox.checked = true;
                            fbNoneText.value = fb.replace('Other: ', '');
                            fbNoneText.disabled = false;
                        } else {
                            const checkbox = document.querySelector(`input[name="feedback"][value="${fb}"]`);
                            if (checkbox) checkbox.checked = true;
                        }
                    });
                }
                fbNoneText.disabled = !document.querySelector('input[name="feedback"][value="none"]:checked');
            } else if (part === 4) {
                finalAnswerText.value = trialAnswers.part4.finalAnswer || '';
                noSpecificFinalAnswerEl.checked = trialAnswers.part4.noSpecificFinal || false;
                finalAnswerText.disabled = noSpecificFinalAnswerEl.checked;
            } else if (part === 6) {
                refUserAnswerEl.textContent = userAnswers[trialIndex].part4.finalAnswer || '';
                const { candidateChoice } = trialAnswers.part5;
                const unchosenChoice = candidateChoice === 'A' ? 'B' : 'A';
                finalReviewSection.innerHTML = `<div class="user-submission-review"><h2 class="label">Your Answer:</h2><p>${trialAnswers.part4.finalAnswer || ''}</p></div><div class="candidate-selection"><h2 class="label">Q: Choose the better answer between:</h2><div id="candidate-choices-wrapper"><div class="candidate-choice"><label class="candidate-label ${candidateChoice === 'A' ? '' : 'highlight-negative'}"><div class="candidate-title">Answer A</div><div class="candidate-content">${createSpacedHTML(trials[trialIndex].candidates2.A)}</div></label></div><div class="candidate-choice"><label class="candidate-label ${candidateChoice === 'B' ? '' : 'highlight-negative'}"><div class="candidate-title">Answer B</div><div class="candidate-content">${createSpacedHTML(trials[trialIndex].candidates2.B)}</div></label></div></div></div>`;
                unchosenFeedbackTitle.innerHTML = `Q: What did you NOT like about the answer you did not choose? (Answer ${unchosenChoice})<br><span class="subtitle">Choose all that apply:</span>`;
                feedbackCheckboxes.forEach(checkbox => checkbox.checked = false);
                if (trialAnswers.part6.unchosenFeedback) {
                    trialAnswers.part6.unchosenFeedback.forEach(fb => {
                        if (fb.startsWith('Other:')) {
                            const noneCheckbox = document.querySelector('input[name="feedback"][value="none"]');
                            if (noneCheckbox) noneCheckbox.checked = true;
                            fbNoneText.value = fb.replace('Other: ', '');
                            fbNoneText.disabled = false;
                        } else {
                            const checkbox = document.querySelector(`input[name="feedback"][value="${fb}"]`);
                            if (checkbox) checkbox.checked = true;
                        }
                    });
                }
                fbNoneText.disabled = !document.querySelector('input[name="feedback"][value="none"]:checked');
            } else if (part === 7) {
                part7AnswerTextEl.value = trialAnswers.part7.answer || '';
                noSpecificPart7AnswerEl.checked = trialAnswers.part7.noSpecific || false;
                part7AnswerTextEl.disabled = noSpecificPart7AnswerEl.checked;
            } else if (part === 9) {
                refUserAnswerEl.textContent = userAnswers[trialIndex].part7.answer || '';
                const { candidateChoice } = trialAnswers.part8;
                const unchosenChoice = candidateChoice === 'A' ? 'B' : 'A';
                finalReviewSection.innerHTML = `<div class="user-submission-review"><h2 class="label">Your Answer:</h2><p>${trialAnswers.part7.answer || ''}</p></div><div class="candidate-selection"><h2 class="label">Q: Choose the better answer between:</h2><div id="candidate-choices-wrapper"><div class="candidate-choice"><label class="candidate-label ${candidateChoice === 'A' ? '' : 'highlight-negative'}"><div class="candidate-title">Answer A</div><div class="candidate-content">${createSpacedHTML(trials[trialIndex].candidates3.A)}</div></label></div><div class="candidate-choice"><label class="candidate-label ${candidateChoice === 'B' ? '' : 'highlight-negative'}"><div class="candidate-title">Answer B</div><div class="candidate-content">${createSpacedHTML(trials[trialIndex].candidates3.B)}</div></label></div></div></div>`;
                unchosenFeedbackTitle.innerHTML = `Q: What did you NOT like about the answer you did not choose? (Answer ${unchosenChoice})<br><span class="subtitle">Choose all that apply:</span>`;
                feedbackCheckboxes.forEach(checkbox => checkbox.checked = false);
                if (trialAnswers.part9.unchosenFeedback) {
                    trialAnswers.part9.unchosenFeedback.forEach(fb => {
                        if (fb.startsWith('Other:')) {
                            const noneCheckbox = document.querySelector('input[name="feedback"][value="none"]');
                            if (noneCheckbox) noneCheckbox.checked = true;
                            fbNoneText.value = fb.replace('Other: ', '');
                            fbNoneText.disabled = false;
                        } else {
                            const checkbox = document.querySelector(`input[name="feedback"][value="${fb}"]`);
                            if (checkbox) checkbox.checked = true;
                        }
                    });
                }
                fbNoneText.disabled = !document.querySelector('input[name="feedback"][value="none"]:checked');
            }
        }

        function isPartComplete() {
            if (currentTrialIndex >= trials.length) return true;
            if (currentPart === 1) {
                return (answerTextEl.value.trim() !== '') || noSpecificAnswerEl.checked;
            } else if (currentPart === 2 || currentPart === 5 || currentPart === 8) {
                const trial = trials[currentTrialIndex];
                const candidatesKey = currentPart === 2 ? 'candidates' : (currentPart === 5 ? 'candidates2' : 'candidates3');
                const satisfaction = document.querySelector('input[name="satisfaction"]:checked');
                
                const candidateA = trial[candidatesKey].A;
                const candidateB = trial[candidatesKey].B;

                if (candidateA === 'None' && candidateB === 'None') {
                    if (!satisfaction) return false;
                } else {
                    const candidate = document.querySelector('input[name="candidate"]:checked');
                    if (!candidate || !satisfaction) return false;
                }
                if (satisfaction.value < 5) {
                    const improvementCheckboxes = document.querySelectorAll('input[name="improvement-feedback"]:checked');
                    if (improvementCheckboxes.length === 0) {
                        return false;
                    }
                    if (improveFbNoneCheckbox.checked && improveFbNoneText.value.trim() === '') {
                        return false;
                    }
                }
                return true;
            } else if (currentPart === 3 || currentPart === 6 || currentPart === 9) {
                const feedbackCheckboxes = document.querySelectorAll('input[name="feedback"]:checked');
                if (feedbackCheckboxes.length === 0) {
                    return false;
                }
                if (fbNoneCheckbox.checked && fbNoneText.value.trim() === '') {
                    return false;
                }
                return true;
            } else if (currentPart === 4) {
                return (finalAnswerText.value.trim() !== '') || noSpecificFinalAnswerEl.checked;
            } else if (currentPart === 7) {
                return (part7AnswerTextEl.value.trim() !== '') || noSpecificPart7AnswerEl.checked;
            }
            return false;
        }
    

        function updateButtonStates() {
            const isFirstPage = currentTrialIndex === 0 && currentPart === 1;
            prevButtons.forEach(button => button.disabled = isFirstPage);
            nextButtons.forEach(button => button.disabled = !isPartComplete());
        }

        function nextPage() {
            saveCurrentState();
            if (!isPartComplete()) {
                alert("Please complete the current question before proceeding.");
                return;
            }
            if (currentPart < 9) {
                currentPart++;
            } else {
                console.log(`Trial ${currentTrialIndex + 1} Data:`, userAnswers[currentTrialIndex]);
                currentTrialIndex++;
                currentPart = 1;
            }
            showView(currentTrialIndex, currentPart);
        }

        function previousPage() {
            saveCurrentState();
            if (currentPart > 1) {
                currentPart--;
            } else {
                if (currentTrialIndex > 0) {
                    currentTrialIndex--;
                    currentPart = 9;
                }
            }
            showView(currentTrialIndex, currentPart);
        }

        const createSpacedHTML = (text) => {
            if (!text || text.trim() === '') {
                return '<div class="none-answer">None</div>';
            }
            // Check if the content is explicitly 'None' (case-insensitive)
            if (text.trim().toLowerCase() === 'none') {
                return '<div class="none-answer">None</div>'; // Add a class for styling
            }
            return text.split('\n').map(line => `<div class="${line.trim().startsWith('•') ? 'bullet-item' : ''}">${line}</div>`).join('');
        };
        const getHighlightedHTML = (text, keyword, isGlobal) => {
            const flags = isGlobal ? 'gi' : 'i';
            const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\\]{}]/g, '\\$&');
            const regex = new RegExp(`(${escapedKeyword}s?)`, flags);
            return text.replace(regex, '<span class="highlight">$1</span>');
        };

        startExperimentButton.addEventListener('click', () => {
            runExperiment().catch(error => {
                console.error("Failed to run the experiment:", error);
                document.body.innerHTML = `<div style="color: red; padding: 20px;">
                    <h1>Error</h1>
                    <p>Could not load required data. Please ensure you are running this application from a web server, not by opening the HTML file directly.</p>
                    <p><strong>Error details:</strong> ${error.message}</p>
                </div>`;
            });
        });

        nextInstructionButton.addEventListener('click', () => {
            instructionContainer.style.display = 'none';
            instructionContainer2.style.display = 'block';
            if (!experimentStarted) {
                beginExperimentButton.textContent = "Begin Experiment";
            } else {
                beginExperimentButton.textContent = "Resume Experiment";
            }
        });

        instructionButton.addEventListener('click', showInstructions);

        beginExperimentButton.addEventListener('click', () => {
            instructionContainer2.style.display = 'none';
            if (!experimentStarted) {
                experimentStarted = true;
            }
            showView(currentTrialIndex, currentPart);
        });

        prevButtons.forEach(button => button.addEventListener('click', previousPage));
        nextButtons.forEach(button => button.addEventListener('click', nextPage));

        answerTextEl.addEventListener('input', () => { saveCurrentState(); updateButtonStates(); });
        noSpecificAnswerEl.addEventListener('change', () => { answerTextEl.disabled = noSpecificAnswerEl.checked; if (noSpecificAnswerEl.checked) answerTextEl.value = ''; saveCurrentState(); updateButtonStates(); });

        candidateRadios.forEach(radio => radio.addEventListener('change', () => {
            satisfactionAndFeedbackSection.style.display = 'block';
            satisfactionRadios.forEach(r => {
                r.disabled = false;
                r.checked = false; // Reset satisfaction
            });
            improvementFeedback.style.display = 'none'; // Hide improvement feedback
            improvementCheckboxes.forEach(cb => cb.checked = false); // Clear checkboxes
            improveFbNoneText.value = '';
            improveFbNoneText.disabled = true;
            saveCurrentState(); // This will save the new candidate and null satisfaction
            updateButtonStates();
        }));
        satisfactionRadios.forEach(radio => radio.addEventListener('change', () => {
            const selectedSatisfaction = document.querySelector('input[name="satisfaction"]:checked');
            if (selectedSatisfaction && selectedSatisfaction.value !== '5') {
                improvementCheckboxes.forEach(cb => cb.checked = false); // Clear checkboxes when section becomes visible
                improveFbNoneText.value = ''; // Also clear the "Other" text
                improveFbNoneText.disabled = true; // Disable "Other" text initially
                improvementFeedback.style.display = 'block';
            } else {
                improvementFeedback.style.display = 'none';
                improvementCheckboxes.forEach(cb => cb.checked = false);
                improveFbNoneText.value = '';
                improveFbNoneText.disabled = true;
            }
            saveCurrentState();
            updateButtonStates();
        }));

        improvementCheckboxes.forEach(checkbox => checkbox.addEventListener('change', () => { saveCurrentState(); updateButtonStates(); }));
        improveFbNoneCheckbox.addEventListener('change', () => { improveFbNoneText.disabled = !improveFbNoneCheckbox.checked; if (!improveFbNoneCheckbox.checked) improveFbNoneText.value = ''; saveCurrentState(); updateButtonStates(); });
        improveFbNoneText.addEventListener('input', () => { saveCurrentState(); updateButtonStates(); });

        feedbackCheckboxes.forEach(checkbox => checkbox.addEventListener('change', () => { saveCurrentState(); updateButtonStates(); }));
        fbNoneCheckbox.addEventListener('change', () => { fbNoneText.disabled = !fbNoneCheckbox.checked; if (!fbNoneCheckbox.checked) fbNoneText.value = ''; saveCurrentState(); updateButtonStates(); });
        fbNoneText.addEventListener('input', () => { saveCurrentState(); updateButtonStates(); });

        finalAnswerText.addEventListener('input', () => { saveCurrentState(); updateButtonStates(); });
        noSpecificFinalAnswerEl.addEventListener('change', () => { finalAnswerText.disabled = noSpecificFinalAnswerEl.checked; if (noSpecificFinalAnswerEl.checked) finalAnswerText.value = ''; saveCurrentState(); updateButtonStates(); });

        part7AnswerTextEl.addEventListener('input', () => { saveCurrentState(); updateButtonStates(); });
        noSpecificPart7AnswerEl.addEventListener('change', () => { part7AnswerTextEl.disabled = noSpecificPart7AnswerEl.checked; if (noSpecificPart7AnswerEl.checked) part7AnswerTextEl.value = ''; saveCurrentState(); updateButtonStates(); });

        // --- Initial Load ---
        startContainer.style.display = 'block';
        mainPanel.style.width = '100%';
        part1Container.style.display = 'none';
        part2Container.style.display = 'none';
        part3Container.style.display = 'none';
        part4Container.style.display = 'none';
        part7Container.style.display = 'none';
        completionContainer.style.display = 'none';
        instructionContainer.style.display = 'none';
        instructionContainer2.style.display = 'none';
    }

    main().catch(error => {
        console.error("Failed to initialize the application:", error);
        document.body.innerHTML = `<div style="color: red; padding: 20px;">
            <h1>Error</h1>
            <p>Could not load required data. Please ensure you are running this application from a web server, not by opening the HTML file directly.</p>
            <p><strong>Error details:</strong> ${error.message}</p>
        </div>`;
    });
});
