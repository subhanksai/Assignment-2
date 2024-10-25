import React, { useEffect, useState } from "react";
import axios from "axios";

function ArticleDataFetch() {
  const [articlesData, setArticlesData] = useState([]);

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.post("http://localhost:8080/getArticle");
        setArticlesData(result.data); // Set all articles at once
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 300000); // Fetch data every 5 minutes

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  return (
    <div>
      <h2>Top Stories Around World</h2>
      <div className="right-rail-article ">
        {" "}
        <div>
          <a
            href={article[0]?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="article-link"
          >
            <div className="article-arrange" target="_blank">
              <h5>{article[0]?.title}</h5>
              <p>{article[0]?.author}</p>
            </div>
          </a>
        </div>
      </div>
      <div className="right-rail-article ">
        {" "}
        <div>
          <a
            href={article[1]?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="article-link"
          >
            <div className="article-arrange" target="_blank">
              <h5>{article[1]?.title}</h5>
              <p>{article[1]?.author}</p>
            </div>
          </a>
        </div>
      </div>
      <div className="right-rail-article ">
        {" "}
        <div>
          <a
            href={article[2]?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="article-link"
          >
            <div className="article-arrange" target="_blank">
              <h5>{article[2]?.title}</h5>
              <p>{article[2]?.author}</p>
            </div>
          </a>
        </div>
      </div>
      <div className="right-rail-ga">
        <a href="/articles">
          <p>Additional content or advertisements can go here.</p>
        </a>
      </div>
    </div>
  );
}

export default ArticleDataFetch;
