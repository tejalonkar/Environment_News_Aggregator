// API key for NewsAPI
// Note: In production, this should be handled server-side as NewsAPI restricts client-side API calls in their free plan
const API_KEY = "YOUR_NEWS_API_KEY"
const BASE_URL = "https://newsapi.org/v2/everything"

// DOM elements
const newsContainer = document.getElementById("newsContainer")
const loadingElement = document.getElementById("loading")
const topicButtons = document.querySelectorAll(".topic-btn")

// Current active topic
let currentTopic = "environment"

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  // Fetch initial news
  fetchNews(currentTopic)

  // Add event listeners to topic buttons
  topicButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active button
      topicButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Get topic and fetch news
      const topic = button.getAttribute("data-topic")
      currentTopic = topic
      fetchNews(topic)
    })
  })
})

/**
 * Fetch news articles from the API
 * @param {string} topic - The topic to search for
 */
async function fetchNews(topic) {
  // Show loading indicator
  showLoading(true)

  try {
    // Build the API URL
    const url = `${BASE_URL}?q=${encodeURIComponent(topic)}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`

    // Fetch data from the API
    const response = await fetch(url)

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    // Parse the JSON response
    const data = await response.json()

    // Display the articles
    displayArticles(data.articles)
  } catch (error) {
    // Handle errors
    console.error("Error fetching news:", error)
    displayError("Failed to load news articles. Please try again later.")
  } finally {
    // Hide loading indicator
    showLoading(false)
  }
}

/**
 * Display articles in the news container
 * @param {Array} articles - Array of article objects
 */
function displayArticles(articles) {
  // Clear previous articles
  newsContainer.innerHTML = ""

  // Check if there are any articles
  if (!articles || articles.length === 0) {
    displayError("No articles found for this topic. Try another search.")
    return
  }

  // Create HTML for each article
  articles.forEach((article) => {
    // Skip articles without images or titles
    if (!article.title || !article.urlToImage) return

    // Format the publication date
    const publishedDate = new Date(article.publishedAt)
    const formattedDate = publishedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Create article card
    const articleElement = document.createElement("div")
    articleElement.className = "article-card"
    articleElement.innerHTML = `
            <img src="${article.urlToImage}" alt="${article.title}" class="article-image" onerror="this.src='https://via.placeholder.com/300x180?text=No+Image+Available'">
            <div class="article-content">
                <span class="article-source">${article.source.name || "Unknown Source"}</span>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-date">${formattedDate}</p>
                <a href="${article.url}" target="_blank" class="read-more">Read Full Article</a>
            </div>
        `

    // Add the article to the container
    newsContainer.appendChild(articleElement)
  })
}

/**
 * Display an error message
 * @param {string} message - The error message to display
 */
function displayError(message) {
  newsContainer.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `
}

/**
 * Show or hide the loading indicator
 * @param {boolean} isLoading - Whether to show or hide the loading indicator
 */
function showLoading(isLoading) {
  if (isLoading) {
    loadingElement.style.display = "flex"
    newsContainer.innerHTML = ""
  } else {
    loadingElement.style.display = "none"
  }
}
