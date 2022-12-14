/**
 * 1-- index
 * 		1 Récupérer les produit
 * 		2 construire l'html
 * 		3 injecter l'html dans le dom
 * 			3.1 Pointer sur l'élément items
 * 			3.2 Injecter dans le dom

*/

//Attend que le dom soit entièrement charger
const start = () => {

	fetch("http://localhost:3000/api/products")
	.then(result => result.json())
	.then(data => {
		console.log(data)
		let display= ''
		for(let article of data){
				//console.log(article)
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