window.location.hash = "menu";


$.ajax('menu.html', {
    type: "GET",
    dataType: "html",
    success: renderInitialMenu
});

var links = document.getElementsByTagName('a');
links[0].addEventListener('click', openpage1);


function openpage1(e) {
    e.preventDefault()
    window.location.hash = "menu";
}

function openpage2(e) {
    e.preventDefault()
    window.location.hash = "hiscore";
}

function openpage3(e) {
    e.preventDefault()
    window.location.hash = "rules";
}

function openpage4(e) {
    e.preventDefault()
    window.location.hash = "settings";
}

function openinitialpage(e) {
    e.preventDefault()
    window.location.hash = "";
}

function renderSettingsPage(data) {
    var container = document.getElementById('new-pages-container');
    container.innerHTML = data;
    childMenu();
    setSettings();
}

function renderNewPage(data) {
    var container = document.getElementById('new-pages-container');
    container.innerHTML = data;
    childMenu();
}

function renderHiscorePagePage(data) {
    var container = document.getElementById('new-pages-container');
    container.innerHTML = data;
    fillHiScore();
    childMenu();
}

function renderMenu(data) {
    var container = document.getElementById('new-pages-container');
    container.innerHTML = data;
    mainMenu();
}

function renderInitialMenu(data) {
    var container = document.getElementById('new-pages-container');
    container.innerHTML = data;
    mainMenu();
    document.querySelector('.wrapper').style.display = "";
    document.querySelector('.navigation').style.display = "";
    document.querySelector('.info').style.display = "";
}

function renderInitialPage() {
    var container = document.getElementById('new-pages-container');
    container.innerHTML = "";
}

function updatePage() {
    var hash = location.hash.substr(1);

    switch (hash) {
        case 'menu':
            $.ajax(hash + '.html', {
                type: "GET",
                dataType: "html",
                success: renderMenu
            });
            break;
        case 'hiscore':
            $.ajax(hash + '.html', {
                type: "GET",
                dataType: "html",
                success: renderHiscorePagePage
            })
            break;
        case 'rules':
            $.ajax(hash + '.html', {
                type: "GET",
                dataType: "html",
                success: renderNewPage
            })
            break;
        case 'settings':
            $.ajax(hash + '.html', {
                type: "GET",
                dataType: "html",
                success: renderSettingsPage
            })
            break;
        case '':
            $.ajax('index.html', {
                type: "GET",
                dataType: "html",
                success: renderInitialPage
            })
            break;
    }

}

function mainMenu() {
    const play = document.querySelector(".play");
    const rules = document.querySelector(".rules");
    const settings = document.querySelector(".settings");
    const hiscore = document.querySelector(".hiscore");
    play.addEventListener('click', openinitialpage);
    rules.addEventListener('click', openpage3);
    settings.addEventListener('click', openpage4);
    hiscore.addEventListener('click', openpage2);
    if (model.gameIsOn) {
        const newGameButton = document.querySelector('.new-game')
        newGameButton.style.display = "";
        play.textContent = "RESUME GAME";
        document.getElementById("startButton");
        newGameButton.addEventListener('click', model.reset);
        newGameButton.addEventListener('click', openinitialpage);
    }
}

function childMenu() {
    const mainMenu = document.querySelector(".back-to-main-menu");
    mainMenu.addEventListener('click', openpage1);
}

function fillHiScore() {
    if (localStorage.getItem("hiscore")) {
        let hiscore = JSON.parse(localStorage.getItem("hiscore"));
        const items = document.querySelectorAll('.hiscore-list li');
        for (let i = 0; i < hiscore.length; i++) {
            items[i].textContent = `${hiscore[i][0]}: ${hiscore[i][1]}`;
        }
    }
}


window.onhashchange = updatePage;

