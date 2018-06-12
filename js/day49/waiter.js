class Waiter extends Staff {
	constructor (option) {
		super(option)
	}

	serve (data, render) {
		// 忙于工作
		this.setStatus('busy')

		data.staff = this

		render.kitchen.refresh(this)

		// data.staff.setStatus('free')
		// 注意,最开始的data由promise传进来时，data.staff = undefined

		return new Promise((resolve, reject) => {

			// 服务员走过去
			render.canteen.move({
				path: 'M 255,550 L 255,130',
				dur: 4.2 + 's',
				calcMode: 'linear',
				fill: 'freeze'
			}, this.name, 'waiter')

			render.canteen.move({
				path: 'M 255,550 L 255,130 L 130,20',
				dur: 6.75 + 's',
				fill: 'freeze',
				calcMode: 'linear'
			}, data.customer.name, 'customer')

			setTimeout(() => {
				render.canteen.dialog(data.customer.name, '请开始点菜哦', 'waiter')
				render.canteen.showPanel(data.customer.name, 'order')

				resolve(data)
			}, 6.75* 1000)
		})
	}

	order (data, render) {
		// 该事件传递至当前服务员，其变得繁忙; 上一个员工变得清闲
		// 先设置上一个的，因为可能员工没有发生改变，所以后设置当前员工
		data.staff.setStatus('free')
		this.setStatus('busy')

		render.kitchen.refresh(data.staff)
		render.kitchen.refresh(this)
		
		data.staff = this

		return new Promise((resolve, reject) => {
			render.canteen.dialog(data.customer.name, '好的，请稍等哦。', 'waiter')

			render.canteen.move({
				path: 'M 255,130 L 300,120 L 450,50 L 600,10',
				dur: 4 + 's',
				fill: 'freeze'
			}, this.name, 'waiter')

			setTimeout(() => {

				resolve(data)

			}, 4 * 1000)
		})
	}

	dishup (data, render) {
		// 该事件传递至当前服务员，其变得繁忙; 上一个员工变得清闲
		this.setStatus('busy')
		data.staff.setStatus('free')
		render.kitchen.refresh(this)

		return new Promise((resolve, reject) => {
			render.canteen.move({
				path: 'M 600,10 L 300,120 L 255,130',
				dur: 3 + 's',
				fill: 'freeze'
			}, this.name, 'waiter')

			setTimeout(() => {
				data.staff = this
				log(data)
				render.canteen.dialog(data.customer.name, '您的菜好了,慢用！', 'waiter')

				resolve(data)
			}, 3 * 1000)
		})
	}
}