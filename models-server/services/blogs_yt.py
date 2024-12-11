

import os
import requests
from dotenv import load_dotenv, find_dotenv

env_file = find_dotenv()

# Load environment variables from .env file
load_dotenv(env_file)

# SerpAPI and News API keys from environment variables
SERPAPI_KEY = os.getenv("SERPAPI_KEY") 
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

print(SERPAPI_KEY, NEWS_API_KEY)

# Function to fetch YouTube videos using SerpAPI
def fetch_youtube_videos(query):
    try:
        # Construct the URL with SerpAPI
        url = f"https://serpapi.com/search?engine=google&q={query}&tbm=vid&api_key={SERPAPI_KEY}"
        
        # Make the request to SerpAPI
        response = requests.get(url)
        data = response.json()
        
        # Check if there are video results in the response
        if "video_results" in data:
            videos = data["video_results"]
            if not videos:
                return []
            return [{"title": video.get("title"), "link": video.get("link")} for video in videos]
        else:
            return []
    except Exception as e:
        return f"Error fetching YouTube videos: {e}"

# Function to fetch news articles using News API
def fetch_news_articles(query):
    try:
        url = f"https://newsapi.org/v2/everything?q={query}&apiKey={NEWS_API_KEY}"
        response = requests.get(url)
        data = response.json()
        
        # Check if there are articles in the response
        if "articles" in data:
            articles = data["articles"]
            if not articles:
                return []
            return [{"title": article.get("title"), "link": article.get("url")} for article in articles]
        else:
            return []
    except Exception as e:
        return f"Error fetching news articles: {e}"
