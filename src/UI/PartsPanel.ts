class PartsPanel extends eui.Component {
    private open: egret.tween.TweenGroup;
    private btnResume: eui.Button;
    private rctSel0: eui.Rect;
    private rctSel1: eui.Rect;
    private rctSel2: eui.Rect;
    private rctSel3: eui.Rect;
    private imgIcon0: eui.Image;
    private imgIcon1: eui.Image;
    private imgIcon2: eui.Image;
    private imgIcon3: eui.Image;
    private rctSel: eui.Rect[] = [];
    private imgIcon: eui.Image[] = [];
    private lblPartName: eui.Label;
    private lblPartDesc: eui.Label;
    private grpParts: eui.Group;
    private grpInside: eui.Group;
    private grpOutside: eui.Group;
    private grpOutsideUp: eui.Group;
    private grpOutsideDown: eui.Group;

    private parts: Part[] = null;
    private selectedIndex: number = -1;

    private draggingIconFake: eui.Image = null;
    private draggingIndex: number = -1;

    private draggingIcon: eui.Image = null;
    private draggingIconPos: {x: number, y: number} = {x: 0, y: 0};

    private data: {parts: Part[]};

    private onRemovePartListener: (part: Part)=> void = null;
    private onRemovePartThisObj: any = null;

	public constructor(data: {parts: Part[]}) {
        super();
        this.data = data;
    }

    // override
    protected createChildren(): void {
        super.createChildren();

        this.skinName = "resource/custom_skins/PartsPanelSkin.exml";
        this.width = egret.MainContext.instance.stage.stageWidth;
        this.currentState = "init";
        this.rctSel.push(this.rctSel0, this.rctSel1, this.rctSel2, this.rctSel3)
        this.imgIcon.push(this.imgIcon0, this.imgIcon1, this.imgIcon2, this.imgIcon3)

        for (let i in this.imgIcon) {
            this.imgIcon[i].addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapPart, this);
        }
        this.grpInside.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onDragPartBegin, this);
        this.grpOutside.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onDragPartMove, this);
        this.grpInside.addEventListener(egret.TouchEvent.TOUCH_END, this.onDragPartEnd, this);
        this.grpInside.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onDragPartOutside, this);
        this.btnResume.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onBtnResume, this);
        this.draggingIconFake = new eui.Image();
        this.draggingIconFake.width = 100;
        this.draggingIconFake.height = 100;
        this.draggingIconFake.anchorOffsetX = this.draggingIconFake.width * 0.5;
        this.draggingIconFake.anchorOffsetY = this.draggingIconFake.height * 0.5;
        this.draggingIconFake.alpha = 0;
        this.draggingIconFake.touchEnabled = false;
        this.parent.addChild(this.draggingIconFake);  // hud;
        
        this.parts = this.data.parts;
        this.updatePartsList();

        this.open.addEventListener("complete", this.onTweenGroupComplete, this);
        this.open.play();
    }

    private onTweenGroupComplete(evt: egret.Event): void {
    }

    private updatePartsList(): void {
        for (let i in this.parts) {
            let part = this.parts[i];
            this.imgIcon[i].source = part.model;
            if (i === "0") {
                this.selectPart(0);
            }
        }
    }

    private selectPart(index: number): void {
        if (this.selectedIndex === index) {
            return;
        }
        if (this.selectedIndex >= 0) {
            this.rctSel[this.selectedIndex].alpha = 0;
        }

        this.selectedIndex = index;
        if (index >= 0) {
            this.rctSel[index].alpha = 1;
            let part = this.parts[index];
            this.lblPartName.text = part.name;
            this.lblPartDesc.text = part.desc;
        } else {
            this.lblPartName.text = "";
            this.lblPartDesc.text = "";
        }
    }

    private getTouchPartIndex(target: any): number {
        let index: number = -1;
        for (let i in this.imgIcon) {
            if (this.imgIcon[i] == target) {
                let part = this.parts[i];
                if (part) {
                    index = parseInt(i);
                }
                break;
            }
        }
        return index;
    }

    private beginDrag(imgIcon: eui.Image, x: number, y: number): void {
        let index = this.getTouchPartIndex(imgIcon);
        imgIcon.alpha = 0;
        this.draggingIconFake.source = imgIcon.source;
        this.draggingIconFake.alpha = 1;
        this.draggingIndex = index;
        this.grpOutsideUp.alpha = 0.5;
        this.grpOutsideDown.alpha = 0.5;

        this.draggingIconFake.x = x;
        this.draggingIconFake.y = y;
    }

    private endDrag(): void {
        if (this.draggingIndex >= 0) {
            let imgIcon = this.imgIcon[this.draggingIndex];
            imgIcon.alpha = 1;
        }
        this.draggingIconFake.alpha = 0;
        this.draggingIcon = null;
        this.draggingIndex = -1;
        this.grpOutsideUp.alpha = 0;
        this.grpOutsideDown.alpha = 0;
    }

    private onDragPartBegin(evt: egret.TouchEvent): void {
        let index = this.getTouchPartIndex(evt.target);
        if (index >= 0) {
            this.draggingIcon = this.imgIcon[index];
            this.draggingIconPos.x = evt.stageX;
             this.draggingIconPos.y = evt.stageY;
        }
    }

    private onDragPartMove(evt: egret.TouchEvent): void {
        const DRAG_MIN_DIS = 20;
        if (this.draggingIndex >= 0) {
            // 拖动中
            this.draggingIconFake.x = evt.stageX;
            this.draggingIconFake.y = evt.stageY;
            if (this.grpInside.hitTestPoint(evt.stageX, evt.stageY)) {
                this.grpOutsideUp.alpha = 0.5;
                this.grpOutsideDown.alpha = 0.5;
            } else {
                this.grpOutsideUp.alpha = 1;
                this.grpOutsideDown.alpha = 1;
            }
        } else if (this.draggingIcon) {
            // 预拖动中
            let dis = tutils.getDistance(this.draggingIconPos.x, this.draggingIconPos.y, evt.stageX, evt.stageY);
            if (dis > DRAG_MIN_DIS) {
                // 移动拖动
                this.beginDrag(this.draggingIcon, evt.stageX, evt.stageY);
            }
        }
    }

    private onDragPartEnd(evt: egret.TouchEvent): void {
        this.endDrag();
    }

    private onDragPartOutside(evt: egret.TouchEvent): void {
        if (this.draggingIndex >= 0) {
            this.onRemovePart(this.parts[this.draggingIndex]);
            this.parts[this.draggingIndex] = null;
            this.imgIcon[this.draggingIndex].source = null;
            let index = -1;
            for (let i in this.parts) {
                let part = this.parts[i];
                if (part) {
                    index = parseInt(i);
                    break;
                }
            }
            this.selectPart(index);
        }
        this.endDrag();
    }

    private onTapPart(evt: egret.TouchEvent): void {
        let index = this.getTouchPartIndex(evt.target);
        if (index >= 0) {
            this.selectPart(index);
        }
    }

    public setOnRemovePartListener(listener: (part: Part)=>void, thisObj?: any): void {
		this.onRemovePartListener = listener;
		this.onRemovePartThisObj = thisObj;
	}

    private onRemovePart(part: Part): void {
        if (this.onRemovePartListener) {
            this.onRemovePartListener.call(this.onRemovePartThisObj, part);
        }
    }

    private onBtnResume(evt: egret.TouchEvent): void {
        this.parent.removeChild(this);
    }
}