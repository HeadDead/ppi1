import { Link } from "react-router-dom";
function PageNotFound() {
  return (
    <div>
      <h1>404-Page not Found</h1>
      <h2>
        Такой страницы не существует
      </h2>
      <Link to={"/"}>На главную страницу</Link>
    </div>
  );
}
export default PageNotFound;
