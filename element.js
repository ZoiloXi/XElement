class Checkbox {
	constructor (config) {
		this.container = config.container || document.querySelector('#X-Checkbox')
		this.type = config.type || 'checkbox'
		this.name = config.name || 'X-Checkbox'
		this.AddReverseCheck = config.reverseCheck
		this.AddAllCheck = config.allCheck
		this.data = config.data

		this.selected = []
		this.items = []

		this.init()
	}

	init () {
		this.render()
		this.addEvent()
	}

	render () {
		let boxLabel = `<label for=${this.name}>${this.name}</label>`,
			boxItems = this.data.map((item, index) => {
				return `<input type=${this.type} name=${this.name} value=${item} />${item}`
			}),
			// 是否显示全选按钮和反选按钮
			boxAllCheck = this.AddAllCheck ?
								`<label for='allCheck'><input type='radio' class='allCheck' value='allCheck'>全选</label>`
								: '',
			boxReverseCheck = this.AddReverseCheck ? 
								`<label for='reverseCheck'><input type='radio' class='reverseCheck' value='reverseCheck'>反选</label>`
								: ''

		this.container.innerHTML = boxLabel + boxItems.join('') + '<br>	' + boxAllCheck + boxReverseCheck
		this.items = this.container.querySelectorAll(`input[type=${this.type}]`)
	}

	addEvent () {
		this.container.addEventListener('click', (e) => {
			// 注意，在点击时，即便没有监听点击事件，checkbox还是会被改变选中状态
			let target = e.target || e.srcElement

			if (target.tagName != 'INPUT') return

			if (target.value == 'allCheck') {
				this.allCheck()
			} else if (target.value == 'reverseCheck') {
				this.reverseCheck()
			} else {
				this.selected = Array.prototype.filter.call(this.items, (item) => {
					return item.checked == true
				})

				if (this.selected.length == 0) {
					target.checked = true
					this.selected = [target]
				}
				
				this.toggleAllCheck()
			}
		})
	}

	allCheck () {
		if (this.selected.length != this.data.length) {
			this.items.forEach((item) => {
				item.checked = true
			})
			this.selected = this.items
		}
	}

	toggleAllCheck () {
		let allCheck = this.container.querySelector('input[type="radio"][value="allCheck"]')
		if (this.selected.length == this.data.length) allCheck.checked = true
		else allCheck.checked = false
	}

	reverseCheck () {
		let temp = []
		this.items.forEach((item) => {
			item.checked = !item.checked
			if (Array.prototype.indexOf.call(this.selected, item) == -1) temp.push(item)
		})
		this.selected = temp
		this.toggleAllCheck()
	}

	getResult () {
		return Array.prototype.map.call(this.selected, (sel) => {
			return sel.value
		})
	}
}

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