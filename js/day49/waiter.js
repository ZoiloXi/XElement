class Waiter extends Staff {
	constructor (option) {
		super(option)
	}

	usher (data) {
		this.setStatus('busy')

		let render = data.restaurant.render,
			waiterPath = render.canteen.getPath(data.customer.name, 'usher')

		Event.pub('canteen_move', {
			property: {
				path: waiterPath,
				dur: '3s',
				calcMode: 'linear',
				fill: 'freeze'
			},
			name: this.name,
			type: 'waiter'
		}, 'once')

		setTimeout(() => {
			data.staff = this
			data.type = 'serve'
			this.serve(data)
		}, 3000)
	}

	serve (data) {
		// 忙于工作
		// data.staff.setStatus('free')
		this.setStatus('busy')
		data.staff = this

		// 显示桌面
		Event.pub('canteen_init', data, 'once')

		// 服务员把顾客引入座位
		let render = data.restaurant.render,
			waiterPath = render.canteen.getPath(data.customer.name, 'comein'),
			customerPath = render.canteen.getPath(data.customer.name, 'comein', true)
		Event.pub('canteen_move', {
			property: {
				path: waiterPath,
				dur: 4.2 + 's',
				calcMode: 'linear',
				fill: 'freeze'
			},
			name: this.name,
			type: 'waiter'
		}, 'once')

		log(data.customer.name)
		Event.pub('canteen_move', {
			property: {
				path: customerPath,
				dur: 6 + 's',
				fill: 'freeze',
				calcMode: 'linear'
			}, 
			name: data.customer.name,
			type: 'customer'
		}, 'once')

		setTimeout(() => {
			let counts = 20
			data.timer = setInterval(() => {
				if (counts == 0) {
					
					Event.pub(
						'canteen_dialog',
						[data.customer, '点菜超时，默认全部点菜', 'waiter'],
						'once'
					)

					data.cuisines = data.restaurant.cuisines.map(c => c.name)
					
					clearInterval(data.timer)
					delete data.timer

					// 显示已经点好的菜
					Event.pub('canteen_showPanel', [data.customer, 'dishup'], 'once')
					Event.pub('canteen_addCuisine', [data.customer.name, data.cuisines], 'once')
					
					data.type = 'order'
					data.staff.order(data)
					
					return
				}

				Event.pub(
					'canteen_refresh',
					[data.customer.name, counts + 's', 'time'],
					'once'
				)
				
				counts--
			}, 1000)

			Event.pub('canteen_dialog', [data.customer, '请点击图片开始点菜哦', 'waiter'], 'once')
			Event.pub('canteen_showPanel', [data.customer, 'order'], 'once')

		}, 6.25* 1000)
	}

	order (data) {
		// // 该事件传递至当前服务员，其变得繁忙; 上一个员工变得清闲
		// // 先设置上一个的，因为可能员工没有发生改变，所以后设置当前员工
		// // data.staff.setStatus('free')
		// this.setStatus('busy')
		
		data.staff = this

		Event.pub('canteen_dialog', [data.customer, '好的，请稍等哦。', 'waiter'], 'once')
		log(data.customer.name)
		let render = data.restaurant.render,
			waiterPath = render.canteen.getPath(data.customer.name, 'back')
		Event.pub('canteen_move', {
			property:{
				path: waiterPath,
				dur: 4 + 's',
				fill: 'freeze'
			},
			name: this.name,
			type: 'waiter'
		}, 'once')

		setTimeout(() => {
			this.setStatus('free')
			data.type = 'cook'
			Event.pub('cook', data, 'once')
			Event.pub('kitchen_dialog', data, 'once')
		}, 4 * 1000)	// this time equals to the move dur == 4s
	}

	dishup (data) {
		// 该事件传递至当前服务员，其变得繁忙; 上一个员工变得清闲
		data.staff.setStatus('free')
		this.setStatus('busy')
		data.staff = this

		let render = data.restaurant.render,
			waiterPath = render.canteen.getPath(data.customer.name, 'dishup')
		Event.pub('canteen_move',{
			property: {
				path: waiterPath,
				dur: 3 + 's',
				fill: 'freeze'
			}, 
			name: this.name, 
			type: 'waiter'
		}, 'once')

		setTimeout(() => {
			Event.pub('canteen_dialog', [data.customer, '您的菜好了,慢用！', 'waiter'], 'once')
			data.customer.eat(data)
		}, 3 * 1000)
	}

	pay (data) {
		let price = data.restaurant.cuisines
					.filter(c => data.cuisines.indexOf(c.name) > -1)
					.map(c => c.price)
					.reduce((pre,next) => pre + next)

		Event.pub(
			'canteen_dialog',
			[data.customer, `您好一共是${price}元.`, 'waiter'],
			'once'
		)

		let render = data.restaurant.render,
			waiterPath = render.canteen.getPath(data.customer.name, 'back'),
			customerPath = render.canteen.getPath(data.customer.name, 'out', 'true')
		// 客人离场
		Event.pub('canteen_move', {
			property: {
				path: customerPath,
				dur: 6.75 + 's',
				fill: 'freeze',
				calcMode: 'linear'
			}, 
			name: data.customer.name,
			type: 'customer'
		}, 'once')
		// 服务员回到后厨
		Event.pub('canteen_move', {
			property:{
				path: waiterPath,
				dur: 4 + 's',
				fill: 'freeze'
			},
			name: this.name, 
			type: 'waiter'
		}, 'once')

		// 销毁桌子, 服务员变为空闲
		setTimeout(() => {
			Event.pub('canteen_destroy', data.customer.name, 'once')
			data.staff.setStatus('free')
			Event.pub('statistic', price, 'once')
		}, 6.75 * 1000)
	}
}