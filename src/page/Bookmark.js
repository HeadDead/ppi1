import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../VAyR.gif";
export function Bookmarks() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [pageCount, setPageCount] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageArray, setPageArray] = useState([]);

  function countPages(count) {
    setPageCount(Math.ceil(count / 5));
    getPageArray(Math.ceil(count / 5));
  }

  function getPageArray(num) {
    if (num < 6) {
      let temp = [];
      for (let i = 0; i <= num - 3; i++) {
        temp[i] = i + 2;
      }
      setPageArray(temp);
    } else if (pageNumber + 2 >= num) {
      setPageArray([num - 5, num - 4, num - 3, num - 2, num - 1]);
    } else {
      setPageArray([
        pageNumber - 2,
        pageNumber - 1,
        pageNumber,
        pageNumber + 1,
        pageNumber + 2,
      ]);
    }
  }

  function handlePageClick(value) {
    setPageNumber(value);
    getPageArray(pageCount);
    document.getElementById("pageNum").textContent = value;
  }

  useEffect(() => {
    fetchForPages();
    fetchIt();
  }, [pageNumber]);

  function fetchForPages() {
    let query = "";
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      query = query + "&id=" + localStorage.getItem(key);
    }
    if (localStorage.length !== 0) {
      fetch("https://api.spaceflightnewsapi.net/v3/articles?" + query)
        .then((res) => res.json())
        .then(
          (result) => {
            countPages(result.length);
          },
          // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
          // чтобы не перехватывать исключения из ошибок в самих компонентах.
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    }
  }
  function fetchIt() {
    let query = "";
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      query = query + "&id=" + localStorage.getItem(key);
    }
    if (localStorage.length !== 0) {
      fetch(
        "https://api.spaceflightnewsapi.net/v3/articles?_limit=5&_start=" +
          (pageNumber - 1) * 5 +
          query
      )
        .then((res) => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setItems(result);
          },
          // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
          // чтобы не перехватывать исключения из ошибок в самих компонентах.
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        );
    }
  }
  if (localStorage.length !== 0) {
    if (error) {
      return <div>Ошибка: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div className="loader">
          <img src={logo} alt="logo" />
        </div>
      );
    } else {
      return (
        <div>
          <hr className="hrSplit" />
          <div>
            {pageCount !== 1 ? (
              <button onClick={() => handlePageClick(1)}>1</button>
            ) : (
              ""
            )}
            {pageArray.map((page) => (
              <button onClick={(e) => handlePageClick(page)}>
                {page.toString()}
              </button>
            ))}
            {pageCount !== 1 ? (
              <button onClick={() => handlePageClick(pageCount)}>
                {pageCount}
              </button>
            ) : (
              ""
            )}
          </div>
          <div>
            <p>
              Текущая страница:{" "}
              <p className="pagesNum" id="pageNum">
                1
              </p>
            </p>
          </div>
          <ul className="pageList">
            {items.length !== 0 ? (
              items.map((item) => (
                <li key={item.id}>
                  <p id="newsTitle">
                    <Link id="headerNews" to={"/news/" + item.id}>
                      {item.title}
                    </Link>
                  </p>
                  <p>
                    <img className="ImageNews" src={item.imageUrl} />
                  </p>
                  <p>Дата публикации: {item.publishedAt}</p>
                </li>
              ))
            ) : (
              <div>
                <h1>Закладок пока нет</h1>
              </div>
            )}
          </ul>
        </div>
      );
    }
  } else {
    return (
      <div>
        <ul className="pageList">
          {items.length !== 0 ? (
            items.map((item) => (
              <li key={item.id}>
                <p id="newsTitle">
                  <Link id="headerNews" to={"/news/" + item.id}>
                    {item.title}
                  </Link>
                </p>
                <p>
                  <img className="postImage" src={item.imageUrl} />
                </p>
              </li>
            ))
          ) : (
            <div>
              <h1>Закладок пока нет</h1>
            </div>
          )}
        </ul>
      </div>
    );
  }
}
export default Bookmarks;
