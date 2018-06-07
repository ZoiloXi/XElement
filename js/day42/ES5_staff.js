// 定义职工类
function Staff(option) {
	this.ID = null
	this.name = option.name
	this.salary = option.salary
	this.status = 'free'	// 'busy'
	this.type = option.type
}

Staff.prototype.setID = function (id) {
	this.ID = id
}
Staff.prototype.toString = function () {
	return this.type.toLowerCase()
}
Staff.prototype.work = function () {
	console.log('I have done my jobs')
}
Staff.prototype.free = function () {
	this.status = 'free'
}
Staff.prototype.busy = function () {
	this.status = 'busy'
}
Staff.prototype.new = function () {
	var text = 'This is our ' + this.type + ', ' + this.name + ', welcome~~~~~';
	Event.pub('addCanteen', text, 'once')
	// contentBox.add()
}