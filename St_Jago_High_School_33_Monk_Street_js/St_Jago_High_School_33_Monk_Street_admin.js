/*
    Student Name: Ogechukwu Okorocha
    Student ID: 2102118
    Faculty: BSc in Computer Information System  
    Course: CIT2011
    Project: St. Jago High School Portal
*/
// LOCAL STORAGE KEYS

const STUDENT_KEY = "students";
const SUBJECT_KEY = "subjects";
const GRADE_KEY = "grades";
const FINANCIAL_KEY = "financialRecords";
const TEACHER_KEY = "teachers";


// HTML ELEMENTS


// Dashboard elements
const totalStudents = document.getElementById("totalStudents");
const totalTeachers = document.getElementById("totalTeachers");
const outstandingFees = document.getElementById("outstandingFees");
const totalClasses = document.getElementById("totalClasses");


// Student elements
const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");
const studentSearch = document.getElementById("studentSearch");


// Subject elements
const subjectForm = document.getElementById("subjectForm");
const subjectTableBody = document.getElementById("subjectTableBody");


// Academic elements
const gradeTableBody = document.getElementById("gradeTableBody");


// Financial elements
const paymentForm = document.getElementById("paymentForm");
const financialTableBody = document.getElementById("financialTableBody");


// System messages
// This ID matches the admin.html file.
const adminMessages = document.getElementById("adminMessage");


// Load saved records from local storage
function getRecords(key) {

    return JSON.parse(localStorage.getItem(key)) || [];

}


// Save records to local storage
function saveRecords(key, records) {

    localStorage.setItem(key, JSON.stringify(records));

}


// Display system messages
function showMessage(message) {

    if (adminMessages) {
        adminMessages.textContent = message;
    }

}


// STUDENT MANAGEMENT


// Display student records
function displayStudents(studentList) {

    studentTableBody.innerHTML = "";

    studentList.forEach(function(student) {

        const row = document.createElement("tr");

        // Display student information
        const studentDetails = [
            student.id,
            student.name,
            student.dob,
            student.gender,
            student.studentClass,
            student.semester,
            student.guardian,
            student.contact
        ];

        studentDetails.forEach(function(detail) {

            const cell = document.createElement("td");

            cell.textContent = detail;

            row.appendChild(cell);

        });


        // Student action buttons
        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");

        editButton.type = "button";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function() {

            editStudent(student.id);

        });


        const deleteButton = document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {

            deleteStudent(student.id);

        });


        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        studentTableBody.appendChild(row);

    });

}


// Register a new student
studentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const students = getRecords(STUDENT_KEY);


    const student = {

        id: document.getElementById("studentID").value.trim(),

        name: document.getElementById("studentName").value.trim(),

        dob: document.getElementById("studentDOB").value,

        gender: document.getElementById("studentGender").value,

        studentClass: document.getElementById("studentClass").value,

        semester: document.getElementById("studentSemester").value,

        guardian: document.getElementById("studentGuardian").value.trim(),

        contact: document.getElementById("studentContact").value.trim()

    };


    // Check for duplicate student ID
    const existingStudent = students.find(function(item) {

        return item.id.toLowerCase() === student.id.toLowerCase();

    });


    if (existingStudent) {

        showMessage("Student ID already exists.");

        return;

    }


    // Save new student information
    students.push(student);

    saveRecords(STUDENT_KEY, students);

    displayStudents(students);

    updateDashboard();

    studentForm.reset();

    showMessage("Student registered successfully.");

});


// Edit student information
function editStudent(studentID) {

    const students = getRecords(STUDENT_KEY);

    const student = students.find(function(item) {

        return item.id === studentID;

    });


    if (student) {

        const newName = prompt("Enter student's full name:", student.name);

        if (newName === null) {

            return;

        }


        const newGuardian = prompt("Enter parent/guardian name:", student.guardian);

        if (newGuardian === null) {

            return;

        }


        const newContact = prompt("Enter parent/guardian contact:", student.contact);

        if (newContact === null) {

            return;

        }


        // Check that information is not empty
        if (!newName.trim() || !newGuardian.trim() || !newContact.trim()) {

            showMessage("Please enter valid student information.");

            return;

        }


        student.name = newName.trim();

        student.guardian = newGuardian.trim();

        student.contact = newContact.trim();


        saveRecords(STUDENT_KEY, students);

        displayStudents(students);

        showMessage("Student information updated successfully.");

    }

}


// Delete student record
function deleteStudent(studentID) {

    const students = getRecords(STUDENT_KEY);

    if (confirm("Are you sure you want to delete this student?")) {

        const updatedStudents = students.filter(function(student) {

            return student.id !== studentID;

        });


        saveRecords(STUDENT_KEY, updatedStudents);

        displayStudents(updatedStudents);

        updateDashboard();

        showMessage("Student record deleted successfully.");

    }

}


// Search students by ID or name
studentSearch.addEventListener("input", function() {

    const searchValue = studentSearch.value.toLowerCase();

    const students = getRecords(STUDENT_KEY);


    const filteredStudents = students.filter(function(student) {

        return student.id.toLowerCase().includes(searchValue) ||

               student.name.toLowerCase().includes(searchValue);

    });


    displayStudents(filteredStudents);

});


// SUBJECT MANAGEMENT


// Display registered subjects
function displaySubjects() {

    const subjects = getRecords(SUBJECT_KEY);

    subjectTableBody.innerHTML = "";


    subjects.forEach(function(subject, index) {

        const row = document.createElement("tr");


        const subjectDetails = [

            subject.code,

            subject.name,

            subject.subjectClass

        ];


        subjectDetails.forEach(function(detail) {

            const cell = document.createElement("td");

            cell.textContent = detail;

            row.appendChild(cell);

        });


        // Delete subject button
        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {

            deleteSubject(index);

        });


        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        subjectTableBody.appendChild(row);

    });

}


// Register a new subject
subjectForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const subjects = getRecords(SUBJECT_KEY);


    const subject = {

        code: document.getElementById("subjectCode").value.trim(),

        name: document.getElementById("subjectName").value.trim(),

        subjectClass: document.getElementById("subjectClass").value

    };


    // Check for duplicate subject code
    const existingSubject = subjects.find(function(item) {

        return item.code.toLowerCase() === subject.code.toLowerCase();

    });


    if (existingSubject) {

        showMessage("Subject code already exists.");

        return;

    }


    subjects.push(subject);

    saveRecords(SUBJECT_KEY, subjects);

    displaySubjects();

    updateDashboard();

    subjectForm.reset();

    showMessage("Subject added successfully.");

});


// Delete a subject
function deleteSubject(index) {

    const subjects = getRecords(SUBJECT_KEY);

    if (confirm("Are you sure you want to delete this subject?")) {

        subjects.splice(index, 1);

        saveRecords(SUBJECT_KEY, subjects);

        displaySubjects();

        updateDashboard();

        showMessage("Subject deleted successfully.");

    }

}


// ACADEMIC MANAGEMENT


// Display student academic grade records
// The Teacher dashboard saves grades using the same "grades" key.
function displayGrades() {

    const grades = getRecords(GRADE_KEY);

    gradeTableBody.innerHTML = "";


    grades.forEach(function(grade) {

        const row = document.createElement("tr");


        const gradeDetails = [

            grade.studentID,

            grade.studentName,

            grade.subject,

            grade.assessment,

            grade.score,

            grade.grade,

            grade.semester

        ];


        gradeDetails.forEach(function(detail) {

            const cell = document.createElement("td");

            cell.textContent = detail;

            row.appendChild(cell);

        });


        gradeTableBody.appendChild(row);

    });

}


// FINANCIAL MANAGEMENT


// Display student financial records
function displayFinancialRecords() {

    const records = getRecords(FINANCIAL_KEY);

    financialTableBody.innerHTML = "";


    records.forEach(function(record, index) {

        // Calculate outstanding balance
        const tuition = Number(record.tuition) || 0;

        const amountPaid = Number(record.amountPaid) || 0;

        const balance = tuition - amountPaid;

        let status;


        // Check whether payment was made
        if (balance <= 0) {

            status = "Paid";

        } else if (amountPaid > 0) {

            status = "Pending";

        } else {

            status = "Outstanding";

        }


        const row = document.createElement("tr");


        const financialDetails = [

            record.studentID,

            record.studentName,

            tuition.toFixed(2),

            amountPaid.toFixed(2),

            Math.max(0, balance).toFixed(2),

            status

        ];


        financialDetails.forEach(function(detail) {

            const cell = document.createElement("td");

            cell.textContent = detail;

            row.appendChild(cell);

        });


        // Delete financial record
        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");

        deleteButton.type = "button";

        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function() {

            deleteFinancialRecord(index);

        });


        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        financialTableBody.appendChild(row);

    });

}


// Record student payment
paymentForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const records = getRecords(FINANCIAL_KEY);

    const students = getRecords(STUDENT_KEY);


    const studentID = document.getElementById("paymentStudentID").value.trim();

    const tuition = Number(document.getElementById("tuitionAmount").value);

    const payment = Number(document.getElementById("paymentAmount").value);

    const paymentDate = document.getElementById("paymentDate").value;

    const paymentMethod = document.getElementById("paymentMethod").value;


    // Check if student is registered
    const student = students.find(function(item) {

        return item.id.toLowerCase() === studentID.toLowerCase();

    });


    if (!student) {

        showMessage("Student ID was not found.");

        return;

    }


    // Check payment amounts
    if (!Number.isFinite(tuition) || !Number.isFinite(payment) ||
        tuition <= 0 || payment <= 0) {

        showMessage("Please enter valid payment amounts.");

        return;

    }


    // Find existing financial record
    const existingRecord = records.find(function(record) {

        return record.studentID.toLowerCase() === studentID.toLowerCase();

    });


    if (existingRecord) {

        // Calculate remaining balance
        const balance = Number(existingRecord.tuition) -
                        Number(existingRecord.amountPaid);


        if (Number(existingRecord.tuition) !== tuition) {

            showMessage("Tuition fee does not match the existing record.");

            return;

        }


        // Check available balance
        if (balance <= 0 || payment > balance) {

            showMessage("Payment cannot exceed the outstanding balance.");

            return;

        }


        // Ensure payment history exists
        if (!Array.isArray(existingRecord.payments)) {

            existingRecord.payments = [];

        }


        // Add payment to existing record
        existingRecord.amountPaid = Number(existingRecord.amountPaid) + payment;

        existingRecord.payments.push({

            amount: payment,

            date: paymentDate,

            method: paymentMethod

        });

    } else {

        // Check payment amount
        if (payment > tuition) {

            showMessage("Payment cannot exceed tuition fee.");

            return;

        }


        // Create new financial record
        records.push({

            studentID: student.id,

            studentName: student.name,

            tuition: tuition,

            amountPaid: payment,

            payments: [{

                amount: payment,

                date: paymentDate,

                method: paymentMethod

            }]

        });

    }


    saveRecords(FINANCIAL_KEY, records);

    displayFinancialRecords();

    updateDashboard();

    paymentForm.reset();

    showMessage("Student payment recorded successfully.");

});


// Delete financial record
function deleteFinancialRecord(index) {

    const records = getRecords(FINANCIAL_KEY);

    if (confirm("Are you sure you want to delete this financial record?")) {

        records.splice(index, 1);

        saveRecords(FINANCIAL_KEY, records);

        displayFinancialRecords();

        updateDashboard();

        showMessage("Financial record deleted successfully.");

    }

}


// UPDATE DASHBOARD INFORMATION
function updateDashboard() {

    const students = getRecords(STUDENT_KEY);

    const subjects = getRecords(SUBJECT_KEY);

    const teachers = getRecords(TEACHER_KEY);

    const records = getRecords(FINANCIAL_KEY);


    // Display total students
    totalStudents.textContent = students.length;


    // Display total teachers
    totalTeachers.textContent = teachers.length;


    // Calculate outstanding fees
    let totalOutstanding = 0;

    records.forEach(function(record) {

        const balance = Number(record.tuition) -
                        Number(record.amountPaid);

        if (balance > 0) {

            totalOutstanding += balance;

        }

    });


    outstandingFees.textContent = totalOutstanding.toFixed(2);


    // Count registered classes
    const classes = [];


    students.forEach(function(student) {

        if (!classes.includes(student.studentClass)) {

            classes.push(student.studentClass);

        }

    });


    subjects.forEach(function(subject) {

        if (!classes.includes(subject.subjectClass)) {

            classes.push(subject.subjectClass);

        }

    });


    totalClasses.textContent = classes.length;

}


// DISPLAY SAVED RECORDS WHEN THE PAGE LOADS
function loadAdminDashboard() {

    displayStudents(getRecords(STUDENT_KEY));

    displaySubjects();

    displayGrades();

    displayFinancialRecords();

    updateDashboard();

}


// RUN DASHBOARD
loadAdminDashboard();


