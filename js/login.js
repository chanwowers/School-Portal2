/* ------------------------------------------------------------------
   login.js — behaviour for Login.html.
   Loaded with <script defer>, so the DOM is ready and no
   DOMContentLoaded wrapper is needed.
   ------------------------------------------------------------------ */

const form = document.getElementById('loginForm');
const username = document.getElementById('username');
const userLabel = document.getElementById('userLabel');
const password = document.getElementById('password');
const userError = document.getElementById('userError');
const passError = document.getElementById('passError');
const alertBox = document.getElementById('alert');
const toggle = document.getElementById('toggle');
const roleSelect = document.getElementById('role');

/* ---------- account type ---------- */
/* Students and teachers share this form. The choice only changes the ID
   label and which dashboard we open after a successful (demo) sign-in. */
function currentRole() {
  return roleSelect && roleSelect.value === 'teacher' ? 'teacher' : 'student';
}

function syncRole() {
  const teacher = currentRole() === 'teacher';
  userLabel.textContent = teacher ? 'Employee ID' : 'Student ID';
  username.placeholder = teacher ? 'e.g. EMP-00231' : 'e.g. 2024-00123';
  userError.textContent = '';
  username.removeAttribute('aria-invalid');
}

if (roleSelect) {
  roleSelect.addEventListener('change', syncRole);
}
syncRole();

toggle.addEventListener('click', () => {
  const hidden = password.type === 'password';
  password.type = hidden ? 'text' : 'password';
  toggle.textContent = hidden ? 'Hide' : 'Show';
  toggle.setAttribute('aria-label', hidden ? 'Hide password' : 'Show password');
  password.focus();
});

function setError(input, box, message) {
  box.textContent = message;
  input.setAttribute('aria-invalid', message ? 'true' : 'false');
  return !message;
}

function validate() {
  const okUser = setError(username, userError,
    username.value.trim() ? '' : 'Enter your ID.');
  const okPass = setError(password, passError,
    password.value ? (password.value.length < 6 ? 'Password must be at least 6 characters.' : '')
                   : 'Enter your password.');
  return okUser && okPass;
}

[username, password].forEach(el => {
  el.addEventListener('input', () => {
    if (el.getAttribute('aria-invalid') === 'true') validate();
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  alertBox.classList.remove('show');

  if (!validate()) {
    (username.getAttribute('aria-invalid') === 'true' ? username : password).focus();
    return;
  }

  // DEMO ONLY — no server, no authentication. Any valid-looking input gets in,
  // and the portal pages can be opened directly without passing through here.
  // Replace with a real request, e.g.:
  //   fetch('/api/login', { method: 'POST', body: new FormData(form) })
  // and let the server decide the role and where to redirect.
  const role = currentRole();
  try {
    sessionStorage.setItem('sp_user_id', username.value.trim());
    sessionStorage.setItem('sp_role', role);
    // clear the old student-only key from earlier versions of this page
    sessionStorage.removeItem('sp_student_id');
  } catch (e) {}

  window.location.href = role === 'teacher' ? 'TeacherDashboard.html' : 'Dashboard.html';
});
