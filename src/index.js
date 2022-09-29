const filterContainer = document.getElementById("filter-div")
const filterButton = document.getElementById("good-dog-filter")
const dogSummary = document.getElementById("dog-summary-container")
const dogInfo = document.getElementById("dog-info")
const dogBar = document.getElementById("dog-bar")
let dogsArray = []
let filtering = false

dogBar.addEventListener("click", clicker)
filterButton.addEventListener("click", goodFilter)

function goodFilter() {
    filtering = !filtering
    filterButton.textContent = `Filter good dogs: ${filtering? "ON" : "OFF"}`
    barChanger()
}

function barChanger() {
    dogBar.innerHTML = ""
    if (filtering) {
        const goodDogs = dogsArray.filter(dog => dog.isGoodDog === true)
        renderAllDogs(goodDogs)
    }
    else {
        renderAllDogs(dogsArray)
    }
}

function renderDogDetails(dog) {
    dogInfo.innerHTML = `
    <img src="${dog.image}" />
    <h2>${dog.name}</h2>
    <button value=${dog.id}>${dog.isGoodDog? "Good Dog!" : "Bad Dog!"}</button>
    `
}

function clicker(e) {
    if (e.target.tagName === "SPAN") {
        const dogID = e.target.id
        const foundDog = dogsArray.find(dog => dog.id === parseInt(dogID))
        renderDogDetails(foundDog)
    }
}

dogInfo.addEventListener("click", goodChanger)

function goodChanger(e) {
    if (e.target.tagName === "BUTTON") {
        const dogValue = parseInt(e.target.value)
        const foundDog = dogsArray.find(dog => dog.id === dogValue)
        foundDog.isGoodDog = !foundDog.isGoodDog
        renderDogDetails(foundDog)

        fetch(`http://localhost:3000/pups/${dogValue}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isGoodDog: foundDog.isGoodDog })
            }
        )
        barChanger()
    }
}

function renderDogSpan(dog) {
    const dogSpan = document.createElement("span")
    dogSpan.textContent = dog.name
    dogSpan.id = dog.id
    dogBar.append(dogSpan)
}

function renderAllDogs(dogs) {
    dogs.forEach(renderDogSpan)
}

fetch("http://localhost:3000/pups")
    .then(r => r.json())
    .then(dogs => {
        dogsArray = dogs
        renderAllDogs(dogsArray)
    })