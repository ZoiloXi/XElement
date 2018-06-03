class EditTable extends Table {
	constructor (config) {
		super(config)

		this.addEvent()
	}

	addEvent () {
		let table = this.table,
			panel = this.createPanel(),
			rawdata = ''

		let input = panel.querySelector('.edit-input'),
			prompt = panel.querySelector('.edit-prompt')
		// 编辑按钮监听事件,注意使用e.stopPropagation()阻止下面的document响应函数执行
		panel.addEventListener('click', (e) => {
			e.stopPropagation()

			let target = e.target

			if (target.classList.contains('edit-identify')) {
				let value = input.value.trim(),
					pass = this.validate(value)
				// 设置新值
				if (value && pass) {
					panel.parentNode.innerText = value
					this.resetPanel(panel)
				}
			} else if (target.classList.contains('edit-cancel')) {
				panel.parentNode.innerText = rawdata
			}	
		},false)

		input.addEventListener('keyup', (e) => {
			let value = input.value.trim(),
				pass = this.validate(value)

			switch (e.key) {
				case 'Enter':
					value && pass && (panel.parentNode.innerText = value)
					this.resetPanel(panel)
					break
				case 'Escape':
					panel.parentNode.innerText = rawdata
					this.resetPanel(panel)
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

		document.addEventListener('click', (e) => {
			let target = e.target

			// 先把现有的输入框消除
			if (panel && panel.parentNode) {
				panel.parentNode.classList.remove('edit-td')
				panel.parentNode.innerText = rawdata		// 这个函数会把panel从父元素中删除,innerText=rawdata
				this.resetPanel(panel)
			}

			if (target.tagName == 'TD' && target.classList.contains('rowdata')) {
				target.classList.add('edit-td')
				rawdata = target.innerText
				target.innerText = ''
				target.appendChild(panel)
				input.focus()
			}

		})
	}

	createPanel () {
		let panel = document.createElement('div')

		panel.classList.add('edit-panel')

		panel.innerHTML = `<input class="edit-input" type="text" />`
						+ `<i class="fa fa-check-circle edit-identify" aria-hidden="true"></i>`
						+ `<i class="fa fa-times-circle edit-cancel" aria-hidden="true"></i>`
						+ `<span class="edit-prompt"></span>`



		return panel
	}

	resetPanel (panel) {
		let input = panel.querySelector('.edit-panel .edit-input'),
			prompt = panel.querySelector('.edit-panel .edit-prompt')

		input.value = ''
		prompt.innerText = ''
	}

	validate (value) {
		return !Number.isNaN(Number(value))
	}
}