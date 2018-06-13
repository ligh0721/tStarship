class BattleLayer extends tutils.Layer {
    private worldLayer: egret.Sprite;
    private hudLayer: egret.Sprite;
    private gameOverLayer: egret.Sprite;
    private msgLayer: egret.Sprite;

    private hud: BattleHUD;

	private world: World;
    private hero: HeroShip;
    private heroShipData: PlayerShipData;

    private enemyCtrl: EnemyController;
    private readonly buffuis: BuffProgress[] = [];
    private readonly beginDelta: {x: number, y: number} = {x: 0, y: 0};
    private bgCtrl: tutils.BackgroundController;
    // private bgCtrl2: BackgroundController;

    private txtPushStart: egret.TextField;
    private txtPushStartDesc: egret.TextField;

    private sldHeroScale: eui.HSlider;
    private txtHeroScale: egret.TextField;

    private tickerEffect = new Effect(1, 10);

    // 测试函数曲线
    $pathPercent: number = 0;

    // 双击释放技能
    private lastTouchBeginTick: number = 0;
    private lastTouchBeginPos: {x: number, y: number} = {x: -1, y: -1};
    private touchBeginCount: number = 0;

    private partsDropTable: DropTable<string>;

    // 统计项
    private score: number = 0;
    private highScore: number = 0;
    private destroyEnemies: number = 0;
    private destroyBosses: number = 0;
    private reachStage: number = 1;
    private lastSaveTick: number = 0;
    private unsaveScore: number = 0;
	
    // override
    protected onCfgStage(): void {
        this.stage.frameRate = 60;
        this.stage.frameRate = 60;
        this.stage.scaleMode = egret.StageScaleMode.FIXED_HEIGHT;
    }

	protected onInit() {
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;

        this.layer.touchEnabled = true;

        // 背景滚动器
        // let bg = tutils.createLayer(this.worldLayer, 0x191231, 1);
        
        this.bgCtrl = new tutils.BackgroundController(this.stage.stageWidth, this.stage.stageHeight, "bgGrey_jpg").create();
        this.bgCtrl.start(20);
        this.layer.addChildAt(this.bgCtrl.gameObject, 0);
        this.bgCtrl.gameObject.alpha = 0.8;

        // this.bgCtrl2 = new BackgroundController(this.stage.stageWidth, this.stage.stageHeight, "NearSpace_png").create();
        // this.bgCtrl2.start(20);
        // this.layer.addChildAt(this.bgCtrl2.gameObject, 1);
        
        this.worldLayer = new egret.Sprite();
        this.layer.addChild(this.worldLayer);

        this.hudLayer = new egret.Sprite();
        this.layer.addChild(this.hudLayer);

        this.gameOverLayer = new egret.Sprite();
        this.layer.addChild(this.gameOverLayer);

        this.msgLayer = new egret.Sprite();
        this.layer.addChild(this.msgLayer);
		
        // 创建世界
        this.world = new World(this.worldLayer, stageW, stageH);
        this.world.start(60);
        this.world.setOnShipDyingListener(this.onShipDying, this);
        this.world.setOnShipHitSupplyListener(this.onShipHitSupply, this);

        // 开启调试辅助线
        // this.world.dbgDrawSprite = <egret.Sprite>tutils.createLayer(this.hudLayer, 0x000000, 0.0);
        // this.world.dbgTextField = new egret.TextField()
        // this.world.dbgDrawSprite.addChild(this.world.dbgTextField);

        // 创建敌军控制器
        this.enemyCtrl = new EnemyController(this.world);

        // 创建PUSH START
        this.createPushStart();

        // 初始化HUD
        let data = {};
        this.hud = new BattleHUD(data);
        this.hudLayer.addChild(this.hud);
        this.hud.alpha = 0;
        let playerData = GameController.instance.playerData;
        this.highScore = playerData.highscore.score;
        this.hud.updateScore(this.score);
        this.hud.updateHighScore(this.highScore);

        // 初始化世界掉落表
        this.partsDropTable = new DropTable<string>();
        this.partsDropTable.push("part_test1", 100);
        this.partsDropTable.push("part_test2", 100);
        this.partsDropTable.push("part_meteoroid", 100);
        this.partsDropTable.push("part_power_speed_up_2", 100);
        this.partsDropTable.push("part_power_battery_2", 100);
	}

    // override
    protected onCleanUp(): void {
        for (let i in this.buffuis) {
            let buffui = this.buffuis[i];
            egret.Tween.removeTweens(buffui);
        }
        this.enemyCtrl.stopRush();
        tutils.stopBgMusic();
        this.world.cleanup();
    }

    protected createPushStart(): void {
        this.txtPushStart = new egret.TextField();
        this.txtPushStart.text = "PUSH  START";
        this.txtPushStart.bold = true;
        this.txtPushStart.size = 60;
        this.msgLayer.addChild(this.txtPushStart);
        this.txtPushStart.x = (this.stage.stageWidth - this.txtPushStart.textWidth) * 0.5;
        this.txtPushStart.y = (this.stage.stageHeight - this.txtPushStart.textHeight) * 0.7;

        this.txtPushStartDesc = new egret.TextField();
        this.txtPushStartDesc.text = "1. 右下角能量满了之后，双击屏幕释放必杀\n2. 点击左侧零件栏可以丢弃不需要的零件";

        this.msgLayer.addChild(this.txtPushStartDesc);
        this.txtPushStartDesc.x = 0;
        this.txtPushStartDesc.y = this.stage.stageHeight - this.txtPushStartDesc.height;


        let change = (txt: egret.TextField) => {
            let tw = egret.Tween.get(txt);
            tw.to({ "alpha": 1 }, 500);
            tw.wait(1000);
            tw.to({ "alpha": 0 }, 500);
            tw.call(change, this, [txt]);
        }
        change(this.txtPushStart);
        this.layer.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapPushStart, this);
    }

    protected onTouchTapPushStart(evt: egret.TouchEvent): void {
        this.layer.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapPushStart, this);
        egret.Tween.removeTweens(this.txtPushStart);
        this.msgLayer.removeChild(this.txtPushStart);
        this.txtPushStart = null;

        this.msgLayer.removeChild(this.txtPushStartDesc);
        this.txtPushStartDesc = null;
        this.startGame();
    }

    protected startGame(): void {
        for (let i in GameController.instance.battleShips) {
            let shipId = GameController.instance.battleShips[i];
            let playerShipData = GameController.instance.getPlayerShipDataByKey(shipId);
            playerShipData.use++;
        }
        GameController.instance.savePlayerData();
        
        tutils.playBgMusic("Bgmusic_mp3");

        // 创建玩家飞船
        let heroShipId = GameController.instance.battleShips[0];
        let hero = GameController.instance.createHeroShip(heroShipId, this.world);
        this.hero = hero;
        this.heroShipData = GameController.instance.getPlayerShipDataByKey(heroShipId);
        hero.x = this.stage.stageWidth * 0.5;
        hero.y = this.stage.stageHeight + 200;

        hero.setOnAddBuffListener(this.onShipAddBuff, this);
        hero.setOnRemoveBuffListener(this.onShipRemoveBuff, this);
        hero.setOnUpdateBuffListener(this.onShipUpdateBuff, this);

        hero.setOnAddPartListener(this.onShipAddPart, this);
        hero.setOnRemovePartListener(this.onShipRemovePart, this);

        hero.heroHUD = this.hud;
        this.hud.setOnUsePowerListener(this.onHeroUsePower, this);

        hero.power = hero.maxPower;

        // hero.addBuff(new ShieldBuff(-1, 10));


        // 创建玩家飞船血条、能量条
        this.hud.setHero(this.hero);
        
        // 创建测试补给箱
        let testSupplyTimer = new tutils.Timer();
        testSupplyTimer.setOnTimerListener((dt: number): void=>{
            this.createTestSupply();
        });
        testSupplyTimer.start(8000, true, 0);
        
        let part = GameController.instance.createPart("part_meteoroid");
        let supply = this.world.pools.newObject(PartSupply, part.model, [part]);
        supply.speed = 20;
        this.world.addSupply(supply);
        supply.drop(this.stage.stageWidth*0.5, 0, egret.Ease.getPowIn(2));

        // 创建调试面板
        // this.createDebugPanel();

        // 创建测试敌军
        // this.createTestEnemyShip(1);

        // 最后添加事件监听器
        this.layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        let tw = egret.Tween.get(this.hero);
        tw.to({y: this.stage.stageHeight - 200}, 1000);  
        tw.wait(1000);
        tw.call(() => {
            let tw = egret.Tween.get(this.hud);
            tw.to({alpha: 1}, 500);

            this.hero.mainGun.autoFire = true;

            this.layer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
            this.layer.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
            // 创建敌军小队
            this.createTestEnemyRushes();
            // this.createTestEnemyShip(50);
            
            // let boss = this.enemyCtrl.createBoss2();
            // this.createBossUI(boss);
            // 绘制测试路径
            //this.drawTestPath();
            this.lastSaveTick = egret.getTimer();
        });
    }

    private onHeroUsePower(): void {
        if (!this.hero.isPowerFull()) {
            return;
        }
        if (this.hero.alive && this.hero.castSkill()) {
            tutils.playSound("Powerup_mp3");
            this.turbo(this.bgCtrl, 100, 20, 5000);
            // this.turbo(this.bgCtrl2, 200, 20, 5000);
        }
    }

    public turbo(bgCtrl: tutils.BackgroundController, speed: number, orgSpeed: number, dur: number): void {
        this.hud.setOnUsePowerListener(null, null);
        if (dur < 1500) {
            dur = 1500;
        }
        let tw = egret.Tween.get(bgCtrl);
        tw.to({speed: speed}, 1000, egret.Ease.getPowOut(2));
        tw.wait(dur-1500);
        tw.to({speed: orgSpeed}, 2000, egret.Ease.getPowOut(2));
        tw.call(() => {
            this.hud.setOnUsePowerListener(this.onHeroUsePower, this);
        });
    }

    public get pathPercent(): number {
        return this.$pathPercent;
    }

    public set pathPercent(value: number) {
        let a = 400;
        let b = 400;
        let y = value*1000;
        let x = Math.sqrt(Math.pow(Math.sqrt(a*a+b*b)*2*Math.sin((Math.atan(b/a)-Math.asin((b-y)/Math.sqrt(a*a+b*b)))/2), 2)-y*y);
        let g = this.layer.graphics;
        g.drawCircle(x, y, 1);
    }

    public drawTestPath(): void {
        let tw = egret.Tween.get(this);
        this.pathPercent = 0;
        tw.to({pathPercent: 1}, 10000)
        this.layer.graphics.lineStyle(1, 0xffffff);
    }

    private onShipDying(ship: Ship, killer: Ship): void {
        const sounds = ["Explosion0_mp3", "Explosion2_mp3"];
        tutils.playSound(sounds[Math.floor(Math.random()*sounds.length)]);
        if (this.hero.force.isMyEnemy(ship.force) && ship instanceof MotherShip) {
            this.hideBossUI();
            if (this.hero && this.hero.alive) {
                this.enemyCtrl.startRush();
                this.destroyBosses++;
                this.reachStage++;
                GameController.instance.savePlayerData();
            }
        }

        if (ship == this.hero) {
            this.gameOver();
            return;
        } else if (this.hero.force.isMyEnemy(ship.force) && killer && (killer.force.isMyAlly(this.hero.force))) {
            // 击败敌军
            if (!this.hero || !this.hero.alive) {
                return;
            }

            if (ship instanceof EnemyShip && ship.isLastGroupMember()) {
                let score = Math.max(1, Math.floor(ship.group.max/4*(1+this.reachStage/2)));
                this.hud.showTip("coin2_png", "+"+score, "Wave Clear!");
                this.addScore(score);
            }

            let power = 10;  // Math.max(ship.maxHp/10, 1);
            let score = Math.max(1, Math.floor(1*this.reachStage/5));
            if (ship instanceof MotherShip) {
                power *= 80;
                score *= 10;
            } else if (ship instanceof MotherGunShip) {
                power *= 40;
                score *= 5;
            }

            this.hero.addPower(power);
            if (Math.random() < 0.01) {
                let partKey = this.partsDropTable.random();
                let part = GameController.instance.createPart(partKey);
                let supply = this.world.pools.newObject(PartSupply, part.model, [part]);
                supply.speed = 20;
                this.world.addSupply(supply);
                supply.drop(ship.gameObject.x, ship.gameObject.y, egret.Ease.getPowIn(2));
            } else {
                let supply = this.world.pools.newObject(ScoreSupply, score);
                supply.speed = 100;
                this.world.addSupply(supply);
                supply.drop(ship.gameObject.x, ship.gameObject.y, egret.Ease.getPowIn(2));
            }
            

            // 更新统计
            this.heroShipData.exp += score*2;
            this.heroShipData.enemy++;
            this.destroyEnemies++;

            let now = egret.getTimer();
            if (now-this.lastSaveTick > 5000) {
                this.lastSaveTick = now;
                // AutoSave
                let playerData = GameController.instance.playerData;
                playerData.coins += this.unsaveScore;
                this.unsaveScore = 0;
                if (this.score > playerData.highscore.score) {
                    // new high score!
                    playerData.highscore.score = this.score;
                    playerData.highscore.stage = this.reachStage;
                    playerData.highscore.shipKey = GameController.instance.battleShips[0];
                }
                if (this.reachStage > playerData.maxStage) {
                    playerData.maxStage = this.reachStage;
                }
                GameController.instance.savePlayerData();
            }
        }
    }

    private addScore(score: number): void {
        if (!this.hero || !this.hero.alive) {
            return;
        }

        this.score += score;
        this.unsaveScore += score;
        this.hud.updateScore(this.score);
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.hud.updateHighScore(this.highScore);
        }
    }

    private gameOver(): void {
        // GAME OVER
        this.layer.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.layer.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
        this.layer.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
        this.enemyCtrl.stopRush();

        // 玩家数据
        let playerData = GameController.instance.playerData;
        playerData.coins += this.unsaveScore;
        this.unsaveScore = 0;
        if (this.score > playerData.highscore.score) {
            // new high score!
            playerData.highscore.score = this.score;
            playerData.highscore.stage = this.reachStage;
            playerData.highscore.shipKey = GameController.instance.battleShips[0];
        }
        if (this.reachStage > playerData.maxStage) {
            playerData.maxStage = this.reachStage;
        }
        GameController.instance.savePlayerData();
        
        let data = {high: playerData.highscore.score, stages: this.reachStage, enemies: this.destroyEnemies, bosses: this.destroyBosses, score: this.score};
        GameController.instance.showGameOverPanel(this.gameOverLayer, data);
    }

    private onShipHitSupply(ship: Ship, supply: Supply): void {
        if (supply instanceof ScoreSupply) {
            this.addScore(supply.score);
        }
    }

    private onShipAddBuff(ship: Ship, buff: Buff): void {
        if (buff.model && buff.name) {
            if (buff instanceof GunLevelUpBuff) {
                this.hud.showTip(buff.model, "+"+buff.levelChange, buff.name);
            } else {
                let dur = Math.floor(buff.duration/1000);
                if (dur > 0) {
                    this.hud.showTip(buff.model, dur.toString()+"s", buff.name);
                } else if (buff.duration < 0) {
                    this.hud.showTip(buff.model, "*s", buff.name);
                }
                this.hud.addBuffUI(buff);
            }
            tutils.playSound("Powerup_mp3");
        }
    }

    private onShipRemoveBuff(ship: Ship, buff: Buff): void {
        if (buff.model && buff.name) {
            if (!(buff instanceof GunLevelUpBuff)) {
                this.hud.removeBuffUI(buff);
            }
        }
    }

    private onShipUpdateBuff(ship: Ship, buff: Buff): void {
        if (buff.model && buff.name) {
            tutils.playSound("Powerup_mp3");
            if (!(buff instanceof GunLevelUpBuff)) {
                this.hud.updateBuffUI(buff);
            }
        }
    }

    private onShipAddPart(ship: Ship, part: Part): void {
        if (part.model && part.name) {
            this.hud.addPartUI(part);
            tutils.playSound("Powerup_mp3");
        }
    }

    private onShipRemovePart(ship: Ship, part: Part): void {
        if (part.model && part.name) {
            this.hud.removePartUI(part);
        }
    }

    private onBossHpChanged(ship: HpUnit, changed: number) {
        this.hud.updateBossHpBar(ship.hp*100/ship.maxHp);
    }

	private onTouchBegin(evt: egret.TouchEvent) {
        if (evt.target!=this.layer || !this.hero.alive) {
            this.beginDelta.x = undefined;
            return;
        }

        let now = egret.getTimer();
        if (this.touchBeginCount > 0) {
            let dis = tutils.getDistance(this.lastTouchBeginPos.x, this.lastTouchBeginPos.y, evt.stageX, evt.stageY);
            if (now-this.lastTouchBeginTick>300 || dis>50) {
                this.touchBeginCount = 1;
            } else {
                this.touchBeginCount++;
                if (this.touchBeginCount === 2) {
                    this.onHeroUsePower();
                    this.touchBeginCount = 0;
                }
            }
        } else {
            this.touchBeginCount = 1;
        }
        this.lastTouchBeginTick = now;
        this.lastTouchBeginPos.x = evt.stageX;
        this.lastTouchBeginPos.y = evt.stageY;

        this.beginDelta.x = evt.stageX - this.hero.gameObject.x;
        this.beginDelta.y = evt.stageY - this.hero.gameObject.y;
    }

    private onTouchMove(evt: egret.TouchEvent) {
        if (this.beginDelta.x===undefined || !this.hero.alive) {
            return;
        }
        let toX = evt.stageX - this.beginDelta.x;
        if (toX < 0) {
            toX = 0;
        } else if (toX > this.stage.stageWidth) {
            toX = this.stage.stageWidth;
        }
        let toY = evt.stageY - this.beginDelta.y;
        if (toY < 0) {
            toY = 0;
        } else if (toY > this.stage.stageHeight) {
            toY = this.stage.stageHeight;
        }
        this.hero.move(toX, toY);
    }

    private onTouchEnd(evt: egret.TouchEvent) {
    }

    private createDebugPanel() {
        // sinT
        this.sldHeroScale = new eui.HSlider();
        this.hudLayer.addChild(this.sldHeroScale);
        this.sldHeroScale.x = 0;
        this.sldHeroScale.y = 300;
        this.sldHeroScale.width = 200;
        this.sldHeroScale.minimum = 10;
        this.sldHeroScale.maximum = 300;
        this.sldHeroScale.value = 100;
        this.hero.gameObject.scaleX = this.sldHeroScale.value / 100;
        this.hero.gameObject.scaleY = this.sldHeroScale.value / 100;
        this.sldHeroScale.addEventListener(eui.UIEvent.CHANGE, this.onHeroScaleChanged, this)
        this.txtHeroScale = new egret.TextField();
        this.hudLayer.addChild(this.txtHeroScale);
        this.txtHeroScale.x = 0;
        this.txtHeroScale.y = 270;
        this.txtHeroScale.text = "HeroScale: " + this.sldHeroScale.value + "%";
    }

    protected onHeroScaleChanged(evt: eui.UIEvent) {
        const align = 10;
        let value = evt.target.value;
        let dt = (value/align) - Math.floor(value/align);
        if (dt < 0.5) {
            value = Math.floor(value/align) * align;
        } else {
            value = Math.floor(value/align) * align + align;
        }
        evt.target.value = value;
        this.txtHeroScale.text = "HeroScale: " + this.sldHeroScale.value + "%";
        this.hero.gameObject.scaleX = value / 100;
        this.hero.gameObject.scaleY = value / 100;
    }

	// FIXME: test
	private createTestEnemyShip(n: number) {
		for (let i=0; i<10; i++) {
			let ship = new EnemyShip("RedEnemyShip_png", 0.5);
			this.world.addShip(ship);
			ship.force.force = tutils.EnemyForce;
            ship.resetHp(20);
            if (i == 5) {
                ship.resetHp(2000);
            }
            ship.x = 60 * i;
            ship.y = 500;
		}
	}

    private createTestEnemyRushes() {
        let rush: Rush;

        this.enemyCtrl.addRushes1(2000, 20);
        this.enemyCtrl.addRushes2(4000, 20);
        this.enemyCtrl.addRushes3(4000, 20);
        this.enemyCtrl.addRushes4(4000, 20);
        this.enemyCtrl.addRushes5(4000, 20);
        this.enemyCtrl.addRushes6(2000, 20);
        this.enemyCtrl.addRushes7(3000, 200, 3);
        //this.enemyCtrl.addRushes8(5000, 500, 2);

        rush = new CallbackRush(5000, ():void=>{
            this.enemyCtrl.stopRush();
            let boss = this.enemyCtrl.createBoss1();
            this.showBossUI(boss);
        }, this);
        this.enemyCtrl.addRush(rush);

        const WAVE_NUM = 15;
        for (let i=1; i<=WAVE_NUM*10; i++) {
            let hp = 20+Math.floor(i/3 * 2);
            if (i == WAVE_NUM) {
                this.enemyCtrl.addRushes1(2000, hp, 1.5);
                this.enemyCtrl.addRushes2(4000, hp, 1.5);
                this.enemyCtrl.addRushes3(4000, hp, 1.5);
                this.enemyCtrl.addRushes4(4000, hp, 1.5);
                this.enemyCtrl.addRushes5(4000, hp, 1.5);
                this.enemyCtrl.addRushes6(2000, hp, 1.5);
                this.enemyCtrl.addRushes7(3000, 200, 3);
                let rush = new CallbackRush(5000, ():void=>{
                    this.enemyCtrl.stopRush();
                    let boss = this.enemyCtrl.createBoss2();
                    this.showBossUI(boss);
                }, this);
                this.enemyCtrl.addRush(rush);
                continue;
            } else if (i == WAVE_NUM*2) {
                this.enemyCtrl.addRushes1(2000, hp, 2.0);
                this.enemyCtrl.addRushes2(4000, hp, 2.0);
                this.enemyCtrl.addRushes3(4000, hp, 2.0);
                this.enemyCtrl.addRushes4(4000, hp, 2.0);
                this.enemyCtrl.addRushes5(4000, hp, 2.0);
                this.enemyCtrl.addRushes6(2000, hp, 2.0);
                this.enemyCtrl.addRushes8(3000, 200, 3);
                let rush = new CallbackRush(5000, ():void=>{
                    this.enemyCtrl.stopRush();
                    let boss = this.enemyCtrl.createBoss3();
                    this.showBossUI(boss);
                }, this);
                this.enemyCtrl.addRush(rush);
                continue;
            } else if (i == WAVE_NUM*3) {
                this.enemyCtrl.addRushes1(2000, hp, 2.5);
                this.enemyCtrl.addRushes2(4000, hp, 2.5);
                this.enemyCtrl.addRushes3(4000, hp, 2.5);
                this.enemyCtrl.addRushes4(4000, hp, 2.5);
                this.enemyCtrl.addRushes5(4000, hp, 2.5);
                this.enemyCtrl.addRushes6(2000, hp, 2.5);
                this.enemyCtrl.addRushes7(3000, 200, 3);
                let rush = new CallbackRush(5000, ():void=>{
                    this.enemyCtrl.stopRush();
                    let boss = this.enemyCtrl.createBoss3();
                    this.showBossUI(boss);
                }, this);
                this.enemyCtrl.addRush(rush);
                continue;
            } else if (i == WAVE_NUM*4) {
                this.enemyCtrl.addRushes1(2000, hp, 3.0);
                this.enemyCtrl.addRushes2(4000, hp, 3.0);
                this.enemyCtrl.addRushes3(4000, hp, 3.0);
                this.enemyCtrl.addRushes4(4000, hp, 3.0);
                this.enemyCtrl.addRushes5(4000, hp, 3.0);
                this.enemyCtrl.addRushes6(2000, hp, 3.0);
                this.enemyCtrl.addRushes8(3000, 200, 3);
                let rush = new CallbackRush(5000, ():void=>{
                    this.enemyCtrl.stopRush();
                    let boss = this.enemyCtrl.createBoss3();
                    this.showBossUI(boss);
                }, this);
                this.enemyCtrl.addRush(rush);
                continue;
            } else if (i == WAVE_NUM*5) {
                this.enemyCtrl.addRushes1(2000, hp, 3.5);
                this.enemyCtrl.addRushes2(4000, hp, 3.5);
                this.enemyCtrl.addRushes3(4000, hp, 3.5);
                this.enemyCtrl.addRushes4(4000, hp, 3.5);
                this.enemyCtrl.addRushes5(4000, hp, 3.5);
                this.enemyCtrl.addRushes6(2000, hp, 3.5);
                this.enemyCtrl.addRushes7(3000, 200, 3);
                let rush = new CallbackRush(5000, ():void=>{
                    this.enemyCtrl.stopRush();
                    let boss = this.enemyCtrl.createBoss3();
                    this.showBossUI(boss);
                }, this);
                this.enemyCtrl.addRush(rush);
                continue;
            }
            if (Math.random() < 0.3) {
                let rush = this.enemyCtrl.addRushMeteoroid(0, hp*5, 0, Math.min(3, 1+i/WAVE_NUM));
                rush.setCallback(():void=>{
                    tutils.playSound("Meteoroid_mp3");
                    rush.from.x = (0.1 + Math.random() * 0.8) * this.stage.stageWidth;
                    rush.to.x = rush.from.x;
                }, this);
            }

            if (Math.random() < 0.3) {
                let num = Math.floor((Math.random()*(i/WAVE_NUM+1))/2) + 1;
                if (Math.random() < 0.5) {
                    this.enemyCtrl.addRushes7(2000, hp*10, num, (i/WAVE_NUM+2)*0.5);
                } else {
                    this.enemyCtrl.addRushes8(2000, hp*10, num, (i/WAVE_NUM+2)*0.5);
                }
            }
            let n = Math.floor(Math.random()*8+5);
            let es = this.enemyCtrl.createEnemyShips(n, hp, "RedEnemyShip_png");
            this.enemyCtrl.putEnemyShipsIntoGroup(es);
            
            let delay = Math.random() * 5000 + 2000;
            let dur = Math.random() * 2000 + 4000;
            let interval = Math.random() * 200 + 100;
            let a = Math.random() * 200 + 80
            let x = (Math.random() * (this.stage.stageWidth - a * 2) + a) * 100 / this.stage.stageWidth;
            a *= 100/this.stage.stageWidth;
            let t = Math.random() * 1000 + 2000;
            let rush = new SineRush(delay/(i/WAVE_NUM+2)*3, es, interval, dur, {x: x, y: 0}, {x: x, y: 100}, t, a);
            this.enemyCtrl.addRush(rush);
        }
        this.enemyCtrl.startRush();
    }

    private showBossUI(boss: Ship) {
        this.hud.showBossHpBar(()=>{
            this.hud.updateBossHpBar(boss.hp*100/boss.maxHp);
        }, this);
        boss.setOnHpChangedListener(this.onBossHpChanged, this);
    }

    private hideBossUI(): void {
        this.hud.hideBossHpBar();
    }

    private createTestSupply() {
        let buff: Buff;
        let supply: Supply;
        let gun: Gun;
        let i = Math.floor(Math.random()*4);
        if (this.heroShipData.use<=3 && this.hero.mainGun.level===1) {
            // 飞船使用次数少于3时第一个buff必定是主炮升级
            buff = GameController.instance.createBuff("gun_level_up");
            supply = new BuffSupply(buff.model, [buff]);
            i = -1;
        }
        switch (i) {
            case 0:
            // 40%
            if (Math.random() > 0.40) {
                return;
            }
            buff = GameController.instance.createBuff("gun_level_up");
            supply = new BuffSupply(buff.model, [buff]);
            break;

            case 1:
            buff = GameController.instance.createBuff("gun_power_up");
            buff.name = "GunPower";
            supply = new BuffSupply(buff.model, [buff]);
            break;

            case 2:
            buff = GameController.instance.createBuff("gun_cdr_up");
            supply = new BuffSupply(buff.model, [buff]);
            break;

            case 3:
            buff = GameController.instance.createBuff("satellite_ball");
            supply = new BuffSupply(buff.model, [buff]);
            break;
        }

        this.world.addSupply(supply);
        supply.drop(Math.floor((0.2+Math.random()*0.6)*this.stage.stageWidth), 10);
    }
}