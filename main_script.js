let model = new GameModel();
let controller = new GameController();
let view = new GameView();

model.start(view);
view.start(model);
controller.start(model);

