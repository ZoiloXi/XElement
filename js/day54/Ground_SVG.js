class Ground {
	constructor (options) {
		this.container = options.container

		this.create()
	}

	create () {

		let w = parseFloat(this.container.getAttribute('width')),
			h = parseFloat(this.container.getAttribute('height')),
			scale = Math.floor(w / 105),	// 球场宽105米，高68米
			offsetX = (w-105*scale)/2,
			offsetY = (h-68*scale)/2

		this.scale = scale
		// 球场边线
		this._G_sidelines = utils.svg('rect', {
			x: offsetX,
			y: offsetY,
			width: 105 * scale,
			height: 68 * scale,
			style: 'fill: none; stroke: white;',
			"class": 'G-rect'		
		})
		// 球场中线
		this._G_centralLine = utils.svg('line', {
			x1: offsetX + 105/2*scale,
			y1: offsetY,
			x2: offsetX + 105/2*scale,
			y2: offsetY + 68*scale,
			style: 'stroke: white; stroke-width: 2;',
			"class": 'G-line'
		})
		// 罚球区
		this._G_penaltyAreaLeft = utils.svg('rect', {
			x: offsetX,
			y: (68-40.32)/2 * scale + offsetY,
			width: 16.5 * scale,
			height: 40.32 * scale,
			style: 'fill: none; stroke: white;',
			"class": 'G-rect',
			id: 'G-penaltyArea'
		})
		this._G_penaltyAreaRight = utils.svg('rect', {
			'xlink:href': '#G-penaltyArea',
			x: (105-16.5)*scale + offsetX,
			y: (68-40.32)/2 * scale + offsetY,
			width: 16.5 * scale,
			height: 40.32 * scale,
			style: 'fill: none; stroke: white;',
			"class": 'G-rect',
		})
		// 球门区
		this._G_goalAreaLeft = utils.svg('rect', {
			y: (68-18.32)/2 * scale+ offsetY,
			x: offsetX,
			width: 5.5 * scale,
			height: 18.32 * scale,
			style: 'fill: none; stroke: white;',
			"class": 'G-rect',
		})
		this._G_goalAreaRight = utils.svg('rect', {
			x: (105-5.5)*scale + offsetX,
			y: (68-18.32)/2 * scale+ offsetY,
			width: 5.5 * scale,
			height: 18.32 * scale,
			style: 'fill: none; stroke: white;',
			"class": 'G-rect',
		})
		// 球门
		this._G_goalDoorLeft = utils.svg('rect', {
			x: offsetX - 2.44 * scale,
			y: (68-7.32)/2 * scale+offsetY,
			width: 2.44 * scale,
			height: 7.32 * scale,
			style: 'fill: none; stroke: white;',
			"class": 'G-rect',
			id: 'G-goalDoor'
		})
		this._G_goalDoorRight = utils.svg('rect', {
			x: 105*scale + offsetX,
			y: (68-7.32)/2*scale+offsetY,
			width: 2.44 * scale,
			height: 7.32 * scale,
			style: 'fill: none; stroke: white;',
			"class": 'G-rect',
		})

		// 中圈
		this._G_centralCircle = utils.svg('circle', {
			cx: 105 / 2 * scale + offsetX,
			cy: 68 / 2 * scale + offsetY,
			r: 9.15 * scale,
			style: 'fill: none; stroke: white;',
			"class": 'G-circle',
		})
		// 四个角
		let r = 1.5 * scale
		this._G_corner1 = utils.svg('path', {
			d: `M ${offsetX + r} ${offsetY} A ${r} ${r} 1 0 1 ${offsetX} ${offsetY + r}`,
			style: 'fill: none; stroke: white;',
			"class": 'G-circle',
			transform: `rotate(0, ${offsetX} ${offsetY})`
		})
		this._G_corner2 = utils.svg('path', {
			d: `M ${offsetX + r} ${offsetY} A ${r} ${r} 1 0 1 ${offsetX} ${offsetY + r}`,
			style: 'fill: none; stroke: white;',
			"class": 'G-circle',
			transform: `rotate(90, ${offsetX} ${offsetY}) translate(0, -1050)`
		})
		this._G_corner3 = utils.svg('path', {
			d: `M ${offsetX + r} ${offsetY} A ${r} ${r} 1 0 1 ${offsetX} ${offsetY + r}`,
			style: 'fill: none; stroke: white;',
			"class": 'G-circle',
			transform: `rotate(-90, ${offsetX} ${offsetY}) translate(-680, 0)`
		})
		this._G_corner4 = utils.svg('path', {
			d: `M ${offsetX + r} ${offsetY} A ${r} ${r} 1 0 1 ${offsetX} ${offsetY + r}`,
			style: 'fill: none; stroke: white;',
			"class": 'G-circle',
			transform: `rotate(180, ${offsetX} ${offsetY}) translate(-1050, -680)`
		})

	}
	draw () {
		for (let key in this) {
			log(key)
			if (key.startsWith('_G')) {
				this.container.appendChild(this[key])
			}
		}
	}
}