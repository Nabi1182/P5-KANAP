let display = () => {
	const url_id = new URLSearchParams(window.location.search)
	document.querySelector('#orderId').textContent = url_id.get('id')
}
window.addEventListener('load', () => display())