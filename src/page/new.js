import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper, faBookmark } from "@fortawesome/free-solid-svg-icons";
import logo from "../VAyR.gif";

export function New() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [item, setItems] = useState(null);
  const { id } = useParams();
  const [outputItems, setOutputItems] = useState([]);
  const [isBookmarked, setBookmarked] = useState(false);
  let query = "";
  let sameIt = [];

  function handleClickSave(id) {
    localStorage.setItem((localStorage.length + 1).toString(), id);
    setBookmarked(true);
    alert("Добавлено в закладки!");
  }

  function handleClickRemove(id) {
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (localStorage.getItem(key) === id.toString()) {
        localStorage.removeItem(key);
        setBookmarked(false);
        alert("Закладка удалена!");
      }
    }
  }

  // Примечание: пустой массив зависимостей [] означает, что
  // этот useEffect будет запущен один раз
  // аналогично componentDidMount()
  useEffect(() => {
    fetch("https://api.spaceflightnewsapi.net/v3/articles/" + id)
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
          sameIt = result.title.split(" ");
          fetchSame();
        },
        // Примечание: важно обрабатывать ошибки именно здесь, а не в блоке catch(),
        // чтобы не перехватывать исключения из ошибок в самих компонентах.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [id, isBookmarked]);

  function fetchSame() {
    sameIt.forEach((element) =>
      element.length > 3 && element.toLowerCase() !== "space"
        ? (query = query + "&title_contains=" + element)
        : ""
    );
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (localStorage.getItem(key) === id) {
        setBookmarked(true);
        break;
      } else setBookmarked(false);
    }
    {
      fetch("https://api.spaceflightnewsapi.net/v3/articles?" + query)
        .then((ress) => ress.json())
        .then(
          (results) => {
            setIsLoaded(true);
            setOutputItems(results);
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
        <ul className="pageList">
          <li key={item.id}>
            <p>{item.title}</p>
            <br />
            <p>
              {!isBookmarked ? (
                <button onClick={() => handleClickSave(item.id)}>
                  <FontAwesomeIcon icon={faBookmark} /> В закладки
                </button>
              ) : (
                <button onClick={() => handleClickRemove(item.id)}>
                  <FontAwesomeIcon icon={faBookmark} /> Убрать из закладок
                </button>
              )}
            </p>
            <p>
              Ссылка на источник: <a href={item.url}>{item.url}</a>
            </p>
            <p>
              <img className="ImageNewsS" src={item.imageUrl} />
            </p>
            <p id="postSummary">{item.summary}</p>
          </li>
        </ul>
        <hr />
        <p />
        <label>
          <FontAwesomeIcon icon={faNewspaper} /> Похожие статьи:
        </label>
        <p />
        <hr />
        <div>
          <ul className="pageList">
            {outputItems.map((itemS) =>
              item.id !== itemS.id ? (
                <li key={itemS.id}>
                  <p id="PostTitle">
                    <Link id="headerNews" to={"/news/" + itemS.id}>
                      {itemS.title}
                    </Link>
                  </p>
                  <p>
                    <img className="ImageNews" src={itemS.imageUrl} />
                  </p>
                  <p>Дата публикации: {item.publishedAt}</p>
                </li>
              ) : (
                ""
              )
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default New;
