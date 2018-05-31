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
    private bgMusic: egret.SoundChannel;

    private txtPushStart: egret.TextField;

    private sldHeroScale: eui.HSlider;
    private txtHeroScale: egret.TextField;

    private tickerEffect = new Effect(1, 10);

    $pathPercent: number = 0;

    lastTouchBeginTick: number = 0;

    // 统计项
    private score: number = 0;
    private highScore: number = 0;
    private destroyEnemies: number = 0;
    private destroyBosses: number = 0;
    private reachStage: number = 1;
	
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
        
        this.worldLayer = new egret.Sprite();
        this.layer.addChild(this.worldLayer);

        this.hudLayer = new egret.Sprite();
        this.layer.addChild(this.hudLayer);

        this.gameOverLayer = new egret.Sprite();
        this.layer.addChild(this.gameOverLayer);

        this.msgLayer = new egret.Sprite();
        this.layer.addChild(this.msgLayer);

        // 背景滚动器
        // let bg = tutils.createLayer(this.worldLayer, 0x191231, 1);
        
        this.bgCtrl = new tutils.BackgroundController(this.stage.stageWidth, this.stage.stageHeight, "bgGrey_jpg").create();
        this.bgCtrl.start(20);
        this.worldLayer.addChild(this.bgCtrl.gameObject);

        // this.bgCtrl2 = new BackgroundController(this.stage.stageWidth, this.stage.stageHeight, "NearSpace_png").create();
        // this.bgCtrl2.start(20);
        // this.worldLayer.addChild(this.bgCtrl2.gameObject);
		
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
        this.hud = new BattleHUD();
        this.hudLayer.addChild(this.hud);
        this.hud.alpha = 0;
        let playerData = GameController.instance.playerData;
        this.highScore = playerData.highscore.score;
        this.hud.updateScore(this.score);
        this.hud.updateHighScore(this.highScore);
	}

    // override
    protected onCleanUp(): void {
        for (let i in this.buffuis) {
            let buffui = this.buffuis[i];
            egret.Tween.removeTweens(buffui);
        }
        this.enemyCtrl.stopRush();
        this.bgMusic.stop();
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
        this.startGame();
    }

    protected startGame(): void {
        for (let i in GameController.instance.battleShips) {
            let shipId = GameController.instance.battleShips[i];
            let playerShipData = GameController.instance.getPlayerShipDataById(shipId);
            playerShipData.use++;
        }
        GameController.instance.savePlayerData();
        
        this.bgMusic = tutils.playSound("Bgmusic_mp3", 0);

        // 创建玩家飞船
        let heroShipId = GameController.instance.battleShips[0];
        let hero = GameController.instance.createHeroShip(heroShipId, this.world);
        this.hero = hero;
        this.heroShipData = GameController.instance.getPlayerShipDataById(heroShipId);
        hero.force.force = tutils.Player1Force;
        hero.x = this.stage.stageWidth * 0.5;
        hero.y = this.stage.stageHeight + 200;

        hero.setOnAddBuffListener(this.onShipAddBuff, this);
        hero.setOnRemoveBuffListener(this.onShipRemoveBuff, this);

        hero.heroHUD = this.hud;
        this.hud.setOnUsePowerListener(this.onHeroUsePower, this);

        // let buff = new GunBuff(5000, -0.80, 0, +1.00);
        // let buff2 = new ShipBuff(5000, -0.80);
        // let skill = new AddBuffSkill([buff, buff2]);
        // let skill = new ShieldBallSkill();
        let skill = new GhostShipSkill();
        hero.power = hero.maxPower;
        hero.setSkill(skill);

        // hero.addBuff(new ShieldBuff(-1, 10));


        // 创建玩家飞船血条、能量条
        this.hud.updateHpBar(hero.hp*100/hero.maxHp);
        this.hud.updatePowerBar(hero.power*100/hero.maxPower);
        
        // 创建测试补给箱
        let testSupplyTimer = new tutils.Timer();
        testSupplyTimer.setOnTimerListener((dt: number): void=>{
            this.createTestSupply();
        });
        testSupplyTimer.start(8000, true, 0);

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
        });
    }

    private onHeroUsePower(): void {
        if (!this.hero.isPowerFull()) {
            return;
        }
        if (this.hero.alive && this.hero.castSkill()) {
            tutils.playSound("Powerup_mp3");
            this.turbo(this.bgCtrl, 100, 10, 5000);
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
        if (this.hero == ship) {
            this.gameOver();
            return;
        } else if (this.hero.force.isMyEnemy(ship.force) && ((killer == this.hero) || (killer instanceof IntervalHitShip && killer.ship == this.hero))) {
            // 击败敌军
            let score = 1;
            let supply = this.world.pools.newObject(ScoreSupply, score);
            this.world.addSupply(supply);
            supply.drop(ship.gameObject.x, ship.gameObject.y);

            if (ship instanceof EnemyShip && ship.isLastGroupMember()) {
                this.hud.showTip("coin2_png", "+1", "Wave Clear!");
                this.addScore(1);
            }

            let power = 10;  // Math.max(ship.maxHp/10, 1);
            this.hero.addPower(power);

            // 更新统计
            this.heroShipData.exp += ship.maxHp;
            this.heroShipData.enemy++;
            this.destroyEnemies++;
            if (ship instanceof MotherShip) {
                this.hideBossUI();
                this.enemyCtrl.startRush(30);
                this.destroyBosses++;
                this.reachStage++;
                GameController.instance.savePlayerData();
            }
        }
    }

    private addScore(score: number): void {
        this.score += score;
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
        if (this.score > playerData.highscore.score) {
            // new high score!
            playerData.highscore.score = this.score;
            playerData.highscore.stage = this.reachStage;
            playerData.highscore.shipId = GameController.instance.battleShips[0];
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
        const baseX = 200;
        const baseY = this.stage.stageHeight - BuffProgress.Height - 10;
        const dt = 10;
        let color: number = 0xffffff;
        switch (buff.name) {
            case "GunCDR":
            color = 0x4f86ff;
            this.hud.showTip("GunCDR_png", Math.floor(buff.duration/1000).toString() + "s", "Fire CDR Up!")
            break;
            
            case "GunPower":
            color = 0xf48771;
            this.hud.showTip("GunPower_png", Math.floor(buff.duration/1000).toString() + "s", "Power Up!");
            break;

            case "GunLevelUp":
            color = 0xdcdcaa;
            this.hud.showTip("GunLevelUp_png", "+1", "Level Up!")
            break;

            case "SatelliteGun":
            color = 0x49bba4;
            this.hud.showTip("SatelliteGun_png", Math.floor(buff.duration/1000).toString() + "s", "Satellite Gun!");
            break;

            default:
            return;
        }
        tutils.playSound("Powerup_mp3");

        let buffui = new BuffProgress(this.hudLayer, buff, color);
        buffui.gameObject.x = baseX + (BuffProgress.Width + dt) * this.buffuis.length;
        buffui.gameObject.y = baseY;
        buffui.percent = 1;
        this.buffuis.push(buffui);
        let tw = egret.Tween.get(buffui);
        tw.to({percent: 0}, buff.duration);
        tw.call(()=>{
            let i = this.buffuis.indexOf(buffui);
            if (i >= 0) {
                this.buffuis.splice(i, 1);
                buffui.cleanup();
                this.hudLayer.removeChild(buffui.gameObject);
                this.updateBuffUIPosition();
            }
        }, this);
    }

    private onShipRemoveBuff(ship: Ship, buff: Buff) {
        let index: number = -1;
        for (let i in this.buffuis) {
            let buffui = this.buffuis[i];
            if (buffui.buff == buff) {
                index = parseInt(i);
                break;
            }
        }
        if (index >= 0) {
            let buffui = this.buffuis.splice(index, 1)[0];
            buffui.cleanup();
            this.hudLayer.removeChild(buffui.gameObject);
            this.updateBuffUIPosition();
        }
    }

    private updateBuffUIPosition() {
        const baseX = 200;
        const baseY = this.stage.stageHeight - BuffProgress.Height - 10;
        const dt = 10;
        for (let i=0; i<this.buffuis.length; i++) {
            let buffui = this.buffuis[i];
            buffui.gameObject.x = baseX + (BuffProgress.Width + dt) * i;
            buffui.gameObject.y = baseY;
        }
    }

    private onBossHpChanged(ship: HpUnit, changed: number) {
        this.hud.updateBossHpBar(ship.hp*100/ship.maxHp);
    }

	private onTouchBegin(evt: egret.TouchEvent) {
        // egret.Tween.removeTweens(this.tickerEffect);
        // let tw = egret.Tween.get(this.tickerEffect);
        // tw.to({value: this.tickerEffect.maximum}, (this.tickerEffect.maximum-this.tickerEffect.value)/(this.tickerEffect.maximum-this.tickerEffect.minimum)*1000, egret.Ease.getPowOut(2));
        egret.Ticker.getInstance().setTimeScale(0.5);

        if (evt.target!=this.layer || !this.hero.alive) {
            this.beginDelta.x = undefined;
            return;
        }
        this.beginDelta.x = evt.stageX - this.hero.gameObject.x;
        this.beginDelta.y = evt.stageY - this.hero.gameObject.y;
        //this.hero.move(evt.localX, evt.localY-100);
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
        // this.tickerEffect.setOnChanged((effect: Effect)=>{
        //     egret.Ticker.getInstance().setTimeScale(effect.value/10);
        // }, this);

        // egret.Tween.removeTweens(this.tickerEffect);
        // let tw = egret.Tween.get(this.tickerEffect);
        // tw.to({value: this.tickerEffect.minimum}, (this.tickerEffect.value-this.tickerEffect.minimum)/(this.tickerEffect.maximum-this.tickerEffect.minimum)*1000, egret.Ease.getPowOut(2));
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
            ship.x = 60*i;
            ship.y = 500;
		}
	}

    private createTestEnemyRushes() {
        let en0: EnemyShip[] = [];
        let en1: EnemyShip[] = [];
        let en2: EnemyShip[] = [];
        let en3: EnemyShip[] = [];
        let n = 10;
        for (let i=0; i<n; i++) {
            let enemy0 = this.enemyCtrl.createEnemyShip("RedEnemyShip_png");
            enemy0.resetHp(5);
            en0.push(enemy0);

            let enemy1 = this.enemyCtrl.createEnemyShip("RedEnemyShip_png");
            enemy1.resetHp(5);
            en1.push(enemy1);

            let enemy2 = this.enemyCtrl.createEnemyShip("RedEnemyShip_png");
            enemy2.resetHp(5);
            en2.push(enemy2);

            let enemy3 = this.enemyCtrl.createEnemyShip("RedEnemyShip_png");
            enemy3.resetHp(5);
            en3.push(enemy3);
        }

        let enemy0 = this.enemyCtrl.createEnemyShip("RedEnemyShip_png");
        enemy0.resetHp(5);

        let enemy1 = this.enemyCtrl.createEnemyShip("RedEnemyShip_png");
        enemy0.resetHp(5);

        // this.enemyCtrl.enemyShipMoveInStraightLine(enemyShip, enemyShip.width*0.5);
        // this.enemyCtrl.rushBezier(enemies, {x: this.world.width*0.5, y: 0}, {x: this.world.width*0.5, y: this.world.height*0.5}, {x: this.world.width, y: this.world.height*0.5}, 200, 2000, false);
        // this.enemyCtrl.enemyShipMoveInBezierCurve(enemyShip1, {x: this.world.width*0.5, y: 0}, {x: this.world.width*0.5, y: this.world.height*0.5}, {x: this.world.width, y: this.world.height*0.8});


        let rushItem: Rush = new BezierRush(2000, en0, 200, 2000, {x: this.world.width*0.3, y: 0}, {x: this.world.width, y: this.world.height*0.5}, {x: this.world.width*0.3, y: this.world.height*0.5});
        this.enemyCtrl.addRush(rushItem);
        
        rushItem = new BezierRush(0, en1, 200, 2000, {x: this.world.width*0.7, y: 0}, {x: 0, y: this.world.height*0.5}, {x: this.world.width*0.7, y: this.world.height*0.5});
        this.enemyCtrl.addRush(rushItem);
        
        rushItem = new StraightRush(4000, en2, 200, 2000, {x: this.world.width*0.7, y: 0}, {x: this.world.width*0.7, y: this.world.height});
        this.enemyCtrl.addRush(rushItem);
        
        rushItem = new SineRush(5000, en3, 200, 4000, {x: 200, y: 0}, {x: 200, y: this.world.height}, 2000, 100);
        this.enemyCtrl.addRush(rushItem);

        rushItem = new CallbackRush(5000, ():void=>{
            this.enemyCtrl.stopRush();
            let boss = this.enemyCtrl.createBoss1();
            this.showBossUI(boss);
        }, this);
        this.enemyCtrl.addRush(rushItem);

        for (let i=1; i<=20*10; i++) {
            if (i == 20) {
                let rushItem = new CallbackRush(5000, ():void=>{
                    this.enemyCtrl.stopRush();
                    let boss = this.enemyCtrl.createBoss2();
                    this.showBossUI(boss);
                }, this);
                this.enemyCtrl.addRush(rushItem);
                continue;
            } else if (i == 40) {
                let rushItem = new CallbackRush(5000, ():void=>{
                    this.enemyCtrl.stopRush();
                    let boss = this.enemyCtrl.createBoss3();
                    this.showBossUI(boss);
                }, this);
                this.enemyCtrl.addRush(rushItem);
                continue;
            }
            let es = [];
            let n = Math.floor(Math.random()*8+5);
            for (let j=0; j<n; j++) {
                let e = this.enemyCtrl.createEnemyShip("RedEnemyShip_png");
                e.resetHp(10+Math.floor(i/4 * 1));
                es.push(e);
            }
            
            let delay = Math.random() * 5000 + 2000;
            let dur = Math.random() * 3000 + 3000;
            let interval = Math.random() * 200 + 100;
            let a = Math.random() * 200 + 80
            let x = Math.random() * (this.stage.stageWidth - a * 2) + a;
            let t = Math.random() * 1000 + 2000;
            let rushItem = new SineRush(delay, es, interval, dur, {x: x, y: 0}, {x: x, y: this.world.height+100}, t, a);
            this.enemyCtrl.addRush(rushItem);
        }
        this.enemyCtrl.startRush(30);
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
        switch (i) {
            case 0:
            if (Math.random()*100 > 40) {
                return;
            }
            buff = new GunLevelUpBuff(1);
            buff.name = "GunLevelUp";
            buff.uniq = "GunLevelUp";
            supply = new BuffSupply([buff]);
            supply.text = "GunLevelUp";
            supply.color = 0xdcdcaa;
            break;

            case 1:
            buff = new GunBuff(8000, 0, +0.50, 0);
            buff.name = "GunPower";
            buff.uniq = "GunPower";
            supply = new BuffSupply([buff]);
            supply.text = "GunPower";
            supply.color = 0xf48771;
            break;

            case 2:
            buff = new GunBuff(8000, -0.30, 0, 0);
            buff.name = "GunCDR";
            buff.uniq = "GunCDR";
            supply = new BuffSupply([buff]);
            supply.text = "GunCDR";
            supply.color = 0x4f86ff;
            break;

            case 3:
            gun = Gun.createGun(SatelliteGun, ExplosionBullet);
            gun.fireCooldown.baseValue = 1000;
            gun.bulletPower.baseValue = 5;
            gun.bulletNum = 5;
            gun.bulletPowerLossPer = 1.0;
            gun.bulletPowerLossInterval.baseValue = 1000;
            buff = new AddGunBuff(8000, [gun]);
            buff.name = "SatelliteGun";
            buff.uniq = "SatelliteGun";
            supply = new BuffSupply([buff]);
            supply.text = "SatelliteGun";
            supply.color = 0x49bba4;
            break;

            case 4:
            gun = Gun.createGun(SoundWaveGun, SoundWaveBullet);
            gun.fireCooldown.baseValue = 800;
            (<SoundWaveGun>gun).bulletNum = 5;
            gun.bulletSpeed.baseValue = 60;
            gun.bulletPower.baseValue = 4;
            gun.bulletPowerLossPer = 0.5;
            gun.bulletPowerLossInterval.baseValue = 200;
            supply = new GunSupply(gun);
            supply.text = "SoundWaveGun";
            supply.color = 0xc586c0;
            supply.pickDist = 0;
            break;

            case 5:
            gun = Gun.createGun(EaseGun, ShakeWaveBullet);
            (<EaseGun>gun).ease = egret.Ease.getPowIn(2);
            gun.fireCooldown.baseValue = 1000;
            gun.bulletSpeed.baseValue = 100;
            gun.bulletPower.baseValue = 1000;
            gun.bulletPowerLossPer = 0.005;
            gun.bulletPowerLossInterval.baseValue = 100;
            supply = new GunSupply(gun);
            supply.text = "ShakeWaveGun";
            supply.color = 0xc586c0;
            supply.pickDist = 0;
            break;

            case 6:
            gun = Gun.createGun(ShotGun, Bullet);
            (<ShotGun>gun).bulletAngleDelta = 10;
            (<ShotGun>gun).bulletNum = 5;
            gun.fireCooldown.baseValue = 600;
            gun.bulletSpeed.baseValue = 60;
            gun.bulletPower.baseValue = 4;
            gun.bulletPowerLossPer = 1;
            gun.bulletPowerLossInterval.baseValue = 1000;
            supply = new GunSupply(gun);
            supply.text = "ShotGun";
            supply.color = 0xc586c0;
            supply.pickDist = 0;
            break;

            case 7:
            gun = Gun.createGun(RowGun, Bullet);
            (<RowGun>gun).bulletNum = 3;
            gun.fireCooldown.baseValue = 400;
            gun.bulletSpeed.baseValue = 60;
            gun.bulletPower.baseValue = 3;
            gun.bulletPowerLossPer = 1;
            gun.bulletPowerLossInterval.baseValue = 100;
            supply = new GunSupply(gun);
            supply.text = "RowGun";
            supply.color = 0xc586c0;
            supply.pickDist = 0;
            break;

            case 8:
            gun = Gun.createGun(ExplosionGun, ExplosionBullet);
            gun.fireCooldown.baseValue = 500;
            gun.bulletSpeed.baseValue = 60;
            gun.bulletPower.baseValue = 5;
            gun.bulletPowerLossPer = 1;
            gun.bulletPowerLossInterval.baseValue = 100;
            supply = new GunSupply(gun);
            supply.text = "ExplosionGun";
            supply.color = 0xc586c0;
            supply.pickDist = 0;
            break;

            case 9:
            gun = Gun.createGun(GuideGun, ShakeWaveBullet);
            gun.fireCooldown.baseValue = 300;
            gun.bulletSpeed.baseValue = 80;
            gun.bulletPower.baseValue = 3;
            gun.bulletPowerLossPer = 1;
            gun.bulletPowerLossInterval.baseValue = 1000;
            supply = new GunSupply(gun);
            supply.text = "GuideGun";
            supply.color = 0xc586c0;
            supply.pickDist = 0;
            break;

            case 10:
            gun = Gun.createGun(FocusGun, Bullet);
            gun.fireCooldown.baseValue = 200;
            gun.bulletSpeed.baseValue = 80;
            gun.bulletPower.baseValue = 5;
            gun.bulletPowerLossPer = 1/5;
            gun.bulletNum = 2;
            gun.bulletPowerLossInterval.baseValue = 100;
            supply = new GunSupply(gun);
            supply.text = "FocusGun";
            supply.color = 0xc586c0;
            supply.pickDist = 0;
            break;
        }

        this.world.addSupply(supply);
        supply.drop(Math.floor((0.2+Math.random()*0.6)*this.stage.stageWidth), 10);
    }
}