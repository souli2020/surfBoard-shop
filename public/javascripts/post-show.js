

const toggleBtns = Array.from(document.querySelectorAll('.toggle-edit-form'))
const editForms = Array.from(document.querySelectorAll('.edit-review-form')).forEach(form =>
    form.classList.toggle('displayEdit')
)
toggleBtns.forEach(btn => btn.addEventListener('click', (e) => {
    btn.textContent === 'Edit' ? btn.textContent = 'Cancel' : btn.textContent = 'Edit'
    const editReviewForm = e.currentTarget.nextElementSibling;
    console.log(editReviewForm)
    editReviewForm.classList.toggle('displayEdit');
}))

//clear rating 

Array.from(document.getElementsByClassName('clear-rating-btn')).forEach(btn => {

    btn.addEventListener('click', (e) => {
        const firstCheckBox = e.currentTarget.nextElementSibling;
        firstCheckBox.checked = true
    })
})

