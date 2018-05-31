/* 考虑的问题：
1. 配置是挂载在哪里？this? 还是this.config
2. 分层：由远端到近端
	背景层
	网格层
	坐标轴层
	条形图层
	图例层
	数据标签层
	交互层（如hover callout
*/


class Basicplot {
	constructor(config) {
		this.config = config
		this.setDefault()
		this.render()
		this.addEvent()
	}

	setConfig (config) {
		this.config = Object.assign(this.config, config)
		this.setDefault()
		this.render()
		this.addEvent()
	}
	
	setDefault () {
		let styles = getComputedStyle(this.config.container, '')

		this.width = parseFloat(styles['width'])
		this.height = parseFloat(styles['height'])
		this.areaRatio = this.config.areaRatio || 0.15
		this.range = this.config.range || [0, utils.ceil(utils.max(this.config.data))]

		this.xmlns = 'http://www.w3.org/2000/svg'
		this.config.grid = this.config.grid || 0

		// 根据左上点和右下点就能确定整个绘图区域（矩形的对角点）
		this.pointLeftTop = {
			x: this.width * this.areaRatio / 2,
			y: this.height * this.areaRatio / 2,
		}
		this.pointRightBottom = {
			x: this.width * (1 - this.areaRatio / 2),
			y: this.height * (1 - this.areaRatio / 2)
		}
	}

	render () {
		// do something
	}

	addEvent () {
	}

	Background () {
		// 进行背景颜色变化
		this.config.container.style.backgroundColor = this.config.background
	}

	Grid () {
		// 先将Grid图层分组
		let pointLeftTop = this.pointLeftTop,
			pointRightBottom = this.pointRightBottom
		let grid = {
			x: pointLeftTop.x,
			y: pointLeftTop.y,
			width: pointRightBottom.x - pointLeftTop.x,
			height: pointRightBottom.y - pointLeftTop.y,
			xmlns: this.xmlns,
		}

		// 画上各个网格线，可以是透明的，各条线的起始有上面的两个点确定
		let ylineNum = this.config.ylabels || 5,
			xlineNum = this.config.data.length + 1,
			xlines = '',
			ylines = '',
			offsetY = grid.height / (ylineNum -1),
			offsetX = grid.width / (xlineNum - 1),
			lines = []
		for (let i = 0; i < ylineNum; i++) {
			ylines += `<line class="ylines" x1="${pointLeftTop.x}" `
							+ `y1="${pointLeftTop.y + i*offsetY}"`
							+ `x2="${pointRightBottom.x}"`
							+ `y2="${pointLeftTop.y + i*offsetY}"`
							+ `style="stroke:rgb(99,99,99);stroke-width:1"></line>`
		}
		for (let i = 0; i < xlineNum; i++) {
			xlines  += `<line class="xlines" x1="${pointLeftTop.x + i*offsetX}"`
							+ `y1="${pointLeftTop.y}"`
							+ `x2="${pointLeftTop.x + i*offsetX}"`
							+ `y2="${pointRightBottom.y}"`
							+ `style="stroke:rgb(99,99,99);stroke-width:1;opacity:${this.config.grid}"></line>`
		}
		
		// group.innerHTML = xlines + ylines
		return '<g>' + xlines + ylines + '</g>'
	}
	
	Xaxis () {
		return `<line class="x-axis" x1=${this.pointLeftTop.x} `
				+ `y1=${this.pointRightBottom.y} `
				+ `x2=${this.pointRightBottom.x} `
				+ `y2=${this.pointRightBottom.y} style="stroke:steelblue;stroke-width:1"></line>`
	}

	Yaxis () {
		return `<line class="y-axis" x1=${this.pointLeftTop.x} `
				+ `y1=${this.pointLeftTop.y} `
				+ `x2=${this.pointLeftTop.x} `
				+ `y2=${this.pointRightBottom.y} style="stroke:steelblue;stroke-width:1"></line>`
	}

	Legend () {

	}

	Title () {
		if (!this.config.title) return ''

		let title = this.config.title
		if (Array.isArray(title)) {
			title = title.join(' ')
		} else if (Object.prototype.toString.call(title) == '[object Object]') {	// Object.prototype.toString.call(title)
			title = title.title
		}

		return `<text x="${this.width / 2}" y="${this.height * this.areaRatio / 2}">${title}<text>` 
	}

	Label () {
		let numY = this.config.ylabels || 5,
			offsetY = this.height * (1- this.areaRatio) / (numY-1),	// for position y
			valueY = this.range[1] / (numY -1),
			ylabels = ''

		for (let i = 0; i < numY; i++) {
			// 画y轴标签
			ylabels += `<text width="50px" height="auto" x="${this.pointLeftTop.x-30}" y="${this.pointLeftTop.y + i*offsetY}">${Math.floor((numY-i-1)*valueY)}</text>`
			ylabels += `<line x1="${this.pointLeftTop.x}" y1="${this.pointLeftTop.y + i*offsetY}" x2="${this.pointLeftTop.x-5}" y2="${this.pointLeftTop.y + i*offsetY}" style="stroke:steelblue; stroke-width:1"></line>`
		}

		let numX = this.config.label.length,
			offsetX = this.width * (1- this.areaRatio) / numX,
			xlabels = '',
			pixelPerWord = Math.max.apply(Math, this.config.label.map(label => String(label).length))

		for (let i = 0; i < numX; i++) {
			xlabels += `<text x="${this.pointLeftTop.x + (i+0.5) * offsetX - 5*pixelPerWord}" y="${this.pointRightBottom.y + 15}">${this.config.label[i]}</text>`
		}

		return "<g class='labels'>" + xlabels + ylabels+ "</g>"
	}

	callout () {

	}

	hover (e, tag, cls) {
		let type = e.type,
			target = e.target || e.srcElement,
			tooltip = document.querySelector('div.tooltip') || document.createElement('div')
		if (type == 'mousemove') {
			if (target.tagName == tag && target.classList.contains(cls)) {
				tooltip.setAttribute('class', 'tooltip')
				tooltip.innerText = `data: ${target.dataset.data}`
				tooltip.style.position = "absolute"
				tooltip.style.left = e.x + 14 + 'px'		// 14是偏离鼠标位置的距离
				tooltip.style.top =  e.y + document.documentElement.scrollTop + 14 + 'px'
				document.body.appendChild(tooltip)
			}
		} else if (type == 'mouseout') {
			if (tooltip.classList.contains('tooltip')) document.body.removeChild(tooltip)
		}
	}

	calcPosiY (data) {
		let height = this.height * (1-this.areaRatio),
			ymax = this.range[1],
			pixelPerY = height / ymax

		return this.config.data.map((d) => {
			return this.pointLeftTop.y + (ymax - d) * pixelPerY
		})
	}

	calcPosiX () {
		let width = this.width * (1-this.areaRatio),
			len = this.config.label.length,
			offset = width / len,
			posiXList = []

		for (let i = 0; i < len; i++) {
			let x = this.pointLeftTop.x + i * offset + offset * (1-this.config.barwidth) / 2
			posiXList.push(x)
		}

		return posiXList
	}
}