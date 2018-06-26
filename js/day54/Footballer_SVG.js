class Footballer {
	constructor (options) {	
		this.ele = options.element
		this.container = options.container || null
		this.speed = options.speed
		this.explosive = options.explosive
		this.endurance = options.endurance
		this.restore = options.restore
		this.V = {
			max: 0,
			acc: 0,
			dec: 0,
			dur: 0,
		}

		this.V.curr = options.start || 0

		this.init()
	}

	init () {
		this.convert()
		if ('tagName' in this.ele && this.container) {
			this.container.appendChild(this.ele)
		} else if (this.container) {
			let property = ele
			property = Object.assign(property, {
				r: 20,
				cy: 180,
				cy: 180,
				fill: 'blue'
			})
			this.ele = utils.svg('circle', property)
			this.container.appendChild(this.ele)
		}
	}

	// 将设定的球员各项能力值转化为对应的值
	// 速度值speed: 最大速度值this.V.max，
	// 爆发力explosive: 加速度值(this.V.acc)
	// 耐力endurance: 最大速度保持时间(与耐/体力挂钩, this.V.dur)
	// 恢复能力restore: 没体力后的恢复能力(减速度this.V.dec) 
	convert () {
		// speed to Vmax, speed: 10~20, Vmax = speed / 2
		this.V.max = (this.speed >= 10 && this.speed <= 20)
					 ? this.speed / 2
					 : (this.speed < 10
					 ? 10 / 2
					 : 20 / 2)

		// explosive to accelerated, explosive: 10~20, acc = explosive / 5
		this.V.acc = (this.explosive >= 10 && this.explosive <= 20)
					 ? this.explosive / 5
					 : (this.explosive < 10
					 ? 10 / 5
					 : 20 / 5)

		// endurance to Vmax duration time, endurance 10~20, dur = endurance / 2 + 5
		this.V.dur = (this.speed >= 10 && this.speed <= 20)
					 ? (this.speed / 2 + 5)
					 : (this.speed < 10
					 ? (10 / 2 + 5)
					 : (20 / 2 + 5))

		// restore to deceleration, restore: 10~20, dec = -restore / 5
		this.V.dec = (this.restore >= 10 && this.restore <= 20)
					 ? this.restore / 5
					 : (this.restore < 10
					 ? 10 / 5
					 : 20 / 5)
	}

	getAnimate (length) {
		// 只考虑直线运动, 不考虑斜线,通过path来实现运动
		// 思路: 先计算在运动中一个加速-最大速度-减速恢复的过程所有要跑的路程
		// 		 再计算该阶段的各个时间点、路程点, 基于此实现path的路径, 然后给运动员添加animateMotion动画
		
		// 加速时间, 该时间段里的路程, formula: s = V0 * t + a * t ^ 2 / 2
		let accTime = this.V.max / this.V.acc,
			accLength = this.V.curr * accTime + this.V.acc * accTime * accTime / 2

		// 保持Vmax时间, 该时间段里的路程, s = Vmax * t
		let maxTime = this.V.dur,
			maxLength = this.V.max * maxTime
		
		// 恢复速度时间, 该时间段里的路程, remember: minus the this.V.dec
		let decTime = this.V.max / this.V.dec,
			decLength = this.V.max * decTime - this.V.dec * decTime * decTime / 2

		let totalLength = accLength + maxLength + decLength,
			totalTime = accTime + maxTime + decTime
		// 在跑length长度时，需要经历“起步-加速-保持最高速度-减速“的循环数
		let circles = Math.floor(length / totalLength),
			circlesTime = circles * totalTime,
			rest = length % totalLength		// circles轮后,还要跑多长

		// 用于设置动画的keyTimes和keyPoints属性
		let points = [],
			times = []
		for (let i = 0; i < circles; i++) {
			points.push(accLength + i * totalLength)	// 起步-加速
			points.push(accLength + maxLength + i * totalLength)	// 保持最高速度
			points.push(accLength + maxLength + decLength + i * totalLength)	// 减速

			times.push(accTime + i * totalTime)			// 同上
			times.push(accTime + maxTime + i * totalTime)			// 同上
			times.push(accTime + maxTime + decTime + i * totalTime)			// 同上
		}

		// 根据剩余路程计算剩余路程的动画时间点
		if (rest) {
			// 剩余长度处于加速阶段
			if ( rest <= accLength) {
				points.push(length)
				times.push(rest / accLength * accTime + circlesTime)
			
			// 剩余长度处于保持最高速度阶段
			} else if (rest<= (accLength + maxLength)) {
				points.push(accLength + circles * totalLength)
				times.push(accTime + circles * totalTime)

				points.push(length)
				times.push(circlesTime + accTime + (rest- accLength) / maxLength * maxTime)

			// 剩余长度处于减速阶段
			} else if (rest> (accLength + maxLength)) {
				points.push(accLength + circles * totalLength)
				times.push(accTime + circlesTime)

				points.push(accLength + maxLength + circles * totalLength)
				times.push(accTime + maxTime + circlesTime)

				points.push(length)
				times.push(accTime + maxTime + (rest - accLength - maxLength) / decLength * decTime)
			}
		}

		// 设置动画参数, 默认x轴移动
		let lastPoint = points[points.length-1],
			lastTime = times[times.length-1],
			keyPoints = points.map( point => point / lastPoint),
			keyTimes = times.map( time => time / lastTime)

		keyPoints.unshift('0')	// 动画的起始点必需是0，下同
		keyTimes.unshift('0')

		return {
			points,
			keyPoints,
			keyTimes,
			lastTime
		}
	}

	run (length) {
		// 只考虑直线运动, 不考虑斜线,通过path来实现运动

		let { points, keyPoints, keyTimes, lastTime } = this.getAnimate(length)

		let	xOriginal = this.ele.getAttribute('cx'),
			yOriginal = this.ele.getAttribute('cy')

		// 创建动画元素animateMotion
		let animateMotion = utils.svg('animateMotion', {
			path: `M ${xOriginal} ${yOriginal} ${points.map(x => 'H ' + x ).join(' ')}`,
			keyPoints: keyPoints.join(';'),
			keyTimes: keyTimes.join(';'),
			addictive: 'replace',			// 当前新动画将替代未完成动画
			calcMode: 'linear',
			dur: lastTime / 5 + 's',
			fill: 'freeze',
		})
		this.ele.appendChild(animateMotion)
	}

	// 设置球员位置
	set({x, y}) {
		x && this.ele.setAttribute('cx', x)
		y && this.ele.setAttribute('cy', y)
	}
}