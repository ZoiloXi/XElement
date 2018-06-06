// 定义厨师类
function Chef(option) {
	Staff.call(this, option)
}
Chef.prototype = Object.create(Staff.prototype)
Chef.prototype.constructor = Chef
Chef.prototype.cook = function (data) {
	data.staff.status = 'free'

	var self = this
	var cuisines = data.selected,
		completed = 0

	for (var i = 0; i < cuisines.length; i++) {
		setTimeout(function (i) {
			return function () {
				var text = utils.dom(self, cuisines[i].name + '做完了, 服务员小妹!', 'rest')
				contentBox.add(text)

				completed += 1
				if (completed == cuisines.length) {
					contentBox.add(utils.dom(self, '菜都做完啦。赶紧上菜的啦！', 'rest'))
					data.type = 'dishup'
					data.staff = self
					Event.pub('dishup', data, 'once')
				}
			}
		}(i), 2000)
	}
}