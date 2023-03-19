const start = () => {

	fetch("http://localhost:3000/api/products")
	.then(result => result.json())
	.then(data => {
		let display= ''
		for(let article of data){
			display += `
				<a href="./product.html?id=${article._id}">
				<article>
					<img src="${article.imageUrl}" alt="${article.altTxt}">
					<h3 class="productName">${article.name}</h3>
					<p class="productDescription">${article.description}</p>
				</article>
			</a>`
		}
		document.querySelector('#items').insertAdjacentHTML('beforeend',display)
	})
	.catch(err => console.log(err,alert('erreur le serveur de répond pas.')))
}
window.addEventListener('load', start)