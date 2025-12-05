document.addEventListener('DOMContentLoaded', () => {
    const trials = [
        {
            keyword: "pigeon",
            situation: "I guess Jason's parents let his pigeons loose, and they're taking over the neighborhood, pooping all over everything.",
            question: "Q: <b>What happened</b> with the pigeons in the situation? What did they do or what occurred to them?",
            candidates: {
                A: "• They are released into the neighborhood\n• They cause mess by leaving droppings",
                B: "• Something happens because of: the pigeons are released into the neighborhood\n• This can be prevented by: being confined, lack of food\n• This includes these steps: pigeons fly away, pigeons land, pigeons poop\n• Situations often happen before: pigeons settle in the neighborhood\n• This typically happens after: pigeons cause mess in the area\n• This happens to others afterward: the neighborhood becomes messy, people may be annoyed."
            },
            candidates2: {
                A: "• They can become a nuisance when uncontrolled\n• They are often associated with urban environments",
                B: "• It's used for: can be kept as pets, can be used for racing\n• It has the quality of: is a bird, can fly, can be noisy\n• It's made of: feathers, beak, wings\n• It's typically found at: in the neighborhood, on rooftops\n• It's capable of: flying, nesting, foraging for food."
            },
            candidates3: {
                A: "• Frustration (Implied by the negative impact of their presence in the neighborhood.)",
                B: "• Others want to: to find food, to settle in a new area."
            }
        },
        {
            keyword: "diner",
            situation: "Dogs aren't allowed in the diner.",
            question: "Q: <b>What happened</b> with the diner in the situation? What did they do or what occurred to them?",
            candidates: {
                A: "• Dogs are not permitted in them.",
                B: "• Something happens because of: the diner enforces a no-dogs policy\n• This can be prevented by: presence of dogs, lack of enforcement\n• Situations often happen before: customers enter the diner\n• This typically happens after: customers are informed of the policy\n• This happens to others afterward: customers may leave dogs outside, some may feel disappointed"
            },
            candidates2: {
                A: "• They maintain specific rules for hygiene and customer comfort.\n• They are social spaces focused on dining experiences.",
                B: "• It's used for: serves food and drinks\n• It has the quality of: public eating establishment, has seating\n• It's typically found at: located in a commercial area"
            },
            candidates3: {
                A: "None",
                B: "• Others want to: to maintain a clean environment, to comply with health regulations"
            }
        },
        {
            keyword: "cigar",
            situation: "Forster was so nervous that his hand shook as he lit his cigar.",
            question: "Q: <b>What happened</b> with the cigar in the situation? What did they do or what occurred to them?",
            candidates: {
                A: "• PersonX lights it",
                B: "• Something happens because of: the cigar is lit to be smoked\n• This can be prevented by: lack of matches or lighter, wet conditions\n• This includes these steps: the cigar is taken out, the cigar is lit, the cigar is smoked\n• Situations often happen before: the cigar is smoked\n• This typically happens after: the cigar is extinguished\n• This happens to the person in the scene afterward: PersonX feels nervous while lighting the cigar\n• This happens to others afterward: others may notice the smell of smoke"
            },
            candidates2: {
                A: "• It can symbolize relaxation or indulgence\n• It may serve as a coping mechanism in stressful situations",
                B: "• It's used for: used for smoking\n• It has the quality of: cylindrical, made of tobacco\n• It's made of: tobacco leaves, wrapper\n• It's typically found at: in a person's hand, in an ashtray"
            },
            candidates3: {
                A: "• Tension (The act of lighting a cigar contrasts with the nervousness of PersonX.)",
                B: "None"
            }
        },
        {
            keyword: "summer",
            situation: "It's a Shangri-La of lush, manicured hedgerows, $75,000 summer rentals and vacationing celebrities.",
            question: "Q: <b>What happened</b> with summer in the situation? What did they do or what occurred to them?",
            candidates: {
                A: "• PlaceX is a destination during summer\n• Celebrities vacation in PlaceX during summer",
                B: "• Something happens because of: summer brings warm weather and vacation opportunities\n• This includes these steps: people rent summer homes, celebrities visit, events are planned\n• Situations often happen before: summer leads to fall\n• This typically happens after: summer ends\n• This happens to others afterward: increased tourism, higher rental prices"
            },
            candidates2: {
                A: "• It is associated with leisure and relaxation\n• It signifies a peak season for tourism and luxury experiences",
                B: "• It's used for: associated with vacations and leisure activities\n• It has the quality of: warm, vibrant, seasonal\n• It's typically found at: vacation destinations, coastal areas"
            },
            candidates3: {
                A: "None",
                B: "• Others want to: to enjoy summer activities, to vacation"
            }
        },
        {
            keyword: "agony",
            situation: "By that time we were halfway there and I was in such agony and so mad at Dr. Dana for leaving me that I couldn't think about I could n't think about anything else.",
            question: "Q: <b>What happened</b> with agony in the situation? What did they do or what occurred to them?",
            candidates: {
                A: "• PersonX suffers from intense pain\n• PersonX's thoughts are dominated by agony",
                B: "• Something happens because of: the situation or condition leads to feelings of agony\n• This can be prevented by: distraction from pain, support from others\n• The person in the scene acts because: PersonX's reason for feeling agony is the situation\n• Situations often happen before: PersonX seeks relief from agony\n• This typically happens after: PersonX continues to feel agony\n• This happens to the person in the scene afterward: PersonX remains in a state of distress\n• This happens to others afterward: others may feel helpless or sympathetic"
            },
            candidates2: {
                A: "• It can impair cognitive function and focus\n• It often coexists with feelings of frustration or anger",
                B: "• It has the quality of: intense pain, emotional distress\n• It's capable of: overwhelming focus on pain, affecting thoughts"
            },
            candidates3: {
                A: "• Anger (Directed towards PersonY for leaving them in pain.)",
                B: "• The person in the scene feels: feels mad, frustrated\n• Others feel: others may feel concern or confusion\n• The person in the scene wants to: to find relief from agony\n• Others want to: to help PersonX or understand their pain"
            }
        }
    ];

    let currentTrialIndex = 0;
    let currentPart = 1;
    let userAnswers = trials.map(() => ({ part1: {}, part2: {}, part3: {}, part4: {}, part5: {}, part6: {}, part7: {}, part8: {}, part9: {} }));

    // --- DOM Elements ---
    const contextPanel = document.getElementById('context-panel');
    const mainPanel = document.getElementById('main-panel');
    const mainWrapper = document.getElementById('main-wrapper');
    const contextKeywordEl = document.getElementById('context-keyword');
    const contextSituationEl = document = document.getElementById('context-situation');
    const contextQuestionEl = document.getElementById('context-question');
    const contextQuestionContainer = document.getElementById('context-question-container');
    const contextContentEl = document.querySelector('.context-content');
    const part1QuestionContainer = document.getElementById('part1-question-container');
    const part4QuestionContainer = document.getElementById('part4-question-container');
    const part7QuestionContainer = document.getElementById('part7-question-container');
    const tocList = document.getElementById('toc-list');
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
    const nextInstructionButton = document.getElementById('next-instruction-button');
    const beginExperimentButton = document.getElementById('begin-experiment-button');
    const instructionButton = document.getElementById('instruction-button');

    // Part 1
    const answerTextEl = document.getElementById('answer-text');
    const noSpecificAnswerEl = document.getElementById('no-specific-answer');

    // Part 2
    const refUserAnswerEl = document.getElementById('ref-user-answer');
    const candidateRadios = document.querySelectorAll('input[name="candidate"]');
    const satisfactionRadios = document.querySelectorAll('input[name="satisfaction"]');

    // Part 3
    const finalReviewSection = document.getElementById('final-review-section');
    const unchosenFeedbackTitle = document.getElementById('unchosen-feedback-title');
    const feedbackCheckboxes = document.querySelectorAll('input[name="feedback"]');
    const fbNoneCheckbox = document.getElementById('fb-none');
    const fbNoneText = document.getElementById('fb-none-text');

    // Part 4
    const finalAnswerText = document.getElementById('final-answer-text');
    const noSpecificFinalAnswerEl = document.getElementById('no-specific-final-answer');

    // Part 7
    const part7AnswerTextEl = document.getElementById('part7-answer-text');
    const noSpecificPart7AnswerEl = document.getElementById('no-specific-part7-answer');

    // Navigation
    const prevButtons = document.querySelectorAll('.prev-button');
    const nextButtons = document.querySelectorAll('.next-button');

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

            const questions = [
                { name: 'Event', part: 1 },
                { name: 'Property', part: 4 },
                { name: 'Emotion', part: 7 }
            ];

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
        keywordContainers.forEach((container, index) => {
            const trialAnswers = userAnswers[index];
            const isCompleted = Object.keys(trialAnswers).every(part => trialAnswers[part] && Object.keys(trialAnswers[part]).length > 0);

            container.classList.remove('status-completed', 'status-not-started');

            if (isCompleted) {
                container.classList.add('status-completed');
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
                    } else {
                        item.classList.remove('active');
                    }
                });
            } else {
                container.classList.remove('active');
            }
        });
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
        mainWrapper.style.maxWidth = '900px';

        part1Container.style.display = 'none';
        part2Container.style.display = 'none';
        part3Container.style.display = 'none';
        part4Container.style.display = 'none';
        part7Container.style.display = 'none';

        instructionContainer.style.display = 'block';
        beginExperimentButton.textContent = "Resume Experiment";
    }

    // --- View Management ---
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
            mainWrapper.style.maxWidth = '1000px';
            mainPanel.style.width = '50%';
            contextPanel.style.width = '50%';
            contextUserAnswer.style.display = 'none'; // Hide for these parts
        } else { // parts 2, 3, 5, 6, 8, 9
            mainWrapper.style.maxWidth = '1200px';
            mainPanel.style.width = '60%';
            contextPanel.style.width = '40%';
            contextUserAnswer.style.display = 'block'; // Show for these parts
        }

        if (part === 1) {
            contextQuestionContainer.querySelector('hr').style.display = 'none';
            part1QuestionContainer.appendChild(contextQuestionContainer);
            question = trial.question;
            part1Container.style.display = 'block';
        } else if (part === 4) {
            contextQuestionContainer.querySelector('hr').style.display = 'none';
            part4QuestionContainer.appendChild(contextQuestionContainer);
            question = `Q: What are the prominent <strong>properties</strong> of the <span class="highlight">${trial.keyword}</span> in this situation? In your interpretation, what properties stand out as most meaningful or relevant in this context?`;
            part4Container.style.display = 'block';
        } else if (part === 7) {
            contextQuestionContainer.querySelector('hr').style.display = 'none';
            part7QuestionContainer.appendChild(contextQuestionContainer);
            question = `Q: Which <b>emotions or wishes</b> does the <span class="highlight">${trial.keyword}</span> evoke in the situation?`;
            part7Container.style.display = 'block';
        }
        else { // parts 2, 3, 5, 6, 8, 9
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

    // --- State Management ---
    function saveCurrentState() {
        const trialAnswers = userAnswers[currentTrialIndex];
        if (currentPart === 1) {
            trialAnswers.part1.answer = noSpecificAnswerEl.checked ? "Nothing specific" : answerTextEl.value;
            trialAnswers.part1.noSpecific = noSpecificAnswerEl.checked;
        } else if (currentPart === 2) {
            const candidate = document.querySelector('input[name="candidate"]:checked');
            const satisfaction = document.querySelector('input[name="satisfaction"]:checked');
            trialAnswers.part2.candidateChoice = candidate ? candidate.value : null;
            trialAnswers.part2.satisfaction = satisfaction ? satisfaction.value : null;
        } else if (currentPart === 3) {
            const feedback = [];
            document.querySelectorAll('input[name="feedback"]:checked').forEach(checkbox => {
                if (checkbox.value === 'none') {
                    if (fbNoneText.value) feedback.push(`None: ${fbNoneText.value}`);
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
        } else if (currentPart === 6) {
            const feedback = [];
            document.querySelectorAll('input[name="feedback"]:checked').forEach(checkbox => {
                if (checkbox.value === 'none') {
                    if (fbNoneText.value) feedback.push(`None: ${fbNoneText.value}`);
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
        } else if (currentPart === 9) {
            const feedback = [];
            document.querySelectorAll('input[name="feedback"]:checked').forEach(checkbox => {
                if (checkbox.value === 'none') {
                    if (fbNoneText.value) feedback.push(`None: ${fbNoneText.value}`);
                } else {
                    feedback.push(checkbox.value);
                }
            });
            trialAnswers.part9.unchosenFeedback = feedback;
            trialAnswers.part9.fbNoneText = fbNoneText.value;
        }
    }

    function loadState(trialIndex, part) {
        const trialAnswers = userAnswers[trialIndex];
        if (part === 1) {
            answerTextEl.value = trialAnswers.part1.answer || '';
            noSpecificAnswerEl.checked = trialAnswers.part1.noSpecific || false;
            answerTextEl.disabled = noSpecificAnswerEl.checked;
        } else if (part === 2) {
            refUserAnswerEl.textContent = userAnswers[trialIndex].part1.answer || '';
            document.getElementById('candidate-a').innerHTML = createSpacedHTML(trials[trialIndex].candidates.A);
            document.getElementById('candidate-b').innerHTML = createSpacedHTML(trials[trialIndex].candidates.B);
            candidateRadios.forEach(radio => radio.checked = radio.value === trialAnswers.part2.candidateChoice);
            satisfactionRadios.forEach(radio => radio.checked = radio.value === trialAnswers.part2.satisfaction);
        } else if (part === 3) {
            refUserAnswerEl.textContent = userAnswers[trialIndex].part1.answer || '';
            const { candidateChoice } = trialAnswers.part2;
            const unchosenChoice = candidateChoice === 'A' ? 'B' : 'A';
            finalReviewSection.innerHTML = `
                <div class="user-submission-review">
                    <h2 class="label">Your Answer:</h2>
                    <p>${trialAnswers.part1.answer || ''}</p>
                </div>
                <div class="candidate-selection">
                    <h2 class="label">Q: Choose the better answer between:</h2>
                    <div id="candidate-choices-wrapper">
                        <div class="candidate-choice">
                            <label class="candidate-label ${candidateChoice === 'A' ? '' : 'highlight-negative'}">
                                <div class="candidate-title">Answer A</div>
                                <div class="candidate-content">${createSpacedHTML(trials[trialIndex].candidates.A)}</div>
                            </label>
                        </div>
                        <div class="candidate-choice">
                            <label class="candidate-label ${candidateChoice === 'B' ? '' : 'highlight-negative'}">
                                <div class="candidate-title">Answer B</div>
                                <div class="candidate-content">${createSpacedHTML(trials[trialIndex].candidates.B)}</div>
                            </label>
                        </div>
                    </div>
                </div>`;
            unchosenFeedbackTitle.innerHTML = `Q: What did you NOT like about the answer you did not choose? (Answer ${unchosenChoice})<br><span class="subtitle">Choose all that apply:</span>`;
            feedbackCheckboxes.forEach(checkbox => checkbox.checked = false);
            if (trialAnswers.part3.unchosenFeedback) {
                trialAnswers.part3.unchosenFeedback.forEach(fb => {
                    if (fb.startsWith('None:')) {
                        const noneCheckbox = document.querySelector('input[name="feedback"][value="none"]');
                        if(noneCheckbox) noneCheckbox.checked = true;
                        fbNoneText.value = fb.replace('None: ', '');
                        fbNoneText.disabled = false;
                    } else {
                        const checkbox = document.querySelector(`input[name="feedback"][value="${fb}"]`);
                        if(checkbox) checkbox.checked = true;
                    }
                });
            }
            fbNoneText.disabled = !document.querySelector('input[name="feedback"][value="none"]:checked');

        } else if (part === 4) {
            finalAnswerText.value = trialAnswers.part4.finalAnswer || '';
            noSpecificFinalAnswerEl.checked = trialAnswers.part4.noSpecificFinal || false;
            finalAnswerText.disabled = noSpecificFinalAnswerEl.checked;
        } else if (part === 5) {
            refUserAnswerEl.textContent = userAnswers[trialIndex].part4.finalAnswer || '';
            document.getElementById('candidate-a').innerHTML = createSpacedHTML(trials[trialIndex].candidates2.A);
            document.getElementById('candidate-b').innerHTML = createSpacedHTML(trials[trialIndex].candidates2.B);
            candidateRadios.forEach(radio => radio.checked = radio.value === trialAnswers.part5.candidateChoice);
            satisfactionRadios.forEach(radio => radio.checked = radio.value === trialAnswers.part5.satisfaction);
        } else if (part === 6) {
            refUserAnswerEl.textContent = userAnswers[trialIndex].part4.finalAnswer || '';
            const { candidateChoice } = trialAnswers.part5;
            const unchosenChoice = candidateChoice === 'A' ? 'B' : 'A';
            finalReviewSection.innerHTML = `
                <div class="user-submission-review">
                    <h2 class="label">Your Answer:</h2>
                    <p>${trialAnswers.part4.finalAnswer || ''}</p>
                </div>
                <div class="candidate-selection">
                    <h2 class="label">Q: Choose the better answer between:</h2>
                    <div id="candidate-choices-wrapper">
                        <div class="candidate-choice">
                            <label class="candidate-label ${candidateChoice === 'A' ? '' : 'highlight-negative'}">
                                <div class="candidate-title">Answer A</div>
                                <div class="candidate-content">${createSpacedHTML(trials[trialIndex].candidates2.A)}</div>
                            </label>
                        </div>
                        <div class="candidate-choice">
                            <label class="candidate-label ${candidateChoice === 'B' ? '' : 'highlight-negative'}">
                                <div class="candidate-title">Answer B</div>
                                <div class="candidate-content">${createSpacedHTML(trials[trialIndex].candidates2.B)}</div>
                            </label>
                        </div>
                    </div>
                </div>`;
            unchosenFeedbackTitle.innerHTML = `Q: What did you NOT like about the answer you did not choose? (Answer ${unchosenChoice})<br><span class="subtitle">Choose all that apply:</span>`;
            feedbackCheckboxes.forEach(checkbox => checkbox.checked = false);
            if (trialAnswers.part6.unchosenFeedback) {
                trialAnswers.part6.unchosenFeedback.forEach(fb => {
                    if (fb.startsWith('None:')) {
                        const noneCheckbox = document.querySelector('input[name="feedback"][value="none"]');
                        if(noneCheckbox) noneCheckbox.checked = true;
                        fbNoneText.value = fb.replace('None: ', '');
                        fbNoneText.disabled = false;
                    } else {
                        const checkbox = document.querySelector(`input[name="feedback"][value="${fb}"]`);
                        if(checkbox) checkbox.checked = true;
                    }
                });
            }
            fbNoneText.disabled = !document.querySelector('input[name="feedback"][value="none"]:checked');
        } else if (part === 7) {
            part7AnswerTextEl.value = trialAnswers.part7.answer || '';
            noSpecificPart7AnswerEl.checked = trialAnswers.part7.noSpecific || false;
            part7AnswerTextEl.disabled = noSpecificPart7AnswerEl.checked;
        } else if (part === 8) {
            refUserAnswerEl.textContent = userAnswers[trialIndex].part7.answer || '';
            document.getElementById('candidate-a').innerHTML = createSpacedHTML(trials[trialIndex].candidates3.A);
            document.getElementById('candidate-b').innerHTML = createSpacedHTML(trials[trialIndex].candidates3.B);
            candidateRadios.forEach(radio => radio.checked = radio.value === trialAnswers.part8.candidateChoice);
            satisfactionRadios.forEach(radio => radio.checked = radio.value === trialAnswers.part8.satisfaction);
        } else if (part === 9) {
            refUserAnswerEl.textContent = userAnswers[trialIndex].part7.answer || '';
            const { candidateChoice } = trialAnswers.part8;
            const unchosenChoice = candidateChoice === 'A' ? 'B' : 'A';
            finalReviewSection.innerHTML = `
                <div class="user-submission-review">
                    <h2 class="label">Your Answer:</h2>
                    <p>${trialAnswers.part7.answer || ''}</p>
                </div>
                <div class="candidate-selection">
                    <h2 class="label">Q: Choose the better answer between:</h2>
                    <div id="candidate-choices-wrapper">
                        <div class="candidate-choice">
                            <label class="candidate-label ${candidateChoice === 'A' ? '' : 'highlight-negative'}">
                                <div class="candidate-title">Answer A</div>
                                <div class="candidate-content">${createSpacedHTML(trials[trialIndex].candidates3.A)}</div>
                            </label>
                        </div>
                        <div class="candidate-choice">
                            <label class="candidate-label ${candidateChoice === 'B' ? '' : 'highlight-negative'}">
                                <div class="candidate-title">Answer B</div>
                                <div class="candidate-content">${createSpacedHTML(trials[trialIndex].candidates3.B)}</div>
                            </label>
                        </div>
                    </div>
                </div>`;
            unchosenFeedbackTitle.innerHTML = `Q: What did you NOT like about the answer you did not choose? (Answer ${unchosenChoice})<br><span class="subtitle">Choose all that apply:</span>`;
            feedbackCheckboxes.forEach(checkbox => checkbox.checked = false);
            if (trialAnswers.part9.unchosenFeedback) {
                trialAnswers.part9.unchosenFeedback.forEach(fb => {
                    if (fb.startsWith('None:')) {
                        const noneCheckbox = document.querySelector('input[name="feedback"][value="none"]');
                        if(noneCheckbox) noneCheckbox.checked = true;
                        fbNoneText.value = fb.replace('None: ', '');
                        fbNoneText.disabled = false;
                    } else {
                        const checkbox = document.querySelector(`input[name="feedback"][value="${fb}"]`);
                        if(checkbox) checkbox.checked = true;
                    }
                });
            }
            fbNoneText.disabled = !document.querySelector('input[name="feedback"][value="none"]:checked');
        }
    }

    function isPartComplete() {
        const trialAnswers = userAnswers[currentTrialIndex];
        if (currentPart === 1) {
            return (trialAnswers.part1.answer && trialAnswers.part1.answer.trim() !== '') || trialAnswers.part1.noSpecific;
        } else if (currentPart === 2) {
            return trialAnswers.part2.candidateChoice && trialAnswers.part2.satisfaction;
        } else if (currentPart === 3) {
            return trialAnswers.part3.unchosenFeedback && trialAnswers.part3.unchosenFeedback.length > 0;
        } else if (currentPart === 4) {
            return (trialAnswers.part4.finalAnswer && trialAnswers.part4.finalAnswer.trim() !== '') || trialAnswers.part4.noSpecificFinal;
        } else if (currentPart === 5) {
            return trialAnswers.part5.candidateChoice && trialAnswers.part5.satisfaction;
        } else if (currentPart === 6) {
            return trialAnswers.part6.unchosenFeedback && trialAnswers.part6.unchosenFeedback.length > 0;
        } else if (currentPart === 7) {
            return (trialAnswers.part7.answer && trialAnswers.part7.answer.trim() !== '') || trialAnswers.part7.noSpecific;
        } else if (currentPart === 8) {
            return trialAnswers.part8.candidateChoice && trialAnswers.part8.satisfaction;
        } else if (currentPart === 9) {
            return trialAnswers.part9.unchosenFeedback && trialAnswers.part9.unchosenFeedback.length > 0;
        }
        return false;
    }

    function updateButtonStates() {
        const isFirstPage = currentTrialIndex === 0 && currentPart === 1;
        prevButtons.forEach(button => button.disabled = isFirstPage);
        nextButtons.forEach(button => button.disabled = !isPartComplete());
    }

    // --- Navigation ---
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

    // --- Helper Functions ---
    const createSpacedHTML = (text) => text.split('\n').map(line => `<div class="${line.trim().startsWith('•') ? 'bullet-item' : ''}">${line}</div>`).join('');
    const getHighlightedHTML = (text, keyword, isGlobal) => {
        const flags = isGlobal ? 'gi' : 'i';
        const escapedKeyword = keyword.replace(/[-\/\\^$*+?.()|[\\]{}]/g, '\\$&');
        const regex = new RegExp(`(${escapedKeyword}s?)`, flags);
        return text.replace(regex, '<span class="highlight">$1</span>');
    };

    // --- Event Listeners ---
    startExperimentButton.addEventListener('click', () => {
        startContainer.style.display = 'none';
        instructionContainer.style.display = 'block';
    });

    nextInstructionButton.addEventListener('click', () => {
        instructionContainer.style.display = 'none';
        instructionContainer2.style.display = 'block';
        beginExperimentButton.textContent = "Resume Experiment";
    });

    instructionButton.addEventListener('click', showInstructions);

    beginExperimentButton.addEventListener('click', () => {
        instructionContainer2.style.display = 'none';
        showView(currentTrialIndex, currentPart);
    });

    prevButtons.forEach(button => button.addEventListener('click', previousPage));
    nextButtons.forEach(button => button.addEventListener('click', nextPage));

    // --- Input change listeners to update button states ---
    answerTextEl.addEventListener('input', () => { saveCurrentState(); updateButtonStates(); });
    noSpecificAnswerEl.addEventListener('change', () => { answerTextEl.disabled = noSpecificAnswerEl.checked; if (noSpecificAnswerEl.checked) answerTextEl.value = ''; saveCurrentState(); updateButtonStates(); });

    candidateRadios.forEach(radio => radio.addEventListener('change', () => { saveCurrentState(); updateButtonStates(); }));
    satisfactionRadios.forEach(radio => radio.addEventListener('change', () => { saveCurrentState(); updateButtonStates(); }));

    feedbackCheckboxes.forEach(checkbox => checkbox.addEventListener('change', () => { saveCurrentState(); updateButtonStates(); }));
    fbNoneCheckbox.addEventListener('change', () => { fbNoneText.disabled = !fbNoneCheckbox.checked; if (!fbNoneCheckbox.checked) fbNoneText.value = ''; saveCurrentState(); updateButtonStates(); });
    fbNoneText.addEventListener('input', () => { saveCurrentState(); updateButtonStates(); });

    finalAnswerText.addEventListener('input', () => { saveCurrentState(); updateButtonStates(); });
    noSpecificFinalAnswerEl.addEventListener('change', () => { finalAnswerText.disabled = noSpecificFinalAnswerEl.checked; if (noSpecificFinalAnswerEl.checked) finalAnswerText.value = ''; saveCurrentState(); updateButtonStates(); });

    part7AnswerTextEl.addEventListener('input', () => { saveCurrentState(); updateButtonStates(); });
    noSpecificPart7AnswerEl.addEventListener('change', () => { part7AnswerTextEl.disabled = noSpecificPart7AnswerEl.checked; if (noSpecificPart7AnswerEl.checked) part7AnswerTextEl.value = ''; saveCurrentState(); updateButtonStates(); });


    // --- Initial Load ---
    generateTOC();
    // Start from the welcome page
    startContainer.style.display = 'block';
    contextPanel.style.display = 'none';
    mainPanel.style.width = '100%';
    part1Container.style.display = 'none';
    part2Container.style.display = 'none';
    part3Container.style.display = 'none';
    part4Container.style.display = 'none';
    part7Container.style.display = 'none';
    completionContainer.style.display = 'none';
    instructionContainer.style.display = 'none';
    instructionContainer2.style.display = 'none';
});