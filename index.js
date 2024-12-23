
        // Google Translate Initialization
    function googleTranslateElementInit() {
      new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,hi,ta,te,gu,kn,ml,pa,bn,mr,or,ur,as,ne,si',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
      }, 'google_translate_element');
    }

    // Load Google Translate script
    (function() {
      var gt = document.createElement('script'); gt.type = 'text/javascript'; gt.async = true;
      gt.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(gt, s);
    })();
    // Simulated login status (you can replace this with actual login logic)
    let isLoggedIn = false; // Change to true after successful login

    const profileButton = document.getElementById('profile-button');
    const loginButton = document.getElementById('login-button');
    const loginModal = document.getElementById('loginModal');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');

    // Slideshow functionality
    let currentIndex = 0;
    const images = document.querySelectorAll('#imageCard img');

    function showImage(index) {
        images.forEach((img, i) => {
            img.classList.remove('active');
            if (i === index) {
                img.classList.add('active');
            }
        });
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length; // Cycle through images
        showImage(currentIndex);
    }

    // Change image every 3 seconds
    setInterval(nextImage, 3000); // Updated to 3000 milliseconds

    // Show profile content if logged in
    profileButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default anchor behavior
        if (isLoggedIn) {
            profileContent.style.display = profileContent.style.display === 'none' || profileContent.style.display === '' ? 'block' : 'none';
        } else {
            alert('Please log in to view your profile.'); // Alert user if not logged in
        }
    });

    // Show login modal
    loginButton.addEventListener('click', function(event) {
        event.preventDefault();
        loginModal.style.display = 'block'; // Show modal
    });

    // Close login modal
    closeModal.addEventListener('click', function() {
        loginModal.style.display = 'none'; // Hide modal
    });

    // Hide modal if user clicks anywhere outside of the modal
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none'; // Hide modal
        }
    });

    // Handle login form submission
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        // Simulate successful login
        isLoggedIn = true;
        alert('Login successful!'); // Alert user of success
        loginModal.style.display = 'none'; // Hide modal after login
        profileContent.style.display = 'block'; // Show profile content
    });

    // Initial call to show the first image
    showImage(currentIndex);
