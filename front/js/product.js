const start = () => {

	//récupération de l'id
	const url = new URL(window.location.href)
	const product_id = url.searchParams.get('id')

	//récupérer le produit sélectionner
	fetch("http://localhost:3000/api/products/" + product_id)
	.then(result => result.json())
	.then(data => {
		
		console.log("fiche produit :")
		console.log(data)
		console.log ("-------------------------------------")
		//remplir le dom
		//textContent
		document.querySelector('div.item__img').insertAdjacentHTML('beforeend',`<img src="${data.imageUrl}" alt="${data.altTxt}">`)
		document.querySelector('#title').textContent = data.name
		document.querySelector('#price').textContent = data.price
		document.querySelector('#description').textContent= data.description
		for (element in data.colors){
			document.querySelector('#colors').insertAdjacentHTML('beforeend',`<option value="${data.colors[element]}">${data.colors[element]}</option>`)
		}
	/**
	 * 3 -- envoyer les data de la page product a la page cart (localstorage)
	 * 		1 - renvoyer:
	 * 			/!\ vérifier que le canapé n'éxiste pas déjà dans le localstorage et si il existe, parse les donnée déjà enregistrer
	 * 			-id
	 * 			-color
	 * 			-nombre de canapé
	 * 			/!\ Pas plus de 100 canapé par couleur
	 * 
	 */
		let Cart = localStorage
		document.querySelector('#addToCart').addEventListener("click", addCart)

		//fonction enregistrer dans le panier
		function addCart(){
			//---------------------------------Condition panier existe -------------------------------
			if(Cart.getItem('cart_items') != null)
			{
				console.log('Panier existe')
				let Item_cart = JSON.parse(Cart.getItem('cart_items'))
				//Test unitaire vérification de valeur
				console.log('parsed item log------------------')
				console.log('product',JSON.parse(Cart.getItem("cart_items")))
				console.log('product_id',JSON.parse(Cart.getItem("cart_items"))[0].product)
				console.log('color',JSON.parse(Cart.getItem("cart_items"))[0].color[0])
				console.log('quantity',JSON.parse(Cart.getItem("cart_items"))[0].color[1])
				console.log('END OF Parsed item------------------')

				if (document.querySelector('#colors').value == "")
					alert("veuillez sélectionner une couleur")
				else{
					const selected_color = document.querySelector('#colors').value
					const quantity = parseInt(document.querySelector("#quantity").value)
						//Check si quantitée valide
					if (quantity >100 || quantity <= 0)
						alert("erreur, veuillez sélectionner une quantitée entre 1 et 100.")
					else{
						//------------------------------Condition panier existant-----------------------------------------------					
						let exist = false
							//Pour chaque tableau de Item_cart
						Item_cart.forEach(element => {
								//si ID de Item_cart existe déjà et color existe déjà
							if(element.product == product_id && element.color[0] == selected_color){
									//si Quantité existante + nouvelle quantité = entre 0 et 100
								if (quantity + element.color[1] <1 || quantity + element.color[1] > 100){
									alert(`erreur, vous avez déjà ${element.color[1]} canapé de la couleur ${selected_color}. Merci de ne pas dépasser 100.`)
									exist = true
								}
								else{
									element.color[1] = element.color[1] + quantity
										//edit quantité
									Cart.setItem('cart_items', JSON.stringify(Item_cart))
									alert(`vous avez au total ${element.color[1]} canapé de couleur ${selected_color}`)
									console.log("CAS 2 : id existant :" + product_id + ", quantité modifiée:" +element.color[1] +" , couleur existante:"+selected_color)
									exist = true
								}
							}		
						})
						//si exist est différent de false >
						if(!exist) {
								//New ID.
							Item_cart[Item_cart.length] = {'product':product_id, 'color':[selected_color,quantity]}
							Cart.setItem('cart_items', JSON.stringify(Item_cart))
							alert(`vous avez ajouter ${quantity} canapé de couleur ${selected_color}`)
							console.log("CAS 1 : nouvelle objet: " +product_id +', quantité: '+ quantity +', couleur: ' + selected_color)
						}
					}
				}
			}
			//---------------------------------Condition nouveau panier-------------------------------
			if(Cart.getItem('cart_items') == null)
			{
				console.log('Nouveau panier')
					//Check couleur sélectionée
				if (document.querySelector('#colors').value == "")
					alert("veuillez sélectionner une couleur")
				else{
					const selected_color = document.querySelector('#colors').value
					const quantity = parseInt(document.querySelector("#quantity").value)
						//Check si quantitée valide
					if (quantity > 100 || quantity <= 0)
						alert("erreur, veuillez sélectionner une quantitée entre 1 et 100.")
					else{	
						let Item_cart = [{'product':product_id, 'color':[selected_color,quantity]}]
						console.log("CAS 0: nouvelle objet: " +product_id +', quantité: '+ quantity +', couleur: ' + selected_color)	
						Cart.setItem('cart_items', JSON.stringify(Item_cart))
						alert(`vous avez ajouter ${quantity} canapé de couleur ${selected_color}`)
					}
				}
			}
			//----------------------------------------------------------------------------------------	
			console.log("-----------------------------------------------------------------------------")
		}
	})
	.catch(err => console.log(err))
}
window.addEventListener('load', start)