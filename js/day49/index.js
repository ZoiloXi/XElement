// 客人进店()
// 服务员迎客()
// 服务员引座()
// 客人点餐()
// 服务员提交点餐()
// 厨师做菜()
// 服务员上菜()
// 客人吃菜()
// 结账()
// 客人离开()

// 初始化，创建各个要素
var Waiter_Lucy = RestaurantFactory.instance({
		name: 'Lucy',
		type: 'waiter',
		salary: 5000,
	}),
	Waiter_Lack = RestaurantFactory.instance({
		name: 'Lack',
		type: 'waiter',
		salary: 5000,
	}),
	Chef_John = RestaurantFactory.instance({
		name: 'John',
		type: 'chef',
		salary: 4000
	}),
	Cust_Villy = RestaurantFactory.instance({
		name: 'Villy',
		money: 1000,
		type: 'customer',
	}),
	fish = RestaurantFactory.instance({
		cost: 12,
		price: 24,
		time: 10,
		name: 'fish',
		type: 'cuisine',
	}),
	vegetable = RestaurantFactory.instance({
		cost: 5,
		price: 14,
		time: 6,
		name: 'vegetable',
		type: 'cuisine',
	}),
	noodle = RestaurantFactory.instance({
		cost: 12,
		price: 24,
		time: 10,
		name: 'noodle',
		type: 'cuisine',
	}),
	chicken = RestaurantFactory.instance({
		cost: 5,
		price: 14,
		time: 6,
		name: 'chicken',
		type: 'cuisine',
	}),
	midnight = RestaurantFactory.instance({
		name: 'midnight_canteen',
		seats: 4,
		money: 100000,
		type: 'restaurant',
	})
// 餐厅雇佣员工，开发菜系
midnight.hire([Waiter_Lack, Waiter_Lucy, Chef_John])
		.recipe([fish, vegetable, chicken, noodle])

// 生成渲染函数,渲染页面; 渲染餐厅和厨房
const render = {
		canteen: new RenderCanteen(document.querySelector('.Left'), midnight.seats),
		kitchen: new RenderKitchen(document.querySelector('.Right'))
	}

midnight.render = render

Event.pub('kitchen_init', {restaurant: midnight}, 'once')

midnight.opening()

// Cust_Villy.comein(render)