// 3.變數宣告
const menu = document.getElementById('menu')
const cart = document.getElementById('cart')
const totalAmountBox = document.getElementById('total-amount')
const button = document.getElementById('submit-button')
const totalAmount = "--"

let productData = [];
let cartItems = [];
//data driven概念: 當點擊加入購物車的時候，不需要靠DOM去找節點，而是利用所需的資料和結構，將必要資料存下來，可以避免未來改版或是畫面更動，不需要重新更動加入購物車的邏輯，提高維護性。
/* 加入cartItems的資料
  [
  {
    id: "product-1",
    name: "馬卡龍",
    price: 90, -> 180 -> 270 ...
    quantity: 1 --> 2 -> 3   ...
  }, 
  {
    id: "product-2",
    name: "草莓",
    price: 60,
    quantity: 1
  }, 
  {
    id: "product-3",
    name: "奶茶",
    price: 100,
    quantity: 1
  }, 
  {
    id: "product-4",
    name: "冰咖啡",
    price: 180,
    quantity: 1
  }
  ]
*/

let total = 0
// 4.GET API 菜單產品資料
axios.get('https://ac-w3-dom-pos.firebaseio.com/products.json')
  .then(response => {
    productData = response.data
    // 5.將產品資料加入菜單區塊
    displayProduct(productData);    // since async processing for axios
  })
  .catch(error => console.log(error));

function displayProduct(products) {
  products.forEach(product => menu.innerHTML += `
    <div class="col-3">
       <div class="card">
          <img src=${product.imgUrl} class="card-img-top" alt="...">
          <div class="card-body">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text">${product.price}</p>
            <a id=${product.id} href="#" class="btn btn-primary">加入購物車</a>
          </div>
        </div>
      </div>
  `)
}

// 6.加入購物車
function addToCart(event) {
  // 找到觸發event的node元素，並得到其產品id
  const id = event.target.id
  // 在productData的資料裡，找到點擊的產品資訊，加入 cartItems
  const addedItem = productData.find(product => product.id === id)
  const addedItemName = addedItem.name
  const addedItemPrice = addedItem.price
  // 加入購物車變數cartItems 分：有按過、沒按過
  const itemExists = cartItems.find(item => item.id === id)
  if (itemExists) {
    itemExists.quantity += 1;
  } else {
    // 將cartItem加到cartItems
    cartItems.push({
      id: id,
      name: addedItemName,
      price: addedItemPrice,
      quantity: 1
    })
  }
  console.log(cartItems)
  // 畫面顯示購物車清單
  // 每一次去遍歷cartItems陣列，然後拿到當前最新的資料渲染到html畫面上
  cart.innerHTML = cartItems.map(item => `<li class="list-group-item">${item.name} X ${item.quantity} 小計：${item.price * item.quantity}</li>`).join("")
  // 計算總金額
  calculateTotal(addedItemPrice)
}

// 7.計算總金額
function calculateTotal(amount) {
  total += amount
  totalAmountBox.textContent = total
}
// 8.送出訂單
function submit(event) {
  const message = cartItems.map(item => `${item.name} X ${item.quantity} 小計：${item.price * item.quantity}\n`).join("")
  // alert(`感謝購買！\n${message}\n共${total}元`)
  if (total === 0) {
    swal("您還沒加入購物車喔！", "請繼續選購", "warning")
  } else {
    swal({
      title: "請確認品項及數量",
      text: `${message}\n共${total}元`,
      icon: "warning",
      buttons: ["Cancel", "Confirm"],
      dangerMode: true,
    }).then(check => {
      if (check) {
        reset()
        swal("您已成功送出清單", "", "success")
      }
    })
  }

}

// 9.重置資料
function reset() {
  cartItems = []
  cart.innerHTML = ""
  total = 0
  totalAmountBox.textContent = totalAmount
}

// 10. 加入事件監聽
menu.addEventListener('click', addToCart)
button.addEventListener('click', submit)