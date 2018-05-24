class TestLayer2 extends tutils.Layer {
	
	m_last_tick_time:number;//上一次进入帧函数的时间
	m_balls:egret.DisplayObject[] = [];
	// m_ball_x:number;
	// m_ball_y:number;
	m_ball_r:number;


	m_dst_x:number;
	m_dst_y:number;

	m_is_flying:boolean;
	m_distance:number; //需要飞行的距离
	m_total_time:number; //总共飞行的时间
	m_time_start_fly:number; //开始飞行的时间

	m_K:number; //常量 V=K * D
	m_XSign:number; 
	m_YSign:number; 


	// override
	protected onCfgStage(): void {
		this.stage.frameRate = 60;
	}

	// override
	protected onInit(): void {
		let bg = tutils.createBitmapByName("grid100_png");
		this.addChild(bg);

		this.layer.touchEnabled = true;

		this.layer.addEventListener(egret.TimerEvent.ENTER_FRAME, this.onEnterFrame, this);
		this.layer.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		this.layer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		this.layer.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
		// this.m_ball_x = 200;
		// this.m_ball_y = 500;
        this.m_dst_x = this.stage.stageWidth * 0.5;
        this.m_dst_y = this.stage.stageHeight * 0.5;
		this.m_ball_r = 50;

		for (let i=0; i<10; i++) {
			let ball = this.createDisplayBall(this.m_dst_x, this.m_dst_y,this.m_ball_r);
			this.layer.addChild(ball);
			this.m_balls.push(ball);
		}
        
        this.m_last_tick_time = egret.getTimer();
	}





	private onEnterFrame(evt: egret.TimerEvent): void {
		let current_time = egret.getTimer();
        let dt = current_time - this.m_last_tick_time;
        this.m_last_tick_time = current_time;

        let dty = 30;

		for (let i=0; i<this.m_balls.length; i++) {
			let dstX = i===0 ? this.m_dst_x : this.m_balls[i-1].x;
			let dstY = i===0 ? this.m_dst_y : this.m_balls[i-1].y+dty;
			let ball = this.m_balls[i];
			
			let d = this.distance(ball.x, ball.y, dstX, dstY);
			let a = Math.atan2(dstY-ball.y, dstX-ball.x);
			let v = this.calcV(d);
			let vx = v * Math.cos(a) * v;
			let vy = v * Math.sin(a) * v;
			ball.x += vx * dt;
			ball.y += vy * dt;
		}
	}

    private calcV(d: number): number {
        let v = Math.log(d*0.02+1);
        return v;
    }

	private onTouchBegin(evt: egret.TouchEvent): void {
		console.log("touch begin:" + "x:" + evt.localX + ",y:" + evt.localY);
        this.m_dst_x = evt.localX;
        this.m_dst_y = evt.localY;
        
		// if(!this.m_is_flying)
		// {
		// 	this.m_time_start_fly = egret.getTimer();
		// 	this.m_dst_x = evt.localX;
		// 	this.m_dst_y = evt.localY;
		// 	this.m_is_flying = true;
		// 	this.m_distance = this.distance(this.m_dst_x,this.m_dst_y,this.m_ball_x,this.m_ball_y); 

		// 	if(this.m_ball_x <= this.m_dst_x)
		// 	{
		// 		//x分量应该加，符号是正
		// 		this.m_XSign = 1;
		// 	}
		// 	else
		// 	{
		// 		this.m_XSign = -1;
		// 	}

		// 	if(this.m_ball_y <= this.m_dst_y)
		// 	{
		// 		//y分量应该加，符号是正
		// 		this.m_YSign = 1;
		// 	}
		// 	else
		// 	{
		// 		this.m_YSign = -1;
		// 	}
		// }
	}

	private onTouchMove(evt: egret.TouchEvent): void
	{
		//console.log("touch move:" + "x:" + evt.localX + ",y:" + evt.localY);
        this.m_dst_x = evt.localX;
        this.m_dst_y = evt.localY;
	}

	private onTouchEnd(evt: egret.TouchEvent): void
	{

	}



	private createDisplayBall(x: number, y: number, r:number): egret.DisplayObject {
		let obj = tutils.createBitmapByName("BlueBallBullet_png");
		obj.width = r * 2;
		obj.height = r * 2;
		obj.anchorOffsetX = obj.width / 2;
		obj.anchorOffsetY = obj.height / 2;
		obj.x = x;
		obj.y = y;
		return obj;
	}

	private distance(x1:number,y1:number,x2:number,y2:number):number
	{
		let a = (x1-x2) * (x1-x2);
		let b = (y1-y2) * (y1-y2);

		return Math.sqrt(a+b);
	}

}