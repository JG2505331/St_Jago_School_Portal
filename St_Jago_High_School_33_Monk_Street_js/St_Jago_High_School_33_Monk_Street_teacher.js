/*
    Student Name: Jevauntae Grant 
    Student ID: 2505331
    Faculty: BSc in Computing 
    Course: CIT2011
    Project: St. Jago High School Portal
*/
// ==========================================
// TEACHER DASHBOARD
// ==========================================

// Get data from localStorage
function getData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        return [];
    }
}

// Save data to localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ==========================================
// SHARED DATA STRUCTURE
// ==========================================

// Get student class
function getStudentClass(student) {
    return String(student.studentClass || student.className || "");
}

// Get student name
function getStudentName(student) {
    return student.name || student.fullName || "";
}

// Get subject name
function getSubjectName(subject) {
    return typeof subject === "string"
        ? subject
        : subject.name || subject.subjectName || "";
}

// Get subject class
function getSubjectClass(subject) {
    return typeof subject === "string"
        ? ""
        : String(subject.subjectClass || subject.className || "");
}

// Display class names
function formatClassName(className) {

    const classNames = {
        "7": "Grade 7",
        "8": "Grade 8",
        "9": "Grade 9",
        "10": "Grade 10",
        "11": "Grade 11",
        "12": "Sixth Form Year 1",
        "13": "Sixth Form Year 2"
    };

    return classNames[className] || className;
}

// Load shared school records
let students = getData("students");
let subjects = getData("subjects");
let grades = getData("grades");

// ==========================================
// GRADE CALCULATION
// ==========================================

function calculateGrade(percentage) {

    if (percentage >= 80) {
        return "A";
    } else if (percentage >= 70) {
        return "B";
    } else if (percentage >= 60) {
        return "C";
    } else if (percentage >= 50) {
        return "D";
    } else {
        return "F";
    }
}

// Calculate percentage
function calculatePercentage(score, maximumScore) {

    if (maximumScore <= 0) {
        return 0;
    }

    return Number(((score / maximumScore) * 100).toFixed(2));
}

// Display messages
function showMessage(elementID, message) {

    const element = document.getElementById(elementID);

    if (element) {
        element.textContent = message;
    }
}

// ==========================================
// DASHBOARD STATISTICS
// ==========================================

function updateDashboard() {

    const assignedClasses = new Set(
        students.map(student => getStudentClass(student)).filter(Boolean)
    );

    const assignedSubjects = new Set(
        subjects.map(subject => getSubjectName(subject)).filter(Boolean)
    );

    const classCount = document.getElementById("assignedClasses");
    const subjectCount = document.getElementById("assignedSubjects");
    const studentCount = document.getElementById("teacherStudentCount");
    const assessmentCount = document.getElementById("assessmentsEntered");

    if (classCount) {
        classCount.textContent = assignedClasses.size;
    }

    if (subjectCount) {
        subjectCount.textContent = assignedSubjects.size;
    }

    if (studentCount) {
        studentCount.textContent = students.length;
    }

    if (assessmentCount) {
        assessmentCount.textContent = grades.length;
    }
}

// ==========================================
// FILTER OPTIONS
// ==========================================

// Populate class dropdowns
function populateClassDropdown(selectID) {

    const select = document.getElementById(selectID);

    if (!select) return;

    const classes = [...new Set(
        students.map(student => getStudentClass(student)).filter(Boolean)
    )];

    select.innerHTML = '<option value="">Select Class</option>';

    classes.forEach(className => {

        select.innerHTML += `
            <option value="${className}">
                ${formatClassName(className)}
            </option>
        `;
    });
}

// Populate subject dropdown based on selected class
function populateSubjectDropdown(selectID, className) {

    const select = document.getElementById(selectID);

    if (!select) return;

    select.innerHTML = '<option value="">Select Subject</option>';

    const availableSubjects = subjects.filter(subject => {

        const subjectClass = getSubjectClass(subject);

        return !className || !subjectClass || subjectClass === className;
    });

    availableSubjects.forEach(subject => {

        const subjectName = getSubjectName(subject);

        if (subjectName) {
            select.innerHTML += `
                <option value="${subjectName}">
                    ${subjectName}
                </option>
            `;
        }
    });
}

// Populate semester dropdowns
function populateSemesterDropdown(selectID) {

    const select = document.getElementById(selectID);

    if (!select) return;

    const semesters = [...new Set(
        students.map(student => student.semester).filter(Boolean)
    )];

    select.innerHTML = '<option value="">Select Semester</option>';

    semesters.forEach(semester => {

        select.innerHTML += `
            <option value="${semester}">
                ${semester}
            </option>
        `;
    });
}

// Load all filter options
function loadFilterOptions() {

    populateClassDropdown("teacherClass");
    populateClassDropdown("assessmentClass");

    populateSemesterDropdown("teacherSemester");
    populateSemesterDropdown("assessmentSemester");

    populateSubjectDropdown("teacherSubject", "");
    populateSubjectDropdown("assessmentSubject", "");
}

// ==========================================
// CLASS MANAGEMENT
// ==========================================

function loadClassStudents() {

    const className = document.getElementById("teacherClass").value;
    const subject = document.getElementById("teacherSubject").value;
    const semester = document.getElementById("teacherSemester").value;

    const tableBody = document.getElementById("teacherStudentTableBody");

    if (!className) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="4">Please select a class.</td>
            </tr>
        `;

        return;
    }

    const filteredStudents = students.filter(student => {

        const matchesClass = getStudentClass(student) === className;

        const matchesSemester =
            !semester || student.semester === semester;

        return matchesClass && matchesSemester;
    });

    if (filteredStudents.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="4">No students found.</td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = filteredStudents.map(student => {

        return `
            <tr>
                <td>${student.id}</td>
                <td>${getStudentName(student)}</td>
                <td>${formatClassName(getStudentClass(student))}</td>
                <td>${subject || "All Subjects"}</td>
            </tr>
        `;

    }).join("");
}

// Load class button
document.getElementById("loadClassButton").addEventListener("click", function() {

    loadClassStudents();

});

// Update subject options when class changes
document.getElementById("teacherClass").addEventListener("change", function() {

    populateSubjectDropdown("teacherSubject", this.value);

    document.getElementById("teacherStudentTableBody").innerHTML = "";

});

// ==========================================
// ASSESSMENT GRADE ENTRY
// ==========================================

// Update percentage and grade while entering scores
function updateScorePreview(input) {

    const maximumScore = Number(
        document.getElementById("maximumScore").value
    );

    const row = input.closest("tr");

    if (!row) return;

    const percentageCell = row.children[3];
    const gradeCell = row.children[4];

    if (!input.value || maximumScore <= 0) {

        percentageCell.textContent = "-";
        gradeCell.textContent = "-";

        return;
    }

    const score = Number(input.value);

    if (score < 0 || score > maximumScore) {

        percentageCell.textContent = "Invalid score";
        gradeCell.textContent = "-";

        return;
    }

    const percentage = calculatePercentage(score, maximumScore);

    const grade = calculateGrade(percentage);

    percentageCell.textContent = percentage + "%";
    gradeCell.textContent = grade;
}

// Update all percentages when maximum score changes
function updateAllScorePreviews() {

    const scoreInputs = document.querySelectorAll(".student-score");

    scoreInputs.forEach(input => {
        updateScorePreview(input);
    });
}

// Load students for assessment
function loadAssessmentStudents() {

    const className = document.getElementById("assessmentClass").value;
    const semester = document.getElementById("assessmentSemester").value;
    const subject = document.getElementById("assessmentSubject").value;

    const tableBody = document.getElementById("assessmentTableBody");

    if (!className || !subject || !semester) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    Select a class, subject and semester.
                </td>
            </tr>
        `;

        return;
    }

    const classStudents = students.filter(student =>

        getStudentClass(student) === className &&
        student.semester === semester

    );

    if (classStudents.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">No students found in this class.</td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML = classStudents.map(student => `

        <tr>
            <td>${student.id}</td>

            <td>${getStudentName(student)}</td>

            <td>
                <input
                    type="number"
                    class="student-score"
                    data-student-id="${student.id}"
                    min="0"
                    placeholder="Enter score"
                    required
                >
            </td>

            <td>-</td>

            <td>-</td>
        </tr>

    `).join("");

    // Calculate percentages as scores are entered
    document.querySelectorAll(".student-score").forEach(input => {

        input.addEventListener("input", function() {
            updateScorePreview(this);
        });

    });

    // Apply current maximum score to the new rows
    updateAllScorePreviews();
}

// Update subjects when assessment class changes
document.getElementById("assessmentClass").addEventListener("change", function() {

    populateSubjectDropdown("assessmentSubject", this.value);

    loadAssessmentStudents();

});

// Reload students when subject or semester changes
document.getElementById("assessmentSubject").addEventListener("change", function() {

    loadAssessmentStudents();

});

document.getElementById("assessmentSemester").addEventListener("change", function() {

    loadAssessmentStudents();

});

// Update percentages when maximum score changes
document.getElementById("maximumScore").addEventListener("input", function() {

    updateAllScorePreviews();

});

// ==========================================
// SAVE ASSESSMENT GRADES
// ==========================================

document.getElementById("saveGradesButton").addEventListener("click", function() {

    const className = document.getElementById("assessmentClass").value;
    const subject = document.getElementById("assessmentSubject").value;
    const semester = document.getElementById("assessmentSemester").value;
    const assessmentType = document.getElementById("assessmentType").value;
    const assessmentDate = document.getElementById("assessmentDate").value;

    const maximumScore = Number(
        document.getElementById("maximumScore").value
    );

    const scoreInputs = document.querySelectorAll(".student-score");

    // Validate assessment information
    if (!className || !subject || !semester || !assessmentType || !assessmentDate) {

        showMessage("gradeMessage", "Please complete all assessment details.");

        return;
    }

    if (!Number.isFinite(maximumScore) || maximumScore <= 0) {

        showMessage("gradeMessage", "Enter a valid maximum score.");

        return;
    }

    if (scoreInputs.length === 0) {

        showMessage("gradeMessage", "Load the students before saving grades.");

        return;
    }

    const newGrades = [];

    // Validate every score before saving
    for (const input of scoreInputs) {

        if (input.value.trim() === "") {

            showMessage("gradeMessage", "Enter a score for every student.");

            return;
        }

        const score = Number(input.value);

        if (!Number.isFinite(score) || score < 0 || score > maximumScore) {

            showMessage(
                "gradeMessage",
                "Scores must be between 0 and the maximum score."
            );

            return;
        }

        const student = students.find(s =>
            String(s.id) === input.dataset.studentId
        );

        if (!student) continue;

        const percentage = calculatePercentage(score, maximumScore);

        newGrades.push({

            studentID: student.id,

            studentName: getStudentName(student),

            className: className,

            subject: subject,

            assessment: assessmentType,

            score: score,

            maximumScore: maximumScore,

            percentage: percentage,

            grade: calculateGrade(percentage),

            semester: semester,

            date: assessmentDate

        });
    }

    if (newGrades.length === 0) {

        showMessage("gradeMessage", "No grades were saved.");

        return;
    }

    // Replace previous records for the same assessment
    const filteredGrades = grades.filter(grade => {

        return !(
            grade.className === className &&
            grade.subject === subject &&
            grade.assessment === assessmentType &&
            grade.semester === semester &&
            grade.date === assessmentDate
        );

    });

    grades = [...filteredGrades, ...newGrades];

    saveData("grades", grades);

    showMessage(
        "gradeMessage",
        "Assessment grades saved successfully."
    );

    updateDashboard();

    loadClassStudents();

});

// ==========================================
// REPORT CARD GENERATOR
// ==========================================

function generateReportCard() {

    const studentID = document.getElementById("reportStudentID").value.trim();

    const semester = document.getElementById("reportSemester").value;

    const reportDisplay = document.getElementById("reportCardDisplay");

    if (!studentID || !semester) {

        showMessage(
            "teacherMessage",
            "Enter a student ID and select a semester."
        );

        return;
    }

    const student = students.find(s =>
        String(s.id).toLowerCase() === studentID.toLowerCase()
    );

    if (!student) {

        showMessage("teacherMessage", "Student not found.");

        reportDisplay.style.display = "none";

        return;
    }

    const studentGrades = grades.filter(grade =>
        String(grade.studentID) === String(student.id) &&
        grade.semester === semester
    );

    if (studentGrades.length === 0) {

        showMessage(
            "teacherMessage",
            "No academic records found for this student."
        );

        reportDisplay.style.display = "none";

        return;
    }

    // Display student details
    document.getElementById("reportStudentDetails").innerHTML = `

        <p><strong>Student ID:</strong> ${student.id}</p>

        <p><strong>Student Name:</strong> ${getStudentName(student)}</p>

        <p><strong>Class:</strong> ${formatClassName(getStudentClass(student))}</p>

        <p><strong>Semester:</strong> ${semester}</p>

        <p><strong>Report Date:</strong> ${new Date().toLocaleDateString()}</p>

    `;

    // Display academic records
    document.getElementById("reportCardTableBody").innerHTML =
        studentGrades.map(grade => `

            <tr>
                <td>${grade.subject}</td>

                <td>${grade.assessment}</td>

                <td>${grade.score}/${grade.maximumScore}</td>

                <td>${Number(grade.percentage).toFixed(2)}%</td>

                <td>${grade.grade}</td>
            </tr>

        `).join("");

    // Calculate overall average
    const totalPercentage = studentGrades.reduce(
        (sum, grade) => sum + Number(grade.percentage),
        0
    );

    const average = totalPercentage / studentGrades.length;

    const overallGradeValue = calculateGrade(average);

    document.getElementById("overallAverage").textContent =
        average.toFixed(2) + "%";

    document.getElementById("overallGrade").textContent =
        overallGradeValue;

    // Determine academic performance
    let performance;

    if (average >= 80) {
        performance = "Excellent";
    } else if (average >= 70) {
        performance = "Good";
    } else if (average >= 60) {
        performance = "Satisfactory";
    } else if (average >= 50) {
        performance = "Needs Improvement";
    } else {
        performance = "Poor";
    }

    document.getElementById("academicPerformance").textContent =
        performance;

    reportDisplay.style.display = "block";

    showMessage(
        "teacherMessage",
        "Report card generated successfully."
    );
}

// Connect Generate Report Card button to report card function
document.getElementById("reportCardForm").addEventListener("submit", function(event) {

    event.preventDefault();

    generateReportCard();

});

// Clear message when student ID changes
document.getElementById("reportStudentID").addEventListener("input", function() {

    showMessage("teacherMessage", "");

});

// ==========================================
// PRINT REPORT CARD
// ==========================================

document.getElementById("printReportButton").addEventListener("click", function() {

    const reportDisplay = document.getElementById("reportCardDisplay");

    if (!reportDisplay || reportDisplay.style.display === "none") {

        showMessage(
            "teacherMessage",
            "Generate a report card before printing."
        );

        return;
    }

    window.print();

});

// ==========================================
// INITIALIZE TEACHER DASHBOARD
// ==========================================

document.getElementById("reportCardDisplay").style.display = "none";

loadFilterOptions();

updateDashboard();


