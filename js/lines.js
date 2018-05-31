class Lineplot extends Basicplot{
	constructor(config) {
		super(config)
	}

	setDefault () {
		super.setDefault()
		// 折线图，可以是一组折线图或者一条, 一条的话改为下面的形式
		// data = {
		// 		series1: [],
		//		series2: [],
		// }
		if (Array.isArray(this.config.data)) {
			let data = this.config.data
			this.config.data = {}
			this.config.data[this.config.title]= data
		} else {
			this.config.data = utils.flattenObj(this.config.data)
		}

	}
	render () {
		let grid = this.Grid(),
			Xaxis = this.Xaxis(),
			Yaxis = this.Yaxis(),
			lines = this.Line(),
			labels = this.Label(),
			title = this.Title()

		this.Background()

		this.config.container.innerHTML = grid + Xaxis + Yaxis + lines + labels + title
	}

	addEvent () {
		let linesGroup = document.querySelector('.lines-group')
		linesGroup.addEventListener('mousemove', (e) => {
			this.hover(e, 'polyline', 'lines-lines')
		}, false)
		linesGroup.addEventListener('mouseover', (e) => {
			this.hover(e, 'circles', 'lines-circles')
		}, false)
		linesGroup.addEventListener('mouseout', (e) => {
			this.hover(e, 'polyline', 'lines-lines')
			this.hover(e, 'circles', 'lines-circles')
		}, false)
	}

	Line () {			
		// data = {
		// 		series1: [],
		//		series2: [],
		// }
		let data = this.config.data,
			colors = utils.colors(Object.keys(this.config.data).length),
			offset = this.width * (1-this.areaRatio) / this.config.label.length * 0.5
			

		let posiYList = this.calcPosiY(),
			posiXList = this.calcPosiX(),
			lines = ''

		for (let series in posiYList) {
			let list = posiYList[series],
				points = [],
				circles = '',
				color = colors.pop()

			for (let i = 0, len = list.length; i < len; i++) {
				points.push(`${posiXList[i] + offset},${list[i]}`)

				circles += `<circle class="lines-circles" `
							+ `cx="${posiXList[i] + offset}" `
							+ `cy="${list[i]}" r="3" `
							+ `style="fill:${color}"`
							+ `data-data="${data[series][i]}"></circle>`
			}
			lines += `<polyline class="lines-lines" `
					+ `points="${points.join(' ')}" `
					+ `style="fill:none; stroke:${color}; stroke-width:2" `
					+ `data-data="${series}"/>`
			
			lines += circles
		}

		return '<g class="lines-group">' + lines + '</g>'
	}

	calcPosiY () {
		let data = this.config.data
		

		let height = this.height * (1-this.areaRatio),
			ymax = this.range[1],
			pixelPerY = height / ymax,
			posiYList = {}

		log(data, ymax)
		for (let series in data) {
			posiYList[series] = data[series].map((d) => {
				return this.pointLeftTop.y + (ymax - d) * pixelPerY
			})
		}

		return posiYList
	}
}