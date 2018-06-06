// 定义顾客类
function Customer(option) {
	this.name = option.name
	this.ordered = []
}
Customer.prototype.order = function (data) {
	data.staff && (data.staff.status = 'free')

	var chosed = ['这个,', '那个,', ' ,还有内个'],
		cuisines = data.selected.map(cuisine => {
			return cuisine.name
		}),
		text = '我要' + chosed.slice(0, data.selected.length)+ '(' + cuisines.join(' ') + ')'
	contentBox.add(utils.dom(this, text, 'customer'))

	Event.pub('order', data, 'once')
	this.ordered = data.selected
}
Customer.prototype.eat = function () {
	console.log('The ' + this.ordered[0].name + ' are delicious, I like it.')
	Event.pub('pay', this.ordered[0], 'once')
	this.ordered = []
}
Customer.prototype.hello = function (contentBox, text) {
	var data = {
		customer: this
	}

	contentBox.add(utils.dom(this, text, 'customer'))
	Event.pub('hello', data, 'once')
}


// 定义菜品类
function Cuisine(option) {
	this.price = option.price
	this.cost = option.cost
	this.name = option.name
}