const API_BASE_URL = `${window.location.protocol}//${window.location.host}/api/v1`;

// Load students when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('API Base URL:', API_BASE_URL);
    loadStudents();
    checkDatabaseStatus();
    // Check database status every 30 seconds
    setInterval(checkDatabaseStatus, 30000);
    
    // Add event listeners
    document.getElementById('cancelBtn').addEventListener('click', resetForm);
    document.getElementById('refreshBtn').addEventListener('click', loadStudents);
    
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
                console.error('API Error:', error);
                alert('Error: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Network Error:', error);
            alert('Network error: ' + error.message);
        }
    });
});



// Load all students
async function loadStudents() {
    try {
        console.log('Loading students from:', `${API_BASE_URL}/students`);
        const response = await fetch(`${API_BASE_URL}/students`);
        const result = await response.json();
        
        if (response.ok) {
            console.log('Students loaded:', result);
            displayStudents(result.data);
        } else {
            console.error('Failed to load students:', result);
            document.getElementById('studentsContainer').innerHTML = 
                '<p class="no-students">Error loading students</p>';
        }
    } catch (error) {
        console.error('Network error loading students:', error);
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

    const tableHTML = `
        <table class="students-table">
            <thead>
                <tr>
                    <th>Matric Number</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Level</th>
                    <th>Department</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${students.map(student => `
                    <tr>
                        <td>${student.matric_number}</td>
                        <td class="student-name">${student.first_name} ${student.last_name}</td>
                        <td>${student.email}</td>
                        <td>${student.phone || 'N/A'}</td>
                        <td>${student.level} Level</td>
                        <td>${student.department}</td>
                        <td>
                            <div class="student-actions">
                                <button class="edit-btn" data-id="${student.id}" data-action="edit">Edit</button>
                                <button class="delete-btn" data-id="${student.id}" data-action="delete">Delete</button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = tableHTML;
    
    // Add event listeners for action buttons
    container.addEventListener('click', function(e) {
        const id = e.target.dataset.id;
        const action = e.target.dataset.action;
        
        if (action === 'edit') {
            editStudent(id);
        } else if (action === 'delete') {
            deleteStudent(id);
        }
    });
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

// Check database status
async function checkDatabaseStatus() {
    const statusIndicator = document.getElementById('statusIndicator');
    
    try {
        console.log('Checking health at:', `${API_BASE_URL}/healthcheck`);
        const response = await fetch(`${API_BASE_URL}/healthcheck`);
        
        if (response.ok) {
            const result = await response.json();
            console.log('Health check result:', result);
            statusIndicator.textContent = 'Online';
            statusIndicator.className = 'status-indicator status-online';
        } else {
            console.error('Health check failed:', response.status);
            statusIndicator.textContent = 'Error';
            statusIndicator.className = 'status-indicator status-offline';
        }
    } catch (error) {
        console.error('Health check error:', error);
        statusIndicator.textContent = 'Offline';
        statusIndicator.className = 'status-indicator status-offline';
    }
}