import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { loadFonts } from "../functions/load-fonts";
import emptyFolder from "../assets/empty-folder.svg";

const App = () => {
  const [arts, setArts] = useState<{ id: String; user: String }[]>([]);
  const loadArts = async () => {
    const api = "https://pi7p06vff1.execute-api.ap-northeast-1.amazonaws.com";
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.get(api + "/art-board", {
      headers: headers,
    });
    const hashData = response.data.map((e: any) => ({
      user: (e["PK"] as String).match(/\d+/)![0],
      id: (e["SK"] as String).match(/\d+/)![0],
    }));
    setArts(hashData);
  };

  useEffect(() => {
    loadFonts();
    loadArts();
  }, []);

  return (
    <div className="row">
      <h1 className="d-flex justify-content-center">Art List</h1>
      <div className="col-6 offset-3 text-center">
        {arts.length > 0 ? (
          <div className="list-group">
            {arts.map((e) => {
              return (
                <button
                  key={Number(e.id)}
                  type="button"
                  className="list-group-item list-group-item-action"
                  aria-current="true"
                >
                  <Link to={`art-board/${e.user}/${e.id}`}>{e.id}</Link>
                </button>
              );
            })}
          </div>
        ) : (
          <img src={emptyFolder} alt="" width={200} />
        )}
      </div>
    </div>
  );
};

export default App;
