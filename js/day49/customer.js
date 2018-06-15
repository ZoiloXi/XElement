class Customer {
	constructor (option) {
		this.name = option.name
		this.money = option.money
		this.type = option.type
		this.timeUnit = option.timeUnit
	}

	comein () {
		let data = {
			customer: this
		}
		data.type = 'welcome'
		Event.pub('welcome', data, 'once')
	}

	order (data) {
		clearInterval(data.timer)
		
		data.type = 'order'
		data.staff.order(data)
		// Event.pub('order', data, 'once')
	}

	eat (data) {
		let render = data.restaurant.render,
			desk = render.canteen.container.querySelector(`#customer_${data.customer.name}`),
			cuisinesDom = data.cuisines.map(c => desk.querySelector(`.js-${c}-progress`))

		let current = 0,
			eatingTime = 6	// 吃饭耗时
		let	timer = setInterval(() => {
			if (current == eatingTime) {
				cuisinesDom.forEach(c => {
					c.innerText = '吃完啦。'
					c.style.background = ''
				})

				clearInterval(timer)

				Event.pub('canteen_dialog', [data.customer, '结账。', 'customer'], 'once')
				data.type = 'pay'

				data.staff.pay(data)

				return
			}
			cuisinesDom.forEach(c => {
				c.innerText = '食用中.'
				c.style.background = `-webkit-linear-gradient(left, steelblue 0%, white ${current/6 * 100}%, white 100%)`
			})
			current++
		}, 1000)
	}
}