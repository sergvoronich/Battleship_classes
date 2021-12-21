
function GameController() {
    let gameModel = null;
    let enemyfield = document.querySelector(".field1");
    let userfield = document.querySelector(".field2");

    const startButton = document.getElementById("startButton");
    const resetButton = document.getElementById("resetButton");
    const autoFillButton = document.getElementById("autoFillButton");
    const woundedColor = "rgba(218, 136, 126, 0.6)";
    const killedColor = "rgba(73, 1, 1, 0.6)";

    let ship1userDisplay = document.querySelector(".ship1-table.active");
    let ship2userDisplay = document.querySelector(".ship2-table.active");
    let ship3userDisplay = document.querySelector(".ship3-table.active");
    let ship4userDisplay = document.querySelector(".ship4-table");
    let dragPoint = null;
    let shootAllowed = false;
    let toggle = 2;
    let letUserShoot = true;

    function mouseDown(e) {
        dragPoint = e.target;
    }

    // функция изменения расположения корабля пользователя с горизонтального на вертикальное и обратно
    function horVertChange(e) {
        e.preventDefault();
        let active;
        let inactive;
        let img;

        if (e.target.closest(".ship1") != null) {
            active = document.querySelector(".ship1-table.active");
            inactive = document.querySelector(".ship1-table.inactive");
            img = document.querySelector(".ship1 img");
            active.classList.toggle("active");
            active.classList.toggle("inactive");
            inactive.classList.toggle("inactive");
            inactive.classList.toggle("active");
            img.classList.toggle("rotate");
            ship1userDisplay = document.querySelector(".ship1-table.active");
            ship1userDisplay.addEventListener('dragstart', dragStart);
            ship1userDisplay.addEventListener('mousedown', mouseDown);
            ship1userDisplay.addEventListener('contextmenu', horVertChange);
        } else if (e.target.closest(".ship2") != null) {
            active = document.querySelector(".ship2-table.active");
            inactive = document.querySelector(".ship2-table.inactive");
            img = document.querySelector(".ship2 img");
            active.classList.toggle("active");
            active.classList.toggle("inactive");
            inactive.classList.toggle("inactive");
            inactive.classList.toggle("active");
            img.classList.toggle("rotate");
            ship2userDisplay = document.querySelector(".ship2-table.active");
            ship2userDisplay.addEventListener('dragstart', dragStart);
            ship2userDisplay.addEventListener('mousedown', mouseDown);
            ship2userDisplay.addEventListener('contextmenu', horVertChange);
        } else if (e.target.closest(".ship3") != null) {
            active = document.querySelector(".ship3-table.active");
            inactive = document.querySelector(".ship3-table.inactive");
            img = document.querySelector(".ship3 img");
            active.classList.toggle("active");
            active.classList.toggle("inactive");
            inactive.classList.toggle("inactive");
            inactive.classList.toggle("active");
            img.classList.toggle("rotate");
            ship3userDisplay = document.querySelector(".ship3-table.active");
            ship3userDisplay.addEventListener('dragstart', dragStart);
            ship3userDisplay.addEventListener('mousedown', mouseDown);
            ship3userDisplay.addEventListener('contextmenu', horVertChange);
        }
    }

    // ряд функций drag, предназначенных для установки вручную кораблей пользователя на поле
    function dragStart(e) {
        gameModel.shiplength = e.target.querySelectorAll("td").length;
        gameModel.dragStartFunc();
    }

    function dragover(e) {
        e.preventDefault();
    }

    function dragleave(e) {
        e.preventDefault();
    }

    function drop(e) {
        if (e.target.tagName == "TD" && gameModel.currentShip.quantity > 0) {
            let indexes = e.target.getAttribute("id").split('');
            let y = parseInt(indexes[0]);
            let x = parseInt(indexes[1]);
            if (dragPoint.closest(".ship-table-hor")) {
                if (dragPoint.classList.contains("part02")) {
                    x -= 1;
                } else if (dragPoint.classList.contains("part03")) {
                    x -= 2;
                } else if (dragPoint.classList.contains("part04")) {
                    x -= 3;
                }
                dragPoint = null;
                gameModel.dropHorizShip(x, y);

            } else if (dragPoint.closest(".ship-table-vert")) {
                if (dragPoint.classList.contains("part02")) {
                    y -= 1;
                } else if (dragPoint.classList.contains("part03")) {
                    y -= 2;
                } else if (dragPoint.classList.contains("part04")) {
                    y -= 3;
                }
                dragPoint = null;
                gameModel.dropVertShip(x, y);
            }

            const shipsfilled = new Event('shipsfilled');
            document.dispatchEvent(shipsfilled);
        }
    }

    // функция проверки готовности к битве
    function readyToBattleCheck() {
        let ready = gameModel.shipsFilledCheck();
        if (ready) {
            shootAllowed = true;
            gameModel.startBattle();
            userShoot();
            resetButton.classList.add("inactive");
            startButton.classList.add("inactive");
            autoFillButton.classList.add("inactive");
        }
    }

    // функция переключения хода между пользователем и компьютером
    function switchPlayer() {
        if (toggle == 1 && shootAllowed) {
            gameModel.currentField = "field1";
            toggle = 2;
            setTimeout(userShoot, 500);
        } else if (toggle == 2 && shootAllowed) {
            gameModel.currentField = "field2";
            toggle = 1;
            setTimeout(compShoot, 500);
        }
    }

    // функция установки слушателей выстрела пользователя на поле компьютера и первичного анализа выстрела
    function userShoot() {
        if (shootAllowed) {
            letUserShoot = true;
            enemyfield.addEventListener('click', userShootCapture);
            userfield.classList.remove("red-border");
            enemyfield.classList.add("red-border");
            enemyfield.classList.add("user-shoot");
        }
    }

    function userShootCapture(e) {
        if (e.target.tagName == "TD") {
            let id = e.target.getAttribute("id");
            let indexes = id.substr(0, 2);
            let hitString = indexes.split('');
            let y = parseInt(hitString[0]);
            let x = parseInt(hitString[1]);

            const cell = document.getElementById(`${y}${x}comp`);
            if (cell.textContent != "o" && cell.style.backgroundColor != `${woundedColor}`
                && cell.style.backgroundColor != `${killedColor}` && letUserShoot) {
                setTimeout(switchPlayer, 1500);
                gameModel.userShootFunc(x, y);
                letUserShoot = false;
                enemyfield.removeEventListener('click', userShootCapture);
            }
        }
    }

    // функция, вызывающая функцию выстрела компьютера в модели
    function compShoot() {
        setTimeout(switchPlayer, 2000);
        enemyfield.classList.remove("red-border");
        userfield.classList.add("red-border");
        enemyfield.classList.remove("user-shoot");
        gameModel.compShootFunc();
    }

    this.start = function (model) {
        gameModel = model;
        ship1userDisplay.addEventListener('dragstart', dragStart);
        ship1userDisplay.addEventListener('mousedown', mouseDown);
        ship2userDisplay.addEventListener('dragstart', dragStart);
        ship2userDisplay.addEventListener('mousedown', mouseDown);
        ship3userDisplay.addEventListener('dragstart', dragStart);
        ship3userDisplay.addEventListener('mousedown', mouseDown);
        ship4userDisplay.addEventListener('dragstart', dragStart);
        ship4userDisplay.addEventListener('mousedown', mouseDown);

        ship1userDisplay.addEventListener('contextmenu', horVertChange);
        ship2userDisplay.addEventListener('contextmenu', horVertChange);
        ship3userDisplay.addEventListener('contextmenu', horVertChange);

        userfield.addEventListener('dragover', dragover);
        userfield.addEventListener('dragleave', dragleave);
        userfield.addEventListener('drop', drop);

        document.addEventListener('click', gameModel.startPlayMusic);
        document.addEventListener('shipsfilled', gameModel.shipsFilledCheck);
        //document.addEventListener('reset', reset);

        startButton.addEventListener('click', readyToBattleCheck);
        resetButton.addEventListener('click', gameModel.reset);
        autoFillButton.addEventListener('click', gameModel.autofill);
    }

}
