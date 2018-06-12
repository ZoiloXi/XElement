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
		return new Promise((resolve, reject) => {
			resolve(data)
		})
	}

	order (data, render) {
		
		return new Promise((resolve, reject) => {

			// 更新时间
			let counts = 10
			let timer = setInterval(() => {
				if (counts == 0) {
					clearInterval(timer)
					render.canteen.dialog(data.customer.name, '点菜超时，默认全部点菜', 'waiter')
					render.canteen.showPanel(data.customer.name, 'dishup')

					data.cuisines = data.restaurant.cuisines.map(c => c.name)

					resolve(data)
				}

				render.canteen.refresh(data.customer.name, counts + 's', 'time')
				
				counts--
			}, 1000)

			render.canteen.addEvent({
				resolve: resolve,
				data: data,
				timer: timer
			})
		})
	}

	eat (data, render) {
		let desk = render.canteen.data.map((d,index) => {
				if (d.customer == data.customer.name) {
					return render.canteen.desks[index]
				}
			})[0],
			cuisinesDom = data.cuisines.map(c => {
				return desk.querySelector(`.js-${c}-progress`)
			}),
			price = data.restaurant.cuisines
					.filter(c => data.cuisines.indexOf(c.name) > -1)
					.map(c => c.price)
					.reduce((pre,next) => pre + next)
			log(price)
		let current = 0
		let timer = setInterval(() => {
			if (current == 6) {
				cuisinesDom.forEach(c => {
					c.innerText = '吃完啦。'
					c.style.background = ''
				})
				render.canteen.dialog(data.customer.name, '结账。', 'customer')
				render.canteen.dialog(data.customer.name, `一共是${price}元.下次再来哦。`, 'waiter')
				clearInterval(timer)
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