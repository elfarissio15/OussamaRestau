// Define global variables and functions
var intervalId;
let productData; // Define a global variable to hold the fetched data
let faqData; // Define a global variable to hold the fetched data
let promotionsData ;
let user;


const faqSection = document.querySelector('.faq-section');
const faqAnswerSection = document.querySelector('.faq-answer-section');
const faqAnswer = document.querySelector('.faq-answer');
const returnButton = document.querySelector('.returnButton');

// Theme toggling function
function toggleThemeDark() {
    var body = document.body;
    body.classList.toggle("dark-theme");
}


// Function to display promotions
function showPromotions(promotionsData) {
    clearInterval(intervalId); // Clear the existing interval
    var dishImage = document.getElementById("dishImage");
    
    // Display the first promotion image
    dishImage.src = promotionsData[0].image_url;
    // Set the product name as the alt attribute
    dishImage.alt = promotionsData[0].product_name;

    // Create a div to display the description
    var descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description');
    descriptionDiv.id = 'description'; // Corrected id attribute value
    descriptionDiv.textContent = promotionsData[0].description;

    // Append the description div above the image
    dishImage.parentNode.insertBefore(descriptionDiv, dishImage);
    
    var radiosdiv = document.querySelector('.radiosdiv');
    radiosdiv.innerHTML = ''; // Clear existing radio buttons

    promotionsData.forEach(function(promotion, index) {
        // Create a new radio button
        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'r';
        radio.id = 'radio' + (index + 1);
        if (index === 0) {
            radio.checked = true; // Select the first radio button initially
        }
        radiosdiv.appendChild(radio);

        // Event listener to change the image when the radio button is selected
        radio.addEventListener('click', function() {
            dishImage.src = promotion.image_url;
            dishImage.alt = promotion.product_name; // Update alt attribute
            descriptionDiv.textContent = promotion.description;
        });
    });

    // Event listener to show product details when the image is clicked
    dishImage.addEventListener('click', function() {
        // Find the product name associated with the clicked promotion image
        var productName = dishImage.alt;
        
        // Find the corresponding product data
        var product = productData.find(product => product.Name === productName);
        
        if (product) {
            toggleSingleProductPopup(product);
        } else {
            console.error('Product not found for promotion:', productName);
        }
    });

    var currentIndex = 0;
    intervalId = setInterval(function() {
        currentIndex = (currentIndex + 1) % promotionsData.length;
        dishImage.src = promotionsData[currentIndex].image_url;
        dishImage.alt = promotionsData[currentIndex].product_name; // Update alt attribute
        descriptionDiv.textContent = promotionsData[currentIndex].description;
        // Update the selected radio button
        radiosdiv.querySelector('#radio' + (currentIndex + 1)).checked = true;
    }, 6000); // Change image every 3 seconds (adjust as needed)
}

// Function to set button controls
function setButtonsofControl() {
    const dishImage = document.getElementById("dishImage");
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
    const descriptionDiv = document.getElementById('description'); // Select the description div
    let currentIndex = 0;

    // Event listener for the "Previous" button
    prevButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent default button behavior
        currentIndex = (currentIndex - 1 + promotionsData.length) % promotionsData.length;
        dishImage.src = promotionsData[currentIndex].image_url; // Update image source
        dishImage.alt = promotionsData[currentIndex].product_name; // Update alt attribute
        descriptionDiv.textContent = promotionsData[currentIndex].description; // Update description
        updateRadioButtons(currentIndex);
    });

    // Event listener for the "Next" button
    nextButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent default button behavior
        currentIndex = (currentIndex + 1) % promotionsData.length;
        dishImage.src = promotionsData[currentIndex].image_url; // Update image source
        dishImage.alt = promotionsData[currentIndex].product_name; // Update alt attribute
        descriptionDiv.textContent = promotionsData[currentIndex].description; // Update description
        updateRadioButtons(currentIndex);
    });
}

// Function to update the checked state of radio buttons
function updateRadioButtons(currentIndex) {
    const radioButtons = document.querySelectorAll('.radiosdiv input[type="radio"]');
    radioButtons.forEach((radio, index) => {
        radio.checked = index === currentIndex;
    });
}
// Initialization function
window.onload = function () {
    hideAccountMenu();
    hideHelpMenu();
    toggleThemeDark();
    // Find the checkbox element
    var darkModeCheckbox = document.querySelector('.header input[type="checkbox"]');
    // Check the checkbox
    darkModeCheckbox.checked = true;
    fetchProductData();
    fetchPromotionsData();
    fetchFAQData();
    // generateCategories(Object.keys(productData)); // Generate category links
    // generateProductGrids();
    returnButton.style.display = 'none';
    faqAnswerSection.style.display = 'none';
};

function fetchProductData() {
    fetch('https://oussamarestau.onrender.com/products')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        productData = data; // Assign the fetched data to the global variable
        generateCategories(productData);
        generateProductGrids(productData);
        calculateCartTotal(productData);
        console.log("fetched products sucesfully");
    })
    .catch(error => {
        console.error('Error fetching product data:', error);
    });
}
function fetchPromotionsData() {
    fetch('https://oussamarestau.onrender.com/Promotions')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        promotionsData = data; // Assign the fetched data to the global variable
        showPromotions(promotionsData); // Display all images for the 'Appetizers' category by default
        setButtonsofControl();
        console.log("Fetched promotions successfully");
    })
    .catch(error => {
        console.error('Error fetching promotions data:', error);
    });
}

// Fetch FAQ data from the server
function fetchFAQData() {
    fetch('https://oussamarestau.onrender.com/faqs')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        faqData = data;
        populateFAQSection(faqData);
        console.log("fetched faq sucesfully");
    })
    .catch(error => {
        console.error('Error fetching FAQ data:', error);
    });
}

// Function to handle populating the FAQ section with the fetched data
function populateFAQSection(faqData) {
    // Clear existing FAQ items
    faqSection.innerHTML = '';

    // Loop through the fetched data and populate FAQ section
    faqData.forEach(faq => {
        const faqItem = document.createElement('div');
        faqItem.classList.add('faq-item');
        faqItem.textContent = faq.Question;
        faqItem.addEventListener('click', () => showAnswer(faq.Question, faq.Answer));
        faqSection.appendChild(faqItem);
    });
}

// Function to show the answer for a question
function showAnswer(question, answer) {
    // Hide all questions
    document.querySelectorAll('.faq-item').forEach(item => {
        item.style.display = 'none';
    });

    // Show the return button and answer section
    returnButton.style.display = 'block';
    faqAnswerSection.style.display = 'block';

    // Display the answer for the selected question
    faqAnswer.textContent = answer;
}

returnButton.addEventListener('click', function () {
            // Show all questions
            document.querySelectorAll('.faq-item').forEach(item => {
                item.style.display = 'block';
            });
    
            // Hide the return button and answer section
            returnButton.style.display = 'none';
            faqAnswerSection.style.display = 'none';
        });

// Function to generate category links
function generateCategories(productData) {
    const ulElement = document.querySelector('#categories');
    ulElement.innerHTML = '';

    // Create a Set to store unique category names
    const uniqueCategories = new Set();

    // Extract unique category names from the data
    productData.forEach(product => {
        uniqueCategories.add(product.Category);
    });

    // Create category links for each unique category
    uniqueCategories.forEach(category => {
        const liElement = document.createElement('li');
        const aElement = document.createElement('a');
        aElement.href = '#';
        aElement.textContent = category; // Use the category name directly
        aElement.onclick = function() {
            // Smooth scroll to the product grid of the clicked category
            smoothScrollTo(`${category}Category`);
        };
        liElement.appendChild(aElement);
        ulElement.appendChild(liElement);
    });
}
// Function to generate product grids
function generateProductGrids(productData) {
    const productsDiv = document.getElementById('products');
    productsDiv.innerHTML = ''; // Clear existing content

    // Create a map to store category divs
    const categoryDivs = {};

    productData.forEach(product => {
        const category = product.Category;

        // Create category div if it doesn't exist
        if (!categoryDivs[category]) {
            const categoryDiv = document.createElement('div');
            categoryDiv.id = `${category}Category`;
            categoryDiv.className = 'product-categorie';
            categoryDiv.textContent = category;
            productsDiv.appendChild(categoryDiv);
            categoryDivs[category] = categoryDiv;

            const gridDiv = document.createElement('div');
            gridDiv.id = `${category}Grid`;
            gridDiv.className = 'product-grid';
            categoryDiv.appendChild(gridDiv);
        }

        // Create product item
        const productItem = createProductItem(product);
        categoryDivs[category].querySelector('.product-grid').appendChild(productItem);
    });
}
// Function to create a product item
function createProductItem(product) {
    var productItem = document.createElement("div");
    productItem.classList.add("product-item");
    productItem.innerHTML = `
        <img src="${product.ImagePath}" alt="${product.Name}">
        <h3>${product.Name}</h3>
        <p>Price: ${product.Price}</p>
        <p>${product.Description}</p>
        <button class="add-to-cart-button ${product.Added ? 'added' : ''}" onclick="toggleCart(this,productData)">${product.Added ? 'Added to Cart' : 'Add to Cart'}</button>
        <button class="like-button ${product.Liked ? 'liked' : ''}" onclick="toggleLike(this,productData)">${product.Liked ? 'Liked' : 'Like'}</button>
    `;

    // Add event listener to show SingleProductPopup when clicked
    productItem.addEventListener('click', function(event) {
        var target = event.target;
        if (!target.classList.contains('add-to-cart-button') && !target.classList.contains('like-button')) {
            // Check if any other popup is shown and hide it
            hideOtherPopups();
            // Show the SingleProductPopup
            toggleSingleProductPopup(product);
        }
    });

    return productItem;
}

// Function to hide other popups before showing SingleProductPopup
function hideOtherPopups() {
    var likedProductsPopup = document.getElementById("likedProductsPopup");
    var addToCartPopup = document.getElementById("cartPopup");
    var searchPopup = document.getElementById("searchPopup");

    // Check if the popups are currently visible
    var isLikedPopupHidden = likedProductsPopup.classList.contains("hidden");
    var isAddToCartPopupHidden = addToCartPopup.classList.contains("hidden");
    var isSearchPopupHidden = searchPopup.classList.contains("hidden");

    // Hide other popups if they are not already hidden
    if (!isLikedPopupHidden) {
        toggleLikedProductsPopup();
    }
    if (!isSearchPopupHidden) {
        toggleSearchPopup();
    }
    if (!isAddToCartPopupHidden) {
        toggleCartPopup();
    }
}
// Function to toggle SingleProductPopup and populate it with the selected product
function toggleSingleProductPopup(product) {
    var singleProductPopup = document.getElementById("SingleProductPopup");
    var productSection = singleProductPopup.querySelector(".Product-Section");
    var isHidden = singleProductPopup.classList.toggle("hidden");

    // Clear previous product details
    productSection.innerHTML = '';
    // Show or hide the SingleProductPopup
    if (!isHidden) {
        // Create and append product details to Product-Section
        var productDetails = document.createElement("div");
        productDetails.classList.add("product-details");
        productDetails.innerHTML = `
            <img src="${product.ImagePath}" alt="${product.Name}">
            <h3>${product.Name}</h3>
            <p>Price: ${product.Price}</p>
            <p>${product.Description}</p>
            <button class="add-to-cart-button ${product.Added ? 'added' : ''}" onclick="toggleCart(this,productData)">${product.Added ? 'Added to Cart' : 'Add to Cart'}</button>
            <button class="like-button ${product.Liked ? 'liked' : ''}" onclick="toggleLike(this,productData)">${product.Liked ? 'Liked' : 'Like'}</button>
        `;
        productSection.appendChild(productDetails);

        const img = productDetails.querySelector('img');

        img.addEventListener('mousemove', function(event) {
            const rect = img.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const offsetY = event.clientY - rect.top;
        
            const originX = (offsetX / rect.width) * 100;
            const originY = (offsetY / rect.height) * 100;
        
            img.style.transformOrigin = `${originX}% ${originY}%`;
        });
        toggleOverlay();
    } else {
        toggleOverlay();
    }
}


// Function to calculate cart total
function calculateCartTotal(productData) {
    const cartTotalSpan = document.getElementById('cartTotal');
    let cartTotal = 0;

    // Iterate through product data to calculate total
    productData.forEach(product => {
        if (product.Added) {
            cartTotal += product.Price;
        }
    });

    // Update cartTotal span with the calculated total
    cartTotalSpan.textContent = cartTotal > 0 ? cartTotal.toFixed(2) : '0';
}

// Toggle like function
function toggleLike(button,productData) {
    var productName = button.parentElement.querySelector('h3').textContent;
    var category = getCategoryContainingProduct(productName,productData);

    if (button.classList.contains('liked')) {
        button.textContent = 'Like';
        button.classList.remove('liked');
        productData.forEach(function(product) {
            if (product.Name === productName) {
                product.Liked = false;
            }
        });
        removeLikedProduct(productName); // Remove product from liked products popup
        showLikedNotification(false);
    } else {
        button.textContent = 'Liked';
        button.classList.add('liked');
        productData.forEach(function(product) {
            if (product.Name === productName) {
                product.Liked = true;
            }
        });
        
        showLikedNotification(true);
    }
    // Update the main page like button
    updateMainPageButton(productName, category);
    displayLikedProducts(); // Display liked products in the popup
}

// Add to cart function
function toggleCart(button,productData) {
    var productName = button.parentElement.querySelector('h3').textContent;
    var category = getCategoryContainingProduct(productName,productData);

    if(button.classList.contains('added')){
        button.textContent = 'Add to Cart';
        button.classList.remove('added');
        productData.forEach(function(product) {
            if (product.Name === productName) {
                product.Added = false;
            }
        });
        removeAddedProduct(productName); // Remove product from added products popup
        showCartNotification(false);
    }else {
        button.textContent = 'Added to Cart';
        button.classList.add('added');
        productData.forEach(function(product) {
            if (product.Name === productName) {
                product.Added = true;
            }
        });
        showCartNotification(true);
    }
    // Update the main page like button
    calculateCartTotal(productData);
    updateMainPageButton(productName, category);
    displayCartItems(); // Display added products in the popup
}

// Show liked notification
function showLikedNotification(liked) {
    var message = liked ? 'Product Liked!' : 'Product Unliked!';
    var backgroundColor = liked ? '#4caf50' : '#dc3545';
    var notification = createNotification(message, backgroundColor);
    notificationQueue.push(notification);

    if (notificationQueue.length === 1) {
        displayNextNotification();
    }
}

// Function to display notifications
function showCartNotification(added) {
   var message = added ? 'Product added successfully to cart!' : 'Product removed successfully from cart!' ;
   var backgroundColor = added ? '#4caf50' : '#dc3545';
   var notification = createNotification(message, backgroundColor);
   notificationQueue.push(notification);

    if (notificationQueue.length === 1) {
        displayNextNotification();
    }
}

// Create notification
function createNotification(message, backgroundColor) {
    var notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    notification.style.backgroundColor = backgroundColor;
    
    // Additional styles for centering
    notification.style.position = 'fixed';
    notification.style.left = '50%';
    return notification;
}

// Update main page like and add button
function updateMainPageButton(productName, category) {
    var mainPageLikeButton = document.querySelector(`#${category.replace(/\s/g, "")}Grid .product-item h3 + .like-button`);
    var mainPageAddButton = document.querySelector(`#${category.replace(/\s/g, "")}Grid .product-item h3 + .add-to-cart-button`)
    if (mainPageLikeButton) {
        var productLiked = productData.find(product => product.Name === productName).Liked;
        mainPageLikeButton.textContent = productLiked ? 'Liked' : 'Like';
        mainPageLikeButton.classList.toggle('liked', productLiked);
    }
    if (mainPageAddButton) {
        var productInCart = productData.find(product => product.Name === productName).Added;
        mainPageAddButton.textContent = productInCart ? 'Added to Cart' : 'Add to Cart';
        mainPageAddButton.classList.toggle('added', productInCart);
    }
    // Update the product grids
    populateProductGrids();
}


// Get category containing product
function getCategoryContainingProduct(productName,productData) {
    for (var i = 0; i < productData.length; i++) {
        if (productData[i].Name === productName) {
            return productData[i].Category;
        }
    }
    return null; // Return null if product not found in any category
}

// Remove liked product
function removeLikedProduct(productName) {
    var likedProducts = document.querySelectorAll('#likedProductsGrid .product-item');
    likedProducts.forEach(function(productItem) {
        var productNameElement = productItem.querySelector('h3');
        if (productNameElement.textContent === productName) {
            productItem.remove();
        }
    });
}

// Remove liked product
function removeAddedProduct(productName) {
    var addedProducts = document.querySelectorAll('#MyCartGrid .product-item');
    addedProducts.forEach(function(productItem) {
        var productNameElement = productItem.querySelector('h3');
        if (productNameElement.textContent === productName) {
            productItem.remove();
        }
    });
}

var notificationQueue = [];

// Display next notification
function displayNextNotification() {
    if (notificationQueue.length > 0) {
        var notification = notificationQueue.shift();
        notificationContainer.appendChild(notification);
        setTimeout(function() {
            notification.remove();
            displayNextNotification(); // Display the next notification
        }, 3000); // Remove notification after 3 seconds
    }
}

function smoothScrollTo(targetId) {
    var targetElement = document.getElementById(targetId);
    if (targetElement) {
        var targetPosition = targetElement.offsetTop;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show or hide the "Back to Top" button based on scroll position
window.onscroll = function() {
    var backToTopBtn = document.getElementById("backToTopBtn");
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
};

// Event listener for account menu and help menu
document.addEventListener('click', function(event) {
    var accountMenu = document.getElementById('accountMenu');
    var isClickInsideAccountMenu = accountMenu.contains(event.target);
    var isClickOnAccountIcon = document.querySelector('.account').contains(event.target);
    var helpMenu = document.getElementById('helpMenu');
    var isClickInsideHelpMenu = helpMenu.contains(event.target);
    var isClickOnHelpIcon = document.querySelector('.help').contains(event.target);

    if ((!isClickInsideAccountMenu && !isClickOnAccountIcon) || isClickInsideAccountMenu) {
        hideAccountMenu();
    }

    if ((!isClickInsideHelpMenu && !isClickOnHelpIcon) || isClickInsideHelpMenu) {
        hideHelpMenu();
    }
});

// Toggle account menu
function toggleAccountMenu() {
    var accountMenu = document.getElementById('accountMenu');
    var accountDiv = document.querySelector('.account');

    if (accountMenu.style.display === "none") {
        // Calculate position relative to the account div
        var rect = accountDiv.getBoundingClientRect();
        var rightOffset = window.innerWidth - rect.right - 40; // Adjust if necessary
        var topOffset = rect.bottom; // Adjust if necessary

        accountMenu.style.display = "block";
        accountMenu.style.position = 'absolute';
        accountMenu.style.top = topOffset + "px";
        accountMenu.style.right = rightOffset + "px";
        accountMenu.style.padding = "10px";
        accountMenu.style.zIndex = "999";
    } else {
        accountMenu.style.display = "none";
    }
}
// Hide account menu
function hideAccountMenu() {
    var accountMenu = document.getElementById('accountMenu'); // Change 'accountMenu' to the new ID
    accountMenu.style.display = "none";
}

// Toggle help menu
function toggleHelpMenu() {
    var helpMenu = document.getElementById('helpMenu');
    if (helpMenu.style.display === "none") {
        helpMenu.style.display = "block";
        helpMenu.style.position = 'absolute';
        helpMenu.style.top = "50px"; /* Adjust as needed */
        helpMenu.style.right = "110px"; /* Adjust as needed */
        helpMenu.style.padding = "10px";
        helpMenu.style.zIndex = "999";
    } else {
        helpMenu.style.display = "none";
    }
}

// Hide help menu
function hideHelpMenu() {
    var helpMenu = document.getElementById('helpMenu');
    helpMenu.style.display = "none";
}

// Function to create overlay
function toggleOverlay() {
    var overlay = document.getElementById("overlay");

    if (!overlay) {
        document.body.insertAdjacentHTML('beforeend', '<div id="overlay" class="overlay"></div>');
        document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
        overlay.remove();
        document.body.style.overflow = ''; // Re-enable scrolling
    }
}

// Toggle login popup
function toggleLoginPopup() {
    var loginPopup = document.getElementById("loginPopup");
    var isHidden = loginPopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); // Create overlay when the popup is shown
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden
        loginPopup.querySelectorAll("input[type='email'], input[type='password'],button[type='submit']").forEach(function(input) {
            input.value = "";
            input.disabled = false ;
        });
        // Remove any existing error messages
        const existingErrorMessage = document.querySelector('.error-message');
        if (existingErrorMessage) {
            existingErrorMessage.remove();
        }
    }
}
// Toggle Forgot password popup
function toggleForgotPasswordPopup() {
    var forgotPasswordPopup = document.getElementById("forgotPasswordPopup");
    var isHidden = forgotPasswordPopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); // Create overlay when the popup is shown
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden
        forgotPasswordPopup.querySelectorAll("input[type='password'],button[type='submit'],input[type='date']").forEach(function(input) {
            input.value = "";
            input.disabled = false ;
        });
        // Show the prompt for setting a new password
        document.getElementById('setNewPasswordPrompt').classList.add('hidden');
        // Hide the last connection prompt
        document.getElementById('lastConnectionPrompt').classList.remove('hidden');
        // Remove any existing error messages
        const existingErrorMessage = document.querySelector('.error-message');
        if (existingErrorMessage) {
            existingErrorMessage.remove();
        }
    }
}

// Toggle sign-up popup
function toggleSignUpPopup() {
    var signUpPopup = document.getElementById("signUpPopup");
    var isHidden = signUpPopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); // Create overlay when the popup is shown
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden
        signUpPopup.querySelectorAll("input[type='text'], input[type='email'], input[type='password'],button[type='submit']").forEach(function(input) {
            input.value = "";
            input.disabled = false;
        });
        // Remove any existing error messages
        const existingErrorMessage = document.querySelector('.error-message');
        if (existingErrorMessage) {
            existingErrorMessage.remove();
        }
    }
}

// Toggle liked products popup
function toggleLikedProductsPopup() {
    var likedProdsPopup = document.getElementById("likedProductsPopup");
    var isHidden = likedProdsPopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); // Create overlay when the popup is shown
        displayLikedProducts(); // Populate liked products in the popup
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden
        clearLikedProducts(); // Clear liked products from the popup
    }
}

// Toggle FAQ popup
function toggleFAQPopup() {
    var faqPopup = document.getElementById("faqPopup");
    var isHidden = faqPopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); // Create overlay when the popup is shown
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden
    }
}

// Toggle Contact popup
function toggleContactPopup() {
    var contactPopup = document.getElementById("contactPopup");
    var isHidden = contactPopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); // Create overlay when the popup is shown
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden
    }
}

// Toggle the cart popup
function toggleCartPopup() {
    var cartPopup = document.getElementById("cartPopup");
    var isHidden = cartPopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); // Create overlay when the popup is shown
        displayCartItems(); // Populate cart items in the popup
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden
        clearCartItems(); // Clear cart items from the popup

    }
}

// Display liked products in the popup
function displayLikedProducts() {
    var likedProdsGrid = document.getElementById("likedProductsGrid");
    likedProdsGrid.innerHTML = ""; // Clear previous products
    productData.forEach(function(product) {
        if (product.Liked) { // Check if the product is liked
            var productItem = createProductItem(product);
            likedProdsGrid.appendChild(productItem);
        }
    });
}

// Function to display cart items in the popup
function displayCartItems() {
    var cartItemsGrid = document.getElementById("MyCartGrid");
    cartItemsGrid.innerHTML = ""; // Clear previous cart items
    productData.forEach(function(product) {
        if (product.Added) { // Check if the product is added to cart
            var productItem = createProductItem(product);
            cartItemsGrid.appendChild(productItem);
        }
    });
}

// Function to display error message
function displayErrorMessage(message, type,color) {
    const errorMessage = document.createElement('div');
    errorMessage.textContent = message;
    errorMessage.style.color = color;
    errorMessage.style.fontWeight = "bold"; // Make text bold
    errorMessage.classList.add("error-message");

    // Add slide-in animation
    errorMessage.style.animation = "slideIn 0.3s ease forwards";

    // Remove any existing error messages
    const existingErrorMessage = document.querySelector('.error-message');
    if (existingErrorMessage) {
        existingErrorMessage.remove();
    }

    // Insert error message after appropriate input field
    let inputField;
    if (type === 'password') {
        inputField = document.getElementById('signup-confirm-password');
        password = document.getElementById('signup-password');
        document.getElementById('signup-confirm-password').value='';
        password.value='';
        password.focus();
    } else if (type === 'Recovery-password') {
        inputField = document.getElementById('Forgot-confirm-password');
        RecoveryPassword = document.getElementById('Forgot-password');
        document.getElementById('Forgot-confirm-password').value='';
        RecoveryPassword.value='';
        RecoveryPassword.focus();
    } else if (type === 'name') {
        inputField = document.getElementById('signup-fullname');
        fullname = document.getElementById('signup-fullname');
        fullname.focus();
    } if (type === 'signup-email') {
        inputField = document.getElementById('signup-email');
        // Create login hyperlink element
        const loginLink = document.createElement('a');
        loginLink.textContent = "Do you want to login?";
        loginLink.href = "#";
        loginLink.id = "login-link"; // Set ID for the login link
        email = document.getElementById('signup-email').value;
        loginLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            // Close sign-up popup
            toggleSignUpPopup();
            // Open login popup
            toggleLoginPopup();
            // Fill email input with existing email
            document.getElementById('login-email').value = email;
        });
        // Append login hyperlink to error message
        errorMessage.appendChild(loginLink);
    }else if (type === 'login-email') {
        inputField = document.getElementById('login-email');
        if (color === 'rgb(255, 35, 35)'){
            // Create login hyperlink element
            const loginLink = document.createElement('a');
            loginLink.textContent = "Do you want to sign up?";
            loginLink.href = "#";
            loginLink.id = "login-link"; // Set ID for the login link
            email = document.getElementById('login-email').value;
            loginLink.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                // Close login popup
                toggleLoginPopup();
                // Open sign-up popup
                toggleSignUpPopup();
                // Fill email input with existing email
                document.getElementById('signup-email').value = email;
            });
            // Append login hyperlink to error message
            errorMessage.appendChild(loginLink);
        }else{
            password = document.getElementById('login-password');
            password.focus();
        } 
    }else if (type === 'Connection-Date') {
        inputField = document.getElementById('date');
        // Create login hyperlink element
        const loginLink = document.createElement('a');
        loginLink.textContent = "Contact Us";
        loginLink.href = "#";
        loginLink.id = "login-link"; // Set ID for the login link
        loginLink.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            // Close Forgot Password popup
            toggleForgotPasswordPopup();
            // Close Contact popup
            toggleContactPopup();

        });
        // Append login hyperlink to error message
        errorMessage.appendChild(loginLink);
    }else if (type === 'login-password') {
        inputField = document.getElementById('login-password');
        if(color === 'rgb(255, 35, 35)'){
            // Create login hyperlink element
            const loginLink = document.createElement('a');
            loginLink.textContent = "forgot password?";
            loginLink.href = "#";
            loginLink.id = "login-link"; // Set ID for the login link
            loginLink.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default link behavior
                // Close login popup
                toggleLoginPopup();
                // Open forgot password popup
                toggleForgotPasswordPopup();
            });
            // Append login hyperlink to error message
            errorMessage.appendChild(loginLink);
        }
    } 
    
    if (inputField) {
        inputField.parentNode.insertBefore(errorMessage, inputField.nextSibling);
    }
}

// Clear liked products from the popup
function clearLikedProducts() {
    var likedProdsGrid = document.getElementById("likedProductsGrid");
    likedProdsGrid.innerHTML = ""; // Clear all products
}

// Clear products from the popup
function clearCartItems() {
    var cartItemsGrid = document.getElementById("MyCartGrid");
    cartItemsGrid.innerHTML = ""; // Clear all products
}

function clearProductGrids() {
    // Get all elements with class 'product-grid'
    var productGrids = document.querySelectorAll('.product-grid');
    
    // Iterate over each product grid element and clear its content
    productGrids.forEach(function(productGrid) {
        productGrid.innerHTML = ""; // Clear the grid content
    });
}

// Function to handle Search form submission
document.getElementById('search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form input values
    const searchInput = document.getElementById('search-String').value.trim().toLowerCase();


    // Check if Search is not clear
    if (searchInput.length < 2) {
        showHighPropertyMessages('There is Nothing to search', 'rgb(255, 35, 35)');
        document.getElementById('search-String').value='';
        document.getElementById('search-String').focus();
        return;
    }

    // Filter products based on search input
    const searchedProducts = productData.filter(product => {
        return (
            product.Name.toLowerCase().includes(searchInput) || 
            product.Description.toLowerCase().includes(searchInput) ||
            product.Category.toLowerCase().includes(searchInput)
        );
    });
    if (searchedProducts.length === 0) {
        showHighPropertyMessages('No product found with this name or description', 'rgb(255, 35, 35)');
        document.getElementById('search-String').value='';
        document.getElementById('search-String').focus();
        return;
    }
    // Display searched products
    document.getElementById('search-String').value='';
    toggleSearchPopup(searchedProducts);
});

// Toggle search popup
function toggleSearchPopup(products) {
    var searchPopup = document.getElementById("searchPopup");
    var isHidden = searchPopup.classList.toggle("hidden");
    if (!isHidden) {
        displaySearchedProducts(products); // Populate searched products in the popup
        toggleOverlay(); 
    } else {
        // Clear searched products from the popup when it's hidden
        var searchPopupContent = document.getElementById("SearshedProductsGrid");
        searchPopupContent.innerHTML = '';
        toggleOverlay(); 
    }
}

// Function to display searched products in the search popup
function displaySearchedProducts(products) {
    const searchPopupContent = document.getElementById('SearshedProductsGrid');

    // Clear previous search results
    searchPopupContent.innerHTML = '';

    // Create and append new product elements
    products.forEach(product => {
        var productItem = createProductItem(product);
        searchPopupContent.appendChild(productItem);
    });
}

// Function to get the names of liked products
function getLikedProductNames(products) {
    return products.filter(product => product.Liked === true)
                   .map(product => product.Name)
                   .join(', ');
}

// Function to get the names of added-to-cart products
function getAddedToCartProductNames(products) {
    return products.filter(product => product.Added === true)
                   .map(product => product.Name)
                   .join(', ');
}

// Function to get the current time in a formatted string
function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
    const day = String(now.getDate()).padStart(2, '0'); // Add leading zero if needed
    const hours = String(now.getHours()).padStart(2, '0'); // Add leading zero if needed
    const minutes = String(now.getMinutes()).padStart(2, '0'); // Add leading zero if needed
    const seconds = String(now.getSeconds()).padStart(2, '0'); // Add leading zero if needed
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Function to handle sign-up form submission
document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form input values
    const fullName = document.getElementById('signup-fullname').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        // Passwords don't match, display error message
        displayErrorMessage("Passwords do not match!", 'password','rgb(255, 35, 35)');
        return;
    }
    if (password.length < 8) {
        // Passwords don't match, display error message
        displayErrorMessage("Password must be more than 8 characters!", 'password','rgb(255, 35, 35)');
        return;
    }
    if (fullName.length < 8) {
        // Passwords don't match, display error message
        displayErrorMessage("Full name must be more than 8 characters!", 'name','rgb(255, 35, 35)');
        return;
    }
    // Call the functions with the products array
    const likedProductNames = getLikedProductNames(productData);
    const addedToCartProductNames = getAddedToCartProductNames(productData);
    // Construct the user object
    user = {
        fullname: fullName,
        email: email,
        passwrd: password,
        admin: 0, // Default admin value
        likedproducts: likedProductNames,
        addedtocartproducts: addedToCartProductNames,
        lastConnection: getCurrentTime()
    };
    // Send the user data to the server
    fetch('https://oussamarestau.onrender.com/members', {
        method: 'POST', // Specify the method as POST
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to sign up');
        }
        // Success message or redirect to another page
        console.log('User signed up successfully!');
    })
    .catch(error => {
        console.error('Error signing up:', error);
    });
    toggleSignUpPopup();
    // Get the rating value
    var ratingInput = document.querySelector('input[name="rating"]:checked');
    var rating = ratingInput ? ratingInput.value : 0;

    // Get the message value
    var messageInput = document.getElementById('messageInput');
    var message = messageInput.value.trim();

    // Check if inputs are more than 10 characters
    if (message.length >= 10) {
        // If the rating message is more than 10 characters 
        CommentInfo = {
            Name: fullName,
            Email: email,
            Rating: rating,
            Message: message,
            status:'New'
        };
        sendCommentsData(CommentInfo);
    }
    // Redirect to user.html with the full name as a query parameter
    window.location.href = `user.html?email=${encodeURIComponent(email)}`;
});

// Event listener for email input field
document.getElementById('signup-email').addEventListener('input', function() {
    const email = this.value;

    // Check if email already exists in the database
    if (email.trim() !== '' || !email.endsWith('.com')) {
        checkEmailExists(email);
    }
});

// Function to handle login form submission
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form input values
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Send a request to the server to verify the email and password
    fetch('https://oussamarestau.onrender.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json(); // Parse response JSON
    })
    .then(data => {
        // Check if the response contains an error
        if (data.error) {
            // If there's an error, display the error message
            displayErrorMessage(data.error, 'login-password','rgb(255, 35, 35)');
        } else {
            // If there's no error, assume the login was successful
            const user = data.user;
            displayErrorMessage("correct password", 'login-password','rgb(35, 255, 35)');
            // Perform other actions with the user information
            user.likedproducts = mergeProducts(user.likedproducts, getLikedProductNames(productData));
            user.addedtocartproducts = mergeProducts(user.addedtocartproducts, getAddedToCartProductNames(productData));
            user.lastConnection = getCurrentTime();
            updateMemberData(user);
            // Redirect the user to the appropriate page
            if(user.admin === 0){
                window.location.href = `user.html?email=${encodeURIComponent(user.email)}`;
            } else {
                window.location.href = `admin.html?email=${encodeURIComponent(user.email)}`;
            }
        }
    })
    .catch(error => {
        console.error('Error logging in:', error);
        // Password is incorrect, display error message
        displayErrorMessage("Incorrect password", 'login-password','rgb(255, 35, 35)');
        fetch('https://oussamarestau.onrender.com/getUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user information');
            }
            return response.json(); // Parse response JSON
        })
        .then(data => {
            // Handle the user information received from the server
            if (data.error) {
                // User not found or invalid response, handle the situation
                console.error('No user found with the provided email');
                // Proceed with displaying user information or other actions
            } else {
                user = data.user;
            }
        })
        .catch(error => {
            console.error('Error fetching user information:', error);
            // Handle the error, display error message, etc.
        });
        
    });
});

function sendCommentsData(CommentInfo){
    fetch('https://oussamarestau.onrender.com/PublicComments', {
                method: 'POST',
                body: JSON.stringify(CommentInfo),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                showHighPropertyMessages('Message send succesfuly,Bon-a-petit', '#4caf50');
            })
            .catch(error => {
                console.error('Error:', error);
            });
}

// Function to merge existing and new products, avoiding duplicates
function mergeProducts(existingProductsString, newProductsString) {
    // Convert existing products string to an array
    const existingProductsArray = existingProductsString.split(', ').map(product => product.trim());

    // Convert new products string to an array
    const newProductsArray = newProductsString.split(', ').map(product => product.trim());

    // Merge arrays and remove duplicates
    const mergedArray = [...new Set([...existingProductsArray, ...newProductsArray])];

    // Convert merged array back to a string
    const mergedString = mergedArray.join(', ');

    // Remove the trailing comma if present
    if (mergedString.endsWith(',')) {
        return mergedString.slice(0, -1);
    }

    return mergedString;
}

// Event listener for email input field
document.getElementById('login-email').addEventListener('input', function() {
    const email = this.value;
    // Check if email exists
    const password = document.getElementById('login-password');
    const LoginButton = document.querySelector('#loginPopup button[type="submit"]'); // Select the login button correctly
    const existingErrorMessage = document.querySelector('.error-message');
    // Remove any existing error messages
    if (existingErrorMessage) {
        existingErrorMessage.remove();
    }
    // Enable password field and login button
    password.disabled = false;
    LoginButton.disabled = false;

    // Check if the email field is not empty and does not end with ".com"
    if (email.trim() === '' || !email.endsWith('.com')) {
        return; // If empty or does not end with ".com", exit without displaying error message
    }

    // Send a request to the server to check if the email exists
    fetch('https://oussamarestau.onrender.com/checkEmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error checking email');
        }
        return response.json();
    })
    .then(data => {
        // Handle the response from the server
        if (data.exists) {
            // Email exists, display success message or enable other fields
            displayErrorMessage("email found", 'login-email','rgb(35, 255, 35)');
        } else {
            // Email doesn't exist, display error message or disable other fields
            displayErrorMessage("Invalid email", 'login-email', 'rgb(255, 35, 35)');
            // Disable password field and login button
            password.disabled = true ;
            LoginButton.disabled = true ;
        }
    })
    .catch(error => {
        console.error('Error checking email:', error);
    });
});
// Function to check if email exists in the database
function checkEmailExists(email) {  
    // Check if the email exists in the fetched data
    const passwordInput = document.getElementById('signup-password');
    const confirmPassInput = document.getElementById('signup-confirm-password');
    const fullNameInput = document.getElementById('signup-fullname');
    const signUpButton = document.querySelector('#signUpPopup button[type="submit"]'); // Select the sign-up button correctly
    const existingErrorMessage = document.querySelector('.error-message');

    fetch('https://oussamarestau.onrender.com/checkEmail', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error checking email');
        }
        return response.json();
    })
    .then(data => {
        // Handle the response from the server
        if (data.exists) {
            // Email exists, display success message or enable other fields
            displayErrorMessage("Email already exists ! ", 'signup-email','rgb(255, 35, 35)');
            // Disable other form fields
            passwordInput.disabled = true;
            confirmPassInput.disabled = true ;
            fullNameInput.disabled = true;
            signUpButton.disabled = true;
        } else {
            passwordInput.disabled = false;
            confirmPassInput.disabled = false ;
            fullNameInput.disabled = false;
            signUpButton.disabled = false;
            // Remove any existing error messages
            if (existingErrorMessage) {
                existingErrorMessage.remove();
            }
        }
    })
    .catch(error => {
        console.error('Error checking email:', error);
    });
}
// Event listener for the "Check Last Connection" button
document.getElementById('checkLastConnectionBtn').addEventListener('click', function(event) {
    event.preventDefault();
    
    // Get the input date value
    const inputDate = new Date(document.getElementById('date').value);
    
    // Get the user's last connection date (assuming it's stored in a variable called 'lastConnectionDate')
    const lastConnectionDate = new Date(user.lastConnection);
    
    // Calculate the difference in milliseconds between the input date and the last connection date
    const timeDifference = inputDate.getTime() - lastConnectionDate.getTime();
    
    // Calculate the difference in days
    const daysDifference = Math.abs(Math.floor(timeDifference / (1000 * 3600 * 24)));

    // Define the threshold for considering the last connection as recent (e.g., 2 days)
    const thresholdDays = 2;
    
    // Check if the input date is within the threshold days from the last connection date
    if (daysDifference <= thresholdDays) {
        // Show the prompt for setting a new password
        document.getElementById('setNewPasswordPrompt').classList.remove('hidden');
        // Hide the last connection prompt
        document.getElementById('lastConnectionPrompt').classList.add('hidden');
    } else {
        // Show a message indicating that the last connection was too long ago
        displayErrorMessage("Invalid Date ,If you need Assistance ", 'Connection-Date','rgb(255, 35, 35)');
    }
});

document.getElementById('buttonRecovery').addEventListener('click', function(event) {
    event.preventDefault();
    
    // Get the new password and confirm password values
    const newPassword = document.getElementById('Forgot-password').value;
    const confirmPassword = document.getElementById('Forgot-confirm-password').value;
    
    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
        // If passwords don't match, display an error message
        displayErrorMessage("Passwords Do not match !", 'Recovery-password','rgb(255, 35, 35)');
        return; // Stop further execution
    }
    
    // Check if the new password and confirm password match
    if (newPassword.length < 8 ) {
        // If passwords don't match, display an error message
        displayErrorMessage("Passwords must be more than 8 caracters !", 'Recovery-password','rgb(255, 35, 35)');
        return; // Stop further execution
    }
    console.log("user will be modified:", Object.assign({}, user)); // Using Object.assign() to create a copy
    user.passwrd = newPassword;
    console.log("user after modification:", user);

    // Send a request to update the user's password
    updateMemberData(user)
    // If password update is successful, display success message
    showHighPropertyMessages('Password updated successfully. Please log in with your new password.','rgb(35, 255, 35)');
    // Hide the forgot password popup
    toggleForgotPasswordPopup();
    // Show the login popup
    toggleLoginPopup();
});
// Function to update member data on the server
function updateMemberData(userData) {
    fetch('https://oussamarestau.onrender.com/updateMember', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update user data');
        }
        // Handle successful response
        showHighPropertyMessages('User data updated successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error updating user data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to update user data. Please try again later.', '#ff0000');
    });
}

function showHighPropertyMessages(notification,color){
    const message = document.createElement('div');
    message.textContent= notification ;
    message.style.backgroundColor= color ;
    message.classList.add('notification'); // Add the CSS class to the created div

    document.body.appendChild(message); // Append the message to the body of the document
    setInterval(function(){
        message.classList.add('hidden');
    },3000)
}
// Close button event listener for login popup
document.querySelector("#loginPopup .closeButton").addEventListener("click", function(event) {
    toggleLoginPopup();
    event.preventDefault(); // Prevent default form submission
});

// Close button event listener for forgot password popup
document.querySelector("#forgotPasswordPopup .closeButton").addEventListener("click", function(event) {
    toggleForgotPasswordPopup();
    event.preventDefault(); // Prevent default form submission
});

// Close button event listener for sign-up popup
document.querySelector("#signUpPopup .closeButton").addEventListener("click", function(event) {
    toggleSignUpPopup();
    event.preventDefault(); // Prevent default form submission
});

// Close button event listener for sign-up popup
document.querySelector("#searchPopup .closeButton").addEventListener("click", function(event) {
    toggleSearchPopup();
});

// Close button functionality for the SingleProductPopup
document.querySelector('#SingleProductPopup .closeButton').addEventListener('click', function() {
    toggleSingleProductPopup();
});

// Close button event listener for liked products popup
document.querySelector("#likedProductsPopup .closeButton").addEventListener("click", function(event) {
    toggleLikedProductsPopup();
    event.preventDefault(); // Prevent default form submission
    updateMainPage(productData); // Update the main page like buttons when closing the liked products popup
});

// Close button event listener for FAQ popup
document.querySelector("#faqPopup .closeButton").addEventListener("click", function(event) {
    toggleFAQPopup();
    // Clear the answer section
    faqAnswer.textContent = '';

    // Hide the return button and answer section
    returnButton.style.display = 'none';
    faqAnswerSection.style.display = 'none';

    // Show all questions
    document.querySelectorAll('.faq-item').forEach(item => {
        item.style.display = 'block';
    });
});

// Close button event listener for Contact popup
document.querySelector("#contactPopup .closeButton").addEventListener("click", function(event) {
    toggleContactPopup();
    event.preventDefault(); // Prevent default form submission
});

// Close button event listener for My Cart popup
document.querySelector("#cartPopup .closeButton").addEventListener("click", function(event) {
    toggleCartPopup();
    event.preventDefault(); // Prevent default form submission
    updateMainPage(productData); // Update the main page like buttons when closing the liked products popup
});
document.querySelector("#hidden-content .closeButton").addEventListener("click", function(event) {
    toggleMenu();
    event.preventDefault(); // Prevent default form submission
});

function populateProductGrids() {
    // Clear existing product grids
    clearProductGrids();
    // Regenerate product grids
    generateProductGrids(productData);
}

// Update main page
function updateMainPage(productData) {
    clearLikedProducts(); // Clear liked products from the popup
    clearProductGrids(); // Clear existing product grids
    generateCategories(productData); // Generate category links
    generateProductGrids(productData);
}

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    
    // Get the rating value
    var ratingInput = document.querySelector('input[name="rating"]:checked');
    var rating = ratingInput ? ratingInput.value : null;

    // Get the message value
    var messageInput = document.getElementById('messageInput');
    var message = messageInput.value.trim();

    // Check if inputs are empty or message length is less than 10 characters
    if ((rating === null && message.trim() === '') || message.length < 10) {
        showHighPropertyMessages('Try again with a valid message more than 10 characters', '#e81d1a');
        return;
    }
    // If inputs are filled, show the login or signup popup
    toggleConfirmLoginSignupPopup();
});
// Toggle sign-up popup
function toggleConfirmLoginSignupPopup() {
    var ConfirmLoginSignupPopup = document.getElementById("ConfirmLoginSignupPopup");
    var isHidden = ConfirmLoginSignupPopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); // Create overlay when the popup is shown
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden
    }
}

function toggleMenu() {
    var hiddenContent = document.getElementById("hidden-content");
    var isHidden = hiddenContent.classList.toggle('hidden');
    if (!isHidden) {
        // Add click event listener to the body
        document.body.addEventListener('click', function(event) {
            // Check if the click target is not within the hidden content
            if (hiddenContent.contains(event.target)) {
                hiddenContent.classList.add('hidden'); // Hide the hidden content
            }
        });
    }
}
function toggleSearch() {
    var hiddenContent = document.getElementById("hidden-search");
    var isHidden = hiddenContent.classList.toggle('hidden');
    var searchButton = hiddenContent.querySelector('.searsh-product')
    if (!isHidden) {
        // Add click event listener to the body
        document.body.addEventListener('click', function(event) {
            // Check if the click target is not within the hidden content
            if (searchButton === event.target ) {
                hiddenContent.classList.add('hidden'); // Hide the hidden content
            }
        });
    }
}
window.addEventListener('scroll', function() {
    var hiddenContent = document.getElementById("hidden-search");
    hiddenContent.classList.add('hidden');
});

// Function to handle Search form submission
document.getElementById('hidden-search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form input values
    const searchInput = document.getElementById('hidden-search-String').value.trim().toLowerCase();


    // Check if Search is not clear
    if (searchInput.length < 2) {
        showHighPropertyMessages('There is Nothing to search', 'rgb(255, 35, 35)');
        document.getElementById('search-String').value='';
        document.getElementById('search-String').focus();
        return;
    }

    // Filter products based on search input
    const searchedProducts = productData.filter(product => {
        return (
            product.Name.toLowerCase().includes(searchInput) || 
            product.Description.toLowerCase().includes(searchInput) ||
            product.Category.toLowerCase().includes(searchInput)
        );
    });
    if (searchedProducts.length === 0) {
        showHighPropertyMessages('No product found with this name or description', 'rgb(255, 35, 35)');
        document.getElementById('hidden-search-String').value='';
        document.getElementById('hidden-search-String').focus();
        return;
    }
    // Display searched products
    document.getElementById('hidden-search-String').value='';
    var hiddenContent = document.getElementById("hidden-search");
    hiddenContent.classList.add('hidden');
    toggleSearchPopup(searchedProducts);
});