let Application = PIXI.Application,
    Loader = PIXI.Loader.shared,
    Resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite
    Container = PIXI.Container,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle,
    Texture = PIXI.Texture,
    AnimatedSprite = PIXI.AnimatedSprite;
    TilingSprite = PIXI.TilingSprite;
    PIXI.settings.SORTABLE_CHILDREN = true;

//loader, renderer, stage, ticker, view
let app =  new  Application ({
    width:1200, 
    height:780, 
    backgroundColor: 0x3877b3}
);

document.getElementById("game").appendChild(app.view);

Loader
    .add('starSky',"./img/alwaysOn/star.json")
    .add('startButton',"./img/startPage/start_button/start_button.json")
    .add('fishWalk',"./img/game/fishWalk/lagi3_2.json")
    .add('fishFly',"./img/game/fishFly/lagi_jump.json")
    .on("progress",loadProgressHandler)
    .load(starSkySetup)
    .load(startButtonSetup)
    .load(fishWalkSetup)
    .load(fishFlySetup)
    .load(setup);

var alwaysOn, startPage, game, moveScene, moon, fish, logo, left, right, block;
var starSky     =   new AnimatedSprite.from("./img/alwaysOn/star.png")
var startButton =   new AnimatedSprite.from("./img/startPage/start_button/start_button.png");
var fishWalk    =   new AnimatedSprite.from("./img/game/fishWalk/lagi3_2.png");
var fishFly     =   new AnimatedSprite.from("./img/game/fishFly/lagi_jump.png");
var cloud0      =   new TilingSprite(Texture.from('./img/alwaysOn/cloud0.png'),1200,780);
var cloud1      =   new TilingSprite(Texture.from('./img/alwaysOn/cloud1.png'),1200,780);
var road        =   new TilingSprite(Texture.from('./img/alwaysOn/road.png'),1200,120);
var origin      =   new PIXI.Point(0,0);
var gameState   =   setup;
var initVx      =   1.5;
var initVy      =   -6.1;
var gravity     =   0.003;
var trueX       =   0;
var respawnX    =   180;
var respawnY    =   661;
var maxStageLength = 1800;
var blockX      = [0, 0, 60, 240, 300, 300, 300, 300, 600, 660, 780, 1080, 1260];
var blockY      = [540, 600, 600, 420, 420, 480, 540, 600, 300, 300, 420,  420,  420];


function loadProgressHandler(loader, resource) {
    console.log("loading: " + resource.name);
    console.log("progress: " + loader.progress + "%");
}

function starSkySetup(){
    starSky = new AnimatedSprite(Resources['starSky'].spritesheet.animations["starSky"]);
    starSky.zIndex = 01;
    starSky.animationSpeed = 0.025;
    starSky.play();
}

function startButtonSetup(){
    startButton = new AnimatedSprite(Resources['startButton'].spritesheet.animations["start_button"]);
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.anchor.set(0.5,0.5);
    startButton.x = app.screen.width*0.5;
    startButton.y = app.screen.height*0.7;
    startButton.zIndex = 20;
}

function fishWalkSetup(){
    fishWalk = new AnimatedSprite(Resources['fishWalk'].spritesheet.animations["lagi3_2"]);
    fishWalk.anchor.set(0.5,1);
    fishWalk.x = 180;
    fishWalk.y = 0;
    fishWalk.zIndex = 31;
    fishWalk.animationSpeed = 0.15;
    fishWalk.gotoAndStop(2);
}

function fishFlySetup() {
    fishFly = new AnimatedSprite(Resources['fishFly'].spritesheet.animations["fishFly"]);
    fishFly.visible = false;
    fishFly.anchor.set(0.5,1);
    fishFly.x = 180;
    fishFly.y = 0;
    fishFly.zIndex = 32;
    fishFly.animationSpeed = 0.25;
    fishFly.play();
}

function setup() {
    //define containers
    alwaysOn =          new Container();
    startPage =         new Container();
    game =              new Container(); 
        fish =          new Container();
        moveScene =     new Container();
            block =   new Container();
            building =  new Container();
    alwaysOn.zIndex = 1;
    startPage.zIndex = 2;
    game.zIndex = 3;
    moveScene.zIndex = 1;
    fish.zIndex = 4;

    //alwaysOn
    moon = Sprite.from('./img/alwaysOn/moon.png');
    moon.zIndex = 02;
    cloud0.zIndex = 03;
    cloud1.zIndex = 04;
    
    //startPage
    logo = Sprite.from('./img/startPage/tutogo/tutogo.png')
    logo.zIndex = 32;
    logo.anchor.set(0.5,0.5);
    logo.x = app.screen.width*0.5;
    logo.y = app.screen.height*0.3;

    road.y = 660;
    road.zIndex = 02;

    //game.fish
    fish.vx=0;
    fish.vy=0;
    fish.jump=1;
    fish.enter=0;
    
    alwaysOn.addChild(starSky);
    alwaysOn.zIndex = 1;
    startPage.addChild(logo);
    startPage.addChild(road);
    startPage.addChild(startButton);
    startPage.zIndex = 2;
    game.addChild(fish);
    game.addChild(moveScene);
        fish.addChild(fishFly);
        fish.addChild(fishWalk);
        moveScene.addChild(block);
        //moveScene.addChild(building);
        
        for(i=0;i<blockX.length;i++){
            let block_temp = new Sprite.from("./img/game/moveScene/block.png");
            block_temp.x = blockX[i];
            block_temp.y = blockY[i];
            block.addChild(block_temp);
        }
            //building.addChild(/*some buildings*/);
    //playSound("./sound/backgroundMusic.mp3",true);

    app.stage.addChild(alwaysOn);
    app.stage.addChild(startPage);

    startButton.on('pointerdown',function(){
        startButton.gotoAndStop(1);}); 
    startButton.on('pointerup',function(){
        startButton.gotoAndStop(0);
        playSound("./sound/fishComing.mp3");
        gameState = play;
        app.stage.removeChild(startPage);
        app.stage.addChild(game);
        alwaysOn.addChild(road);
        alwaysOn.addChild(moon);
        alwaysOn.addChild(cloud0);
        alwaysOn.addChild(cloud1);
        app.ticker.add(delta=>gameLoop(delta))});
}

function gameLoop(delta) {
    gameState(delta);
}

function play() {
    cloud0.tilePosition.x += 0.05;
    cloud1.tilePosition.x += 0.15;
    moveScene.x = - trueX;

    var collisionY = fishHitY(road);
    if(collisionY='bottom'){
        fish.jump = false;
        fish.vy = 0;
    }
    var collisionX;
    for(i=0;i<block.children.length;i++){
        collisionX = fishHitX(block.children[i]);
        collisionY = fishHitY(block.children[i]);
        
        
        }
        fish.x += fish.vx;
        fish.y += fish.vy;
        fish.vy += gravity;
    }

    if(fish.jump){
        fishFly.scale.x = fishWalk.scale.x;
        fishWalk.visible = false;
        fishFly.visible = true;
    }
    else{
        fishWalk.visible = true;
        fishFly.visible = false;
    }
}
function playSound(path,loop=false){
    var audio = new Audio(path);
    audio.loop = loop;
    audio.play();
}
//keyHandlers
function downHandler(e){
    if(e.keyCode === 32){
        if(!fish.jump){
            fish.vy = initVy;
            fish.jump = !fish.jump;
            playSound("./sound/fishJump.mp3")
        }
    }
    if(e.keyCode === 37 || e.keyCode === 65){
        if(!this.fishWalk.playing)
            this.fishWalk.gotoAndPlay(3);
        this.fishWalk.scale.x = -1;
        fish.vx = -initVx;
        left = true;
    }
    if(e.keyCode === 39 || e.keyCode ===68){
        if(!this.fishWalk.playing)
            this.fishWalk.gotoAndPlay(3);
        this.fishWalk.scale.x = 1;
        fish.vx = initVx;
        right = true;
    }
    //console.log('x:'+fish.x.toFixed(2)+',y:'+fish.y.toFixed(2)+',trueX:'+trueX);
    //30Hz
}
function upHandler(e){
    if(e.keyCode === 37 || e.keyCode === 65){
        this.fishWalk.gotoAndStop(2);
        left = false;
        if(!right)
            fish.vx = 0;
    }
    if(e.keyCode === 39 || e.keyCode === 68){
        right = false;
        this.fishWalk.gotoAndStop(2);
        if(!left)
            fish.vx = 0;
    }
}
//collision detection
function fishHitY(e){
    let fishRect = fish.getBounds();
    let objRect = e.getBounds();
    let fishL = fishRect.x, fishR = fishRect.x + fishRect.width, fishT = fishRect.y, fishB = fishRect.y + fishRect.height;
    let objL = objRect.x, objR = objRect.x + objRect.width, objT = objRect.y, objB = objRect.y + objRect.height;

    if(!(fishL > objR)||!(fishR < objL)){
        if(fishB>objT&&fishT<objT)  return 'buttom';
        if(fishT<objB&&fishB>objT)  return 'top';
    }
    return 'none';
}

function fishHitX(e){
    let fishRect = fish.getBounds();
    let objRect = e.getBounds();
    let fishL = fishRect.x, fishR = fishRect.x + fishRect.width, fishT = fishRect.y, fishB = fishRect.y + fishRect.height;
    let objL = objRect.x, objR = objRect.x + objRect.width, objT = objRect.y, objB = objRect.y + objRect.height;

    if(!(fishT > objB)||!(fishB < objT)){
        if(fishR>objL&&fishL<objL)  return 'right';
        if(fishL<objR&&fishR>objR)  return 'left';
    }
    return 'none';
}