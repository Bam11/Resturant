const navItems = document.getElementById("nav_items");
const navBtn = document.getElementById("nav_btn");

navBtn.addEventListener('click', () =>{
  navItems.classList.toggle('hidden');
  navItems.classList.toggle('flex');
})


function checkSliderButtons(sliderContainer) {
  const slider = sliderContainer.querySelector('.slider');
  const prevBtn = sliderContainer.querySelector('.prevBtn');
  const nextBtn = sliderContainer.querySelector('.nextBtn'); 

  prevBtn.disabled = slider.scrollLeft === 0;
  nextBtn.disabled = Math.ceil(slider.scrollLeft + slider.clientWidth) >= slider.scrollWidth;
}

function initializeSliderButtons(sliderContainer) {
  const slider = sliderContainer.querySelector('.slider');
  const prevBtn = sliderContainer.querySelector('.prevBtn');
  const nextBtn = sliderContainer.querySelector('.nextBtn');

  checkSliderButtons(sliderContainer);

  prevBtn.addEventListener('click', () => {
    slider.scrollBy({left: -300, behavior: 'smooth'});
    setTimeout(() => {
      checkSliderButtons(slider.parentElement);
    }, 300);
  });

  nextBtn.addEventListener('click', () => {
    slider.scrollBy({left: 300, behavior: 'smooth'});
    setTimeout(() => {
      checkSliderButtons(slider.parentElement);
    }, 300);
  });
};

function cardComponent (r){
  return `
    <div class="products item card cursor-grab flex-shrink-0 w-60 bg-white shadow-lg overflow-hidden rounded-lg" data-id="${r.id}">
      <img src="${r.image}" alt="" class="w-full object-cover aspect-[4/3]">
        <div class="p-4 text-sm">
          <h2 title="${r.name}" class="font-bold text-lg whitespace-nowrap overflow-hidden text-ellipsis">${r.name}</h2>
          <p> 
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id, voluptatibus esse saepe ratione temporibus amet deleniti praesentium aspernatur.
          </p>
            <hr class="my-3">
          <p class="text-green-600 semi-bold price">
            <i class="fa-solid fa-naira-sign"></i> ${r.price || 2500}
          </p>
            <hr class="my-3">
          <p class="text-gray-600">${r.prepTimeMinutes} mins</p>
            <hr class="my-3">
          <button type="button" class="cursor-pointer mx-auto w-full py-1 px-4 bg-[#ffc400] font-semibold shadow-lg text-black rounded-lg">
            <a href="">Order Now</a>
          </button>
          <button type="button" class="addCart cursor-pointer mx-auto w-full mt-3 py-1 px-4 bg-red-500 text-white font-semibold shadow-lg rounded-lg">
            Add to cart
          </button>

        </div>
    </div>    

  `
}

let carts = JSON.parse(localStorage.getItem('carts')) || [];
let listCartHTML = document.querySelector('.listCart');
let iconCartSpan = document.querySelector('.icon-cart span');

let allProducts = JSON.parse(localStorage.getItem('products')) || [];

const addToCart = (productId) => {
  let positionThisProductInCart = carts.findIndex((value) => value.productId == productId);
  if(carts.length <= 0){
    carts =[{
       productId: productId,
        quantity: 1
      }]
  }else if(positionThisProductInCart < 0){
    carts.push({
      productId: productId,
      quantity: 1
    });
  } else{
      carts[positionThisProductInCart].quantity = carts[positionThisProductInCart].quantity + 1; 
    }

    localStorage.setItem('carts', JSON.stringify(carts));
    addCartToHTML();
}

const addCartToHTML = () => {
  let totalQuantity = 0; 

  if (listCartHTML) {
    listCartHTML.innerHTML = '';
  }

  if (carts.length > 0) {
    carts.forEach(cart => {
      totalQuantity += cart.quantity;

      if (listCartHTML) { 
        const product = allProducts.find(item => item.id == cart.productId);
        if (product) {
          listCartHTML.innerHTML += `
            <div class="item grid grid-cols-[1fr_150px_50px_170px] gap-2 items-center text-center" data-id="${cart.productId}">
              <div class="w-60">
                <img src="${product.image}" alt="" class="w-full object-cover aspect-[4/3]">
              </div>
              <h2>${product.name}</h2>
              <p class="totalPrice"><i class="fa-solid fa-naira-sign"></i> ${(Number(product.price) || 2500) * cart.quantity}</p>
              <div class="quantity">
                <span class="w-6 h-6 bg-[#ffc400] text-white rounded-full cursor-pointer px-3 py-2 text-sm minus">-</span>
                <span class="w-6 h-6 bg-[#ffc400] text-white rounded-full cursor-pointer px-3 py-2 text-sm">${cart.quantity}</span>
                <span class="w-6 h-6 bg-[#ffc400] text-white rounded-full cursor-pointer px-3 py-2 text-sm plus">+</span>
                <button type="button" class="remove">x</button>
              </div>
            </div>
          `;
        }
      }
    });
  }

  if (iconCartSpan) {
    iconCartSpan.innerText = totalQuantity;
  }

  if (listCartHTML) {
    updateTotalPrice();
  }
};


  

  const updateTotalPrice = () => {
  let total = 0;
  carts.forEach((cartItem) => {
    const p = allProducts.find(it => String(it.id) === String(cartItem.productId));
    const unit = Number(p?.price) || 2500; 
    total += unit * cartItem.quantity;
  });

  document.querySelector('.total-price').innerHTML = `Total: <i class="fa-solid fa-naira-sign"></i> ${total}`;
};

function changeQuantity(productId, type) {
  const i = carts.findIndex(it => String(it.productId) === String(productId));
  if (i === -1) return;

  if (type === 'plus') {
    carts[i].quantity += 1;
  } else {
    carts[i].quantity -= 1;
    if (carts[i].quantity <= 0) carts.splice(i, 1);
  }

  localStorage.setItem('carts', JSON.stringify(carts));
  addCartToHTML(); 
}



if (document.body.classList.contains("index-page")) {

  const carouselInner = document.querySelector('.carousel-inner');
  const carouselItems = document.querySelectorAll('.carousel-items');
  const prevButton = document.getElementById('prev');
  const nextButton = document.getElementById('next');

  let currentSlide = 0;

  function updateCarousel(){
    const slideWidth = carouselItems[0].clientWidth;
    carouselInner.style.transform = `translateX(-${currentSlide * slideWidth}px)`;  

    prevButton.disabled = currentSlide === 0;

    nextButton.disabled = currentSlide === carouselItems.length - 1;
  }

  nextButton.addEventListener('click', ()=>{ 
    if(currentSlide < carouselItems.length - 1) {
      currentSlide++;
    } else{
      currentSlide = 0;
    }

    updateCarousel();
  })

  prevButton.addEventListener('click', ()=>{
    if(currentSlide > 0) {
      currentSlide--;
    } else {
      currentSlide = carouselItems.length - 1;
    }

    updateCarousel();
  })

  window.addEventListener('resize', updateCarousel);  

  const sliders = document.querySelectorAll('.slider');

  let isDragging = false;
  let startX;
  let scrollLeft;
  
  sliders.forEach(slider => {
  const prevBtn = slider.querySelector('.prevBtn');
  const nextBtn = slider.querySelector('.nextBtn');
  slider.addEventListener('scroll', () => checkSliderButtons(slider.parentElement));

  slider.addEventListener('click', (event) => {
    let clickedElement = event.target;
    const addCartBtn = clickedElement.closest('.addCart');

    if (addCartBtn) {
      // Find the closest parent with the data-id attribute
      const card = addCartBtn.closest('.card');
      if (card) {
        const productId = card.dataset.id;
        console.log(`Product ID to add to cart: ${productId}`);
        
        addToCart(productId);
      }
    }
  });


  

  
  slider.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  })  ;

  slider.addEventListener('mouseleave', e => {
    isDragging = false;
    
  });
  
  slider.addEventListener('mouseup', e => {
    isDragging = false;
  });

  slider.addEventListener('mousemove', e => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = x - startX;  
    slider.scrollLeft = scrollLeft - walk;
  });

  prevBtn.addEventListener('click', () => {
    slider.scrollBy({left: -300, behavior: 'smooth'});
    setTimeout(() => {
      checkSliderButtons(slider.parentElement);
    }, 300);
  });

  nextBtn.addEventListener('click', () => {
    slider.scrollBy({left: 300, behavior: 'smooth'});
    setTimeout(() => {
      checkSliderButtons(slider.parentElement);
    }, 300);
  });

  checkSliderButtons(slider.parentElement);


});

const exciting = document.querySelector('#exciting').querySelector('.slider');
const european = document.querySelector('#european').querySelector('.slider');

let allProducts = [];

//api integration
fetch('https://dummyjson.com/recipes/').then(res => res.json()).then(data => {
  console.log(data);
  listProduct = data.recipes;
  allProducts = [...allProducts, ...data.recipes];
  localStorage.setItem('products', JSON.stringify(allProducts));
  exciting.innerHTML += listProduct.map(cardComponent).join('');

  initializeSliderButtons(exciting.parentElement);
});

fetch('https://dummyjson.com/recipes/tag/Italian').then(res => res.json()).then(data => {
  console.log(data);
  listProduct = data.recipes;
  allProducts = [...allProducts, ...data.recipes];
  localStorage.setItem('products', JSON.stringify(allProducts));
  european.innerHTML += data.recipes.map(cardComponent).join('');

  initializeSliderButtons(european.parentElement);
});

}


if (document.body.classList.contains("cart-page")) {
  addCartToHTML();

  listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
      let productId = positionClick.closest('.item').dataset.id;
      let type = 'minus';
      if(positionClick.classList.contains('plus')){
        type = 'plus';
      }
      changeQuantity(productId, type);
      
    }

    if(positionClick.classList.contains('remove')){
      let productId = positionClick.closest('.item').dataset.id;
      carts = carts.filter(cartItem => String(cartItem.productId) != String(productId));
      localStorage.setItem('carts', JSON.stringify(carts))
      addCartToHTML();
    }

  });
}
