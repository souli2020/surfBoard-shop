let newPasswordValue;
let confirmationValue;
const form = document.querySelector('form');
const newPassword = document.getElementById('new-password');
const confirmation = document.getElementById('password-confirmation');
const validationMessage = document.getElementById('validation-message');

const submitBtn = document.getElementById('submitBtn');

function validatePasswords(message, add, remove) {
    validationMessage.textContent = message;
    validationMessage.classList.add(add);
    validationMessage.classList.remove(remove);
}
confirmation.addEventListener('input', e => {
    e.preventDefault();
    newPasswordValue = newPassword.value;
    confirmationValue = confirmation.value;
    if (!newPasswordValue || !confirmationValue) {
        validatePasswords('Please confirm', 'color-red', 'color-green');
    }
    else if (newPasswordValue !== confirmationValue) {
        validatePasswords('Passwords must match!', 'color-red', 'color-green');
        submitBtn.setAttribute('disabled', true)
    } else if (newPasswordValue === confirmationValue) {
        validatePasswords('Passwords match!', 'color-green', 'color-red');
        submitBtn.removeAttribute('disabled')
    }
});

form.addEventListener('submit', e => {
    if (newPasswordValue !== confirmationValue) {
        e.preventDefault();
        const error = document.getElementById('error');
        if (!error) {
            const flashErrorH1 = document.createElement('h1');
            flashErrorH1.classList.add('color-red');
            flashErrorH1.setAttribute('id', 'error');
            flashErrorH1.textContent = 'Passwords must match!';
            const navbar = document.getElementById('navbar');
            navbar.parentNode.insertBefore(flashErrorH1, navbar.nextSibling);
        }
    }
});


const updateProfileBtn = document.getElementById('updateBtn')
const updateForm = document.querySelector('.displayForm')
updateProfileBtn.addEventListener('click', e => {
    e.preventDefault();
    updateForm.classList.toggle("show");
    updateForm.classList.toggle("hide");
    updateProfileBtn.textContent = updateForm.classList.contains('show') ? "cancel" : "update profile";

})



