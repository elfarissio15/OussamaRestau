// Theme toggling function
function toggleThemeDark() {
    var body = document.body;
    body.classList.toggle("dark-theme");
}
// Initialization function
window.onload = function () {
    toggleThemeDark();
    // Find the checkbox element
    var darkModeCheckbox = document.querySelector('.header input[type="checkbox"]');
    // Check the checkbox
    darkModeCheckbox.checked = true;
};
const videos = [
    "videoPure2.mp4",
    "videoTrimPure2.webm"
];
let currentVideoIndex = 0;

// Function to play the next video
function playNextVideo() {
    const videoPlayer = document.getElementById("videoPlayer");
    currentVideoIndex = (currentVideoIndex + 1) % videos.length;
    videoPlayer.src = videos[currentVideoIndex];

    var radiosdiv = document.querySelector('.radio-buttons');
    radiosdiv.innerHTML = ''; // Clear existing radio buttons

    videos.forEach(function (video, index) {
        // Create a new radio button
        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'r';
        radio.id = 'radio' + (index + 1);
        if (index === currentVideoIndex) { // Check if this is the current video
            radio.checked = true; // Select the current radio button
        }
        radiosdiv.appendChild(radio);

        // Event listener to change the video when the radio button is selected
        radio.addEventListener('change', function () {
            if (this.checked) {
                currentVideoIndex = index;
                videoPlayer.src = video;
                // videoPlayer.play(); // Remove this line
            }
        });
    });
}

// Event listener to play the next video when the current one ends
const videoPlayer = document.getElementById("videoPlayer");
videoPlayer.addEventListener("ended", playNextVideo);

// Trigger the playNextVideo function once the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
    playNextVideo();
});
