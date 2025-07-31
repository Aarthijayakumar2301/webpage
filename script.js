// Sample book data
const books = [
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    price: 14.99,
    img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80",
    featured: true,
  },
  {
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    price: 18.49,
    img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80",
    featured: true,
  },
  {
    title: "1984",
    author: "George Orwell",
    price: 12.5,
    img: "https://images.unsplash.com/photo-1544937953-4f6e468a7e1a?auto=format&fit=crop&w=400&q=80",
    featured: true,
  },
  {
    title: "Brave New World",
    author: "Aldous Huxley",
    price: 15.0,
    img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80",
    featured: false,
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    price: 11.0,
    img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80",
    featured: false,
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    price: 22.99,
    img: "https://images.unsplash.com/photo-1531219432768-9b69ee4e6d11?auto=format&fit=crop&w=400&q=80",
    featured: false,
  }
];

// DOM elements
const catalog = document.getElementById("catalog");
const cartToggleBtn = document.getElementById("cartToggle");
const cartSidebar = document.getElementById("cartSidebar");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");
const loginModal = document.getElementById("loginModal");
const registerModal = document.getElementById("registerModal");
const modalOverlay = document.getElementById("modalOverlay");
const switchToRegisterBtn = document.getElementById("switchToRegister");
const switchToLoginBtn = document.getElementById("switchToLogin");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// Carousel DOM
const carouselTrack = document.getElementById("carouselTrack");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");

let cart = [];
let currentSlide = 0;

// Renders catalog books
function renderCatalog() {
  catalog.innerHTML = "";
  books.forEach((book, idx) => {
    const bookCard = document.createElement("article");
    bookCard.className = "book-card";

    bookCard.innerHTML = `
      <img src="${book.img}" alt="${book.title}" class="book-image" />
      <div class="book-details">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">by ${book.author}</p>
        <div class="book-price">$${book.price.toFixed(2)}</div>
        <button data-index="${idx}">Add to Cart</button>
      </div>
    `;
    catalog.appendChild(bookCard);
  });
}

// Add book to cart
function addToCart(index) {
  const book = books[index];
  const found = cart.find(item => item.title === book.title);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ ...book, qty: 1 });
  }
  updateCartUI();
}

// Update cart sidebar UI
function updateCartUI() {
  cartItemsContainer.innerHTML = "";
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartTotalEl.textContent = "0.00";
    cartCountEl.textContent = "0";
    checkoutBtn.disabled = true;
    return;
  }
  let total = 0;
  let totalCount = 0;
  cart.forEach(({ title, price, qty }) => {
    total += price * qty;
    totalCount += qty;
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";
    itemEl.innerHTML = `
      <span>${title} <span class="cart-item-qty">(x${qty})</span></span>
      <span>$${(price * qty).toFixed(2)}</span>
    `;
    cartItemsContainer.appendChild(itemEl);
  });
  cartTotalEl.textContent = total.toFixed(2);
  cartCountEl.textContent = totalCount;
  checkoutBtn.disabled = false;
}

// Toggle cart sidebar
cartToggleBtn.addEventListener("click", () => {
  cartSidebar.classList.toggle("open");
});

// Add to cart delegation
catalog.addEventListener("click", e => {
  if (e.target.tagName === "BUTTON" && e.target.dataset.index !== undefined) {
    addToCart(Number(e.target.dataset.index));
  }
});

// Modal helpers
function openModal(modal) {
  modal.classList.add("active");
  modalOverlay.classList.add("active");
}

function closeModals() {
  loginModal.classList.remove("active");
  registerModal.classList.remove("active");
  modalOverlay.classList.remove("active");
}

// Open modals on button clicks
loginBtn.addEventListener("click", () => openModal(loginModal));
registerBtn.addEventListener("click", () => openModal(registerModal));

switchToRegisterBtn.addEventListener("click", () => {
  closeModals();
  openModal(registerModal);
});
switchToLoginBtn.addEventListener("click", () => {
  closeModals();
  openModal(loginModal);
});

// Close modals clicking outside
modalOverlay.addEventListener("click", closeModals);

// Form submission (dummy)
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  alert(`Logged in as: ${loginForm.loginEmail.value}`);
  loginForm.reset();
  closeModals();
});
registerForm.addEventListener("submit", e => {
  e.preventDefault();
  alert(`Registered user: ${registerForm.registerName.value}`);
  registerForm.reset();
  closeModals();
});

// --- Carousel logic ---

// Filter featured books for carousel
const featuredBooks = books.filter(book => book.featured);

// Render slides
function renderCarousel() {
  carouselTrack.innerHTML = "";
  featuredBooks.forEach(book => {
    const slide = document.createElement("li");
    slide.className = "carousel-slide";
    slide.innerHTML = `
      <img src="${book.img}" alt="${book.title}" />
      <div class="carousel-slide-info">
        <h3 class="carousel-slide-title">${book.title}</h3>
        <p class="carousel-slide-author">by ${book.author}</p>
        <div class="carousel-slide-price">$${book.price.toFixed(2)}</div>
      </div>
    `;
    carouselTrack.appendChild(slide);
  });
}

// Update carousel position
function updateCarousel() {
  const slideWidth = carouselTrack.querySelector(".carousel-slide").getBoundingClientRect().width + 32; // margin 1rem * 2
  const offset = -(slideWidth * currentSlide);
  carouselTrack.style.transform = `translateX(${offset}px)`;
  // Disable buttons at edges
  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide >= featuredBooks.length - visibleSlides();
}

// Calculate visible slides based on width
function visibleSlides() {
  const containerWidth = document.querySelector(".carousel-track-container").offsetWidth;
  const slideWidth = 300 + 32; // slide + margin
  return Math.floor(containerWidth / slideWidth);
}

prevBtn.addEventListener("click", () => {
  if (currentSlide > 0) {
    currentSlide--;
    updateCarousel();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentSlide < featuredBooks.length - visibleSlides()) {
    currentSlide++;
    updateCarousel();
  }
});

// On window resize recalc carousel
window.addEventListener("resize", () => {
  updateCarousel();
});

// Initialize
renderCatalog();
renderCarousel();
updateCartUI();
updateCarousel();
