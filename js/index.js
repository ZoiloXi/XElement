const data = {
	product: ['手机', '笔记本', '智能音箱'],
	region: ['华东', '华北', '华南'],
}

// 创建2个复选框，地区和产品
let myProduct = new Checkbox({
	container: document.querySelector('#X-Checkbox2'),
	type: 'checkbox',
	name: '产品：',
	allCheck: true,
	//reverseCheck: false,
	data: data.product,
}),
	myRegion = new Checkbox({
	container: document.querySelector('#X-Checkbox'),
	type: 'checkbox',
	name: '地区：',
	allCheck: true,
	reverseCheck: false,
	data: data.region,
})

// 创建数据控制器，用于筛选数据和重组数据
let mydata = new DataController(sourceData)


// 以下是初始化
let reshape = mydata.reshape(data.region, data.product)

let months = []
for (let i = 0; i < 12; i++) months.push(i+1)

let mytable = new Table({
	data: reshape,
	head: ['region', 'product'].concat(months),
	caption: '各地区各产品销售情况',
})

// 响应复选框的改变，重绘数据表
document.addEventListener('click', (e) => {
	let target = e.target || e.srcElement

	if (target.tagName == 'INPUT') {
		let region = myRegion.getResult(),
			product = myProduct.getResult(),
			data = mydata.reshape(region, product),
			primary = region.length <= product.length ? 'region' : 'product',
			secondary = region.length <= product.length ? 'product' : 'region'

		mytable.set({
			head: [primary, secondary].concat(months),
			data: data,
		})
	}
})