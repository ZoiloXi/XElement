// 定义顾客类
function Customer(option) {
	this.name = option.name
	this.ordered = []

	Event.sub('eat', this.eat.bind(this))
}
Customer.prototype.order = function (data) {
	data.staff && (data.staff.status = 'free')

	var chosed = ['这个,', '那个,', ' ,还有内个'],
		cuisines = data.selected.map(cuisine => {
			return cuisine.name
		}),
		text = '我要' + chosed.slice(0, data.selected.length)+ '(' + cuisines.join(' ') + ')'
	// contentBox.add(utils.dom(this, text, 'customer'))
	Event.pub('addContent', utils.dom(this, text, 'customer'), 'once')

	Event.pub('order', data, 'once')
	this.ordered = data.selected
}
Customer.prototype.eat = function (data) {
	var text = 'The ' + this.ordered.map(order => order.name).join(' ') + ' are delicious, I like it.';

	Event.pub('addContent', utils.dom(this, text, 'customer'), 'once');

	data.type = 'pay'
	data.customer = this
	data.staff = null

	text = this.name == 'Baidu' ? '结账结账！' : '快来结账啊。给少点波，我穷。'
	Event.pub('addContent', utils.dom(this, text, 'customer'), 'once')
	Event.pub('pay', data, 'once')

	this.ordered = []
}
Customer.prototype.hello = function (text) {
	var data = {
		customer: this
	}
	// contentBox.add(utils.dom(this, text, 'customer'))
	Event.pub('addContent', utils.dom(this, text, 'customer'), 'once')

	setTimeout(function() {
		Event.pub('hello', data, 'once')
	}, 1000);
}


// 定义菜品类
function Cuisine(option) {
	this.price = option.price
	this.cost = option.cost
	this.name = option.name
}