document.addEventListener('DOMContentLoaded', () => {
    const cartButtons = document.querySelectorAll('.buttons');
    const totalQuantityDisplay = document.getElementById('totalQuantity');
    const totalAmountDisplay = document.getElementById('totalAmount');
    const orderList = document.getElementById('orderList');
    const beforeSection = document.querySelector('.before');
    const icon = document.querySelector('.icon');
    const confirm = document.querySelector('.confirm');
    const card = document.querySelector('.card');
    const done = document.querySelector('.done');
    const container = document.querySelector('.container');
    const succeed = document.querySelector('.succeed');
    const orderTotal = document.getElementById('orderTotal');
    const CardOrder = document.getElementById('cardorder');

    let totalQuantity = 0;
    let totalAmount = 0;
    orderTotal.style.display = 'none';

    //loop for all button 

    cartButtons.forEach(buttonContainer => {
        const addToCartButton = buttonContainer.querySelector('.butt:not(.active)');
        const quantityButton = buttonContainer.querySelector('.butt.active');
        const incrementButton = quantityButton.querySelector('img[alt="increment"]');
        const decrementButton = quantityButton.querySelector('img[alt="decrement"]');
        const quantityDisplay = quantityButton.querySelector('span');
        const image = buttonContainer.closest('.top').querySelector('.image-h');
        const itemName = buttonContainer.closest('.top').querySelector('h2').textContent;
        const itemPrice = buttonContainer.closest('.top').querySelector('.price').textContent;
        let quantity = 0;

        //chick if number not text
        let numericPrice = parseFloat(itemPrice.replace(/[^0-9.-]+/g, ""));

        addToCartButton.addEventListener('click', () => {
            addToCartButton.style.display = 'none';
            quantityButton.style.display = 'flex';
            image.style.border = '3px solid var(--Red)';
            quantity = 1; //make order start to 1 
            quantityDisplay.textContent = quantity;
            updateOrderItem(itemName, numericPrice, quantity);
            updateTotalQuantity(1);
            updateTotalAmount(numericPrice); 
            beforeSection.style.display = 'none';
            icon.style.display = 'block';
            confirm.style.display = 'block';
            orderTotal.style.display = 'block';
        });

        //if i press the button + add 1 evrytime 

        incrementButton.addEventListener('click', () => {
            quantity++;
            quantityDisplay.textContent = quantity;
            updateOrderItem(itemName, numericPrice, quantity);
            updateTotalQuantity(1);
            updateTotalAmount(numericPrice);
        });

        //if i press the button 1 remove 1 evrytime 


        decrementButton.addEventListener('click', () => {
            if (quantity > 0) {
                quantity--;
                quantityDisplay.textContent = quantity;
                updateOrderItem(itemName, numericPrice, quantity);
                updateTotalQuantity(-1);
                updateTotalAmount(-numericPrice);
            }
            
            if (quantity < 1) {
                removeOrderItem(itemName);
                addToCartButton.style.display = 'flex';
                quantityButton.style.display = 'none';
                image.style.border = 'none';
            }
        });
    });

    //show card 
    confirm.addEventListener('click', () => {
        if (orderList.children.length > 0) {
            card.style.display = 'block';
        }
    });

    //show thank you and hide everything
    done.addEventListener('click', () => {
        container.style.display = 'none';
        card.style.display = 'none';
        succeed.style.display = 'block';
    });

    function updateTotalQuantity(change) {
        totalQuantity += change;
        totalQuantityDisplay.textContent = totalQuantity;
    }

    function updateTotalAmount(amount) {
        totalAmount += amount;
        totalAmountDisplay.textContent = `$${totalAmount.toFixed(2)}`;
    }

    function updateOrderItem(name, price, quantity) {
        let orderItem = orderList.querySelector(`.order-item[data-name="${name}"]`);
        const total = price * quantity;

        if (!orderItem) {
            orderItem = document.createElement('div');
            orderItem.classList.add('order-item');
            orderItem.setAttribute('data-name', name);
    
            const hr = document.createElement('hr');
            hr.classList.add('order-divider');
            orderList.appendChild(orderItem);
            orderList.appendChild(hr);
        }

        orderItem.innerHTML = `
            <p>${name}</p>
            <strong><span>${quantity}</span> x</strong>
            <span> @ $${price.toFixed(2)} total: $${total.toFixed(2)}</span>
        `;

        //if user press the img delet order and border
        const removeItemIcon = document.createElement('img');
        removeItemIcon.src = 'product-list-with-cart-main/assets/images/icon-remove-item.svg';
        removeItemIcon.alt = 'Remove Item';
        removeItemIcon.classList.add('remove-item-icon');
        removeItemIcon.style.width = '20px';
        removeItemIcon.style.height = 'auto';
        removeItemIcon.style.cursor = 'pointer';
        removeItemIcon.style.float = 'right';
        removeItemIcon.addEventListener('click', () => {
            removeOrderItem(name);
            updateTotalAmount(-total);
        });
        orderItem.appendChild(removeItemIcon);
    }

    function removeOrderItem(name) {
        const orderItem = orderList.querySelector(`.order-item[data-name="${name}"]`);
        //add hr after order
        const hr = orderItem.nextElementSibling;
    
        if (orderItem) {
            const quantity = parseInt(orderItem.querySelector('span').textContent);
            updateTotalQuantity(-quantity);
    
            orderList.removeChild(orderItem);
    
            if (hr && hr.classList.contains('order-divider')) {
                orderList.removeChild(hr);
            }
        }

        cartButtons.forEach(buttonContainer => {
            const itemName = buttonContainer.closest('.top').querySelector('h2').textContent;
            if (itemName === name) {
                const addToCartButton = buttonContainer.querySelector('.butt:not(.active)');
                const quantityButton = buttonContainer.querySelector('.butt.active');
                const quantityDisplay = quantityButton.querySelector('span');
                const image = buttonContainer.closest('.top').querySelector('.image-h');
    
                addToCartButton.style.display = 'flex';
                quantityButton.style.display = 'none';
                image.style.border = 'none';
                quantityDisplay.textContent = '0';
            }
        });
    
        if (orderList.children.length === 0) {
            beforeSection.style.display = 'block';
            icon.style.display = 'none';
            confirm.style.display = 'none';
            orderTotal.style.display = 'none';
        }
    }
});
