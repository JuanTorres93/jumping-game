const BACKPACK = {
    src: "../assets/obstacles/backpack.png",
    placement: 20,
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
    src: "..assets/obstacles/notebook.png",
    placement: 20
}

const PAPERPLANE = {
    src: "..assets/obstacles/paperplane.png",
    placement: 0
}

const WETFLOOR = {
    src: "..assets/obstacles/wetfloor.png",
    placement: 20
}

const obstacleTypes = [ BACKPACK, BASKETBALL, BOOKS, NOTEBOOK, PAPERPLANE, WETFLOOR];

function chooseObstacleType() {
  const randomIndex = Math.floor(Math.random() * obstacleTypes.length);
  return obstacleTypes[randomIndex];
}

async function createObstacle()
{
    const obstacleType = chooseObstacleType();
    const obstaclesContainer = document.querySelector(".obstacles");
    const obstacle = document.createElement("div");
    const obstacleImage = document.createElement("img");
    obstacle.classList.add("obstacle");
    obstacle.style.left = "60rem";
    obstacle.style.top = obstacleType.placement + "rem";
    obstacle.appendChild(obstacleImage);
    obstacleImage.setAttribute("src", obstacleType.src);
    obstaclesContainer.appendChild(obstacle);
    setTimeout(() => {
        createObstacle();
    }, 1000);
}

function moveObstacles()
{
    for (const obstacle of document.querySelectorAll(".obstacle"))
    {
        const currentLeft = parseInt(obstacle.style.left) || -5;
        const newLeft = currentLeft - 0.001;
        obstacle.style.left = newLeft + "rem";
        if (obstacle.style.left <= "-5rem")
        {
            obstacle.remove();
        }
    }
    requestAnimationFrame(moveObstacles);
    
}

function createHeart()
{
    const heartsContainer = document.querySelector(".hearts");
    const heart = document.createElement("div");
    const heartImage = document.createElement("img");
    heart.classList.add("life-pickup");
    heart.style.left = "60rem";
    heart.appendChild(heartImage);
    heartImage.setAttribute("src", "../assets/Heart.png");
    heartsContainer.appendChild(heart);
    setTimeout(() => {
        createHeart();
    }, 10000);
}

function moveHeart()
{
    for (const heart of document.querySelectorAll(".life-pickup"))
    {
        const currentLeft = parseInt(heart.style.left) || -5;
        const newLeft = currentLeft - 0.1;
        heart.style.left = newLeft + "rem";
        if (heart.style.left <= "-5rem")
        {
            heart.remove();
        }
    }
    requestAnimationFrame(moveHeart);
}

function getObstacleHitbox(playerPosition, obstaclePosition)
{
    let rightOverlap = (playerPosition.right >= obstaclePosition.left && playerPosition.right <= obstaclePosition.right);
    let bottomOverlap = (playerPosition.bottom >= obstaclePosition.top);
    /*setInterval(() => {
        let playerPosition = document.querySelector(".player").getBoundingClientRect();
        for (const obstacle of document.querySelectorAll(".obstacle"))
        {
            let obstaclePosition = obstacle.getBoundingClientRect();
            let rightOverlap = (playerPosition.right >= obstaclePosition.left && playerPosition.right <= obstaclePosition.right);
            let bottomOverlap = (playerPosition.bottom >= obstaclePosition.top);
            if(rightOverlap && bottomOverlap)
            {
                console.log("Obstacle HIT!");
            }
        
        }}, 10)*/
}

function getHeartHitbox(playerPosition, heartPosition)
{
    let rightOverlap = (playerPosition.right >= heartPosition.left && playerPosition.right <= heartPosition.right);
    let bottomOverlap = (playerPosition.bottom >= heartPosition.top);
    /*setInterval(() => {
        let playerPosition = document.querySelector(".player").getBoundingClientRect();
        for (const heart of document.querySelectorAll(".life-pickup"))
        {
            let heartPosition = heart.getBoundingClientRect();
            
            if(rightOverlap && bottomOverlap)
            {
                console.log("Heart COLLECTED!");
            }
        
        }}, 10)*/
}


export { createObstacle, moveObstacles, createHeart, moveHeart, getObstacleHitbox, getHeartHitbox };