let productData;
let faqData;
let membersData;
let CommandesData;
let CommentsData;
let ReclamationsData;
let PromotionsData;
let messagesData;
let promotionsData ;

// Get the email from the query parameter
let userEmail ;
let userData;

// Function to get the query parameter from the URL
function getQueryParam(parameterName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}

// Function to find a user by email
function findUserByEmail(members, userEmail) {
    if (!members || !Array.isArray(members)) {
        // Handle case when members array is undefined, null, or not an array
        console.error('Members array is not properly initialized.');
        return null;
    }

    // Use Array.prototype.find to search for the user
    return members.find(user => user.email === userEmail);
}

// Function to display the user's name in the "My Account" section
function displayUserName(fullName) {
    const accountSection = document.getElementById('accountSection');
    accountSection.innerHTML = `
        <div class="account" onclick="toggleAccountMenu()">👤 <h6><a>${fullName}</a></h6></div>
        <div class="account-menu" id="accountMenu">
            <button type="button" class="ViewProfile" onclick="toggleViewProfilePopup()">View Profile</button>
            <button type="button" class="logout" onclick="togglelogOutPopup()">Logout</button>
        </div>
    `;
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
function confirmLogout() {
    // Redirect to home.html
    userData.lastConnection =  getCurrentTime();
    updateMemberData(userData);
    window.location.href = "Home.html";
}
// Function to handle window unload event
window.addEventListener('beforeunload', function(event) {
    // Send update request to server
    userData.lastConnection =  getCurrentTime();
    updateMemberData(userData);
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
// Event listener for account menu and help menu
document.addEventListener('click', function(event) {
    var accountMenu = document.getElementById('accountMenu');
    var isClickInsideAccountMenu = accountMenu.contains(event.target);
    var isClickOnAccountIcon = document.querySelector('.account').contains(event.target);

    if ((!isClickInsideAccountMenu && !isClickOnAccountIcon) || isClickInsideAccountMenu) {
        hideAccountMenu();
    }
});
function showUserData(userData) {
    const fullNameSpan = document.getElementById('fullName');
    const emailSpan = document.getElementById('email');

    // Check if userData is not null and contains the necessary fields
    if (userData && userData.fullname && userData.email) {
        fullNameSpan.textContent = userData.fullname;
        emailSpan.textContent = userData.email;
    }
}

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


    const user = membersData.find(member => member.email === email);
    if (user) {
        // Email found, display eror message meaning that it is no unique 
        displayErrorMessage("Already Existed Email", 'Modification-email','rgb(255, 35, 35)');
        return;
    } 
    // Email doesn't exist, means that this new email is unique
    displayErrorMessage("Valid New Email", 'Modification-email','rgb(35, 255, 35)');
    userData.email = email ;
    updateMemberData(userData);
    window.location.href = `admin.html?email=${encodeURIComponent(userData.email)}`;
});
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
    }else if (type === 'New-password'){
        inputField = document.getElementById('Confirm-New-password');
        Newpassword = document.getElementById('New-password');
        confirmNewPassword = document.getElementById('Confirm-New-password');
        Newpassword.value ='';
        confirmNewPassword.value ='';
        Newpassword.focus();
    }else if (type === 'Modification-name'){
        inputField = document.getElementById('New-name');
    }else if (type === 'New-Question'){
        inputField = document.querySelector('#AddPopup .inputNewQustion');
    }else if (type === 'New-Answer'){
        inputField = document.querySelector('#AddPopup .inputNewAnswer');
    }else if (type === 'New-Product-Name'){
        inputField = document.querySelector('#AddPopup .inputNewProductName');
    }else if (type === 'New-Product-Categorie-Name'){
        inputField = document.querySelector('#AddPopup .inputNewProductCategorie');
    }else if (type === 'New-Product-Description-Name'){
        inputField = document.querySelector('#AddPopup .inputNewProductDescription');
    }else if (type === 'New-Product-Price-Name'){
        inputField = document.querySelector('#AddPopup .inputNewProductPrice');
    }else if (type === 'New-promotion-Name'){
        inputField = document.querySelector('#AddPopup .InputnewPromotionName');
    }else if (type === 'New-Promotion-Description-Name'){
        inputField = document.querySelector('#AddPopup .inputNewPromotionDescription');
    }else if (type === 'New-Message'){
        inputField = document.querySelector('#MessagePopup #Message-Send');
    }else if (type === 'New-Reponse'){
        inputField = document.querySelector('#RespondPopup .inputReponse');
    }
    if (inputField) {
        inputField.parentNode.insertBefore(errorMessage, inputField.nextSibling);
    }
}
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
    userData.fullname = Name ;

    updateMemberData(userData);
    window.location.href = `admin.html?email=${encodeURIComponent(userData.email)}`;
});
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
    window.location.href = `admin.html?email=${encodeURIComponent(userData.email)}`;
});
// Close button event listener for login popup
document.querySelector("#ViewProfilePopup .closeButton").addEventListener("click", function(event) {
    toggleViewProfilePopup();
    event.preventDefault(); // Prevent default form submission
});
// Initialization function
window.onload = function () {
    // Get the email from the query parameter
    userEmail = getQueryParam('email');

    toggleThemeDark();
    // Find the checkbox element
    var darkModeCheckbox = document.querySelector('.header input[type="checkbox"]');
    // Check the checkbox
    darkModeCheckbox.checked = true;
    fetchFAQData();
    fetchMembersData();
    fetchCommandesData();
    fetchPromotionsData();
    fetchCommentsData();
    fetchReclamationsData();
    fetchMessagesData();

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
        populateTopProducts(productData,CommandesData);
        generateProductGrids(productData);
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
        generatePromotionGrids(promotionsData)
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
        displayFAQ(faqData);
        console.log("fetched faq sucesfully");
    })
    .catch(error => {
        console.error('Error fetching FAQ data:', error);
    });
}

// Hide account menu
function hideAccountMenu() {
    var accountMenu = document.getElementById('accountMenu'); // Change 'accountMenu' to the new ID
    accountMenu.style.display = "none";
}

function fetchMembersData(){
    fetch('https://oussamarestau.onrender.com/members')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        membersData = data;
        // Fetch user data based on the provided email
        userData = findUserByEmail(membersData, userEmail);
        if (userData) {
            console.log('Found user:', userData);
            // Extract full name from user data
            const fullName = userData.fullname;
            // Display user's name in the "My Account" section
            displayUserName(fullName);
            hideAccountMenu();
        } else {
            console.log('No user found with the provided email');
        }
        populateTopMembers(membersData);
        displayMembers(membersData);
        console.log("fetched members sucesfully");
    })
    .catch(error => {
        console.error('Error fetching members data:', error);
    });
}

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
        displayCommandes(CommandesData)
        fetchProductData();
        console.log('fetched Commandes Succesfuly')
    })
    .catch(error => {
        console.error('Error fetching Commandes data:', error);
    });
}

function fetchCommentsData() {
    fetch('https://oussamarestau.onrender.com/Comments')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        CommentsData = data;
        populateRatings(CommentsData)
        console.log('fetched Comments Succesfuly')
    })
    .catch(error => {
        console.error('Error fetching Comments data:', error);
    });
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
        printMessagesTable(messagesData)
        // Fetch user data based on the provided email
        console.log("fetched messages sucesfully");
    })
    .catch(error => {
        console.error('Error fetching messages data:', error);
    });
}

function fetchReclamationsData() {
    fetch('https://oussamarestau.onrender.com/Reclamations')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        ReclamationsData = data;
        populateReclamations(ReclamationsData,membersData)
        console.log('fetched Reclamations Succesfuly')
    })
    .catch(error => {
        console.error('Error fetching Reclamations data:', error);
    });
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
// Theme toggling function
function toggleThemeDark() {
    var body = document.body;
    body.classList.toggle("dark-theme");
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

// Function to populate the reclamations section
function populateReclamations(reclamations, membersData) {
    const reclamationContent = document.querySelector('.reclamation-content');
    reclamationContent.innerHTML = ''; // Clear previous content
    var CurrentCommande ;

    reclamations.forEach(reclamation => {
        if(reclamation.status ==='New'){
            const reclamationItem = document.createElement('div');
            reclamationItem.classList.add('reclamation-item');

            // Create message element
            const messageElement = document.createElement('div');
            messageElement.classList.add('message-text')
            messageElement.textContent = reclamation.reclamation_msg; // Assuming 'reclamation_msg' is the key for reclamation content
            reclamationItem.appendChild(messageElement);

            // Find the user's email from members data using their ID
            const user = membersData.find(member => member.memberid === reclamation.userID);
            if (user) {
                // Create "message from:" text
                const messageFromText = document.createElement('div');
                messageFromText.classList.add('message-info')
                messageFromText.textContent = 'Message from: ';
                reclamationItem.appendChild(messageFromText);

                // Create email hyperlink
                const emailLink = document.createElement('a');
                emailLink.textContent = user.email; // Assuming 'email' is the key for user's email
                emailLink.href = 'mailto:' + user.email;
                reclamationItem.appendChild(emailLink);

                // Add line break for separation
                reclamationItem.appendChild(document.createElement('br'));
            }

            // Create "Phone number: " text
            const phoneNumberText = document.createElement('div');
            phoneNumberText.classList.add('message-info')
            phoneNumberText.textContent = 'Phone number: ';
            reclamationItem.appendChild(phoneNumberText);

            // Create phone number hyperlink
            const phoneLink = document.createElement('a');
            phoneLink.textContent = reclamation.phoneNumber; // Assuming 'phoneNumber' is the key for phone number
            phoneLink.href = '#'; // Adjust link accordingly
            reclamationItem.appendChild(phoneLink);

            // Add line break for separation
            reclamationItem.appendChild(document.createElement('br'));

            CurrentCommande = CommandesData.find(commande => commande.id === reclamation.commandID);
            
            //Create Button to respond on the reclamation
            const ButtonRespond = createButton('Respond','RespondButton',function() {
                toggleRespondPopup();
                PopulateRespondPopup(reclamation,CurrentCommande);
            });
            reclamationItem.appendChild(ButtonRespond);


            //Create Button to like on the reclamation
            const ButtonLike = createButton('Like','LikeButton',function() {
                reclamation.status ='Liked';
                updateReclamationData(reclamation);
                message = {
                    adminid : userData.memberid,
                    adminname : userData.fullname,
                    memberid : reclamation.userID,
                    type :'Liked',
                    reclamationmessage : reclamation.reclamation_msg,
                    commandeDate : CommandesData.find(commande=> commande.id === reclamation.commandID).order_time,
                    message :'None',
                    status : 'New'
                }
                addmessageData(message);
            });
            reclamationItem.appendChild(ButtonLike);


            //Create Button to Reject on the reclamation
            const ButtonReject = createButton('Reject','RejectButton',function() {
                reclamation.status ='Rejected';
                updateReclamationData(reclamation);
                updateReclamationData(reclamation);
                message = {
                    adminid : userData.memberid,
                    adminname : userData.fullname,
                    memberid : reclamation.userID,
                    type :'Rejected',
                    reclamationmessage : reclamation.reclamation_msg,
                    commandeDate : CommandesData.find(commande=> commande.id === reclamation.commandID).order_time,
                    message :'None',
                    status : 'New'
                }
                addmessageData(message);
            });
            reclamationItem.appendChild(ButtonReject);
            reclamationContent.appendChild(reclamationItem);
        }
    });
    //Create Button to show History of reclamations
    const ButtonHistory = createButton('Show History Of Reclamations','RespondButton',function() {
        toggleHistoryPopup();
        PopulateHistoryPopup('reclamation',ReclamationsData);
    });
    reclamationContent.appendChild(ButtonHistory);
}
// Function to populate the top members section
function populateTopMembers(members) {
    const memberContent = document.querySelector('.member-content');
    memberContent.innerHTML = ''; // Clear previous content

    // Sort members by points in descending order
    members.sort((a, b) => b.pointsfidele - a.pointsfidele);

    // Get the top 10 members
    const topMembers = members.slice(0, 10);

    topMembers.forEach(member => {
        const memberItem = document.createElement('div');
        memberItem.classList.add('member-item');

        // Create name element
        const nameElement = document.createElement('div');
        nameElement.classList.add('member-name');
        nameElement.textContent = member.fullname;
        memberItem.appendChild(nameElement);

        const EmailText = document.createElement('div');
        EmailText.classList.add('message-info');
        EmailText.textContent = ' with email: ';
        memberItem.appendChild(EmailText);

        // Create email element with hyperlink
        const emailElement = document.createElement('a');
        emailElement.classList.add('member-email');
        emailElement.textContent = member.email;
        emailElement.href = '#';
        memberItem.appendChild(emailElement);

        const PointsText = document.createElement('div');
        PointsText.classList.add('message-info');
        PointsText.textContent = 'Total points: ';
        memberItem.appendChild(PointsText);

        // Create points element
        const pointsElement = document.createElement('div');
        pointsElement.classList.add('member-points');
        pointsElement.textContent = member.pointsfidele + ' Points';
        memberItem.appendChild(pointsElement);
        var ButtonMessage ;
       if ( member.memberid === userData.memberid ){
            //Create Button to Send mssg to user
            ButtonMessage = createButton('Send Message','RejectButton',function() {
                showHighPropertyMessages('Cant Send Messages To Your Self','rgb(255,35,35)');
            });
       }else{
            //Create Button to Send mssg to user
            ButtonMessage = createButton('Send Message','MessageButton',function() {
                toggleMessagePopup(member);
            });
       }
        memberItem.appendChild(ButtonMessage);


        //Create Button to Modify on the Member 
        const ButtonModify = createButton('Modify','ModifyButton',function() {
            toggleModifyPopup();
            populateModifyPopup('member',membersData.find(Member =>Member.email ===  member.email));
        });
        memberItem.appendChild(ButtonModify);

        //Create Button to Show history of member
        const ButtonHistory = createButton('Show History','HistoryButton',function() {
            const result = CommandesData.filter(commande => commande.user_id === member.memberid);
            toggleShowInfoPopup();
            populateShowInfoPopup('commande',result);
            
        });
        memberItem.appendChild(ButtonHistory);

        memberContent.appendChild(memberItem);
    });
}

function populateShowInfoPopup(type ,result){
    const informationsContainer = document.getElementById('Informations');
    const informationsGrid = informationsContainer.querySelector('.info-grid');
    informationsGrid.innerHTML = ''; // Clear previous content
    if(type === 'commande'){
        // Create table element
        const table = document.createElement('table');
        table.classList.add('commandes-table');
        
        // Create table header
        const headerRow = document.createElement('tr');
        const headers = ['Products Commanded', 'Address', 'Phone Number','Price', 'Time','Payment Method', 'Status', 'Progress', 'Dislink', 'Send'];
        
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        table.appendChild(headerRow);
        
        result.forEach(commande => {
            if (commande.status === 'Under traitement' || commande.status === 'In progress') {
                const row = document.createElement('tr');
                
                const orderDate = new Date(commande.order_time);
                const formattedOrderTime = orderDate.toLocaleString(); // Format the date and time
                
                // Add data cells
                const cells = [
                    commande.products, // Products Commanded
                    commande.addresse, // Address
                    commande.phone_number, // Phone Number
                    commande.price,
                    formattedOrderTime, // Time
                    commande.payment_method,
                    commande.status, // Status
                    '', // Placeholder for Make In Progress button
                    '', // Placeholder for Dislink button
                    ''  // Placeholder for Send button
                ];

                cells.forEach((cellData, index) => {
                    const cell = document.createElement('td');
                    cell.textContent = cellData;
                    
                    // Add buttons based on the index
                    if (index === 7 && (commande.status === 'Under traitement' )) {
                        const makeInProgressBtn = document.createElement('button');
                        makeInProgressBtn.classList.add('makeInProgressBtn');
                        makeInProgressBtn.textContent = 'Make In Progress';
                        makeInProgressBtn.addEventListener('click', () => {
                            // Handle make in progress button click
                            commande.status = 'In progress'
                            updateCommandeData(commande);
                            populateShowInfoPopup('commande',result)
                            // This could be a function to change the status of the commande to 'In progress'
                        });
                        cell.appendChild(makeInProgressBtn);
                    } else if (index === 8 && (commande.status === 'Under traitement' || commande.status === 'In progress') ) {
                        const dislinkBtn = document.createElement('button');
                        dislinkBtn.classList.add('dislinkBtn');
                        dislinkBtn.textContent = 'Dislink';
                        dislinkBtn.addEventListener('click', () => {
                            // Handle dislink button click
                            commande.status = 'Dislinked'
                            updateCommandeData(commande);
                            populateShowInfoPopup('commande',result)
                            // This could be a function to remove the commande from the table and change its status to 'Dislinked'
                        });
                        cell.appendChild(dislinkBtn);
                    } else if (index === 9 && (commande.status === 'In progress')  ) {
                        const sendBtn = document.createElement('button');
                        sendBtn.classList.add('sendBtn');
                        sendBtn.textContent = 'Send';
                        sendBtn.addEventListener('click', () => {
                            // Handle send button click
                            commande.status = 'Sended'
                            updateCommandeData(commande);
                            populateShowInfoPopup('commande',result)
                            // This could be a function to change the status of the commande to 'Ready'
                        });
                        cell.appendChild(sendBtn);
                    }
                    
                    row.appendChild(cell);
                });
                
                table.appendChild(row);
            }else{
                const row = document.createElement('tr');
                
                const orderDate = new Date(commande.order_time);
                const formattedOrderTime = orderDate.toLocaleString(); // Format the date and time
                
                // Add data cells
                const cells = [
                    commande.products, // Products Commanded
                    commande.addresse, // Address
                    commande.phone_number, // Phone Number
                    commande.price,
                    formattedOrderTime, // Time
                    commande.payment_method,
                    commande.status, // Status
                    '', // Placeholder for  button
                    '', // Placeholder for button
                    ''  // Placeholder for Send button
                ];

                cells.forEach((cellData, index) => {
                    const cell = document.createElement('td');
                    cell.textContent = cellData;
                    
                    // Add buttons based on the index
                    if (index === 9 ) {
                        const removeBtn = document.createElement('button');
                        removeBtn.classList.add('RemoveButton');
                        removeBtn.textContent = 'Remove';
                        removeBtn.addEventListener('click', () => {
                            toggleShowInfoPopup();
                            toggleRemovePopup();
                            populateRemovePopup('commande',commande)
                        });
                        cell.appendChild(removeBtn);
                    } 
                    row.appendChild(cell);
                });
                
                table.appendChild(row);
            }
        });
        
        informationsGrid.appendChild(table);
    }else if (type === 'member'){
        // Create a table element for the question details
        const table = document.createElement('table');
        table.classList.add('modify-table');
        
        // Create table header
        const headerRow = document.createElement('tr');
        const headers = ['Full Name', 'Email','Last Connection','Points Member Ship','Password','Admin','Modify','Remove'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        table.appendChild(headerRow);
        const row = document.createElement('tr');
            
        const ConnectionDate = new Date(result.lastConnection);
        const formattedConectionTime = ConnectionDate.toLocaleString(); // Format the date and time
        
        // Add data cells
        const cells = [
            result.fullname, // name
            result.email, // email
            formattedConectionTime,
            result.pointsfidele, // points fideles
            result.passwrd,
            result.admin === 1 ? 'yes' : 'no',
            '',
            ''
        ];

        cells.forEach((cellData,index) => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            if (index === 6) {
                const ModifyButton = document.createElement('button');
                ModifyButton.classList.add('ModifyButton');
                ModifyButton.textContent = 'Modify';
                ModifyButton.addEventListener('click', () => {
                    // Handle make in progress button click
                    toggleShowInfoPopup();
                    toggleModifyPopup();
                    populateModifyPopup('member',result)
                });
                cell.appendChild(ModifyButton);
            }else if (index === 7) {
                const RemoveButton = document.createElement('button');
                RemoveButton.classList.add('RemoveButton');
                RemoveButton.textContent = 'Remove';
                RemoveButton.addEventListener('click', () => {
                    // Handle make in progress button click
                    toggleShowInfoPopup();
                    toggleRemovePopup();
                    populateRemovePopup('member',result)
                });
                cell.appendChild(RemoveButton);
            }
            row.appendChild(cell);
        });
        
        table.appendChild(row);
        informationsGrid.appendChild(table);
    }
}
// Function to populate the top products section
function populateTopProducts(products, commandesData) {
    const productContent = document.querySelector('.product-content');
    productContent.innerHTML = ''; // Clear previous content
    
    // Count the number of times each product is ordered
    const productOrdersCount = {};
    commandesData.forEach(commande => {
        const productsOrdered = commande.products.split(', ');
        productsOrdered.forEach(productName => {
            productOrdersCount[productName] = (productOrdersCount[productName] || 0) + 1;
        });
    });

    // Sort products based on the number of orders they received
    const sortedProducts = Object.keys(productOrdersCount).sort((a, b) => productOrdersCount[b] - productOrdersCount[a]);

    // Get the top 10 products
    const topProducts = sortedProducts.slice(0, 10);

    topProducts.forEach(productName => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-Top');
        productItem.addEventListener('click', (event) => {
            const target = event.target
            if(target !== ButtonCommandes && target !== ButtonModify  && target !== ButtonRemove ){
                toggleSingleProductPopup(products.find(product => product.Name === productName ))
            }
        }); // Pass productName to showProduct function

        // Create product name element
        const productNameElement = document.createElement('div');
        productNameElement.classList.add('product-name');
        productNameElement.textContent = productName;
        productItem.appendChild(productNameElement);

        const OrdersText = document.createElement('div');
        OrdersText.classList.add('message-info');
        OrdersText.textContent = 'Number Orders: ';
        productItem.appendChild(OrdersText);

        // Create product orders count element
        const productOrdersElement = document.createElement('div');
        productOrdersElement.classList.add('product-orders');
        productOrdersElement.textContent = ` ${productOrdersCount[productName]} Order/s`;
        productItem.appendChild(productOrdersElement);

        //Create Button to show commandes of the product 
        const ButtonCommandes = createButton('Show in Commandes','CommandeButton',function() {
            const commandes = searchInCommandes(productName);
            toggleShowInfoPopup();
            populateShowInfoPopup('commande',commandes)
        });
        productItem.appendChild(ButtonCommandes);

        //Create Button to reject on the product 
        const ButtonModify = createButton('Modify','ModifyButton',function() {
            toggleModifyPopup();
            populateModifyPopup('product',productData.find(product =>product.Name ===  productName));
        });
        productItem.appendChild(ButtonModify);
        
        //Create Button to remove on the product 
        const ButtonRemove = createButton('Remove','RemoveButton',function() {
            toggleRemovePopup();
            populateRemovePopup('product',productData.find(product =>product.Name ===  productName));
        });
        productItem.appendChild(ButtonRemove);
        

        productContent.appendChild(productItem);
    });
}
// Function to create a button
function createButton(text, classe , onClick) {
    const button = document.createElement('button');
    button.classList.add(classe);
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}
// Function to populate the ratings section
function populateRatings(comments) {
    const ratingContent = document.querySelector('.rating-content');
    ratingContent.innerHTML = ''; // Clear previous content
    
    // Filter comments by rating
    const ratings = {
        5: [],
        4: [],
        3: [],
        2: [],
        1: [],
        0: []
    };

    comments.forEach(comment => {
        // Assuming 'rating' is the key for rating value in each comment
        const rating = comment.Rating !== undefined ? comment.Rating : 'Unknown';
        ratings[rating].push(comment);
    });

    // Display ratings
    for (let i = 5; i > 0; i--) {
        const ratingSection = document.createElement('div');
        ratingSection.classList.add('rating-section');

        const starRating = document.createElement('div');
        starRating.textContent = `${`${i}${'⭐️'.repeat(i)}`}: ${ratings[i].length} personnes`;
        ratingSection.appendChild(starRating);

        ratingContent.appendChild(ratingSection);
    }

    // Display comments
    const comentSection = document.createElement('div');
    comentSection.classList.add('Comment-section');

    comentSection.textContent = 'Comments';
    ratingContent.appendChild(comentSection);

    comments.forEach(comment => {
        if(comment.status !== 'Seen'){
            const commentOwner = document.createElement('div');
        commentOwner.classList.add('comment-info');
        const ComentDate = new Date(comment.CreatedAt);
        const formattedCommentTime = ComentDate.toLocaleString(); // Format the date and time

        commentOwner.textContent = ` ${comment.Name} : ${formattedCommentTime}`;
        comentSection.appendChild(commentOwner);

        const commentItem = document.createElement('div');
        commentItem.classList.add('comment-item');

        commentItem.textContent = ` ${comment.Message}`;
        comentSection.appendChild(commentItem);

        // Add line break for separation
        commentItem.appendChild(document.createElement('br'));

        //Create Button to show account commented
        const buttonShowAccount = createButton('Show Account','ShowAccountButton',function() {
            toggleShowInfoPopup();
            populateShowInfoPopup('member',membersData.find(member => member.email === comment.Email))
        });
        commentItem.appendChild(buttonShowAccount);

        const buttonMakeSeen = createButton('Make As Seen','MakeSeenButton',function() {
            comment.status = 'Seen';
            updateCommentesData(comment);
        });
        commentItem.appendChild(buttonMakeSeen);
        }
    });
    //Create Button to show History of comments
    const ButtonHistory = createButton('Show History Of Comments','RespondButton',function() {
        toggleHistoryPopup();
        PopulateHistoryPopup('comment',CommentsData);
    });
    ratingContent.appendChild(ButtonHistory);
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

    // Perform search across all datasets
    const searchResults = {
        members: searchInMembers(searchInput),
        products: searchInProducts(searchInput),
        faqs: searchInFAQ(searchInput),
        reclamations: searchInReclamations(searchInput),
        commandes: searchInCommandes(searchInput),
        comments: searchInComments(searchInput)
    };

    // Check if any search results found
    let totalResults = 0;
    for (const key in searchResults) {
        if (searchResults[key].length > 0) {
            totalResults += searchResults[key].length;
        }
    }

    if (totalResults === 0) {
        showHighPropertyMessages('Nothing found with this name or description', 'rgb(255, 35, 35)');
        document.getElementById('search-String').value='';
        document.getElementById('search-String').focus();
        return;
    }
    document.getElementById('search-String').value='';
    // Display search results as needed
    toggleSearchPopup(searchResults);
});

// Function to search in members dataset
function searchInMembers(searchInput) {
    return membersData.filter(member => {
        // Modify the conditions as per your search criteria
        return member.fullname.toLowerCase().includes(searchInput) || member.email.toLowerCase().includes(searchInput);
    });
}

// Function to search in products dataset
function searchInProducts(searchInput) {
    return productData.filter(product => {
        // Modify the conditions as per your search criteria
        return product.Name.toLowerCase().includes(searchInput) || product.Description.toLowerCase().includes(searchInput)
         || product.Category.toLowerCase().includes(searchInput) ;
    });
}

// Function to search in FAQ dataset
function searchInFAQ(searchInput) {
    return faqData.filter(faq => {
        // Modify the conditions as per your search criteria
        return faq.Question.toLowerCase().includes(searchInput) || faq.Answer.toLowerCase().includes(searchInput);
    });
}

// Function to search in reclamations dataset
function searchInReclamations(searchInput) {
    return ReclamationsData.filter(reclamation => {
        // Modify the conditions as per your search criteria
        return reclamation.reclamation_msg.toLowerCase().includes(searchInput) || reclamation.address.toLowerCase().includes(searchInput);
    });
}

// Function to search in commandes dataset
function searchInCommandes(searchInput) {
    return CommandesData.filter(commande => {
        // Modify the conditions as per your search criteria
        return commande.products.toLowerCase().includes(searchInput) ||commande.user_name.toLowerCase().includes(searchInput) 
        || commande.user_email.toLowerCase().includes(searchInput) || commande.payment_method.toLowerCase().includes(searchInput)
        || commande.addresse.toLowerCase().includes(searchInput) || commande.phone_number.toLowerCase().includes(searchInput)
        || commande.status.toLowerCase().includes(searchInput);
    });
}

// Function to search in comments dataset
function searchInComments(searchInput) {
    return CommentsData.filter(comment => {
        // Modify the conditions as per your search criteria
        return comment.Message.toLowerCase().includes(searchInput) ||comment.Name.toLowerCase().includes(searchInput)
        ||comment.Email.toLowerCase().includes(searchInput)||comment.Rating === searchInput;
    });
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
function displayCommandes(commandesData) {
    // Sort commandes data by time (assuming there's a 'order_time' property in each commande object)
    commandesData.sort((a, b) => new Date(a.order_time) - new Date(b.order_time));
    
    const commandesContainer = document.getElementById('current-time-commandes');
    const commandesGrid = commandesContainer.querySelector('.Commandes-grid');
    commandesGrid.innerHTML = ''; // Clear previous content
    
    // Create table element
    const table = document.createElement('table');
    table.classList.add('commandes-table');
    
    // Create table header
    const headerRow = document.createElement('tr');
    const headers = ['Products Commanded', 'Address', 'Phone Number','Price', 'Time','Payment Method', 'Status', 'Progress', 'Dislink', 'Send'];
    
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    
    table.appendChild(headerRow);
    
    commandesData.forEach(commande => {
        if (commande.status === 'Under traitement' || commande.status === 'In progress') {
            const row = document.createElement('tr');
            
            const orderDate = new Date(commande.order_time);
            const formattedOrderTime = orderDate.toLocaleString(); // Format the date and time
            
            // Add data cells
            const cells = [
                commande.products, // Products Commanded
                commande.addresse, // Address
                commande.phone_number, // Phone Number
                commande.price,
                formattedOrderTime, // Time
                commande.payment_method,
                commande.status, // Status
                '', // Placeholder for Make In Progress button
                '', // Placeholder for Dislink button
                ''  // Placeholder for Send button
            ];

            cells.forEach((cellData, index) => {
                const cell = document.createElement('td');
                cell.textContent = cellData;
                
                // Add buttons based on the index
                if (index === 7 && (commande.status === 'Under traitement' )) {
                    const makeInProgressBtn = document.createElement('button');
                    makeInProgressBtn.classList.add('makeInProgressBtn');
                    makeInProgressBtn.textContent = 'Make In Progress';
                    makeInProgressBtn.addEventListener('click', () => {
                        // Handle make in progress button click
                        commande.status = 'In progress'
                        updateCommandeData(commande);
                        displayCommandes(commandesData)
                        // This could be a function to change the status of the commande to 'In progress'
                    });
                    cell.appendChild(makeInProgressBtn);
                } else if (index === 8 && (commande.status === 'Under traitement' || commande.status === 'In progress') ) {
                    const dislinkBtn = document.createElement('button');
                    dislinkBtn.classList.add('dislinkBtn');
                    dislinkBtn.textContent = 'Dislink';
                    dislinkBtn.addEventListener('click', () => {
                        // Handle dislink button click
                        commande.status = 'Dislinked'
                        updateCommandeData(commande);
                        displayCommandes(commandesData)
                        // This could be a function to remove the commande from the table and change its status to 'Dislinked'
                    });
                    cell.appendChild(dislinkBtn);
                } else if (index === 9 && (commande.status === 'In progress')  ) {
                    const sendBtn = document.createElement('button');
                    sendBtn.classList.add('sendBtn');
                    sendBtn.textContent = 'Send';
                    sendBtn.addEventListener('click', () => {
                        // Handle send button click
                        commande.status = 'Sended'
                        updateCommandeData(commande);
                        displayCommandes(commandesData)
                        // This could be a function to change the status of the commande to 'Ready'
                    });
                    cell.appendChild(sendBtn);
                }
                
                row.appendChild(cell);
            });
            
            table.appendChild(row);
        }
    });
    
    commandesGrid.appendChild(table);

    //Create Button to Show History of commandes
    const HistoryCommandeBtn = document.createElement('button');
    HistoryCommandeBtn.classList.add('RespondButton');
    HistoryCommandeBtn.textContent = 'Show History Of Commandes'; 
    HistoryCommandeBtn.addEventListener('click',()=>{
        toggleHistoryPopup();
        PopulateHistoryPopup('commande',commandesData);
    })
    commandesGrid.appendChild(HistoryCommandeBtn)


}

function displayMembers(membersData) {
    const membersContainer = document.getElementById('All-members');
    const membersGrid = membersContainer.querySelector('.members-grid');
    membersGrid.innerHTML = ''; // Clear previous content
    
    // Create table element
    const table = document.createElement('table');
    table.classList.add('members-table');
    
    // Create table header
    const headerRow = document.createElement('tr');
    const headers = ['Name', 'Email', 'Last Connection', 'Points Membership', 'Admin','Modify','Remove','Make Admin'];
    
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    
    table.appendChild(headerRow);

    membersData.forEach(member => {
        if (member.admin !== 1) {
            const row = document.createElement('tr');
            const LastConnectionDate = new Date(member.lastConnection);
            const formatedLastConnectionDate = LastConnectionDate.toLocaleString(); // Format the date and time
            
            // Add data cells
            const cells = [
                member.fullname,
                member.email,
                formatedLastConnectionDate,
                member.pointsfidele + '  Points',
                (member.admin === 1) ? 'yes' : 'no',
                createButton('Modify', 'ModifyButton', () => { toggleModifyPopup(); populateModifyPopup('member',member) }),
                createButton('Remove', 'RemoveButton', () => {toggleRemovePopup(); populateRemovePopup('member',member); }),
                createButton('Make Admin', 'AdminButton', () => { member.admin = 1; updateMemberData(member); })
            ];
            
            cells.forEach(cellData => {
                const cell = document.createElement('td');
                if (cellData instanceof Node) {
                    cell.appendChild(cellData);
                } else {
                    cell.textContent = cellData;
                }
                row.appendChild(cell);
            });
            
            table.appendChild(row);
        }
    });
    
    membersGrid.appendChild(table);

    //Create Button to Show History of commandes
    const ShowAdminsBtn = document.createElement('button');
    ShowAdminsBtn.classList.add('ShowAdminButton');
    ShowAdminsBtn.textContent = 'Show Admins'; 
    ShowAdminsBtn.addEventListener('click',()=>{
        toggleHistoryPopup();
        PopulateHistoryPopup('member',membersData);
    })
    membersGrid.appendChild(ShowAdminsBtn)
}
// Function to populate the modify popup with the specific question details
function populateModifyPopup(type,entry) {
    const modificationContent = document.querySelector('#ModifyPopup .modification-content');
    modificationContent.innerHTML = ''; // Clear previous content
    
    // Create a table element for the question details
    const table = document.createElement('table');
    table.classList.add('modify-table');
    
    // Create table header
    const headerRow = document.createElement('tr');
    if(type === 'faq'){
        const headers = ['Question', 'Answer'];

        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        table.appendChild(headerRow);
    
        // Create table body
        const bodyRow = document.createElement('tr');
        
        // Add question cell
        const questionCell = document.createElement('td');
        questionCell.textContent = entry.Question;
        bodyRow.appendChild(questionCell);
        
        // Add answer cell
        const answerCell = document.createElement('td');
        answerCell.textContent = entry.Answer;
        bodyRow.appendChild(answerCell);
        
        // Append body row to table
        table.appendChild(bodyRow);
    
        // Append table to modification content
        modificationContent.appendChild(table);
    
        const buttonModifyQuestion = createButton('Modify Question','ModifyButton',function() {
            showNewInput(entry,'Question','New Question','Validate New Question',updateFaqData);
        });
        modificationContent.appendChild(buttonModifyQuestion);

        const buttonModifyAnswer = createButton('Modify Answer','ModifyButton',function() {
            showNewInput(entry, 'Answer', 'New Answer', 'Validate New Answer', updateFaqData);
        });
        modificationContent.appendChild(buttonModifyAnswer);
        
    }else if(type === 'member'){
        const headers = ['Full Name', 'Email','Last Connection','Points Member Ship','Password','Admin'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        table.appendChild(headerRow);
        const row = document.createElement('tr');
            
        const ConnectionDate = new Date(entry.lastConnection);
        const formattedConectionTime = ConnectionDate.toLocaleString(); // Format the date and time
        
        // Add data cells
        const cells = [
            entry.fullname, // name
            entry.email, // email
            formattedConectionTime,
            entry.pointsfidele, // points fideles
            entry.passwrd,
            entry.admin === 1 ? 'yes' : 'no'
        ];

        cells.forEach((cellData) => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            row.appendChild(cell);
        });
        
        table.appendChild(row);
        modificationContent.appendChild(table);

        const buttonModifyName = createButton('Modify Name','ModifyButton',function() {
            showNewInput(entry, 'fullname', 'New Full Name', 'Validate New Name', updateMemberData);
        });
        modificationContent.appendChild(buttonModifyName);
    
        const buttonModifyEmail = createButton('Modify Email','ModifyButton',function() {
            showNewInput(entry, 'email', 'New Email', 'Validate New Email', updateMemberData);
        });
        modificationContent.appendChild(buttonModifyEmail);

        const buttonModifyPoints = createButton('Modify Points','ModifyButton',function() {
            showNewInput(entry, 'pointsfidele', 'New Amount of Points Of Membership', 'Validate New Points Amount', updateMemberData);
        });
        modificationContent.appendChild(buttonModifyPoints);

        const buttonModifyPassword = createButton('Modify Password','ModifyButton',function() {
            showNewInput(entry, 'passwrd', 'New Password', 'Validate New Password', updateMemberData);
        });
        modificationContent.appendChild(buttonModifyPassword);

        const buttonModifyAdmin = createButton('Add/Remove Admin','ModifyButton',function() {
            entry.admin = (entry.admin === 1)?0:1 ;updateMemberData(entry); toggleModifyPopup();
        });
        modificationContent.appendChild(buttonModifyAdmin);

    }else if(type === 'product'){
        const headers = ['Product Name', 'Categorie','Image Path','Description','Price'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        table.appendChild(headerRow);
        const row = document.createElement('tr');
        
        // Add data cells
        const cells = [
            entry.Name, // name
            entry.Category, // category
            entry.ImagePath, // image path
            entry.Description,
            entry.Price
        ];

        cells.forEach((cellData) => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            row.appendChild(cell);
        });
        
        table.appendChild(row);
        modificationContent.appendChild(table);

        const buttonModifyName = createButton('Modify Name','ModifyButton',function() {
            showNewInput(entry, 'Name', 'New Name', 'Validate New Name', updateProductData);
        });
        modificationContent.appendChild(buttonModifyName);
    
        const buttonModifyCategorie = createButton('Modify Categorie','ModifyButton',function() {
            showNewInput(entry, 'Category', 'New Category', 'Validate New Category', updateProductData);
        });
        modificationContent.appendChild(buttonModifyCategorie);

        const buttonModifyImagePath = createButton('Modify Image Path','ModifyButton',function() {
            showNewInput(entry, 'ImagePath', 'New Image Path', 'Validate New Image Path', updateProductData);
        });
        modificationContent.appendChild(buttonModifyImagePath);

        const buttonModifyDescription = createButton('Modify Description','ModifyButton',function() {
            showNewInput(entry, 'Description', 'New Description', 'Validate New Description', updateProductData);
        });
        modificationContent.appendChild(buttonModifyDescription);

        const buttonModifyPrice = createButton('Modify Price','ModifyButton',function() {
            showNewInput(entry, 'Price', 'New Price', 'Validate New Price', updateProductData);
        });
        modificationContent.appendChild(buttonModifyPrice);
    }else if(type === 'promotion'){
        const headers = ['Product Promoted','Image Path Promotion', 'Description Of Promotion'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        table.appendChild(headerRow);
        const row = document.createElement('tr');
        
        // Add data cells
        const cells = [
            entry.product_name, // name
            entry.image_url,// image path
            entry.description // description
        ];

        cells.forEach((cellData) => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            row.appendChild(cell);
        });
        
        table.appendChild(row);
        modificationContent.appendChild(table);

        const buttonModifyName = createButton('Modify Name','ModifyButton',function() {
            showNewInput(entry, 'product_name', 'New Name', 'Validate New Name', updatePromotionData);
        });
        modificationContent.appendChild(buttonModifyName);

        const buttonModifyImagePath = createButton('Modify Image Path','ModifyButton',function() {
            showNewInput(entry, 'image_url', 'New Image Path', 'Validate New Image Path', updatePromotionData);
        });
        modificationContent.appendChild(buttonModifyImagePath);

        const buttonModifyDescription = createButton('Modify Description','ModifyButton',function() {
            showNewInput(entry, 'description', 'New Description', 'Validate New Description', updatePromotionData);
        });
        modificationContent.appendChild(buttonModifyDescription);

    }
    
}
function printMessagesTable(messages) {
    const parametresContent = document.querySelector('#admin-parametres .parametres-content');
    parametresContent.innerHTML = ''; // Clear previous content

    // Create table element
    const table = document.createElement('table');
    table.classList.add('messages-table');
    const headerRow = document.createElement('tr');

    const headers = ['Admin Name', 'Member Sended To','Reclamation Message','Type','Date','Message','Status','Remove'];
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);
    // Create table rows
    messages.forEach(message => {
        const row = document.createElement('tr');
        const orderDate = new Date(message.commandeDate);
            const formattedOrderTime = orderDate.toLocaleString(); // Format the date and time
            const Member = membersData.find(member => member.memberid === message.memberid)
            
            // Add data cells
            const cells = [
                message.adminname , // admin
                Member.fullname , // member
                message.type === 'Message' ?'None':message.reclamationmessage , // Reclamation message
                message.type,
                formattedOrderTime, // Time
                message.message,
                message.status, // Status
                ''
            ];
            cells.forEach((cellData, index) => {
                const cell = document.createElement('td');
                cell.textContent = cellData;
                if(index === 3 ){
                    cell.style.fontWeight ="bold"
                    if(message.type === 'Rejected' ){
                        cell.style.color = "#ff0000"
                    }else if(message.type === 'Message'){
                        cell.style.color ="#1a73e8"
                    }else if(message.type === 'Liked' ){
                        cell.style.color ="#008d15"
                    }else if(message.type === 'Responded' ){
                        cell.style.color ="#d8cd34"
                    }
                }
                if(index === 6){
                    cell.style.fontWeight ="bold"
                    if( message.status ==='Seen' ){
                        cell.style.color = "#008d15"
                    }else if( message.status ==='New'){
                        cell.style.color ="#1a73e8"
                    }
                }
                // Add buttons based on the index
                if (index === 7 ) {
                    const removeBtn = document.createElement('button');
                    removeBtn.classList.add('RemoveButton');
                    removeBtn.textContent = 'Remove';
                    removeBtn.addEventListener('click', () => {
                        // Handle make in progress button click
                        toggleRemovePopup();
                        populateRemovePopup('message',message);
                        
                        // This could be a function to change the status of the commande to 'In progress'
                    });
                    cell.appendChild(removeBtn);
                }
                row.appendChild(cell);
            });
            
            table.appendChild(row);
        
    });
    // Append the table to the parametres content
    parametresContent.appendChild(table);
}
function generatePromotionGrids(promotionsData) {
    var promotionContent = document.querySelector('.promotion-content');

    // Clear existing promotion content
    promotionContent.innerHTML = '';
    var promotionGrid = document.createElement('div');
    promotionGrid.classList.add('promotion-grid')

    // Loop through promotionsData to create promotion grids
    promotionsData.forEach(function(promotion, index) {
        var promotionItem = createPromotionItem(promotion);
        promotionGrid.appendChild(promotionItem);
    });
    promotionContent.appendChild(promotionGrid);
    // Create add promotion button
    var addPromotionButton = createButton('Add Promotion','AddButton',function() {
        toggleAddPopup();
        populateAddPopup('promotion')
    });

    // Append add promotion button to promotion content
    promotionContent.appendChild(addPromotionButton);
}
function createPromotionItem(promotion) {
    var promotionItem = document.createElement("div");
    promotionItem.classList.add("promotion-item");
    promotionItem.innerHTML = `
        <img src="${promotion.image_url}" alt="Promotion Image">
        <div class="promotion-details">
            <h3>${promotion.product_name}</h3>
            <p>${promotion.description}</p>
            <button class="ModifyButton">Modify</button>
            <button class="RemoveButton">Remove</button>
        </div>
    `;
    
    // Add event listener to show Modify Popup when clicked
    promotionItem.querySelector('.ModifyButton').addEventListener('click', function() {
        toggleModifyPopup();
        populateModifyPopup('promotion', promotion);
    });
    
    // Add event listener to show Remove Popup when clicked
    promotionItem.querySelector('.RemoveButton').addEventListener('click', function() {
        toggleRemovePopup();
        populateRemovePopup('promotion', promotion);
    });

    // Add event listener to show SingleProductPopup when clicked
    promotionItem.addEventListener('click', function(event) {
        var target = event.target;
        if (!target.classList.contains('ModifyButton') && !target.classList.contains('RemoveButton')) {
            // Check if any other popup is shown and hide it
            hideOtherPopups();
            // Show the SinglePromotionPopup
            var productpromoted = productData.find(product=>product.Name === promotion.product_name)
            toggleSingleProductPopup(productpromoted);
        }
    });

    return promotionItem;
}

function PopulateHistoryPopup(type,entry) {
    const HistoryContent = document.querySelector('#HistoryPopup .history-content');
    HistoryContent.innerHTML = ''; // Clear previous content
    
    // Create a table element for the question details
    const table = document.createElement('table');
    table.classList.add('history-table');
    
    // Create table header
    const headerRow = document.createElement('tr');
    if(type === 'commande'){
        const headers = ['Products Commanded', 'Address', 'Phone Number','Price', 'Time','Payment Method', 'Status', 'Remove'];

        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        table.appendChild(headerRow);
    
        entry.forEach(commande => {
            const row = document.createElement('tr');
            
            const orderDate = new Date(commande.order_time);
            const formattedOrderTime = orderDate.toLocaleString(); // Format the date and time
            
            // Add data cells
            const cells = [
                commande.products, // Products Commanded
                commande.addresse, // Address
                commande.phone_number, // Phone Number
                commande.price,
                formattedOrderTime, // Time
                commande.payment_method,
                commande.status, // Status
                '' // Placeholder for Remove button
            ];

            cells.forEach((cellData, index) => {
                const cell = document.createElement('td');
                cell.textContent = cellData;
                
                if (index === 6 ) {
                    cell.style.fontWeight ="bold";
                    if(commande.status === 'Under traitement'){
                        cell.style.color = "#1a73e8"
                    }else if(commande.status === 'Dislinked'){
                        cell.style.color = "#ff0000"
                    }else if(commande.status === 'Sended'){
                        cell.style.color = "#008d15"
                    }else if(commande.status === 'In progress'){
                        cell.style.color = "#d8cd34"
                    }
                }
                // Add button based on the index
                if (index === 7 ) {
                    const RemoveBtn = document.createElement('button');
                    RemoveBtn.classList.add('RemoveButton');
                    RemoveBtn.textContent = 'Remove';
                    RemoveBtn.addEventListener('click', () => {
                        // Handle Remove button click
                        toggleHistoryPopup();
                        toggleRemovePopup();
                        populateRemovePopup('commande',commande);
                    });
                    cell.appendChild(RemoveBtn);
                }
                row.appendChild(cell);
            });
            
            table.appendChild(row);
        });
    }else if(type === 'member'){
        const headers = ['Full Name', 'Email','Last Connection','Points Member Ship','Password','Admin','Modify','Remove'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        table.appendChild(headerRow);

        entry.forEach(member => {
            const row = document.createElement('tr');
            
            const ConnectionDate = new Date(member.lastConnection);
            const formattedConectionTime = ConnectionDate.toLocaleString(); // Format the date and time
            
            // Add data cells
            const cells = [
                member.fullname, // name
                member.email, // email
                formattedConectionTime,
                member.pointsfidele, // points fideles
                member.passwrd,
                member.admin === 1 ? 'yes' : 'no',
                '',//placeholder for Remove button
                '' // Placeholder for Remove button
            ];

            cells.forEach((cellData, index) => {
                const cell = document.createElement('td');
                cell.textContent = cellData;
                if(index === 5 ){
                    cell.style.fontWeight ="bold";
                    if(member.admin === 1 ){
                        cell.style.color = "#008d15";
                    }else{
                        cell.style.color = "#ff0000";
                    }
                }
                // Add button based on the index
                if (index === 6 ) {
                    const ModifyBtn = createButton('Modify','ModifyButton',() => {
                        // Handle Modify button click
                        toggleHistoryPopup();
                        toggleModifyPopup();
                        populateModifyPopup('member',member);
                    });
                    cell.appendChild(ModifyBtn);
                }
                // Add button based on the index
                if (index === 7) {
                    if(userData.memberid !== member.memberid){
                        const RemoveBtn = document.createElement('button');
                        RemoveBtn.classList.add('RemoveButton');
                        RemoveBtn.textContent = 'Remove';
                        RemoveBtn.addEventListener('click', () => {
                            // Handle Remove button click
                            toggleHistoryPopup();
                            toggleRemovePopup();
                            populateRemovePopup('member',member);
                        });
                        cell.appendChild(RemoveBtn);
                    }else{
                        const AdminBtn = createButton('Current Account','AdminButton',() => {
                            showHighPropertyMessages('It is the current account you are using right now and you cant remove it','rgb(255,35,35)')
                        });
                        cell.appendChild(AdminBtn);
                    }
                }
                row.appendChild(cell);
            });
            
            table.appendChild(row);
        });
    }else if(type === 'reclamation'){
        const headers = ['Message', 'Email','Phone Number','Addresse','Time Of Reclamation','Status','Respond','Remove'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        table.appendChild(headerRow);

        entry.forEach(reclamation => {
            const row = document.createElement('tr');
            
            const ReclamationDate = new Date(reclamation.timeOfReclamation);
            const formattedReclamationTime = ReclamationDate.toLocaleString(); // Format the date and time
            
            // Add data cells
            const cells = [
                reclamation.reclamation_msg, // msg
                membersData.find(member => member.memberid === reclamation.userID).email, // email
                reclamation.phoneNumber,
                reclamation.address, // address
                formattedReclamationTime,
                reclamation.status,
                reclamation.status ==='Responded'?reclamation.reclamation_respond:'None',
                '' // Placeholder for Remove button
            ];

            cells.forEach((cellData, index) => {
                const cell = document.createElement('td');
                cell.textContent = cellData;
                
                if(index === 5){
                    cell.style.fontWeight = "bold";
                    if(reclamation.status === 'Rejected' ){
                        cell.style.color = "#ff0000"
                    }else if(reclamation.status === 'New'){
                        cell.style.color ="#1a73e8"
                    }else if(reclamation.status === 'Liked'){
                        cell.style.color ="#008d15"
                    }else if(reclamation.status === 'Responded'){
                        cell.style.color ="#d8cd34"
                    }
                }
                // Add button based on the index
                if (index === 7 ) {
                    const RemoveBtn = document.createElement('button');
                    RemoveBtn.classList.add('RemoveButton');
                    RemoveBtn.textContent = 'Remove';
                    RemoveBtn.addEventListener('click', () => {
                        // Handle Remove button click
                        toggleHistoryPopup();
                        toggleRemovePopup();
                        populateRemovePopup('reclamation',reclamation);
                    });
                    cell.appendChild(RemoveBtn);
                }
                row.appendChild(cell);
            });
            
            table.appendChild(row);
        });
    }else if(type === 'comment'){
        const headers = ['Message', 'Name','Email','Data of Creation','Rating','Status','Remove'];
        headers.forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        
        table.appendChild(headerRow);

        entry.forEach(comment => {
            const row = document.createElement('tr');
            const CommentDate = new Date(comment.CreatedAt);
            const formattedComentTime = CommentDate.toLocaleString(); // Format the date and time
            
            // Add data cells
            const cells = [
                comment.Message, // message
                comment.Name, // name
                comment.Email,
                formattedComentTime, // time
                comment.Rating === 0 ?'None' : comment.Rating+' Stars',
                comment.status === 'Seen' ? `Seen` : 'New',
                ''//placeholder for Remove button
            ];

            
            cells.forEach((cellData, index) => {
                const cell = document.createElement('td');
                cell.textContent = cellData;

                if(index === 5){
                    cell.style.fontWeight="bold";
                    if(comment.status === 'Seen' ){
                        cell.style.color = "#1a73e8"
                    }else{
                        cell.style.color ="#008d15"
                    }
                }
                // Add button based on the index
                if (index === 6) {
                    const RemoveBtn = document.createElement('button');
                    RemoveBtn.classList.add('RemoveButton');
                    RemoveBtn.textContent = 'Remove';
                    RemoveBtn.addEventListener('click', () => {
                        // Handle Remove button click
                        toggleHistoryPopup();
                        toggleRemovePopup();
                        populateRemovePopup('comment',comment);
                    });
                    cell.appendChild(RemoveBtn);
                }
                  
                row.appendChild(cell);
            });
            
            table.appendChild(row);
        });
    }
    // Append table to modification content
    HistoryContent.appendChild(table);
    
}
function PopulateRespondPopup(reclamation,commande) {
    const RespondContent = document.querySelector('#RespondPopup .respond-content');
    RespondContent.innerHTML = ''; // Clear previous content
    
    const TitleComande = document.createElement('div');
    TitleComande.textContent ='The Commande Reclamed';
    TitleComande.style.position='center';
    TitleComande.style.fontWeight='bold';
    TitleComande.style.fontSize='30px';
    TitleComande.style.margin='20px';
    RespondContent.appendChild(TitleComande);
    // Create a table element for the question details
    const table1 = document.createElement('table');
    table1.classList.add('respond-table');
    
    // Create table header
    const headerRow1 = document.createElement('tr');

    const headers1 = ['Products Commanded', 'Address', 'Phone Number','Price', 'Time Of Commande','Payment Method', 'Status'];

    headers1.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow1.appendChild(th);
    });
        
    table1.appendChild(headerRow1);
    const row1 = document.createElement('tr');

    const orderDate = new Date(commande.order_time);
    const formattedOrderTime = orderDate.toLocaleString(); // Format the date and time
    
    // Add data cells
    const cells1 = [
        commande.products, // Products Commanded
        commande.addresse, // Address
        commande.phone_number, // Phone Number
        commande.price,
        formattedOrderTime, // Time
        commande.payment_method,
        commande.status  // Status 
    ];

    cells1.forEach((cellData, index) => {
        const cell = document.createElement('td');
        cell.textContent = cellData;
        
        // Add button based on the index
        if (index === 6 ) {
            cell.style.fontWeight ="bold";
            if(commande.status === 'Under traitement'){
                cell.style.color = "#1a73e8"
            }else if(commande.status === 'Dislinked'){
                cell.style.color = "#ff0000"
            }else if(commande.status === 'Sended'){
                cell.style.color = "#008d15"
            }else if(commande.status === 'In progress'){
                cell.style.color = "#d8cd34"
            }
        }
        row1.appendChild(cell);
    });
            
    table1.appendChild(row1);

    // Append table to respond content
    RespondContent.appendChild(table1);

    const TitleReclamation = document.createElement('div');
    TitleReclamation.textContent ='The Reclamation Sended';
    TitleReclamation.style.position='center';
    TitleReclamation.style.fontWeight='bold';
    TitleReclamation.style.fontSize='30px';
    TitleReclamation.style.margin='20px';
    RespondContent.appendChild(TitleReclamation);
    // Create a table element for the question details
    const table2 = document.createElement('table');
    table2.classList.add('respond-table');

    // Create table header
    const headerRow2 = document.createElement('tr');

    const headers2 = ['Message', 'Email','Phone Number','Addresse','Time Of Reclamation'];
    headers2.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow2.appendChild(th);
    });
        
    table2.appendChild(headerRow2);

    const row2 = document.createElement('tr');
    
    const ReclamationDate = new Date(reclamation.timeOfReclamation);
    const formattedReclamationTime = ReclamationDate.toLocaleString(); // Format the date and time
    
    // Add data cells
    const cells2 = [
        reclamation.reclamation_msg, // msg
        membersData.find(member => member.memberid === reclamation.userID).email, // email
        reclamation.phoneNumber,
        reclamation.address, // address
        formattedReclamationTime
    ];

    cells2.forEach((cellData) => {
        const cell = document.createElement('td');
        cell.textContent = cellData;

        row2.appendChild(cell);
    });
    
    table2.appendChild(row2);

    // Append table to respond content
    RespondContent.appendChild(table2);
    
    const RespondInput = document.createElement('input')
    RespondInput.setAttribute('placeholder', 'Your reponse For this Reclamation');
    RespondInput.setAttribute('type', 'text');
    RespondInput.classList.add('inputReponse')
    RespondInput.addEventListener('input', function() {
        const respond = this.value;

        const SubmitButton = document.querySelector('#RespondPopup .confirmButton'); // Select the Submit button correctly
        const existingErrorMessage = document.querySelector('.error-message');
        // Remove any existing error messages
        if (existingErrorMessage) {
            existingErrorMessage.remove();
        }

        SubmitButton.disabled = false;

        if (respond.trim() === '') {
            SubmitButton.disabled = true;
            return;
        }
        if(respond.length < 4 ){
            displayErrorMessage('Cant Set a Respond Shorter Than 4 caracters','New-Reponse','rgb(255, 35, 35)');
            SubmitButton.disabled = true;
            return;
        }
        displayErrorMessage("Valid Reponse", 'New-Reponse','rgb(35, 255, 35)');
    });
    RespondContent.appendChild(RespondInput);
    RespondContent.appendChild(document.createElement('br'))

    const buttonValidate = document.createElement('button');
    buttonValidate.classList.add('confirmButton');
    buttonValidate.textContent = "Confirm";
    buttonValidate.addEventListener('click', function() {
        submitRespond(reclamation);
    });
    
    RespondContent.appendChild(buttonValidate);

    const buttonCancel = document.createElement('button');
    buttonCancel.classList.add('cancelButton');
    buttonCancel.textContent = 'Cancel';
    buttonCancel.addEventListener('click', toggleRespondPopup);

    RespondContent.appendChild(buttonCancel);
}
function submitRespond(reclamation){
    const RespondInput = document.querySelector('#RespondPopup .inputReponse').value.trim();
    if(RespondInput === ''){
        return ;
    }
    reclamation.status ='Responded';
    reclamation.reclamation_respond = RespondInput;
    updateReclamationData(reclamation);
    message = {
        adminid : userData.memberid,
        adminname : userData.fullname,
        memberid : reclamation.userID,
        type :'Responded',
        reclamationmessage : reclamation.reclamation_msg,
        commandeDate : CommandesData.find(commande=> commande.id === reclamation.commandID).order_time,
        message :RespondInput,
        status : 'New'
    }
    addmessageData(message);
    toggleRespondPopup()

}
function populateRemovePopup(type,entry) {
    const removeContent = document.querySelector('#RemovePopup .remove-content');
    removeContent.innerHTML = ''; // Clear previous content
    
    const MessageShown = document.createElement('p');
    if(type === 'faq'){
        MessageShown.textContent='Are you sure you want to remove this question from the set of questions';
    }else if (type === 'product'){
        MessageShown.textContent='Are you sure you want to remove this product from the set of products';
    }else if (type === 'member'){
        MessageShown.textContent='Are you sure you want to remove this member from the set of members';
    }else if (type === 'promotion'){
        MessageShown.textContent='Are you sure you want to remove this promotion from the set of promotions';
    }else if (type === 'reclamation'){
        MessageShown.textContent='Are you sure you want to remove this reclamation from the set of reclamations';
    }else if (type === 'comment'){
        MessageShown.textContent='Are you sure you want to remove this comment from the set of comments';
    }else if (type === 'commande'){
        MessageShown.textContent='Are you sure you want to remove this comment from the set of comments';
    }else if (type === 'message'){
        MessageShown.textContent='Are you sure you want to remove this message from the set of messages';
    }

    removeContent.appendChild(MessageShown);

    const buttonConfirmRemove = document.createElement('button');
    buttonConfirmRemove.classList.add('confirmButton');
    buttonConfirmRemove.textContent = 'Confirm';
    buttonConfirmRemove.addEventListener('click', function() {
        if(type === 'faq'){
            removefaqQustion(entry);
        }else if(type === 'product'){
            removeproductData(entry);
        }else if (type === 'member') {
            removeMemberData(entry);
        }else if(type === 'promotion'){
            removePromotionData(entry);
        }else if(type === 'reclamation'){
            removeReclamationData(entry);
        }else if(type === 'comment'){
            removeCommentData(entry);
        }else if(type === 'commande'){
            removeCommandeData(entry);
        }else if(type === 'message'){
            removeMessageData(entry);
        }
        toggleRemovePopup();
        
    });

    removeContent.appendChild(buttonConfirmRemove);

    const buttonCancelRemove = document.createElement('button');
    buttonCancelRemove.classList.add('cancelButton');
    buttonCancelRemove.textContent = 'Cancel';
    buttonCancelRemove.addEventListener('click', function() {
        toggleRemovePopup();
    });

    removeContent.appendChild(buttonCancelRemove);

}

function showNewInput(entry, field, placeholderText, buttonText, updateFunction) {
    const modificationContent = document.querySelector('#ModifyPopup .modification-content');
    
    // Check if there's already an existing input field
    if (!modificationContent.querySelector('input[type="text"]')) {
        const buttons = document.querySelectorAll('#ModifyPopup .ModifyButton')
        buttons.forEach(button => { button.classList.toggle('hidden')});
        
        const newInput = document.createElement('input');
        newInput.setAttribute('placeholder', placeholderText);
        newInput.setAttribute('type', 'text');
        newInput.classList.add('inputNewField')
        modificationContent.appendChild(newInput);

        modificationContent.appendChild(document.createElement('br'));

        const buttonValidate = document.createElement('button');
        buttonValidate.classList.add('confirmButton');
        buttonValidate.textContent = buttonText;
        buttonValidate.addEventListener('click', function() {
            entry[field] = document.querySelector('#ModifyPopup .inputNewField').value.trim();
            updateFunction(entry);
            toggleModifyPopup();
        });

        modificationContent.appendChild(buttonValidate);

        const buttonCancel = document.createElement('button');
        buttonCancel.classList.add('cancelButton');
        buttonCancel.textContent = 'Cancel';
        buttonCancel.addEventListener('click', toggleModifyPopup);

        modificationContent.appendChild(buttonCancel);
    } else {
        showHighPropertyMessages('It\'s Impossible To duplicate Modifications', '#bb0d0d');
    }
}

// Function to update faq data on the server
function updateFaqData(FaqData) {
    fetch('https://oussamarestau.onrender.com/updateFaq', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(FaqData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update Faq data');
        }
        fetchFAQData();
        // Handle successful response
        showHighPropertyMessages('Faq data updated successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error updating Faq data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to update Faq data. Please try again later.', '#ff0000');
    });
}

function updateProductData(ProductData) {
    fetch('https://oussamarestau.onrender.com/updateProduct', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ProductData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update Product data');
        }
        fetchProductData();

        // Handle successful response
        showHighPropertyMessages('Product data updated successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error updating Product data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to update Product data. Please try again later.', '#ff0000');
    });
}
function updatePromotionData(promotion) {
    fetch('https://oussamarestau.onrender.com/updatePromotions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(promotion)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update promotion data');
        }
        return response.json(); // Parse response JSON
    })
    .then(data => {
        // Handle successful response
        console.log('Promotion data updated successfully:', data.message);
        fetchPromotionsData(); // Fetch updated promotions data
        showHighPropertyMessages('Promotion data updated successfully', '#008d15');
    })
    .catch(error => {
        console.error('Error updating promotion data:', error.message);
        // Display an error message to the user
        showHighPropertyMessages('Failed to update promotion data. Please try again later.', '#ff0000');
    });
}
function updateReclamationData(ReclamationData) {
    fetch('https://oussamarestau.onrender.com/updateReclamation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ReclamationData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update Reclamation data');
        }
        fetchReclamationsData();

        // Handle successful response
        showHighPropertyMessages('Reclamation data updated successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error updating Comment data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to update Reclamation data. Please try again later.', '#ff0000');
    });
}

function updateCommentesData(CommentData) {
    fetch('https://oussamarestau.onrender.com/updateCommentes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(CommentData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update Comment data');
        }
        fetchCommentsData();

        // Handle successful response
        showHighPropertyMessages('Comment data updated successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error updating Comment data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to update Comment data. Please try again later.', '#ff0000');
    });
}
function removefaqQustion(FaqData){
    fetch('https://oussamarestau.onrender.com/removeFaq', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(FaqData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove Faq data');
        }
        fetchFAQData();
        // Handle successful response
        showHighPropertyMessages('Faq data removed successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error removing Faq data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to remove Faq data. Please try again later.', '#ff0000');
    });
}
function removeMessageData(messageData){
    fetch('https://oussamarestau.onrender.com/removeMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove message data');
        }
        fetchMessagesData();
        // Handle successful response
        showHighPropertyMessages('message data removed successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error removing message data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to remove message data. Please try again later.', '#ff0000');
    });
}
function removePromotionData(PromotionData){
    fetch('https://oussamarestau.onrender.com/removePromotions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(PromotionData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove Promotion data');
        }
        fetchPromotionsData();
        // Handle successful response
        showHighPropertyMessages('Promotion data removed successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error removing Promotion data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to remove Promotion data. Please try again later.', '#ff0000');
    });
}
function removeReclamationData(ReclamationData){
    fetch('https://oussamarestau.onrender.com/removeReclamation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ReclamationData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove Reclamation data');
        }
        fetchReclamationsData();
        // Handle successful response
        showHighPropertyMessages('Reclamation data removed successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error removing Reclamation data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to remove Reclamation data. Please try again later.', '#ff0000');
    });
}
function removeCommentData(CommentData){
    fetch('https://oussamarestau.onrender.com/removeComment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(CommentData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove Comment data');
        }
        fetchCommentsData();
        // Handle successful response
        showHighPropertyMessages('Comment data removed successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error removing Comment data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to remove Comment data. Please try again later.', '#ff0000');
    });
}
function removeCommandeData(CommandeData){
    fetch('https://oussamarestau.onrender.com/removeCommande', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(CommandeData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove Commande data');
        }
        fetchCommandesData();
        fetchReclamationsData();
        // Handle successful response
        showHighPropertyMessages('Commande data removed successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error removing Commande data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to remove Commande data. Please try again later.', '#ff0000');
    });
}
function removeproductData(ProductData){
    fetch('https://oussamarestau.onrender.com/removeProduct', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(ProductData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove Product data');
        }
        fetchProductData();
        // Handle successful response
        showHighPropertyMessages('Product data removed successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error removing Product data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to remove Product data. Please try again later.', '#ff0000');
    });
}
function removeMemberData(MemberData){
    fetch('https://oussamarestau.onrender.com/removeMember', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(MemberData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to remove member data');
        }
        fetchMembersData();
        fetchCommandesData();
        fetchCommentsData();
        fetchReclamationsData();
        fetchProductData();
        // Handle successful response
        showHighPropertyMessages('member data removed successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error removing member data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to remove member data. Please try again later.', '#ff0000');
    });
}
function addfaqQustion(FaqData){
    fetch('https://oussamarestau.onrender.com/insertfaqs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(FaqData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add Faq data');
        }
        fetchFAQData();
        // Handle successful response
        showHighPropertyMessages('Faq data added successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error adding Faq data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to add Faq data. Please try again later.', '#ff0000');
    });
}
function addmessageData(message){
    fetch('https://oussamarestau.onrender.com/insertmessages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add message data');
        }
        fetchMessagesData();
        // Handle successful response
        showHighPropertyMessages('message data added successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error adding message data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to add message data. Please try again later.', '#ff0000');
    });
}
function displayFAQ(faqData) {
    const faqContainer = document.querySelector('#All-faqs .faq-content');
    faqContainer.innerHTML = ''; // Clear previous content
    
    // Create table element
    const table = document.createElement('table');
    table.classList.add('faq-table');
    
    // Create table header
    const headerRow = document.createElement('tr');
    const headers = ['Question', 'Answer', 'Modify','Remove'];
    
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    
    table.appendChild(headerRow);
    
    // Append rows directly to the table
    faqData.forEach(entry => {
        const row = document.createElement('tr');
        
        // Add data cells
        const cells = [
            entry.Question,
            entry.Answer,
            createButton('Modify', 'ModifyButton', () => {toggleModifyPopup();populateModifyPopup('faq',entry); }),
            createButton('Remove', 'RemoveButton', () => { toggleRemovePopup();populateRemovePopup('faq',entry) })
        ];
        
        cells.forEach(cellData => {
            const cell = document.createElement('td');
            if (cellData instanceof Node) {
                cell.appendChild(cellData);
            } else {
                cell.textContent = cellData;
            }
            row.appendChild(cell);
        });
        
        table.appendChild(row);
    });
    
    faqContainer.appendChild(table);

    const buttonAddfaq = document.createElement('button');
    buttonAddfaq.classList.add('AddButton');
    buttonAddfaq.textContent = 'Add New Faq';
    buttonAddfaq.addEventListener('click', function() {
        toggleAddPopup();
        populateAddPopup('faq');
    });
    faqContainer.appendChild(buttonAddfaq);
}

function populateAddPopup(type){
    const AddContent = document.querySelector('#AddPopup .add-content');
    if(type === 'faq'){
        const newQuestionInput = document.createElement('input');
        newQuestionInput.setAttribute('placeholder', 'New Question');
        newQuestionInput.setAttribute('type', 'text');
        newQuestionInput.classList.add('inputNewQustion');
        newQuestionInput.addEventListener('input', function() {
            const NewQuestion = this.value;
    
            const SubmitButton = document.querySelector('#AddPopup .confirmButton'); // Select the Submit button correctly
            const existingErrorMessage = document.querySelector('.error-message');
            // Remove any existing error messages
            if (existingErrorMessage) {
                existingErrorMessage.remove();
            }
            SubmitButton.disabled = false;

            
            if (NewQuestion.trim() === '') {
                return;
            }
            if(NewQuestion.length <10 ){
                displayErrorMessage('Cant Set a Question Shorter Than 10 caracters','New-Question','rgb(255, 35, 35)');
                SubmitButton.disabled = true ;
                return;
            }
            displayErrorMessage("Valid New Question", 'New-Question','rgb(35, 255, 35)');
        });
        AddContent.appendChild(newQuestionInput);
        
        AddContent.appendChild(document.createElement('br'));

        const newAnswerInput = document.createElement('input');
        newAnswerInput.setAttribute('placeholder', 'New Answer');
        newAnswerInput.setAttribute('type', 'text');
        newAnswerInput.classList.add('inputNewAnswer');
        newAnswerInput.addEventListener('input', function() {
            const NewAnswer = this.value;
    
            const SubmitButton = document.querySelector('#AddPopup .confirmButton'); // Select the Submit button correctly
            const existingErrorMessage = document.querySelector('.error-message');
            // Remove any existing error messages
            if (existingErrorMessage) {
                existingErrorMessage.remove();
            }
            SubmitButton.disabled = false;

            
            if (NewAnswer.trim() === '') {
                return;
            }
            if(NewAnswer.length <10 ){
                displayErrorMessage('Cant Set a Answer Shorter Than 10 caracters','New-Answer','rgb(255, 35, 35)');
                SubmitButton.disabled = true ;
                return;
            }
            displayErrorMessage("Valid New Answer", 'New-Answer','rgb(35, 255, 35)');
        });

        AddContent.appendChild(newAnswerInput);
        AddContent.appendChild(document.createElement('br'));

        const buttonAddfaq = document.createElement('button');
        buttonAddfaq.classList.add('confirmButton');
        buttonAddfaq.textContent = 'Confirm Faq';
        buttonAddfaq.addEventListener('click', submitfaq);
        AddContent.appendChild(buttonAddfaq);
    }else if(type ==='product') {
        const newProductNameInput = document.createElement('input');
        newProductNameInput.setAttribute('placeholder','New Product Name');
        newProductNameInput.setAttribute('type','text');
        newProductNameInput.classList.add('inputNewProductName')
        newProductNameInput.addEventListener('input', function() {
            const nameProduct = this.value;
    
            const SubmitButton = document.querySelector('#AddPopup .confirmButton'); // Select the Submit button correctly
            const existingErrorMessage = document.querySelector('.error-message');
            // Remove any existing error messages
            if (existingErrorMessage) {
                existingErrorMessage.remove();
            }
            SubmitButton.disabled = false;

            
            if (nameProduct.trim() === '') {
                return;
            }
            if(nameProduct.length < 4 ){
                displayErrorMessage('Cant Set a Product Name Shorter Than 4 caracters','New-Product-Name','rgb(255, 35, 35)');
                return;
            }

            product = productData.find(product => product.Name === nameProduct);
            if (!product) {
                displayErrorMessage("Valid New Name", 'New-Product-Name','rgb(35, 255, 35)');
                
            }else{
                displayErrorMessage("Invalid New Name Already exist", 'New-Product-Name','rgb(255, 35, 35)');
                SubmitButton.disabled = true ;
            }
        });
        AddContent.appendChild(newProductNameInput);
        AddContent.appendChild(document.createElement('br'));

        const newProductCategorie = document.createElement('input');
        newProductCategorie.setAttribute('placeholder', 'Category of Product');
        newProductCategorie.setAttribute('type', 'text');
        newProductCategorie.classList.add('inputNewProductCategorie');
        newProductCategorie.addEventListener('input', function() {
            const CategorieProduct = this.value;
 
            const SubmitButton = document.querySelector('#AddPopup .confirmButton'); // Select the Submit button correctly
            const existingErrorMessage = document.querySelector('.error-message');
            // Remove any existing error messages
            if (existingErrorMessage) {
                existingErrorMessage.remove();
            }
            // Enable password field and login button
            SubmitButton.disabled = false;

            
            if (CategorieProduct.trim() === '') {
                return; 
            }
            if(CategorieProduct.length < 4 ){
                displayErrorMessage('Cant Set a Product Category Shorter Than 4 caracters','New-Product-Categorie-Name','rgb(255, 35, 35)');
                return;
            }
 
            product = productData.find(product => product.Category === CategorieProduct);
            if (product) {
                displayErrorMessage("Categorie Already exist !", 'New-Product-Categorie-Name','rgb(35, 255, 35)');
                
            }else{
                displayErrorMessage("New Categorie Inserted !", 'New-Product-Categorie-Name','rgb(35, 255, 35)');
                SubmitButton.disabled = true ;
            }
        });
        AddContent.appendChild(newProductCategorie);
        AddContent.appendChild(document.createElement('br'));
        
        const newProductImage = document.createElement('input');
        newProductImage.setAttribute('placeholder', 'Image of Product');
        newProductImage.setAttribute('type', 'text');
        newProductImage.classList.add('inputNewProductImage');

        AddContent.appendChild(newProductImage);
        AddContent.appendChild(document.createElement('br'));

        const newProductDescription = document.createElement('input');
        newProductDescription.setAttribute('placeholder', 'Description of Product');
        newProductDescription.setAttribute('type', 'text');
        newProductDescription.classList.add('inputNewProductDescription');
        newProductDescription.addEventListener('input', function() {
            const DescriptionProduct = this.value;
 
            const SubmitButton = document.querySelector('#AddPopup .confirmButton'); // Select the Submit button correctly
            const existingErrorMessage = document.querySelector('.error-message');
            // Remove any existing error messages
            if (existingErrorMessage) {
                existingErrorMessage.remove();
            }

            SubmitButton.disabled = false;

            
            if (DescriptionProduct.trim() === '') {
                return; 
            }
            if(DescriptionProduct.length < 10 ){
                displayErrorMessage('Cant Set a Product Description Shorter Than 10 caracters','New-Product-Description-Name','rgb(255, 35, 35)');
                SubmitButton.disabled = true;
                return;
            }
            displayErrorMessage("Valid Description Of the Product", 'New-Product-Description-Name','rgb(35, 255, 35)');

        });

        AddContent.appendChild(newProductDescription);
        AddContent.appendChild(document.createElement('br'));

        const newProductPrice = document.createElement('input');
        newProductPrice.setAttribute('placeholder', 'Price of Product');
        newProductPrice.setAttribute('type', 'number');
        newProductPrice.classList.add('inputNewProductPrice');
        newProductPrice.addEventListener('input', function() {
            const PriceProduct = this.value;
 
            const SubmitButton = document.querySelector('#AddPopup .confirmButton'); // Select the Submit button correctly
            const existingErrorMessage = document.querySelector('.error-message');
            // Remove any existing error messages
            if (existingErrorMessage) {
                existingErrorMessage.remove();
            }

            SubmitButton.disabled = false;

            
            if(PriceProduct <= 0 || PriceProduct >= 1000 ){
                displayErrorMessage('Cant Set a Price Higher Than 1000 Dirhams','New-Product-Price-Name','rgb(255, 35, 35)');
                SubmitButton.disabled = true;
                return;
            }
            displayErrorMessage("Valid Price Of the Product", 'New-Product-Price-Name','rgb(35, 255, 35)');

        });

        AddContent.appendChild(newProductPrice);
        AddContent.appendChild(document.createElement('br'));

        const buttonAddProduct = document.createElement('button');
        buttonAddProduct.classList.add('confirmButton');
        buttonAddProduct.textContent = 'Confirm Product';
        buttonAddProduct.addEventListener('click', submitProduct);
        AddContent.appendChild(buttonAddProduct);
    }else if(type ==='promotion') {
        const newPromotionNameInput = document.createElement('input');
        newPromotionNameInput.setAttribute('placeholder','New Promotion For Product with the Name');
        newPromotionNameInput.setAttribute('type','text');
        newPromotionNameInput.classList.add('InputnewPromotionName')
        newPromotionNameInput.addEventListener('input', function() {
            const namePromotion = this.value;
    
            const SubmitButton = document.querySelector('#AddPopup .confirmButton'); // Select the Submit button correctly
            const existingErrorMessage = document.querySelector('.error-message');
            // Remove any existing error messages
            if (existingErrorMessage) {
                existingErrorMessage.remove();
            }
            SubmitButton.disabled = false;

            
            if (namePromotion.trim() === '') {
                return;
            }
            if(namePromotion.length < 4 ){
                displayErrorMessage('Cant Set a Product Name Shorter Than 4 caracters','New-promotion-Name','rgb(255, 35, 35)');
                return;
            }

            product = productData.find(product => product.Name === namePromotion);
            if (product) {
                displayErrorMessage("Valid Name Promotion Of product", 'New-promotion-Name','rgb(35, 255, 35)');
                
            }else{
                displayErrorMessage("Invalid Name Promotion Product Doesn't exist", 'New-promotion-Name','rgb(255, 35, 35)');
                SubmitButton.disabled = true ;
            }
        });
        AddContent.appendChild(newPromotionNameInput);
        AddContent.appendChild(document.createElement('br'));
        
        const newPromotionImage = document.createElement('input');
        newPromotionImage.setAttribute('placeholder', 'Image of Product');
        newPromotionImage.setAttribute('type', 'text');
        newPromotionImage.classList.add('inputNewPromotiontImage');

        AddContent.appendChild(newPromotionImage);
        AddContent.appendChild(document.createElement('br'));

        const newPromotionDescription = document.createElement('input');
        newPromotionDescription.setAttribute('placeholder', 'Description of Promotion');
        newPromotionDescription.setAttribute('type', 'text');
        newPromotionDescription.classList.add('inputNewPromotionDescription');
        newPromotionDescription.addEventListener('input', function() {
            const DescriptionPromotion = this.value;
 
            const SubmitButton = document.querySelector('#AddPopup .confirmButton'); // Select the Submit button correctly
            const existingErrorMessage = document.querySelector('.error-message');
            // Remove any existing error messages
            if (existingErrorMessage) {
                existingErrorMessage.remove();
            }

            SubmitButton.disabled = false;

            
            if (DescriptionPromotion.trim() === '') {
                return; 
            }
            if(DescriptionPromotion.length < 10 ){
                displayErrorMessage('Cant Set a Promotion Description Shorter Than 10 caracters','New-Promotion-Description-Name','rgb(255, 35, 35)');
                SubmitButton.disabled = true;
                return;
            }
            displayErrorMessage("Valid Description Of the Promotion", 'New-Promotion-Description-Name','rgb(35, 255, 35)');

        });

        AddContent.appendChild(newPromotionDescription);
        AddContent.appendChild(document.createElement('br'));

        const buttonAddPromotion = document.createElement('button');
        buttonAddPromotion.classList.add('confirmButton');
        buttonAddPromotion.textContent = 'Confirm Promotion';
        buttonAddPromotion.addEventListener('click', submitPromotion);
        AddContent.appendChild(buttonAddPromotion);
    }
    const buttonCancelfaq = document.createElement('button');
    buttonCancelfaq.classList.add('cancelButton');
    buttonCancelfaq.textContent = 'Cancel';
    buttonCancelfaq.addEventListener('click', toggleAddPopup);
    AddContent.appendChild(buttonCancelfaq);

}
function submitfaq(){
    const newQuestion = document.querySelector('#AddPopup .inputNewQustion').value.trim();
    const newAnswer = document.querySelector('#AddPopup .inputNewAnswer').value.trim();

    if(newQuestion === ''|| newAnswer === '' ){
        displayErrorMessage('Cant Submit With a Null Value in One of the inputs','New-Answer','rgb(255, 35, 35)');
        return;
    }
    const faqQuestion = {
        Question : newQuestion,
        Answer :newAnswer
    }
    addfaqQustion(faqQuestion);
    toggleAddPopup();
}

function submitProduct(){
    const newProductName = document.querySelector('#AddPopup .inputNewProductName').value.trim();
    const newProductCategorie = document.querySelector('#AddPopup .inputNewProductCategorie').value.trim();
    const newProductImage = document.querySelector('#AddPopup .inputNewProductImage').value.trim();
    const newProductDescription = document.querySelector('#AddPopup .inputNewProductDescription').value.trim();
    const newProductPrice = document.querySelector('#AddPopup .inputNewProductPrice').value ;
    
    if(newProductName === ''|| newProductCategorie === '' || newProductImage === '' || newProductDescription === '' || newProductPrice.trim() ==='' ){
        displayErrorMessage('Cant Submit With a Null Value in One of the inputs','New-Product-Price-Name','rgb(255, 35, 35)');
        return;
    }
    
    const Product = {
        Name : newProductName,
        Category :newProductCategorie,
        ImagePath : newProductImage,
        Description : newProductDescription,
        Price : newProductPrice
    }
    addProductData(Product);
    toggleAddPopup();
}
function submitPromotion(){
    const newPromotionProductName = document.querySelector('#AddPopup .InputnewPromotionName').value.trim();
    const newPromotionImage = document.querySelector('#AddPopup .inputNewPromotiontImage').value.trim();
    const newPromotionDescription = document.querySelector('#AddPopup .inputNewPromotionDescription').value.trim();
    
    if(newPromotionProductName === ''|| newPromotionImage === '' || newPromotionDescription === '' ){
        displayErrorMessage('Cant Submit With a Null Value in One of the inputs','New-Promotion-Description-Name','rgb(255, 35, 35)');
        return;
    }
    
    const Promotion = {
        product_name : newPromotionProductName,
        image_url :newPromotionImage,
        description : newPromotionDescription
    }
    addPromotionData(Promotion);
    toggleAddPopup();
}
function addProductData(Product){
    fetch('https://oussamarestau.onrender.com/insertproducts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Product)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add Product data');
        }
        fetchProductData();
        // Handle successful response
        showHighPropertyMessages('Product data added successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error adding Product data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to add Product data. Please try again later.', '#ff0000');
    });
}
function addPromotionData(Promotion){
    fetch('https://oussamarestau.onrender.com/Promotions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Promotion)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add Promotion data');
        }
        fetchPromotionsData();
        // Handle successful response
        showHighPropertyMessages('Promotion data added successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error adding Promotion data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to add Promotion data. Please try again later.', '#ff0000');
    });
}
// Toggle History popup
function toggleHistoryPopup() {
    var HistoryPopup = document.getElementById("HistoryPopup");
    var isHidden = HistoryPopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); 
    } else {
        HistoryPopupContent = document.querySelector('#HistoryPopup .history-content');
        HistoryPopupContent.innerHTML = '';
        toggleOverlay(); 
    }
}
// Toggle Respond popup
function toggleRespondPopup() {
    var RespondPopup = document.getElementById("RespondPopup");
    var isHidden = RespondPopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); 
    } else {
        RespondPopupContent = document.querySelector('#RespondPopup .respond-content');
        RespondPopupContent.innerHTML = '';
        toggleOverlay(); 
    }
}
// Toggle Message popup
function toggleMessagePopup(member) {
    var MessagePopup = document.getElementById("MessagePopup");
    var isHidden = MessagePopup.classList.toggle("hidden");
    const existingErrorMessage = document.querySelector('.error-message');
    const ModifyPopupInput = MessagePopup.querySelector('input[type="text"]');
    const buttonconfirm = document.querySelector('#MessagePopup .confirmButton');
    if (!isHidden) {
        ModifyPopupInput.addEventListener('input',()=>{
            submitMessage();
        })
        buttonconfirm.addEventListener('click',(event)=>{
            event.preventDefault()
            const inputMessage = document.querySelector('#MessagePopup #Message-Send').value
            if(inputMessage.trim() === '' ){
                return;
            }
            message = {
                adminid : userData.memberid,
                adminname : userData.fullname,
                memberid : member.memberid,
                commandeDate :getCurrentTime() ,
                type : 'Message',
                message:inputMessage,
                status : 'New'
            }
            addmessageData(message);
            showHighPropertyMessages('Message sended Succecfuly','#077317');
            toggleMessagePopup();
        })
        toggleOverlay();
    } else {
        
        ModifyPopupInput.value ='';
        ModifyPopupInput.focus()
        // Remove any existing error messages
        if (existingErrorMessage) {
            existingErrorMessage.remove();
        }
        toggleOverlay(); 
    }
}
function submitMessage(){
    const inputMessage = document.querySelector('#MessagePopup #Message-Send').value
    const buttonconfirm = document.querySelector('#MessagePopup .confirmButton');
    buttonconfirm.disabled =false
    if(inputMessage.trim() === '' ){
        return;
    }
    if(inputMessage.length < 10){
        displayErrorMessage('Message is too short','New-Message','#bb0d0d');
        buttonconfirm.disabled =true
        return;
    }
    displayErrorMessage('Message Valid','New-Message','rgb(35,255,25)');
    
}

// Toggle Modify popup
function toggleModifyPopup() {
    var ModifyPopup = document.getElementById("ModifyPopup");
    var isHidden = ModifyPopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); 
    } else {
        ModifyPopupContent = document.querySelector('#ModifyPopup .modification-content');
        ModifyPopupContent.innerHTML = '';
        toggleOverlay(); 
    }
}
// Toggle Remove popup
function toggleRemovePopup() {
    var RemovePopup = document.getElementById("RemovePopup");
    var isHidden = RemovePopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); 
    } else {
        RemovePopupContent = document.querySelector('#RemovePopup .remove-content');
        RemovePopupContent.innerHTML = '';
        toggleOverlay(); 
    }
}
// Toggle Add popup
function toggleAddPopup() {
    var AddPopup = document.getElementById("AddPopup");
    var isHidden = AddPopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); 
    } else {
        AddPopupContent = document.querySelector('#AddPopup .add-content');
        AddPopupContent.innerHTML = '';
        toggleOverlay(); 
    }
}

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
        fetchMembersData(membersData);
        showHighPropertyMessages('User data updated successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error updating user data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to update user data. Please try again later.', '#ff0000');
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
    const buttonAddproduct = document.createElement('button');
    buttonAddproduct.classList.add('AddButton');
    buttonAddproduct.textContent = 'Add New Product';
    buttonAddproduct.addEventListener('click', function() {
        toggleAddPopup();
        populateAddPopup('product');
    });
    productsDiv.appendChild(buttonAddproduct);

}
// Function to create a product item
function createProductItem(product) {
    var productItem = document.createElement("div");
    productItem.classList.add("product-unity");
    productItem.innerHTML = `
        <img src="${product.ImagePath}" alt="${product.Name}">
        <h3>${product.Name}</h3>
        <p>Price: ${product.Price}</p>
        <p>${product.Description}</p>
        <button class="ModifyButton" >Modify</button>
        <button class="RemoveButton" >Remove</button>
    `;
    // Add event listener to show SingleProductPopup when clicked
    productItem.querySelector('.ModifyButton').addEventListener('click', function() {
        toggleModifyPopup();
        populateModifyPopup('product',product) 
    });
    // Add event listener to show SingleProductPopup when clicked
    productItem.querySelector('.RemoveButton').addEventListener('click', function() {
        toggleRemovePopup();
        populateRemovePopup('product',product);
    });

    // Add event listener to show SingleProductPopup when clicked
    productItem.addEventListener('click', function(event) {
        var target = event.target;
        if (!target.classList.contains('ModifyButton') && !target.classList.contains('RemoveButton')) {
            // Check if any other popup is shown and hide it
            hideOtherPopups();
            // Show the SingleProductPopup
            toggleSingleProductPopup(product);
        }
    });

    return productItem;
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
        productDetails.classList.add("product-preview");
        productDetails.innerHTML = `
            <img src="${product.ImagePath}" alt="${product.Name}">
            <h3>${product.Name}</h3>
            <p>Price: ${product.Price}</p>
            <p>${product.Description}</p>
            <button class="ModifyButton" onclick="">Modify</button>
            <button class="RemoveButton" onclick="">Remove</button>
        `;
        productSection.appendChild(productDetails);
        // Add event listener to show SingleProductPopup when clicked
        productDetails.querySelector('.ModifyButton').addEventListener('click', function() {
            toggleSingleProductPopup();
            toggleModifyPopup();
            populateModifyPopup('product',product) 
        });
        // Add event listener to show SingleProductPopup when clicked
        productDetails.querySelector('.RemoveButton').addEventListener('click', function() {
            toggleSingleProductPopup();
            toggleRemovePopup();
            populateRemovePopup('product',product);
        });
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
// Function to hide other popups before showing SingleProductPopup
function hideOtherPopups() {
    var searchPopup = document.getElementById("searchPopup");

    // Check if the popups are currently visible
    var isSearchPopupHidden = searchPopup.classList.contains("hidden");

    if (!isSearchPopupHidden) {
        toggleSearchPopup();
    }

}
// Function to update commande data on the server
function updateCommandeData(CommandeData) {
    fetch('https://oussamarestau.onrender.com/updateCommandes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(CommandeData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update commade data');
        }
        // Handle successful response
        fetchCommandesData();
        showHighPropertyMessages('Commande data updated successfully', '#008d15');
       
    })
    .catch(error => {
        console.error('Error updating Commande data:', error);
        // Display an error message to the user
        showHighPropertyMessages('Failed to update Commande data. Please try again later.', '#ff0000');
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
// Close button event listener for search popup
document.querySelector("#searchPopup .closeButton").addEventListener("click", function(event) {
    toggleSearchPopup();
});

// Close button event listener for modify popup
document.querySelector("#ModifyPopup .closeButton").addEventListener("click", function(event) {
    toggleModifyPopup();
});
// Function to display search results in the search popup
function toggleSearchPopup(searchResults) {
    var searchPopup = document.getElementById("searchPopup");
    var isHidden = searchPopup.classList.toggle("hidden");
    if (!isHidden) {
        displaySearchResults(searchResults); // Populate searched products in the popup
        toggleOverlay(); 
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden
    }
}

// Function to display search results in the Informations popup
function toggleShowInfoPopup() {
    var showInfoPopup = document.getElementById("showInfoPopup");
    var isHidden = showInfoPopup.classList.toggle("hidden");
    if (!isHidden) {
        toggleOverlay(); 
    } else {
        toggleOverlay(); // Remove overlay when the popup is hidden
    }
}

function displaySearchResults(searchResults) {
    const resultSearchContainer = document.getElementById('ResultSearch');
    resultSearchContainer.innerHTML = ''; // Clear previous search results

    for (const key in searchResults) {
        if (searchResults.hasOwnProperty(key) && searchResults[key].length > 0) {
            const resultSection = document.createElement('div');
            resultSection.classList.add('searchResultSection');

            const title = document.createElement('h2');
            title.classList.add('title-search');
            title.textContent = key;
            resultSection.appendChild(title);

            // Create a grid for the current key
            const grid = document.createElement('div');
            grid.classList.add('searchResultGrid');
            
            // Create grid items for each result
            for (const result of searchResults[key]) {
                const gridItem = createGridItem(result, key);
                grid.appendChild(gridItem);
            }

            resultSection.appendChild(grid);
            resultSearchContainer.appendChild(resultSection);
        }
    }
}

function createGridItem(item, category) {
    const gridItem = document.createElement('div');
    gridItem.classList.add('gridItem');

    switch (category) {
        case 'products':
            gridItem.appendChild(createProductItem(item));
            break;
        case 'faqs':
            gridItem.appendChild(createFAQGrid(item));
            break;
        case 'members':
            gridItem.appendChild(createMemberGrid(item));
            break;
        case 'commandes':
            gridItem.appendChild(createCommandeGrid(item));
            break;
        case 'comments':
            gridItem.appendChild(createCommentGrid(item));
            break;
        case 'reclamations':
            gridItem.appendChild(createReclamationGrid(item));
            break;
        default:
            // For unknown categories, display a simple text representation
            gridItem.textContent = JSON.stringify(item);
            break;
    }

    return gridItem;
}

function createFAQGrid(faq) {
    const faqGrid = document.createElement('div');
    faqGrid.classList.add('product-unity');
    faqGrid.innerHTML = `
        <p><strong>Question:</strong><br> ${faq.Question}</p>
        <p><strong>Answer:</strong><br> ${faq.Answer}</p>
        <button class="ModifyButton">Modify</button>
        <button class="RemoveButton">Remove</button>
    `;
    // Add event listeners for Modify and Remove buttons
    // Add event listener to show SingleProductPopup when clicked
    faqGrid.querySelector('.ModifyButton').addEventListener('click', function() {
        toggleSearchPopup();
        toggleModifyPopup();
        populateModifyPopup('faq',faq) 
    });
    // Add event listener to show SingleProductPopup when clicked
    faqGrid.querySelector('.RemoveButton').addEventListener('click', function() {
        toggleSearchPopup();
        toggleRemovePopup();
        populateRemovePopup('faq',faq);
    });
    return faqGrid;
}

function createMemberGrid(member) {
    const lastConnection = new Date(member.lastConnection).toLocaleString(); // Convert timestamp to readable date format

    const memberGrid = document.createElement('div');
    memberGrid.classList.add('product-unity');
    memberGrid.innerHTML = `
        <p><strong>Full Name:</strong><br> ${member.fullname}</p>
        <p><strong>Email:</strong><br> ${member.email}</p>
        <p><strong>Points:</strong><br> ${member.pointsfidele}</p>
        <p><strong>Admin:</strong><br> ${member.admin === 1 ? 'Yes' : 'No'}</p>
        <p><strong>Last Connection:</strong><br> ${lastConnection}</p>
        <button class="ModifyButton">Modify</button>
        ${member.memberid !== userData.memberid ? '<button class="RemoveButton">Remove</button>' : '<button class="AdminButton">Current Account</button>'}
    `;
    
    // Add event listener for Modify button
    memberGrid.querySelector('.ModifyButton').addEventListener('click', function() {
        toggleSearchPopup();
        toggleModifyPopup();
        populateModifyPopup('member', member);
    });
    
    if (member.memberid !== userData.memberid) {
        // Add event listener for Remove button
        memberGrid.querySelector('.RemoveButton').addEventListener('click', function() {
            toggleSearchPopup();
            toggleRemovePopup();
            populateRemovePopup('member', member);
        });
    } else {
        // If it's the current account, handle differently
        memberGrid.querySelector('.AdminButton').addEventListener('click', function() {
            showHighPropertyMessages('This is the current account you are using right now and you cannot remove it.', 'rgb(255,35,35)');
        });
    }
    
    return memberGrid;
}

function createCommandeGrid(commande) {
    const orderTime = new Date(commande.order_time).toLocaleString(); // Convert timestamp to readable date format

    const commandeGrid = document.createElement('div');
    commandeGrid.classList.add('product-unity');
    commandeGrid.innerHTML = `
        <p><strong>Products:</strong><br> ${commande.products}</p>
        <p><strong>Address:</strong><br> ${commande.addresse}</p>
        <p><strong>Phone Number:</strong><br> ${commande.phone_number}</p>
        <p><strong>Payment Method:</strong><br> ${commande.payment_method}</p>
        <p><strong>Price:</strong><br> ${commande.price}</p>
        <p><strong>Order Time:</strong><br> ${orderTime}</p>
        <p style="color:${commande.status === 'Under traitement'?'#1a73e8':commande.status === 'Dislinked'?'#ff0000':commande.status === 'Sended'?'#008d15':'#d8cd34'}">
        <strong>Status:</strong><br> ${commande.status}</p>
        <button class="RemoveButton">Remove</button>
    `;
    // Add event listener to show SingleProductPopup when clicked
    commandeGrid.querySelector('.RemoveButton').addEventListener('click', function() {
        toggleSearchPopup();
        toggleRemovePopup();
        populateRemovePopup('commande', commande);
    });
    return commandeGrid;
}

function createCommentGrid(comment) {
    const createdAt = new Date(comment.CreatedAt).toLocaleString(); // Convert timestamp to readable date format

    const commentGrid = document.createElement('div');
    commentGrid.classList.add('product-unity');
    commentGrid.innerHTML = `
        <p><strong>Message:</strong><br> ${comment.Message}</p>
        <p><strong>Name:</strong><br> ${comment.Name}</p>
        <p><strong>Email:</strong><br> ${comment.Email}</p>
        <p><strong>Rating:</strong><br> ${comment.Rating} Stars</p>
        <p style="color: ${comment.status === 'New'? '#008d15':'#1a73e8'}"><strong>Status:</strong><br> ${comment.status}</p>
        <p><strong>Date:</strong><br> ${createdAt}</p>
        <button class="RemoveButton">Remove</button>
    `;
    
    // Add event listener to show SingleProductPopup when clicked
    commentGrid.querySelector('.RemoveButton').addEventListener('click', function() {
        toggleSearchPopup();
        toggleRemovePopup();
        populateRemovePopup('comment', comment);
    });
    return commentGrid;
}

function createReclamationGrid(reclamation) {
    const timeOfReclamation = new Date(reclamation.timeOfReclamation).toLocaleString(); // Convert timestamp to readable date format

    const reclamationGrid = document.createElement('div');
    reclamationGrid.classList.add('product-unity');
    reclamationGrid.innerHTML = `
        <p><strong>Message:</strong><br> ${reclamation.reclamation_msg}</p>
        <p><strong>Address:</strong><br> ${reclamation.address}</p>
        <p><strong>Phone Number:</strong><br> ${reclamation.phoneNumber}</p>
        <p><strong>Date:</strong><br> ${timeOfReclamation}</p>
        <p style="color: ${reclamation.status === 'New'? '#1a73e8':reclamation.status === 'Liked'?'#008d15':reclamation.status === 'Rejected'?'#bb0d0d':'#d8cd34'}">
        <strong>Status:</strong><br> ${reclamation.status}</p>
        <p><strong>Respond:</strong><br> ${reclamation.status === 'Responded'? reclamation.reclamation_respond:'None'}</p>
        <button class="RemoveButton">Remove</button>
    `;
    
    // Add event listener to show SingleProductPopup when clicked
    reclamationGrid.querySelector('.RemoveButton').addEventListener('click', function() {
        toggleSearchPopup();
        toggleRemovePopup();
        populateRemovePopup('reclamation', reclamation);
    });
    return reclamationGrid;
}
// Close button functionality for the SingleProductPopup
document.querySelector('#SingleProductPopup .closeButton').addEventListener('click', function() {
    toggleSingleProductPopup();
});
// Close button functionality for the HistoryPopup
document.querySelector('#HistoryPopup .closeButton').addEventListener('click', function() {
    toggleHistoryPopup();
});
// Close button functionality for the RespondPopup
document.querySelector('#RespondPopup .closeButton').addEventListener('click', function() {
    toggleRespondPopup();
});
// Close button functionality for the RespondPopup
document.querySelector('#MessagePopup .closeButton').addEventListener('click', function() {
    toggleMessagePopup();
});
// Close button functionality for the RespondPopup
document.querySelector('#showInfoPopup .closeButton').addEventListener('click', function() {
    toggleShowInfoPopup();
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
                <button type="button" class="RejectButton" onclick="togglelogOutPopup()">Logout</button>
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

document.getElementById('hidden-search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form input values
    const searchInput = document.getElementById('hidden-search-String').value.trim().toLowerCase();

    // Check if Search is not clear
    if (searchInput.length < 2) {
        showHighPropertyMessages('There is Nothing to search', 'rgb(255, 35, 35)');
        document.getElementById('hidden-search-String').value='';
        document.getElementById('hidden-search-String').focus();
        return;
    }

    // Perform search across all datasets
    const searchResults = {
        members: searchInMembers(searchInput),
        products: searchInProducts(searchInput),
        faqs: searchInFAQ(searchInput),
        reclamations: searchInReclamations(searchInput),
        commandes: searchInCommandes(searchInput),
        comments: searchInComments(searchInput)
    };

    // Check if any search results found
    let totalResults = 0;
    for (const key in searchResults) {
        if (searchResults[key].length > 0) {
            totalResults += searchResults[key].length;
        }
    }

    if (totalResults === 0) {
        showHighPropertyMessages('Nothing found with this name or description', 'rgb(255, 35, 35)');
        document.getElementById('hidden-search-String').value='';
        document.getElementById('hidden-search-String').focus();
        return;
    }
    document.getElementById('hidden-search-String').value='';
    // Display search results as needed
    var hiddenContent = document.getElementById("hidden-search");
    hiddenContent.classList.add('hidden');
    toggleSearchPopup(searchResults);
});
