export function getImageData(
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number
) {
	return context.getImageData(x, y, width, height);
}

export function kMeansDominantColors(imageData: ImageData, k: number): string[] {
	const pixels = [];
	for (let i = 0; i < imageData.data.length; i += 4) {
		const r = imageData.data[i];
		const g = imageData.data[i + 1];
		const b = imageData.data[i + 2];
		pixels.push([r, g, b]);
	}

	const { clusters } = kmeans(pixels, k);

	const dominantColors = clusters.map((cluster) => {
		if (cluster && cluster.centroid) {
			const color = cluster.centroid;
			return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
		}
		return `rgb(0, 0, 0)`;
	});

	return dominantColors;
}

function kmeans(data: number[][], k: number) {
	if (data.length < k) {
		throw new Error('Not enough data points to form clusters.');
	}

	let centers = data.slice(0, k);
	let clusters = new Array(k);

	for (let iter = 0; iter < 100; iter++) {
		clusters = centers.map(() => ({ points: [], centroid: [0, 0, 0] }));

		for (const point of data) {
			let minDist = Infinity;
			let closestCenterIndex = 0;
			for (let i = 0; i < k; i++) {
				const dist = euclideanDistance(point, centers[i]);
				if (dist < minDist) {
					minDist = dist;
					closestCenterIndex = i;
				}
			}
			clusters[closestCenterIndex].points.push(point);
		}

		centers = clusters.map((cluster) => {
			if (cluster.points.length === 0) {
				return centers[Math.floor(Math.random() * centers.length)];
			}
			const mean = [0, 0, 0];
			for (const point of cluster.points) {
				mean[0] += point[0];
				mean[1] += point[1];
				mean[2] += point[2];
			}
			mean[0] /= cluster.points.length;
			mean[1] /= cluster.points.length;
			mean[2] /= cluster.points.length;
			cluster.centroid = mean;
			return mean;
		});
	}

	return { centers, clusters };
}

function euclideanDistance(a: number[], b: number[]): number {
	return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2) + Math.pow(a[2] - b[2], 2));
}
