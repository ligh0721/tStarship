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
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        this.mode = "fb";
        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
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
        egret.log("getLocale:", FBInstant.getLocale());
        egret.log("getPlatform:", FBInstant.getPlatform());
        egret.log("getSDKVersion", FBInstant.getSDKVersion());
        egret.log("getSupportedAPIs", FBInstant.getSupportedAPIs());
        egret.log("getEntryPointData", FBInstant.getEntryPointData());

        let reporter = new FBInstantLoadingReporter();
        await this.loadResource(reporter);
        await FBInstant.startGameAsync();
        egret.log("start game");
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
        egret.localStorage.clear();
        GameController.instance.init(this);
        GameController.instance.createRootLayer(HeroShipsLayer);
        // GameController.instance.createRootLayer(TestLayer);
        // GameController.instance.createRootLayer(PathEditorLayer);
    }

    private baseinfo() {
        egret.log("baseinfo");
        egret.log("getLocale:", FBInstant.getLocale());
        egret.log("getPlatform:", FBInstant.getPlatform());
        egret.log("getSDKVersion", FBInstant.getSDKVersion());
        egret.log("getSupportedAPIs", FBInstant.getSupportedAPIs());
        egret.log("getEntryPointData", FBInstant.getEntryPointData());
    }

    private quit(): void {
        egret.log("quit");
        FBInstant.quit();
    }

    private logEvent(): void {
        egret.log("logEvent");
        FBInstant.logEvent("test", 2, { "test": "ta" });
    }

    private shareAsync(): void {
        egret.log("shareAsync");
        let data: FBInstant.SharePayload = {
            intent: "",
            text: "",
            image: "",
        };
        FBInstant.shareAsync(data);
    }

    private fbPlayerInfo() {
        egret.log("player");
        egret.log("player.getID", FBInstant.player.getID());
        egret.log("player.getName", FBInstant.player.getName());
        egret.log("player.getPhoto", FBInstant.player.getPhoto());
    }

    private async getEgretConnectedPlayersAsync() {
        egret.log("frends info:::");
        let datas: FBInstant.ConnectedPlayer[] = await FBInstant.player.getConnectedPlayersAsync();
        egret.log(datas);
        datas.forEach(element => {
            egret.log("player.getID", element.getID());
            egret.log("player.getName", element.getName());
            egret.log("player.getPhoto", element.getPhoto());
        });
    }

    private fbContextInfo(): void {
        egret.log("Context.getID", FBInstant.context.getID());
        egret.log("Context.getType", FBInstant.context.getType());
    }

    private share(): void {
        egret.log("share");
        let data: FBInstant.SharePayload = {
            intent: "",
            text: "",
            image: "",
        };
        FBInstant.shareAsync(data);
    }
}
