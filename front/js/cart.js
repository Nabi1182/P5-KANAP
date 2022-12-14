/**
 *	3-- cart
 * 		1- afficher panier si il existe V
 * 		2- calculer le total --/!\ ne pas stocker le total en local
 * 		3- modification quantitée produit
 * 		4- typage formulaire [REGEX]
 *
 */

const start = () => {
    let display = ""
    const Cart = localStorage

    if (Cart.getItem("cart_items") == null) {
        display = `<p>Panier vide.</p>`
        document.querySelector("#cart__items").insertAdjacentHTML("beforeend", display)
    } 
	else {
        fetch("http://localhost:3000/api/products")
            .then((result) => result.json())
            .then((data) => {
                let Item_cart = JSON.parse(Cart.getItem("cart_items"))
                //Pour chaque objet du panier
                //console.log(article_data)

                Item_cart.forEach((article) => {
                    data.forEach((element) => {
                        if (element._id == article.product) {
                            display += `<article class="cart__item" data-id="${element._id}" data-color="${article.color[0]}">
							<div class="cart__item__img">
							<img src="${element.imageUrl}" alt="Photographie d'un canapé">
						</div>
						<div class="cart__item__content">
						<div class="cart__item__content__description">
							<h2>${element.name}</h2>
							<p>${article.color[0]}</p>
							<p>${element.price} €</p>
						</div>
						<div class="cart__item__content__settings">
						<div class="cart__item__content__settings__quantity">
							<p>Qté : ${article.color[1]} </p>
							<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${article.color[1]}">
						</div>
							<div class="cart__item__content__settings__delete">
							<p class="deleteItem">Supprimer</p>
						</div>
						</div>
						</div>
					</article>`
                        }
                    })
                })
                document.querySelector("#cart__items").insertAdjacentHTML("beforeend", display)
            })
            .catch((err) =>
                console.log(err, alert("erreur le serveur de répond pas."))
            )
    }

/* 
 * 		3- modification quantitée produit
 *         /! if quantité = 0 > remove > reload cart
 * 		4- typage formulaire [REGEX]
 * 
 *
 */
	//ici


}
window.addEventListener("load", start)
