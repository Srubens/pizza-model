(function(){
    'use script'
    
    console.log('ola mundo')
    console.log('Rubens Filipe')
    /**
     * CRIAR UM ARQUIVO JSON PARA SIMULAR DADOS DO BANCO
     * 
     */

    // console.log(pizzaJson)
    let cart = []
    let modalKey = 0
    
    /**
     * FUNÇÕES AUXILIARES
     */
    const myElement = (el) => document.querySelector(el);
    const myElements = (el) => document.querySelectorAll(el);
    let qtdModal = 1;

    //LISTAGEM DAS PIZZAS
    pizzaJson.map( (item, index) =>{
        // console.log(item)
        let pizzaItem = myElement('.models .pizza-item').cloneNode(true);
        pizzaItem.setAttribute('data-key', index);
        console.log(pizzaItem.setAttribute('data-key', index))
        pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
        pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
        // pizzaItem.querySelector('.pizza-item--price').innerHTML = `${item.price.toLocaleString('pt-br',{style:'currency', currency:'BRL'})}`;
        pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
        pizzaItem.querySelector('.pizza-item--img img').src = item.img;

        
        pizzaItem.querySelector('a').addEventListener('click', (e)=>{
            e.preventDefault()
            // console.log('clicou')
            let key = e.target.closest('.pizza-item').getAttribute('data-key');
            console.log('pizza clicada', key)
            console.log(pizzaJson[key])

            modalKey = key;

            //COLOCANDO VALORES NO MODAL
            myElement('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
            myElement('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
            myElement('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
            myElement('.pizzaBig img').src = pizzaJson[key].img;

            myElement('.pizzaInfo--size.selected').classList.remove('selected');

            myElements('.pizzaInfo--size').forEach((value,index)=>{
                if(index == 2){
                    value.classList.add('selected')
                }

                value.querySelector('span').innerHTML = pizzaJson[key].sizes[index];
            })

            myElement('.pizzaInfo--qt').innerHTML = qtdModal;

            //COLOCANDO VALORES NO MODAL

            myElement('.pizzaWindowArea').style.opacity = 0;
            myElement('.pizzaWindowArea').style.display = "flex";
            setTimeout(()=>{
                myElement('.pizzaWindowArea').style.opacity = 1;
            },200)
        })

        myElement('.pizza-area').append(pizzaItem);
        console.log(pizzaItem);
    });


    /**
     * EVENTOS DO MODAL
     */
    function closeModal(){
        myElement('.pizzaWindowArea').style.opacity = 0;
        setTimeout(() => {
            myElement('.pizzaWindowArea').style.display = "none";
        }, 200);
    }

    myElements('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
        item.addEventListener('click', closeModal)
    })
    console.log(myElements('.pizzaInfo--cancelButton','.pizzaInfo--cancelMobileButton'))

    myElement('.pizzaInfo--qtmenos').addEventListener('click', ()=> {
        if(qtdModal > 1){
            qtdModal--;
            myElement('.pizzaInfo--qt').innerHTML = qtdModal;
        }else{
            qtdModal = 1;
            myElement('.pizzaInfo--qt').innerHTML = qtdModal;
        }
    })
    
    myElement('.pizzaInfo--qtmais').addEventListener('click', ()=> {
        qtdModal++;
        myElement('.pizzaInfo--qt').innerHTML = qtdModal;
    })

    myElements('.pizzaInfo--size').forEach((value, index) => {
        value.addEventListener('click', (e)=>{
            myElement('.pizzaInfo--size.selected').classList.remove('selected');
            value.classList.add('selected');
            console.log(value)
        })
    })

    //ADD AO CARRINHO
    myElement('.pizzaInfo--addButton').addEventListener('click', ()=>{
        let size = parseInt(myElement('.pizzaInfo--size.selected').getAttribute('data-key'))

        let indentifier = pizzaJson[modalKey].id+'@'+size;
        console.log(indentifier)

        let key = cart.findIndex((item)=> item.indentifier == indentifier )

        if( key > -1 ){
            cart[key].qt += qtdModal;
        }else{
            cart.push({
                indentifier,
                id:pizzaJson[modalKey].id,
                size,
                qt:qtdModal
            })
        }

        console.log(cart)
        updateCart()
        closeModal()
    })

    myElement('.menu-closer').addEventListener('click', ()=>{
        myElement('aside').style.left = '100em';
    })

    myElement('.menu-openner').addEventListener('click', ()=>{
        if(cart.length > 0){
            myElement('aside').style.left = '0';
        }
    })

    //ATUALIZANDO O CARRINHO 
    function updateCart(){
        myElement('.menu-openner span').innerHTML = cart.length;

        if(cart.length > 0){
            myElement('aside').classList.add('show')
            myElement('.cart').innerHTML = ''
            let subtotal = 0
            let desconto = 0
            let total = 0
            for(let i in cart){
                let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id)
                subtotal += pizzaItem.price * cart[i].qt
                console.log(pizzaItem)
                let cartItem = myElement('.models .cart--item').cloneNode(true)
                let pizzaSizeName;

                switch(cart[i].size){
                    case 0:
                        pizzaSizeName = 'P'
                    break;
                    case 1:
                        pizzaSizeName = 'M'
                    break;
                    case 2:
                        pizzaSizeName = 'G'
                    break;
                }

                let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

                cartItem.querySelector('img').src = pizzaItem.img
                cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
                cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt
                cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                    if(cart[i].qt > 1){
                        cart[i].qt--
                    }else{
                        cart.splice(i,1)
                    }
                    updateCart()
                })
                cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                    cart[i].qt++;
                    updateCart()
                })

                myElement('.cart').append(cartItem)
            }

            // desconto = 0
            desconto = subtotal * 0.1
            total = subtotal - desconto
            myElement('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
            myElement('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
            myElement('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

        }else{
            myElement('aside').classList.remove('show')
            myElement('aside').style.left = '100em';
        }
    }



    
    


})()