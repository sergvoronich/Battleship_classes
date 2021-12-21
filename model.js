

function GameModel() {
    let gameView = null;

    this.start = function (view) {
        gameView = view;
        this.autofill();
        gameView.countUpdate(this.ship1user.quantity, this.ship2user.quantity, this.ship3user.quantity, this.ship4user.quantity);
        if (sessionStorage.getItem("level")) {
            this.level = sessionStorage.getItem("level");
        }
    }

    function createField() {
        return [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];
    }

    let field1 = createField();
    let field2 = createField();
    const self = this;

    this.level = 2;
    this.currentShip = {};
    this.shiplength = 0;
    this.readytoPlay = false;
    this.currentField;
    this.gameIsOn = false;
    this.hiScoreEnter = false;
    this.movesCounter = 1;
    this.compShipsLeft = 10;
    this.userShipsLeft = 10;
    this.shootAllowed = false;

    let woundedShipDetected = false;
    let firstHitCell = [];
    let currentHitCell = [];

    sessionStorage.setItem("areaAutoFill", "true");

    this.ship1comp = {
        length: 4,
        initquantity: 1,
        quantity: 1,
        items: [[]],
        adjacentArea: [[]],
        shot: [0],
        image: "ships_images/Battleship/ShipBattleshipHull.png",
        gunImage: "ships_images/Battleship/WeaponBattleshipStandardGun.png",
        gunImageVert: "ships_images/Battleship/WeaponBattleshipStandardGunVert.png",
        horiz: [],
        width: 210,
    };

    this.ship2comp = {
        length: 3,
        initquantity: 2,
        quantity: 2,
        items: [[], []],
        adjacentArea: [[], []],
        shot: [0, 0],
        image: "ships_images/Cruiser/ShipCruiserHull.png",
        horiz: [],
        width: 160,
    };

    this.ship3comp = {
        length: 2,
        initquantity: 3,
        quantity: 3,
        items: [[], [], []],
        adjacentArea: [[], [], []],
        shot: [0, 0, 0],
        image: "ships_images/Destroyer/ShipDestroyerHull.png",
        horiz: [],
        width: 107,
    };

    this.ship4comp = {
        length: 1,
        initquantity: 4,
        quantity: 4,
        items: [[], [], [], []],
        adjacentArea: [[], [], [], []],
        shot: [0, 0, 0, 0],
        image: "ships_images/Plane/PlaneF-35Lightning2.png",
        horiz: [],
        width: 54,
    };

    this.ship1user = {
        length: 4,
        initquantity: 1,
        quantity: 1,
        display: null,
        items: [[]],
        adjacentArea: [[]],
        shot: [0],
        image: "ships_images/Battleship/ShipBattleshipHull.png",
        gunImage: "ships_images/Battleship/WeaponBattleshipStandardGun.png",
        gunImageVert: "ships_images/Battleship/WeaponBattleshipStandardGunVert.png",
        horiz: [],
        width: 210,
    };

    this.ship2user = {
        length: 3,
        initquantity: 2,
        quantity: 2,
        display: null,
        items: [[], []],
        adjacentArea: [[], []],
        shot: [0, 0],
        image: "ships_images/Cruiser/ShipCruiserHull.png",
        gunImage: "ships_images/Cruiser/WeaponSubmarineStandard.png",
        gunImageVert: "ships_images/Cruiser/WeaponSubmarineStandardVert.png",
        horiz: [],
        width: 160,
    };

    this.ship3user = {
        length: 2,
        initquantity: 3,
        quantity: 3,
        display: null,
        items: [[], [], []],
        adjacentArea: [[], [], []],
        shot: [0, 0, 0],
        image: "ships_images/Destroyer/ShipDestroyerHull.png",
        gunImage: "ships_images/Destroyer/WeaponDestroyerStandardGun.png",
        gunImageVert: "ships_images/Destroyer/WeaponDestroyerStandardGunVert.png",
        horiz: [],
        width: 107,
    };

    this.ship4user = {
        length: 1,
        initquantity: 4,
        quantity: 4,
        display: null,
        items: [[], [], [], []],
        adjacentArea: [[], [], [], []],
        shot: [0, 0, 0, 0],
        image: "ships_images/Plane/PlaneF-35Lightning2.png",
        horiz: [],
        width: 54,
    };

    const allships = [this.ship1comp, this.ship2comp, this.ship3comp, this.ship4comp, this.ship1user, this.ship2user, this.ship3user, this.ship4user];
    const compships = [this.ship1comp, this.ship2comp, this.ship3comp, this.ship4comp];
    const userships = [this.ship1user, this.ship2user, this.ship3user, this.ship4user];

    // функция, проверяющая, свободны ли ячейки для корабля при горизонтальном расположении
    function checkVertPath(x, y, ship, field) {
        let errors = 0;
        if ((y + ship.length) <= field.length && field[y][x] != 1) {
            for (let i = 0; i < ship.length; i++) {
                if (y === 0) {
                    if (x === 0) {
                        // проверки верхнего левого угла
                        if (field[y + i + 1][x] != 1 && field[y + i + 1][x + 1] != 1 && field[y + i][x + 1] != 1) {
                            errors += 0;
                        } else {
                            errors += 1;
                        }
                    } else if (x === 9) {
                        // проверки верхнего правого угла
                        if (field[y + i + 1][x] != 1 && field[y + i + 1][x - 1] != 1 && field[y + i][x - 1] != 1) {
                            errors += 0;
                        } else {
                            errors += 1;
                        }
                    } else {
                        // проверки остальных крайних полей по линии у=0
                        if (field[y + i][x - 1] != 1 && field[y + i + 1][x - 1] != 1
                            && field[y + i + 1][x] != 1 && field[y + i][x + 1] != 1 && field[y + i + 1][x + 1] != 1) {
                            errors += 0;
                        } else {
                            errors += 1;
                        }
                    }
                } else if (y + i === 9) {
                    if (x === 0) {
                        // проверки нижнего левого угла
                        if (field[y + i - 1][x] != 1 && field[y + i - 1][x + 1] != 1 && field[y + i][x + 1] != 1) {
                            errors += 0;
                        } else {
                            errors += 1;
                        }
                    } else if (x === 9) {
                        // проверки нижнего правого угла
                        if (field[y + i - 1][x - 1] != 1 && field[y + i][x - 1] != 1 && field[y + i - 1][x] != 1) {
                            errors += 0;
                        } else {
                            errors += 1;
                        }
                    } else {
                        // проверки остальных крайних полей по линии у=10
                        if (field[y + i - 1][x - 1] != 1 && field[y + i][x - 1] != 1
                            && field[y + i - 1][x] != 1 && field[y + i - 1][x + 1] != 1 && field[y + i][x + 1] != 1) {
                            errors += 0;
                        } else {
                            errors += 1;
                        }
                    }
                } else if (x === 0) {
                    // проверки крайних полей по линии х=0
                    if (field[y + i - 1][x] != 1 && field[y + i + 1][x] != 1
                        && field[y + i - 1][x + 1] != 1 && field[y + i][x + 1] != 1 && field[y + i + 1][x + 1] != 1) {
                        errors += 0;
                    } else {
                        errors += 1;
                    }
                } else if (x === 9) {
                    // проверки крайних полей по линии х=10
                    if (field[y + i - 1][x - 1] != 1 && field[y + i][x - 1] != 1 && field[y + i + 1][x - 1] != 1
                        && field[y + i - 1][x] != 1 && field[y + i + 1][x] != 1) {
                        errors += 0;
                    } else {
                        errors += 1;
                    }
                } else {
                    if (field[y + i - 1][x - 1] != 1 && field[y + i][x - 1] != 1 && (field[y + i + 1][x - 1] != 1) &&
                        field[y + i - 1][x] != 1 && field[y + i + 1][x] != 1
                        && field[y + i - 1][x + 1] != 1 && field[y + i][x + 1] != 1 && field[y + i + 1][x + 1] != 1) {
                        errors += 0;
                    } else {
                        errors += 1;
                    }
                }
            }

        } else {
            errors += 1;
        }

        if (errors === 0) {
            return true;
        } else {
            return false;
        }

    }

    // функция, проверяющая, свободны ли ячейки для корабля при вертикальном расположении
    function checkHorPath(x, y, ship, field) {
        let errors = 0;
        if ((x + ship.length) <= field[0].length && field[y][x] != 1) {
            for (let i = 0; i < ship.length; i++) {
                if (y === 0) {
                    if (x === 0) {
                        // проверки верхнего левого угла
                        if (field[y + 1][x + i] != 1 && field[y + 1][x + i + 1] != 1 && field[y][x + i + 1] != 1) {
                            errors += 0;
                        } else {
                            errors += 1;
                        }
                    } else if (x === 9) {
                        // проверки верхнего правого угла
                        if (field[y + 1][x + i] != 1 && field[y + 1][x + i - 1] != 1 && field[y][x + i - 1] != 1) {
                            errors += 0;
                        } else {
                            errors += 1;
                        }
                    } else {
                        // проверки остальных крайних полей по линии у=0
                        if (field[y][x + i - 1] != 1 && field[y + 1][x + i - 1] != 1
                            && field[y + 1][x + i] != 1 && field[y][x + i + 1] != 1 && field[y + 1][x + i + 1] != 1) {
                            errors += 0;
                        } else {
                            errors += 1;
                        }
                    }
                } else if (y === 9) {
                    if (x === 0) {
                        // проверки нижнего левого угла
                        if (field[y - 1][x + i] != 1 && field[y - 1][x + i + 1] != 1 && field[y][x + i + 1] != 1) {
                            errors += 0;
                        } else {
                            errors += 1;
                        }
                    } else if (x === 9) {
                        // проверки нижнего правого угла
                        if (field[y - 1][x + i - 1] != 1 && field[y][x + i - 1] != 1 && field[y - 1][x + i] != 1) {
                            errors += 0;
                        } else {
                            errors += 1;
                        }
                    } else {
                        // проверки остальных крайних полей по линии у=10
                        if (field[y - 1][x + i - 1] != 1 && field[y][x + i - 1] != 1
                            && field[y - 1][x + i] != 1 && field[y - 1][x + i + 1] != 1 && field[y][x + i + 1] != 1) {
                            errors += 0;
                        } else {
                            errors += 1;
                        }
                    }
                } else if (x === 0) {
                    // проверки крайних полей по линии х=0
                    if (field[y - 1][x + i] != 1 && (field[y + 1][x + i] != 1)
                        && field[y - 1][x + i + 1] != 1 && field[y][x + i + 1] != 1 && field[y + 1][x + i + 1] != 1) {
                        errors += 0;
                    } else {
                        errors += 1;
                    }
                } else if (x === 9) {
                    // проверки крайних полей по линии х=10
                    if (field[y - 1][x + i - 1] != 1 && field[y][x + i - 1] != 1 && field[y + 1][x + i - 1] != 1
                        && field[y - 1][x + i] != 1 && field[y + 1][x + i] != 1) {
                        errors += 0;
                    } else {
                        errors += 1;
                    }
                } else {
                    // проверки всех остальных полей
                    if ((field[y - 1][x + i - 1] != 1) && (field[y][x + i - 1] != 1) &&
                        (field[y + 1][x - 1 + i] != 1)
                        && (field[y - 1][x + i] != 1) && (field[y + 1][x + i] != 1)
                        && (field[y - 1][x + i + 1] != 1) && (field[y][x + i + 1] != 1) && (field[y + 1][x + i + 1] != 1)) {
                        errors += 0;
                    } else {
                        errors += 1;
                    }
                }
            }

        } else {
            errors += 1;
        }

        if (errors === 0) {
            return true;
        } else {
            return false;
        }

    }

    // функция установки корабля на поле
    function fillField(ship, player) {
        let field;
        if (player == 'comp') {
            field = field1;
        } else if (player == 'user') {
            field = field2;
        }
        let counter = 0;
        let quantity = ship.quantity;
        for (let i = 0; i < ship.quantity + counter; i++) {
            let x = Math.floor(Math.random() * 10);
            let y = Math.floor(Math.random() * 10);
            if (checkHorPath(x, y, ship, field)) {
                quantity--;
                ship.horiz.unshift(true);

                if (player == 'user') {
                    gameView.drawHorizShip2(x, y, ship);
                }

                for (let i = 0; i < ship.length; i++) {
                    field[y][x + i] = 1;
                    ship.items[quantity].push([y, x + i]);
                }
            } else if (checkVertPath(x, y, ship, field)) {
                quantity--;
                ship.horiz.unshift(false);
                if (player == 'user') {
                    gameView.drawVertShip2(x, y, ship);
                }
                for (let i = 0; i < ship.length; i++) {
                    field[y + i][x] = 1;
                    ship.items[quantity].push([y + i, x]);
                }
            } else {
                counter++;
            }
        }
        ship.quantity = quantity;
    }

    // функция автоматической установки всех кораблей сразу
    this.autofill = function (e) {
        let temp = 0;
        if (!e) {
            temp = document.querySelector('.field1');

            field1 = createField();

            fillField(self.ship1comp, 'comp');
            fillField(self.ship2comp, 'comp');
            fillField(self.ship3comp, 'comp');
            fillField(self.ship4comp, 'comp');

        } else {
            temp = document.querySelector('.field2');

            fillField(self.ship1user, 'user');
            fillField(self.ship2user, 'user');
            fillField(self.ship3user, 'user');
            fillField(self.ship4user, 'user');
        }

        gameView.countUpdate(self.ship1user.quantity, self.ship2user.quantity, self.ship3user.quantity, self.ship4user.quantity);

        const shipsfilled = new Event('shipsfilled');
        document.dispatchEvent(shipsfilled);

    }

    // функции, вызываемые при вызове соответствующих функций drag в контроллере
    this.dragStartFunc = function () {
        if (this.shiplength == 4) {
            this.currentShip = this.ship1user;
        } else if (this.shiplength == 3) {
            this.currentShip = this.ship2user;
        } else if (this.shiplength == 2) {
            this.currentShip = this.ship3user;
        } else if (this.shiplength == 1) {
            this.currentShip = this.ship4user;
        }
    }

    this.dropHorizShip = function (x, y) {
        if (checkHorPath(x, y, this.currentShip, field2)) {
            gameView.drawHorizShip(x, y); // обращение к представлению
            for (let i = 0; i < this.shiplength; i++) {
                field2[y][x + i] = 1;
                this.currentShip.items[this.currentShip.quantity - 1].push([y, x + i]);
            }
            this.currentShip.quantity--;
            gameView.countUpdate(this.ship1user.quantity, this.ship2user.quantity, this.ship3user.quantity, this.ship4user.quantity); // обращение к представлению
        }
    }

    this.dropVertShip = function (x, y) {
        if (checkVertPath(x, y, this.currentShip, field2)) {
            gameView.drawVertShip(x, y); // обращение к представлению
            for (let i = 0; i < this.shiplength; i++) {
                field2[y + i][x] = 1;
                this.currentShip.items[this.currentShip.quantity - 1].push([y + i, x]);
            }
            this.currentShip.quantity--;
            gameView.countUpdate(this.ship1user.quantity, this.ship2user.quantity, this.ship3user.quantity, this.ship4user.quantity); // обращение к представлению
        }
    }

    ////////////////////////////////////////////////////////////////////// battle start //////////////////////////////////////////////////////////////////////

    // функция начала битвы
    this.startBattle = function () {
        console.log('Battle started!');
        self.gameIsOn = true;
        gameView.startBattleNotice();
        self.currentField = "field1";

        shipsAdjacentAreaCapture();

    }

    // функция выстрела пользователя
    this.userShootFunc = function (x, y) {
        let hit = [y, x];
        gameView.movesCountDisplay(self.movesCounter);
        self.movesCounter++;
        gameView.createExplosion(x, y, field1);
        gameView.shootSound();

        if (field1[y][x] == 0) {
            field1[y][x] = 2;
            setTimeout(() => { gameView.update(x, y) }, 1000);
        } else if (field1[y][x] == 1) {
            field1[y][x] = 3;

            setTimeout(() => {
                gameView.paintWoundedCell(x, y);
                gameView.createFire(x, y);
                killedCheck(hit, compships);
            }, 1000);
        }
    }

    // функция выстрела компьютера (учитывает различные уровни сложности)
    this.compShootFunc = function () {
        let counter = 0;

        if (woundedShipDetected && self.level == 2) {
            shootIfWounded();
        } else {
            shoot();
        }

        function shoot() {
            let x = Math.floor(Math.random() * 10);
            let y = Math.floor(Math.random() * 10);
            let hit = [y, x];
            if (field2[y][x] == 0) {
                field2[y][x] = 2;
                setTimeout(() => {
                    gameView.createExplosion(x, y);
                    gameView.shootSound();
                }, 500);
                setTimeout(() => { gameView.update(x, y) }, 1500);
            } else if (field2[y][x] == 1) {
                firstHitCell = [];
                currentHitCell = [];
                firstHitCell.push(y);
                firstHitCell.push(x);
                currentHitCell.push(y);
                currentHitCell.push(x);
                woundedShipDetected = true;
                field2[y][x] = 3;
                setTimeout(() => {
                    gameView.createExplosion(x, y);
                    gameView.shootSound();
                }, 500);
                setTimeout(() => {
                    gameView.paintWoundedCell(x, y);
                    gameView.createFire(x, y);
                    killedCheck(hit, userships);
                }, 1500)
            } else if (field2[y][x] == 2 || field2[y][x] == 3) {
                shoot();
            }
        }

        function shootIfWounded() {
            let number = Math.floor(Math.random() * 4);
            let x, y;

            if (number == 0) {
                x = currentHitCell[1] - 1;
                y = currentHitCell[0];
            } else if (number == 1) {
                x = currentHitCell[1] + 1;
                y = currentHitCell[0];
            } else if (number == 2) {
                x = currentHitCell[1];
                y = currentHitCell[0] - 1;
            } else if (number == 3) {
                x = currentHitCell[1];
                y = currentHitCell[0] + 1;
            }

            if (x > 9 || y > 9 || x < 0 || y < 0) {
                shootIfWounded();
            } else {
                let hit = [y, x];
                if (field2[y][x] == 0) {
                    field2[y][x] = 2;
                    setTimeout(() => {
                        gameView.createExplosion(x, y);
                        gameView.shootSound();
                    }, 500);
                    setTimeout(() => { gameView.update(x, y) }, 1500);
                    counter = 0;
                } else if (field2[y][x] == 1) {
                    currentHitCell = [y, x];
                    field2[y][x] = 3;
                    setTimeout(() => {
                        gameView.createExplosion(x, y);
                        gameView.shootSound();
                    }, 500);
                    setTimeout(() => {
                        gameView.paintWoundedCell(x, y);
                        gameView.createFire(x, y);
                        killedCheck(hit, userships);
                    }, 1500)
                    counter = 0;
                } else if (field2[y][x] == 2 || field2[y][x] == 3) {
                    counter++;
                    if (counter > 64) {
                        currentHitCell = firstHitCell;
                    }
                    shootIfWounded();
                }
            }
        }
    }

    // функция, проверяющая, убит ли корабль
    function killedCheck(hit, ships) {
        for (let i = 0; i < ships.length; i++) {
            for (let j = 0; j < ships[i].items.length; j++) {
                for (let n = 0; n < ships[i].items[j].length; n++) {
                    if (ships[i].items[j][n][0] == hit[0] && ships[i].items[j][n][1] == hit[1]) {
                        ships[i].shot[j] += 1;
                    }
                }

                if (ships[i].shot[j] === ships[i].length) {
                    ships[i].shot[j] = "killed";

                    const ship = ships[i].items[j];
                    const shipType = ships[i];
                    const shipHoriz = ships[i].horiz[j];
                    const shipAdjacentArea = ships[i].adjacentArea[j];
                    let x = ship[0][1];
                    let y = ship[0][0];
                    if (ships.includes(self.ship1comp)) {
                        if (sessionStorage.getItem("areaAutoFill") == "true") {
                            for (let i = 0; i < shipAdjacentArea.length; i++) {
                                const a = shipAdjacentArea[i][0];
                                const b = shipAdjacentArea[i][1];
                                if (field1[a][b] == 0) {
                                    field1[a][b] = 2;
                                    gameView.update(b, a);
                                }
                            }
                        }
                        gameView.drawShip(x, y, shipType, shipHoriz);
                        gameView.paintKilledShip(ship, ships);
                    } else {
                        if (sessionStorage.getItem("areaAutoFill") == "true") {
                            for (let i = 0; i < shipAdjacentArea.length; i++) {
                                const a = shipAdjacentArea[i][0];
                                const b = shipAdjacentArea[i][1];
                                if (field2[a][b] == 0) {
                                    field2[a][b] = 2;
                                    gameView.update(b, a);
                                }
                            }
                        }
                        woundedShipDetected = false;
                        gameView.paintKilledShip(ship, ships);
                    }
                }
            }
        }
        endGameCheck();
        gameView.shipsLeftDisplay();
    }

    // функция, проверяющая, установлены ли все корабли на поле
    this.shipsFilledCheck = function () {
        let errors = 0;
        for (let i = 0; i < allships.length; i++) {
            if (allships[i].quantity != 0) {
                errors++;
            } else {
                if (userships.includes(allships[i])) {
                    gameView.hideShips(allships[i].length);
                }
            }
        }
        if (errors == 0) {
            return true;
        } else {
            return false;
        }
    }

    // функция, сохраняющая информацию о соседних полях вокруг корабля
    function shipsAdjacentAreaCapture() {
        for (let i = 0; i < allships.length; i++) {
            for (let j = 0; j < allships[i].items.length; j++) {
                for (let n = 0; n < allships[i].items[j].length; n++) {
                    const yCoord = allships[i].items[j][n][0];
                    const xCoord = allships[i].items[j][n][1];
                    allships[i].adjacentArea[j].push([yCoord - 1, xCoord - 1]);
                    allships[i].adjacentArea[j].push([yCoord, xCoord - 1]);
                    allships[i].adjacentArea[j].push([yCoord + 1, xCoord - 1]);
                    allships[i].adjacentArea[j].push([yCoord - 1, xCoord]);
                    allships[i].adjacentArea[j].push([yCoord + 1, xCoord]);
                    allships[i].adjacentArea[j].push([yCoord - 1, xCoord + 1]);
                    allships[i].adjacentArea[j].push([yCoord, xCoord + 1]);
                    allships[i].adjacentArea[j].push([yCoord + 1, xCoord + 1]);
                }
            }
        }

        for (let i = 0; i < allships.length; i++) {
            for (let j = 0; j < allships[i].adjacentArea.length; j++) {
                allships[i].adjacentArea[j] = allships[i].adjacentArea[j].filter(a => a[0] >= 0 && a[1] >= 0 && a[0] < 10 && a[1] < 10);
            }
        }
    }

    this.startPlayMusic = function () {
        self.readytoPlay = true;
    }

    // функция, проверяющая, закончилась ли игра
    function endGameCheck() {
        let liveUserShips = 0;
        let liveCompShips = 0;
        for (let i = 0; i < userships.length; i++) {
            for (let j = 0; j < userships[i].shot.length; j++) {
                if (userships[i].shot[j] != "killed") {
                    liveUserShips++;
                }
            }
        }

        for (let i = 0; i < compships.length; i++) {
            for (let j = 0; j < compships[i].shot.length; j++) {
                if (compships[i].shot[j] != "killed") {
                    liveCompShips++;
                }
            }
        }

        self.compShipsLeft = liveCompShips;
        self.userShipsLeft = liveUserShips;

        if (liveCompShips === 0) endGame("user");
        if (liveUserShips === 0) endGame("comp");

    }

    // функция, срабатывающая, когда игра закончилась
    function endGame(winner) {
        gameIsOn = false;
        gameView.music1.currentTime = 0;
        gameView.music1.pause();
        gameView.music2.play();
        gameView.music2.volume = 0.3;
        gameView.music2.loop = true;
        self.shootAllowed = false;
        let winOrLoose;
        if (winner == "user") {
            winOrLoose = "You win!"
        } else if (winner == "comp") {
            winOrLoose = "You loose!"
        }

        checkHiscore();
        gameView.endGameMenu(winOrLoose);
    }

    // функция обнуления полей, чтобы заново начать игру
    this.reset = function () {
        field1 = createField();
        field2 = createField();
        gameView.reset();

        self.gameIsOn = false;
        shootAllowed = false;
        self.compShipsLeft = 10;
        self.userShipsLeft = 10;
        self.movesCounter = 0;
        gameView.movesCountDisplay(self.movesCounter);

        for (let i = 0; i < allships.length; i++) {
            allships[i].quantity = allships[i].initquantity;

            for (let j = 0; j < allships[i].shot.length; j++) {
                allships[i].shot[j] = 0;
            };

            for (let j = 0; j < allships[i].items.length; j++) {
                allships[i].items[j] = [];
            }

            for (let j = 0; j < allships[i].adjacentArea.length; j++) {
                allships[i].adjacentArea[j] = [];
            }

            allships[i].adjacentArea.length = allships[i].items.length;
            allships[i].horiz = [];
        }
        self.autofill();
        gameView.shipsLeftDisplay();
    }


    function checkHiscore() {
        const hiscore = JSON.parse(localStorage.getItem("hiscore"));
        if (!hiscore || hiscore.length < 5) {
            self.hiScoreEnter = true;
        } else {
            for (let i = 0; i < 5; i++) {
                if (self.movesCounter < hiscore[i][1]) {
                    self.hiScoreEnter = true;
                }
            }
        }
    }

}
