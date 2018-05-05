module tutils {
	export type Constructor<TYPE> = new(...args: any[]) => TYPE;
	export class ObjectPool<TYPE> {
		private readonly pool: any[] = [];
		private readonly ctor: Constructor<TYPE>;
		private readonly onNew: (obj: TYPE)=>void = null;
		private readonly onDel: (obj: TYPE)=>void = null;

		public constructor(ctor: Constructor<TYPE>, onNew?: (obj: TYPE)=>void, onDel?: (obj: TYPE)=>void) {
			this.ctor = ctor;
			if (onNew != undefined) {
				this.onNew = onNew;
			}
			if (onDel != undefined) {
				this.onDel = onDel;
			}
		}

		public newObject(...args: any[]): TYPE {
			let obj: TYPE;
			if (this.pool.length > 0) {
				obj = this.pool.pop();
				this.ctor.call(obj, ...args);
			} else {
				obj = new this.ctor(...args);
			}
			if (this.onNew != null) {
				this.onNew.call(null, obj);
			}
			return obj;
		}

		public delObject(obj: TYPE) {
			if (this.onDel != null) {
				this.onDel.call(null, obj);
			}
			this.pool.push(obj);
		}

		public cleanup(): void {
			this.pool.length = 0;
		}
    }

	export class ObjectPools {
		private pools: { [className: string]: ObjectPool<any> } = {};
		public constructor() {
		}
		public newObject<TYPE>(ctor: Constructor<TYPE>, ...args: any[]): TYPE {
			let name = egret.getQualifiedClassName(ctor);
			let pool:ObjectPool<TYPE> = this.pools[name];
			if (pool == undefined) {
				pool = new ObjectPool<TYPE>(ctor);
				this.pools[name] = pool;
			}
			return pool.newObject(...args);
		}

		public delObject<TYPE>(obj: TYPE) {
			let ctor = obj.constructor;
			let name = egret.getQualifiedClassName(ctor);
			let pool:ObjectPool<TYPE> = this.pools[name];
			if (pool == undefined) {
				pool = new ObjectPool<TYPE>(<any>ctor);
				this.pools[name] = pool;
			}
			return pool.delObject(obj);
		}

		public cleanup(): void {
			this.pools = {};
		}
    }
}

