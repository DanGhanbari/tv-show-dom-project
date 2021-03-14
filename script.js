function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
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
    aTag.href = `${episodeList[i]._links.self.href}`;
    aTag.innerText = `${episodeList[i].name} - S${episodeList[i].season}E${episodeList[i].number}`;
    aTag.target = "_blank";
    imageElement.src = `${episodeList[i].image.medium}`;
    pElement.innerHTML = `${episodeList[i].summary}`;

    //appending elements
    h1Element.appendChild(aTag);
    sectionElement.appendChild(h1Element);
    sectionElement.appendChild(imageElement);
    sectionElement.appendChild(pElement);
    mainElement.appendChild(sectionElement);
    rootElem.appendChild(mainElement);
  }
}

window.onload = setup;
