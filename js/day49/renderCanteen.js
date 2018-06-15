// requires utils.js Event

class RenderCanteen {
	constructor (container, seats) {
		this.container = container
		this.seats = seats
		this.desks = []
		// this.data = []
		this.default = {			
			vegetable: 12,
			fish: 24,
			noodle: 14,
			chicken: 30,
		}
		this.cuisines = {}

		// every possible point for waiter to move
		this.waiterPath = {
			in: '255,550',
			desk1: '255,130',
			desk2: '555,130',
			desk3: '255,430',
			desk4: '555,430',
			start: '600, 50'
		}

		// every possible point for waiter to move
		this.customerPath = {
			in: '255,550',
			desk1: '130,20',
			desk2: '430,20',
			desk3: '130,320',
			desk4: '430,320'
		}

		this.evtTypes = [
			'canteen_init',
			'canteen_dialog',
			'canteen_showPanel',
			'canteen_addCuisine',
			'canteen_refresh',
			'canteen_move',
			'canteen_destroy'
		]

		this.evtTypes.forEach(type => {
			let handler = type.slice('canteen_'.length)
			Event.sub(type, this[handler].bind(this))
		})

		this.deskNode = this.container.querySelector('.desk')
		this.deskNode.setAttribute('data-isFree', 'free')

		this.container.removeChild(this.deskNode)

		for (let i = 0; i < this.seats; i++) {
			this.addDesk()
		}
	}

	init (data) {
		// this.addDesk(data)
		this.showDesk(data)
		this.addEvent(data)
	}

	addEvent (data) {
		let desk = this.container.querySelector(`#customer_${data.customer.name}`),
			orderPanel = desk.querySelector('.js-d-order'),
			ordered = desk.querySelector('.js-d-ordered'),
			cuisines = []

		orderPanel.addEventListener('click', (e) => {
			let t = e.target
			
			// 进行点菜中
			if (t.tagName == 'IMG') {
				// 如果是img的话,区分是在li中,还是在已点餐的div中
				if (t.parentNode.tagName == 'LI') {
					// 在li中，表明是点这个菜
					let node = t.cloneNode()	// 只是拷贝图片元素,没必要深度拷贝；所以下面更改元素的类以匹配样式

					if (cuisines.indexOf(node.alt) > -1) return

					node.classList.add('d-ordered-img')	// 添加类，显示样式
					node.classList.add('css_fl')	// 同上
					node.classList.remove('d-cuisine-item')	// 同上
					ordered.appendChild(node)
					cuisines.push(node.alt)

				} else {
					// 在已点餐的div中,去掉这个菜
					cuisines = cuisines.filter(c => !(c == t.alt))
					t.parentNode.removeChild(t)
				}

			// 提交点餐
			} else if (t.tagName == 'BUTTON') {
				let imgs = ordered.querySelectorAll('.d-ordered-img')

				if (imgs.length == 0) return

				// 获取已经点了哪些菜
				cuisines = Array.from(imgs).map(img => img.alt)

				// 存储在对应的点菜位置
				this.cuisines[data.customer.name] = cuisines

				// 生成对话
				this.dialog([data.customer, '我点这些：' + cuisines.join(',') + '.', 'customer'])
				
				// 隐藏点菜框，显示点了哪些菜
				this.showPanel([data.customer, 'dishup'])
				this.addCuisine([data.customer.name, cuisines])

				// 变更data，进行传递
				data.cuisines = cuisines
				data.customer.order(data)
			}
		})
	}

	addDesk () {
		let newdesk = this.deskNode.cloneNode(true)
		newdesk.setAttribute('data-isFree', 'free')

		// newdesk.setAttribute('id', `customer_${data.customer.name}`)
		this.container.appendChild(newdesk)

		this.desks.push(newdesk);
	}

	showDesk (data) {
		let desk = this.desks.filter(d => d.getAttribute('data-isFree') == 'free')[0]
		desk.setAttribute('id', `customer_${data.customer.name}`)
		desk.setAttribute('data-isFree', 'busy')

		let innerHtml = desk.innerHTML

		data = Object.assign({}, this.default, {
			time: '计时',
			waiter: data.staff.name,
			customer: data.customer,
			cuisines: data.restaurant.cuisines
		})

		// 把原始的"￥{{vegetable}}元/份" 替换成数字
		Object.keys(data)
			.forEach(key => {
				let reg = new RegExp('\{\{'+key+'\}\}', 'g')
				innerHtml = innerHtml.replace(reg, key == 'customer' ? data[key].name : data[key]);
			});

		desk.innerHTML = innerHtml

		// 去除多余的菜系
		let cuisines = desk.querySelectorAll('.d-cuisine-item'),
			defaultCuisines = data.cuisines.map(c => c.name);

			cuisines.forEach(c => {
				if (defaultCuisines.indexOf(c.alt) == -1) {
					c.parentNode.parentNode.removeChild(c.parentNode)
				}
			})

		this.toggle(desk)
	}

	showPanel ([customer, type]) {
		let desk = this.container.querySelector(`#customer_${customer.name}`),
			order = desk.querySelector('.js-d-ordered'),
			cuisine = desk.querySelector('.js-d-cuisine'),
			dishup = desk.querySelector('.js-d-dishup')

		if (type == 'order'){
			this.toggle(order)
			this.toggle(cuisine)
		} else if (type == 'dishup') {		
			this.toggle(order.parentNode)
			this.toggle(dishup)
		}
	}

	addCuisine ([customer, cuisines]) {
		// this.data.forEach((d, index) => {
			// if (d.customer != customer) return
			let desk = this.container.querySelector(`#customer_${customer}`)
			let dishupPanel = desk.querySelector('.js-d-dishup')
			let htmlStr = ''

			htmlStr = cuisines.map(c => {
				return `<li>
							<img class="d-cuisine-item" src="./images/${c}.png"/>
							<span class="js-${c}-progress">烹饪中...</span>
						</li>`
			}).join('')

			dishupPanel.innerHTML = `<ul>${htmlStr}</ul>`
		// })
	}

	toggle (ele) {
		if (ele.classList.contains('css_hide')) {
			ele.classList.remove('css_hide')
			ele.classList.add('css_show')
		} else {
			ele.classList.add('css_hide')
			ele.classList.remove('css_show')
		}
	}

	refresh ([customer, obj, type]) {
		let desk = this.container.querySelector(`#customer_${customer}`)

		switch (type) {
			case 'time':
				let time = desk.querySelector('.js-time')
				time.innerText = obj
				break
			case 'dishup':
				let dishup = desk.querySelector('.js-d-dishup'),
					cuisine = dishup.querySelector(`.js-${obj.name}-progress`)

				if (!cuisine) break

				cuisine.classList.add('d-dishup-progress')

				// 以渐变色的完全由部分蓝色变为全蓝表示进度条
				cuisine.style.background = `-webkit-linear-gradient(left, steelblue 0%, white ${100 - obj.remainTime / obj.time * 100}%, white 100%)`
				
				if (obj.remainTime == 0) {
					cuisine.style.background = ''
					cuisine.classList.remove('d-dishup-progress')
					cuisine.innerText = '等待上菜'
				}
				break
		}
		return
		// })
	}

	/* 渲染对话，添加至餐桌上的对话框
	 *	@customer {object} 顾客对象,以确定添加到对应的餐桌
	 *  @text {String} 对话内容
	 *  @type {String} 当前对话者, waiter or customer
	*/
	dialog([customer, text, type]) {
		let desk = this.container.querySelector(`#customer_${customer.name}`)
		let dialog = desk.querySelector('.js-d-dialog')
		
		let textdom = document.createElement('p'),
			clazz = type == 'waiter' ? 'd-dialog-waiter' : 'd-dialog-customer',
			iclazz = type == 'waiter' ? 'fa-user-o' : 'fa-user'

		textdom.innerHTML = `<p class='${clazz}'><i class="fa ${iclazz}" aria-hidden="true"></i>：<br><span>${text}</span></p>`
		
		dialog.appendChild(textdom)
		dialog.scrollTop = dialog.scrollHeight

		return
	}

	/* 人员移动
	 *  @obj {Object} 移动对象，含生成移动的参数、对象、对象的姓名
	 *	@obj.property {object} animateMotion参数对象
	 *  @obj.name {String} 移动人员的姓名
	 *  @obj.type {String} 当前移动人员类型, waiter or customer
	*/
	move (obj) {
		let { property, name, type } = obj
		let g = document.querySelector('#svg_image_' + name),
			animate = utils.svg('animateMotion', property),
			text = utils.svg('text'),
			svg = utils.svg('svg', {
				id: 'svg_' + name,
				width: '1200',
				height: '600',
				x: 0,
				y: 0
			})

		// 如果g存在,就表明已经存在；为了使动画有效，需要删除svg重新画
		if (g) {
			g.parentNode.remove()
		}
		
		document.body.appendChild(svg)

		g = `<g id='svg_image_${name}'><image width='40' height='40' preserveAspectRatio='none meet' xlink:href="./images/${type}.png"></g>`
		
		text.innerHTML = name
		
		svg.innerHTML = g
		g = document.querySelector('#svg_image_' + name)
		g.appendChild(text)
		g.appendChild(animate)

		return g
	}

	/* 获取正确的路径，暂时假设有四个桌子可供食客使用
	 *	@customer {String} 顾客对象的名字,以确定添加到对应的餐桌
	 *  @pathType {String} 移动的类型,顾客分为comein(进店)和其他(离店); 服务员分去引座、引进店、上菜和去添加菜单
	 *  @pathType:   comein or not (customer); usher, comein, back, dishup (waiter)
	 *  @isCustomer {Boolean} 为真时，获取顾客的路径
	*/
	getPath (customer, pathType, isCustomer) {
		let desk = this.container.querySelector(`#customer_${customer}`),
			id = this.desks.indexOf(desk) + 1

		if (isCustomer) {
			return pathType == 'comein' 
				? `M ${this.customerPath.in} L ${this.customerPath['desk' + id]}`
				: `M ${this.customerPath['desk' + id]} L ${this.customerPath.in}`
		} else {
			switch (pathType) {
				case 'usher':
					return `M ${this.waiterPath.start} L ${this.waiterPath.in}`
				case 'comein':
					return `M ${this.waiterPath.in} L ${this.waiterPath['desk' + id]}`
				case 'back':
					return `M ${this.waiterPath['desk' + id]} L ${this.waiterPath.start}`
				case 'dishup':
					return `M ${this.waiterPath.start} L ${this.waiterPath['desk' + id]}`
			}
		}
	}

	destroy (name) {
		let item = this.container.querySelector(`#customer_${name}`)

		if (item) {
			item.innerHTML = this.deskNode.innerHTML
			item.removeAttribute('id')
			item.setAttribute('data-isFree', 'free')

			this.toggle(item)
			document.body.removeChild(document.querySelector(`#svg_${name}`))
			
		} else if (document.querySelector(`#svg_${name}`)) {
			document.body.removeChild(document.querySelector(`#svg_${name}`))
		}
	}
}