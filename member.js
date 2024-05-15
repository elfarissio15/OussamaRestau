let promotionsData ;
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
// Define global variables and functions
var intervalId;
let productData; // Define a global variable to hold the fetched data
let faqData; // Define a global variable to hold the fetched data
let CommandesData;
let messagesData;

const faqSection = document.querySelector('.faq-section');
const faqAnswerSection = document.querySelector('.faq-answer-section');
const faqAnswer = document.querySelector('.faq-answer');
const returnButton = document.querySelector('.returnButton');

// Function to get the query parameter from the URL
function getQueryParam(parameterName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}
// Get the email from the query parameter
let userEmail ;
let userData;

// Function to find a user by email
function findUserByEmail(email) {
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
            userData = data.user;
            console.log('User information:', userData);
            const fullName = userData.fullname;
            // Display user's name in the "My Account" section
            displayUserName(fullName);
            hideAccountMenu();
            hideHelpMenu();
            toggleThemeDark();
            returnButton.style.display = 'none';
            faqAnswerSection.style.display = 'none';
            // Fetch and process product data after user data is fetched
            fetchAndProcessProductData();
            fetchPromotionsData();
            fetchMessagesData();
        }
    })
    .catch(error => {
        console.error('Error fetching user information:', error);
        // Handle the error, display error message, etc.
    });
}

// Function to display the user's name in the "My Account" section
function displayUserName(fullName) {
    const accountSection = document.getElementById('accountSection');
    accountSection.innerHTML = `
        <div class="account" onclick="toggleAccountMenu()">👤 <h6><a>${fullName}</a></h6></div>
        <div class="account-menu" id="accountMenu">
            <button type="button" class="ViewProfile" onclick="toggleViewProfilePopup()">View Profile</button>
            <button type="button" class="liked" onclick="toggleLikedProductsPopup()">Liked Products</button>
            <button type="button" class="logout" onclick="togglelogOutPopup()">Logout</button>
        </div>
        <div class="help" onclick="toggleHelpMenu()">ℹ️<h6><a>Help</a></h6></div>
        <div class="help-menu" id="helpMenu">
            <button type="button" class="FAQ" onclick="toggleFAQPopup()">FAQ</button>
            <button type="button" class="Contact" onclick="toggleContactPopup()">Contact</button>
            <!-- Add more help options if needed -->
        </div>
        <div class="cart" onclick="toggleCartPopup()">🏬<h6><a>My Cart</a></h6></div>
    `;
}

// Theme toggling function
function toggleThemeDark() {
    var body = document.body;
    body.classList.toggle("dark-theme");
}

// Initialization function
window.onload = function () {
    // Get the email from the query parameter
    userEmail = getQueryParam('email');
    // Find the checkbox element
    var darkModeCheckbox = document.querySelector('.header input[type="checkbox"]');
    // Check the checkbox
    darkModeCheckbox.checked = true;
    fetchCommandesData();
    fetchFAQData();
    findUserByEmail(userEmail);
};

// Function to fetch and process product data
function fetchAndProcessProductData() {
    fetchProductData()
    .then(data => {
        // Check user products against liked and added to cart products
        productData = checkUserProducts(data, userData.likedproducts.split(', '), userData.addedtocartproducts.split(', '));
        // Generate categories, product grids, and calculate cart total
        generateCategories(productData);
        generateProductGrids(productData);
        priceCart();
        console.log("fetched products successfully");
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
// Function to fetch product data
function fetchProductData() {
    return fetch('https://oussamarestau.onrender.com/products')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
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


function checkUserProducts(productsData, likedProducts, addedToCartProducts) {
    // Iterate over each product in the product data
    productsData.forEach(product => {
        const productName = product.Name; // Replace 'name' with the correct property name

        // Check if the product is liked or added to cart by the user
        const isLiked = isProductLiked(productName, likedProducts);
        const isAddedToCart = isProductAddedToCart(productName, addedToCartProducts);

        product.Added = isAddedToCart ;
        product.Liked = isLiked ;
    });

    return productsData;
}
// Function to check if a product is liked by the user
function isProductLiked(productName, likedProducts) {
    return (likedProducts.includes(productName))? true : false;
}

// Function to check if a product is added to cart by the user
function isProductAddedToCart(productName, addedToCartProducts) {
    return (addedToCartProducts.includes(productName))? true : false;
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

// Function to calculate cart total
function priceCart() {
    const cartTotalSpan = document.getElementById('cartTotal');
    cartTotal = calculateCartTotal();
    // Update cartTotal span with the calculated total
    cartTotalSpan.textContent = cartTotal > 0 ? cartTotal.toFixed(2) : '0';
}


// Function to calculate total cart price
function calculateCartTotal() {
    let cartTotal = 0;
    productData.forEach(product => {
        if (product.Added) {
            cartTotal += product.Price;
        }
    });
    return cartTotal;
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
    updateUserData(productData);
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
    priceCart();
    updateMainPageButton(productName, category);
    updateUserData(productData);
    displayCartItems(); // Display added products in the popup
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
// Function to update user data on the server
function updateUserData(productData) {
    
    const likedProductNames = getLikedProductNames(productData);
    const addedToCartProductNames = getAddedToCartProductNames(productData);

    userData.likedproducts= likedProductNames;
    userData.addedtocartproducts= addedToCartProductNames;
    
    updateMemberData(userData);
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

// Toggle ViewProfile popup
function toggleViewProfilePopup() {
    var ViewProfilePopup = document.getElementById("ViewProfilePopup");
    var isHidden = ViewProfilePopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); // Create overlay when the popup is shown
        showUserData(userData);
        showProfileDataSection();
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden
        ViewProfilePopup.querySelectorAll("input[type='text'],input[type='email'], input[type='password']").forEach(function(input) {
            input.value = "";
        });
        // Remove any existing error messages
        const existingErrorMessage = document.querySelector('.error-message');
        if (existingErrorMessage) {
            existingErrorMessage.remove();
        }
    }
}
// Toggle sign-up popup
function togglelogOutPopup() {
    var logOutPopup = document.getElementById("logOutPopup");
    var isHidden = logOutPopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); // Create overlay when the popup is shown
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden
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
function togglePayingMethodPopup(){
    var payingmethodpopup = document.getElementById("paymentMethodsPopup");
    var isHidden = payingmethodpopup.classList.toggle("hidden");
    // Clear the selection of all radio buttons inside the popup
    var paymentMethodInputs = payingmethodpopup.querySelectorAll('input[type="radio"]');
    paymentMethodInputs.forEach(function(input) {
        if(input.checked === true){
            input.checked = false;
        }
    });
    if (!isHidden) {
        toggleOverlay(); // Create overlay when the popup is shown
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden
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
// Close button event listener for login popup
document.querySelector("#ViewProfilePopup .closeButton").addEventListener("click", function(event) {
    toggleViewProfilePopup();
    event.preventDefault(); // Prevent default form submission
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

function confirmLogout() {
    // Redirect to home.html
    userData.lastConnection =  getCurrentTime();
    updateMemberData(userData);
    window.location.href = "home.html";
}
// Function to handle window unload event
window.addEventListener('beforeunload', function(event) {
    // Send update request to server
    userData.lastConnection =  getCurrentTime();
    updateMemberData(userData);
});

function VerifyBeforeBuy(){
    // Check if there are any items in the cart
    const cartItems = document.querySelectorAll('#MyCartGrid .product-item');
    if (cartItems.length > 0) {
        // If there are items, proceed with the purchase
        toggleCartPopup();
        togglePayingMethodPopup();
    } else {
        // If there are no items, show an error message
        showHighPropertyMessages('Your cart is empty. Please add items before proceeding.','#ff0000');
    }
}
function VerifyAllBuys(){
    // Assuming userData contains information about the currently logged-in user
    const userId = userData.memberid;

    // Filter CommandesData to get commands with the same user ID
    const userCommands = CommandesData.filter(Commande => Commande.user_id === userId);

    if(userCommands.length === 0){
        // If there are no items, show an error message
        showHighPropertyMessages('Your Payment History is empty. Please Buy something to get access to this place.','#ff0000');
    }else{
        populateCommandHistoryTable(userCommands)
        toggleCartPopup();
        togglePaymentHistoryPopup();
    }
}

function populateCommandHistoryTable(userCommands) {
    // Assuming you have a container element for the command history table
    const commandHistoryTable = document.getElementById('commandHistoryTable');

    // Clear any existing content in the table
    commandHistoryTable.innerHTML = '';

    // Create a table header
    const tableHeader = document.createElement('tr');
    tableHeader.innerHTML = `
        <th>Product</th>
        <th>Time</th>
        <th>Price</th>
        <th>Address</th>
        <th>Phone Number</th>
        <th>Status</th>
        <th>Reclamations</th> 
    `;
    commandHistoryTable.appendChild(tableHeader);

    // Populate the table with user's command history
    userCommands.forEach(Commande => {
        const tableRow = document.createElement('tr');
        const orderDate = new Date(Commande.order_time);
        const formattedOrderTime = orderDate.toLocaleString(); // Format the date and time
        const currentDate = new Date();
        const differenceInDays = Math.ceil((currentDate - orderDate) / (1000 * 60 * 60 * 24));
        
        tableRow.innerHTML = `
            <td>${Commande.products}</td>
            <td>${formattedOrderTime}</td>
            <td>${Commande.price}</td>
            <td>${Commande.addresse}</td>
            <td>${Commande.phone_number}</td>
            <td>${Commande.status}</td>
            <td>${differenceInDays < 2 ? '<button class="reclamationButton">Reclamation</button>' : ''}</td>
        `;
        commandHistoryTable.appendChild(tableRow);
        // Add event listener to the button if it exists
        if (differenceInDays < 2) {
            const reclamationButton = tableRow.querySelector('.reclamationButton');
            reclamationButton.addEventListener('click', () => {
                togglePaymentHistoryPopup();

                toggleReclamationPopup(Commande,formattedOrderTime);
            });
        }
    });
}

let selectedCommande ;

function togglePaymentHistoryPopup(){
    var PaymentHistoryPopup = document.getElementById("paymentHistoryPopup");
    var isHidden = PaymentHistoryPopup.classList.toggle("hidden");

    if (!isHidden) {
        toggleOverlay(); // Create overlay when the popup is shown
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden
    }
}
function toggleReclamationPopup(commandInfo,formattedOrderTime){
    var ReclamationPopup = document.getElementById('ReclamationsPopup');
    var isHidden = ReclamationPopup.classList.toggle("hidden");
    
    var SingleComandeTable = ReclamationPopup.querySelector("#SingleComandeTable");
    if (!isHidden) {
        toggleOverlay(); // Create overlay when the popup is shown
        SingleComandeTable.innerHTML = `
        <table>
            <tr>
                <th>Product</th>
                <th>Time</th>
                <th>Price</th>
                <th>Address</th>
                <th>Phone Number</th>
                <th>Status</th>
            </tr>
            <tr>
                <td>${commandInfo.products}</td>
                <td>${formattedOrderTime}</td>
                <td>${commandInfo.price}</td>
                <td>${commandInfo.addresse}</td>
                <td>${commandInfo.phone_number}</td>
                <td>${commandInfo.status}</td>
            </tr>
        </table>
    `;
    selectedCommande = commandInfo ;
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden*
        SingleComandeTable.innerHTML = ``;
        // Clear the selection of all radio buttons inside the popup
        var ReclamationsInputs = ReclamationPopup.querySelectorAll('input[type="text"]');
        ReclamationsInputs.forEach(function(input) {
                input.value = '';
        });
    }
}
// Fetch Commandes data from the server
function fetchCommandesData() {
    fetch('https://oussamarestau.onrender.com/Commandes')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        CommandesData = data;
        console.log('fetched Commandes data Succesfuly')
    })
    .catch(error => {
        console.error('Error fetching Commandes data:', error);
    });
}

document.querySelector('#paymentMethodsPopup .confirmButton').addEventListener('click', function(event) {
    // Prevent form submission
    event.preventDefault();

    // Check if any radio button is checked
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    let methodSelected = false;
    let selectedMethodId = '';
    paymentMethods.forEach(method => {
        if (method.checked) {
            methodSelected = true;
            selectedMethodId = method.id;
        }
    });

    // If a method is selected, show the corresponding popup
    if (methodSelected) {
        // Show the corresponding payment popup based on the selected method
        switch (selectedMethodId) {
            case 'payAfterTake':
                togglePayingMethodPopup();
                togglepayAfterTakePopup();
                break;
            case 'paypal':
                togglePayingMethodPopup();
                togglePayPalPopup();
                break;
            case 'VisaCard':
                togglePayingMethodPopup();
                toggleVisaPopup();
                break;
            // Add cases for other payment methods if needed
        }
    } else {
        // If not, show an error message
        alert('Please select a payment method!');
    }
});

// Function to show the payAfterTake payment popup
function togglepayAfterTakePopup() {
    var payAfterTakePopup = document.getElementById("payAfterTakePopup");
    var isHidden = payAfterTakePopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); // Create overlay when the popup is shown
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden
        payAfterTakePopup.querySelectorAll('input[type="text"],input[type="number"]').forEach(function(input) {
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


// Function to show the PayPal payment popup
function togglePayPalPopup() {
    var paypalPopup = document.getElementById("paypalPopup");
    var isHidden = paypalPopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); // Create overlay when the popup is shown
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden
        paypalPopup.querySelectorAll('input[type="text"],input[type="password"],input[type="email"],input[type="number"]').forEach(function(input) {
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

// Function to show the Visa payment popup
function toggleVisaPopup() {
    var VisaPopup = document.getElementById("VisaPopup");
    var isHidden = VisaPopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); // Create overlay when the popup is shown
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden
        VisaPopup.querySelectorAll('input[type="text"],input[type="number"],input[type="date"]').forEach(function(input) {
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
// Function to show user data in the view profile popup
function showUserData(userData) {
    const fullNameSpan = document.getElementById('fullName');
    const emailSpan = document.getElementById('email');

    // Check if userData is not null and contains the necessary fields
    if (userData && userData.fullname && userData.email) {
        fullNameSpan.textContent = userData.fullname;
        emailSpan.textContent = userData.email;
    }
}

// Function to display error message
function displayErrorMessage(message, type,color) {
    const errorMessage = document.createElement('div');
    errorMessage.textContent = message;
    errorMessage.style.color = color;
    errorMessage.style.fontWeight = "bold"; // Make text bold
    errorMessage.classList.add("error-message");
    errorMessage.style.animation = "slideIn 0.3s ease forwards";
    // Remove any existing error messages
    const existingErrorMessage = document.querySelector('.error-message');
    if (existingErrorMessage) {
        existingErrorMessage.remove();
    }

    // Insert error message after appropriate input field
    let inputField;
    if (type === 'Modification-email') {
        inputField = document.getElementById('New-email');
        
    }else if (type === 'exist-password'){
        inputField = document.getElementById('exist-password');
    }else if (type === 'Address-PAT'){
        inputField = document.getElementById('addressPAT');
    }else if (type === 'Email-Paypal'){
        inputField = document.getElementById('paypalEmail');
    }else if (type === 'Address-Paypal'){
        inputField = document.getElementById('addressPayPal');
    }else if (type === 'Phone-Paypal'){
        inputField = document.getElementById('phoneNumberPaypal');
    }else if (type === 'password-Paypal'){
        inputField = document.getElementById('paypalPassword');
    }else if (type === 'NameCard-Visa'){
        inputField = document.getElementById('cardholderNameVisa');
    }else if (type === 'NumberCard-Visa'){
        inputField = document.getElementById('cardNumberVisa');
    }else if (type === 'Date-Visa'){
        inputField = document.getElementById('expirationDateVisa');
    }else if (type === 'CCV-Visa'){
        inputField = document.getElementById('cvvVisa');
    }else if (type === 'Address-Visa'){
        inputField = document.getElementById('addressVisa');
    }else if (type === 'Phone-Visa'){
        inputField = document.getElementById('phoneNumberVisa');
    }else if (type === 'Phone-PAT'){
        inputField = document.getElementById('phoneNumberPAT');
    }else if (type === 'Reclamation'){
        inputField = document.getElementById('Reclamation');
    }else if (type === 'New-password'){
        inputField = document.getElementById('Confirm-New-password');
        Newpassword = document.getElementById('New-password');
        confirmNewPassword = document.getElementById('Confirm-New-password');
        Newpassword.value ='';
        confirmNewPassword.value ='';
        Newpassword.focus();
    }else if (type === 'Modification-name'){
        inputField = document.getElementById('New-name');
    }
    if (inputField) {
        inputField.parentNode.insertBefore(errorMessage, inputField.nextSibling);
    }
}

// Event listener for reclamation form field
document.getElementById('Reclamation-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    
    const Reclamationmessage = document.getElementById('Reclamation').value;

    const existingErrorMessage = document.querySelector('.error-message');
    // Remove any existing error messages
    if (existingErrorMessage) {
        existingErrorMessage.remove();
    }

   
    // Check if the name field is not empty and has at least 6 characters
    if (Reclamationmessage.trim() === '' || Reclamationmessage.length < 10) {
        displayErrorMessage("Reclamation must be at least 10 characters long", 'Reclamation','rgb(255, 35, 35)');
        return; // If empty or less than 6 characters, exit with displaying error message
    }

    Reclamation = {
        commandID : selectedCommande.id,
        userID : userData.memberid,
        address : selectedCommande.addresse,
        phoneNumber : selectedCommande.phone_number,
        reclamation_msg	: Reclamationmessage,
        status : 'New'
    }
    sendReclamationData(Reclamation);
    toggleReclamationPopup();
    showHighPropertyMessages("Valid Reclamation,sended succesfly ,stay tuned for any news in your inbox",'#008d15');
});

function sendReclamationData(Reclamation){
    fetch('https://oussamarestau.onrender.com/Reclamations', {
        method: 'POST', // Specify the method as POST
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Reclamation)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to Reclame');
        }
        // Success message or redirect to another page
        console.log('Reclamation Sended successfully!');
    })
    .catch(error => {
        console.error('Error Reclaming:', error);
    });
}

// Event listener for email form field
document.getElementById('modification-email-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    
    const email = document.getElementById('New-email').value;

    // Check if email exists
    const existingErrorMessage = document.querySelector('.error-message');
    // Remove any existing error messages
    if (existingErrorMessage) {
        existingErrorMessage.remove();
    }

    // Check if the email field is not empty and ends with ".com"
    if (email.trim() === '' || !email.endsWith('.com')) {
        displayErrorMessage("Invalid Form of Email", 'Modification-email','rgb(255, 35, 35)');
        return; // If empty or does not end with ".com", exit with displaying error message
    }

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
            displayErrorMessage("Already Existed Email", 'Modification-email','rgb(255, 35, 35)');
            return;
        } else {
            // Email doesn't exist, means that this new email is unique
            displayErrorMessage("Valid New Email", 'Modification-email','rgb(35, 255, 35)');
            userData.email = email ;
            updateMemberData(userData);
            window.location.href = `user.html?email=${encodeURIComponent(userData.email)}`;
        }
    })
    .catch(error => {
        console.error('Error checking email:', error);
    });
});

// Event listener for email form field
document.getElementById('modification-name-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    
    const Name = document.getElementById('New-name').value;

    // Check if email exists
    const existingErrorMessage = document.querySelector('.error-message');
    // Remove any existing error messages
    if (existingErrorMessage) {
        existingErrorMessage.remove();
    }

   
    // Check if the name field is not empty and has at least 6 characters
    if (Name.trim() === '' || Name.length < 6) {
        displayErrorMessage("Name must be at least 6 characters long", 'Modification-name','rgb(255, 35, 35)');
        return; // If empty or less than 6 characters, exit with displaying error message
    }

    displayErrorMessage("Valid New Name", 'Modification-name','rgb(35, 255, 35)');
    userData.fullName = Name ;

    updateMemberData(userData);
    window.location.href = `user.html?email=${encodeURIComponent(userData.email)}`;
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

// Event listener for existing password input field
document.getElementById('exist-password').addEventListener('input', function() {
    const existingPassword = this.value;
    const ConfirmButton = document.querySelector('#ViewProfilePopup .modifications-section .modificationPassword button[type="submit"]'); // Select the modification button correctly
    const existingErrorMessage = document.querySelector('.error-message');
    // Remove any existing error messages
    if (existingErrorMessage) {
        existingErrorMessage.remove();
    }
    // Enable password field and login button
    ConfirmButton.disabled = false;
    // Check if the email field is not empty and ends with ".com"
    if (existingPassword.trim() === '' ||  existingPassword.length < userData.passwrd.length) {
        return; // If empty , exit without displaying error message
    }
    // Check if existing password matches the user's password
    if (existingPassword === userData.passwrd) {
        // Existing password is valid, enable other input fields
        document.getElementById('New-password').disabled = false;
        document.getElementById('Confirm-New-password').disabled = false;
        ConfirmButton.disabled = false;
        displayErrorMessage("Valid existing password", 'exist-password','rgb(35, 255, 35)');
    } else {
        // Existing password is invalid, disable all input fields and display error message
        document.getElementById('New-password').disabled = true;
        document.getElementById('Confirm-New-password').disabled = true;
        displayErrorMessage("Invalid existing password", 'exist-password','rgb(255, 35, 35)');
    }
});
// Function to handle sign-up form submission
document.getElementById('modification-password-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const Newpassword = document.getElementById('New-password').value;
    const confirmNewPassword = document.getElementById('Confirm-New-password').value;

    // Check if passwords match
    if (Newpassword !== confirmNewPassword ) {
        // Passwords don't match, display error message
        displayErrorMessage("Passwords do not match!", 'New-password','rgb(255, 35, 35)');
        return;
    }
    if(Newpassword.length < 8){
        // Passwords small, display error message
        displayErrorMessage("Passwords must be more than 8 characters!", 'New-password','rgb(255, 35, 35)');
        return;
    }
    displayErrorMessage("Passwords match!", 'New-password','rgb(35, 255, 35)');

    //update password
    userData.passwrd = Newpassword ;

    updateMemberData(userData);
    window.location.href = `user.html?email=${encodeURIComponent(userData.email)}`;
});

// Function to show the profile data section and clear all input fields
function showProfileDataSection() {
    const modificationSection = document.querySelector('.modifications-section');
    const inputs = modificationSection.querySelectorAll('input'); // Select all input fields
    inputs.forEach(input => {
        input.removeAttribute('required'); // Remove the required attribute
        input.value = ''; // Clear the value
    });
    
    document.querySelector('.Profile-section').style.display ='block';
    modificationSection.querySelector('.modificationName').style.display = 'none';
    modificationSection.querySelector('.modificationEmail').style.display = 'none';
    modificationSection.querySelector('.modificationPassword').style.display = 'none';
}

// Function to show the change name section
function showChangeNameSection() {
    const modificationSection = document.querySelector('.modifications-section');
    document.querySelector('.Profile-section').style.display ='none';
    modificationSection.querySelector('.modificationName input').setAttribute('required', 'true');
    modificationSection.querySelector('.modificationEmail input').removeAttribute('required');
    modificationSection.querySelector('.modificationPassword input').removeAttribute('required');
    modificationSection.querySelector('.modificationName').style.display = 'block';
    modificationSection.querySelector('.modificationEmail').style.display = 'none';
    modificationSection.querySelector('.modificationPassword').style.display = 'none';
}

// Function to show the change email section
function showChangeEmailSection() {
    const modificationSection = document.querySelector('.modifications-section');
    document.querySelector('.Profile-section').style.display ='none';
    modificationSection.querySelector('.modificationName input').removeAttribute('required');
    modificationSection.querySelector('.modificationEmail input').setAttribute('required', 'true');
    modificationSection.querySelector('.modificationPassword input').removeAttribute('required');
    modificationSection.querySelector('.modificationName').style.display = 'none';
    modificationSection.querySelector('.modificationEmail').style.display = 'block';
    modificationSection.querySelector('.modificationPassword').style.display = 'none';
}

// Function to show the change password section
function showChangePasswordSection() {
    const modificationSection = document.querySelector('.modifications-section');
    document.querySelector('.Profile-section').style.display ='none';
    modificationSection.querySelector('.modificationName input').removeAttribute('required');
    modificationSection.querySelector('.modificationEmail input').removeAttribute('required');
    modificationSection.querySelector('.modificationPassword input').setAttribute('required', 'true');
    modificationSection.querySelector('.modificationName').style.display = 'none';
    modificationSection.querySelector('.modificationEmail').style.display = 'none';
    modificationSection.querySelector('.modificationPassword').style.display = 'block';
}


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
// Close button event listener for My Cart popup
document.querySelector("#payAfterTakePopup .closeButton").addEventListener("click", function(event) {
    togglepayAfterTakePopup();
    event.preventDefault(); // Prevent default form submission
});

document.querySelector("#paymentHistoryPopup .closeButton").addEventListener("click", function(event) {
    togglePaymentHistoryPopup();
    event.preventDefault(); // Prevent default form submission
});

document.querySelector("#ReclamationsPopup .closeButton").addEventListener("click", function(event) {
    toggleReclamationPopup();
    event.preventDefault(); // Prevent default form submission
});


// Close button event listener for My Cart popup
document.querySelector("#paypalPopup .closeButton").addEventListener("click", function(event) {
    togglePayPalPopup();
    event.preventDefault(); // Prevent default form submission
});

// Close button event listener for My Cart popup
document.querySelector("#VisaPopup .closeButton").addEventListener("click", function(event) {
    toggleVisaPopup();
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

// Function to send Commande data to server
function sendCommandeData(Commande) {
    fetch('https://oussamarestau.onrender.com/Commandes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Commande)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add commande data');
        }
        // Handle successful response
        showHighPropertyMessages('Commande data added successfully', '#008d15');

        // Un-add products from the cart
        productData.forEach(product => {
            if (product.Added === true) {
                product.Added = false;
                updateMainPageButton(product.Name, product.Category)
            }
        });
        priceCart();
        updateUserData(productData);
        fetchCommandesData();
        generateAndDownloadPDF(Commande);
    })
    .catch(error => {
        console.error('Error adding commande data:', error);
        showHighPropertyMessages('Failed to add commande data. Please try again later.', '#ff0000');
    });
}

// Function to handle the click event of the "Confirm" button in the PayPal payment popup
document.getElementById('paypal-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const billingAddressPayPal = document.getElementById('addressPayPal').value.trim();
    const phoneNumber = document.getElementById('phoneNumberPaypal').value.trim();
 
    let cartTotal = calculateCartTotal();
    const CurrentTime = getCurrentTime() ;

    Commande = {
        user_id	: userData.memberid,
        user_name : userData.fullname,
        user_email : userData.email,
        products : userData.addedtocartproducts,
        payment_method : 'paypal',
        price : cartTotal,
        addresse : billingAddressPayPal,
        phone_number : phoneNumber,
        order_time : CurrentTime ,
        status : 'Under traitement'
    }

    userData.pointsfidele += cartTotal/10 * 2;
    // Send Commande data to server
    sendCommandeData(Commande);
    togglePayPalPopup();
});
// Function to handle the click event of the "Confirm" button in the Visa payment popup
document.getElementById('Visa-popup').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const billingAddressVisa = document.getElementById('addressVisa').value.trim();
    const phoneNumber = document.getElementById('phoneNumberVisa').value.trim();

    let cartTotal = calculateCartTotal();
    const CurrentTime = getCurrentTime();

    Commande = {
        user_id	: userData.memberid,
        user_name : userData.fullname,
        user_email : userData.email,
        products : userData.addedtocartproducts,
        payment_method : 'Visa',
        price : cartTotal,
        order_time : CurrentTime ,
        addresse : billingAddressVisa,
        phone_number : phoneNumber,
        status : 'Under traitement'
    }
    userData.pointsfidele += cartTotal/10 * 2;

    // Send Commande data to server
    sendCommandeData(Commande);
    toggleVisaPopup();
});


// Function to handle the click event of the "Confirm" button in the payAfterTake payment popup
document.getElementById('pat-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Retrieve input values
    const AddressPAT = document.getElementById('addressPAT').value.trim();
    const phoneNumberPAT = document.getElementById('phoneNumberPAT').value.trim();

    let cartTotal = calculateCartTotal();
    const CurrentTime = getCurrentTime() ;

    Commande = {
        user_id	: userData.memberid,
        user_name : userData.fullname,
        user_email : userData.email,
        products : userData.addedtocartproducts,
        payment_method : 'Pay After Take',
        price : cartTotal,
        addresse : AddressPAT,
        phone_number : phoneNumberPAT,
        order_time : CurrentTime ,
        status : 'Under traitement'
    }

    userData.pointsfidele += cartTotal/10 * 2;
    // Send Commande data to server
    sendCommandeData(Commande);
    togglepayAfterTakePopup();

});
// Function to generate PDF and download it
function generateAndDownloadPDF(Commande) {
    fetch('https://oussamarestau.onrender.com/generate-pdf', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Commande)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to generate PDF');
        }
        // Return the response to be handled in the next `.then()`
        return response.blob();
    })
    .then(blob => {
        // Create a URL for the blob
        const blobUrl = URL.createObjectURL(blob);
        // Create a link element to trigger the download
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = 'receipt.pdf';
        // Append the link to the document body and click it
        document.body.appendChild(a);
        a.click();
        // Remove the link from the document body after the download is initiated
        document.body.removeChild(a);
    })
    .catch(error => {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again later.');
    });
}

// Select input fields Visa
const cardholderNameVisaInput = document.getElementById('cardholderNameVisa');
const cardNumberVisaInput = document.getElementById('cardNumberVisa');
const expirationDateVisaInput = document.getElementById('expirationDateVisa');
const cvvVisaInput = document.getElementById('cvvVisa');
const billingAddressVisaInput = document.getElementById('addressVisa');
const phoneNumberVisaInput = document.getElementById('phoneNumberVisa');
const ConfirmButtonVisaInput = document.querySelector('#VisaPopup .confirmButton');
// select input fields paypal
const paypalEmailInput = document.getElementById('paypalEmail');
const paypalPasswordInput = document.getElementById('paypalPassword');
const billingAddressPayPalInput = document.getElementById('addressPayPal');
const phoneNumberPaypalInput = document.getElementById('phoneNumberPaypal');
const ConfirmButtonPaypalInput = document.querySelector('#paypalPopup .confirmButton');
// select input fields pay after take 
const AddressPATInput = document.getElementById('addressPAT');
const phoneNumberPATInput = document.getElementById('phoneNumberPAT');
const ConfirmButtonPATInput = document.querySelector('#payAfterTakePopup .confirmButton');
// Add event listener for input fields Visa
const visaInputs = [cardholderNameVisaInput, cardNumberVisaInput, expirationDateVisaInput, cvvVisaInput, billingAddressVisaInput, phoneNumberVisaInput,ConfirmButtonVisaInput];
visaInputs.forEach(input => {
    input.addEventListener('input', validateVisaInputs);
});

// Add event listener for input fields Paypal
const PaypalInputs = [paypalEmailInput, paypalPasswordInput, billingAddressPayPalInput, phoneNumberPaypalInput,ConfirmButtonPaypalInput];
PaypalInputs.forEach(input => {
    input.addEventListener('input', validatePaypalInputs);
});

// Add event listener for input fields pay after take 
const PayAfterTakeInputs = [AddressPATInput, phoneNumberPATInput, ConfirmButtonPATInput];
PayAfterTakeInputs.forEach(input => {
    input.addEventListener('input', validatePATInputs);
});

// Validation function for all Visa input fields
function validateVisaInputs() {
    const cardholderNameVisa = cardholderNameVisaInput.value.trim();
    const cardNumberVisa = cardNumberVisaInput.value.trim();
    const expirationDateVisa = expirationDateVisaInput.value.trim();
    const cvvVisa = cvvVisaInput.value.trim();
    const billingAddressVisa = billingAddressVisaInput.value.trim();
    const phoneNumber = phoneNumberVisaInput.value.trim();

    // Remove any existing error messages and enable all input fields
    const existingErrorMessage = document.querySelector('.error-message');
    if (existingErrorMessage) {
        existingErrorMessage.remove();
    }
    visaInputs.forEach(input => {
        input.removeAttribute('disabled');
    });

    // Validate cardholder name
    if (cardholderNameVisa !== '' && cardholderNameVisa.length < 5) {
        displayErrorMessage('The Card name holder format is not Valid', 'NameCard-Visa', 'rgb(255,35,35)');
        disableVisaInputsExcept(cardholderNameVisaInput);
    }

    // Validate card number
    if (cardNumberVisa !== '' && cardNumberVisa.length !== 16) {
        displayErrorMessage('The Card number format must be 16 digits', 'NumberCard-Visa', 'rgb(255,35,35)');
        disableVisaInputsExcept(cardNumberVisaInput);
    }

    // Validate expiration date
    if (expirationDateVisa !== '' && expirationDateVisa < getCurrentTime()) {
        displayErrorMessage('The expiration Date is already reached', 'Date-Visa', 'rgb(255,35,35)');
        disableVisaInputsExcept(expirationDateVisaInput);
    }

    // Validate CVV
    if (cvvVisa !== '' && cvvVisa.length !== 3) {
        displayErrorMessage('The CVV/CVC code must be 3 digits', 'CCV-Visa', 'rgb(255,35,35)');
        disableVisaInputsExcept(cvvVisaInput);
    }

    // Validate billing address
    if (billingAddressVisa !== '' && billingAddressVisa.length < 15) {
        displayErrorMessage('The address format is too short', 'Address-Visa', 'rgb(255,35,35)');
        disableVisaInputsExcept(billingAddressVisaInput);
    }

    // Validate phone number
    if (phoneNumber !== '' && phoneNumber.length !== 10) {
        displayErrorMessage('The Phone number must be 10 characters', 'Phone-Visa', 'rgb(255,35,35)');
        disableVisaInputsExcept(phoneNumberVisaInput);
    }
}

// Validation function for all Paypal input fields
function validatePaypalInputs() {
    const paypalEmail = paypalEmailInput.value.trim();
    const paypalPassword = paypalPasswordInput.value.trim();
    const billingAddressPayPal = billingAddressPayPalInput.value.trim();
    const phoneNumberPaypal = phoneNumberPaypalInput.value.trim();

    // Remove any existing error messages and enable all input fields
    const existingErrorMessage = document.querySelector('.error-message');
    if (existingErrorMessage) {
        existingErrorMessage.remove();
    }
    PaypalInputs.forEach(input => {
        input.removeAttribute('disabled');
    });
    
    // Validate email 
    if ((paypalEmail !== '' && paypalEmail.length < 3 )|| !paypalEmail.endsWith('.com') ) {
        displayErrorMessage('The Paypal email format is not Valid','Email-Paypal','rgb(255,35,35)');
        disablePaypalInputsExcept(paypalEmailInput);
    }

    // Validate pasword
    if (paypalPassword !== '' && paypalPassword.length < 5) {
        displayErrorMessage('The password need to be seted','password-Paypal','rgb(255,35,35)');
        disablePaypalInputsExcept(paypalPasswordInput);
    }

    // Validate biling address
    if (billingAddressPayPal !== '' && billingAddressPayPal.length < 15 ) {
        displayErrorMessage('The address format is too short','Address-Paypal','rgb(255,35,35)');
        disablePaypalInputsExcept(billingAddressPayPalInput);
    }

    // Validate phone number
    if (phoneNumberPaypal !== '' && phoneNumberPaypal.length !== 10) {
        displayErrorMessage('The Phone number must be 10 caracters','Phone-Paypal','rgb(255,35,35)');
        disablePaypalInputsExcept(phoneNumberPaypalInput);
    }
}

// Validation function for all Pay after take input fields
function validatePATInputs() {
    const AddressPAT = AddressPATInput.value.trim();
    const phoneNumberPAT = phoneNumberPATInput.value.trim();

    // Remove any existing error messages and enable all input fields
    const existingErrorMessage = document.querySelector('.error-message');
    if (existingErrorMessage) {
        existingErrorMessage.remove();
    }
    PayAfterTakeInputs.forEach(input => {
        input.removeAttribute('disabled');
    });

    // Validate address
    if (AddressPAT !== '' && AddressPAT.length < 15 ) {
        displayErrorMessage('The address format is too short','Address-PAT','rgb(255,35,35)');
        disablePATInputsExcept(AddressPATInput);
        return;
    }

    // Validate phone number
    if (phoneNumberPAT !== '' && phoneNumberPAT.length !== 10) {
        displayErrorMessage('The Phone number must be 10 caracters','Phone-PAT','rgb(255,35,35)');
        disablePATInputsExcept(phoneNumberPATInput);
        return;
    }
}
// Function to disable inputs except for the specified input
function disableVisaInputsExcept(inputToExclude) {
    visaInputs.forEach(input => {
        if (input !== inputToExclude) {
            input.setAttribute('disabled', 'true');
        }
    });
}
// Function to disable inputs except for the specified input
function disablePaypalInputsExcept(inputToExclude) {
    PaypalInputs.forEach(input => {
        if (input !== inputToExclude) {
            input.setAttribute('disabled', 'true');
        }
    });
}

function disablePATInputsExcept(inputToExclude) {
    PayAfterTakeInputs.forEach(input => {
        if (input !== inputToExclude) {
            input.setAttribute('disabled', 'true');
        }
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
    },2500)
}

// Event listener for email input field
document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission
    // Get the rating value
    var ratingInput = document.querySelector('input[name="rating"]:checked');
    var rating = ratingInput ? ratingInput.value : 0;

    // Get the message value
    var messageInput = document.getElementById('messageInput');
    var message = messageInput.value.trim();


    if((rating === 0 && message.trim() === '')||message.length < 10 ){
        showHighPropertyMessages('Try again with a valid message more than 10 caracters', '#e81d1a');
        return;
    }

    // Clear the message input after submission
    messageInput.value = '';
    if (ratingInput) {
        ratingInput.checked = false;
    }

    CommentInfo = {
        Name: userData.fullname,
        Email: userData.email,
        Rating: rating,
        Message: message,
        status:'New'
    };
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
});
function toggleMessages() {
    const messagesDiv = document.getElementById('inbox-messages');
    const Ishidden = messagesDiv.classList.toggle('hidden');
    const bottun  = document.getElementById('inbox-button');
    bottun.classList.toggle('hidden');
    if(!Ishidden){
        
        // Filter messages based on user ID and status
        
        populatemessagePopup(messagesData,'Filter');
    }else{
    }
    toggleOverlay();
    
}
function populatemessagePopup(messagesData,type) {
    const messageContent = document.querySelector('.message-content');
    let filteredMessages;
    if(type === 'Filter'){
        filteredMessages = messagesData.filter(message => message.memberid === userData.memberid && message.status === 'New');
    }else{
        filteredMessages = messagesData.filter(message => message.memberid === userData.memberid )
    }
    
    // Clear previous content
    messageContent.innerHTML = '';

    // Iterate through filtered messages and construct HTML elements
    filteredMessages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');

        const adminInfo = `the admin ${message.adminname}`;
        const messageType = message.type;
        const messageReponse = messageType === 'Responded' ? `and said to you "${message.message}"` : '';
        const messageDate = new Date(message.time_of_response).toLocaleString(); // Parse and format date
        const messageText = messageType === 'Message' ? ` ${adminInfo} sent you a message: "${message.message}"` :
            `${adminInfo} ${messageType} your reclamation message "${message.reclamationmessage}" posted on a command demanded on this date "${messageDate}" ${messageReponse}`;

        // Create paragraph element to display the message content
        const messagePara = document.createElement('p');
        messagePara.textContent = messageText;

        // Append button to the message div
        messageDiv.appendChild(messagePara);

        if(type !=='All'){
            const buttonMakeSeen = createButton('Make As Seen','MakeSeenButton',function() {
                message.status = 'Seen';
                updateMessagesData(message);
            });
            messageDiv.appendChild(buttonMakeSeen);
        }

        // Apply different styles based on message type
        messageDiv.style.padding = '10px';
        messageDiv.style.margin = '10px';
        messageDiv.style.border = 'none';
        messageDiv.style.borderRadius = '5px';

        // Apply background color based on message type
        if (messageType === 'Liked') {
            messageDiv.style.backgroundColor = 'rgba(35, 255, 35, 0.2)';
        } else if (messageType === 'Rejected') {
            messageDiv.style.backgroundColor = 'rgba(255, 35, 35, 0.2)';
        } else if (messageType === 'Responded') {
            messageDiv.style.backgroundColor = 'rgba(160, 160, 0, 0.2)';
        } else {
            messageDiv.style.backgroundColor = 'rgba(35, 35, 255, 0.2)';
        }

        // Append message div to the message content container
        messageContent.appendChild(messageDiv);
    });

    // Create history button
    if(type === 'Filter'){
        const HistoryButton = createButton('Show History Of Messages', 'confirmButton', () => {
            populatemessagePopup(messagesData,'All');
        });
    
        // Append history button to the message content
        messageContent.appendChild(HistoryButton);
    }
}

// Function to create a button
function createButton(text, classe , onClick) {
    const button = document.createElement('button');
    button.classList.add(classe);
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

function fetchMessagesData(){
    fetch('https://oussamarestau.onrender.com/Messages')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        messagesData = data;
        const newMessageCount  = messagesData.filter(message => message.memberid === userData.memberid && message.status === 'New').length;
        updateIndicatorSpan(newMessageCount);
        populatemessagePopup(messagesData,'Filter')
        // Fetch user data based on the provided email
        console.log("fetched messages sucesfully");
    })
    .catch(error => {
        console.error('Error fetching messages data:', error);
    });
}

function updateIndicatorSpan(newMessageCount) {
    const indicatorSpan = document.getElementById('Indicator-number');
    if (newMessageCount > 0) {
        indicatorSpan.textContent = newMessageCount;
        indicatorSpan.style.backgroundColor = 'red'; // Apply background color
    } else {
        indicatorSpan.textContent = '';
        indicatorSpan.style.backgroundColor = 'transparent'; // Remove background color
    }
}


function updateMessagesData(message) {
    fetch('https://oussamarestau.onrender.com/updateMessages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update message data');
        }
        // Handle successful response
        fetchMessagesData();
        showHighPropertyMessages('messages data updated successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error updating messages data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to update messages data. Please try again later.', '#ff0000');
    });
}

// Function to show the inbox button when not scrolling or when at the top
function toggleInboxButton() {
    const button = document.getElementById('inbox-button');
    const indicator = document.getElementById('Indicator-number');
    if (window.scrollY === 0) {
        button.style.display = 'block'; // Show the button if at the top
        indicator.style.display = 'block'; 
    }else{
        button.style.display = 'none';
        indicator.style.display = 'none';
    }
}

// Add event listener for scroll event to hide/show the button
window.addEventListener('scroll', function() {
    toggleInboxButton();
});
// Close button functionality for the SingleProductPopup
document.querySelector('#inbox-messages .closeButton').addEventListener('click', function() {
    toggleMessages();
});

function toggleMenu() {
    var hiddenContent = document.getElementById("hidden-content");
    var isHidden = hiddenContent.classList.toggle('hidden');
    if (!isHidden) {
        // Add click event listener to the body
        displayUserNamePhone(userData.fullname)
        document.body.addEventListener('click', function(event) {
            // Check if the click target is not within the hidden content
            if (hiddenContent.contains(event.target)) {
                hiddenContent.classList.add('hidden'); // Hide the hidden content
            }
        });
    }
}

// Function to display the user's name in the "My Account" section
function displayUserNamePhone(fullName) {
    const accountSection = document.getElementById('hidden-content');
    accountSection.innerHTML = `
        <ul>
            <li class="account-item">
                👤 ${fullName}
                <button type="button" class="LikeButton" onclick="toggleViewProfilePopup()">View Profile</button>
                <button type="button"class="RespondButton" onclick="toggleLikedProductsPopup()">Liked Products</button>
                <button type="button" class="RejectButton" onclick="togglelogOutPopup()">Logout</button>
            </li>
            <li class="help-item">
                ℹ️ Help
                <button type="button" class="ModifyButton" onclick="toggleFAQPopup()">FAQ</button>
                <button type="button" class="CommandeButton" onclick="toggleContactPopup()">Contact</button>
            </li>
            <li class="cart-item">
                🏬Shopping
                <button type="button" class="HistoryButton" onclick="toggleCartPopup()">My Cart</button>
            </li>
        </ul>
        <button class="closeButton" onclick="toggleMenu()">❌</button>
    `;
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