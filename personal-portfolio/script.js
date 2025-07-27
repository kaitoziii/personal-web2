// script.js

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------- Dark Mode Toggle ----------------------
    const darkModeToggle = document.getElementById('darkModeToggle');
    const htmlElement = document.documentElement;
    const darkModeIcon = document.getElementById('darkModeIcon');

    // Fungsi untuk mengatur ikon mode gelap/terang
    const setDarkModeIcon = (isDark) => {
        // Ikon Bulan (MoonIcon) untuk mode terang, Ikon Matahari (SunIcon) untuk mode gelap
        if (isDark) {
            darkModeIcon.innerHTML = `<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>`; // Moon icon
        } else {
            darkModeIcon.innerHTML = `<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.325 6.675l-.707-.707M6.707 6.707l-.707-.707m12.728 0l-.707.707M6.707 17.293l-.707.707M12 5a7 7 0 100 14 7 7 0 000-14z"></path>`; // Sun icon
        }
    };

    // Muat preferensi dari local storage
    let isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (localStorage.getItem('darkMode') === null) {
        // Jika belum ada di local storage, deteksi preferensi sistem
        isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Terapkan mode awal
    if (isDarkMode) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }
    setDarkModeIcon(isDarkMode); // Set ikon berdasarkan mode awal

    // Tambahkan event listener untuk tombol toggle
    darkModeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        if (isDarkMode) {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', isDarkMode);
        setDarkModeIcon(isDarkMode); // Perbarui ikon
    });

    // ---------------------- Current Year for Footer ----------------------
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // ---------------------- Smooth Scrolling for Navigation ----------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // ---------------------- Simple Starfield Background Animation ----------------------
    const backgroundAnimation = document.getElementById('background-animation');
    const numStars = 100; // Jumlah bintang

    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        // Posisi acak
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // Ukuran acak
        const size = Math.random() * 3 + 1; // Ukuran 1px sampai 4px
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Durasi animasi acak (untuk variasi)
        star.style.animationDuration = `${Math.random() * 5 + 15}s`; // 15-20s untuk fall
        star.style.animationDelay = `${Math.random() * 20}s`; // Delay untuk muncul bergantian

        // Durasi twinkle acak
        star.style.animationName = `twinkle, fall`;
        star.style.animationIterationCount = `infinite, infinite`;
        star.style.animationTimingFunction = `ease-in-out alternate, linear`;
        star.style.animationDuration = `${Math.random() * 4 + 2}s, ${Math.random() * 20 + 10}s`; // Twinkle 2-6s, Fall 10-30s
        star.style.animationDelay = `${Math.random() * 5}s, ${Math.random() * 30}s`;

        backgroundAnimation.appendChild(star);
    }

    // Intersection Observer untuk animasi scroll
    const animateElements = document.querySelectorAll('.animate-fade-in-up, .animate-fade-in-left, .animate-fade-in-right, .animate-fade-in-scale');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                // Jika ingin animasi hanya sekali, bisa dihapus dari observer setelah ini
                // observer.unobserve(entry.target);
            } else {
                // Untuk mengulang animasi setiap kali keluar/masuk viewport
                // entry.target.style.animationPlayState = 'paused';
                // entry.target.style.opacity = '0';
                // entry.target.style.transform = 'translateY(20px)'; // Reset untuk animasi fadeInUp
            }
        });
    }, {
        threshold: 0.1 // Ketika 10% elemen terlihat
    });

    animateElements.forEach(element => {
        element.style.animationPlayState = 'paused'; // Jeda animasi sampai terlihat
        element.style.opacity = '0'; // Sembunyikan awal
        // Tambahkan transform awal untuk animasi slide-in jika diperlukan
        if (element.classList.contains('animate-fade-in-up')) element.style.transform = 'translateY(20px)';
        if (element.classList.contains('animate-fade-in-left')) element.style.transform = 'translateX(-20px)';
        if (element.classList.contains('animate-fade-in-right')) element.style.transform = 'translateX(20px)';
        if (element.classList.contains('animate-fade-in-scale')) element.style.transform = 'scale(0.9)';

        observer.observe(element);
    });

    // ---------------------- Chat AI Logic ----------------------
    const chatInput = document.getElementById('chat-input');
    const sendButton = document.getElementById('send-button');
    const chatMessages = document.getElementById('chat-messages');

    if (chatInput && sendButton && chatMessages) {
        const sendMessage = async () => {
            const userMessage = chatInput.value.trim();
            if (userMessage === '') return;

            // Tampilkan pesan pengguna di chatbox
            appendMessage('user', userMessage);
            chatInput.value = ''; // Kosongkan input

            // Tampilkan indikator "mengetik..." atau loading
            const loadingMessage = appendMessage('ai', 'AI sedang mengetik...', true);

            try {
              
// Panggil Vercel Function Anda
                // Vercel Function di folder 'api' akan diakses melalui '/api/[nama-file]'
                const response = await fetch('/api/gemini-chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: userMessage }),
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                loadingMessage.remove(); // Hapus indikator loading
                appendMessage('ai', data.reply); // Tampilkan balasan dari AI
            } catch (error) {
                console.error('Error communicating with AI:', error);
                loadingMessage.remove(); // Hapus indikator loading
                appendMessage('ai', 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.');
            } finally {
                chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll ke bawah
            }
        };

        const appendMessage = (sender, text, isLoading = false) => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('p-3', 'rounded-lg', 'max-w-[70%]', 'break-words');

            if (sender === 'user') {
                messageDiv.classList.add('self-end', 'bg-accent', 'text-white');
            } else {
                messageDiv.classList.add('self-start', 'bg-gray-200', 'dark:bg-gray-700', 'text-gray-900', 'dark:text-white');
                if (isLoading) {
                    messageDiv.classList.add('italic', 'text-sm');
                }
            }
            messageDiv.textContent = text;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
            return messageDiv; // Mengembalikan elemen untuk referensi (misal untuk dihapus)
        };

        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

});