class RenderKitchen {
	constructor(container) {
		this.container = container
	}

	init (restaurant) {
		log(restaurant)
		// main template, for every staff
		let mainTemplate = `<div class="k-staff css_fl css_bd" id="{{name}}">
						<table class="js-info k-info" border="1">
							<thead><th colspan="2"><img src="./images/{{type}}.png"/>{{name}}</th></thead>
							<tbody>
								<tr><td>salary</td><td class="js-salary">{{salary}}</td></tr>
								<tr><td>status</td><td class="js-status">{{status}}</td></tr>
							</tbody>
						</table>
					</div>`;

		// to show the cuisines being cooked by chef
		let chefTemplate = `<tr class="js-cuisine-cooking"><td>正在做的</td><td><span class="js-cooking-progress">空</span></td></tr>`
						 + `<tr class="js-cuisine-remain"><td>等待做的</td><td class="js-remain-progress">空</td></tr>`

		// final template
		let table = ''

		restaurant.staffs.forEach(staff => {
			let staff_tab = mainTemplate

			for (let key in staff) {
				staff_tab = staff_tab.replace(new RegExp(`{{${key}}}`, 'g'), staff[key])
			}

			if (staff.type == 'chef') {
				staff_tab = staff_tab.replace('<\/tbody>', chefTemplate + '</tbody>')
			}

			table += staff_tab
		})

		this.container.innerHTML += table
	}

	refresh (staff) {
		let staffPanel = this.container.querySelector(`#${staff.name}`),
			status = staffPanel.querySelector('.js-status'),
			cooking = null, remain = null

		status.innerText = staff.status

		if (staff.type == 'chef') {
			cooking = staffPanel.querySelector('.js-cooking-progress')
			remain = staffPanel.querySelector('.js-remain-progress')

			cooking.classList.add('k-cooking-progress')

			cooking.innerText = staff.cooking ? staff.cooking.name : '空'
			remain.innerText = staff.remaining ? staff.remaining.map(c => c.name).join(',') : '空'

			// 以渐变色的完全由部分蓝色变为全蓝表示进度条
			if (staff.cooking && staff.cooking.remainTime > 0) {
				cooking.style.background = `-webkit-linear-gradient(left, steelblue 0%, white ${100 - staff.cooking.remainTime / staff.cooking.time * 100}%, white 100%)`
			} else {
				cooking.style.background = ''
				cooking.innerText = '空'
				cooking.classList.remove('k-cooking-progress')
			}
		}
		// background: linear-gradient(to bottom, #000000 0%,#ffffff 100%);
	}
}