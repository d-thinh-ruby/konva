import { useEffect } from "react";
import { Link } from "react-router-dom";
import { loadFonts } from "../functions/load-fonts";

const App = () => {
  const data = Object.entries(localStorage);
  useEffect(() => {
    loadFonts();
  });

  return (
    <div className="row">
      <h1 className="d-flex justify-content-center">Art List</h1>
      <div className="col-6 offset-3">
        <div className="list-group">
          {data.map(([key, _]) => {
            return (
              <button
                key={key}
                type="button"
                className="list-group-item list-group-item-action"
                aria-current="true"
              >
                <Link to={`art-board/${key}`}>{key}</Link>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
