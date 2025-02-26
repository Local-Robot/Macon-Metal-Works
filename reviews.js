// Fisher-Yates shuffle to randomize array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function fetchReviews() {
    const app_key = 'kPuRbw6Uo4fVEVNUktRkNhHJj7NfsWERvDxDNnq4'; // Yotpo app key
    const utoken = 'xN8Bn1iFUlZIdHfUD00hxFJZ8BLXH1DKXevLl5m2';  // The correct API token
    const url = `https://api.yotpo.com/v1/apps/${app_key}/reviews?utoken=${utoken}&count=20`; // Fetch more reviews

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        const shuffledReviews = shuffleArray(data.reviews); // Shuffle the reviews array
        return shuffledReviews.slice(0, 4); // Return only 4 reviews for display
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}

function displayReviews(reviews) {
    const reviewsContainer = document.querySelector('.reviews-container'); // Desktop/tablet container
    const swiperWrapper = document.querySelector('.swiper-wrapper'); // Mobile swiper container

    reviewsContainer.innerHTML = ''; // Clear any existing reviews for desktop/tablet
    swiperWrapper.innerHTML = ''; // Clear any existing reviews for mobile

    reviews.forEach((review) => {
        // Create review card for desktop/tablet
        const reviewCard = document.createElement('div'); 
        reviewCard.classList.add('review-card'); 

        // Generate stars HTML based on the review score
        const stars = '★'.repeat(review.score) + '☆'.repeat(5 - review.score);

        // Use the `name` field from the API response
        const userName = review.name ? review.name : 'Anonymous';

        // Desktop review card content
        reviewCard.innerHTML = `
            <div class="stars">${stars}</div>
            <h3>${review.title}</h3>
            <p>${review.content}</p>
            <p class="username"><strong>${userName}</strong></p>
        `;

        // Append to desktop/tablet container
        reviewsContainer.appendChild(reviewCard);

        // Create review card for mobile (swiper-slide)
        const swiperSlide = document.createElement('div');
        swiperSlide.classList.add('swiper-slide', 'review-card');

        // Mobile review card content
        swiperSlide.innerHTML = `
            <div class="stars">${stars}</div>
            <h3>${review.title}</h3>
            <p>${review.content}</p>
            <p><strong>${userName}</strong></p>
        `;

        // Append to swiper-wrapper for mobile
        swiperWrapper.appendChild(swiperSlide);
    });
}

// Call the function when the page is loaded
window.onload = async function() {
    const reviews = await fetchReviews();
    displayReviews(reviews);

    // Only initialize Swiper on mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        const swiper = new Swiper('.swiper-container', {
            slidesPerView: 1, // Show one review per swipe
            centeredSlides: true, // Center each slide in the viewport
            spaceBetween: 40, // Add space between slides
            loop: false, // Disable looping
            grabCursor: true, // Change the cursor to indicate swipe functionality
        });
    }
};