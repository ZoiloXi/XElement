class Restaurant {
	constructor (option) {
		this.name = option.name
		this.money = option.money
		this.type = option.type || 'restaurant'
		this.seats = option.seats
		this.staffs = []
		this.waiters = []
		this.chefs = []
		this.cuisines = []
		this.available = this.seats
		this.quene = []
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

		staff =	staffs.filter(staff => {
			return staff.getStatus() == 'free'
		})

		return staff[Math.floor(Math.random() * staffs.length)]
	}

	welcome (data, render) {
		if (this.available == 0) {
			this.quene.push(data)
		}
		this.available -= 1
		
		data.restaurant = this
		
		data.staff = this.isRandomFree('waiter')
		data.staff.setStatus('busy')
		render.kitchen.refresh(data.staff)

		return new Promise((resolve, reject) => {
			// 服务员走过去
			render.canteen.move({
				path: 'M 600,10 L 300,550',
				dur: 4 + 's',
				fill: 'freeze'
			}, data.staff.name, 'waiter')

			setTimeout(() => {
				resolve(data)
			}, 4000)
		})
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