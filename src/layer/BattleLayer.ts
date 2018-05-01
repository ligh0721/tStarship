class BattleLayer extends tutils.Layer {
	private world: World;
    private hero: HeroShip;
	private score: Score;
    private enemyCtrl: EnemyController;
    private buffuis: BuffProgress[];
    private bossui: BossHpProgress;  // = null FUCK???

    $pathPercent: number = 0;
	
	protected onInit() {
        this.buffuis = [];
        this.bossui = null;

        let bg = tutils.createBitmapByName("grid100_png");
        this.layer.addChild(bg);
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

        // 创建敌军控制器
        this.enemyCtrl = new EnemyController(this.world);

        // 创建玩家飞船
        let hero = new HeroShip(40, 80);
        this.hero = hero;
        this.world.addShip(hero);
        hero.force.force = tutils.Player1Force;
        hero.x = stageW * 0.5;
        hero.y = stageH - hero.height * 0.5;
        hero.speed.baseValue = 50;
        let gun = Gun.createGun(Gun, Bullet);
        gun.fireCooldown.baseValue = 200;
        gun.bulletSpeed.baseValue = 80;
        gun.bulletPower.baseValue = 2;
        gun.bulletPowerLossPer = 1;
        gun.bulletPowerLossInterval.baseValue = 1000;
        hero.addGun(gun, true).autoFire = true;

        hero.setOnAddBuffListener(this.onShipAddBuff, this);
        hero.setOnRemoveBuffListener(this.onShipRemoveBuff, this);
        
        // 创建测试补给箱
        let testSupplyTimer = new tutils.Timer();
        testSupplyTimer.setOnTimerListener((dt: number): void=>{
            this.createTestSupply();
        });
        testSupplyTimer.start(5000, true, 0);

        // 创建测试敌军
        //this.createTestEnemyShip(10);

        // 创建BOSS飞船
        this.createTestMotherShip();
        
        // 绘制测试路径
        //this.drawTestPath();
        
        // 创建分数板
		let score = new Score(this.layer);
		score.digits = 10;
		score.score = 0;
		//score.setScore(10000, 5000);
        this.score = score;
        this.score.bmpText.x = this.stage.stageWidth - this.score.bmpText.textWidth;

        // 创建敌军小队
        let enemies: EnemyShip[] = [];
        let n = 1000;
        for (let i=0; i<n; i++) {
            let enemy = this.enemyCtrl.createEnemyShip(40, 60, "tri");
            enemy.resetHp(5);
            enemies.push(enemy);
        }
        // this.enemyCtrl.enemyShipMoveInStraightLine(enemyShip, enemyShip.width*0.5);
        //this.enemyCtrl.rushBezier(enemies, {x: this.world.width*0.5, y: 0}, {x: this.world.width*0.5, y: this.world.height*0.5}, {x: this.world.width, y: this.world.height*0.5}, false);
        // this.enemyCtrl.enemyShipMoveInBezierCurve(enemyShip1, {x: this.world.width*0.5, y: 0}, {x: this.world.width*0.5, y: this.world.height*0.5}, {x: this.world.width, y: this.world.height*0.8});
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
        if (this.hero == ship) {
            // TODO: GAME OVER
        } else if (this.hero.force.isMyEnemy(ship.force)) {
            this.score.setScore(this.score.score+100, 1);
        }
    }

    private onShipHitSupply(ship: Ship, supply: Supply) {
    }

    private onShipAddBuff(ship: Ship, buff: Buff) {
        const baseX = 10;
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
        }

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
        const baseX = 10;
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
            this.score.bmpText.visible = true;
        }
    }

	private onTouchBegin(evt: egret.TouchEvent) {
        if (!this.hero.isAlive()) {
            return;
        }
        this.hero.move(evt.localX, evt.localY-100);
    }

    private onTouchMove(evt: egret.TouchEvent) {
        if (!this.hero.isAlive()) {
            return;
        }
        this.hero.move(evt.localX, evt.localY-100);
    }

	// FIXME: test
	private createTestEnemyShip(n: number) {
		for (let i=0; i<n; i++) {
			let ship = new Ship(30, 60);
			this.world.addShip(ship);
			ship.force.force = tutils.EnemyForce;
            ship.resetHp(Math.floor(Math.random()*10)+1);
            ship.x = this.stage.stageWidth*(0.1+Math.random()*0.8);
            ship.y = this.stage.stageHeight*(0.1+Math.random()*0.7);
		}
	}

    private createTestMotherShip() {
        let ship = new MotherShip(400, 200);
        this.world.addShip(ship);
        ship.angle = 180;
        ship.x = this.stage.stageWidth * 0.5;
        ship.y = -ship.height;
        ship.force.force = tutils.EnemyForce;
        ship.resetHp(1000);

        let gunShip = new MotherGunShip(40, 80);
        ship.addGunShip(gunShip, -100, 100);
        gunShip.resetHp(100);
        gunShip.angle = 180;
        let gun = Gun.createGun(Gun, Bullet);
        gunShip.addGun(gun);
        
        let gunShip2 = new MotherGunShip(40, 80);
        ship.addGunShip(gunShip2, 100, 100);
        gunShip2.resetHp(200);
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
        this.score.bmpText.visible = false;
    }

    private createTestSupply() {
        let buff: Buff;
        let supply: Supply;
        let gun: Gun;
        let i = Math.floor(Math.random()*4);
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
            break;

            case 5:
            gun = Gun.createGun(EaseGun, ShakeWaveBullet);
            (<EaseGun>gun).ease = egret.Ease.getPowIn(2);
            gun.fireCooldown.baseValue = 1000;
            gun.bulletSpeed.baseValue = 200;
            gun.bulletPower.baseValue = 20;
            gun.bulletPowerLossPer = 0.2;
            gun.bulletPowerLossInterval.baseValue = 100;
            supply = new GunSupply(gun);
            supply.text = "ShakeWaveGun";
            supply.color = 0xc586c0;
            break;

            case 6:
            gun = Gun.createGun(ShotGun, Bullet);
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
            break;

            case 7:
            gun = Gun.createGun(RowGun, Bullet);
            (<RowGun>gun).bulletNum = 3;
            gun.fireCooldown.baseValue = 400;
            gun.bulletSpeed.baseValue = 60;
            gun.bulletPower.baseValue = 2;
            gun.bulletPowerLossPer = 1;
            gun.bulletPowerLossInterval.baseValue = 100;
            supply = new GunSupply(gun);
            supply.text = "RowGun";
            supply.color = 0xc586c0;
            break;

            case 8:
            gun = Gun.createGun(Gun, ExplosionBullet);
            gun.fireCooldown.baseValue = 500;
            gun.bulletSpeed.baseValue = 60;
            gun.bulletPower.baseValue = 5;
            gun.bulletPowerLossPer = 1;
            gun.bulletPowerLossInterval.baseValue = 100;
            supply = new GunSupply(gun);
            supply.text = "ExplosionGun";
            supply.color = 0xc586c0;
            break;
        }

        this.world.addSupply(supply);
        supply.drop(Math.floor((0.2+Math.random()*0.6)*this.stage.stageWidth), 10);
    }
}