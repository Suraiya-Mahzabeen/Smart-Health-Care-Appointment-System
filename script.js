// Global state for logged-in user
let currentUser = null; // { email: '...', role: '...', name: '...' }

// Simulated user data (for demonstration purposes)
const users = {
    'doctor@health.com': { password: 'password', role: 'doctor', name: 'Dr. Smith' },
    'patient@health.com': { password: 'password', role: 'patient', name: 'John Doe' }
};

// Simulated patient-specific data
const patientData = {
    'patient@health.com': {
        name: 'John Doe',
        phone: '123-456-7890',
        address: '123 Health St, Wellness City',
        bookings: [
            { id: 1, doctor: 'Dr. Smith', date: '2025-08-15', time: '10:00 AM', status: 'Confirmed' },
            { id: 2, doctor: 'Dr. Jane Doe', date: '2025-07-20', time: '03:00 PM', status: 'Completed' }
        ],
        medicalRecords: [ // Added mock medical records
            { id: 1, type: 'Consultation Report', date: '2024-05-10', description: 'Annual checkup, all clear.' },
            { id: 2, type: 'Prescription', date: '2024-03-22', description: 'Antibiotics for flu.' },
            { id: 3, type: 'Lab Results', date: '2023-11-15', description: 'Blood test results, normal.' }
        ]
    }
};

// Set current year in footer (only if on a page with #currentYear element)
if (document.getElementById('currentYear')) {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}


// Function to show a custom message box (replaces alert)
function showMessageBox(message, type = 'info') {
    const messageBoxBody = document.getElementById('messageBoxBody');
    if (messageBoxBody) { // Check if the modal body exists on the current page
        messageBoxBody.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        const messageBoxModal = new bootstrap.Modal(document.getElementById('messageBoxModal'));
        messageBoxModal.show();
    } else {
        // Fallback for pages without the modal (e.g., login.html if it's standalone)
        alert(message);
    }
}

// --- UI Update Functions ---

// Function to update the navigation bar based on login status and role
function updateNavbar() {
    const mainNavLinks = document.getElementById('mainNavLinks');
    const loggedInNavLinks = document.getElementById('loggedInNavLinks');
    const dashboardLink = document.getElementById('dashboardLink');
    const homeLink = document.getElementById('homeLink');

    if (mainNavLinks && loggedInNavLinks && dashboardLink && homeLink) { // Ensure elements exist (for index.html)
        if (currentUser) {
            // User is logged in
            mainNavLinks.classList.add('d-none');
            loggedInNavLinks.classList.remove('d-none');
            dashboardLink.textContent = `${currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} Dashboard`;
            dashboardLink.onclick = () => showDashboard(currentUser.role);
            homeLink.onclick = () => showDashboard(currentUser.role); // Home link goes to dashboard when logged in

            // Update profile info in sidebar
            if (currentUser.role === 'doctor' && document.getElementById('doctorDashboard')) {
                document.getElementById('doctorNameDisplay').textContent = currentUser.name;
                document.getElementById('doctorEmailDisplay').textContent = currentUser.email;
                document.getElementById('welcomeDoctorName').textContent = currentUser.name;
                document.getElementById('currentDateDisplay').textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            } else if (currentUser.role === 'patient' && document.getElementById('patientDashboard')) {
                document.getElementById('patientNameDisplay').textContent = currentUser.name;
                document.getElementById('patientEmailDisplay').textContent = currentUser.email;
                document.getElementById('welcomePatientName').textContent = currentUser.name;
                document.getElementById('patientCurrentDateDisplay').textContent = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                // Populate patient profile form on login
                if (document.getElementById('patientProfileName')) {
                    document.getElementById('patientProfileName').value = patientData[currentUser.email].name;
                    document.getElementById('patientProfileEmail').value = currentUser.email;
                    document.getElementById('patientProfilePhone').value = patientData[currentUser.email].phone || '';
                    document.getElementById('patientProfileAddress').value = patientData[currentUser.email].address || '';
                }
                renderPatientBookings(); // Render bookings when patient logs in
                renderMedicalRecords(); // Render medical records when patient logs in
            }

        } else {
            // User is logged out
            mainNavLinks.classList.remove('d-none');
            loggedInNavLinks.classList.add('d-none');
            homeLink.onclick = () => showLandingPage(); // Home link goes to landing page when logged out
        }
    }
}

// Function to show the appropriate dashboard or landing page
function showDashboard(role) {
    const landingPageContent = document.getElementById('landingPageContent');
    const doctorDashboard = document.getElementById('doctorDashboard');
    const patientDashboard = document.getElementById('patientDashboard');

    if (landingPageContent) landingPageContent.style.display = 'none';
    if (doctorDashboard) doctorDashboard.classList.remove('active');
    if (patientDashboard) patientDashboard.classList.remove('active');


    if (role === 'doctor' && doctorDashboard) {
        doctorDashboard.classList.add('active');
        showDoctorDashboardContent('overview'); // Show default content for doctor
    } else if (role === 'patient' && patientDashboard) {
        patientDashboard.classList.add('active');
        showPatientDashboardContent('overview'); // Show default content for patient
    }
}

function showLandingPage() {
    const landingPageContent = document.getElementById('landingPageContent');
    const doctorDashboard = document.getElementById('doctorDashboard');
    const patientDashboard = document.getElementById('patientDashboard');

    if (landingPageContent) landingPageContent.style.display = 'block';
    if (doctorDashboard) doctorDashboard.classList.remove('active');
    if (patientDashboard) patientDashboard.classList.remove('active');
    // Scroll to top of landing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Function to switch content within Doctor Dashboard
function showDoctorDashboardContent(contentId) {
    document.querySelectorAll('#doctorDashboard .dashboard-content-area').forEach(div => {
        div.classList.remove('active');
    });
    const targetContent = document.getElementById(`doctor${contentId.charAt(0).toUpperCase() + contentId.slice(1)}Content`);
    if (targetContent) targetContent.classList.add('active');


    // Update active state in sidebar nav
    document.querySelectorAll('#doctorDashboard .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`#doctorDashboard .nav-link[onclick*="showDoctorDashboardContent('${contentId}')"]`);
    if (activeLink) activeLink.classList.add('active');
}

// Function to switch content within Patient Dashboard
function showPatientDashboardContent(contentId) {
    document.querySelectorAll('#patientDashboard .dashboard-content-area').forEach(div => {
        div.classList.remove('active');
    });
    const targetContent = document.getElementById(`patient${contentId.charAt(0).toUpperCase() + contentId.slice(1)}Content`);
    if (targetContent) targetContent.classList.add('active');


    // Update active state in sidebar nav
    document.querySelectorAll('#patientDashboard .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    const activeLink = document.querySelector(`#patientDashboard .nav-link[onclick*="showPatientDashboardContent('${contentId}')"]`);
    if (activeLink) activeLink.classList.add('active');


    // Specific actions for patient dashboard content
    if (contentId === 'myBookings') {
        renderPatientBookings();
    } else if (contentId === 'medicalRecords') {
        renderMedicalRecords();
    }
}

// --- Login/Register Form Handlers ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const role = document.getElementById('loginRole').value;
        const loginMessage = document.getElementById('loginMessage');

        // Simple validation
        if (!email || !password || !role) {
            loginMessage.textContent = 'Please enter email, password, and select a role.';
            loginMessage.className = 'alert-message alert-danger';
            loginMessage.style.display = 'block';
            return;
        }

        // Simulate API call or authentication
        console.log('Attempting login with:', { email, password, role });

        setTimeout(() => {
            if (users[email] && users[email].password === password && users[email].role === role) {
                currentUser = { email: email, role: role, name: users[email].name };
                loginMessage.textContent = `Login successful! Welcome ${currentUser.name}. Redirecting...`;
                loginMessage.className = 'alert-message alert-success';
                loginMessage.style.display = 'block';

                showMessageBox(`Login successful! Welcome back, ${currentUser.name}.`, 'success');
                const loginRegisterModal = bootstrap.Modal.getInstance(document.getElementById('loginRegisterModal'));
                if (loginRegisterModal) {
                    loginRegisterModal.hide();
                }
                updateNavbar();
                showDashboard(currentUser.role);
            } else {
                loginMessage.textContent = 'Invalid credentials or role. Please try again.';
                loginMessage.className = 'alert-message alert-danger';
                loginMessage.style.display = 'block';
            }
        }, 1500); // Simulate network delay
    });
}


const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value.trim();
        const confirmPassword = document.getElementById('registerConfirmPassword').value.trim();
        const role = document.getElementById('registerRole').value;
        const registerMessage = document.getElementById('registerMessage');

        // Simple validation
        if (!name || !email || !password || !confirmPassword || !role) {
            registerMessage.textContent = 'All fields are required.';
            registerMessage.className = 'alert-message alert-danger';
            registerMessage.style.display = 'block';
            return;
        }
        if (password !== confirmPassword) {
            registerMessage.textContent = 'Passwords do not match.';
            registerMessage.className = 'alert-message alert-danger';
            registerMessage.style.display = 'block';
            return;
        }
        if (password.length < 6) {
            registerMessage.textContent = 'Password must be at least 6 characters long.';
            registerMessage.className = 'alert-message alert-danger';
            registerMessage.style.display = 'block';
            return;
        }
        if (users[email]) {
            registerMessage.textContent = 'Email already registered. Please login or use a different email.';
            registerMessage.className = 'alert-message alert-danger';
            registerMessage.style.display = 'block';
            return;
        }

        // Simulate API call or registration
        console.log('Attempting registration with:', { name, email, password, role });

        setTimeout(() => {
            // Add new user to simulated data
            users[email] = { password: password, role: role, name: name };
            // Initialize patient data if registering as patient
            if (role === 'patient') {
                patientData[email] = { name: name, phone: '', address: '', bookings: [], medicalRecords: [] };
            }

            registerMessage.textContent = 'Registration successful! You can now log in.';
            registerMessage.className = 'alert-message alert-success';
            registerMessage.style.display = 'block';

            // Optionally switch to login tab after successful registration
            const loginTabButton = document.getElementById('pills-login-tab');
            if (loginTabButton) {
                const loginTab = new bootstrap.Tab(loginTabButton);
                loginTab.show();
            }
            showMessageBox('Registration successful! Please log in.', 'success');
        }, 1500); // Simulate network delay
    });
}


// Logout Button Handlers (for both doctor and patient dashboards and main nav)
document.getElementById('logoutBtn')?.addEventListener('click', performLogout);
document.getElementById('doctorLogoutBtn')?.addEventListener('click', performLogout);
document.getElementById('patientLogoutBtn')?.addEventListener('click', performLogout);


function performLogout() {
    currentUser = null; // Clear current user
    updateNavbar(); // Update navbar to logged out state
    showLandingPage(); // Show landing page
    showMessageBox('You have been logged out successfully.', 'info');
}

// Reset messages and forms when login/register modal is hidden
const loginRegisterModal = document.getElementById('loginRegisterModal');
if (loginRegisterModal) {
    loginRegisterModal.addEventListener('hidden.bs.modal', function () {
        document.getElementById('loginMessage').style.display = 'none';
        document.getElementById('registerMessage').style.display = 'none';
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
        document.getElementById('loginRole').value = ''; // Reset role select
        document.getElementById('registerRole').value = ''; // Reset role select
    });
}

// --- Feature Button Handlers (Landing Page) ---
document.querySelectorAll('.book-appointment-btn').forEach(button => {
    button.addEventListener('click', () => {
        showMessageBox('This feature will allow you to book appointments. Please log in to proceed!', 'info');
    });
});

document.querySelectorAll('.find-doctor-btn').forEach(button => {
    button.addEventListener('click', () => {
        showMessageBox('Explore our network of doctors. Login to find the best specialist for you!', 'info');
    });
});

document.querySelectorAll('.manage-records-btn').forEach(button => {
    button.addEventListener('click', () => {
        showMessageBox('Securely manage your medical records. Login to access your personal health data!', 'info');
    });
});

// --- Simulated Dashboard Feature Functions (now trigger content changes) ---

// Doctor Functions (now trigger content changes in sidebar)
function doctorViewAppointments() { showDoctorDashboardContent('appointments'); }
function doctorViewPastAppointments() { showDoctorDashboardContent('appointments'); } // Both view past/upcoming go to same tab for simplicity
function doctorViewSessions() { showDoctorDashboardContent('sessions'); }
function doctorViewPatientDetails() { showDoctorDashboardContent('patients'); }
function doctorEditAccount() { showDoctorDashboardContent('settings'); showMessageBox('Doctor: Edit account settings form will appear here.', 'info'); }
function doctorDeleteAccount() { showDoctorDashboardContent('settings'); showMessageBox('Doctor: Are you sure you want to delete your account? This action is irreversible.', 'danger'); }

// Patient Functions (now trigger content changes in sidebar)
function patientMakeAppointment() { showPatientDashboardContent('makeAppointment'); }
function patientViewBookings() { showPatientDashboardContent('myBookings'); }
function patientMedicalRecords() { showPatientDashboardContent('medicalRecords'); } // New function for medical records
function patientEditAccount() { showPatientDashboardContent('settings'); } // Now just navigates to settings tab
function patientDeleteAccount() { showPatientDashboardContent('settings'); } // Now just navigates to settings tab

// --- Patient Dashboard Specific Functionality ---

// Handle appointment booking form submission
const bookAppointmentForm = document.getElementById('bookAppointmentForm');
if (bookAppointmentForm) {
    bookAppointmentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const doctor = document.getElementById('patientDoctorSelect').value;
        const date = document.getElementById('patientAppointmentDate').value;
        const time = document.getElementById('patientAppointmentTime').value;
        const notes = document.getElementById('patientAppointmentNotes').value;
        const appointmentMessage = document.getElementById('appointmentMessage');

        if (!doctor || !date || !time) {
            appointmentMessage.textContent = 'Please fill in all required fields (Doctor, Date, Time).';
            appointmentMessage.className = 'alert-message alert-danger';
            appointmentMessage.style.display = 'block';
            return;
        }

        const newBooking = {
            id: patientData[currentUser.email].bookings.length + 1,
            doctor: doctor,
            date: date,
            time: time,
            status: 'Pending', // New appointments are pending
            notes: notes
        };

        patientData[currentUser.email].bookings.push(newBooking);

        appointmentMessage.textContent = `Appointment with ${doctor} on ${date} at ${time} requested. Status: Pending.`;
        appointmentMessage.className = 'alert-message alert-success';
        appointmentMessage.style.display = 'block';

        // Clear form
        document.getElementById('bookAppointmentForm').reset();
        showMessageBox('Appointment request submitted successfully!', 'success');
        renderPatientBookings(); // Update bookings list
    });
}


// Render patient bookings in the table
function renderPatientBookings() {
    const tableBody = document.getElementById('patientBookingsTableBody');
    if (!tableBody) return; // Exit if element not found (e.g., not on patient dashboard)

    tableBody.innerHTML = ''; // Clear existing rows
    const bookings = patientData[currentUser.email].bookings;
    const noBookingsMessage = document.getElementById('noBookingsMessage');

    if (bookings.length === 0) {
        if (noBookingsMessage) noBookingsMessage.style.display = 'block';
        return;
    } else {
        if (noBookingsMessage) noBookingsMessage.style.display = 'none';
    }

    bookings.forEach(booking => {
        const row = tableBody.insertRow();
        row.innerHTML = `
            <td>${booking.doctor}</td>
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td><span class="badge bg-${booking.status === 'Confirmed' ? 'success' : (booking.status === 'Pending' ? 'warning' : 'secondary')}">${booking.status}</span></td>
            <td>
                ${booking.status === 'Confirmed' || booking.status === 'Pending' ?
                `<button class="btn btn-sm btn-danger cancel-booking-btn" data-booking-id="${booking.id}">Cancel</button>` : '-'
            }
            </td>
        `;
    });

    // Add event listeners for cancel buttons
    document.querySelectorAll('.cancel-booking-btn').forEach(button => {
        button.addEventListener('click', function () {
            const bookingId = parseInt(this.dataset.bookingId);
            cancelPatientBooking(bookingId);
        });
    });
}

// Function to cancel a patient booking
function cancelPatientBooking(bookingId) {
    const bookings = patientData[currentUser.email].bookings;
    const index = bookings.findIndex(b => b.id === bookingId);

    if (index !== -1) {
        bookings[index].status = 'Cancelled'; // Simulate cancellation
        showMessageBox(`Booking ID ${bookingId} has been cancelled.`, 'info');
        renderPatientBookings(); // Re-render table
    }
}

// Render medical records (simulated)
function renderMedicalRecords() {
    const medicalRecordsList = document.getElementById('patientMedicalRecordsContent')?.querySelector('.list-group');
    if (!medicalRecordsList) return;

    medicalRecordsList.innerHTML = ''; // Clear existing records
    const records = patientData[currentUser.email].medicalRecords;

    if (records.length === 0) {
        medicalRecordsList.innerHTML = '<li class="list-group-item text-center text-muted">No medical records found.</li>';
        return;
    }

    records.forEach(record => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            ${record.type} - ${record.date}
            <button class="btn btn-sm btn-outline-primary" onclick="showMessageBox('Simulating view/download of ${record.type} for ${record.date}. Details: ${record.description}', 'info');">
                ${record.type.includes('Prescription') ? 'Download' : 'View'}
            </button>
        `;
        medicalRecordsList.appendChild(listItem);
    });
}


// Handle patient profile form submission
const patientProfileForm = document.getElementById('patientProfileForm');
if (patientProfileForm) {
    patientProfileForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const name = document.getElementById('patientProfileName').value.trim();
        const phone = document.getElementById('patientProfilePhone').value.trim();
        const address = document.getElementById('patientProfileAddress').value.trim();
        const profileMessage = document.getElementById('profileMessage');

        if (!name) {
            profileMessage.textContent = 'Full Name is required.';
            profileMessage.className = 'alert-message alert-danger';
            profileMessage.style.display = 'block';
            return;
        }

        // Update simulated patient data
        patientData[currentUser.email].name = name;
        patientData[currentUser.email].phone = phone;
        patientData[currentUser.email].address = address;

        // Update current user name in global state and navbar
        currentUser.name = name;
        updateNavbar();

        profileMessage.textContent = 'Profile updated successfully!';
        profileMessage.className = 'alert-message alert-success';
        profileMessage.style.display = 'block';
        showMessageBox('Your profile has been updated.', 'success');
    });
}

// Handle patient change password form submission
const patientChangePasswordForm = document.getElementById('patientChangePasswordForm');
if (patientChangePasswordForm) {
    patientChangePasswordForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const currentPassword = document.getElementById('patientCurrentPassword').value;
        const newPassword = document.getElementById('patientNewPassword').value;
        const confirmNewPassword = document.getElementById('patientConfirmNewPassword').value;
        const passwordMessage = document.getElementById('passwordMessage');

        if (currentPassword !== users[currentUser.email].password) {
            passwordMessage.textContent = 'Current password is incorrect.';
            passwordMessage.className = 'alert-message alert-danger';
            passwordMessage.style.display = 'block';
            return;
        }
        if (newPassword.length < 6) {
            passwordMessage.textContent = 'New password must be at least 6 characters long.';
            passwordMessage.className = 'alert-message alert-danger';
            passwordMessage.style.display = 'block';
            return;
        }
        if (newPassword !== confirmNewPassword) {
            passwordMessage.textContent = 'New passwords do not match.';
            passwordMessage.className = 'alert-message alert-danger';
            passwordMessage.style.display = 'block';
            return;
        }

        // Simulate password update
        users[currentUser.email].password = newPassword;
        passwordMessage.textContent = 'Password changed successfully!';
        passwordMessage.className = 'alert-message alert-success';
        passwordMessage.style.display = 'block';
        showMessageBox('Your password has been changed.', 'success');
        patientChangePasswordForm.reset();
    });
}


// Function to confirm patient account deletion
function confirmPatientAccountDeletion() {
    const deleteAccountMessage = document.getElementById('deleteAccountMessage');
    if (!deleteAccountMessage) return;

    deleteAccountMessage.innerHTML = `
        <div class="alert alert-warning text-center">
            Are you absolutely sure you want to delete your account? This action cannot be undone.
            <button class="btn btn-danger btn-sm mt-2" id="confirmDeleteAccountBtn">Yes, Delete My Account</button>
            <button class="btn btn-secondary btn-sm mt-2 ms-2" id="cancelDeleteAccountBtn">Cancel</button>
        </div>
    `;
    deleteAccountMessage.style.display = 'block';

    document.getElementById('confirmDeleteAccountBtn')?.addEventListener('click', function () {
        performPatientAccountDeletion();
    });
    document.getElementById('cancelDeleteAccountBtn')?.addEventListener('click', function () {
        deleteAccountMessage.style.display = 'none';
    });
}

// Function to perform patient account deletion
function performPatientAccountDeletion() {
    const emailToDelete = currentUser.email;

    // Simulate account deletion
    delete users[emailToDelete];
    delete patientData[emailToDelete];

    showMessageBox('Your account has been successfully deleted.', 'success');
    performLogout(); // Log out after deletion
}


// Initialize navbar state and show appropriate page on page load
document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
    // Check if on the main index.html page or a sub-page
    if (document.getElementById('landingPageContent')) {
        showLandingPage();
    } else if (window.location.pathname.includes('doctor-dashboard.html')) {
        // This is a placeholder for if you had separate dashboard HTMLs
        // For this single-page app, this block might not be strictly needed
        // unless you navigate directly to a dashboard-specific URL
        if (currentUser && currentUser.role === 'doctor') {
            showDashboard('doctor');
        } else {
            // Redirect or show message if not logged in or wrong role
            showMessageBox('Please login as a doctor to view the dashboard.', 'danger');
            window.location.href = 'index.html'; // Redirect to main page
        }
    } else if (window.location.pathname.includes('patient-dashboard.html')) {
        if (currentUser && currentUser.role === 'patient') {
            showDashboard('patient');
        } else {
            showMessageBox('Please login as a patient to view your dashboard.', 'danger');
            window.location.href = 'index.html';
        }
    }
});




document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('appointmentForm');
    const message = document.getElementById('appointmentMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        try {
            const response = await fetch('./Appointment.php', { method: 'POST', body: formData });
            const result = await response.json();

            message.textContent = result.message;
            message.className = `alert ${result.success ? 'alert-success' : 'alert-danger'}`;
            message.classList.remove('d-none');

            if (result.success) form.reset();

            setTimeout(() => message.classList.add('d-none'), 3000);
        } catch (err) {
            console.error(err);
            message.textContent = 'Something went wrong!';
            message.className = 'alert alert-danger';
            message.classList.remove('d-none');
        }
    });
});









document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const mainNavLinks = document.getElementById('mainNavLinks');
    const loggedInNavLinks = document.getElementById('loggedInNavLinks');
    const logoutBtn = document.getElementById('logoutBtn');

    // Update navigation UI based on login status
    function updateUI(isLoggedIn) {
        if (isLoggedIn) {
            mainNavLinks.classList.add('d-none');
            loggedInNavLinks.classList.remove('d-none');
        } else {
            mainNavLinks.classList.remove('d-none');
            loggedInNavLinks.classList.add('d-none');
        }
    }

    // Redirect based on role
    function redirectAfterLogin(role) {
        if (role === 'doctor') {
            window.location.href = './Doctor.html';
        } else if (role === 'patient') {
            window.location.href = './Patient.html';
        }
    }

    // Check existing session on page load
    const userSession = JSON.parse(localStorage.getItem('userSession'));
    if (userSession?.isLoggedIn) {
        updateUI(true);
        redirectAfterLogin(userSession.userRole); // auto-redirect if already logged in
    }

    // Register form submission
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            const formData = new FormData(registerForm);
            try {
                const response = await fetch('register.php', { method: 'POST', body: formData });
                const result = await response.json();
                alert(result.message);
                if (result.status === 'success') registerForm.reset();
            } catch (error) {
                console.error(error);
                alert('Error during registration.');
            }
        });
    }

    // Login form submission

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Get selected role from login form
            const role = document.getElementById('loginRole').value;

            const formData = new FormData(loginForm);
            try {
                const response = await fetch('users.php', { method: 'POST', body: formData });
                const result = await response.json();

                if (result.status === 'success') {
                    // Save session
                    localStorage.setItem('userSession', JSON.stringify({
                        isLoggedIn: true,
                        userName: result.full_name,
                        userRole: role  // Use role from input
                    }));

                    updateUI(true);
                    bootstrap.Modal.getInstance(document.getElementById('loginModal'))?.hide();

                    // Redirect based on role
                    if (role === 'doctor') window.location.href = 'Doctor.html';
                    else if (role === 'patient') window.location.href = 'Patient.html';

                } else {
                    alert(result.message);
                }
            } catch (error) {
                console.error(error);
                alert('Error during login.');
            }
        });
    }






    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('userSession');
            updateUI(false);
            alert('You have been logged out.');
        });
    }
});
