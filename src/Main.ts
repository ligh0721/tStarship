//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {



    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin

            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })



    }

    private async runGame() {
        this.stage.frameRate = 60;
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        //this.startAnimation(result);
        //await platform.login();
        //const userInfo = await platform.getUserInfo();
        //console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private textfield: egret.TextField;

    private world: World;
    private ship: Ship;
    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        let layer = tutils.createLayer(this, 0x000000, 1.0);
        this.world = new World(layer, stageW, stageH);


        let ship = new Ship(40, 80);
        this.world.addShip(ship);
        ship.force.force = 1;
        ship.x = stageW*0.5;
        ship.y = stageH-ship.height*0.5;
        ship.speed = 50;
        let gun = new SoundWaveGun();
        gun.fireInterval = 300;
        ship.addGun(gun);
        ship.gun.autofire();
        
        this.ship = ship;

        
        
        

        layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        layer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        layer.touchEnabled = true;
        
        let timer = new egret.Timer(20, 0);
        timer.addEventListener(egret.TimerEvent.TIMER, this.onTimer, this);
        timer.start();


        // FIXME: test
        ship = new Ship(80, 160);
        this.world.addShip(ship);
        ship.force.force = 2;
        ship.hp.maxHp = 5;
        ship.hp.hp = ship.hp.maxHp;
        ship.x = stageW*0.2;
        ship.y = stageH*0.5;
        ship.speed = 50;

    }

    private onTouchBegin(evt: egret.TouchEvent) {
        this.ship.move(evt.localX, evt.localY);
    }

    private onTouchMove(evt: egret.TouchEvent) {
        this.ship.move(evt.localX, evt.localY);
    }

    private onTimer(evt: egret.TimerEvent) {
        this.world.step(20);
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string) {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: string[]) {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    }
}