const utils = {
	ceil (num) {
		let digits = [],
			floor,
			pow
		while (num > 1) {
			num = num / 10
			digits.push(num % 10)
		}
		pow = digits.length
		floor = Math.floor(digits[pow-1]*10) + 1

		return Math.pow(10, pow-1) * floor
	},
	
	max (arrOrObject) {
		let type = Object.prototype.toString.call(arrOrObject),
			max

		if (type == '[object Array]') {
			max = Math.max(...utils.flatten(arrOrObject))
		} else if (type == '[object Object]') {
			// obj = {
			// 	item1: [...],
			// 	item2: [...],
			// }
			let flattened = utils.flattenObj(arrOrObject)
			max = Math.max(...utils.flatten(Object.values(flattened)))
		}

		return max
	},

	flatten (arr) {
		let tempArr = []

		arr.forEach(item => {
			if (Array.isArray(item)) {
				tempArr = tempArr.concat(utils.flatten(item))
			} else {
				tempArr.push(item)
			}
		})
		return tempArr
	},

	flattenObj (obj) {
		// obj = {
		// 		key1: {
		// 			key11: [],
		// 			key12: [],
		// 	  	},
		// 		...
		// }
		let temp = {}

		Object.keys(obj).forEach((key) => {
			if (Object.prototype.toString.call(obj[key]) == '[object Object]') {
				for (let k in obj[key]) {
					temp[key + ',' + k] = obj[key][k]
				}
			} else {	
				temp[key] = obj[key]
			}
		})
		return temp
	},

	colors (n) {
		let colorArr = []
		if (n > 1) {
			colorArr = colorArr.concat(utils.colors(n-1))
		}
		let r = Math.floor(Math.random() * 256),
			g = Math.floor(Math.random() * 256),
			b = Math.floor(Math.random() * 256)

		colorArr.push(`rgb(${r}, ${g}, ${b})`)
		
		return colorArr
	},

	getQuery () {
		if (window.location.href.indexOf('htmlpreview') > -1) {
			return utils.getHash()
		}

		if (!window.location.search) return 'all'
		let querys = window.location.search
							.slice(1).split('&')

		querys = querys[0].split('=')[1]
		// URLdecode
		querys = decodeURI(querys)

		return JSON.parse(querys)
	},

	setQuery (obj) {
		if (window.location.href.indexOf('htmlpreview') > -1) {
			return utils.setHash(obj)
		}

		let url = window.location.href.replace(/\?(\w|\W)*$/, '')
		
		return url + '?q=' + JSON.stringify(obj)
	},
	
	getHash () {
		if (!window.location.hash) return 'all'
		return JSON.parse(decodeURI(window.location.hash.slice(1)))
	},

	setHash (obj) {
		let url = window.location.href.replace(/#(\w|\W)*$/, '')
		return url + '#' + JSON.stringify(obj)
	}

}