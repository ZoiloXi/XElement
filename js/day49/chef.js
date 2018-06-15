class Chef extends Staff {
	constructor (option) {
		super(option)
	}

	cook (data) {
		let self = this
		// 改变工作状态
		self.setStatus('busy')
		data.staff.setStatus('free')
		// log(data.staff)
		// 刷新可视化表格中的工作状态
		Event.pub('kitchen_refresh', data.staff, 'once')
		Event.pub('kitchen_refresh', self, 'once')

		// 重置当前工作职工
		data.staff = self

		let cuisines = data.restaurant.cuisines.filter(c => data.cuisines.indexOf(c.name) > -1),
			len = cuisines.length,
			current = 0,
			cooking = cuisines[current],
			remaining = cuisines.slice(current + 1)
			log(cuisines, cooking, remaining)

		// log('cook', data)
		let timer = setInterval(() => {
			if (cooking.remainTime == 0) {
				current++

				if (current == len) {
					clearInterval(timer)

					data.type = 'dishup'
					Event.pub('dishup', data, 'once')
					return
				}

				cooking = cuisines[current]
				remaining = cuisines.slice(current+1)
			}
			cooking.remainTime = cooking.remainTime ? --cooking.remainTime : cooking.time

			this.cooking = cooking
			this.remaining = remaining

			Event.pub('canteen_refresh', [data.customer.name, cooking, 'dishup'], 'once')
			
			Event.pub('kitchen_refresh', self, 'once')
		}, 1000)
	}
}