class DataController {
	constructor (data) {
		this.data = data
		this.regions = data.map((d) => {
			return d.region
		})
		this.products = data.map((d) => {
			return d.product
		})
	}

	getOne (primary, secondary) {
		// primary == strinng, secondary == string
		for (let i = 0; i < this.data.length; i++) {
			if ((primary == this.data[i]['region'] && secondary == this.data[i]['product']) ||
				(secondary == this.data[i]['region'] && primary == this.data[i]['product']))
				return this.data[i]
		}
		return {
			sale: []
		}
	}

	set (data) {
		this.data = data
	}

	getAll (item) {
		return this.data.filter((d) => {
			return item.indexOf(d.region) > -1 || item.indexOf(d.product) > -1
		})
	}

	reshape (region, product) {
		// region and product is a Array
		let result = {}, primary, secondary

		if (region.length == 0) region = this.regions
		if (product.length == 0) product = this.products

		primary = region.length <= product.length ? region : product,
		secondary = region.length <= product.length ? product : region

		primary.forEach((pri) => {
			result[pri] = {}

			secondary.forEach((sec) => {
				if (this.getOne(pri, sec)['sale'].length > 0) result[pri][sec] = this.getOne(pri, sec)['sale']
			})	
		})

		return result
	}
}