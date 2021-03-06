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
					rowEle += rowspan >= 1 ? `<td rowspan=${rowspan} class="rowname">${key}</td>` : ''
				}
				rowEle += `<td class="rowname">${item}</td>`
				rowEle += current[item].map((sale) => { // 用sale是因为current[item] 是12个月份的销售数据数组
					return `<td class='rowdata'>${sale}</td>`
				}).join('')
				rowEle += '</tr>'
			})
		})

		this.table.innerHTML = `<table>
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

	get () {
		// 重新生成数据
		let primary = this.table.querySelectorAll('thead th')[0].innerText,
			secondary = this.table.querySelectorAll('thead th')[1].innerText,
			rowspans = this.table.querySelectorAll('.rowname[rowspan]'),
			rownames = this.table.querySelectorAll('.rowname:not([rowspan])'),
			trs = this.table.querySelectorAll('.rowdata'),
			offset = trs.length / rownames.length

		let data = []

		rownames.forEach((item, index) => {
			let temp = {}
			temp[secondary] = item.innerText
			temp['sale'] = Array.from(trs)
								.slice(offset * index, offset * (index+1))
								.map((tr) => {
									return tr.innerText
								})

			data.push(temp)
		})

		let id = -1
		rowspans.forEach((item) => {
			let num = Number(item.getAttribute('rowspan')),
				text = item.innerText

			for (let i = 0; i < num; i++) {
				id += 1
				data[id][primary] = text
			}
		})

		return data
	}
}