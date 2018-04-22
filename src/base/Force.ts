enum ForceEffective {
    kSelf = 1 << 0,
    kOwn = 1 << 1,
    kAlly = 1 << 2,
    kEnemy = 1 << 3
}

class Force {
	forceFlag: number = 0;
	allyMaskFlag: number = 0;

	public get force(): number {
		return this.forceFlag != 0 ? Math.log(this.forceFlag)/Math.LN2 : -1;
	}

    public set force(value: number) {
        this.forceFlag = 1 << value;
    }

    // it ONLY means that force is my ally
    public isMyAlly(force: Force): boolean {
        return (this.forceFlag == force.forceFlag) || ((this.allyMaskFlag & force.forceFlag) != 0);
    }

    // it ONLY means that force is my enemy
    public isMyEnemy(force: Force): boolean {
        return !this.isMyAlly(force);
    }

    // the result of 'this.canEffect(force)' is not always same as 'force.canEffect(this)'
    // it ONLY means that 'this' can effect 'force'
    public canEffect(force: Force, effectiveTypeFlags: ForceEffective): boolean {
        return ((this == force) && (effectiveTypeFlags & ForceEffective.kSelf) != 0) ||
           ((this != force) && (this.isMyAlly(force) && (effectiveTypeFlags & ForceEffective.kAlly) != 0)) ||
           (this.isMyEnemy(force) && (effectiveTypeFlags & ForceEffective.kEnemy) != 0);
    }
}
