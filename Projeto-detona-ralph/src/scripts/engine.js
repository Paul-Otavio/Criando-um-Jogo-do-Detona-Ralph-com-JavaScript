/**
 * Objeto que mantém o estado do jogo.
 */
const state = {
    view: {
        squares: document.querySelectorAll(".square"),
        enemy: document.querySelector(".enemy"),
        timeLeft: document.querySelector("#time-Left"),
        score: document.querySelector("#score"),
        recorde: document.querySelector("#recorde"),
        lives: document.querySelector(".menu-lives h2")
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        record: 0,
        lives: 3, // Inicia com 3 vidas
        secondAttempt: false // Flag para verificar se é a partir da segunda tentativa
    },
    actions: {
        timerId: null, 
        countDownTimerId: null, 
    },
};

/**
 * Função que decrementa o tempo restante e verifica o fim do jogo.
 */
function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime <= 0) {
        clearInterval(state.actions.countDownTimerId);
        clearInterval(state.actions.timerId);
        alert("Game Over! O seu resultado foi: " + state.values.result);
        resetGame();
    }
}

/**
 * Função que toca o som de acerto.
 */
function playsound() {
    let audio = new Audio("src/audios/hit.m4a");
    audio.preload = "auto";
    audio.play();
    audio.volume = 0.2;
}

/**
 * Função que seleciona uma posição aleatória para o inimigo.
 */
function randomSquare() {
    state.view.squares.forEach((square) => {
        square.classList.remove("enemy");
    });

    let randomNumber = Math.floor(Math.random() * 9);
    let randomSquare = state.view.squares[randomNumber];
    randomSquare.classList.add("enemy");
    state.values.hitPosition = randomSquare.id;
}

/**
 * Função que move o inimigo em intervalos regulares.
 */
function moveEnemy() {
    state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity);
}

/**
 * Adiciona listeners para identificar acertos nos quadrados.
 */
function addListenerHitBox() {
    state.view.squares.forEach((square) => {
        square.addEventListener("mousedown", () => {
            if (square.id === state.values.hitPosition) {
                state.values.result++;
                state.view.score.textContent = state.values.result;
                state.values.hitPosition = randomSquare.id;
                playsound();

                if (state.values.result > state.values.record) {
                    state.values.record = state.values.result;
                    state.view.recorde.textContent = state.values.record;
                }
            }
        });
    });
}

/**
 * Reseta o estado do jogo e reinicia a partida.
 */
function resetGame() {
    // Verifica se é a partir da segunda tentativa e se não superou o recorde
    if (state.values.secondAttempt && state.values.result <= state.values.record) {
        state.values.lives--;
        state.view.lives.textContent = `${state.values.lives}x`;

        if (state.values.lives <= 0) {
            alert("Você ficou sem vidas! Jogo reiniciado.");
            // Reseta o recorde e as vidas
            state.values.record = 0;
            state.view.recorde.textContent = 0;
            state.values.lives = 3;
            state.view.lives.textContent = `${state.values.lives}x`;
            state.values.secondAttempt = false; // Reseta a flag
        }
    } else {
        // Marca a flag para a segunda tentativa como verdadeira
        state.values.secondAttempt = true;
    }

    // Reseta o estado do jogo
    state.values.result = 0;
    state.values.currentTime = 60;
    state.view.score.textContent = 0;
    state.view.timeLeft.textContent = 60;

    // Reinicia o jogo
    initialize();
}

/**
 * Função principal que inicia o jogo.
 */
function initialize() {
    moveEnemy();
    state.actions.countDownTimerId = setInterval(countDown, 1000);
    addListenerHitBox();
}

// Inicia o jogo ao carregar o script
initialize();

