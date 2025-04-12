// API key for NewsAPI
// Note: In production, this should be handled server-side as NewsAPI restricts client-side API calls in their free plan
const API_KEY = "465d8d612c68450ca153cbf838650abf"
const BASE_URL = "https://newsapi.org/v2/everything"

// DOM elements
const newsList = document.getElementById("news-list")
const loadingElement = document.getElementById("loading")
const filterButtons = document.querySelectorAll(".filter-btn")

// Current topic
let currentTopic = "environment"

// Sample news data to use when API is unavailable
const sampleNewsData = [
  {
    source: { name: "EcoWatch" },
    author: "Jane Smith",
    title: "New Study Shows Rapid Decline in Arctic Sea Ice",
    description:
      "Scientists have documented an alarming rate of sea ice loss in the Arctic region, with potential global climate implications.",
    url: "https://example.com/arctic-ice",
    urlToImage: "/placeholder.svg?height=160&width=240",
    publishedAt: "2025-04-10T09:30:00Z",
    content: "Arctic sea ice is declining at a rate of approximately 13% per decade...",
  },
  {
    source: { name: "Green Energy Today" },
    author: "Michael Johnson",
    title: "Solar Power Installations Reach Record High in First Quarter",
    description:
      "Global solar capacity additions have exceeded expectations, with residential installations leading the growth.",
    url: "https://example.com/solar-record",
    urlToImage: "/placeholder.svg?height=160&width=240",
    publishedAt: "2025-04-09T14:15:00Z",
    content: "The first quarter of 2025 saw unprecedented growth in solar installations...",
  },
  {
    source: { name: "Conservation Daily" },
    author: "Sarah Williams",
    title: "Reforestation Project Successfully Restores 10,000 Hectares",
    description:
      "A major reforestation initiative has reached its five-year goal of restoring native forest ecosystems.",
    url: "https://example.com/reforestation",
    urlToImage: "/placeholder.svg?height=160&width=240",
    publishedAt: "2025-04-08T11:45:00Z",
    content: "The ambitious reforestation project has successfully planted over 2 million trees...",
  },
  {
    source: { name: "Sustainable Business" },
    author: "David Chen",
    title: "Major Corporations Pledge Net-Zero Emissions by 2040",
    description: "A coalition of global companies has announced accelerated timelines for achieving carbon neutrality.",
    url: "https://example.com/net-zero",
    urlToImage: "/placeholder.svg?height=160&width=240",
    publishedAt: "2025-04-07T16:20:00Z",
    content: "The new corporate climate alliance represents over $3 trillion in annual revenue...",
  },
  {
    source: { name: "Ocean Conservation Institute" },
    author: "Emily Rodriguez",
    title: "New Marine Protected Area Established in Pacific Ocean",
    description: "A vast new marine sanctuary will protect thousands of species and critical ocean habitats.",
    url: "https://example.com/marine-protected",
    urlToImage: "/placeholder.svg?height=160&width=240",
    publishedAt: "2025-04-06T08:50:00Z",
    content: "The protected area spans over 150,000 square kilometers of ocean...",
  },
]

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  // Set up filter button event listeners
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Get topic and fetch news
      const topic = button.getAttribute("data-topic")
      currentTopic = topic
      fetchNews(topic)
    })
  })

  // Initial news fetch
  fetchNews(currentTopic)
})

/**
 * Fetch news articles from the API or use sample data
 * @param {string} topic - The topic to search for
 */
async function fetchNews(topic) {
  // Show loading indicator
  showLoading(true)

  try {
    // Try to fetch from NewsAPI
    const apiKey = "YOUR_NEWS_API_KEY" // Replace with your actual API key
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(topic)}&language=en&sortBy=publishedAt&apiKey=${apiKey}`

    let articles

    try {
      // Attempt to fetch from the API
      const response = await fetch(url)

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()
      articles = data.articles
    } catch (apiError) {
      console.warn("API fetch failed, using sample data:", apiError)

      // Filter sample data based on topic
      articles = filterSampleData(topic)
    }

    // Display the articles
    displayArticles(articles)
  } catch (error) {
    console.error("Error in news handling:", error)
    displayError("Unable to load news. Please try again later.")
  } finally {
    // Hide loading indicator
    showLoading(false)
  }
}

/**
 * Filter sample data based on topic
 * @param {string} topic - The topic to filter by
 * @returns {Array} - Filtered articles
 */
function filterSampleData(topic) {
  if (topic === "environment") {
    return sampleNewsData
  }

  // Simple filtering based on title and description containing the topic
  return sampleNewsData.filter((article) => {
    const content = (article.title + " " + article.description).toLowerCase()
    return content.includes(topic.toLowerCase())
  })
}

/**
 * Display articles in the news list
 * @param {Array} articles - Array of article objects
 */
function displayArticles(articles) {
  // Clear previous articles
  newsList.innerHTML = ""

  // Check if there are any articles
  if (!articles || articles.length === 0) {
    displayError("No articles found for this topic. Try another search.")
    return
  }

  // Create HTML for each article
  articles.forEach((article) => {
    // Skip invalid articles
    if (!article.title) return

    // Format the publication date
    const publishedDate = new Date(article.publishedAt)
    const formattedDate = publishedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

    // Create article element
    const articleElement = document.createElement("article")
    articleElement.className = "news-item"

    // Prepare image URL (use placeholder if not available)
    const imageUrl = article.urlToImage || "/placeholder.svg?height=160&width=240"

    // Create article HTML
    articleElement.innerHTML = `
      <div class="news-meta">
        <span class="news-source">${article.source.name || "Unknown Source"}</span>
        <span class="news-date">${formattedDate}</span>
      </div>
      <h2 class="news-title">${article.title}</h2>
      <div class="news-content">
        <div class="news-text">
          <p class="news-description">${article.description || "No description available."}</p>
          <a href="${article.url}" target="_blank" class="read-more">Read full article →</a>
        </div>
        <img src="${imageUrl}" alt="${article.title}" class="news-image" onerror="this.src='/placeholder.svg?height=160&width=240'">
      </div>
    `

    // Add the article to the news list
    newsList.appendChild(articleElement)
  })
}

/**
 * Display an error message
 * @param {string} message - The error message to display
 */
function displayError(message) {
  newsList.innerHTML = `
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
  loadingElement.style.display = isLoading ? "flex" : "none"
}
