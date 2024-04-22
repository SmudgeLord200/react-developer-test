import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [search, setSearch] = useState(""); //for the input search box
  const [resultAudio, setResultAudio] = useState([]); //the retrieved audio files
  const [showAudio, setShowAudio] = useState(false); //whether to show the audio tag or not
  const [play, setPlay] = useState({
    name: null,
    audio: null,
  }); //audio play state variable
  const [isLoading, setIsLoading] = useState(false); //audio is loading or not
  const [isPlaying, setIsPlaying] = useState(false); //audio is playing or not
  //Pagination variables
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = resultAudio.slice(startIndex, endIndex); // Slice the data array based on the current page

  //clean up after clearing seach box
  useEffect(() => {
    if (!search) {
      setResultAudio([]);
      setShowAudio(false);
      setCurrentPage(1);
      setIsPlaying(false);
      setIsLoading(false);
      setPlay({
        name: null,
        audio: null,
      });
    }
  }, [search]);

  //Event Listener to handle when audio file is not loaded completely
  useEffect(() => {
    const aud = document.getElementById(play.audio);
    aud?.addEventListener("waiting", onAudioWait);
    aud?.addEventListener("canplaythrough", onCanPlayThrough);
  }, [play.audio]);

  const onAudioWait = () => {
    setIsLoading(true);
  };

  const onCanPlayThrough = () => {
    setIsLoading(false);
  };

  //Function to call to retrieve relevant data after Enter button is pressed
  const onHandleEnterPressed = async (key) => {
    if (key.key === "Enter" && search != "") {
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
          // console.log(data.results);
          setResultAudio(data.results);
        } else {
          throw new Error("Error fetching search results");
        }
      } catch (e) {
        throw new Error("Error fetching search results");
      }
    }
  };

  //when clicked on an audio
  const onClickPlay = (r) => {
    setShowAudio(true);
    setPlay((prev) => ({
      ...prev,
      name: r.name,
      audio: r.previews["preview-hq-mp3"],
    }));
  };

  //Paginate functions
  const goToPreviousPage = () => {
    if (!isPlaying && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (!isPlaying) {
      const totalPages = Math.ceil(resultAudio.length / itemsPerPage);
      if (currentPage < totalPages) {
        setCurrentPage((prev) => prev + 1);
      }
    }
  };

  //Functions for monitoring the disabling pagination and input
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
          {isLoading ? (
            <div>Audio Loading...</div>
          ) : (
            <audio
              controls
              src={play.audio}
              onPlay={handleAudioPlay}
              onPause={handleAudioPause}
            ></audio>
          )}
        </>
      )}
    </div>
  );
}
//violin

export default App;
