/**
 *	3-- cart
 * 		1- afficher panier si il existe V
 * 		2- calculer le total --/!\ ne pas stocker le total en local
 * 		3- modification quantitée produit
 * 		4- typage formulaire [REGEX]
 *
 */
 const Cart = localStorage
 const get_Cart = () => {
    return JSON.parse(Cart.getItem("cart_items"))
 }

const start = () => {
    let display = ""
    let Item_cart = get_Cart()

    if (Cart.getItem("cart_items") == null) {
        display = `<p>Panier vide.</p>`
        document.querySelector("#cart__items").insertAdjacentHTML("beforeend", display)
    } 
	else {
        fetch("http://localhost:3000/api/products")
            .then((result) => result.json())
            .then((data) => {
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
                //appel de la fonction sum avec en paramètre current_id et price <<- problème car plusieurs appelle de la fonction
                })
                document.querySelector("#cart__items").insertAdjacentHTML("beforeend", display)

                // pour chaque élément avec la classe .deteleItem > attendre le click                
                const delete_class = document.querySelectorAll(".deleteItem")
                // au click > appelle de la fonction delete_Item aven en paramètre la couleur et l'id de l'élément sélectionner
                delete_class.forEach(element =>{
                    element.addEventListener("click", e => {
                        delete_Item(
                            element.closest('.cart__item').getAttribute('data-id'),
                            element.closest('.cart__item').getAttribute('data-color'),
                            e.target.closest('.cart__item')
                        )
                    })
                })


                //appelle de fonction edit
                const selected_quantity = document.querySelectorAll(".itemQuantity")
                console.log(selected_quantity)
                  selected_quantity.forEach(element => {
                    console.log(element.value)
                    element.addEventListener('change', e => {
                        edit_Cart(
                            element.closest('.cart__item').getAttribute('data-id'),
                            element.closest('.cart__item').getAttribute('data-color'),
                            e.target.value, 
                            element.closest('.cart__item__content__settings__quantity').querySelector('p')
                        )
                    })
                })
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
}

window.addEventListener("load", start)
function delete_Item(deleted_id, deleted_color, target){
/** pour cet element, le supprime du panier
 * 
 */
    let Item_cart = get_Cart()
    //console.log(deleted_id,deleted_color)

    const itemMatch = (element) => element.product == deleted_id & element.color[0] == deleted_color 
    let index_delete = Item_cart.findIndex(itemMatch)
    //console.log(Item_cart.length)
    Item_cart.splice(index_delete, 1)
     Cart.setItem('cart_items', JSON.stringify(Item_cart))
    //console.log(Item_cart.length)
    alert('article supprimer')
    if (Item_cart.length == 0)
        Cart.removeItem('cart_items')  
    //supprime l'élément du dom     
    target.remove()

}


function edit_Cart(edited_id, edited_color, edited_quantity,target){
    /**
     * -doit modifier le localstorage 
     * -vérifie si la quantité a modifier est valide 
     * modification valeur > modifie la valeur sur l'input valeur
     */

    //récupère le panier
    let Item_cart = get_Cart()
    //const qui identifie l'index de l'élément a modifier
    const itemMatch = (element) => element.product == edited_id & element.color[0] == edited_color 
    let index_edit = Item_cart.findIndex(itemMatch)
   //console.log(Item_cart[index_edit])
    if (edited_quantity < 1 || edited_quantity > 100 )
        alert("merci de sélectionner une quantité entre 1 et 100")
    else{
        //modifie la valeur dans la variable  Item_cart
        Item_cart[index_edit].color[1] = edited_quantity
        //evoie la modification dans le localstorage
        Cart.setItem('cart_items', JSON.stringify(Item_cart))
        alert("quantité modifiée")
        target.innerHTML = `<p>Qté : ${edited_quantity}</p>`
    }
}

function Sum(){
   // affiche/modifie le total en fonction du panier enregistrer en localstorage a chaque appelle
   let Item_cart = get_Cart()
   let Totalprice = ``
   let Totalquantity = ``
   
   /** PRIX --------------------------------
    * Pour chaque index dans le panier, intéroger api sur le prix correspondant a cette ID,
    * (^Possible de le récupérer durant le premier appel ?^) 
    * le multiplier par la quantité du dit index 
    * l'additionner a totalprice
    * affiche
    *  */ 

   fetch("http://localhost:3000/api/products/" + id)
       .then((result) => result.json())
        .then((data) => {
         //   ???
        })
    .catch((err) =>
        console.log(err, alert("erreur le serveur de répond pas."))
    )
}