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
    .add('starSky',"../img/alwaysOn/star.json")
    .add('startButton',"../img/startPage/start_button/start_button.json")
    .add('fishWalk',"../img/game/fishWalk/lagi3_2.json")
    .add('fishFly',"../img/game/fishFly/lagi_jump.json")
    .add('grass',"../img/game/moveScene/grass.json")
    .add('vote',"../img/game/moveScene/vote.json")
    .add('save',"../img/game/moveScene/portal.json")
    .add('fishDead',"../img/game/fishDead/fish_lose.json")
    .add('flag',"../img/game/flag/flag.json")
    .add('loveWheel',"../img/game/moveScene/ferris_wheel.json")
    .on("progress",loadProgressHandler)
    .load(starSkySetup)
    .load(startButtonSetup)
    .load(fishWalkSetup)
    .load(fishFlySetup)
    .load(fishDeadSetup)
    .load(grassSetup)
    .load(voteSetup)
    .load(saveSetup)
    .load(flagSetup)
    .load(spikeSetup)
    .load(loveWheelSetup)
    .load(fishLinesSetup)
    .load(setup);

var alwaysOn, startPage, game, moveScene, moon, fish, logo, lastJump, lastStand, edge, left, right, 
    block, invisBlock, switchBlock, bgm, t, retryPage, flagHitbox;
var starSky     =   new AnimatedSprite.from("../img/alwaysOn/star.png")
var startButton =   new AnimatedSprite.from("../img/startPage/start_button/start_button.png");
var fishWalk    =   new AnimatedSprite.from("../img/game/fishWalk/lagi3_2.png");
var fishFly     =   new AnimatedSprite.from("../img/game/fishFly/lagi_jump.png");
var fishDead    =   new AnimatedSprite.from("../img/game/fishDead/fish_lose.png");
var flag        =   new AnimatedSprite.from("../img/game/flag/flag.png")
var spike       =   new AnimatedSprite.from("../img/game/moveScene/grass.png");
var loveWheel   =   new AnimatedSprite.from("../img/game/moveScene/ferris_wheel.png");
var cloud0      =   new TilingSprite(Texture.from('../img/alwaysOn/cloud0.png'),1200,780);
var cloud1      =   new TilingSprite(Texture.from('../img/alwaysOn/cloud1.png'),1200,780);
var road        =   new TilingSprite(Texture.from('../img/alwaysOn/road.png'),1200,120);
var origin      =   new PIXI.Point(0,0);
var grass       =   new Container(), vote = new Container(), save = new Container(), tofuBlock = new Container;
var gameState   =   setup;
var gravity     =   0.3, initVx = 3.5, initVy = -Math.sqrt(2*gravity*270),  xAbs = 0,
    respawnX = 180, respawnY = 540 ,respawnXAbs =0, died = 0, voteCount = 0;
var maxStageLength = 1800, flagX = maxStageLength - 180, flagY = 120, mute = false;
var blockX      = [  0,   0,  60, 240, 300, 300, 300, 300, 600, 660, 1080, 1260];
var blockY      = [540, 600, 600, 420, 420, 480, 540, 600, 300, 300,  420,  420];
var invisBlockX = [240, 900, 960, 1020, 1080, 1140];
var invisBlockY = [180, 420, 420,  180,  180,  180];
var switchBlockX= [420, 840, 1020, 1440];
var switchBlockY= [420, 420,  420,  480];
var tofuBlockX  = [1140, 1200];
var tofuBlockY  = [ 420,  420];
var grassX      = [600, 660, 1140, 1200, 1260];
var grassY      = [600, 600,  600,  600,  600];
var voteX       = [ 60,   0, 600, 840, 1080, 1260, 1380];
var voteY       = [  0, 480, 240, 600,  360,  180,  600];
var saveX       = [660];
var saveY       = [240];
var fishLines   = [];

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
    fishWalk.zIndex = 1;
    fishWalk.animationSpeed = 0.15;
    fishWalk.gotoAndStop(2);
}

function fishFlySetup() {
    fishFly = new AnimatedSprite(Resources['fishFly'].spritesheet.animations["fishFly"]);
    fishFly.visible = false;
    fishFly.anchor.set(0.5,1);
    fishFly.x = 180;
    fishFly.y = 0;
    fishFly.zIndex = 22;
    fishFly.animationSpeed = 0.25;
    fishFly.play();
}
function fishDeadSetup(){
    fishDead = new AnimatedSprite(Resources['fishDead'].spritesheet.animations["fishDead"]);
    fishDead.visible = false;
    fishDead.anchor.set(0.5,1);
    fishDead.x = 180;
    fishDead.y = 0;
    fishDead.zIndex = 3;
    fishDead.animationSpeed = 0.05;
    fishDead.play();
}

function grassSetup() {
    for(i = 0; i < grassX.length;i++){
        let grass_temp = new AnimatedSprite(Resources['grass'].spritesheet.animations["grass"]);
        grass_temp.x = grassX[i];
        grass_temp.y = grassY[i];
        grass_temp.gotoAndStop(0);
        grass.addChild(grass_temp);
    }
}
function voteSetup() {
    for(i = 0; i < voteX.length;i++){
        let vote_temp = new AnimatedSprite(Resources['vote'].spritesheet.animations["vote"]);
        vote_temp.x = voteX[i];
        vote_temp.y = voteY[i];
        vote_temp.animationSpeed = 0.1;
        vote_temp.play();
        vote.addChild(vote_temp);
    }
}
function saveSetup(){
    for(i = 0; i < saveX.length;i++){
        let save_temp = new AnimatedSprite(Resources['save'].spritesheet.animations["save"]);
        save_temp.x = saveX[i];
        save_temp.y = saveY[i];
        save_temp.animationSpeed = 0.2;
        save_temp.active = true;
        save_temp.play();
        save.addChild(save_temp);
    }
}
function flagSetup(){
    flag = new AnimatedSprite(Resources['flag'].spritesheet.animations["flag"]);
    flag.x = flagX;
    flag.y = flagY;
    flag.scale.set(2,2);
    flag.animationSpeed = 0.2;
    flag.play();
}
function spikeSetup(){
    spike = new AnimatedSprite(Resources['grass'].spritesheet.animations["grass"]);
    spike.visible = false;
    spike.gotoAndStop(1);
}

function loveWheelSetup(){
    loveWheel = new AnimatedSprite(Resources['loveWheel'].spritesheet.animations["loveWheel"]);
    loveWheel.animationSpeed = 0.04;
    loveWheel.zIndex = -1;
    loveWheel.x = 900;
    loveWheel.y = 660-258-258;
    loveWheel.tint = 0xEEEEEE;
    loveWheel.play();
}

function fishLinesSetup(){
    let style = new PIXI.TextStyle({
        fontWeight: 'bold',
        fill: ['#ffffff', '#ffc6b3'],
        stroke: '#4a1850',
        strokeThickness: 5,
        dropShadowColor: '#000000',
        dropShadow: true, //開啟陰影
        dropShadowBlur: 4, //陰影模糊
        dropShadowAngle: Math.PI / 6, //陰影圓角
        dropShadowDistance: 16 // 陰影距離
    })
    fishLines[fishLines.length] = new Text("放眼世界",style);
    fishLines[fishLines.length-1].zIndex = 4;
    fishLines[fishLines.length] = new Text("征服宇宙",style);
    fishLines[fishLines.length-1].zIndex = 4;
    fishLines[fishLines.length] = new Text("台灣安全",style);
    fishLines[fishLines.length-1].zIndex = 4;
    fishLines[fishLines.length] = new Text("人民有錢",style);
    fishLines[fishLines.length-1].zIndex = 4;
}

function setup() {
    t=0;
    gravity*=0.1;
    //define containers
    alwaysOn =          new Container();
    startPage =         new Container();
    retryPage =         new Container();
    game =              new Container(); 
        moveScene =     new Container();
        fish =          new Container();
            block =     new Container();
            invisBlock =new Container();
            switchBlock=new Container();
            building =  new Container();
    alwaysOn.zIndex = 1;
    startPage.zIndex = 2;
    retryPage.zIndex = 2;
    game.zIndex = 3;
        moveScene.zIndex = 1;
        fish.zIndex = 2;

    //alwaysOn
    moon = Sprite.from('../img/alwaysOn/moon.png');
    moon.zIndex = 2;
    cloud0.zIndex = 3;
    cloud1.zIndex = 4;
    
    //startPage
    logo = Sprite.from('../img/startPage/tutogo/tutogo.png')
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

    //game.moveScene
    flagHitbox = Sprite.from('../img/game/moveScene/block.png');
    flagHitbox.visible = false;
    flagHitbox.x = flagX;
    flagHitbox.y = flagY;
    flagHitbox.name = 'flagHitbox';
    
    alwaysOn.addChild(starSky);
    startPage.addChild(logo);
    startPage.addChild(road);
    startPage.addChild(startButton);
    game.addChild(fish);
    game.addChild(moveScene);
        fish.addChild(fishFly);
        fish.addChild(fishWalk);
        fish.addChild(fishDead);
        fish.sortChildren();
        moveScene.addChild(block);
        moveScene.addChild(invisBlock);
        moveScene.addChild(switchBlock);
        moveScene.addChild(grass);
        moveScene.addChild(vote);
        moveScene.addChild(save);
        moveScene.addChild(flag);
        moveScene.addChild(flagHitbox);
        moveScene.addChild(spike);
        moveScene.addChild(tofuBlock);
        moveScene.addChild(loveWheel);
        moveScene.sortChildren();
        //moveScene.addChild(building);



        for(i=0;i<blockX.length;i++){
            let block_temp = new Sprite.from("../img/game/moveScene/block.png");
            block_temp.x = blockX[i];
            block_temp.y = blockY[i];
            block.addChild(block_temp);
        }
        for(i=0;i<invisBlockX.length;i++){
            let invis_temp = new Sprite.from("../img/game/moveScene/block.png");
            invis_temp.x = invisBlockX[i];
            invis_temp.y = invisBlockY[i];
            invis_temp.visible = false;
            invisBlock.addChild(invis_temp);
        }
        for(i=0;i<switchBlockX.length;i++){
            let switch_temp = new Sprite.from("../img/game/moveScene/block.png");
            switch_temp.x = switchBlockX[i];
            switch_temp.y = switchBlockY[i];
            switch_temp.triggered = false;
            switchBlock.addChild(switch_temp);
        }
        for(i=0;i<tofuBlockX.length;i++){
            let tofuBlock_temp = new Sprite.from("../img/game/moveScene/block.png");
            tofuBlock_temp.x = tofuBlockX[i];
            tofuBlock_temp.y = tofuBlockY[i];
            tofuBlock.addChild(tofuBlock_temp);
        }

            //building.addChild(/*some buildings*/);
    //playSound("../sound/backgroundMusic.mp3",true);
    
    bgm = new Audio("../sound/backgroundMusic.mp3");
    bgm.loop = true;
    bgm.autoplay = true;
    bgm.muted = mute;
    bgm.play();
    
    app.stage.addChild(alwaysOn);
    app.stage.addChild(startPage);
    app.stage.sortChildren();
    for (var i = 0; i <moveScene.children.length; i++){
        console.log(moveScene.children[i].name+'\'s zIndex:'+moveScene.children[i].zIndex);
    }
    startButton.on('pointerdown',function(){
        startButton.gotoAndStop(1);}); 
    startButton.on('pointerup',function(){
        if(bgm.paused){
            bgm.muted = mute;
            bgm.play();
        }
        startButton.gotoAndStop(0);
        playSound("../sound/fishComing.mp3");
        gameState = play;
        app.stage.removeChild(startPage);
        app.stage.addChild(game);
        app.stage.sortChildren();
        alwaysOn.addChild(road);
        alwaysOn.addChild(moon);
        alwaysOn.addChild(cloud0);
        alwaysOn.addChild(cloud1);
        alwaysOn.sortChildren();
        app.ticker.add(delta=>gameLoop(delta))});
}

function gameLoop(delta) {
    t+=delta;
    if(t>0.5){
        gameState(delta);
        t=0;
    }
    //console.log(delta);
}

function play(delta) {
    fishLines[(voteCount+fishLines.length-1)%fishLines.length].x = fish.x + 150;
    fishLines[(voteCount+fishLines.length-1)%fishLines.length].y = fish.y - 180;
    cloud0.tilePosition.x += 0.05;
    cloud1.tilePosition.x += 0.15;
    moveScene.x = - xAbs;
    let noHorizontal = 0, noVertical = 0;
    if(fishBottomHit(flagHitbox)||fishTopHit(flagHitbox)||fishLeftHit(flagHitbox)||fishRightHit(flagHitbox)){
        gameState = win;
        console.log("win");
    }
    for(i=0; i<grass.children.length; i++) {
        if(fishBottomHit(grass.getChildAt(i))||fishTopHit(grass.getChildAt(i))||fishLeftHit(grass.getChildAt(i))||fishRightHit(grass.getChildAt(i))){
            grass.getChildAt(i).gotoAndStop(1);
            gameState = dead;
        }
    }
    for(i=0; i<vote.children.length;i++){
        if(fishBottomHit(vote.getChildAt(i))||fishTopHit(vote.getChildAt(i))||fishLeftHit(vote.getChildAt(i))||fishRightHit(vote.getChildAt(i))){
            if(vote.getChildAt(i).visible){
                vote.getChildAt(i).visible = false;
                voteLine(voteCount++);
            }
        }
    }
    for(i=0; i<save.children.length;i++){
        if(fishBottomHit(save.getChildAt(i))||fishTopHit(save.getChildAt(i))||fishLeftHit(save.getChildAt(i))||fishRightHit(save.getChildAt(i))){
            if(save.children[i].active){
                respawnX = save.children[i].x + 30;
                respawnY = save.children[i].y - 30;
                respawnXAbs = xAbs;
                save.children[i].active = false;
            }
        }
    }
    for(i=0;i<tofuBlock.children.length;i++){
        if(fishBottomHit(tofuBlock.getChildAt(i))){
            tofuBlock.getChildAt(i).visible = false;
        }
    }
    for(i=0; i<block.children.length;i++){
        if(fish.vx>0){
            if(fishRightHit(block.getChildAt(i))){
                noHorizontal = 1;
            }
            if(fishRightHit(block.getChildAt(i),fish.vx)){
                //fish.x += (block.getChildAt(i).toGlobal(origin).x) - (fish.x + 210 );
                vx = 0;
            }
        }else if(fish.vx<0){
            if(fishLeftHit(block.getChildAt(i))){
                noHorizontal = 1;
            }
            if(fishLeftHit(block.getChildAt(i),fish.vx)){
                //fish.x += (block.getChildAt(i).toGlobal(origin).x+block.getChildAt(i).width)-(fishWalk.toGlobal(origin).x-30);
                vx = 0;
            }
        }
        if(noHorizontal)
            break;
    }
    for(i=0; i<invisBlock.children.length;i++){
        if(invisBlock.children[i].visible){            
            if(fish.vx>0){
                if(fishRightHit(invisBlock.getChildAt(i))){
                    noHorizontal = 1;
                }
                if(fishRightHit(invisBlock.getChildAt(i),fish.vx)){
                    //fish.x += (block.getChildAt(i).toGlobal(origin).x) - (fish.x + 210 );
                    vx = 0;
                }
            }else if(fish.vx<0){
                if(fishLeftHit(invisBlock.getChildAt(i))){
                    noHorizontal = 1;
                }
                if(fishLeftHit(invisBlock.getChildAt(i),fish.vx)){
                    //fish.x += (block.getChildAt(i).toGlobal(origin).x+block.getChildAt(i).width)-(fishWalk.toGlobal(origin).x-30);
                    vx = 0;
                }
            }
            if(noHorizontal)
                break;
        }
    }
    for(i=0; i<switchBlock.children.length;i++){
        if(fish.vx>0){
            if(fishRightHit(switchBlock.getChildAt(i))){
                noHorizontal = 1;
            }
            if(fishRightHit(switchBlock.getChildAt(i),fish.vx)){
                //fish.x += (block.getChildAt(i).toGlobal(origin).x) - (fish.x + 210 );
                vx = 0;
            }
        }else if(fish.vx<0){
            if(fishLeftHit(switchBlock.getChildAt(i))){
                noHorizontal = 1;
            }
            if(fishLeftHit(switchBlock.getChildAt(i),fish.vx)){
                //fish.x += (block.getChildAt(i).toGlobal(origin).x+block.getChildAt(i).width)-(fishWalk.toGlobal(origin).x-30);
                vx = 0;
            }
        }
        if(noHorizontal)
            break;
    }
    if(!noHorizontal){
        {
            if((fish.x+fish.vx<=840&&fish.x+fish.vx>=0)||(fish.x<0&&fish.vx>0)||(fish.x>840&&fish.vx<0))
                fish.x += fish.vx;
            else{
                if((xAbs+fish.vx>=0)&&(xAbs+fish.vx<=maxStageLength-1200)){
                    road.tilePosition.x-=fish.vx;
                    xAbs += fish.vx;
                }else{
                    if((fish.x+fish.vx>=-150)&&(fish.x+fish.vx<=990))
                        fish.x += fish.vx
                }
            }
        }
    }
    if(fish.vy > 0){
        fish.jump = 1;
        if(fishBottomHit(road,fish.vy)){
            if(!fish.enter){
                gravity /= 0.05;
                initVy = -Math.sqrt(2*gravity*270);
                fish.enter = 1;
                window.addEventListener("keydown",downHandler);
                window.addEventListener("keyup",upHandler);
            }
            noVertical = 1;
            fish.jump = 0;
        }
        for(i=0; i<block.children.length;i++){
            if(fishBottomHit(block.getChildAt(i),fish.vy)){
                //fish.y += (block.getChildAt(i).toGlobal(origin).y - fish.y);
                noVertical = 1;
                fish.jump = 0;
                break;
            }
        }
        for(i=0; i<invisBlock.children.length;i++){
            if(invisBlock.getChildAt(i).visible && fishBottomHit(invisBlock.getChildAt(i),fish.vy)){
                //fish.y += (invisBlock.getChildAt(i).toGlobal(origin).y - fish.y);
                noVertical = 1;
                fish.jump = 0;
                break;
            }
        }
        for(i=0; i<switchBlock.children.length;i++){
            if(fishBottomHit(switchBlock.getChildAt(i),fish.vy)){
                if(!switchBlock.getChildAt(i).triggered){
                    gameState = dead;
                    spike.x = switchBlock.getChildAt(i).x;
                    spike.y = switchBlock.getChildAt(i).y - 60;
                    spike.visible = true;
                }
                //fish.y += (switchBlock.getChildAt(i).toGlobal(origin).y - fish.y);
                noVertical = 1;
                fish.jump = 0;
                break;
            }
        }
        if(noVertical){ lastStand = 1}else if(lastStand){edge = 1; lastStand = 0}else{lastStand = 0;}
    }else if(fish.vy < 0){
        fish.jump = 1;
        for(i=0; i<block.children.length;i++){
            if(fishTopHit(block.getChildAt(i))){
                fish.y += (block.getChildAt(i).toGlobal(origin).y+block.getChildAt(i).height - fish.y + fish.height);
                noVertical = 1;
                break;
            }
        }
        for(i=0; i<invisBlock.children.length;i++){
            if(fishTopHit(invisBlock.getChildAt(i))){
                fish.y += invisBlock.getChildAt(i).toGlobal(origin).y+invisBlock.getChildAt(i).height - fish.y + fish.height;
                invisBlock.getChildAt(i).visible = true;
                //block.addChild(invisBlock.getChildAt(i));
                noVertical = 1;
                break;
            }
        }
        for(i=0; i<switchBlock.children.length;i++){
            if(fishBottomHit(switchBlock.getChildAt(i),fish.vy)){
                switchBlock.getChildAt(i).triggered = true;
                switchBlock.getChildAt(i).tint = 0x999999;
                //fish.y += (switchBlock.getChildAt(i).toGlobal(origin).y - fish.y);
                noVertical = 1;
                fish.jump = 0;
                break;
            }
        }
        for(i=0; i<tofuBlock.children.length;i++){
            if(fishTopHit(tofuBlock.getChildAt(i))){
                fish.y += (tofuBlock.getChildAt(i).toGlobal(origin).y+tofuBlock.getChildAt(i).height - fish.y + fish.height);
                noVertical = 1;
                break;
            }
        }
    }
    fish.vy += gravity;
    if(noVertical)  {fish.vy = 0;}
    else if(fish.jump)  {fish.y+=fish.vy;}
    lastJump = fish.jump;
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

function dead(delta){
    fishLines[(voteCount+fishLines.length-1)%fishLines.length].x = fish.x + 150;
    fishLines[(voteCount+fishLines.length-1)%fishLines.length].y = fish.y - 90;
    fishDead.visible = true;
    fishFly.visible = false;
    fishWalk.visible = false;
    if(!died){
        fish.vx = 0;
        fish.vy = initVy;
    }
    fish.vy += gravity;
    fish.y += fish.vy;
    died++;
    if(died>150){
        gameState = respawn;
        died = 0;
    }
    //console.log(died);
}
function respawn(delta){
    resetTraps();
    died = 0;
    fish.x = respawnX-180;
    fish.y = respawnY;
    fish.vx = 0;
    fish.vy = 0;
    fishDead.visible = false;
    fishWalk.visible = true;
    fishWalk.gotoAndStop(2);
    xAbs = respawnXAbs;
    gameState = play;
}
function resetTraps(){
    for(i = 0; i < invisBlock.children.length; i++){
        invisBlock.children[i].visible = false;
    }
    for(i=0;i<switchBlock.children.length;i++){
        switchBlock.children[i].tint = 0xFFFFFF;
        switchBlock.children[i].triggered = false;
    }
    for(i=0; i<grass.children.length;i++){
        grass.children[i].gotoAndStop(0);
    }
    for(i=0;i<tofuBlock.children.length;i++){
        tofuBlock.getChildAt(i).visible = true;
    }
    spike.visible = false;
}
function win(delta){
    cloud0.tilePosition.x += 0.05;
    cloud1.tilePosition.x += 0.15;
    moveScene.x = - xAbs;

}
function voteLine(e){
    //play 'score' sound
    playSound("../sound/fishScore.mp3");
    //put lines on stage for some time
    app.stage.removeChild(fishLines[(e-1)%fishLines.length])
    app.stage.addChild(fishLines[e%fishLines.length]);
}
function muteButton(){
    mute = !mute;
    bgm.muted = mute;
    console.log(bgm.muted);
    if(mute)
        document.getElementById("muteBtn").src="../img/mute.png";
    else
        document.getElementById("muteBtn").src="../img/unmute.png";
}

function playSound(path,loop=false){
    var audio = new Audio(path);
    audio.loop = loop;
    audio.muted = mute;
    audio.play();
}
//keyHandlers
function downHandler(e){
    if(e.keyCode === 32){
        if(!fish.jump){
            fish.vy = initVy;
            //fish.jump = 1;
            fish.jump = !fish.jump;
            playSound("../sound/fishJump.mp3")
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
function fishTopHit(r2,v=0){
    let r1 = fish.jump ? fishFly : fishWalk;
    let hit, combinedHalfWidths, vx;
    hit = false;
    r1.centerX = r1.toGlobal(origin).x + (0.5-r1.anchor.x)*r1.width;
    r1.centerY = r1.toGlobal(origin).y + (0.5-r1.anchor.y)*r1.height +v; 
    r2.centerX = r2.toGlobal(origin).x + (0.5-r2.anchor.x)*r2.width;
    r2.centerY = r2.toGlobal(origin).y + (0.5-r2.anchor.y)*r2.height;
    r1.halfWidth = 30;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;
    r1.left = r1.centerX - r1.halfWidth;
    r1.right = r1.centerX + r1.halfWidth;
    r1.top = r1.centerY - r1.halfHeight;
    r1.bottom = r1.centerY + r1.halfHeight;
    r2.left = r2.centerX - r2.halfWidth;
    r2.right = r2.centerX + r2.halfWidth;
    r2.top = r2.centerY - r2.halfHeight;
    r2.bottom = r2.centerY + r2.halfHeight;
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
    combinedHalfWidths = r1.halfWidth + r2.halfWidth - 5;
    if (Math.abs(vx) < combinedHalfWidths) {
        if (r1.top<r2.bottom&&r1.bottom>r2.bottom) {   
        hit = true;
        } else {
        hit = false;
        }
    } else {
        hit = false;
    }
    return hit;
}
function fishBottomHit(r2,v=0){
    let r1 = fish.jump ? fishFly : fishWalk;
    let hit, combinedHalfWidths, vx;
    hit = false;
    r1.centerX = r1.toGlobal(origin).x + (0.5-r1.anchor.x)*r1.width;
    r1.centerY = r1.toGlobal(origin).y + (0.5-r1.anchor.y)*r1.height + v; 
    r2.centerX = r2.toGlobal(origin).x + (0.5-r2.anchor.x)*r2.width;
    r2.centerY = r2.toGlobal(origin).y + (0.5-r2.anchor.y)*r2.height;
    r1.halfWidth = 30;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;
    r1.left = r1.centerX - r1.halfWidth;
    r1.right = r1.centerX + r1.halfWidth;
    r1.top = r1.centerY - r1.halfHeight;
    r1.bottom = r1.centerY + r1.halfHeight;
    r2.left = r2.centerX - r2.halfWidth;
    r2.right = r2.centerX + r2.halfWidth;
    r2.top = r2.centerY - r2.halfHeight;
    r2.bottom = r2.centerY + r2.halfHeight;
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
    combinedHalfWidths = r1.halfWidth + r2.halfWidth - 5;
    if (Math.abs(vx) < combinedHalfWidths) {
        if (r1.bottom>r2.top&&r1.top<r2.bottom) {
        hit = true;
        } else {
        hit = false;
        }
    } else {
        hit = false;
    }
    return hit;
}
function fishLeftHit(r2, v=0){
    let r1 = fish.jump ? fishFly : fishWalk;
    let hit, combinedHalfHeights, vy;
    hit = false;
    r1.centerX = r1.toGlobal(origin).x + (0.5-r1.anchor.x)*r1.width + v;
    r1.centerY = r1.toGlobal(origin).y + (0.5-r1.anchor.y)*r1.height; 
    r2.centerX = r2.toGlobal(origin).x + (0.5-r2.anchor.x)*r2.width;
    r2.centerY = r2.toGlobal(origin).y + (0.5-r2.anchor.y)*r2.height;
    r1.halfWidth = 30;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;    r1.left = r1.centerX - r1.halfWidth;
    r1.right = r1.centerX + r1.halfWidth;
    r1.top = r1.centerY - r1.halfHeight;
    r1.bottom = r1.centerY + r1.halfHeight;
    r2.left = r2.centerX - r2.halfWidth;
    r2.right = r2.centerX + r2.halfWidth;
    r2.top = r2.centerY - r2.halfHeight;
    r2.bottom = r2.centerY + r2.halfHeight;
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
    if (r1.left<r2.right&&r1.right>r2.right) {
        if (Math.abs(vy)+0.2 < combinedHalfHeights) {
        hit = true;
        } else {
        hit = false;
        }
    } else {
        hit = false;
    }
    return hit;
}
function fishRightHit(r2, v=0){
    let r1 = fish.jump ? fishFly : fishWalk;
    let hit, combinedHalfHeights, vy;
    hit = false;
    r1.centerX = r1.toGlobal(origin).x + (0.5-r1.anchor.x)*r1.width + v;
    r1.centerY = r1.toGlobal(origin).y + (0.5-r1.anchor.y)*r1.height; 
    r2.centerX = r2.toGlobal(origin).x + (0.5-r2.anchor.x)*r2.width;
    r2.centerY = r2.toGlobal(origin).y + (0.5-r2.anchor.y)*r2.height;
    r1.halfWidth = 30;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;    r1.left = r1.centerX - r1.halfWidth;
    r1.right = r1.centerX + r1.halfWidth;
    r1.top = r1.centerY - r1.halfHeight;
    r1.bottom = r1.centerY + r1.halfHeight;
    r2.left = r2.centerX - r2.halfWidth;
    r2.right = r2.centerX + r2.halfWidth;
    r2.top = r2.centerY - r2.halfHeight;
    r2.bottom = r2.centerY + r2.halfHeight;
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;
    if (r1.right>r2.left&&r1.left<r2.left) {
        if (Math.abs(vy)+0.2 < combinedHalfHeights) {
        hit = true;
        } else {
        hit = false;
        }
    } else {
        hit = false;
    }
    return hit;
}