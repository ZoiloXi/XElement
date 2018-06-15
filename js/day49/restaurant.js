class Restaurant {
	constructor (option) {
		this.name = option.name
		this.money = option.money
		this.type = option.type || 'restaurant'
		this.seats = 4 || option.seats 	// 暂定为4个, 页面放不下
		this.staffs = []
		this.waiters = []
		this.chefs = []
		this.cuisines = []
		this.available = this.seats
		this.stillWait = []
		this.stillCook = []
	}

	hire (staffs) {
		if (!Array.isArray(staffs)) staffs = [staffs]

		let currentID = this.staffs.length - 1

		staffs.forEach((staff, index) => {
			if (staff.constructor == Chef) {
				this.chefs.push(staff)
			} else if (staff.constructor == Waiter) {
				this.waiters.push(staff)
			}

			this.staffs.push(staff)

			staff.setID(currentID + index + 1)
			staff.greeting()

			this.money -= staff.salary
		})
		// 更新视图
		Event.pub('kitchen_init', {restaurant: this}, 'once')
		
		staffs.forEach(staff => Event.pub('statusChange', staff, 'once'))
		
		return this
	}

	fire (name) {
		this.staffs = this.staffs.filter(staff => staff.name != name)
		this.waiters = this.waiters.filter(waiter => waiter.name != name)
		this.chefs = this.chefs.filter(chef => chef.name != name)
		// 更新视图
		Event.pub('kitchen_init', {restaurant: this}, 'once')
		Event.pub('canteen_destroy', name, 'once')

		return this
	}

	recipe (cuisines) {
		if (!Array.isArray(cuisines)) cuisines = [cuisines]
		this.cuisines = this.cuisines.concat(cuisines)

		return this
	}

	isRandomFree (type) {
		let staffs = type == 'waiter' ? this.waiters : this.chefs,
			staff

		staff =	staffs.filter(staff => staff.getStatus() == 'free')

		return staff[Math.floor(Math.random() * staffs.length)]
	}

	welcome (data) {
		// 配置data相应项
		data.restaurant = this
		data.type = 'usher'
		Event.pub('usher', data, 'once')
	}


	// 开始营业, 负责事件调度
	opening () {
		let self = this
		// 各个职工开始工作,设置工作状态为空闲，为响应业务做准备；busy表明正在执行业务
		self.staffs.forEach(staff => {
			staff.setStatus('free')
		})
		// self.statistic()

		// 开始监听各种事件
		let evtTypes = [
				'welcome',
				'usher',
				'serve',
				'order',
				'cook',
				'dishup',
				'pay',
				'hire',
				'fire',
				'statusChange',	// 在render.kitchen.refresh()中发布该事件
				'statistic',
			];

		for (let i = 0, len = evtTypes.length; i < len; i++) {
			let type = evtTypes[i]
			//绑定事件,形如 Event.sub('transaction', self.transaction.bind(self))
			// Event.sub(evtTypes[i], self[evtTypes[i]].bind(self))
			if (['usher', 'serve', 'order', 'dishup', 'pay', 'cook', 'dishup'].indexOf(type) > -1) {
				Event.sub(type, this.dispath.bind(this))
			} else {
				Event.sub(type, this[type].bind(this))
			}
		}

		return this
	}

	dispath (data) {
		var customer = data.customer,
		staff = null,
		staffs = [],
		text
		// log(data)
		if (['serve', 'order', 'dishup','pay', 'usher'].indexOf(data.type) > -1) {
			staff = this.waiters.filter(waiter => waiter.getStatus() == 'free')[0]
			text = 'waiter'
		} else if (data.type == 'cook') {
			staff = this.chefs.filter(chef => chef.getStatus() == 'free')[0]
			text = 'chef'
		}

		if (staff) {
			staff[data.type](data)
		} else {
			Event.pub('kitchen_prompt', text + '人数不够，需要进行招募啊。', 'once')
			if (data.type == 'cook') {
				this.stillCook.push(data)
			} else {
				this.stillWait.push(data)
			}
		}
		
	}

	statusChange (staff) {

		let data
		if (this.stillWait.length > 0 && staff.type == 'waiter') {
			data = this.stillWait.shift()
		} else if (this.stillCook.length > 0 && staff.type == 'chef') {
			data = this.stillCook.shift()
		} else {
			return
		}
		Event.pub(data.type, data, 'once')
	}

	statistic (money) {
		this.money += money
		Event.pub('kitchen_refresh', this, 'once')
	}
}

class RestaurantFactory {
	constructor () {}

	static instance(option) {
		// 设置时间单位
		option.timeUnit = 2
		
		switch (option.type) {
			case 'restaurant':
				return new Restaurant(option)
			case 'customer':
				return new Customer(option)
			case 'chef':
				return new Chef(option)
			case 'waiter':
				return new Waiter(option)
			case 'cuisine':
				return new Cuisine(option)
		}
	}
}