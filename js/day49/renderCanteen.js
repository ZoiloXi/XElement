class RenderCanteen {
	constructor (container) {
		this.container = container
		this.desks = []
		this.data = []
		this.default = {			
			vegetable: 12,
			fish: 24,
			noodle: 14,
			chicken: 30,
		}
		this.cuisines = {}
		// this.init()
	}

	init (data) {
		this.deskNode = this.container.querySelector('.desk')
		this.desks.push(this.deskNode)

		this.data.push(Object.assign({}, this.default, {
			time: '计时',
			waiter: data.staff.name,
			customer: data.customer.name,
			cuisines: data.restaurant.cuisines
		}))

		this.showDesk(this.data[0])
	}

	addEvent (obj) {
		this.desks.forEach(desk => {
			// 对每个desk的点餐面板建立事件
			let orderPanel = desk.querySelector('.js-d-order'),
				ordered = desk.querySelector('.js-d-ordered'),
				cuisines = []

			orderPanel.addEventListener('click', (e) => {
				let t = e.target

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
						cuisines = cuisines.filter(c => {
							return !(c == t.alt)
						})
						t.parentNode.removeChild(t)
					}

				} else if (t.tagName == 'BUTTON') {
					// 提交点餐
					let imgs = ordered.querySelectorAll('.d-ordered-img'),
						customer = desk.querySelector('.js-name').innerText

					cuisines = Array.from(imgs).map(img => {
						return img.alt
					})

					this.cuisines[customer] = cuisines

					// 生成对话
					this.dialog(customer, '我点这些：' + cuisines.join(',') + '.', 'customer')
					
					// 隐藏点菜框，显示点了哪些菜
					this.showPanel(customer, 'dishup')
					this.addCuisine(customer, cuisines)

					// 变更data，进行传递
					obj.data.cuisines = cuisines
					obj.resolve(obj.data)
					clearInterval(obj.timer)
				}
			})
		})
	}

	addDesk () {
		let newdesk = this.deskNode.cloneNode(true)

		this.container.appendChild(newdesk)
		this.desks.push(newdesk)

		(newdesk.classList.has('css_hide') 
			|| newdesk.style.display == 'none')
			&& newdesk.classList.add('css_show') 
	}

	showDesk (data) {
		this.desks.forEach(desk => {
			let innerHtml = desk.innerHTML

			// 把原始的"￥{{vegetable}}元/份" 替换成数字
			Object.keys(data)
				.forEach(key => {
					var reg = new RegExp('\{\{'+key+'\}\}', 'g');
					innerHtml = innerHtml.replace(reg, data[key]);
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
		})
	}

	showPanel (customer, type) {
		this.data.forEach((d, index) => {
			if (d.customer == customer) {
				let desk = this.desks[index],
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
		})
	}

	addCuisine (customer, cuisines) {
		this.data.forEach((d, index) => {
			if (d.customer != customer) return
			let dishupPanel = this.desks[index].querySelector('.js-d-dishup')
			let htmlStr = ''

			htmlStr = cuisines.map(c => {
				return `<li>
							<img class="d-cuisine-item" src="./images/${c}.png"/>
							<span class="js-${c}-progress">烹饪中...</span>
						</li>`
			}).join('')

			dishupPanel.innerHTML = `<ul>${htmlStr}</ul>`
		})
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

	refresh (customer, obj, type) {
		this.data.forEach((d, index) => {
			if (d.customer != customer) return

			switch (type) {
				case 'time':
					let time = this.desks[index].querySelector('.js-time')
					time.innerText = obj
					break
				case 'dishup':
					let dishup = this.desks[index].querySelector('.js-d-dishup'),
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
		})
	}

	/* 渲染对话，添加至餐桌上的对话框
	 *	@customer {object} 顾客对象,以确定添加到对应的餐桌
	 *  @text {String} 对话内容
	 *  @type {String} 当前对话者, waiter or customer
	*/
	dialog(customer, text, type) {

		this.data.forEach((d,index) => {

			if (d.customer == customer) {
				let dialog = this.desks[index].querySelector('.js-d-dialog')
				
				let textdom = document.createElement('p'),
					clazz = type == 'waiter' ? 'd-dialog-waiter' : 'd-dialog-customer',
					iclazz = type == 'waiter' ? 'fa-user-o' : 'fa-user'

				textdom.innerHTML = `<p class='${clazz}'><i class="fa ${iclazz}" aria-hidden="true"></i>：<br><span>${text}</span></p>`
				
				dialog.appendChild(textdom)
				dialog.scrollTop = dialog.scrollHeight

				return
			}
		})
	}


	move (property, name, type) {
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
}