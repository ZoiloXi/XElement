// 定义服务员类
function Waiter(option) {
	Staff.call(this, option)
}
Waiter.prototype = Object.create(Staff.prototype)
Waiter.prototype.constructor = Waiter

Waiter.prototype.serve = function (data) {
	this.showMenu(data)
}
Waiter.prototype.showMenu = function (data) {
	// 接受业务了，此时本服务员繁忙
	var self = this
	var cuisines = data.restaurant.cuisines
	// 生成选择提示语
	var prompt = utils.dom(this, '<span class="stress">' + data.customer.name +'</span>您好，您想吃点什么？下面是我们的菜单哦。', 'rest')
	log(prompt)
	// 生成菜单让客户选择
	var select = document.createElement('div'),
		options = "<select name='cuisines' class='cuisines-select' multiple>"	//<option value='select'>请选择</option>

	select.setAttribute('class', 'cuisines')
	cuisines.forEach(function(item) {
		options += "<option value='" + item.name + "'>"+ item.name + "</option>"
	})
	options += "</select>"

	select.innerHTML += options + "<button class='confirm'>点菜</button>"

	contentBox.add(prompt)
	contentBox.add(select)


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
			
			data.customer.order({
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
	contentBox.add(text)
	data.type = 'cook'
	data.staff = this
	Event.pub('cook', data, 'once')
}
Waiter.prototype.dishup = function (data) {
	var self = this,
		text = ''

	text = utils.dom(this, '好啦,晓得啦。别喊啦！', 'rest')
	contentBox.add(text)

	setTimeout(function() {
		text = utils.dom(self, '<span class="stress">' + data.customer.name + '</span>'+ '这是您的晚餐, 请慢用。辣子可以自己加的哦。', 'rest')
		contentBox.add(text)
		Event.pub('eat', data.selected, 'once')
	}, 400)
}