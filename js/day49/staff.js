/** the base class 'staff'
 * @param {Object} option 选项
 * option => {
 *		name: String,
 *		salary: Number,
 *		type: String
 *	}
 * @return {Object} a staff instance
*/

class Staff {
	constructor (option) {
		this.ID = null	// be setted when create if necessary
		this.name = option.name
		this.salary = option.salary
		this.status = 'free'	// 'busy'
		this.type = option.type
		this.timeUnit = option.timeUnit || 2
	}

	setID (id) {
		this.ID = id
	}

	getType () {
		return this.type
	}

	getStatus () {
		return this.status
	}

	setStatus (status) {
		this.status = status
		
		Event.pub('kitchen_refresh', this, 'once')
	}

	greeting () {
		var text = '大家好, 我是新来的' + this.type + ', 我叫' + this.name + '.'
	}

	/** staff 工厂模式
	 * @param {Object} option 选项
	 * option => {
	 *		name: String,
	 *		salary: Number,
	 *		type: String
	 *	}
	 * @return {Object} a staff instance corresponding to the option.type
	 * @usage: Staff.factory(option)
	*/
	static factory (option) {
		switch (option.type) {
			case 'waiter':
				return new Waiter(option)
			case 'chef':
				return new Chef(option)
		}
	}
}