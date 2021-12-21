// функция для инициализации и установки слушателей на радиокнопки и выпадающий список
function setSettings() {
    const musicRadioButton = document.querySelector(".music input");
    const musicRadioButton2 = document.querySelector(".music input:last-child");
    if (sessionStorage.getItem("musicIsOn") == "false") {
        musicRadioButton2.setAttribute("checked", "");
    } else {
        musicRadioButton.setAttribute("checked", "");
    }

    const soundsRadioButton = document.querySelector(".sounds input");
    const soundsRadioButton2 = document.querySelector(".sounds input:last-child");
    if (sessionStorage.getItem("soundsIsOn") == "false") {
        soundsRadioButton2.setAttribute("checked", "");
    } else {
        soundsRadioButton.setAttribute("checked", "");
    }

    const option1 = document.getElementById("level-1");
    const option2 = document.getElementById("level-2");
    const option3 = document.getElementById("level-3");
    if (sessionStorage.getItem("level") == "1") {
        option1.setAttribute("selected", "");
    } else if (sessionStorage.getItem("level") == "3") {
        option3.setAttribute("selected", "");
    } else {
        option2.setAttribute("selected", "");
    }

    const levelBlock = document.getElementById("level");
    const musicBlock = document.querySelector(".music");
    const soundsBlock = document.querySelector(".sounds");
    const shadow = document.querySelector('.shadow');
    if (model.gameIsOn == false) {
        shadow.classList.add('inactive');
        levelBlock.addEventListener('click', changeLevel);
    } else {
        shadow.classList.remove('inactive');
    }
    musicBlock.addEventListener('click', changeMusicRadio);
    soundsBlock.addEventListener('click', changeSoundsRadio);

    const checkbox = document.getElementById('area');
    if (sessionStorage.getItem("areaAutoFill") == "true") {
        checkbox.setAttribute("checked", "");
    } else {
        checkbox.removeAttribute("checked");
    }
    checkbox.addEventListener('click', changeAreaAutoFillSetting);
}

// функция изменения настройки автоматического заполнения полей вокруг убитого корабля
function changeAreaAutoFillSetting() {
    const checkbox = document.getElementById('area');
    if (checkbox.checked) {
        sessionStorage.setItem("areaAutoFill", "true");
    } else {
        sessionStorage.setItem("areaAutoFill", "false");
    }
}

// функция включения/выключения музыки
function changeMusicRadio() {
    const musicRadioButton = document.querySelector(".music input");
    const musicRadioButton2 = document.querySelector(".music input:last-child");
    if (musicRadioButton.checked) {
        view.music1.volume = 0.3;
        sessionStorage.setItem("musicIsOn", "true");
    } else if (musicRadioButton2.checked) {
        view.music1.volume = 0;
        sessionStorage.setItem("musicIsOn", "false");
    }
}

// функция включения/выключения звуков
function changeSoundsRadio() {
    const soundsRadioButton = document.querySelector(".sounds input");
    const soundsRadioButton2 = document.querySelector(".sounds input:last-child");
    if (soundsRadioButton.checked) {
        view.boom1.volume = 1;
        view.boom2.volume = 1;
        view.boom3.volume = 1;
        sessionStorage.setItem("soundsIsOn", "true");
    } else if (soundsRadioButton2.checked) {
        view.boom1.volume = 0;
        view.boom2.volume = 0;
        view.boom3.volume = 0;
        sessionStorage.setItem("soundsIsOn", "false");
    }
}

function soundsInit() {
    if (sessionStorage.getItem("soundsIsOn") == "false") {
        view.boom1.volume = 0;
        view.boom2.volume = 0;
        view.boom3.volume = 0;
    } else {
        view.boom1.volume = 1;
        view.boom2.volume = 1;
        view.boom3.volume = 1;
    }
}

function changeLevel() {
    const option1 = document.getElementById("level-1");
    const option2 = document.getElementById("level-2");
    const option3 = document.getElementById("level-3");
    if (option1.selected) {
        model.level = 1;
        sessionStorage.setItem("level", "1");
    } else if (option2.selected) {
        model.level = 2;
        sessionStorage.setItem("level", "2");
    } else if (option3.selected) {
        model.level = 3;
        sessionStorage.setItem("level", "3");
    }
}

function setHiscore() {
    const inputValue = document.querySelector(".hi-score-input").value;
    if (!localStorage.getItem("hiscore")) {
        localStorage.setItem("hiscore", "[]");
    }
    let hiscore = JSON.parse(localStorage.getItem("hiscore"));
    hiscore.push([inputValue, model.movesCounter - 1]);
    sortArray(hiscore);
    if (hiscore.length > 5) {
        hiscore.pop();
    }
    localStorage.setItem("hiscore", JSON.stringify(hiscore));
}

function sortArray(ar) {
    let temp;
    let needIteration = true;
    while (needIteration) {
        needIteration = false;
        for (let i = 1; i < ar.length; i++) {
            if (ar[i][1] < ar[i - 1][1]) {
                temp = ar[i];
                ar[i] = ar[i - 1];
                ar[i - 1] = temp;
                needIteration = true;
            }
        }
    }
}

soundsInit();
//localStorage.removeItem("hiscore");
