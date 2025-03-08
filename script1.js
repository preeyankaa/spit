document.addEventListener("DOMContentLoaded", () => {
    const character = document.getElementById("moving-character");

    // 🛰️ Floating Astronaut Movement
    let positionX = 50;
    let direction = 1;

    function moveCharacter() {
        positionX += direction * 0.5;
        if (positionX > 90 || positionX < 10) direction *= -1;
        character.style.left = positionX + "%";
        requestAnimationFrame(moveCharacter);
    }
    moveCharacter();

    document.addEventListener("DOMContentLoaded", () => {
        // 🌟 Twinkling Stars
        function createStars() {
            const starsContainer = document.getElementById("stars-container");
            for (let i = 0; i < 100; i++) {
                let star = document.createElement("div");
                star.classList.add("star");
                star.style.top = Math.random() * 100 + "%";
                star.style.left = Math.random() * 100 + "%";
                star.style.animationDuration = (Math.random() * 5 + 2) + "s";
                starsContainer.appendChild(star);
            }
        }
        createStars();
    });    
