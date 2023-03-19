const start = () => {

	const url = new URL(window.location.href)
	const product_id = url.searchParams.get('id')

	fetch("http://localhost:3000/api/products/" + product_id)
	.then(result => result.json())
	.then(data => {
		
		document.querySelector('div.item__img').insertAdjacentHTML('beforeend',`<img src="${data.imageUrl}" alt="${data.altTxt}">`)
		document.querySelector('#title').textContent = data.name
		document.querySelector('#price').textContent = data.price
		document.querySelector('#description').textContent= data.description
		for (element in data.colors){
			document.querySelector('#colors').insertAdjacentHTML('beforeend',`<option value="${data.colors[element]}">${data.colors[element]}</option>`)
		}

		let Cart = localStorage
		document.querySelector('#addToCart').addEventListener("click", addCart)

		//fonction enregistrer dans le panier
		function addCart(){
			//---------------------------------Condition panier existe -------------------------------
			if(Cart.getItem('cart_items') != null)
			{
				let Item_cart = JSON.parse(Cart.getItem('cart_items'))
				if (document.querySelector('#colors').value == "")
					alert("veuillez sélectionner une couleur")
				else{
					const selected_color = document.querySelector('#colors').value
					const quantity = parseInt(document.querySelector("#quantity").value)
					if (quantity >100 || quantity <= 0)
						alert("erreur, veuillez sélectionner une quantitée entre 1 et 100.")
					else{
			//------------------------------Condition panier existant-------------------------------------				
						let exist = false
						Item_cart.forEach(element => {
							if(element.product == product_id && element.color[0] == selected_color){
								if (quantity + element.color[1] <1 || quantity + element.color[1] > 100){
									alert(`erreur, vous avez déjà ${element.color[1]} canapé de la couleur ${selected_color}. Merci de ne pas dépasser 100.`)
									exist = true
								}
								else{
									element.color[1] = element.color[1] + quantity
									Cart.setItem('cart_items', JSON.stringify(Item_cart))
									alert(`vous avez au total ${element.color[1]} canapé de couleur ${selected_color}`)
									exist = true
								}
							}		
						})
						if(!exist) {
							Item_cart[Item_cart.length] = {'product':product_id, 'color':[selected_color,quantity]}
							Cart.setItem('cart_items', JSON.stringify(Item_cart))
							alert(`vous avez ajouter ${quantity} canapé de couleur ${selected_color}`)
						}
					}
				}
			}
			//---------------------------------Condition nouveau panier-------------------------------
			if(Cart.getItem('cart_items') == null)
			{
				if (document.querySelector('#colors').value == "")
					alert("veuillez sélectionner une couleur")
				else{
					const selected_color = document.querySelector('#colors').value
					const quantity = parseInt(document.querySelector("#quantity").value)
					if (quantity > 100 || quantity <= 0)
						alert("erreur, veuillez sélectionner une quantitée entre 1 et 100.")
					else{	
						let Item_cart = [{'product':product_id, 'color':[selected_color,quantity]}]
						Cart.setItem('cart_items', JSON.stringify(Item_cart))
						alert(`vous avez ajouter ${quantity} canapé de couleur ${selected_color}`)
					}
				}
			}
		}
	})
	.catch(err => console.log(err))
}
window.addEventListener('load', start)