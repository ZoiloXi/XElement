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