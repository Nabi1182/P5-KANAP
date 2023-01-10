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
        Sum()
    } 
	else {
        fetch("http://localhost:3000/api/products")
            .then((result) => result.json())
            .then((data) => {
                //Pour chaque objet du panier
                //console.log(article_data)
                let price_tab = []
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
                            //si id non enregistrer 
                            if (!price_tab.includes(article.product)) 
                                price_tab[price_tab.length] = {'product':article.product, 'price':element.price}
                        }
                    })
                //appel de la fonction sum avec en paramètre current_id et price <<- problème car plusieurs appelle de la fonction ?
                
                })
                Sum(price_tab)
               // console.log(price_tab)
                document.querySelector("#cart__items").insertAdjacentHTML("beforeend", display)
                
                // pour chaque élément avec la classe .deteleItem > attendre le click                
                const delete_class = document.querySelectorAll(".deleteItem")
                // au click > appelle de la fonction delete_Item avec en paramètre la couleur et l'id de l'élément sélectionner
                delete_class.forEach(element =>{
                    element.addEventListener("click", e => {
                        delete_Item(
                            element.closest('.cart__item').getAttribute('data-id'),
                            element.closest('.cart__item').getAttribute('data-color'),
                            e.target.closest('.cart__item')
                        ),Sum(price_tab)
                    })
                })


                //appelle de fonction edit
                const selected_quantity = document.querySelectorAll(".itemQuantity")
                //console.log(selected_quantity)
                  selected_quantity.forEach(element => {
                    //console.log(element.value)
                    element.addEventListener('change', e => {
                        edit_Cart(
                            element.closest('.cart__item').getAttribute('data-id'),
                            element.closest('.cart__item').getAttribute('data-color'),
                            e.target.value, 
                            element.closest('.cart__item__content__settings__quantity').querySelector('p')
                        ),Sum(price_tab)
                    })
                })
        })
        .catch((err) =>
            console.log(err, alert("erreur le serveur de répond pas."))
        )
    }
    document.querySelector('#order').addEventListener("click", formValidate)
}

window.addEventListener("load", start)
function delete_Item(deleted_id, deleted_color, target){
/** pour cet element, le supprime du panier
 * 
 */
    let Item_cart = get_Cart()
    //console.log(deleted_id,deleted_color)

    const itemMatch = (element) => element.product == deleted_id && element.color[0] == deleted_color 
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
        Item_cart[index_edit].color[1] = parseInt(edited_quantity)
        //evoie la modification dans le localstorage
        Cart.setItem('cart_items', JSON.stringify(Item_cart))
        alert("quantité modifiée")
        target.innerHTML = `<p>Qté : ${edited_quantity}</p>`
    }
}

function Sum(price) {
    // affiche/modifie le total en fonction du panier enregistrer en localstorage a chaque appelle
       /** PRIX --------------------------------
    * Pour chaque index dans le panier 
    * le multiplier par la quantité du dit index 
    * l'additionner a totalprice
    * affiche
    *  */ 
    if (arguments.length == 0){
        document.querySelector("#totalPrice").innerHTML = `0`
        document.querySelector("#totalQuantity").innerHTML = `0`
    }
    else{
        let totalPrice = 0
        let totalQuantity = 0
        let Item_cart = get_Cart()
        //pour chaque article du panier
        Item_cart.forEach((article) => {
            const itemPrice = price.find(element => element.product === article.product).price
        totalPrice += itemPrice * article.color[1]
        totalQuantity += article.color[1]
        })    
        //console.log(totalPrice)
        document.querySelector("#totalPrice").innerHTML = `${totalPrice}`
        document.querySelector("#totalQuantity").innerHTML = `${totalQuantity}`
    }
  }

//4- formulaire [REGEX]

/**
 * Récupérer les données du formulaire
 * les validé
 * gérer les cas d'erreur
 * créer un objet contact comme ceci : 
 *  * contact: {
 *   firstName: string,
 *   lastName: string,
 *   address: string,
 *   city: string,
 *   email: string
 * }
 *  * products: [string] <-- array of product _id
 * 
 */

function formValidate(){
    const nameRGEX= /^[^0-9_!¡?÷¿/\\+=@#$%ˆ&*²(){}|~<>;:[\]]{2,}$/g
    const lastnameRGEX= /^[^0-9_!¡?÷¿/\\+=@#$%ˆ&*²(){}|~<>;:[\]]{2,}$/g
    const mailRGEX= /^[\w-\.]+@([\w-]+\.)+[\w-]{2,8}$/g
    const cityRGEX= /^[^0-9_!¡?÷¿/\\+=@#$%ˆ&*²(){}|~<>;:[\]]+$/g
    const adressRGEX= /^[^!¡?÷¿/\\+=@$%ˆ&*²(){}|~<>;[\]]+$/g
    let verif = true
    

    if (nameRGEX.test(document.querySelector('#firstName').value) == false){
        document.querySelector('#firstNameErrorMsg').innerHTML='erreur, le format du prénom est incorrecte'
        verif = false
    }
     if (lastnameRGEX.test(document.querySelector('#lastName').value) == false){
        document.querySelector('#lastNameErrorMsg').innerHTML='erreur, le format du nom est incorrecte'
        verif = false
    }
    if (adressRGEX.test(document.querySelector('#address').value) == false){
        document.querySelector('#addressErrorMsg').innerHTML='erreur, le format de l\'adresse est incorrecte'
        verif = false
    }
    if (cityRGEX.test(document.querySelector('#city').value) == false){
        document.querySelector('#cityErrorMsg').innerHTML='erreur, le format de la ville est incorrecte'
        verif = false
    }
    if (mailRGEX.test(document.querySelector('#email').value) == false){
        document.querySelector('#emailErrorMsg').innerHTML='erreur, le format de l\'adresse email est incorrecte'
        verif = false
    }
    if (!verif){
        alert("formulaire erreur")
        return false
    }

    //commende envoi
    sendValue(verif)
}   

function sendValue(verif){
    if (verif == true){
        let Item_cart = get_Cart()
        let order = {
            contact:{ 
                firstName: document.querySelector('#firstName').value,
                lastName: document.querySelector('#lastName').value,
                address: document.querySelector('#address').value,
                city: document.querySelector('#city').value,
                email: document.querySelector('#email').value,
            },
            products : []
        }
        //construit l'array products
        Item_cart.forEach ((element) =>{
          order.products.push(element.product)
        })
        // objet a envoyer a l'api contenant la méthode et le contenu
        let ObjectToSend ={
            method :'POST',
            body: JSON.stringify(order),
            headers: {
                Accept : 'application/json',
                'Content-type': 'application/json'
            }
        }
        //récupére l'id de commande
        fetch("http://localhost:3000/api/products/order", ObjectToSend)
        .then(order_cmd => order_cmd.json())
        .then(body => {
        //    console.log(body.orderId)
            let a = body.orderId
            Cart.removeItem('cart_items')
            window.location.href = 'confirmation.html?id='+ a
        })

    }
    else{
        alert("erreur du formulaire, impossible d'envoyer les données au serveur.")
    }
}
