document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('feedback-form');
    const errorsDiv = document.getElementById('errors');
    const commentsDiv = document.getElementById('comments');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const message = document.getElementById('message').value.trim();
            let errors = [];

            if (!name) errors.push('Заполните имя');
            if (!email) errors.push('Заполните email');
            else if (!email.includes('@')) errors.push('Email должен содержать @');
            if (!phone) errors.push('Заполните телефон');
            if (!message) errors.push('Заполните сообщение');
            else if (message.length < 50 || message.length > 400) errors.push('Сообщение должно быть от 50 до 400 символов');

            errorsDiv.innerHTML = errors.map(err => `<p>${err}</p>`).join('');

            if (errors.length === 0) {
                const comment = document.createElement('div');
                comment.classList.add('comment');
                comment.innerHTML = `
                    <p>Email: ${email}</p>
                    <p>Имя: ${name}</p>
                    <p>Телефон: ${phone}</p>
                    <p>${message}</p>
                `;
                commentsDiv.insertBefore(comment, commentsDiv.firstChild);

                form.querySelectorAll('input, textarea').forEach(field => {
                    field.style.borderColor = 'green';
                    field.value = '';
                });
                form.querySelector('button').textContent = 'Готово';

                setTimeout(() => {
                    form.querySelectorAll('input, textarea').forEach(field => {
                        field.style.borderColor = 'red';
                    });
                    form.querySelector('button').textContent = 'Отправить';
                }, 3000);

                errorsDiv.innerHTML = '';
            }
        });
    }
});