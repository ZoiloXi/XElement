class Barplot extends Basicplot {
	constructor(config) {
		super(config)
		// this.config = config
		// this.setDefault()
		// this.render()
		// this.addEvent()
	}

	render () {
		// do something
		let grid = this.Grid(),
			Xaxis = this.Xaxis(),
			Yaxis = this.Yaxis(),
			bars = this.Bar(),
			labels = this.Label(),
			title = this.Title()

		this.Background()

		this.config.container.innerHTML = grid + Xaxis + Yaxis + bars + labels + title
	}

	addEvent () {
		let barsGroup = document.querySelector('.bars-group')
		barsGroup.addEventListener('mousemove', (e) => {
			this.hover(e, 'rect', 'bars')
		}, false)
		barsGroup.addEventListener('mouseout', (e) => {
			this.hover(e, 'rect', 'bars')
		}, false)
	}

	Bar () {
		// 求出每个条形所在框的宽度
		let width = this.width * (1-this.areaRatio),
			len = this.config.data.length,
			offset = width / len

		// 得出每个bar的坐标
		let posiXList = this.calcPosiX(),
			posiYList = this.calcPosiY(),
			barwidth = this.config.barwidth * offset,
			bars = ''

		for (let i = 0, len = posiXList.length; i < len; i++) {
			 bars += `<rect class="bars" x="${posiXList[i]}" `
			 		+ `y="${posiYList[i]}" `
			 		+ `width="${barwidth}" `
			 		+ `height="${this.height * (1 - this.areaRatio / 2) - posiYList[i]}" `
			 		+ `data-data="${this.config.data[i]}"></rect>`
		}

		return '<g class="bars-group">' + bars + '</g>'
	}
}