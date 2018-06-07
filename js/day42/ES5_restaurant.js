// 定义餐馆类
function Restaurant(option) {
	this.name = option.name
	this.money = option.money
	this.seats = option.seats
	this.staffs = []
	this.waiters = []
	this.chefs = []
	this.cuisines = []
	this.available = this.seats
	this.waiting = []
}
// 雇佣职员
Restaurant.prototype.hire = function (staffs) {
	if (!Array.isArray(staffs)) staffs = [staffs]

	this.staffs = this.staffs.concat(staffs)

	staffs.forEach((staff) => {
		if (staff.constructor == Chef) {
			this.chefs.push(staff)
			staff.setID(this.chefs.length-1)
		} else if (staff.constructor == Waiter) {
			this.waiters.push(staff)
			staff.setID(this.waiters.length-1)
		}

		staff.new()

		this.money -= staff.salary
	})
	return this
}
// 开发菜系
Restaurant.prototype.menu = function (menu) {
	if (!Array.isArray(menu)) menu = [menu]
	this.cuisines = this.cuisines.concat(menu)

	return this
}
// 开除职员
Restaurant.prototype.fire = function (staff) {
	this.staffs.splice(this.staffs.indexOf(staff),1)

	return this
}
// 开始营业, 负责事件调度
Restaurant.prototype.opening = function () {
	var self = this
	// 各个职工开始工作,设置工作状态为空闲，为响应业务做准备；busy表明正在执行业务
	self.staffs.forEach((staff) => {
		staff.free()
	})

	// 开始监听各种事件
	var evtTypes = ['hello',
					'serve',
					'order',
					'cook',
					'dishup',
					'eatcomplete',
					'pay',
					'transaction',
					'wait']

	for (var i = 0, len = evtTypes.length; i < len; i++) {
		var type = evtTypes[i]
		//绑定事件,形如 Event.sub('transaction', self.transaction.bind(self))
		// Event.sub(evtTypes[i], self[evtTypes[i]].bind(self))
		if (['serve', 'order', 'dishup','pay', 'cook', 'dishup', 'eatcomplete'].indexOf(type) > -1) {
			Event.sub(type, this.dispath.bind(this))
		} else {
			Event.sub(type, this[type].bind(this))
		}
	}

	return this
}
// 招呼进店的客人
Restaurant.prototype.hello = function (data) {
	if (this.available == 0) {
		this.waiting.push(data.customer)
		Event.pub('wait')
		return
	}

	data = {
		restaurant:  this,
		customer: data.customer,
		type: 'serve'
	}

	this.available -= 1

	Event.pub('serve', data, 'once')

	return this
}
// 事件调度函数,根据不同事件类型判断给服务员还是厨师
Restaurant.prototype.dispath = function (data) {
	var customer = data.customer,
		staff = null,
		staffs = [],
		text

	if (['serve', 'order', 'dishup','pay'].indexOf(data.type) > -1) {
		staffs = this.waiters
		text = '服务员'
	} else if (data.type == 'cook') {
		staffs = this.chefs
		text = '厨师'
	}

	for (var i = 0; i < staffs.length; i++) {
		if (staffs[i].status == 'free') {
			staff = staffs[i]
			break
		}
	}

	if (staff) {
		staff.busy()
		staff[data.type](data)
	} else {
		log(text + '人数不够，需要进行招募啊。', data)
		// utils.modal(text + '人数不够，需要进行招募啊。')
		this.waiting.push(customer)
	}
}

// 完成一次交易
Restaurant.prototype.transaction = function (data) {
	var cuisines = data.selected
	cuisines.forEach((cuisine) => {
		this.money += cuisine.price - cuisine.cost
	})

	Event.pub('addCanteen', utils.dom(this, 'yahoo，赚钱了啊', 'restaurant'), 'once')

	// 完成一次交易，表明空余一张桌子
	if (this.waiting.length > 0) {
		Event.pub('serve', {
			restaurant: this,
			customer: this.waiting.shift()
		})
	} else {
		this.available += 1
	}

	return this
}

Restaurant.prototype.wait = function (data) {
	log('waiting 响应')
	return this
}