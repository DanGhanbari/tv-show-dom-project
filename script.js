"use strict";
const rootElem = document.getElementById("root");
const mainElement = document.createElement("main");
const selectEpisodeElement = document.getElementById("episode-select");
const selectEpisodesLabel = document.getElementById("episode-select-label");
const selectShowElement = document.getElementById("show-select");
const inputElement = document.querySelector("input");
const resetButton = document.getElementById("reset");
let searchedEpisode = document.getElementById("search-result");
let allEpisodes = document.getElementById("total-episodes");

function setup() {
  reset();
  selectShow();
  displayShow();
  searchBox();
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
    sectionElement.className = "showSection";
    let aTag = document.createElement("a");
    let h1Element = document.createElement("h3");
    let imageElement = document.createElement("img");
    let pElement = document.createElement("p");
    let seasonNumber = addZero(episodeList[i].season);
    let episodeNumber = addZero(episodeList[i].number);
    if (episodeList[i].image !== null) {
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
}

//search box
function searchBox() {
  inputElement.addEventListener("keyup", function (event) {
    let inputLetter = event.target.value.toLowerCase();
    let episodes = document.getElementsByClassName("showSection");
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
    if (episodes[i].image !== null) {
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
        reset();
        mainElement.innerHTML = selectEpisodeElement.value;
        rootElem.appendChild(mainElement);
      }
    });
  }
}

//select show
let selectShow = function () {
  mainElement.innerHTML = "";
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

//adding event listener to choose selected show from select show option
selectShowElement.addEventListener("change", selectedShow);

function selectedShow() {
  reset();
  if (selectShowElement.selectedIndex === 0) {
    mainElement.innerHTML = "";
    displayShow();
  } else {
    mainElement.innerHTML = "";
    let showId = selectShowElement.value;
    selectEpisodeElement.innerHTML = "";
    fetch(`https://api.tvmaze.com/shows/${showId}/episodes`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("something wrong");
        }
        return response.json();
      })
      .then((data) => {
        const allEpisodes = data;
        dropDown(allEpisodes);
        makePageForEpisodes(allEpisodes);
        searchBox(allEpisodes);
      })
      .catch((error) => console.log(error));
  }
}

// display All show on main page
function displayShow() {
  let showObj = getAllShows();
  selectEpisodeElement.style.display = "none";
  selectEpisodesLabel.style.display = "none";
  for (let i = 0; i < showObj.length; i++) {
    let showDiv = document.createElement("div");
    showDiv.className = "showSection";
    if (showObj[i].image !== null) {
      showDiv.innerHTML = `<div class=" zzz show d-flex flex-column align-items-center mt-4">
         <div class=" d-flex flex-column align-items-center justify-content-center">
            <h4 class="pb-2" role="button">${showObj[i].name}</h4>
            <img class="w-100 bd-highlight img-thumbnail" src =${showObj[i].image.medium}>
        </div>
        <div class="d-flex justify-content-between">
            <div class= "summary p-4">Summary: ${showObj[i].summary}</div>
            <section class= " rating col-sm-4 d-flex flex-column justify-content-center text-secondary p-4">
              <div class="p-2 overflow-auto"> Genres: ${showObj[i].genres}</div>
              <div class="p-2 overflow-auto"> Rated: ${showObj[i].rating.average}</div>
              <div class="p-2 overflow-auto"> Status: ${showObj[i].status}</div>
              <div class="p-2 overflow-auto"> Runtime: ${showObj[i].runtime}</div>
            </section>
            </div>
      </div>
      <hr class="">`;
      mainElement.appendChild(showDiv);
      rootElem.appendChild(mainElement);

      //Adding event listener for selected show
      showDiv.addEventListener("click", () => {
        reset();
        fetch(`https://api.tvmaze.com/shows/${showObj[i].id}/episodes`)
          .then((response) => {
            if (!response.ok) {
              throw new Error("something wrong");
            }
            return response.json();
          })
          .then((data) => {
            const allEpisodes = data;
            reset();
            dropDown(allEpisodes);
            makePageForEpisodes(allEpisodes);
            searchBox();
          })
          .catch((err) => console.log(err));
      });
    }
  }
}

//Show All button
resetButton.addEventListener("click", showAll);
function showAll() {
  setup();
}

//Reset function
function reset() {
  mainElement.innerHTML = "";
  selectEpisodeElement.style.display = "block";
  selectEpisodesLabel.style.display = "block";
  searchedEpisode.innerText = "0";
  allEpisodes.innerText = "0";
  inputElement.value = "";
}

window.onload = setup;
