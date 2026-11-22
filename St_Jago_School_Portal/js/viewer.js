
/* =========================================
   GENERAL AUTHORIZED VIEWER
   St. Jago High School Student Portal
========================================= */


// Retrieve saved data from localStorage
function getData(key) {

    const data = localStorage.getItem(key);

    return data ? JSON.parse(data) : [];
}


// Load student records
const students = getData("students");

// Load academic records
const grades = getData("grades");

// Load financial records
const financialRecords = getData("financialRecords");


// Format money in Jamaican dollars
const jmd = (amount) => {

    return `JMD ${Number(amount || 0).toLocaleString("en-JM", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

};


// Get student name
function getStudentName(student) {

    return student.name || student.fullName || "Unknown Student";

}


// Get student class
function getStudentClass(student) {

    return student.studentClass || student.className || "Not Assigned";

}


// Get student semester
function getStudentSemester(student) {

    return student.semester || "Not Assigned";

}


// Find financial record
function getFinancialRecord(studentID) {

    return financialRecords.find((record) =>
        record.studentID === studentID
    );

}


// Find academic records
function getAcademicRecords(studentID) {

    return grades.filter((record) =>
        record.studentID === studentID
    );

}


// Update dashboard statistics
function updateViewerDashboard() {

    document.getElementById("viewerTotalStudents").textContent =
        students.length;

    document.getElementById("viewerAcademicRecords").textContent =
        grades.length;

    document.getElementById("viewerFinancialRecords").textContent =
        financialRecords.length;

}


// Display search results
function renderResults(list) {

    const tableBody = document.getElementById("viewerStudentTableBody");

    if (list.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No students found. Check the student ID or name.
                </td>
            </tr>
        `;

        return;

    }


    tableBody.innerHTML = list.map((student) => `

        <tr>

            <td>${student.id}</td>

            <td>${getStudentName(student)}</td>

            <td>${getStudentClass(student)}</td>

            <td>${getStudentSemester(student)}</td>

            <td>
                <button type="button" data-id="${student.id}">
                    View
                </button>
            </td>

        </tr>

    `).join("");

}


// Display selected student's profile
function selectStudent(id) {

    const student = students.find((item) =>
        item.id === id
    );

    if (!student) {
        return;
    }


    // Student profile
    document.getElementById("viewerProfileDetails").innerHTML = `

        <p>
            <strong>Student ID:</strong>
            ${student.id}
        </p>

        <p>
            <strong>Full Name:</strong>
            ${getStudentName(student)}
        </p>

        <p>
            <strong>Class:</strong>
            ${getStudentClass(student)}
        </p>

        <p>
            <strong>Semester:</strong>
            ${getStudentSemester(student)}
        </p>

        <p>
            <strong>Date of Birth:</strong>
            ${student.dob || "Not Provided"}
        </p>

        <p>
            <strong>Gender:</strong>
            ${student.gender || "Not Provided"}
        </p>

        <p>
            <strong>House:</strong>
            ${student.house || "Not Assigned"}
        </p>

        <p>
            <strong>Guardian:</strong>
            ${student.guardian || "Not Provided"}
        </p>

        <p>
            <strong>Contact:</strong>
            ${student.contact || "Not Provided"}
        </p>

    `;


    // Academic records
    const academicRecords = getAcademicRecords(student.id);

    const academicTableBody =
        document.getElementById("viewerAcademicTableBody");


    if (academicRecords.length === 0) {

        academicTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No academic records found for this student.
                </td>
            </tr>
        `;

    } else {

        academicTableBody.innerHTML = academicRecords.map((record) => {

            const percentage = record.percentage !== undefined
                ? record.percentage
                : record.score;

            return `

                <tr>

                    <td>${record.subject || "N/A"}</td>

                    <td>${record.assessment || "N/A"}</td>

                    <td>${record.score ?? "N/A"}</td>

                    <td>${percentage}%</td>

                    <td>${record.grade || "N/A"}</td>

                    <td>${record.semester || "N/A"}</td>

                </tr>

            `;

        }).join("");

    }


    // Academic average
    const percentages = academicRecords.map((record) =>
        Number(record.percentage || 0)
    );

    let average = 0;

    if (percentages.length > 0) {

        average = percentages.reduce((sum, value) =>
            sum + value, 0
        ) / percentages.length;

    }


    document.getElementById("viewerAverage").textContent =
        average.toFixed(2) + "%";


    // Financial records
    const financialRecord = getFinancialRecord(student.id);


    if (!financialRecord) {

        document.getElementById("financialStudentID").textContent =
            student.id;

        document.getElementById("financialStudentName").textContent =
            getStudentName(student);

        document.getElementById("viewerTuitionFee").textContent =
            jmd(0);

        document.getElementById("viewerAmountPaid").textContent =
            jmd(0);

        document.getElementById("viewerBalance").textContent =
            jmd(0);

        document.getElementById("viewerPaymentStatus").textContent =
            "No Financial Record";

        document.getElementById("viewerPaymentTableBody").innerHTML = `
            <tr>
                <td colspan="3">
                    No payment records found.
                </td>
            </tr>
        `;

        return;

    }


    // Calculate payments
    const payments = financialRecord.payments || [];

    const paid = Number(
        financialRecord.amountPaid ||
        payments.reduce((sum, payment) =>
            sum + Number(payment.amount || 0), 0
        )
    );

    const tuition = Number(financialRecord.tuition || 0);

    const balance = Math.max(tuition - paid, 0);


    // Display financial information
    document.getElementById("financialStudentID").textContent =
        student.id;

    document.getElementById("financialStudentName").textContent =
        getStudentName(student);

    document.getElementById("viewerTuitionFee").textContent =
        jmd(tuition);

    document.getElementById("viewerAmountPaid").textContent =
        jmd(paid);

    document.getElementById("viewerBalance").textContent =
        jmd(balance);


    // Payment status
    let status;

    if (balance === 0 && tuition > 0) {

        status = "Paid in Full";

    } else if (paid > 0) {

        status = "Partial Payment";

    } else {

        status = "Outstanding";

    }


    document.getElementById("viewerPaymentStatus").textContent =
        status;


    // Payment history
    const paymentTableBody =
        document.getElementById("viewerPaymentTableBody");


    if (payments.length === 0) {

        paymentTableBody.innerHTML = `
            <tr>
                <td colspan="3">
                    No payment history available.
                </td>
            </tr>
        `;

    } else {

        paymentTableBody.innerHTML = payments.map((payment) => `

            <tr>

                <td>${payment.date || "N/A"}</td>

                <td>${jmd(payment.amount)}</td>

                <td>${payment.method || "N/A"}</td>

            </tr>

        `).join("");

    }

}


// Search students by ID or name
document.getElementById("viewerSearchForm").addEventListener("submit", (event) => {

    event.preventDefault();

    const searchValue = document.getElementById("viewerSearch")
        .value.trim().toLowerCase();


    if (searchValue === "") {

        renderResults(students);

        return;

    }


    const results = students.filter((student) => {

        const studentID = String(student.id || "").toLowerCase();

        const studentName = getStudentName(student).toLowerCase();

        return studentID.includes(searchValue) ||
               studentName.includes(searchValue);

    });


    renderResults(results);

});


// Handle View button clicks
document.getElementById("viewerStudentTableBody").addEventListener("click", (event) => {

    const button = event.target.closest("button");

    if (!button) {
        return;
    }

    const studentID = button.dataset.id;

    if (studentID) {

        selectStudent(studentID);

    }

});


// Load dashboard when page opens
updateViewerDashboard();

renderResults(students);
