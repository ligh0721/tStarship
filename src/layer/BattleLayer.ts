class BattleLayer extends tutils.Layer {
	private world: World;
    private hero: HeroShip;
	private score: Score;
    private enemyCtrl: EnemyController;
    private readonly buffuis: BuffProgress[] = [];
    private bossui: BossHpProgress = null;
    private bossuiShowing: boolean = true;
    private readonly beginDelta: {x: number, y: number} = {x: 0, y: 0};
    private heroHpBar: ShapeProgress;
    private heroPowerBar: ShapeProgress;
    private bgCtrl: BackgroundController;

    $pathPercent: number = 0;
	
	protected onInit() {
        this.stage.frameRate = 60;
        this.bgCtrl = new BackgroundController(this.stage.stageWidth, this.stage.stageHeight, "grid100_png").create();
        this.bgCtrl.start(20);
        this.layer.addChild(this.bgCtrl.gameObject);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        this.layer.touchEnabled = true;
        this.layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
        this.layer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		
        // 创建世界
        this.world = new World(this.layer, stageW, stageH);
        this.world.start(30);
        this.world.setOnShipDyingListener(this.onShipDying, this);
        this.world.setOnShipHitSupplyListener(this.onShipHitSupply, this);

        // 开启调试辅助线
        // this.world.dbgDrawSprite = <egret.Sprite>tutils.createLayer(this.layer, 0x000000, 0.0);
        // this.world.dbgTextField = new egret.TextField()
        // this.world.dbgDrawSprite.addChild(this.world.dbgTextField);

        // 创建分数板
		let score = new Score(this.layer);
		score.digits = 10;
		score.score = 0;
        this.score = score;
        this.score.gameObject.x = this.stage.stageWidth - this.score.gameObject.textWidth;

        // 创建敌军控制器
        this.enemyCtrl = new EnemyController(this.world);

        // 创建玩家飞船
        let hero = new HeroShip(40, 80);
        this.hero = hero;
        this.world.addShip(hero);
        hero.force.force = tutils.Player1Force;
        hero.x = stageW * 0.5;
        hero.y = stageH - hero.height * 2;
        hero.speed.baseValue = 200;
        hero.resetHp(100);
        let gun = Gun.createGun(Gun, EllipseWaveBullet);
        gun.fireCooldown.baseValue = 200;
        gun.bulletSpeed.baseValue = 80;
        gun.bulletPower.baseValue = 3;
        gun.bulletPowerLossPer = 1;
        gun.bulletPowerLossInterval.baseValue = 1000;
        hero.addGun(gun, true).autoFire = true;

        hero.setOnAddBuffListener(this.onShipAddBuff, this);
        hero.setOnRemoveBuffListener(this.onShipRemoveBuff, this);

        let buff = new GunBuff(5000, -0.80, 0, +1.00);
        let buff2 = new ShipBuff(5000, -0.80);
        let skill = new AddBuffSkill([buff, buff2]);
        hero.setSkill(skill);

        // 创建玩家飞船血条、能量条
        this.heroHpBar = new ShapeProgress(this.layer, tutils.ProgressFillDirection.BottomToTop, 50, 100, 0xf48771, 0xf48771);
        hero.heroHpBar = this.heroHpBar;
        this.heroHpBar.gameObject.x = 10;
        this.heroHpBar.gameObject.y = this.stage.stageHeight - 100 - 10;
        this.heroHpBar.percent = this.hero.hp / this.hero.maxHp;

        this.heroPowerBar = new ShapeProgress(this.layer, tutils.ProgressFillDirection.BottomToTop, 50, 100, 0x9cdcfe, 0x9cdcfe);
        hero.heroPowerBar = this.heroPowerBar;
        this.heroPowerBar.gameObject.x = this.stage.stageWidth - 50 - 10;
        this.heroPowerBar.gameObject.y = this.stage.stageHeight - 100 - 10;
        this.heroPowerBar.percent = this.hero.power / this.hero.maxPower;
        this.heroPowerBar.gameObject.touchEnabled = true;
        this.heroPowerBar.gameObject.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTapHeroPower, this);
        this.hero.addPower(100);
        
        // 创建测试补给箱
        let testSupplyTimer = new tutils.Timer();
        testSupplyTimer.setOnTimerListener((dt: number): void=>{
            this.createTestSupply();
        });
        testSupplyTimer.start(5000, true, 0);

        // 创建测试敌军
        //this.createTestEnemyShip(1);

        // 创建BOSS飞船
        //this.createTestMotherShip();
        
        // 绘制测试路径
        //this.drawTestPath();

        // 创建敌军小队
        this.createTestEnemyRushes();
        // let enemy1 = this.enemyCtrl.createEnemyShip(40, 60, "tri");
        // enemy1.resetHp(5);
        // let rushItem = new RushItem([enemy1], 'path', 1000, 4000, 200, [{x: this.world.width*0.7, y: 0}, {x: this.world.width*0.7, y: this.world.height*0.5}, {x: 0, y: this.world.height*0.8}], null);
        // this.enemyCtrl.addRush(rushItem);

        // this.enemyCtrl.startRush(30);
        tutils.playSound("Bgmusic_mp3", 0);
	}

    protected onTouchTapHeroPower(evt: egret.TouchEvent): void {
        if (evt.target != this.heroPowerBar.gameObject || !this.hero.isPowerFull()) {
            return;
        }
        if (this.hero.castSkill()) {
            tutils.playSound("Powerup_mp3");
            this.turbo(200, 20, 5000);
        }
    }

    public turbo(speed: number, orgSpeed: number, dur: number): void {
        if (dur < 1500) {
            dur = 1500;
        }
        let tw = egret.Tween.get(this.bgCtrl);
        tw.to({speed: speed}, 1000, egret.Ease.getPowOut(2));
        tw.wait(dur-1500);
        tw.to({speed: orgSpeed}, 2000, egret.Ease.getPowOut(2));
    }

    public get pathPercent(): number {
        return this.$pathPercent;
    }

    public set pathPercent(value: number) {
        const dur = 10000;
        const dis = 1000;
        const T = 1000;
        const pX = 500;
        const pY = 0;
        const A = 100;
        this.$pathPercent = value;
        let y = pY + dis * value;
        let x = pX + A * Math.sin(value*dur/2*Math.PI/T);
        let g = this.layer.graphics;
        g.drawCircle(x, y, 1);
    }

    public drawTestPath(): void {
        let tw = egret.Tween.get(this);
        this.pathPercent = 0;
        tw.to({pathPercent: 1}, 10000)
        this.layer.graphics.lineStyle(1, 0xffffff);
    }

    private onShipDying(ship: Ship, killer: Ship) {
        const sounds = ["Explosion0_mp3", "Explosion2_mp3"];
        tutils.playSound(sounds[Math.floor(Math.random()*sounds.length)]);
        if (this.hero == ship) {
            // TODO: GAME OVER
            let txt = new egret.TextField();
            txt.text = "GAME OVER";
            txt.bold = true;
            txt.size = 100;
            this.layer.addChild(txt);
            txt.x = (this.stage.stageWidth - txt.textWidth) * 0.5;
            txt.y = (this.stage.stageHeight - txt.textHeight) * 0.5 - 50;

            txt = new egret.TextField();
            txt.text = "SCORE: " + this.score.score;
            txt.bold = true;
            txt.size = 50;
            this.layer.addChild(txt);
            txt.x = (this.stage.stageWidth - txt.textWidth) * 0.5;
            txt.y = (this.stage.stageHeight - txt.textHeight) * 0.5 + 50;

            this.score._score
        } else if (this.hero.force.isMyEnemy(ship.force) && killer == this.hero) {
            let score = Math.floor(ship.maxHp*20/100)*100;
            // this.score.setScore(this.score.score+score, 200);
            this.score.score += score;
            let supply = this.world.pools.newObject(PowerSupply, ship.maxHp);
            this.world.addSupply(supply);
            supply.drop(ship.gameObject.x, ship.gameObject.y);
        }
    }

    private onShipHitSupply(ship: Ship, supply: Supply) {
    }

    private onShipAddBuff(ship: Ship, buff: Buff) {
        const baseX = 200;
        const baseY = this.stage.stageHeight - BuffProgress.Height - 10;
        const dt = 10;
        let color: number = 0xffffff;
        switch (buff.name) {
            case "GunCDR":
            color = 0x4f86ff;
            break;
            
            case "GunPower":
            color = 0xf48771;
            break;

            case "GunSpeed":
            color = 0x49bba4;
            break;

            case "SatelliteGun":
            color = 0xdcdcaa;
            break;

            default:
            return;
        }
        tutils.playSound("Powerup_mp3");

        let buffui = new BuffProgress(this.layer, buff, color);
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
                this.layer.removeChild(buffui.gameObject);
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
            this.layer.removeChild(buffui.gameObject);
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

    private onShipHpChanged(ship: HpUnit, changed: number) {
        console.assert(this.bossui != null);
        if (this.bossui == null || this.bossui.showing) {
            return;
        }
        this.bossui.percent = ship.hp / ship.maxHp;
        if (ship.hp <= 0) {
            this.bossui.cleanup();
            this.layer.removeChild(this.bossui.gameObject);
            this.score.gameObject.visible = true;
        }
    }

	private onTouchBegin(evt: egret.TouchEvent) {
        if (evt.target != this.layer || !this.hero.isAlive()) {
            this.beginDelta.x = -1;
            return;
        }
        this.beginDelta.x = evt.localX - this.hero.gameObject.x;
        this.beginDelta.y = evt.localY - this.hero.gameObject.y;
        //this.hero.move(evt.localX, evt.localY-100);
    }

    private onTouchMove(evt: egret.TouchEvent) {
        if (this.beginDelta.x == -1 || !this.hero.isAlive()) {
            return;
        }
        let toX = evt.localX-this.beginDelta.x;
        if (toX < 0) {
            toX = 0;
        } else if (toX > this.stage.stageWidth) {
            toX = this.stage.stageWidth;
        }
        let toY = evt.localY-this.beginDelta.y;
        if (toY < 0) {
            toY = 0;
        } else if (toY > this.stage.stageHeight) {
            toY = this.stage.stageHeight;
        }
        this.hero.move(toX, toY);
    }

	// FIXME: test
	private createTestEnemyShip(n: number) {
		for (let i=0; i<n; i++) {
			let ship = new EnemyShip(30, 60, "tri");
			this.world.addShip(ship);
			ship.force.force = tutils.EnemyForce;
            ship.resetHp(Math.floor(Math.random()*10)+1);
            ship.x = this.stage.stageWidth*(0.1+Math.random()*0.8);
            ship.y = this.stage.stageHeight*(0.1+Math.random()*0.7);
		}
	}

    private createTestEnemyRushes() {
        let en0: EnemyShip[] = [];
        let en1: EnemyShip[] = [];
        let en2: EnemyShip[] = [];
        let en3: EnemyShip[] = []; 
        let n = 10;
        for (let i=0; i<n; i++) {
            let enemy0 = this.enemyCtrl.createEnemyShip(40, 60, "tri");
            enemy0.resetHp(5);
            en0.push(enemy0);

            let enemy1 = this.enemyCtrl.createEnemyShip(40, 60, "tri");
            enemy1.resetHp(5);
            en1.push(enemy1);

            let enemy2 = this.enemyCtrl.createEnemyShip(40, 60, "tri");
            enemy2.resetHp(5);
            en2.push(enemy2);

            let enemy3 = this.enemyCtrl.createEnemyShip(40, 60, "tri");
            enemy3.resetHp(5);
            en3.push(enemy3);
        }

        let enemy0 = this.enemyCtrl.createEnemyShip(40, 60, "tri");
        enemy0.resetHp(5);

        let enemy1 = this.enemyCtrl.createEnemyShip(40, 60, "tri");
        enemy0.resetHp(5);

        // this.enemyCtrl.enemyShipMoveInStraightLine(enemyShip, enemyShip.width*0.5);
        // this.enemyCtrl.rushBezier(enemies, {x: this.world.width*0.5, y: 0}, {x: this.world.width*0.5, y: this.world.height*0.5}, {x: this.world.width, y: this.world.height*0.5}, 200, 2000, false);
        // this.enemyCtrl.enemyShipMoveInBezierCurve(enemyShip1, {x: this.world.width*0.5, y: 0}, {x: this.world.width*0.5, y: this.world.height*0.5}, {x: this.world.width, y: this.world.height*0.8});

        let rushItem = new RushItem(en0, 'bezier', 2000, 2000, 200, [{x: this.world.width*0.3, y: 0}, {x: this.world.width*0.3, y: this.world.height*0.5}, {x: this.world.width, y: this.world.height*0.5}], null);
        this.enemyCtrl.addRush(rushItem);
        
        rushItem = new RushItem(en1, 'bezier', 0, 2000, 200, [{x: this.world.width*0.7, y: 0}, {x: this.world.width*0.7, y: this.world.height*0.5}, {x: 0, y: this.world.height*0.5}], null);
        this.enemyCtrl.addRush(rushItem);
        
        rushItem = new RushItem(en2, 'straight', 4000, 2000, 200, [{x: this.world.width*0.7, y: this.world.height}], null);
        this.enemyCtrl.addRush(rushItem);
        
        rushItem = new RushItem(en3, 'sin', 5000, 4000, 200, [{x: 200, y: 0}, {x: 200, y: this.world.height}], null, 2000, 100);
        this.enemyCtrl.addRush(rushItem);
        
        rushItem = new RushItem([enemy0], 'bezier', 5000, 2000, 200, [{x: this.world.width*0.7, y: 0}, {x: this.world.width*0.7, y: this.world.height*0.5}, {x: 0, y: this.world.height*0.8}], null);
        this.enemyCtrl.addRush(rushItem);
        
        rushItem = new RushItem([enemy1], 'sin', 5000, 4000, 200, [{x: 800, y: 0}, {x: 200, y: this.world.height}], null, 2000, 100);
        this.enemyCtrl.addRush(rushItem);

        rushItem = new RushItem(null, "", 5000, 0, 0, null, null, 0, 0, this.createTestMotherShip, this);
        this.enemyCtrl.addRush(rushItem);

        for (let i=0; i<50; i++) {
            let es = [];
            let n = Math.floor(Math.random()*5+3);
            for (let j=0; j<n; j++) {
                let e = this.enemyCtrl.createEnemyShip(40, 60, "tri");
                e.resetHp(5);
                es.push(e);
            }
            
            let delay = Math.random() * 5000 + 2000;
            let dur = Math.random() * 3000 + 3000;
            let interval = Math.random() * 200 + 100;
            let a = Math.random() * 200 + 80
            let x = Math.random() * (this.stage.stageWidth - a * 2) + a;
            let t = Math.random() * 1000 + 2000;
            let rushItem = new RushItem(es, 'sin', delay, dur, interval, [{x: x, y: 0}, {x: x, y: this.world.height+100}], null, t, a);
            this.enemyCtrl.addRush(rushItem);
        }
        rushItem = new RushItem(null, "", 5000, 0, 0, null, null, 0, 0, this.createTestMotherShip, this);
        this.enemyCtrl.addRush(rushItem);
        this.enemyCtrl.startRush(30);
    }

    private createTestMotherShip() {
        let ship = new MotherShip(400, 200);
        this.world.addShip(ship);
        ship.angle = 180;
        ship.x = this.stage.stageWidth * 0.5;
        ship.y = -ship.height;
        ship.force.force = tutils.EnemyForce;
        ship.resetHp(1000);

        let gunShip = new MotherGunShip(40, 80, "tri");
        ship.addGunShip(gunShip, -100, 100);
        gunShip.resetHp(200);
        gunShip.angle = 180;
        let gun = Gun.createGun(Gun, Bullet);
        gunShip.addGun(gun);
        
        let gunShip2 = new MotherGunShip(40, 80, "rect");
        ship.addGunShip(gunShip2, 100, 100);
        gunShip2.resetHp(150);
        gunShip2.angle = 180;
        let gun2 = Gun.createGun(ShotGun, Bullet);
        gun2.fireCooldown.baseValue = 1000;
        gunShip2.addGun(gun2);

        let moveMotherShip = (ship: MotherShip)=>{
            let tw = egret.Tween.get(ship);
            tw.to({x: this.stage.stageWidth * 0.4}, 2000);
            tw.to({x: this.stage.stageWidth * 0.6}, 4000);
            tw.to({x: this.stage.stageWidth * 0.5}, 2000);
            tw.call(moveMotherShip, this, [ship]);
        };

        let rotateGunShip = (gunShip: MotherGunShip)=>{
            let tw = egret.Tween.get(gunShip);
            tw.set({angle: 180});
            tw.to({angle: 180+45}, 1000);
            tw.to({angle: 180-45}, 2000);
            tw.to({angle: 180}, 2000);
            tw.call(rotateGunShip, this, [gunShip]);
        };

        let tw = egret.Tween.get(ship);
        tw.to({y: ship.height*0.5+100}, 5000)
        tw.wait(1000);
        tw.call(()=>{
            moveMotherShip(ship);
            rotateGunShip(gunShip);
            rotateGunShip(gunShip2);
            gun.autoFire = true;
            gun2.autoFire = true;
        }, this);

        this.bossui = new BossHpProgress(this.layer, ship, 0xffffff);
        this.bossui.show();
        ship.setOnHpChangedListener(this.onShipHpChanged, this);
        //ship.damaged(1, null);
        this.score.gameObject.visible = false;
    }

    private createTestSupply() {
        let buff: Buff;
        let supply: Supply;
        let gun: Gun;
        let i = Math.floor(Math.random()*10);
        switch (i) {
            case 0:
            buff = new GunBuff(8000, -0.30, 0, 0);
            buff.name = "GunCDR";
            buff.uniq = "GunCDR";
            supply = new BuffSupply([buff]);
            supply.text = "GunCDR";
            supply.color = 0x4f86ff;
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
            buff = new GunBuff(8000, 0, 0, +1.00);
            buff.name = "GunSpeed";
            buff.uniq = "GunSpeed";
            supply = new BuffSupply([buff]);
            supply.text = "GunSpeed";
            supply.color = 0x49bba4;
            break;

            case 3:
            gun = Gun.createGun(SatelliteGun, ExplosionBullet);
            gun.fireCooldown.baseValue = 1000;
            gun.bulletPower.baseValue = 5;
            gun.bulletPowerLossPer = 1.0;
            gun.bulletPowerLossInterval.baseValue = 1000;
            buff = new AddGunBuff(8000, [gun]);
            buff.name = "SatelliteGun";
            buff.uniq = "SatelliteGun";
            supply = new BuffSupply([buff]);
            supply.text = "SatelliteGun";
            supply.color = 0xdcdcaa;
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
            gun.bulletPower.baseValue = 30;
            gun.bulletPowerLossPer = 0.2;
            gun.bulletPowerLossInterval.baseValue = 100;
            supply = new GunSupply(gun);
            supply.text = "ShakeWaveGun";
            supply.color = 0xc586c0;
            supply.pickDist = 0;
            break;

            case 6:
            gun = Gun.createGun(ShotGun, EllipseWaveBullet);
            (<ShotGun>gun).bulletAngleDelta = 10;
            (<ShotGun>gun).bulletNum = 5;
            gun.fireCooldown.baseValue = 600;
            gun.bulletSpeed.baseValue = 60;
            gun.bulletPower.baseValue = 2;
            gun.bulletPowerLossPer = 1;
            gun.bulletPowerLossInterval.baseValue = 1000;
            supply = new GunSupply(gun);
            supply.text = "ShotGun";
            supply.color = 0xc586c0;
            supply.pickDist = 0;
            break;

            case 7:
            gun = Gun.createGun(RowGun, EllipseWaveBullet);
            (<RowGun>gun).bulletNum = 3;
            gun.fireCooldown.baseValue = 400;
            gun.bulletSpeed.baseValue = 60;
            gun.bulletPower.baseValue = 2;
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
            gun.bulletPower.baseValue = 1;
            gun.bulletPowerLossPer = 1;
            gun.bulletPowerLossInterval.baseValue = 1000;
            supply = new GunSupply(gun);
            supply.text = "GuideGun";
            supply.color = 0xc586c0;
            supply.pickDist = 0;
            break;
        }

        this.world.addSupply(supply);
        supply.drop(Math.floor((0.2+Math.random()*0.6)*this.stage.stageWidth), 10);
    }
}