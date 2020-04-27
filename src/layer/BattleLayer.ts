class BattleLayer extends tutils.Layer {
    private worldLayer: egret.Sprite;
    private hudLayer: egret.Sprite;
    private gameOverLayer: egret.Sprite;
    private msgLayer: egret.Sprite;

    private hud: BattleHUD;

	private world: World;
    private hero: HeroShip;
    // private heroGunData: PlayerGunData;

    private enemyCtrl: EnemyController;
    private readonly beginDelta: {x: number, y: number} = {x: 0, y: 0};
    private bgCtrl: tutils.BackgroundController;
    // private bgCtrl2: BackgroundController;

    private txtPushStart: egret.TextField;
    private txtPushStartDesc: egret.TextField;

    private sldHeroScale: eui.HSlider;
    private txtHeroScale: egret.TextField;

    private tickerEffect = new Effect(1, 10);
    private buffSupplySpawner: tutils.ITimer;

    // 双击释放技能
    private lastTouchBeginTick: number = 0;
    private lastTouchBeginPos: {x: number, y: number} = {x: -1, y: -1};
    private touchBeginCount: number = 0;

    // private partsDropTableRare: DropTable<DropTable<string>>;
    

    // 统计项
    private score: number = 0;
    private highScore: number = 0;
    private destroyEnemies: number = 0;
    private destroyBosses: number = 0;
    private reachStage: number = 1;
    private lastSaveTick: number = 0;
    private unsaveScore: number = 0;
    private starNum: number = 0;
	
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
        this.addChild(this.worldLayer);

        this.hudLayer = new egret.Sprite();
        this.addChild(this.hudLayer);

        this.gameOverLayer = new egret.Sprite();
        this.addChild(this.gameOverLayer);

        this.msgLayer = new egret.Sprite();
        this.addChild(this.msgLayer);
		
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
        GameController.instance.setBattleHUD(this.hud);

        // 初始化世界掉落表
        
	}

    // override
    protected onRemoved(): void {
        this.enemyCtrl.stopRush();
        tutils.stopBgMusic();
        this.bgCtrl.stop();
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
        this.txtPushStartDesc.text = "1. 右下角能量满了之后，双击屏幕释放必杀\n2. 击毁整波敌军小队会有额外金币奖励\n3. 金币可以解锁新的飞机\n4. 玩家飞船只有中心红点被击中时才会受到伤害\n5. 点击左侧零件栏可以丢弃不需要的零件";

        this.msgLayer.addChild(this.txtPushStartDesc);
        this.txtPushStartDesc.x = 0;
        this.txtPushStartDesc.y = 0;


        let change = (txt: egret.TextField) => {
            let tw = egret.Tween.get(txt);
            tw.to({ "alpha": 1 }, 500);
            tw.wait(1000);
            tw.to({ "alpha": 0 }, 500);
            tw.call(change, this, [txt]);
        }
        change(this.txtPushStart);
        this.evtMgr.regEvent(this.layer, egret.TouchEvent.TOUCH_TAP, this.onTouchTapPushStart);
    }

    protected onTouchTapPushStart(evt: egret.TouchEvent): void {
        this.evtMgr.unregEvent(this.layer, egret.TouchEvent.TOUCH_TAP, this.onTouchTapPushStart);
        egret.Tween.removeTweens(this.txtPushStart);
        this.msgLayer.removeChild(this.txtPushStart);
        this.txtPushStart = null;

        this.msgLayer.removeChild(this.txtPushStartDesc);
        this.txtPushStartDesc = null;
        this.startGame();
    }

    protected startGame(): void {
        let playerGunData = GameController.instance.getPlayerGunData();
        playerGunData.use++;
        let playerSkillData = GameController.instance.getPlayerSkillData();
        playerSkillData.use++;
        GameController.instance.savePlayerData();
        
        tutils.playBgMusic("Bgmusic_mp3");

        // 创建玩家飞船
        let hero = GameController.instance.spawnHeroShip(this.world);
        this.hero = hero;
        hero.x = this.stage.stageWidth * 0.5;
        hero.y = this.stage.stageHeight + 200;

        hero.setOnAddBuffListener(this.onShipAddBuff, this);
        hero.setOnRemoveBuffListener(this.onShipRemoveBuff, this);
        hero.setOnUpdateBuffListener(this.onShipUpdateBuff, this);

        hero.setOnAddPartListener(this.onShipAddPart, this);
        hero.setOnRemovePartListener(this.onShipRemovePart, this);

        hero.heroHUD = this.hud;
        this.hud.setOnUseEnergyListener(this.onHeroUseEnergy, this);

        hero.energy = hero.maxEnergy;

        // hero.addBuff(new ShieldBuff(-1, 10));


        // 创建玩家飞船血条、能量条、主炮等级等信息
        this.hud.setHero(this.hero);
        // this.hud.setEnemyController(this.enemyCtrl);
        
        // 创建测试补给箱
        this.buffSupplySpawner = new tutils.TimerByAction(GameController.instance.actMgr);
        this.buffSupplySpawner.setOnTimerListener(this.onBuffSupplySpawn, this);
        this.buffSupplySpawner.start(8000, true, 0);

        // let test_parts = ["part_elec_induced_gun", "part_critical_2"];
        // for (let i in test_parts) {
        //     let partName = test_parts[i];
        //     let part = GameController.instance.createPart(partName);
        //     let supply = this.world.pools.newObject(PartSupply, part.model, [part]);
        //     supply.speed = 20;
        //     this.world.addSupply(supply);
        //     supply.drop((parseInt(i)+1)*this.stage.stageWidth/(test_parts.length+1), 0, egret.Ease.getPowIn(2));
        // }

        // 创建调试面板
        // this.createDebugPanel();

        // 创建敌军小队
        this.createAllRushes();

        // 最后添加事件监听器
        this.evtMgr.regEvent(this.layer, egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin);
        let tw = egret.Tween.get(this.hero);
        tw.to({y: this.stage.stageHeight - 200}, 1000);  
        tw.wait(1000);
        tw.call(() => {
            let tw = egret.Tween.get(this.hud);
            tw.to({alpha: 1}, 500);

            this.hero.mainGun.autoFire = true;

            this.evtMgr.regEvent(this.layer, egret.TouchEvent.TOUCH_MOVE, this.onTouchMove);
            this.evtMgr.regEvent(this.layer, egret.TouchEvent.TOUCH_END, this.onTouchEnd);
            
            // let boss = this.enemyCtrl.createBoss2();
            // this.createBossUI(boss);
            // 绘制测试路径
            //this.drawTestPath();
            this.lastSaveTick = egret.getTimer();
        });
    }

    private onHeroUseEnergy(): void {
        // if (!this.hero.isEneryFull()) {
        //     return;
        // }
        if (this.hero.alive && this.hero.castSkill()) {
            tutils.playSound("Powerup_mp3");
            this.turbo(this.bgCtrl, 100, 20, 5000);
            // this.turbo(this.bgCtrl2, 200, 20, 5000);
        }
    }

    public turbo(bgCtrl: tutils.BackgroundController, speed: number, orgSpeed: number, dur: number): void {
        this.hud.setOnUseEnergyListener(null, null);
        if (dur < 1500) {
            dur = 1500;
        }
        let tw = egret.Tween.get(bgCtrl);
        tw.to({speed: speed}, 1000, egret.Ease.getPowOut(2));
        tw.wait(dur-1500);
        tw.to({speed: orgSpeed}, 2000, egret.Ease.getPowOut(2));
        tw.call(() => {
            this.hud.setOnUseEnergyListener(this.onHeroUseEnergy, this);
        });
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
            // 玩家击败敌军
            if (!this.hero || !this.hero.alive) {
                return;
            }

            if (ship instanceof EnemyShip && ship.isLastGroupMember()) {
                let score = Math.max(1, Math.floor(ship.group.max/5*(1+this.reachStage/3)));
                this.hud.showTip("coin2_png", "+"+score, "Wave Clear!");
                this.addScore(score);
            }

            let power = 10;  // Math.max(ship.maxHp/10, 1);
            let score = Math.max(1, Math.floor(1*this.reachStage/5));
            if (ship instanceof MotherShip) {
                power *= 80;
                // score *= 10;
                // 掉落雨
                for (let i=0; i<20; i++) {
                    let dropKey = GameController.instance.dropTableForBossEnemy.randomR();
                    GameController.instance.spawnSupply(this.world, dropKey, ship.gameObject.x, ship.gameObject.y, true, i*50);
                }
            } else if (ship instanceof MotherGunShip) {
                power *= 40;
                score *= 5;
            }

            this.hero.addEnergy(power);
            
            if (ship.dropTable) {
                let dropKey = ship.dropTable.randomR();
                GameController.instance.spawnSupply(this.world, dropKey, ship.gameObject.x, ship.gameObject.y);
            }
            

            // 更新统计
            // this.heroGunData.exp += score*2;
            // this.heroGunData.enemy++;
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
                    playerData.highscore.gunKey = playerData.gun;
                    playerData.highscore.skillKey = playerData.skill;
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
        this.evtMgr.unregEvent(this.layer, egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin);
        this.evtMgr.unregEvent(this.layer, egret.TouchEvent.TOUCH_MOVE, this.onTouchMove);
        this.evtMgr.unregEvent(this.layer, egret.TouchEvent.TOUCH_END, this.onTouchEnd);
        this.enemyCtrl.stopRush();
        this.buffSupplySpawner.stop();

        // 玩家数据
        let playerData = GameController.instance.playerData;
        playerData.coins += this.unsaveScore;
        this.unsaveScore = 0;
        if (this.score > playerData.highscore.score) {
            // new high score!
            playerData.highscore.score = this.score;
            playerData.highscore.stage = this.reachStage;
            playerData.highscore.gunKey = playerData.gun;
            playerData.highscore.skillKey = playerData.skill;
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
                // 主炮升级
                this.hud.showTip(buff.model, "+"+buff.levelChange, buff.name);
                this.hud.setGunLevel(ship.mainGun.level);
            } else if (buff instanceof AddEnergyBuff) {
                // 增加能量
                this.hud.showTip(buff.model, "+"+(buff.energy*100/this.hero.maxEnergy).toFixed(0)+"%", buff.name);
            } else {
                // 其他有图标的BUFF
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
                    this.onHeroUseEnergy();
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
        this.evtMgr.regEvent(this.sldHeroScale, eui.UIEvent.CHANGE, this.onHeroScaleChanged);
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
            if (i === 5) {
                ship.resetHp(2000);
            }
            ship.x = 60 * i;
            ship.y = 500;
		}
	}

    private createAllRushes(): void {
        const WAVE_NUM = 15;
        const GUN_ENEMY_CD = 20000;
        let gunEnemyCD = 0;
        const FOLLOW_ENEMY_CD = 20000;
        let followEnemyCD = 0;
        const GOLD_ENEMY_CD = 1000000;
        let goldEnemyCD = GOLD_ENEMY_CD - 20000;
        let bossCallback = (boss: Ship):void=>{
            this.enemyCtrl.stopRush();
            this.showBossUI(boss);
        }
        let enmeyType = new DropTable<number>();
        enmeyType.push(0, 1000);
        enmeyType.push(1, 200);
        enmeyType.push(2, 200);
        enmeyType.push(3, 50);
        // this.enemyCtrl.addRushes10(1000, 500, 1.0);
        this.enemyCtrl.addRushBomb(1000, 500, 1);
        // this.enemyCtrl.addRushGoldShip(1000, 1000, 1);
        // this.enemyCtrl.addRushBoss1(1000, 1000, bossCallback, this, 1);
        for (let i=1; i<=WAVE_NUM*10; i++) {
            let level = Math.floor((i-1)/WAVE_NUM) + 1;
            let speed = Math.floor(Math.min(level*0.2+0.8, 2.0));
            let speed2 = Math.floor(Math.min(level*0.5+0.5, 3.0));
            let hp = Math.floor(20+i/1);
            if (i%WAVE_NUM === 0) {
                gunEnemyCD = GUN_ENEMY_CD;
                followEnemyCD = FOLLOW_ENEMY_CD;
                this.enemyCtrl.addRushes6(4000, hp, speed);
                this.enemyCtrl.addRushes7(4000, hp*5, 3, speed2);
                switch (level) {
                case 1:
                    this.enemyCtrl.addRushBoss1(5000, 3000, bossCallback, this, speed);
                    break;
                case 2:
                    this.enemyCtrl.addRushBoss2(5000, 5000, bossCallback, this, speed);
                    break;
                case 3:
                    this.enemyCtrl.addRushBoss3(5000, 8000, bossCallback, this, speed);
                    break;
                default:
                    this.enemyCtrl.addRushBoss3(5000, 8000+(level-3)*2000, bossCallback, this, speed);
                }
            } else {
                if (Math.random() < 0.3) {
                    // 陨石
                    let rush = this.enemyCtrl.addRushMeteoroid(0, hp*5, speed);
                    rush.setCallback(():void=>{
                        tutils.playSound("Meteoroid_mp3");
                        rush.from.x = (0.1 + Math.random() * 0.8) * this.stage.stageWidth;
                        rush.to.x = rush.from.x;
                    }, this);
                }

                if (Math.random()<0.1 && level>=3) {
                    // 炸弹
                    this.enemyCtrl.addRushBomb(1000, hp*5, speed);
                }

                let delay = Math.random() * 5000 + 3000;
                let typ = enmeyType.random();
                let isSpecial = false;
                if (typ === 1) {
                    if (gunEnemyCD >= GUN_ENEMY_CD) {
                        gunEnemyCD = 0;
                        let num = Math.floor(Math.min(4, Math.random()*((level-1)/3+1)+1));
                        if (Math.random() < 0.5) {
                            this.enemyCtrl.addRushes7(delay, hp*6, num, speed);
                        } else {
                            this.enemyCtrl.addRushes8(delay, hp*6, num, speed);
                        }
                        isSpecial = true;
                    }
                } else if (typ === 2) {
                    if (followEnemyCD >= FOLLOW_ENEMY_CD) {
                        followEnemyCD = 0;
                        this.enemyCtrl.addRushes10(delay, hp*25, speed2);
                        isSpecial = true;
                    }
                } else if (typ === 3) {
                    if (goldEnemyCD >= GOLD_ENEMY_CD) {
                        goldEnemyCD = 0;
                        this.enemyCtrl.addRushGoldShip(delay, hp*150, speed);
                        isSpecial = true;
                    }
                }
                
                if (!isSpecial) {
                    let i = Math.floor(Math.random()*6);
                    switch (i) {
                    case 1:
                        this.enemyCtrl.addRushes1(delay, hp, speed);
                        break;
                    case 2:
                        this.enemyCtrl.addRushes2(delay, hp, speed);
                        break;
                    case 3:
                        this.enemyCtrl.addRushes3(delay, hp, speed);
                        break;
                    case 4:
                        this.enemyCtrl.addRushes4(delay, hp, speed);
                        break;
                    case 5:
                        this.enemyCtrl.addRushes5(delay, hp, speed);
                        break;
                    default:
                        let num = Math.floor(Math.random()*5+5);
                        this.enemyCtrl.addRushes11(delay, hp, num, speed);
                    }
                    gunEnemyCD += delay;
                    followEnemyCD += delay;
                    goldEnemyCD += delay;
                }
            }
        }
        this.enemyCtrl.startRush();
    }

    private showBossUI(boss: Ship): void {
        this.hud.showBossHpBar(()=>{
            this.hud.updateBossHpBar(boss.hp*100/boss.maxHp);
        }, this);
        boss.setOnHpChangedListener(this.onBossHpChanged, this);
    }

    private hideBossUI(): void {
        this.hud.hideBossHpBar();
    }

    private onBuffSupplySpawn(dt: number): void {
        let dropKey: string;
        if (GameController.instance.getPlayerGunData().use<=3 && this.hero.mainGun.level===1) {
            // 飞船使用次数少于3时第一个buff必定是主炮升级
            dropKey = "buff_gun_level_up";
            this.starNum++;
        } else {
            dropKey = GameController.instance.dropTableForBuffSupply.randomR();
        }
        GameController.instance.spawnSupply(this.world, dropKey, Math.floor((0.2+Math.random()*0.6)*this.stage.stageWidth), 10);
    }
}