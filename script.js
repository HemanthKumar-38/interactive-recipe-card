// Step progress tracking
let stepIndex = 0;
let timerInterval = null;
let seconds = 0;
let selectedRating = 0;

// Toggle Ingredients
function toggleIngredients() {
  document.getElementById("ingredients").classList.toggle("hidden");
}

// Start Cooking Flow
function startCooking() {
  stepIndex = 0;
  highlightStep();
  updateProgress();
  startTimer();
  speakStep();
}

// Highlight and speak step
function nextStep() {
  const steps = document.querySelectorAll('#steps ol li');
  if (stepIndex < steps.length - 1) {
    steps[stepIndex].classList.remove('active');
    stepIndex++;
    highlightStep();
    updateProgress();
    speakStep();
  } else {
    stopCooking();
  }
}

function stopCooking() {
  clearInterval(timerInterval);
  const timeSpent = formatTime(seconds);
  document.getElementById("timer").innerHTML = `✅ Done in ${timeSpent}`;
}

function highlightStep() {
  const steps = document.querySelectorAll('#steps ol li');
  steps.forEach(step => step.classList.remove('active'));
  if (steps[stepIndex]) {
    steps[stepIndex].classList.add('active');
  }
}

function updateProgress() {
  const steps = document.querySelectorAll('#steps ol li').length;
  const progress = ((stepIndex + 1) / steps) * 100;
  document.getElementById("progress").style.width = progress + "%";
}

function startTimer() {
  clearInterval(timerInterval);
  seconds = 0;
  document.getElementById("timer").classList.remove("hidden");
  timerInterval = setInterval(() => {
    seconds++;
    document.getElementById("time").textContent = formatTime(seconds);
  }, 1000);
}

function formatTime(secs) {
  let m = Math.floor(secs / 60).toString().padStart(2, '0');
  let s = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function resetRecipe() {
  stepIndex = 0;
  clearInterval(timerInterval);
  document.getElementById("progress").style.width = "0%";
  document.getElementById("time").textContent = "00:00";
  document.getElementById("timer").classList.add("hidden");

  const steps = document.querySelectorAll('#steps ol li');
  steps.forEach(step => step.classList.remove('active'));
}

// Voice Narration
function speakStep() {
  const steps = document.querySelectorAll('#steps ol li');
  if (steps[stepIndex]) {
    const utterance = new SpeechSynthesisUtterance(steps[stepIndex].textContent);
    speechSynthesis.speak(utterance);
  }
}

// Dark Mode
function toggleDarkMode() {
  document.body.classList.toggle('dark');
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}

// Star Rating
function rate(stars) {
  selectedRating = stars;
  const starSpans = document.querySelectorAll('.stars span');
  starSpans.forEach((star, index) => {
    star.classList.toggle('selected', index < stars);
  });
}

function submitReview() {
  const comment = document.getElementById('reviewText').value.trim();
  if (!selectedRating || !comment) return alert("Please rate and review!");

  const review = {
    rating: selectedRating,
    text: comment,
    timestamp: new Date().toLocaleString()
  };

  let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
  reviews.push(review);
  localStorage.setItem("reviews", JSON.stringify(reviews));
  document.getElementById('reviewText').value = '';
  selectedRating = 0;
  rate(0);
  loadReviews();
}

function loadReviews() {
  const reviewsList = document.getElementById("reviewsList");
  reviewsList.innerHTML = "";
  const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

  reviews.forEach(r => {
    const li = document.createElement("li");
    li.innerHTML = `⭐ ${r.rating}/5<br>${r.text}<br><small>${r.timestamp}</small>`;
    reviewsList.appendChild(li);
  });
}

// Load Theme & Reviews
window.onload = () => {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }
  loadReviews();
};
