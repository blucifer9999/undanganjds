// Wedding Invitation - Adit & Risa
// JavaScript Functionality

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functions
    initGreeting();
    initIntroOverlay();
    initCountdown();
    initScrollAnimation();
    initRSVPForm();
    initSmoothScroll();
    initGalleryModal();
    initMusicControl();
});

// Intro overlay that opens the content separately
function initIntroOverlay() {
    const overlay = document.getElementById('introOverlay');
    const button = document.getElementById('openInviteBtn');
    if (!overlay || !button) return;

    document.body.classList.add('intro-active');

    const welcomeAudio = document.getElementById('welcomeAudio');

    function playWelcomeMusic() {
        if (!welcomeAudio) return;
        welcomeAudio.currentTime = 0;
        const playPromise = welcomeAudio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay may be blocked until user interacts with the page.
            });
        }
    }

    function closeOverlay() {
        overlay.classList.add('hidden');
        document.body.classList.remove('intro-active');
        playWelcomeMusic();
        window.scrollTo({ top: 0, left: 0 });

        overlay.addEventListener(
            'transitionend',
            function () {
                overlay.style.display = 'none';
            },
            { once: true }
        );
    }

    button.addEventListener('click', closeOverlay);
}

function initMusicControl() {
    const welcomeAudio = document.getElementById('welcomeAudio');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = musicToggle ? musicToggle.querySelector('.music-toggle-icon') : null;

    if (!welcomeAudio || !musicToggle || !musicIcon) return;

    function updateMusicButton() {
        const isPlaying = !welcomeAudio.paused;
        musicIcon.textContent = isPlaying ? '❚❚' : '♪';
        musicToggle.classList.toggle('playing', isPlaying);
        musicToggle.setAttribute('aria-label', isPlaying ? 'Jeda musik' : 'Putar musik');
        musicToggle.setAttribute('aria-pressed', String(isPlaying));
    }

    musicToggle.addEventListener('click', function () {
        if (welcomeAudio.paused) {
            const playPromise = welcomeAudio.play();
            if (playPromise !== undefined) {
                playPromise.catch(updateMusicButton);
            }
        } else {
            welcomeAudio.pause();
        }

        updateMusicButton();
    });

    welcomeAudio.addEventListener('play', updateMusicButton);
    welcomeAudio.addEventListener('pause', updateMusicButton);
    welcomeAudio.addEventListener('ended', updateMusicButton);
    updateMusicButton();
}

// Greeting Section - Get guest name from URL parameter
function initGreeting() {
    const guestNameElement = document.getElementById('guestName');
    const nameInput = document.getElementById('name');
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to') || urlParams.get('nama') || urlParams.get('name');

    if (guestNameElement && guestName) {
        const decodedName = guestName.replace(/\+/g, ' ').trim();

        if (decodedName) {
            guestNameElement.textContent = decodedName;

            if (nameInput) {
                nameInput.value = decodedName;
            }
        }
    }
}

// Gallery Modal Functionality
function initGalleryModal() {
    const modal = document.getElementById('galleryModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.querySelector('.modal-prev');
    const nextBtn = document.querySelector('.modal-next');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Fallback: skip modal logic if required elements are missing.
    if (!modal || !modalImage || !modalCaption || !closeBtn || !prevBtn || !nextBtn || galleryItems.length === 0) return;

    let currentImageIndex = 0;
    const images = Array.from(galleryItems).map(item => ({
        src: item.getAttribute('data-image'),
        caption: item.getAttribute('data-caption')
    }));

    // Open modal when clicking gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            openModal(index);
        });
    });

    function openModal(index) {
        currentImageIndex = index;
        modal.classList.add('active');
        updateModalContent();
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function updateModalContent() {
        if (images[currentImageIndex]) {
            modalImage.src = images[currentImageIndex].src;
            modalCaption.textContent = images[currentImageIndex].caption;
        }
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateModalContent();
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateModalContent();
    }

    // Event listeners
    closeBtn.addEventListener('click', closeModal);
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    // Close modal when clicking outside the image
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (!modal.classList.contains('active')) return;

        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'Escape') closeModal();
    });
}

// Countdown Timer
function initCountdown() {
    // Wedding date: June 3, 2026
    const weddingDate = new Date('2026-06-03T09:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Scroll Animation
function initScrollAnimation() {
    const sections = document.querySelectorAll('section');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(function (section) {
        observer.observe(section);
    });
}

// RSVP Form with Google Apps Script Integration
function initRSVPForm() {
    const form = document.getElementById('rsvp-form');
    const messageDiv = document.getElementById('rsvp-message');
    const submitBtn = form ? form.querySelector('.submit-btn') : null;

    // Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyvZoymzm_Mva2yw_12BEJXkouoj-YuDld4bpbAGf9a4u_pRVc9TcGTEtHKx18b_wSn/exec';

    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form data
            const name = document.getElementById('name').value;
            const attendance = document.getElementById('attendance').value;
            const guests = document.getElementById('guests').value;
            const message = document.getElementById('message').value;

            // Simple validation
            if (!name || !attendance || !guests) {
                showMessage('Mohon lengkapi semua field yang wajib diisi.', 'error');
                return;
            }

            // Create RSVP data object
            const rsvpData = {
                name: name,
                attendance: attendance,
                guests: parseInt(guests),
                message: message,
                timestamp: new Date().toISOString()
            };

            // Disable submit button during submission
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Mengirim...';
            }

            try {
                // Simpan ke localStorage sebagai backup utama
                let rsvpList = JSON.parse(localStorage.getItem('wedding_rsvp') || '[]');
                rsvpList.push(rsvpData);
                localStorage.setItem('wedding_rsvp', JSON.stringify(rsvpList));

                // Kirim data ke Google Apps Script
                // Menggunakan no-cors berarti kita tidak bisa membaca response, 
                // tapi kita berasumsi sukses jika tidak ada error network.
                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(rsvpData)
                });

                const attendanceText = attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir';
                showMessage(`Terima kasih ${name}! Konfirmasi kehadiran Anda (${attendanceText}) telah diterima.`, 'success');
                form.reset();

            } catch (error) {
                console.error('RSVP Error:', error);
                // Jika error network, kita tetap beri feedback sukses karena sudah tersimpan di localStorage
                const attendanceText = attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir';
                showMessage(`Terima kasih ${name}! Konfirmasi Anda telah kami catat.`, 'success');
                form.reset();
            } finally {
                // Re-enable submit button
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Kirim RSVP';
                }
            }
        });
    }

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = 'rsvp-message ' + type;

        // Hide after 5 seconds
        setTimeout(function () {
            messageDiv.className = 'rsvp-message';
            messageDiv.textContent = '';
        }, 5000);
    }
}

// Smooth Scroll for Navigation Links with Active State
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.bottom-nav a');
    const sections = document.querySelectorAll('section[id]');

    // Intersection Observer to track active section
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + activeId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(function (section) {
        observer.observe(section);
    });

    // Smooth scroll click handler
    navLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // Menghitung offset agar judul section tidak tertutup atau terlalu mepet
                // Navigasi bawah biasanya tinggi sekitar 60-80px
                const offset = 20; 
                const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash tanpa jump
                history.pushState(null, null, targetId);
            }
        });
    });
}

// Optional: Add parallax effect to hero
window.addEventListener('scroll', function () {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrolled = window.pageYOffset;
        hero.style.backgroundPositionY = (scrolled * 0.5) + 'px';
    }
});

// Console message for developers
console.log('%c🎊 Undangan Digital - Aditiya & Risa 🎊', 'font-size: 20px; color: #C4A484; font-weight: bold;');
console.log('%cTerima kasih telah menggunakan template ini!', 'font-size: 14px; color: #4A4A4A;');
console.log('%cGunakan parameter ?to=NamaGadis untuk greeting personal', 'font-size: 12px; color: #666;');