// 生成招聘选项
var hireType = new Checkbox({
	container: document.querySelector('#X-Checkbox'),
	type: 'checkbox',
	name: ': ',
	allCheck: false,
	data: ['Chef', 'Waiter']
});

// 获取服务交流框,及创建相关方法,订阅对应事件
var contentBox = {
	box: document.querySelector('#contentBox'),
	add: function (strordom) {
		if (typeof strordom == 'string') {
			var frag = document.createElement('div')
			frag.innerHTML = strordom
			this.box.appendChild(frag)
		} else {
			this.box.appendChild(strordom)
		}
		this.box.scrollTop = this.box.scrollHeight
	},
	remove: function (dom) {
		let parent = dom.parentNode
		while (parent) {
			if (parent == this.box) {
				dom.parentNode.removeChild(dom)
				break
			}
			parent = parent.parentNode
		}
	}
}
Event.sub('addContent', contentBox.add.bind(contentBox))
Event.sub('rmContent', contentBox.remove.bind(contentBox))

// 获取食堂内部交流框,订阅对应事件
var canteen = document.getElementById('canteen'),
	hireBtn = canteen.querySelector('.hire'),
	welcomeBtn = canteen.querySelector('.welcome'),
	canteenBox = {
		box: canteen.querySelector('#canteenBox'),
		add: contentBox.add,
		remove: contentBox.remove
	};
Event.sub('addCanteen', canteenBox.add.bind(canteenBox))
Event.sub('rmCanteen', canteenBox.add.bind(canteenBox))
// 点击雇佣新职工
hireBtn.onclick = function (e) {
	var beingHire = hireType.get()

	for (var i = 0; i < beingHire.length; i++) {
		if (beingHire[i] == 'Chef') {
			myRest.hire(new Chef({
				name: utils.randomName(),
				salary: (Math.random() + 1)* 4000,
				type: 'Chef'
			}))
		} else if (beingHire[i] == 'Waiter') {
			myRest.hire(new Waiter({
				name: utils.randomName(),
				salary: (Math.random() + 1)* 4000,
				type: 'Waiter'
			}))
		}
	}
}
var customerNum = 3,
	myText = [
		'服务员你好，我要点菜！',
		'有人吗？快来点菜啊。。。',
		'威特，威特, where are you啊?'
	],
	names = [
		'众里寻他',
		'千百度',
		'Baidu'
	];
welcomeBtn.onclick = function () {
	if (customerNum == 0) customerNum = 3
	var customer = new Customer({
		name: names[customerNum-1] || utils.randomName()
	}),
		greet = myText[customerNum-1]

	customer.hello(myText[customerNum-1])
	customerNum--
}

// 初始化食堂
var myRest = new Restaurant({
		name: "Midnight Canteen",
		money: 120000,
		seats: 12 
	}),
	// 职工
	John_chef = new Chef({
		name: 'John',
		salary: 5000,
		type: 'Chef',
	}),
	Moss_chef = new Chef({
		name: 'Moss',
		salary: 4800,
		type: 'Chef',
	}),
	Joy_waiter = new Waiter({
		name: 'Joy',
		salary: 3500,
		type: 'Waiter',
	}),
	Lisa_waiter = new Waiter({
		name: 'Lisa',
		salary: 3500,
		type: 'Waiter',
	}),
	// 菜品
	meat = new Cuisine({
		price: 45.9,
		cost: 25,
		name: 'meat'
	}),
	fish = new Cuisine({
		price: 35.9,
		cost: 18,
		name: 'fish'
	}),
	vegatable = new Cuisine({
		price: 12.9,
		cost: 4,
		name: 'vegatable'
	})

myRest.hire([John_chef, Moss_chef, Joy_waiter, Lisa_waiter])
	  .menu([meat, fish, vegatable])


// modal,进行开业
var initModal = document.querySelector('#modal'),
	initBtn = initModal.querySelector('.begin');

initBtn.onclick = function (e) {
	initModal.style.display = 'none'

	myRest.opening()
}
