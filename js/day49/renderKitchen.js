class RenderKitchen {
	constructor(container) {
		this.container = container

		this.evtTypes = [
			'kitchen_init',
			'kitchen_refresh',
			'kitchen_dialog',
			'kitchen_prompt',
		]

		this.evtTypes.forEach(type => {
			let handler = type.slice('kitchen_'.length)
			Event.sub(type, this[handler].bind(this))
		})

		// this.addEvent()
	}

	init (data) {
		if (data) {
			data.restaurant && (this.restaurant = data.restaurant)
			data.restaurant.render && (this.render = data.restaurant.render)
		}
		// main template, for every staff
		let mainTemplate = `<tr id='{{type}}_{{name}}'>`
						 + `<td><img src="./images/{{type}}.png"/></td>`
						 + 	`<td class='js-name'>{{name}}</td>`
						 + 	`<td class='js-status'>{{status}}</td>`
						 + 	`<td><span class='js-cooking-progress'>空</span></td>`
						 + 	`<td class='js-remain-progress'>空</td>`
						 +  `<td><button class='js-fire'>解雇</button></td>`
						 +  `</tr>`;

		let table = this.container.querySelector('table'),
			tpl = ''

		this.restaurant.staffs.forEach(staff => {
			let staff_tab = mainTemplate

			for (let key in staff) {
				staff_tab = staff_tab.replace(new RegExp(`{{${key}}}`, 'g'), staff[key])
			}

			tpl += staff_tab
		})

		table.querySelector('tbody').innerHTML = tpl
		table.querySelector('.js-cash').innerText = data.restaurant.money

		//不能在这里绑定,因为在招聘职员后，会使用本函数刷新整个table，那么就会绑定多次事件。
		// 解决办法：addEvent里面使用onclick函数，或者在类的构造函数里面进行绑定
		this.addEvent()
	}

	addEvent () {
		this.container.onclick = (e) => {
			let t = e.target

			if (t.tagName != 'BUTTON') return

			// 招聘职员
			if (t.classList.contains('js-k-hire')) {
				Array.from(t.parentNode.querySelectorAll('input[type="checkbox"]'))
					 .forEach(input => {
					 	if (input.checked) {
							let staff = RestaurantFactory.instance({
								name: utils.randomName(),
								salary: 4000,
								type: input.value,
							})
					 		Event.pub('hire', staff, 'once')
					 	}
					 })
			// 欢迎新客人
			} else if (t.classList.contains('js-k-welcome')) {
				let customer = RestaurantFactory.instance({
					name: utils.randomName(),
					money: 2000,
					type: 'customer'
				})
				// log(customer, 'ok')
				customer.comein()
			// 解雇职员
			} else if (t.classList.contains('js-fire')) {
				t = t.parentNode.parentNode
				let status = t.querySelector('.js-status').innerText,
					name = t.querySelector('.js-name').innerText

				if (status == 'busy') return
				Event.pub('fire', name, 'once')
			}
		}
	}

	refresh (staff) {
		// 如果staff的名字是餐厅的名字，表明更新的是现金流
		if (staff.name == this.restaurant.name) {
			this.restaurant = staff
			this.container.querySelector('.js-cash').innerText = staff.money
			return
		}
		let staffPanel = this.container.querySelector(`#${staff.type}_${staff.name}`),
			status = staffPanel.querySelector('.js-status'),
			cooking = null, remain = null

		status.innerText = staff.status

		if (staff.type == 'chef') {
			cooking = staffPanel.querySelector('.js-cooking-progress')
			remain = staffPanel.querySelector('.js-remain-progress')

			cooking.classList.add('k-cooking-progress')

			cooking.innerText = staff.cooking ? staff.cooking.name : '空'
			remain.innerText = staff.remaining ? staff.remaining.map(c => c.name).join(',') : '空'

			// 以渐变色的完全由部分蓝色变为全蓝表示进度条
			if (staff.cooking && staff.cooking.remainTime > 0) {
				cooking.style.background = `-webkit-linear-gradient(left, steelblue 0%, white ${100 - staff.cooking.remainTime / staff.cooking.time * 100}%, white 100%)`
			} else {
				cooking.style.background = ''
				cooking.innerText = '空'
				cooking.classList.remove('k-cooking-progress')
			}
		}

		Event.pub('statusChange', staff, 'once')
	}

	/* 渲染对话，添加至餐桌上的对话框
	 *	@customer {object} 顾客对象,以确定添加到对应的餐桌
	 *  @text {String} 对话内容
	 *  @type {String} 当前对话者, waiter or customer
	*/
	dialog(data) {
		let dialog = this.container.querySelector(`.js-k-dialog`),
			textdom = document.createElement('p')

		// textdom.innerHTML = `<p class='${clazz}'><i class="fa ${iclazz}" aria-hidden="true"></i>：<br><span>${text}</span></p>`
		textdom.innerHTML = `<p>顾客<span style="text-decoration: underline;">${data.customer.name}</span>点菜: ${data.cuisines.join(',')}</p>`
		dialog.appendChild(textdom)
		dialog.scrollTop = dialog.scrollHeight

		return
	}

	prompt (text) {
		let p = this.container.querySelector('p.js-k-prompt')

		p.innerText = text

		setTimeout(() => {
			if (this.restaurant.stillCook.length > 0 || this.restaurant.stillWait.length > 0) return
			p.innerText = '点击“欢迎客人”开始, 可同时服务多个客人'
		}, 2000)
	}
}