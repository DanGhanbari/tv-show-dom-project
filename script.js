"use strict";
const rootElem = document.getElementById("root");
const mainElement = document.createElement("main");
const optionElement = document.createElement("option");
const selectEpisodeElement = document.getElementById("episode-select");
const selectShowElement = document.getElementById("show-select");
const inputElement = document.querySelector("input");

function setup() {
  selectShow();
}

function addZero(x) {
  if (x < 10) {
    return (x = `0${x}`);
  } else {
    return x;
  }
}

function makePageForEpisodes(episodeList) {
  for (let i = 0; i < episodeList.length; i++) {
    let sectionElement = document.createElement("section");
    let aTag = document.createElement("a");
    let h1Element = document.createElement("h3");
    let imageElement = document.createElement("img");
    let pElement = document.createElement("p");
    let seasonNumber = addZero(episodeList[i].season);
    let episodeNumber = addZero(episodeList[i].number);
    aTag.href = `${episodeList[i].url}`;
    aTag.target = "_blank";
    h1Element.innerText = `${episodeList[i].name} - S${seasonNumber}E${episodeNumber}`;
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
  let firstOption = document.createElement("option");
  firstOption.innerHTML = "Select all episodes";
  selectEpisodeElement.appendChild(firstOption);
  for (let i = 0; i < episodes.length; i++) {
    let optionElement = document.createElement("option");
    optionElement.value = `<section>
    <a href = ${episodes[i].url}><h3>S${episodes[i].season}E${episodes[i].number} - ${episodes[i].name}</h3></a>
    <img src = ${episodes[i].image.medium}>
    <p>${episodes[i].summary}</p>
    </section>`;

    let seasonNumber = addZero(episodes[i].season);
    let episodeNumber = addZero(episodes[i].number);
    optionElement.innerHTML = `S${seasonNumber}E${episodeNumber} - ${episodes[i].name}`;
    selectEpisodeElement.appendChild(optionElement);
  }
  selectEpisodeElement.addEventListener("change", () => {
    if (selectEpisodeElement.selectedIndex === 0) {
      selectedShow();
    } else {
      mainElement.innerHTML = "";
      mainElement.innerHTML = selectEpisodeElement.value;
      rootElem.appendChild(mainElement);
    }
  });
}

//select show
let selectShow = function () {
  const showList = getAllShows();
  var showArr = [];
  var idArr = [];
  for (let i = 0; i < showList.length; i++) {
    showArr.push(showList[i].name);
    idArr.push(showList[i].id);
  }

  var zip = [];
  for (var i = 0; i < showArr.length; i++) {
    zip.push([showArr[i], idArr[i]]);
  }

  zip.sort();

  for (var i = 0; i < zip.length; i++) {
    showArr[i] = zip[i][0];
    idArr[i] = zip[i][1];
  }
  for (let i = 0; i < showArr.length; i++) {
    let optionElement = document.createElement("option");
    optionElement.value = `${idArr[i]}`;
    optionElement.innerHTML = `${showArr[i]}`;
    selectShowElement.appendChild(optionElement);
  }
};

//adding event listener to choose selected show
selectShowElement.addEventListener("change", selectedShow);

function selectedShow() {
  if (selectShowElement.selectedIndex === 0) {
    mainElement.innerHTML = "";
  } else {
    mainElement.innerHTML = "";
    let showId = selectShowElement.value;
    selectEpisodeElement.innerHTML = "";
    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then((response) => response.json())
      .then((data) => {
        const allEpisodes = data;
        dropDown(allEpisodes);
        makePageForEpisodes(allEpisodes);
        searchBox(allEpisodes);
      })
      .catch((Error) => console.log("Error"));
  }
}

window.onload = setup;
