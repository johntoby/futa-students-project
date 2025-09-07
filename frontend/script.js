const API_BASE_URL = '/api/v1';

// Load students when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadStudents();
});

// Form submission handler
document.getElementById('studentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const studentId = document.getElementById('studentId').value;
    const studentData = {
        matric_number: document.getElementById('matricNumber').value,
        first_name: document.getElementById('firstName').value,
        last_name: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        level: parseInt(document.getElementById('level').value)
    };

    try {
        let response;
        if (studentId) {
            // Update existing student
            response = await fetch(`${API_BASE_URL}/students/${studentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData)
            });
        } else {
            // Create new student
            response = await fetch(`${API_BASE_URL}/students`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData)
            });
        }

        if (response.ok) {
            const result = await response.json();
            alert(result.message);
            resetForm();
            loadStudents();
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
});

// Load all students
async function loadStudents() {
    try {
        const response = await fetch(`${API_BASE_URL}/students`);
        const result = await response.json();
        
        if (response.ok) {
            displayStudents(result.data);
        } else {
            document.getElementById('studentsContainer').innerHTML = 
                '<p class="no-students">Error loading students</p>';
        }
    } catch (error) {
        document.getElementById('studentsContainer').innerHTML = 
            '<p class="no-students">Network error loading students</p>';
    }
}

// Display students in the UI
function displayStudents(students) {
    const container = document.getElementById('studentsContainer');
    
    if (students.length === 0) {
        container.innerHTML = '<p class="no-students">No students found</p>';
        return;
    }

    const studentsHTML = students.map(student => `
        <div class="student-card">
            <div class="student-header">
                <div>
                    <div class="student-name">${student.first_name} ${student.last_name}</div>
                    <div class="student-matric">${student.matric_number}</div>
                </div>
            </div>
            <div class="student-details">
                <div class="student-detail">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${student.email}</span>
                </div>
                <div class="student-detail">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${student.phone || 'N/A'}</span>
                </div>
                <div class="student-detail">
                    <span class="detail-label">Level:</span>
                    <span class="detail-value">${student.level} Level</span>
                </div>
                <div class="student-detail">
                    <span class="detail-label">Department:</span>
                    <span class="detail-value">${student.department}</span>
                </div>
            </div>
            <div class="student-actions">
                <button class="edit-btn" onclick="editStudent(${student.id})">Edit</button>
                <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
            </div>
        </div>
    `).join('');

    container.innerHTML = studentsHTML;
}

// Edit student
async function editStudent(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/students/${id}`);
        const result = await response.json();
        
        if (response.ok) {
            const student = result.data;
            document.getElementById('studentId').value = student.id;
            document.getElementById('matricNumber').value = student.matric_number;
            document.getElementById('firstName').value = student.first_name;
            document.getElementById('lastName').value = student.last_name;
            document.getElementById('email').value = student.email;
            document.getElementById('phone').value = student.phone || '';
            document.getElementById('level').value = student.level;
            document.getElementById('submitBtn').textContent = 'Update Student';
            
            // Scroll to form
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        } else {
            alert('Error loading student data');
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
}

// Delete student
async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/students/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message);
            loadStudents();
        } else {
            const error = await response.json();
            alert('Error: ' + error.error);
        }
    } catch (error) {
        alert('Network error: ' + error.message);
    }
}

// Reset form
function resetForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    document.getElementById('submitBtn').textContent = 'Add Student';
}