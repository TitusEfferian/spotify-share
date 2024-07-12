// Function to apply a border radius clip path
function applyBorderRadiusClip(
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	borderRadius: number
) {
	context.save();
	context.beginPath();
	context.moveTo(x + borderRadius, y);
	context.lineTo(x + width - borderRadius, y);
	context.quadraticCurveTo(x + width, y, x + width, y + borderRadius);
	context.lineTo(x + width, y + height - borderRadius);
	context.quadraticCurveTo(x + width, y + height, x + width - borderRadius, y + height);
	context.lineTo(x + borderRadius, y + height);
	context.quadraticCurveTo(x, y + height, x, y + height - borderRadius);
	context.lineTo(x, y + borderRadius);
	context.quadraticCurveTo(x, y, x + borderRadius, y);
	context.closePath();
	context.clip();
}

export default applyBorderRadiusClip;
