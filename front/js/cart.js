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
                        if (!price_tab.includes(article.product)) 
                            price_tab[price_tab.length] = {'product':article.product, 'price':element.price}
                        }
                    })  
                })
                Sum(price_tab)
                document.querySelector("#cart__items").insertAdjacentHTML("beforeend", display)            
                const delete_class = document.querySelectorAll(".deleteItem")
                delete_class.forEach(element =>{
                    element.addEventListener("click", e => {
                        delete_Item(
                            element.closest('.cart__item').getAttribute('data-id'),
                            element.closest('.cart__item').getAttribute('data-color'),
                            e.target.closest('.cart__item')
                        ),Sum(price_tab)
                    })
                })

                const selected_quantity = document.querySelectorAll(".itemQuantity")
                selected_quantity.forEach(element => {
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

/**
 * supprime un élément du panier dans le localstorage
 * @param {*} deleted_id id a supprimer du localstorage
 * @param {*} deleted_color couleur a supprimer du localstorage
 * @param {*} target Element a supprimer de l' Affichage du panier
 */
function delete_Item(deleted_id, deleted_color, target){
    let Item_cart = get_Cart()
    const itemMatch = (element) => element.product == deleted_id && element.color[0] == deleted_color 
    let index_delete = Item_cart.findIndex(itemMatch)
    Item_cart.splice(index_delete, 1)
    Cart.setItem('cart_items', JSON.stringify(Item_cart))
    alert('article supprimer')
    
    if (Item_cart.length == 0)
        Cart.removeItem('cart_items')
    target.remove()
}

/**
 * Modifie le localstorage après validations des champs dans le panier
 * @param {*} edited_id Id de l'élément sélectionner
 * @param {*} edited_color couleur de l'élément sélectionner
 * @param {*} edited_quantity quantité de l'élément sélectionner
 * @param {*} target élément de texte qui affiche la quantité
 */
function edit_Cart(edited_id, edited_color, edited_quantity,target){
    let Item_cart = get_Cart()
    const itemMatch = (element) => element.product == edited_id & element.color[0] == edited_color 
    let index_edit = Item_cart.findIndex(itemMatch)
    
    if (edited_quantity < 1 || edited_quantity > 100 )
        alert("merci de sélectionner une quantité entre 1 et 100")
    else{
        Item_cart[index_edit].color[1] = parseInt(edited_quantity)
        Cart.setItem('cart_items', JSON.stringify(Item_cart))
        alert("quantité modifiée")
        target.innerHTML = `<p>Qté : ${edited_quantity}</p>`
    }
}

/**
 * Affiche le total des articles du panier et modifie le total a chaques modifications
 * @param {Array} price Tableau contenant l'id et le prix des articles du panier
 */
function Sum(price) {
    if (arguments.length == 0){
        document.querySelector("#totalPrice").innerHTML = `0`
        document.querySelector("#totalQuantity").innerHTML = `0`
    }
    else{
        let totalPrice = 0
        let totalQuantity = 0
        let Item_cart = get_Cart()
        Item_cart.forEach((article) => {
            const itemPrice = price.find(element => element.product === article.product).price
        totalPrice += itemPrice * article.color[1]
        totalQuantity += article.color[1]
        })    

        document.querySelector("#totalPrice").innerHTML = `${totalPrice}`
        document.querySelector("#totalQuantity").innerHTML = `${totalQuantity}`
    }
  }

/**
 * Fonction de validations des champs de formulaire
 * @param {event} e prévient l'envoie du formulaire sans les vérification regex
 * @returns  true or false si les vérification regex son validée ou non
 */
function formValidate(e){
    e.preventDefault()
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
        return false
    }
    sendValue(verif)
}
   
/**
 * Evoie du formulaire a L'API et renvoie vers la page order avec le numméro de commande.
 * @param {boolean} verif Verif retournée par la fonction formValidate(true/false)
 */
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
        Item_cart.forEach ((element) =>{
            order.products.push(element.product)
        })
        let Payload ={
            method :'POST',
            body: JSON.stringify(order),
            headers: {
                Accept : 'application/json',
                'Content-type': 'application/json'
            }
        }
        fetch("http://localhost:3000/api/products/order", Payload)
        .then(order_cmd => order_cmd.json())
        .then(body => {
            let a = body.orderId
            Cart.removeItem('cart_items')
            window.location.href = 'confirmation.html?id='+ a
        })
    }
    else{
        alert("erreur du formulaire, impossible d'envoyer les données au serveur.")
    }
}