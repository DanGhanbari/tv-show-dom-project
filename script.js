function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
  searchBox();
  dropDown(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const mainElement = document.createElement("main");

  for (let i = 0; i < episodeList.length; i++) {
    //making elements and adding class
    let sectionElement = document.createElement("section");
    let aTag = document.createElement("a");
    let h1Element = document.createElement("h1");
    let imageElement = document.createElement("img");
    let pElement = document.createElement("p");
    pElement.className = "description";

    // adding zero to numbers less than 10
    if (episodeList[i].number < 10) {
      episodeList[i].number = `0${episodeList[i].number}`;
    }
    if (episodeList[i].season < 10) {
      episodeList[i].season = `0${episodeList[i].season}`;
    }
    //adding value to elements
    aTag.href = `${episodeList[i].url}`;
    aTag.target = "_blank";
    h1Element.innerText = `${episodeList[i].name} - S${episodeList[i].season}E${episodeList[i].number}`;
    imageElement.src = `${episodeList[i].image.medium}`;
    pElement.innerHTML = `${episodeList[i].summary}`;

    //appending elements
    aTag.appendChild(h1Element);
    sectionElement.appendChild(aTag);
    sectionElement.appendChild(imageElement);
    sectionElement.appendChild(pElement);
    mainElement.appendChild(sectionElement);
    rootElem.appendChild(mainElement);
  }
}

//search box
function searchBox() {
  const inputElement = document.querySelector("input");
  inputElement.addEventListener("keyup", function (event) {
    let inputLetter = event.target.value.toLowerCase();
    let searchedEpisode = document.getElementById("search-result");
    let allEpisodes = document.getElementById("total-episodes");
    let episodes = document.getElementsByTagName("section");
    let numOfResult = 0;
    for (let i = 0; i < episodes.length; i++) {
      const currentEpisode = episodes[i].textContent.toLowerCase();
      if (currentEpisode.match(inputLetter)) {
        // Display matching episodes
        episodes[i].style.display = "block";
        numOfResult += 1;
      } else {
        // Hide non-matching episodes
        episodes[i].style.display = "none";
      }
    }
    allEpisodes.innerText = episodes.length;
    searchedEpisode.innerText = `${numOfResult}`;
  });
}

// Drop-down option menu
function dropDown(episodes) {
  const selectElement = document.getElementById("episode-select");
  for (let i = 0; i < episodes.length; i++) {
    let optionElement = document.createElement("option");
    optionElement.innerText = `S${episodes[i].season}E${episodes[i].number} - ${episodes[i].name}`;
    optionElement.value = `${episodes[i].url}`;
    selectElement.appendChild(optionElement);
  }
}

window.onload = setup;
