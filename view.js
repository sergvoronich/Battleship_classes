
function GameView() {
    let gameModel = null;

    const self = this;
    const mainColor = "rgba(116, 183, 238, 0.6);";
    const woundedColor = "rgba(218, 136, 126, 0.6)";
    const killedColor = "rgba(73, 1, 1, 0.6)";

    const ship1 = document.querySelector(".ship1");
    const ship2 = document.querySelector(".ship2");
    const ship3 = document.querySelector(".ship3");
    const ship4 = document.querySelector(".ship4");

    const count1 = document.querySelector(".count1");
    const count2 = document.querySelector(".count2");
    const count3 = document.querySelector(".count3");
    const count4 = document.querySelector(".count4");

    let enemyfield = document.querySelector(".field1");
    let userfield = document.querySelector(".field2");
    let timerForMusic;

    this.boom1 = new Audio();
    this.boom1.src = "sounds/boom1.mp3";
    this.boom2 = new Audio();
    this.boom2.src = "sounds/boom2.mp3";
    this.boom3 = new Audio();
    this.boom3.src = "sounds/boom3.mp3";

    this.music1 = new Audio();
    this.music1.src = "sounds/muzyka_dlya_bitv.mp3";
    this.music2 = new Audio();
    this.music2.src = "sounds/morskoe_srazhenie.mp3";

    this.update = function (x, y) {
        let elem;
        if (gameModel.currentField == "field1") {
            elem = document.getElementById(`${y}${x}comp`);
            elem.textContent = "o";
        } else {
            elem = document.getElementById(`${y}${x}`);
            elem.textContent = "o";
        }
    }

    this.paintWoundedCell = function (x, y) {
        let elem;
        if (gameModel.currentField == "field1") {
            elem = document.getElementById(`${y}${x}comp`);
            elem.style.backgroundColor = `${woundedColor}`;
        } else {
            elem = document.getElementById(`${y}${x}`);
            elem.style.backgroundColor = `${woundedColor}`;
        }
    }

    this.countUpdate = function (c1, c2, c3, c4) {
        count1.textContent = `x ${c1}`;
        count2.textContent = `x ${c2}`;
        count3.textContent = `x ${c3}`;
        count4.textContent = `x ${c4}`;
    }

    this.drawShip = function (x, y, shipType, shipHoriz) {
        if (shipHoriz == true) {
            const id = `${y}` + `${x}`;
            const elem = document.getElementById(`${id}comp`);
            const img = document.createElement('img');
            img.src = shipType.image;
            elem.appendChild(img);
            const imgstyle = getComputedStyle(img);
            img.style.position = "absolute";
            img.style.top = `${y * 53 + 25 - parseFloat(imgstyle.height) / 2}px`;
            img.style.left = `${x * 55 - x * 2}px`;
            img.style.width = `${shipType.width}px`;
        } else {
            const id = `${y}` + `${x}`;
            const elem = document.getElementById(`${id}comp`);
            const img = document.createElement('img');
            img.src = shipType.image;
            elem.appendChild(img);
            const imgstyle = getComputedStyle(img);
            img.style.position = "absolute";
            img.style.top = `${y * 53}px`;
            img.style.left = `${x * 53 + 27 + parseFloat(imgstyle.height) / 2}px`;
            img.style.width = `${shipType.width}px`;
            img.style.transform = "rotate(90deg)";
            img.style.transformOrigin = "0% 0%";
        }
    }

    this.drawHorizShip = function (x, y) {
        const id = `${y}` + `${x}`;
        const elem = document.getElementById(`${id}`);
        const img = document.createElement('img');
        img.src = gameModel.currentShip.image;
        elem.appendChild(img);
        const imgstyle = getComputedStyle(img);
        img.style.position = "absolute";
        img.style.top = `${y * 53 + 25 - parseFloat(imgstyle.height) / 2}px`;
        img.style.left = `${x * 55 - x * 2}px`;
        img.style.width = `${gameModel.currentShip.width}px`;
        if (gameModel.currentShip.gunImage) {
            const gun = document.createElement('img');
            gun.src = gameModel.currentShip.gunImage;
            elem.appendChild(gun);
            gun.style.position = "absolute";
            gun.style.top = `${y * 53 + 31 - parseFloat(imgstyle.height) / 2}px`;
            gun.style.left = `${x * 55 + 38 - x * 2}px`;
            gun.style.width = `${gameModel.currentShip.width * 0.2}px`;
            gun.classList.add("rotate-horiz-gun");
        }
    }

    this.drawHorizShip2 = function (x, y, ship) {
        const id = `${y}` + `${x}`;
        const elem = document.getElementById(`${id}`);
        const img = document.createElement('img');
        img.src = ship.image;
        elem.appendChild(img);
        const imgstyle = getComputedStyle(img);
        img.style.position = "absolute";
        img.style.top = `${y * 53 + 25 - parseFloat(imgstyle.height) / 2}px`;
        img.style.left = `${x * 55 - x * 2}px`;
        img.style.width = `${ship.width}px`;
        if (ship.gunImage) {
            const gun = document.createElement('img');
            gun.src = ship.gunImage;
            elem.appendChild(gun);
            gun.style.position = "absolute";
            if (ship.length == 4) {
                gun.style.top = `${y * 53 + 31 - parseFloat(imgstyle.height) / 2}px`;
                gun.style.left = `${x * 55 + 38 - x * 2}px`;
                gun.style.width = `${ship.width * 0.2}px`;
                gun.classList.add("rotate-horiz-gun");
            } else if (ship.length == 2) {
                gun.style.top = `${y * 53 + 30 - parseFloat(imgstyle.height) / 2}px`;
                gun.style.left = `${x * 55 + 18 - x * 2}px`;
                gun.style.width = `${ship.width * 0.2}px`;
            } else if (ship.length == 3) {
                gun.style.top = `${y * 53 + 32 - parseFloat(imgstyle.height) / 2}px`;
                gun.style.left = `${x * 55 + 33 - x * 2}px`;
                gun.style.width = `${ship.width * 0.2}px`;
                gun.classList.add("rotate-horiz-gun");
            }
        }
    }

    this.drawVertShip = function (x, y) {
        const id = `${y}` + `${x}`;
        const elem = document.getElementById(`${id}`);
        const img = document.createElement('img');
        img.src = gameModel.currentShip.image;
        elem.appendChild(img);
        const imgstyle = getComputedStyle(img);
        img.style.position = "absolute";
        img.style.top = `${y * 53}px`;
        img.style.left = `${x * 53 + 27 + parseFloat(imgstyle.height) / 2}px`;
        img.style.width = `${gameModel.currentShip.width}px`;
        img.style.transform = "rotate(90deg)";
        img.style.transformOrigin = "0% 0%";
        if (gameModel.currentShip.gunImageVert) {
            const gun = document.createElement('img');
            gun.src = gameModel.currentShip.gunImageVert;
            elem.appendChild(gun);
            gun.style.position = "absolute";
            gun.style.top = `${y * 53 + 51 - parseFloat(imgstyle.height) / 2}px`;
            gun.style.left = `${x * 55 + 17 - x * 2}px`;
            gun.style.width = `${gameModel.currentShip.width * 0.1}px`;
            gun.classList.add("rotate-vert-gun");
        }
    }

    this.drawVertShip2 = function (x, y, ship) {
        const id = `${y}` + `${x}`;
        const elem = document.getElementById(`${id}`);
        const img = document.createElement('img');
        elem.appendChild(img);
        const imgstyle = getComputedStyle(img);
        img.src = ship.image;
        img.style.position = "absolute";
        img.style.top = `${y * 53}px`;
        img.style.left = `${x * 53 + 27 + parseFloat(imgstyle.height) / 2}px`;
        img.style.width = `${ship.width}px`;
        img.style.transform = "rotate(90deg)";
        img.style.transformOrigin = "0% 0%";
        if (ship.gunImageVert && ship.length != 2) {
            const gun = document.createElement('img');
            gun.src = ship.gunImageVert;
            elem.appendChild(gun);
            gun.style.position = "absolute";
            gun.style.top = `${y * 53 + 51 - parseFloat(imgstyle.height) / 2}px`;
            gun.style.left = `${x * 55 + 17 - x * 2}px`;
            gun.style.width = `${ship.width * 0.1}px`;
            gun.classList.add("rotate-vert-gun");
        }
    }

    // функция выведения сообщения о начале битвы
    this.startBattleNotice = function () {
        const textContainer = document.createElement("span");
        textContainer.textContent = "BATTLE STARTED!";
        textContainer.classList.add("start-battle-notice");
        document.body.appendChild(textContainer);

        setTimeout(removeNotice, 1000);

        function removeNotice() {
            textContainer.classList.add("inactive");
        }

    }

    // функция окрашивания полей убитого корабля
    this.paintKilledShip = function (ship, ships) {
        for (let i = 0; i < ship.length; i++) {
            let x = ship[i][1];
            let y = ship[i][0];
            if (ships.includes(gameModel.ship1comp)) {
                const cell = document.getElementById(`${y}${x}comp`);
                cell.style.backgroundColor = `${killedColor}`;
            } else if (ships.includes(gameModel.ship1user)) {
                const cell = document.getElementById(`${y}${x}`);
                cell.style.backgroundColor = `${killedColor}`;
            }
        }
    }

    // функция для отображения числа ходов
    this.movesCountDisplay = function (counter) {
        const movesSpan = document.getElementById("moves-count");
        movesSpan.textContent = `${counter}`;
    }

    // функция для скрытия кораблей пользователя после установки на поле
    this.hideShips = function (length) {
        if (length == 4) {
            ship1.classList.add("inactive");
        } else if (length == 3) {
            ship2.classList.add("inactive");
        } else if (length == 2) {
            ship3.classList.add("inactive");
        } else if (length == 1) {
            ship4.classList.add("inactive");
        }
    }

    // функция создания анимации взрыва
    this.createExplosion = function (x, y) {
        let elem;
        if (gameModel.currentField == "field1") {
            elem = document.getElementById(`${y}${x}comp`);
        } else {
            elem = document.getElementById(`${y}${x}`);
        }
        let top = `${y * 53}px`;
        let left = `${x * 53}px`;
        let timer;
        let counter = 0;
        let xInit = -8;
        let yInit = -20;
        let xShift = 0;
        let yShift = 0;
        let explosionImage = 'images/boom3.png';
        const container = document.createElement("div");
        container.classList.add("explosion-container");
        elem.appendChild(container);
        timer = requestAnimationFrame(explosionAnim);
        container.style.backgroundImage = `url("${explosionImage}")`;
        container.style.backgroundPosition = `${xInit + xShift}px ${yInit + yShift}px`;
        container.style.top = `${top}`;
        container.style.left = `${left}`;

        function explosionAnim() {
            cancelAnimationFrame(timer);
            if (counter % 8 === 0) {
                xShift = 0;
                yShift -= 62.5;
            } else {
                xShift -= 62.5;
            }
            container.style.backgroundPosition = `${xInit + xShift}px ${yInit + yShift}px`;
            if (counter != 64) {
                timer = requestAnimationFrame(explosionAnim);
            } else {
                container.remove();
            }
            counter++;
        }
    }

    // функция создания анимации горящего огня для раненых кораблей
    this.createFire = function (x, y) {
        if (gameModel.currentField == "field1") {
            elem = document.getElementById(`${y}${x}comp`);
        } else {
            elem = document.getElementById(`${y}${x}`);
        }
        let top = `${y * 53}px`;
        let left = `${x * 53 + 14}px`;
        let timer;
        let counter = 0;
        let xInit = -14;
        let yInit = -5;
        let xShift = 0;
        let yShift = 0;
        let fireImage = 'images/fire4_64.png';
        const container = document.createElement("div");
        container.classList.add("fire-container");
        elem.appendChild(container);
        timer = requestAnimationFrame(fireAmin);
        container.style.backgroundImage = `url("${fireImage}")`;
        container.style.top = `${top}`;
        container.style.left = `${left}`;

        function fireAmin() {
            cancelAnimationFrame(timer);
            if (counter === 60 || counter === 0) {
                counter = 0;
                xShift = 0;
                yShift = 0;
            } else if (counter % 10 === 0) {
                xShift = 0;
                yShift -= 50;
            } else {
                xShift -= 50;
            }
            counter++;
            container.style.backgroundPosition = `${xInit + xShift}px ${yInit + yShift}px`;
            timer = requestAnimationFrame(fireAmin);
        }
    }

    // функция звука взрыва
    this.shootSound = function () {
        let number = Math.floor(Math.random() * 3);

        if (number == 0) {
            self.boom1.play();
        } else if (number == 1) {
            self.boom2.play();
        } else if (number == 2) {
            self.boom3.play();
        }
    }

    this.endGameMenu = function (winOrLoose) {
        const endGameBlockBack = document.createElement("div");
        endGameBlockBack.classList.add("end-game-background");
        const endGameBlock = document.createElement("div");
        endGameBlock.insertAdjacentHTML("afterbegin", `<p class="win-or-loose-text">${winOrLoose}</p>`);

        if (gameModel.hiScoreEnter && winOrLoose == "You win!") {
            const text = document.createElement("p");
            text.classList.add("enter-your-name");
            text.textContent = "YOU PLAYED VERY GOOD! ENTER YOUR NAME: ";
            endGameBlock.appendChild(text);
            //text.style.display = "none";
            const input = document.createElement("input");
            input.setAttribute("type", "text");
            input.setAttribute("value", "unknown");
            input.classList.add("hi-score-input");
            //input.style.display = "none";
            endGameBlock.appendChild(input);
            const inputButton = document.createElement("button");
            inputButton.setAttribute("type", "button");
            //inputButton.style.display = "none";
            inputButton.textContent = "ENTER";
            inputButton.classList.add("end-game-button");
            inputButton.classList.add("input-button");
            endGameBlock.appendChild(inputButton);
            inputButton.addEventListener("click", setHiscore);
            inputButton.addEventListener("click", changeText);
        }

        function changeText() {
            const text = document.querySelector(".enter-your-name");
            const input = document.querySelector(".hi-score-input");
            const inputButton = document.querySelector(".input-button");
            text.style.display = "none";
            input.style.display = "none";
            inputButton.style.display = "none";
            const text2 = document.createElement("p");
            text2.classList.add("congrats");
            text2.textContent = "Congratulations! Now you are in the hiscore list!";
            endGameBlock.appendChild(text2);
        }

        const button1 = document.createElement("button");
        button1.setAttribute("type", "button");
        button1.textContent = "PLAY AGAIN";
        button1.classList.add("end-game-button");
        button1.classList.add("play-again");
        endGameBlock.appendChild(button1);
        const button2 = document.createElement("button");
        button2.setAttribute("type", "button");
        button2.textContent = "MAIN MENU";
        button2.classList.add("end-game-button");
        button2.classList.add("main-menu");
        endGameBlock.appendChild(button2);
        endGameBlock.classList.add("end-game-block");
        document.body.appendChild(endGameBlockBack);
        endGameBlockBack.appendChild(endGameBlock);
        setTimeout(() => { endGameBlock.classList.add("move-down"); }, 10);

        button1.addEventListener("click", closeBlock);
        button2.addEventListener("click", closeBlock);
        button2.addEventListener("click", openpage1);

        function closeBlock() {
            endGameBlock.remove();
            endGameBlockBack.remove();
            self.music2.currentTime = 0;
            self.music2.pause();
            self.music1.play();
            gameModel.reset();
        }
    }

    this.reset = function () {
        const table1 = document.querySelector('.field1');
        const table2 = document.querySelector('.field2');
        const table1cells = table1.getElementsByTagName("td");
        const table2cells = table2.getElementsByTagName("td");
        const table1images = [...table1.getElementsByTagName("img")];
        const table2images = [...table2.getElementsByTagName("img")];
        table1images.forEach(element => {
            element.remove();
        });
        table2images.forEach(element => {
            element.remove();
        });

        for (let i = 0; i < table1cells.length; i++) {
            table1cells[i].style.backgroundColor = "";
            table2cells[i].style.backgroundColor = "";
            table1cells[i].style.backgroundColor = `${mainColor}`;
            table2cells[i].style.backgroundColor = `${mainColor}`;
            table1cells[i].textContent = "";
            table2cells[i].textContent = "";
        };

        table1.classList.remove("user-shoot");

        //const reset = new Event("reset");
        //document.dispatchEvent(reset);

        table1.classList.remove("red-border");
        table2.classList.remove("red-border");
        const startButton = document.getElementById("startButton");
        const resetButton = document.getElementById("resetButton");
        const autoFillButton = document.getElementById("autoFillButton");
        resetButton.classList.remove("inactive");
        startButton.classList.remove("inactive");
        autoFillButton.classList.remove("inactive");
        ship1.classList.remove("inactive");
        ship2.classList.remove("inactive");
        ship3.classList.remove("inactive");
        ship4.classList.remove("inactive");
    }

    // функция для запуска фоновой музыки
    function playMusic() {
        clearInterval(timerForMusic);
        if (gameModel.readytoPlay == true) {
            self.music1.play();
            if (sessionStorage.getItem("musicIsOn") == "false") {
                self.music1.volume = 0;
            } else {
                self.music1.volume = 0.3;
            }
            self.music1.loop = true;
        } else {
            timerForMusic = setInterval(playMusic, 3000);
        }
    }

    this.shipsLeftDisplay = function () {
        const compShipsSpan = document.getElementById('comp-ships-left');
        const userShipsSpan = document.getElementById('user-ships-left');
        compShipsSpan.textContent = `${gameModel.compShipsLeft}`;
        userShipsSpan.textContent = `${gameModel.userShipsLeft}`;
    }

    this.start = function (model) {
        gameModel = model;
        playMusic();
        //self.endGameMenu('You loose!');
    }

}
