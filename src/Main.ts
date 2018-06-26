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

class Main extends eui.UILayer {
    private mode: "web"|"fb"|"wc" = "web";

    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            tutils.pauseBgMusic();
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
            tutils.resumeBgMusic();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        if (typeof(FBInstant) === typeof(undefined)) {
            this.mode = "web";
        } else {
            this.mode = "fb";
        }
        
        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        GameController.instance.init(this);
        let playerData = GameController.instance.loadPlayerData();
        if (!playerData || (playerData.ver!=GlobalConfig.ver && GlobalConfig.reset)) {
            GameController.instance.resetPlayerData();
        }
        // this.clearPlayerData();
        // return;
        switch (this.mode) {
        case "web":
            await this.runGameAsWeb();
            break;
        case "fb":
            await this.runGameAsFb();
            break;
        case "wc":
            await this.runGameAsWc();
            break;
        }
    }

    private async runGameAsWeb() {
        const loadingView = new LoadingUI();
        this.stage.addChild(loadingView);
        await this.loadResource(loadingView);
        this.stage.removeChild(loadingView);

        this.createGameScene();
        // const result = await RES.getResAsync("description_json")
        //await platform.login();
        //const userInfo = await platform.getUserInfo();
        //console.log(userInfo);
    }

    private async runGameAsFb() {
        await FBInstant.initializeAsync();
        console.log("getLocale:", FBInstant.getLocale());
        console.log("getPlatform:", FBInstant.getPlatform());
        console.log("getSDKVersion", FBInstant.getSDKVersion());
        console.log("getSupportedAPIs", FBInstant.getSupportedAPIs());
        console.log("getEntryPointData", FBInstant.getEntryPointData());

        let reporter = new FBInstantLoadingReporter();
        await this.loadResource(reporter);
        await FBInstant.startGameAsync();
        console.log("start game");
        this.fbContextInfo();
        this.fbPlayerInfo();

        this.createGameScene();
    }

    private async runGameAsWc() {
    }

    private async loadResource(reporter?: RES.PromiseTaskReporter) {
        await RES.loadConfig("resource/default.res.json", "resource/");
        await this.loadTheme();
        let loadOK = false;
        do {
            try {
                await RES.loadGroup("preload", 0, reporter);
                loadOK = true;
            }
            catch (e) {
                console.error(e);
            }
        } while (!loadOK);
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);
        })
    }

    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        // GameController.instance.createRootLayer(ShipLayer);
        GameController.instance.createRootLayer(TestLayer);
        // GameController.instance.createRootLayer(EditorLayer);
    }

    private clearPlayerData(): void {
        egret.localStorage.clear();
        let label = new eui.Label();
        label.text = "存档已清除";
        label.size = 50;
        label.bold = true;
        label.stroke = 3;
        this.addChild(label);
        label.x = (this.stage.stageWidth - label.width) / 2;
        label.y = (this.stage.stageHeight - label.height) / 2;
    }

    private baseinfo() {
        console.log("baseinfo");
        console.log("getLocale:", FBInstant.getLocale());
        console.log("getPlatform:", FBInstant.getPlatform());
        console.log("getSDKVersion", FBInstant.getSDKVersion());
        console.log("getSupportedAPIs", FBInstant.getSupportedAPIs());
        console.log("getEntryPointData", FBInstant.getEntryPointData());
    }

    private quit(): void {
        console.log("quit");
        FBInstant.quit();
    }

    private logEvent(): void {
        console.log("logEvent");
        FBInstant.logEvent("test", 2, { "test": "ta" });
    }

    private shareAsync(): void {
        console.log("shareAsync");
        let data: FBInstant.SharePayload = {
            intent: "",
            text: "",
            image: "",
        };
        FBInstant.shareAsync(data);
    }

    private fbPlayerInfo() {
        console.log("player");
        console.log("player.getID", FBInstant.player.getID());
        console.log("player.getName", FBInstant.player.getName());
        console.log("player.getPhoto", FBInstant.player.getPhoto());
    }

    private async getEgretConnectedPlayersAsync() {
        console.log("frends info:::");
        let datas: FBInstant.ConnectedPlayer[] = await FBInstant.player.getConnectedPlayersAsync();
        console.log(datas);
        datas.forEach(element => {
            console.log("player.getID", element.getID());
            console.log("player.getName", element.getName());
            console.log("player.getPhoto", element.getPhoto());
        });
    }

    private fbContextInfo(): void {
        console.log("Context.getID", FBInstant.context.getID());
        console.log("Context.getType", FBInstant.context.getType());
    }

    private share(): void {
        console.log("share");
        let data: FBInstant.SharePayload = {
            intent: "",
            text: "",
            image: "",
        };
        FBInstant.shareAsync(data);
    }
}
