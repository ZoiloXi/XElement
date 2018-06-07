// 定义服务员类
function Waiter(option) {
	Staff.call(this, option)
}
Waiter.prototype = Object.create(Staff.prototype)
Waiter.prototype.constructor = Waiter

Waiter.prototype.serve = function (data) {
	data.staff = this
	
	this.busy()

	this.showMenu(data)
}
Waiter.prototype.showMenu = function (data) {
	// 接受业务了，此时本服务员繁忙
	this.busy()

	var self = this
	var cuisines = data.restaurant.cuisines
	// 生成选择提示语
	var prompt = utils.dom(this, '<span class="stress">' + data.customer.name +'</span>您好，您想吃点什么？下面是我们的菜单哦。', 'rest')

	// 生成菜单让客户选择
	var select = document.createElement('div'),
		options = "<select name='cuisines' class='cuisines-select' multiple>"	//<option value='select'>请选择</option>

	select.setAttribute('class', 'cuisines')
	cuisines.forEach(function(item) {
		options += "<option value='" + item.name + "'>"+ item.name + "</option>"
	})
	options += "</select>"

	select.innerHTML += options + "<button class='confirm'>点菜</button>"

	// contentBox.add(prompt)
	// contentBox.add(select)
	Event.pub('addContent', prompt, 'once')
	Event.pub('addContent', select, 'once')


	var confirmBtn = select.querySelector('.confirm')
	
	confirmBtn.onclick = function (e) {
		var selected = select.querySelector('select.cuisines-select')
		var result = []

		selected = Array.from(selected.selectedOptions)
							.map((sel) => sel.value)

		 result = cuisines.filter(function (item) {
			return selected.indexOf(item.name) > -1
		})

		if (result.length > 0) {
			select.parentNode.removeChild(select)
			
			data.customer.ordered = result

			self.order({
				restaurant: data.restaurant,
				customer: data.customer,
				type: 'order',
				selected: result,
				staff: self
			})
		}
	}
}
Waiter.prototype.order = function (data) {
	var cuisines = data.selected
	var text = utils.dom(this, '您<span class="stress">('+ data.customer.name + ')</span> 点了：' + cuisines.map((cuisine) => cuisine.name).join(', ') + ', 请稍等。', 'rest')
	// contentBox.add(text)
	Event.pub('addContent', text, 'once')
	data.type = 'cook'
	data.staff = this
	this.free()

	Event.pub('cook', data, 'once')
}
Waiter.prototype.dishup = function (data) {
	this.busy()
	var self = this,
		text = '';

	text = utils.dom(this, '好啦,晓得啦。别喊啦！', 'restuarant')
	// contentBox.add(text)
	Event.pub('addCanteen', text, 'once')

	setTimeout(function() {
		text = utils.dom(self, '<span class="stress">' + data.customer.name + '</span>'+ '这是您的晚餐, 请慢用。辣子可以自己加的哦。', 'rest')
		// contentBox.add(text)
		Event.pub('addContent', text, 'once')


		data.type = 'eat'
		data.staff = self

		self.free()
		// Event.pub('eat', data, 'once')
		data.customer.eat(data)
	}, 400)
}

Waiter.prototype.pay = function (data) {

	var self = this
	var text = utils.dom(this, '来勒来勒，客官等等俺.', 'rest');

	Event.pub('addContent', text, 'once')

	setTimeout(function(text) {

		var total = data.selected.map(cuisine => cuisine.price),
			int = 0,
			digit = 0;

		total = [...total].reduce((pre, next) => pre + next)
		int = Math.floor(total)
		digit = total - int

		data.price = int

		text = utils.dom(self, '一共是' + total + '块, 你长得帅，零头妹妹就帮你免了啊，记得下次再来呀。', 'rest')

		if (data.customer.name != 'Baidu') text = utils.dom(self, '一共是' + total + '块, 你长得不帅，不免！', 'rest')

		Event.pub('addContent', text, 'once')

		self.free()
		
		Event.pub('transaction', data, 'once')

	}(text), 1000)
}