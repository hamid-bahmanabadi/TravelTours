document.addEventListener('DOMContentLoaded', function () {
    console.log('اسلایدرهای شهرها بارگذاری شد');

    const cityImages = {
        tehran: ['t1.webp', 't2.webp', 't3.webp', 't4.webp', 't5.webp', 't6.webp', 't7.webp', 't8.webp', 't9.webp'],
        isfahan: ['e1.webp', 'e2.webp', 'e3.webp', 'e4.webp', 'e5.webp', 'e6.webp', 'e7.webp', 'e8.webp', 'e9.webp'],
        shiraz: ['s1.webp', 's2.webp', 's4.webp', 's5.webp', 's6.webp', 's7.webp', 's8.jpg', 's9.webp'],
        kish: ['k1.webp', 'k2.webp', 'k3.webp', 'k4.webp', 'k5.webp', 'k6.webp', 'k7.webp', 'k8.webp', 'k9.webp'],
        mashhad: ['m1.webp', 'm2.webp', 'm3.webp', 'm4.webp', 'm5.webp', 'm6.webp', 'm7.webp', 'm8.webp', 'm9.webp']
    };

    const autoPlayIntervals = {};

    initializeAllSliders();

    function initializeAllSliders() {
        for (const city in cityImages) {
            if (cityImages.hasOwnProperty(city)) {
                createSliderDots(city);
                setupNavigation(city);
                showSlide(city, 0);
                startAutoPlay(city);
            }
        }
    }

    function createSliderDots(city) {
        const dotsContainer = document.querySelector(`#slider-${city} .slider-dots`);
        if (!dotsContainer) return;

        dotsContainer.innerHTML = '';
        cityImages[city].forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
            dot.dataset.index = index;
            dot.setAttribute('aria-label', `رفتن به تصویر ${index + 1}`);
            dotsContainer.appendChild(dot);

            dot.addEventListener('click', () => {
                showSlide(city, index);
            });
        });
    }

    function setupNavigation(city) {
        const prevBtn = document.querySelector(`#slider-${city} .slider-prev`);
        const nextBtn = document.querySelector(`#slider-${city} .slider-next`);

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const currentIndex = getCurrentSlideIndex(city);
                const newIndex = (currentIndex - 1 + cityImages[city].length) % cityImages[city].length;
                showSlide(city, newIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const currentIndex = getCurrentSlideIndex(city);
                const newIndex = (currentIndex + 1) % cityImages[city].length;
                showSlide(city, newIndex);
            });
        }
    }

    function showSlide(city, index) {
        const slider = document.querySelector(`#slider-${city}`);
        const dots = document.querySelectorAll(`#slider-${city} .slider-dot`);
        const counter = document.querySelector(`#slider-${city} .slider-counter`);

        if (!slider) return;

        const imageUrl = `/img/imgcities/${cityImages[city][index]}`;

        slider.style.backgroundImage = `url('${imageUrl}')`;

        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');

        if (counter) {
            counter.textContent = `${index + 1} / ${cityImages[city].length}`;
        }

        slider.dataset.currentIndex = index;

        resetAutoPlay(city);
    }

    function getCurrentSlideIndex(city) {
        const slider = document.querySelector(`#slider-${city}`);
        return slider && slider.dataset.currentIndex ? parseInt(slider.dataset.currentIndex) : 0;
    }

    function startAutoPlay(city) {
        if (autoPlayIntervals[city]) {
            clearInterval(autoPlayIntervals[city]);
        }
        autoPlayIntervals[city] = setInterval(() => {
            const currentIndex = getCurrentSlideIndex(city);
            const nextIndex = (currentIndex + 1) % cityImages[city].length;
            showSlide(city, nextIndex);
        }, 5000);
    }

    function resetAutoPlay(city) {
        startAutoPlay(city);
    }

    document.querySelectorAll('.city-slider-container').forEach(slider => {
        slider.addEventListener('mouseenter', function () {
            const city = this.id.replace('slider-', '');
            if (autoPlayIntervals[city]) {
                clearInterval(autoPlayIntervals[city]);
            }
        });
        slider.addEventListener('mouseleave', function () {
            const city = this.id.replace('slider-', '');
            startAutoPlay(city);
        });
    });

    window.addEventListener('beforeunload', function () {
        for (const city in autoPlayIntervals) {
            if (autoPlayIntervals.hasOwnProperty(city)) {
                clearInterval(autoPlayIntervals[city]);
            }
        }
    });
});