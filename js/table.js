class Table {
	constructor(config) {
		this.data = config.data
		this.head = config.head
		this.caption = config.caption
		this.table = config.table || document.querySelector('#X-Table')
		
		this.render()
	}

	render (data) {
		if (data) this.data = data

		let headEle = '',
			rowEle = ''

		headEle = this.head.map((head) => {
			return `<th>${head}</th>`
		}).join('')

		Object.keys(this.data).forEach((key) => {
			let current = this.data[key],
				rowspan = Object.keys(current).length

			Object.keys(current).forEach((item, index) => {
				rowEle += '<tr>'

				if (index == 0) {
					rowEle += rowspan >= 1 ? `<td rowspan=${rowspan}>${key}</td>` : ''
				}
				rowEle += `<td>${item}</td>`
				rowEle += current[item].map((sale) => { // 用sale是因为current[item] 是12个月份的销售数据数组
					return `<td>${sale}</td>`
				}).join('')
				rowEle += '</tr>'
			})
		})

		this.table.innerHTML = `<table border=1>
									<caption>${this.caption}</caption>
									<thead>${headEle}</thead>
									<tbody>${rowEle}</tbody>
								</table>`
	}

	set (config) {
		config.head && (this.head = config.head)
		config.data && (this.data = config.data)
		this.render()
	}
}