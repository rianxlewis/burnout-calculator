//input variable declarations

document.addEventListener("DOMContentLoaded", function() {
    const HRS_WORKED = document.getElementById("hrs-worked");
    const STUDY_HOURS = document.getElementById("study-hours");
    const SLEEP_HOURS = document.getElementById("sleep-hours");
    const MEALS = document.getElementById("meals");
    const STRESS_LEVEL = document.getElementById("stress-level");
    const CALCULATE_BTN = document.getElementById("calculate-btn");
    const RESET_BTN = document.getElementById("reset-btn");
    const FORM = document.getElementById("burnout-form");

    //wellness tips map and score formula

    const WELLNESS_TIPS = new Map([
        ["low", ["Prioritize Sleep: Aim for 7-9 hours consistently.",
                 "Stay Active: Engage in regular physical activity (like walks, sports, or yoga).",
                 "Balanced Nutrition: Eat meals at regular times; include fruits/veggies.",
                 "Schedule Downtime: Plan breaks, and allow time for hobbies and fun.",
                 "Practice Mindfulness: Try meditation, deep breathing, or gratitude journaling.",
                ]],
        ["medium", ["Set Boundaries: Learn to say “no” to extra commitments.",
                    "Assess Workload: Reevaluate your schedule; consider dropping non-essential tasks.",
                    "Increase Support: Reach out to friends, mentors, or campus resources.",
                    "Focused Self-Care: Schedule daily self-care rituals, even if brief.",
                    "Practice Mindful Breaks: Take 5-10 minute breaks for relaxation between tasks.",
                   ]],
        ["high", ["Seek Professional Help: Contact on-campus counseling or a healthcare professional.",
                  "Notify Academic Staff: Let professors or advisors know your situation; ask for accommodations.",
                  "Rest & Recover: Prioritize physical recovery—sleep more, reduce workloads, take sick days if needed.",
                  "Simplify: Eliminate all non-essential commitments; focus only on must-do’s.",
                  "Lean on Support Networks: Talk frequently to friends, family, support groups, or campus services.",
                 ]]
    ]);

    //function to calculate score
    function calculateScore() {
        // get values
        const hrsWorked = Number(HRS_WORKED.value);
        const studyHours = Number(STUDY_HOURS.value);
        const sleepHours = Number(SLEEP_HOURS.value);
        const meals = Number(MEALS.value);
        const stressLevel = Number(STRESS_LEVEL.value);

        // normalize inputs (0 = best, 1 = worst)
        // assume: 
        // - 0 hrs worked/study = best, 80+ = worst (cap at 80)
        // - 8+ sleep = best, 0 = worst (cap at 8)
        // - 3+ meals = best, 0 = worst (cap at 3)
        // - stressLevel: 1 = best, 5 = worst

        const normHrsWorked = Math.min(hrsWorked, 60) / 60; // 0-1
        const normStudyHours = Math.min(studyHours, 40) / 40; // 0-1
        const normSleep = 1 - Math.min(sleepHours, 8) / 8; // 0-1 (less sleep = worse)
        const normMeals = 1 - Math.min(meals, 3) / 3; // 0-1 (less meals = worse)
        const normStress = (stressLevel - 1) / 4; // 0-1

        // Weights
        const wStress = 0.4;
        const wHrsWorked = 0.2;
        const wStudy = 0.2;
        const wSleep = 0.1;
        const wMeals = 0.1;

        // Weighted sum
        let burnoutScore = (
            normStress * wStress +
            normHrsWorked * wHrsWorked +
            normStudyHours * wStudy +
            normSleep * wSleep +
            normMeals * wMeals
        ) * 100;

        // Clamp to 0-100
        burnoutScore = Math.round(Math.max(0, Math.min(100, burnoutScore)));

        return burnoutScore;
    }

    function getBurnoutRisk(score) {
        let risk;
        if (score < 40) {
            risk = "low";
        }
        else if (score < 70) {
            risk = "medium";
        }
        else {
            risk = "high";
        }

        return risk;
    }

    //display results on the screen
    function displayResults() {
        const score = calculateScore();
        const risk = getBurnoutRisk(score);
        const tips = WELLNESS_TIPS.get(risk);

        document.getElementById("results-section").innerHTML = `
            <h2>Your Score: ${score}</h2>
            <h2>Burnout Risk: <span class=${risk}>${risk.charAt(0).toUpperCase()}${risk.slice(1)}</span></h2>
            <h2>Wellness Tips:</h2>
            <ul>
            ${tips.map(tip => `<li>${tip}</li>`).join('')}
            </ul>
        `;
    }

    //listen for reset event on the form to clear results section
    FORM.addEventListener("reset", function() {
        document.getElementById("results-section").innerText = "";
    });

    FORM.addEventListener("submit", function(event) {
        event.preventDefault();
        displayResults();
    });
});
