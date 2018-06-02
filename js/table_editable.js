class EditTable extends Table {
	constructor (config) {
		super(config)

		this.addEvent()
	}

	addEvent () {
		let table = this.table,
			panel = this.addEditPanel()

		// td格子mouseover后，置为可编辑contenteditable, 外加outline
		// 根据target的classlist里面是否有rowdata判断是否是数据单元格，而非表头或行名列名
		table.addEventListener('mouseover', (e) => {
			let target = e.target || e.srcElement

			// 如果不是数据单元格,
			if (!(target.classList.contains('rowdata') && target.tagName == 'TD')) {
				return
			}

			if (panel.parentNode != target) {
				(panel.parentNode) && panel.parentNode.removeChild(panel)
				this.resetEditPanel(panel)
				target.appendChild(panel)
			}
		}, false)

		document.addEventListener('click', (e) => {
			let target = e.target || e.srcElement


			if (target.parentNode != panel) {
				(panel.parentNode) && panel.parentNode.removeChild(panel)
				this.resetEditPanel(panel)
			}
		}, false)
	}

	addEditPanel () {
		let panel = document.createElement('div')
		this.panel = panel

		panel.classList.add('edit-panel')

		panel.innerHTML = `<div class="edit-switch" style="display: block">编辑</div>`
						+ `<input class="edit-input" style="display:none"type="text"/></div>`
						+ `<div class="edit-identify" style="display: none">确认</div>`
						+ `<div class="edit-cancel" style="display: none">取消</div>`
						+ `<div class="edit-prompt" style="display: none"></div>`

		let edit = panel.querySelector('.edit-switch'),
			input = panel.querySelector('.edit-input'),
			identify = panel.querySelector('.edit-identify'),
			cancel = panel.querySelector('.edit-cancel'),
			prompt = panel.querySelector('.edit-prompt')

		edit.addEventListener('click', (e) => {
			edit.style.display = 'none'
			input.style.display = 'block'
			identify.style.display = 'block'
			cancel.style.display = 'block'
			prompt.style.display = 'block'
			input.focus()

			// panel.parentNode.setAttribute('contenteditable', true)
			this.table.querySelector('.edit-td') && this.table.querySelector('.edit-td').classList.remove('edit-td')
			panel.parentNode.classList.add('edit-td')

			e.stopPropagation()
			e.preventDefault()
		}, false)

		identify.addEventListener('click', (e) => {
			let value = input.value.trim(),
				pass = this.validate(value)
			// 设置新值
			if (value && pass) {
				this.setCellData(panel.parentNode, value)
				this.resetEditPanel(panel)
			}
			e.stopPropagation()
			e.preventDefault()
		},false)

		cancel.addEventListener('click', (e) => {
			this.resetEditPanel(panel)
			e.stopPropagation()
			e.preventDefault()
		}, false)

		input.addEventListener('keyup', (e) => {
			let value = input.value.trim(),
				pass = this.validate(value)
			log(e.key)
			switch (e.key) {
				case 'Enter':
					value && pass && this.setCellData(panel.parentNode, value)
					this.resetEditPanel(panel)
					break
				case 'Escape':
					this.resetEditPanel(panel)
					panel.parentNode.removeChild(panel)
					log('ESc')
					break
				default:
					if (!pass) {
						prompt.innerText = '请输入数字！！！'
						return
					} else {
						prompt.innerText = ''
					}
			}
		})

		return panel
	}

	resetEditPanel (panel) {
		panel = panel || this.panel

		let edit = panel.querySelector('.edit-panel .edit-switch'),
			input = panel.querySelector('.edit-panel .edit-input'),
			identify = panel.querySelector('.edit-panel .edit-identify'),
			prompt = panel.querySelector('.edit-panel .edit-prompt'),
			cancel = panel.querySelector('.edit-panel .edit-cancel')

		edit.style.display = 'block'
		input.style.display = 'none'
		input.value = ''
		identify.style.display = 'none'
		cancel.style.display = 'none'
		prompt.style.display = 'none'
		prompt.innerText = ''
		panel.parentNode && panel.parentNode.removeChild(panel)
	}

	setCellData (cell, value) {
		cell.innerText = value
	}

	validate (value) {
		return !Number.isNaN(Number(value))
	}

	get () {
		this.resetEditPanel()

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