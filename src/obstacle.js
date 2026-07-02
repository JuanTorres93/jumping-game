import { obstaclesContainer, heartsContainer, state, scoreElement} from "./engine.js";

const BACKPACK = {
    src: "../assets/obstacles/backpack.png",
    placement: 20
}

const BASKETBALL = {
    src: "../assets/obstacles/basketball.png",
    placement: 0
}

const BOOKS = {
    src: "../assets/obstacles/books.png",
    placement: 20
}

const NOTEBOOK = {
    src: "../assets/obstacles/notebook.png",
    placement: 20
}

const PAPERPLANE = {
    src: "../assets/obstacles/paper_plane.png",
    placement: 0
}

const WETFLOOR = {
    src: "../assets/obstacles/wet_floor.png",
    placement: 20
}

const obstacleTypes = [ BACKPACK, BASKETBALL, BOOKS, NOTEBOOK, PAPERPLANE, WETFLOOR];

function chooseObstacleType() {
  const randomIndex = Math.floor(Math.random() * obstacleTypes.length);
  return obstacleTypes[randomIndex];
}

function createObstacle()
{
    const obstacleType = chooseObstacleType();
    const obstacle = document.createElement("div");
    const obstacleImage = document.createElement("img");
    obstacle.classList.add("obstacle");
    obstacle.style.left = "60rem";
    obstacle.style.top = obstacleType.placement + "rem";
    obstacle.appendChild(obstacleImage);
    obstacleImage.setAttribute("src", obstacleType.src);
    obstaclesContainer.appendChild(obstacle);
    state.obstacles.push(obstacle);
}

function moveObstacles(timeBetweenFramesInSeconds)
{
    for (const obstacle of state.obstacles)
    {
        const currentLeft = parseInt(obstacle.style.left) || -5;
        const newLeft = currentLeft - (0.01 * timeBetweenFramesInSeconds);
        obstacle.style.left = newLeft + "rem";
        if (obstacle.style.left <= "-5rem")
        {
            state.score++;
            scoreElement.textContent = state.score;
            removeGameObject(obstacle, state.obstacles);
        }
    }
    
}

function createHeart()
{
    const heart = document.createElement("div");
    const heartImage = document.createElement("img");
    heart.classList.add("life-pickup");
    heart.style.left = "60rem";
    heart.appendChild(heartImage);
    heartImage.setAttribute("src", "../assets/Heart.png");
    heartsContainer.appendChild(heart);
    state.hearts.push(heart);
}

function moveHeart(timeBetweenFramesInSeconds)
{
    for (const heart of state.hearts)
    {
        const currentLeft = parseInt(heart.style.left) || -5;
        const newLeft = currentLeft - (0.1 * timeBetweenFramesInSeconds);
        heart.style.left = newLeft + "rem";
        if (heart.style.left <= "-5rem")
        {
            removeGameObject(heart, state.hearts);
        }
    }
}

function getObstacleHitbox(obstacle)
{
    return obstacle.getBoundingClientRect();
}

function getHeartHitbox(heart)
{
    return heart.getBoundingClientRect();
}

function removeGameObject(gameObject, gameObjectArray) {
    const index = gameObjectArray.indexOf(gameObject);
    if (index !== -1) {
        gameObjectArray.splice(index, 1);
        gameObject.remove();
    }
}


export { createObstacle, moveObstacles, createHeart, moveHeart, getObstacleHitbox, getHeartHitbox, removeGameObject };