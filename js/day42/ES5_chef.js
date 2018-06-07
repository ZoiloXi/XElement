// 定义厨师类
function Chef(option) {
	Staff.call(this, option)
}
Chef.prototype = Object.create(Staff.prototype)
Chef.prototype.constructor = Chef
Chef.prototype.cook = function (data) {
	var self = this
	var cuisines = data.selected,
		completed = 0

	for (var i = 0; i < cuisines.length; i++) {
		setTimeout(function (i) {
			return function () {
				var text = utils.dom(self, cuisines[i].name + '做完了, 服务员小妹!', 'restaurant')
				// contentBox.add(text)
				// 把添加contextBox改成事件
				Event.pub('addCanteen', text, 'once')

				completed += 1
				if (completed == cuisines.length) {
					// contentBox.add(utils.dom(self, '菜都做完啦。赶紧上菜的啦！', 'rest'))
					Event.pub('addCanteen', utils.dom(self, '菜都做完啦。赶紧上菜的啦！', 'restaurant'), 'once')

					data.type = 'dishup'
					data.staff = self

					self.free()
					
					Event.pub('dishup', data, 'once')
				}
			}
		}(i), 2000)
	}
}