// 定义职工类
function Staff(option) {
	this.ID = null
	this.name = option.name
	this.salary = option.salary
	this.status = 'free'	// 'busy'
	this.type = option.type

	this.new()
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
Staff.prototype.start = function () {
	this.status = 'free'
}
Staff.prototype.busy = function () {
	this.status = 'busy'
}
Staff.prototype.new = function () {
	contentBox.add('This is our ' + this.type + ', ' + this.name + ', welcome~~~~~')
}