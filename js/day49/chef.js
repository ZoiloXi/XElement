class Chef extends Staff {
	constructor (option) {
		super(option)
	}

	cook (data, render) {
		let self = this
		self.setStatus('busy')
		data.staff.setStatus('free')

		render.kitchen.refresh(data.staff)
		render.kitchen.refresh(self)

		data.staff = self

		return new Promise((resolve, reject) => {
			let cuisines = data.restaurant.cuisines.filter(c => {
				return data.cuisines.indexOf(c.name) > -1
			}),
				len = cuisines.length,
				current = 0,
				cooking = cuisines[current],
				remaining = cuisines.slice(current + 1)
			
			let timer = setInterval(() => {
				if (cooking.remainTime == 0) {
					current++

					if (current == len) {
						clearInterval(timer)
						resolve(data)
						return
					}

					cooking = cuisines[current]
					remaining = cuisines.slice(current+1)
				}
				cooking.remainTime = cooking.remainTime ? --cooking.remainTime : cooking.time

				this.cooking = cooking
				this.remaining = remaining
				
				render.canteen.refresh(data.customer.name, cooking, 'dishup')
				render.kitchen.refresh(this)
			}, 1000)
		})
	}
}