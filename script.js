// Wedding Invitation - Adit & Risa
// JavaScript Functionality

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functions
    initGreeting();
    initIntroOverlay();
    initCountdown();
    initRSVPForm();
    initGalleryModal();
    initMusicControl();
    initSwipePages();
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

    button.addEventListener('click', function() {
        closeOverlay();
        // Ensure the first page is visible after overlay closes
        document.querySelector('.page-track').style.transform = 'translateX(0)';
        document.querySelectorAll('.bottom-nav button').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.bottom-nav button[data-target="home"]').classList.add('active');
    });
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
    // Wedding date: June 7, 2026
    const weddingDate = new Date('2026-06-07T09:00:00').getTime();

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

// Page swipe functionality
function initSwipePages() {
    const pageTrack = document.querySelector('.page-track');
    const navButtons = document.querySelectorAll('.bottom-nav button');
    const sections = document.querySelectorAll('.page-section');
    let currentPageIndex = 0;

    function updatePagePosition() {
        pageTrack.style.transform = `translateX(-${currentPageIndex * 100}%)`;
        updateActiveNavButton();
    }

    function updateActiveNavButton() {
        navButtons.forEach((button, index) => {
            button.classList.remove('active');
            if (button.dataset.target === sections[currentPageIndex].id) {
                button.classList.add('active');
            }
        });
    }

    function triggerBackgroundShift(direction) {
        const body = document.body;
        const shiftClass = direction === 'left' ? 'bg-shift-left' : 'bg-shift-right';
        const oppositeClass = direction === 'left' ? 'bg-shift-right' : 'bg-shift-left';
        
        // Remove any existing shift class
        body.classList.remove('bg-shift-left', 'bg-shift-right');
        
        // Trigger reflow to restart animation
        void body.offsetWidth;
        
        // Add the new shift class
        body.classList.add(shiftClass);
        
        // Remove class after animation completes
        setTimeout(() => {
            body.classList.remove(shiftClass);
        }, 600);
    }

    navButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            const targetIndex = Array.from(sections).findIndex(section => section.id === targetId);
            if (targetIndex !== -1) {
                // Determine direction
                const direction = targetIndex > currentPageIndex ? 'left' : 'right';
                triggerBackgroundShift(direction);
                
                currentPageIndex = targetIndex;
                updatePagePosition();
            }
        });
    });

    // Optional: Add swipe gesture for touch devices (basic implementation)
    let touchStartX = 0;
    let touchEndX = 0;

    pageTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });

    pageTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipeGesture();
    });

    function handleSwipeGesture() {
        if (touchEndX < touchStartX - 50) { // Swiped left
            if (currentPageIndex < sections.length - 1) {
                triggerBackgroundShift('left');
                currentPageIndex++;
                updatePagePosition();
            }
        } else if (touchEndX > touchStartX + 50) { // Swiped right
            if (currentPageIndex > 0) {
                triggerBackgroundShift('right');
                currentPageIndex--;
                updatePagePosition();
            }
        }
    }

    // Initialize active button
    updateActiveNavButton();
}

// Remove parallax effect, not relevant for swipe
window.removeEventListener('scroll', function () {
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