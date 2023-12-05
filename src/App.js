/*global chrome*/

import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [websiteToBlock, setWebsiteToBlock] = useState([]);
  const [wasSaved, setWasSaved] = useState(false);
  const [websitesSaved, setWebsitesSaved] = useState([]);
  const [addedWebsites, setAddedWebsites] = useState([]);
  const [focusTime, setFocusTime] = useState(0);

  const salvarSites = () => {
    chrome.storage.local.set({ websites: websiteToBlock }).then(() => {
      setWasSaved(true);
      console.log("Value is set to " + websiteToBlock);
    });
  };

  const addWebsiteToBlock = (website) => {
    setWebsiteToBlock((prev) => {
      if (prev.find((w) => w.url === website.url)) {
        return prev;
      } else {
        setAddedWebsites((prev) => [...prev, website.url]);
        return [...prev, website];
      }
    });
  };

  const cleanStorage = () => {
    chrome.storage.local.clear(function () {
      var error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      }
    });
    setWebsiteToBlock([]);
    setAddedWebsites([]);
    setWasSaved(true);
  };

  const focus = () => {
    const millisecondsInMinute = 60000;
    const millisecondsToBlock = focusTime * millisecondsInMinute;

    const websitesToBlock = websitesSaved.map((website) => website.url);
    console.log("websitesToBlock:", websitesToBlock);

    // Send a message to the background script to start blocking
    chrome.runtime.sendMessage({
      action: "startBlocking",
      websites: websitesToBlock,
    });

    // Unblock the websites after the specified time
    setTimeout(() => {
      // Send a message to the background script to stop blocking
      chrome.runtime.sendMessage({
        action: "stopBlocking",
        websites: websitesToBlock,
      });
    }, millisecondsToBlock);
  };

  useEffect(() => {
    chrome.storage.local.get(["websites"]).then((result) => {
      setWebsitesSaved(result.websites);
    });
  }, [websiteToBlock, wasSaved]);

  console.log(websiteToBlock);

  return (
    <div className="App">
      {websitesSaved && websitesSaved.length > 0
        ? websitesSaved.map((website) => {
            return <div>{website.name}</div>;
          })
        : "teste"}
      <div>
        <button
          disabled={addedWebsites.includes("www.facebook.com")}
          className={addedWebsites.includes("www.facebook.com") ? "added" : ""}
          onClick={() =>
            addWebsiteToBlock({ name: "Facebook", url: "www.facebook.com" })
          }
        >
          FB
        </button>
        <button
          disabled={addedWebsites.includes("www.instagram.com")}
          className={addedWebsites.includes("www.instagram.com") ? "added" : ""}
          onClick={() =>
            addWebsiteToBlock({ name: "Instagram", url: "www.instagram.com" })
          }
        >
          IG
        </button>
        <button
          disabled={addedWebsites.includes("www.youtube.com")}
          className={addedWebsites.includes("www.youtube.com") ? "added" : ""}
          onClick={() =>
            addWebsiteToBlock({ name: "Youtube", url: "www.youtube.com" })
          }
        >
          YT
        </button>
        <button
          disabled={addedWebsites.includes("www.twitter.com")}
          className={addedWebsites.includes("www.twitter.com") ? "added" : ""}
          onClick={() =>
            addWebsiteToBlock({ name: "Twitter", url: "www.twitter.com" })
          }
        >
          TT
        </button>
      </div>
      <input
        type="number"
        max={60}
        min={1}
        value={focusTime}
        onChange={(e) => setFocusTime(e.target.value)}
      />
      <button onClick={() => focus()}>focus</button>
      <button onClick={() => salvarSites()}>salvar</button>
      <button onClick={() => cleanStorage()}>Clean storage</button>
    </div>
  );
}

export default App;
