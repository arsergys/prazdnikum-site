document.addEventListener('DOMContentLoaded', () => {
    const eventCards = document.querySelectorAll('.event-card');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeBtn = document.querySelector('.close');

    if (eventCards.length > 0) {
        eventCards.forEach(card => {
            card.addEventListener('click', () => {
                const eventType = card.dataset.event;
                let title = '';
                let desc = '';
                if (eventType === 'newyear') {
                    title = 'Новый год';
                    desc = 'Полная организация новогодних праздников с декорациями и программой.';
                } else if (eventType === 'wedding') {
                    title = 'Свадьба';
                    desc = 'Комплексная подготовка свадьбы с индивидуальным подходом.';
                } else if (eventType === 'birthday') {
                    title = 'День рождения';
                    desc = 'Тематические вечеринки для всех возрастов.';
                }
                modalTitle.textContent = title;
                modalDescription.textContent = desc;
                modal.style.display = 'block';
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});