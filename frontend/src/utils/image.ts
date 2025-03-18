export const getImageUrl = (width: number, height: number, seed: number | string): string => {
    return `https://picsum.photos/${width}/${height}?random=${seed}`;
};

// 压缩图片
export const compressImage = async (file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
            const img = new Image()
            img.src = e.target?.result as string
            img.onload = () => {
                const canvas = document.createElement('canvas')
                let width = img.width
                let height = img.height

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width)
                    width = maxWidth
                }
                if (height > maxHeight) {
                    width = Math.round((width * maxHeight) / height)
                    height = maxHeight
                }

                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')
                if (!ctx) {
                    reject(new Error('无法创建 canvas 上下文'))
                    return
                }
                ctx.drawImage(img, 0, 0, width, height)
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob)
                        } else {
                            reject(new Error('图片压缩失败'))
                        }
                    },
                    'image/jpeg',
                    quality
                )
            }
            img.onerror = () => reject(new Error('图片加载失败'))
        }
        reader.onerror = () => reject(new Error('文件读取失败'))
    })
}

// 获取图片的 base64 编码
export const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = (error) => reject(error)
    })
}

// 验证图片类型和大小
export const validateImage = (file: File, maxSize = 5): boolean => {
    const isImage = file.type.startsWith('image/')
    const isLtMaxSize = file.size / 1024 / 1024 < maxSize

    if (!isImage) {
        throw new Error('只能上传图片文件')
    }
    if (!isLtMaxSize) {
        throw new Error(`图片大小不能超过 ${maxSize}MB!`)
    }
    return true
}

// 生成缩略图
export const generateThumbnail = async (file: File, maxWidth = 200, maxHeight = 200): Promise<string> => {
    const compressed = await compressImage(file, maxWidth, maxHeight, 0.6)
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.readAsDataURL(compressed)
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = () => reject(new Error('生成缩略图失败'))
    })
}