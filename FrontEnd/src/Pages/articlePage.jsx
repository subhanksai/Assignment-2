import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom"; // Import Link for navigation
import "../css/article.css";

function ArticlePage() {
  const [articles, setArticles] = useState([]); // Initialize articles state
  const location = useLocation(); // Access location to get the passed article data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.post("http://localhost:8080/getArticle");
        setArticles(result.data); // Assuming result.data is an array of articles
      } catch (err) {
        console.log(err);
      }
    };

    // Check if the article is passed through the location state
    if (location.state && location.state.article) {
      setArticles([location.state.article]); // Wrap in an array if a single article is passed
    } else {
      fetchData(); // Call fetchData if no article is passed
    }

    // Set an interval for refreshing the data if needed
    const intervalId = setInterval(fetchData, 10800000); // Adjusted to 5 minutes

    return () => clearInterval(intervalId); // Clear interval on unmount
  }, [location.state]); // Dependency array includes location.state

  // Check if articles are available
  if (articles.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="section card">
      <h1>Articles</h1>
      <div className="article-list">
        <ul className="list-group">
          {articles.map((article, index) => (
            <li key={index} className="list-group-item">
              <a
                href={article.url} // Use href to link to the actual article URL
                target="_blank" // Open link in a new tab
                rel="noopener noreferrer" // Recommended for security reasons
                className="article-link"
              >
                <h2>{article.title || "No Title"}</h2> {/* Display the title */}
              </a>
              <p>Author: {article.author || "Unknown Author"}</p>
              <p>
                {article.content?.substring(0, 100) || "No Content Available"}
                ...
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ArticlePage;
