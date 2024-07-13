// Function to truncate text and add ellipsis if necessary
function truncateText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string {
	let width = context.measureText(text).width;
	const ellipsis = '...';
	const ellipsisWidth = context.measureText(ellipsis).width;
	if (width <= maxWidth) {
		return text;
	}
	while (width >= maxWidth - ellipsisWidth) {
		text = text.slice(0, -1);
		width = context.measureText(text).width;
	}
	return text + ellipsis;
}

export default truncateText;
