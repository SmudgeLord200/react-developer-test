import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [search, setSearch] = useState(null);
  const [resultAudio, setResultAudio] = useState([]);
  const [showAudio, setShowAudio] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [play, setPlay] = useState({
    name: null,
    audio: null,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Slice the data array based on the current page
  const currentPageData = resultAudio.slice(startIndex, endIndex);

  useEffect(() => {
    if (!search) {
      setResultAudio([]);
      setShowAudio(false);
      setPlay({
        name: null,
        audio: null,
      });
    }
  }, [search]);

  const onHandleEnterPressed = async (key) => {
    if (key.key === "Enter") {
      // console.log("ENTERRRRRR");
      try {
        const response = await fetch(
          `https://freesound.org/apiv2/search/text/?fields=id,name,previews&query=${encodeURIComponent(
            search
          )}`,
          {
            headers: {
              Authorization: "Token a7KqVhv7qs1eY1xYWR1MQvT1tkngKuZOTPfHBR3H",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data.results);
          setResultAudio(data.results);
        } else {
          throw new Error("Error fetching search results");
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const onClickPlay = (r) => {
    setShowAudio(true);
    setPlay((prev) => ({
      ...prev,
      name: r.name,
      audio: r.previews["preview-hq-mp3"],
    }));
  };

  const goToPreviousPage = () => {
    if (!isPlaying && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (!isPlaying) {
      const totalPages = Math.ceil(resultAudio.length / itemsPerPage);
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
    }
  };

  const handleAudioPlay = () => {
    setIsPlaying(true);
  };

  const handleAudioPause = () => {
    setIsPlaying(false);
  };

  return (
    <div className="App">
      <input
        type="search"
        id="search"
        name="search"
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={onHandleEnterPressed}
        disabled={isPlaying}
      />
      {resultAudio.length != 0 && (
        <>
          <ul>
            {currentPageData &&
              currentPageData.map((r, index) => (
                <li key={index} onClick={() => onClickPlay(r)}>
                  {r.name}
                </li>
              ))}
          </ul>
          <button
            onClick={goToPreviousPage}
            disabled={isPlaying || currentPage === 1}
          >
            Previous
          </button>
          <button
            onClick={goToNextPage}
            disabled={
              isPlaying ||
              currentPage === Math.ceil(resultAudio.length / itemsPerPage)
            }
          >
            Next
          </button>
        </>
      )}
      {showAudio && (
        <>
          <p>Now Playing: {play.name}</p>
          <audio
            controls
            src={play.audio}
            onPlay={handleAudioPlay}
            onPause={handleAudioPause}
          ></audio>
        </>
      )}
    </div>
  );
}
//violin

export default App;
