export function getImageWidthHeight(file: any): Promise<ObjectMap> {
	if (!file.type.includes('image/')) {
		// @ts-expect-error
		return {}
	} else {
		return new Promise(resolve => {
			const reader = new FileReader()
			reader.addEventListener('load', function (event_) {
				// 获取的是图片的base64代码
				const replaceSource: any = event_?.target?.result
				// 定义一个Image对象
				const image: any = new Image()
				image.addEventListener('load', () => {
					resolve({
						width: image.width,
						height: image.height
					})
				})
				image.src = replaceSource
			})
			reader.readAsDataURL(file)
		})
	}
}
