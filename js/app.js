import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  limit,
  collection,
  onSnapshot,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  query,addDoc,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB7tXC_WwsU-bxv3xqFt9JTdFUj-3wmmms",
  authDomain: "game-3df4d.firebaseapp.com",
  projectId: "game-3df4d",
  storageBucket: "game-3df4d.firebasestorage.app",
  messagingSenderId: "324919159749",
  appId: "1:324919159749:web:1ef8ee2197c68bcf65b9ac",
  measurementId: "G-E9912X3V8B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Proper initialization of auth

const db = getFirestore(app);

// / ===================== HEADER CODE START ======================
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  if (header) {
    fetch("../header.html")
      .then((res) => res.text())
      .then((data) => {
        header.innerHTML = data;


       // ========== ADD TO CART CODE START ===============
       function loadCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartContainer = document.getElementById("cartItems");
  const cartTitle = document.getElementById("offcanvasScrollingLabel");
  const totalEl = document.getElementById("cartTotal");

  cartTitle.innerText = `Cart (${cart.length})`;
document.getElementById("cart_length").innerHTML=cart.length;
  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="text-center">YOUR BAG IS EMPTY</p>`;
    totalEl.innerText = 0;
    return;
  }


  let html = "";
  let grandTotal = 0;

  cart.forEach((item, index) => {
    grandTotal += item.total;

    html += `
      <div class="d-flex mb-3 border-bottom pb-2">

        <img src="${item.img}" width="70" class="rounded me-2 img_of_cart">

        <div class="flex-grow-1">
          <h6>${item.name}</h6>

          <!-- 🔥 QUANTITY CONTROL -->
          <div class="d-flex align-items-center gap-2 my-2">
            <button class="btn btn-sm btn-outline-dark qtyMinus" data-index="${index}">-</button>
            <span>${item.quantity}</span>
            <button class="btn btn-sm btn-outline-dark qtyPlus" data-index="${index}">+</button>
          </div>

          <span>Rs ${item.total}</span>
        </div>

        <button class="btn btn-sm removeItem" data-index="${index}">
   <i class="hgi hgi-stroke hgi-delete-01 fs-5 bg-gray"></i>
        </button>

      </div>
    `;
  });

  cartContainer.innerHTML = html;
  totalEl.innerText = grandTotal;


}document.addEventListener("click", (e) => {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // ➕ INCREASE
  if (e.target.classList.contains("qtyPlus")) {
    const i = e.target.dataset.index;

    cart[i].quantity++;
    cart[i].total = cart[i].quantity * cart[i].price;
  }

  // ➖ DECREASE
  if (e.target.classList.contains("qtyMinus")) {
    const i = e.target.dataset.index;

    if (cart[i].quantity > 1) {
      cart[i].quantity--;
      cart[i].total = cart[i].quantity * cart[i].price;
    }
  }

  // ❌ REMOVE
  if (e.target.classList.contains("removeItem")) {
    const i = e.target.dataset.index;
    cart.splice(i, 1);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  
  loadCart();


});
loadCart();
      //  =========== ADD TO CART CODE END =================

        //  ================== store_dropdown CODE START ==================
        var category_dropdown = document.getElementById("category_dropdown");
        // console.log(category_dropdown);
        
        if (category_dropdown) {
    
           async function fetchStoreData0() {


    try {
      const storeCollection = collection(db, "categories");
      const snapshot = await getDocs(storeCollection);

      if (snapshot.empty) {
        category_dropdown.innerHTML = `<tr><td colspan="7" class="text-center">No stores found</td></tr>`;
        return;
      }

      let counter = 1;

      snapshot.forEach((docSnap) => {
        // console.log(docSnap.data());
        
        
if(docSnap.data().status == "active" ){
          category_dropdown.innerHTML += `
    <li class="list-group-item border-0 px-0">
  <a href="/category/categories.html?=${docSnap.data().slug}" 
     class="text-decoration-none d-block py-2 px-3 rounded hover-bg-light a_cat">
     
     ${docSnap.data().name}
     
  </a>
</li>
   
    `;
}
      });
    } catch (err) {
      console.error("Error fetching store data:", err);
      category_dropdown.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error loading data</td></tr>`;
    }
  }
  fetchStoreData0();
        }
        // =================== store_dropdown CODE END ====================

        //  ================== store_dropdown mobile CODE START ==================
        var store_dropdown_mobile = document.getElementById(
          "store_dropdown_mobile"
        );
        if (store_dropdown_mobile) {
          var store_dropdown_mobile = document.getElementById(
            "store_dropdown_mobile"
          );
          async function loadStores() {
            try {
              const storeSnapshot = await getDocs(collection(db, "store"));
              storeSnapshot.forEach((doc) => {
                const data = doc.data();
                store_dropdown_mobile.innerHTML += `
       <li><a class="dropdown-item" href="/store/store.html?=${data.name}">${data.name}</a></li>`;
              });
            } catch (err) {
              // console.error("Error fetching stores:", err);
              store_dropdown_mobile.innerHTML = `<option value="">Error loading stores</option>`;
            }
          }
          loadStores();
        }
        // =================== store_dropdown mobile CODE END ====================

        // =================== CATEOGERY DROPDOWN CODE START =================
        var category_dropdown = document.getElementById("category_dropdown");

        if (category_dropdown) {
          async function loadStores2() {
            try {
              // 1️⃣ STORE DATA GROUPED BY CATEGORY
              const storeSnapshot = await getDocs(collection(db, "category"));
              const storeMap = {}; // { category: [stores] }

              storeSnapshot.forEach((doc) => {
                const data = doc.data();
                if (!data.category) return;

                if (!storeMap[data.category]) {
                  storeMap[data.category] = [];
                }

                storeMap[data.category].push(data);
              });

              // 2️⃣ CATEGORY DATA
              const categorySnapshot = await getDocs(
                collection(db, "categories")
              );

              categorySnapshot.forEach((doc) => {
                const cat = doc.data();
                const categoryName = cat.metaTitle;
                // console.log(doc.id);

                if (!storeMap[categoryName]) return;
                // console.log(cat);
if(cat.isEnabled === true && cat.showTop == true){

                // CATEGORY HEADING
                var html = `
          <li class="nav-item dropdown-mega col-lg-3 mb-5 ">
            <h6 class="dropdown-header fs-6 ">${cat.pageTitle}</h6>
          <ul class="list-unstyled ps-3">
        `;

                // STORES UNDER CATEGORY
                storeMap[categoryName].forEach((store) => {
                  
                  if(store.status == "active"){
                  
                  html += `
            <li>
              <a class="dropdown-item" href="/store/store.html?=${store.name}">
                ${store.name}
              </a>
            </li>
          `;
              }});

                html += `
            </ul>
          </li>
        `;

                category_dropdown.innerHTML += html;
             } });
            } catch (err) {
              console.error(err);
            }
          }

          loadStores2();
        }

        // =================== CATEOGERY DRODPWON CODE END ===================

        // =================== CATEOGERY DROPDOWN MOBILE CODE START =================
        var category_dropdown_mobile = document.getElementById(
          "category_dropdown_mobile"
        );
        if (category_dropdown_mobile) {
          async function loadStores2() {
            try {
              const storeSnapshot = await getDocs(collection(db, "categories"));

              storeSnapshot.forEach((doc) => {
                const data = doc.data();

                category_dropdown_mobile.innerHTML += `
       <li><a class="dropdown-item" href="single_category.html?=${doc.id}">${data.pageTitle}</a></li>`;
              });
            } catch (err) {
              console.error("Error fetching stores:", err);
              category_dropdown_mobile.innerHTML = `<option value="">Error loading stores</option>`;
            }
          }
          loadStores2();
        }
        // =================== CATEOGERY DRODPWON MOBILE CODE END ===================

        // ============= themes_codes CODE START =================
        //     var themes_codes_btn=document.getElementById("theme_btn");
        //     var themes_codes_value_Set=localStorage.getItem("themes_codes");
        // var nav_logo=document.getElementById("nav_logo");
        // if(!themes_codes_value_Set){
        //   localStorage.setItem("themes_codes","white");
        //   document.body.classList.add("white")

        // }

        //       themes_codes_btn.addEventListener("click",(et)=>{
        //       et.preventDefault();

        //       var themes_codes_value=localStorage.getItem("themes_codes");

        //       if(themes_codes_value === "white"){

        //         localStorage.setItem("themes_codes","black")
        //         document.body.classList.add("black")
        //         document.body.classList.remove("white")
        //         nav_logo.src = "assets/images/logo/light_logo.png";
        //         themes_codes_btn.innerHTML=`     <i class="fa-solid fa-moon"></i>`

        //       }
        //       else{
        //         localStorage.setItem("themes_codes","white")

        //         document.body.classList.add("white")

        //         document.body.classList.remove("black")
        //  nav_logo.src = "assets/images/logo/logo.png";
        //         themes_codes_btn.innerHTML=`     <i class="fa-solid fa-moon"></i>`

        //       }

        //   console.log(localStorage.getItem("themes_codes"));

        //       })
        // ============= themes_codes CODE END ===================
        // ============ CURSOR CODE START ================
        var cusor_body = document.getElementById("cursor_body");

        if (cusor_body) {
          document.addEventListener("mousemove", (e) => {
            cusor_body.style.top = e.clientY + "px";
            cusor_body.style.left = e.clientX + "px";
          });
        }
        // ============ CURSOR CODE END ================
      });
    // .catch((err) => console.error("Error loading header:", err));
  }
});
// ===================== HEADER CODE END ======================

// ===================== HEADER CODE START ======================
document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("banner");
  if (banner) {
    fetch("../banner.html")
      .then((res) => res.text())
      .then((data) => {
        banner.innerHTML = data;
      })
      .catch((err) => console.error("Error loading header:", err));
  }
});
// ===================== HEADER CODE END ======================

// ===================== FOOTER CODE START ======================
var footer = document.getElementById("footer");
if (footer) {
  // ===================== footer CODE START ======================
  fetch("../footer.html")
    .then((e) => e.text())
    .then((data) => {
      footer.innerHTML = data;
    });
}
// ===================== FOOTER CODE END ======================

// ===================== cashback CODE START ======================
var cashback = document.getElementById("cashback");
if (cashback) {
  // ===================== cashback CODE START ======================
  fetch("../cashback.html")
    .then((e) => e.text())
    .then((data) => {
      cashback.innerHTML = data;
    });
}
// ===================== cashback CODE END ======================

// ===================== product_deal CODE START ======================
var product_deal = document.getElementById("product_deal");
if (product_deal) {
  // ===================== product_deal CODE START ======================
  fetch("../product_deal.html")
    .then((e) => e.text())
    .then((data) => {
      product_deal.innerHTML = data;
    });
}
// ===================== product_deal CODE END ======================

// ============ MAEUQE ACTIVE CODE START =====================
document.addEventListener("DOMContentLoaded", () => {
  const marque_container = document.getElementById("marque_container");

  if (marque_container) {
    window.addEventListener("scroll", () => {
      const rect = marque_container.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 30) {
        marque_container.classList.add("maruqe_active");
      } else {
        marque_container.classList.remove("maruqe_active");
      }
    });
  }
});

// ============ MAEUQE ACTIVE CODE END =======================

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");

  if (sections.length > 0) {
    window.addEventListener("scroll", () => {
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight - 240 && rect.bottom > 0) {
          section.classList.add("active_section");
        } else {
          section.classList.remove("active_section");
        }
      });
    });
  } else {
    // console.log("❌ No <section> found");
  }
});

// =============== service-block-container start ===================

document.addEventListener("DOMContentLoaded", () => {
  const service_block_container = document.querySelectorAll(
    ".service-block-container"
  );

  if (service_block_container.length > 0) {
    window.addEventListener("scroll", () => {
      service_block_container.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight - 180 && rect.bottom > 0) {
          section.classList.add("active_sservice_block_container");
        } else {
          section.classList.remove("active_sservice_block_container");
        }
      });
    });
  } else {
    // console.log("❌/ No <section> found");
  }
});

// =============== service-block-container end ===================

// ================ STORE CODE HOME PAGE START =====================
var store_innerhtml = document.getElementById("store_innerhtml");
if (store_innerhtml) {
  // ============ SWIPER CODE START ================
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: 1,
    spaceBetween: 24,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      // Responsive for mobile/tablet
      0: {
        slidesPerView: 1,
      },
      640: {
        slidesPerView: 2,
      },
      768: {
        slidesPerView: 4,
      },
    },
  });
  // ============ SWIPER CODE END ==================

  // FETCH STORES
  async function fetchStoreData0() {
    store_innerhtml.innerHTML = ""; // Clear previous data

    try {
      const storeCollection = collection(db, "store");
      const snapshot = await getDocs(storeCollection);

      if (snapshot.empty) {
        store_innerhtml.innerHTML = `<tr><td colspan="7" class="text-center">No stores found</td></tr>`;
        return;
      }

      let counter = 1;

      snapshot.forEach((docSnap) => {
        
if(docSnap.data().status == "active" && docSnap.data().featured == true){
          store_innerhtml.innerHTML += `
       <div class="swiper-slide col-lg-2 col-12 col-md-6 ">
          <div class="col-12 mx-auto ">
                   <a href="store/store.html?=${
                     docSnap.data().name
                   }" class="text-decoration-none a">
                     <div class="col-lg-11 col-12 py-4 round mx-0 bg-white p-2 text-center ">
                        <img src=${
                          docSnap.data().image ? docSnap.data().image : docSnap.data().img
                        } class="img-fluid img_of_feature_stire col-lg-11 p-1  " alt="">
                        <h5 class="mt-3 text-dark">${docSnap.data().name}</h5>
                    </div>
                   </a>
                </div>
       </div>
   
    `;
}
      });
    } catch (err) {
      console.error("Error fetching store data:", err);
      store_innerhtml.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error loading data</td></tr>`;
    }
  }
  fetchStoreData0();
}
// ================ STORE CODE HOME PAGE END =======================

// / ================ CATEGORY CODE HOME PAGE START =====================
var category_innerhtml = document.getElementById("category_innerhtml");
if (category_innerhtml) {
  // FETCH STORES
  async function fetchStoreData1() {
    category_innerhtml.innerHTML = ""; // Clear previous data

    try {
      const storeCollection = collection(db, "categories");
      const snapshot = await getDocs(storeCollection);

      if (snapshot.empty) {
        category_innerhtml.innerHTML = `<tr><td colspan="7" class="text-center">No stores found</td></tr>`;
        return;
      }

      let counter = 1;

      snapshot.forEach((docSnap) => {
        // console.log(docSnap.data().recommended , docSnap.data().status == "active";
        if(docSnap.data().feature && docSnap.data().status == "active"){
          // console.log( docSnap.data().feature ,docSnap.data().status ); 
          
        category_innerhtml.innerHTML += `
    
       <div class="swiper-slide swiper-rel">
         <a href="category/categories.html?=${
           docSnap.data().slug
         }" class="text-decoration-none">
                     <div class="col-lg-12 py-2 round mx-0   text-start ">
                        <img src=${
                          docSnap.data().img
                        } class="img-fluid img_of_feature_stire  col-lg-12 mx-auto border-0" alt="">
                        
                        <div class="col-lg-11 mx-auto">
                        <h5 class="mt-3 text-dark">${
                          docSnap.data().name
                        }</h5>
                        </div>
                    
                        </div>

                        <div class="swiper-abs">
                     
                        </div>
                   </a>
       </div>
                 
    `;
  }
      });
    } catch (err) {
      console.error("Error fetching store data:", err);
      category_innerhtml.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error loading data</td></tr>`;
    }
  }
  fetchStoreData1();
}
// ================ CATEGORY CODE HOME PAGE END =======================

// ================== STORES.HTML CODE START =========================
var pageurl = window.location.pathname.split("/")[1];

if (pageurl) {
  var product_store = document.getElementById("product_store");
  var store_page_innerhtml = document.getElementById("store_page_innerhtml");
  var current_id = window.location.href.split("?=")[1];

  async function fetchStoreData() {
    // store_page_innerhtml.innerHTML = ""; // Clear previous data

    try {
      // Get a reference to the document
      const storeDocRef = doc(db, "store", current_id);
      const docSnap = await getDoc(storeDocRef);

      if (!docSnap.exists()) {
        store_page_innerhtml.innerHTML = `<tr><td colspan="7" class="text-center">No stores found</td></tr>`;
        return;
      }

      const data = docSnap.data();
      console.log( data);

      // Example: render HTML (replace with your actual HTML)
      store_page_innerhtml.innerHTML = `
                     <div class="col-11 mx-auto py-4 round mx-0 bg p-2 text-center d-flex row justify-content-around">
                       <div class="col-lg-12">
                         <img src="${data.img ? data.image: data.img}" class="img-fluid img_of_feature_stire bg-gray p-2 roun col-lg-10" alt="">
                      
                       </div>
                        <div class="d-flex flex-column col-lg-6 align-items-start">
                            <h5 class="mt-3 text-dark">${data.name}</h5>
                            <h6 class="text-muted">${data.about}</h6>
                       </div>
                       <div class="col-lg-2 d-flex flex-row align-items-center justify-content-end">
                        <a href="${data.link}" class="col-10">
                                           </a>   
                    </div>
                    </div>
            `;
    } catch (err) {
      // console.error("Error fetching store data:", err);
      // store_page_innerhtml.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error loading data</td></tr>`;
    }
  }

  // ======================= PRODUCT CODE START =================
  try {
    const productsSnapshot = await getDocs(collection(db, "products"));
    if (productsSnapshot.empty) {
      // productTableBody.innerHTML = `<tr><td colspan="6" class="text-center">No products found</td></tr>`;
      // return;
    }

    productsSnapshot.forEach((e) => {
      if (e.data().storeId === current_id) {
     

        product_store.innerHTML += `
    <div class="container-fluid p-2 bg-white border rounded-3 shadow-sm">
    <div class="row align-items-center g-0">
        <div class="col-auto me-3">
            <div class="text-center p-2 border rounded" style="width: 100px; height: 100px;">
                <p class="mb-0 fw-bold fs-6">LARSON</p>
                <p class="mb-0" style="font-size: 0.7rem;">JEWELRY</p>
            </div>
        </div>

        <div class="col">
            <span class="badge bg-success text-white mb-2">Verified</span>
            <h4 class="fw-normal mb-0">30% Off Sitewide</h4>
        </div>

        <div class="col-auto text-end">
            <div class="d-flex flex-column align-items-end">
                <button class="btn btn-danger btn-lg text-uppercase fw-bold position-relative" style="clip-path: polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%); padding-right: 3rem;">
                    Reveal Code
                    <span class="position-absolute end-0 top-50 translate-middle-y text-white-50 me-2" style="right: 5px !important; border-left: 2px dashed rgba(255,255,255,0.5); padding-left: 5px;">
                        CODE
                    </span>
                </button>
                <small class="text-muted mt-2">0 USED</small>
            </div>
        </div>
    </div>

    <div class="row mt-3 g-0">
        <div class="col-auto me-2">
             <button class="btn btn-danger text-uppercase fw-bold" style="width: 100px;">
                Code
            </button>
        </div>
        <div class="col-auto">
            <div class="dropdown">
                <button class="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Details
                </button>
                </div>
        </div>
        </div>
</div>
    
    `;
      } else {
      }
    });
  } catch (err) {
    // console.error("Error fetching products:", err);
  }

  // ============== PRODUCT CODE ACCORDING TO STORE CODE START ====================
  fetchStoreData();

  // ============== PRODUCT CODE ACCORDING TO STORE CODE END ====================
}

// ================== STORES.HTML CODE END =========================

// ================= product_home_innerhtml code start ==================
var product_home_innerhtml = document.getElementById("product_home_innerhtml");
if (product_home_innerhtml) {
  async function fetchProducts() {
    product_home_innerhtml.innerHTML = "";
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      if (productsSnapshot.empty) {
        product_home_innerhtml.innerHTML = `<tr><td colspan="6" class="text-center">No products found</td></tr>`;
        return;
      }

      let counter = 1;
      for (const docItem of productsSnapshot.docs) {
        const data = docItem.data();
 // ✅ FILTER: sirf exclusive = true wale dikhayein
        if (!data.best_selling || data.status !== "active") continue;


        const docId = docItem.id;

        // Fetch store name from store collection
        let storeName = "";
        if (data.storeId) {
          const storeRef = doc(db, "products", data.storeId);
          const storeSnap = await getDoc(storeRef);
          storeName = storeSnap.exists()
            ? storeSnap.data().name
            : "Unknown Store";
        }

        product_home_innerhtml.innerHTML += `
   <div class="col-lg-3 col-6 d-flex">
  <div class="card w-100 border-0 shadow-sm rounded-4 d-flex flex-column">

    <!-- IMAGE -->
    <div class="p-2">
      <img src="${data.img}" 
           class="img-fluid w-100 rounded-4 product_home_img"
           style="height:250px; object-fit:cover;">
    </div>

    <!-- CONTENT -->
    <div class="card-body d-flex flex-column text-center">

      <h5 class="fs-6 fw-medium mb-2">${data.productTitle}</h5>

      <!-- PRICE -->
      <div class="mb-3">
        <small>from</small>
        <div class="d-flex align-items-center">
          <del class="text-muted me-2">
            Rs ${data.discount_price || ""}
          </del>
          <span class=" col-org">
            Rs ${data.price || ""}
          </span>
        </div>
      </div>

      <!-- BUTTON (BOTTOM FIXED) -->
      <div class="mt-auto">
        <a href="product.html?=${data.slug}" 
           class="bg py-2 d-block text-center text-white text-decoration-none rounded-3">
          More Info
        </a>
      </div>

    </div>

  </div>
</div>
      `;
      }
 window.fns = function (btn) {
 
      
      window.open( btn.dataset.url, "_blank");
      document.getElementById("exampleModalLabel").innerHTML = btn.dataset.desc;
      const desc = btn.dataset.desc;
      const code = btn.dataset.code;
      document.getElementById("cop_inner").innerHTML = btn.dataset.code;
      document.getElementById("copy_btn").setAttribute("data-cpcode",btn.dataset.code)
      const url = btn.dataset.url;
      const store = btn.dataset.store;
      const img = btn.dataset.img;
      const title = btn.dataset.title;
      document.getElementById("modal_img_copon").src=img;
      document.getElementById("get_more_product").innerHTML=`Get More ${title} Deals!`;
    };
  window.copycode = function (i) {


    document.getElementById("copy_btn").innerHTML;

    // console.log(i.getAttribute("data-cpcode"));
    document.getElementById("copy_btn").innerText=i.getAttribute("data-cpcode");
    navigator.clipboard.writeText(i.getAttribute("data-cpcode"));
    document.getElementById("copy_btn").innerHTML=" product Code is Copied ! "
Swal.fire("product Code is Copied !");
setTimeout(() => {
      document.getElementById("copy_btn").innerHTML=" Copy Code  "
}, 2500);

  };
    } catch (err) {
      console.error("Error fetching products:", err);
      product_home_innerhtml.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error loading products</td></tr>`;
    }
  }

  fetchProducts();
}
// ================= product_home_innerhtml code end =======================















// ================= arrival_home_innerhtml code start ==================
var arrival_home_innerhtml = document.getElementById("arrival_home_innerhtml");
if (arrival_home_innerhtml) {
  async function fetchProducts() {
    arrival_home_innerhtml.innerHTML = "";
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      if (productsSnapshot.empty) {
        arrival_home_innerhtml.innerHTML = `<tr><td colspan="6" class="text-center">No products found</td></tr>`;
        return;
      }

      let counter = 1;
      for (const docItem of productsSnapshot.docs) {
        const data = docItem.data();
        // console.log(data);
 // ✅ FILTER: sirf exclusive = true wale dikhayein
        if (!data.arrivals || data.status !== "active") continue;


        const docId = docItem.id;

        // Fetch store name from store collection
        let storeName = "";
        if (data.storeId) {
          const storeRef = doc(db, "products", data.storeId);
          const storeSnap = await getDoc(storeRef);
          storeName = storeSnap.exists()
            ? storeSnap.data().name
            : "Unknown Store";
        }

        arrival_home_innerhtml.innerHTML += `
   <div class="col-lg-3 col-6 d-flex">
  <div class="card w-100 border-0 shadow-sm rounded-4 d-flex flex-column">

    <!-- IMAGE -->
    <div class="p-2">
      <img src="${data.img}" 
           class="img-fluid w-100 rounded-4 product_home_img"
           style="height:250px; object-fit:cover;">
    </div>

    <!-- CONTENT -->
    <div class="card-body d-flex flex-column text-center">

      <h5 class="fs-6 fw-medium mb-2">${data.productTitle}</h5>

      <!-- PRICE -->
      <div class="mb-3">
        <small>from</small>
        <div class="d-flex align-items-center">
          <del class="text-muted me-2">
            Rs ${data.discount_price || ""}
          </del>
          <span class=" col-org">
            Rs ${data.price || ""}
          </span>
        </div>
      </div>

      <!-- BUTTON (BOTTOM FIXED) -->
      <div class="mt-auto">
        <a href="product.html?=${data.slug}" 
           class="bg py-2 d-block text-center text-white text-decoration-none rounded-3">
          More Info
        </a>
      </div>

    </div>

  </div>
</div>
      `;
      }
 window.fns = function (btn) {
 
      
      window.open( btn.dataset.url, "_blank");
      document.getElementById("exampleModalLabel").innerHTML = btn.dataset.desc;
      const desc = btn.dataset.desc;
      const code = btn.dataset.code;
      document.getElementById("cop_inner").innerHTML = btn.dataset.code;
      document.getElementById("copy_btn").setAttribute("data-cpcode",btn.dataset.code)
      const url = btn.dataset.url;
      const store = btn.dataset.store;
      const img = btn.dataset.img;
      const title = btn.dataset.title;
      document.getElementById("modal_img_copon").src=img;
      document.getElementById("get_more_product").innerHTML=`Get More ${title} Deals!`;
    };
  window.copycode = function (i) {


    document.getElementById("copy_btn").innerHTML;

    // console.log(i.getAttribute("data-cpcode"));
    document.getElementById("copy_btn").innerText=i.getAttribute("data-cpcode");
    navigator.clipboard.writeText(i.getAttribute("data-cpcode"));
    document.getElementById("copy_btn").innerHTML=" product Code is Copied ! "
Swal.fire("product Code is Copied !");
setTimeout(() => {
      document.getElementById("copy_btn").innerHTML=" Copy Code  "
}, 2500);

  };
    } catch (err) {
      console.error("Error fetching products:", err);
      arrival_home_innerhtml.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error loading products</td></tr>`;
    }
  }

  fetchProducts();
}
// ================= arrival_home_innerhtml code end =======================









// ================== REVIEW CODE START ===================
var review_home = document.getElementById("review_home");
if (review_home) {
  var swiper = new Swiper(".mySwiper_review", {
    slidesPerView: 2,
    spaceBetween: 24,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      // Responsive for mobile/tablet
      0: {
        slidesPerView: 1,
      },
      640: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
    },
  });

  // ================ review_inner start ====================

  async function loadReviews() {
    var review_inner = document.getElementById("review_inner");
    // const reviewList = document.getElementById("reviewList") || document.createElement("div");
    // reviewList.id = "reviewList";
    // reviewList.innerHTML = "";
    review_inner.innerHTML = "";
    const snapshot = await getDocs(collection(db, "review"));
    snapshot.forEach((docSnap) => {
      const d = docSnap.data();
      // console.log(d);

      review_inner.innerHTML += `
    <div class="col-md-5 mb-4 swiper-slide">
            <div class="card p-4 h-100" style="border: 1px solid #e0f2f1; border-radius: 12px;">
                <div class="d-flex align-items-center mb-3">
                    <h5 class="fw-bold mb-0 me-2" style="color: #333f52;">${
                      d.name
                    }.</h5>
                    <span class="badge text-success">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#00e0b7" class="bi bi-patch-check-fill" viewBox="0 0 16 16">
                            <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.316 1.834L.417 5.093l.314.736L.103 8l.628 2.171-.314.736 1.626 2.531c.642.946 1.776 1.341 2.908 1.09l.89-.011.622.638a2.89 2.89 0 0 0 4.134 0l.622-.638.89.011c1.132.251 2.266-.144 2.908-1.09l1.626-2.53.314-.736-.628-2.171.314-.736-1.626-2.531a2.89 2.89 0 0 0-2.316-1.834l-.89.011-.622-.638zm.287 5.925a.5.5 0 0 1-.708 0L7 8.414 5.354 6.768a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0 0-.708z"/>
                        </svg>
                        Verified Shopper
                    </span>
                </div>
                
                <div class="mb-3">
                    <span style="color: #ff9900;">
                ${`<i class="hgi hgi-stroke hgi-star"></i>`.repeat(d.rating)}
                </div>

                <p class="text-muted mb-4">"${d.review}"</p>

            </div>
        </div>
    `;
    });
  }
  loadReviews();
  // ================  review_inner end =====================
}
// ================== REVIEW CODE END ======================


// ==================== Product.html CODE START ===============
var loc_path = window.location;
var category_var;
// console.log(loc_path);

if (loc_path.pathname == "/product.html") {
  var categories_inner = document.getElementById("product_inner_of_product_html");
  var page_name = loc_path.search.split("=")[1];
  page_name = page_name.replace(/\s+/g, "");
  document.title = `${page_name} | Category`;
  // console.log(page_name);
  
  // (document.getElementById("paged_name").innerHTML = page_name), "s";
  var product_in_category = document.getElementById("product_in_category");
  var price;
  //  console.log(page_name);
// product_inner_of_product_html
  // =============== GET A DATA OF SIGNLE CATEGORY CODE START ===============

  async function getdata() {
  

    try {
      const storeCollection = collection(db, "products");
      const snapshot = await getDocs(storeCollection);
      snapshot.forEach((s) => {
        // console.log(s.data().slug);
        // console.log(s.data().price);
        
        if (s.data().slug == page_name) {
          
          price=s.data().price;
          category_var=s.data().category;

          
          categories_inner.innerHTML = `
   <div class="col-md-6 text-center">
                <div class="p-3 bg-white rounded shadow-sm col-lg-11">
                    <img src="${s.data().img}" class="img-fluid rounded prodcut-songle-img" alt="Brownie Box prodcut-songle-img">
                </div>
            </div>
            
            <div class="col-md-6">
                <h2 class="fw-bold mb-3">${s.data().productTitle}</h2>
                <p class="h4 text-dark mb-4 " id="price_inner">Rs ${s.data().price}</p>


                   
                <p class="text-muted small col-12">
                 ${s.data().description.slice(0,150)
         
                 
}         .... </p>
                
                
              <div class="mb-4 col-12 d-flex flex-row justify-content-between">

              <div class="col-4 me-3">
  <input 
    class="form-control inp_quan py-2" 
    type="number" 
    min="25" 
    max="9999"
    id="quantity"
    value="1"
    placeholder="Minimum 25" />
              </div>
              <div class="col-7">
                <button class="btn btn-outline-dark addtocart inp_quan py-2 col-12" type="button">Add to cart</button>
                  
              </div>
              <div class="col-1 d-flex flex-row align-items-center justify-content-center">
              <i class="hgi hgi-stroke hgi-rounded hgi-star fs-3"></i>
              </div>

</div>
                
                <div class="d-flex flex-row justify-content-start gap-3 mb-3">
                    <button class="btn bg py-2 text-white col-12 round_20 buyNowBtn"  id="buyNowBtn" type="button"
                    
                      data-name="${s.data().productTitle}" 
                      data-price="${s.data().price}"

                      data-img="${s.data().img}"
                      

                    > Buy it now</button>
                </div>
             

                <div class="d-flex flex-row align-items-center">
                <a href="#question" class="text-dark text-decoration-none pe-2 "><i class="hgi hgi-stroke hgi-rounded mt-1 hgi-help-circle"></i> Ask a Question</a>
             <button id="shareBtn" class="bg-transparent border-0 px-2 mt-1">
             <i class="hgi hgi-stroke hgi-rounded hgi-share-08"></i></button>
             Social Share

                </div>
               
            </div>`;
const shareBtn = document.getElementById("shareBtn");

shareBtn.addEventListener("click", async () => {
    if (navigator.share) {
        try {
            await navigator.share({
                title: "My Website",
                text: "Check this amazing site!",
                url: window.location.href
            });
            console.log("Shared successfully");
        } catch (error) {
            console.log("Sharing failed:", error);
        }
    } else {
        alert("Web Share API not supported in this browser.");
    }
});
            // ================== BUY NOW WHATSAAP CODE START ====================
            document.addEventListener("click", (e) => {
  if (e.target.classList.contains("buyNowBtn")) {

    const name = e.target.dataset.name;
    const price = e.target.dataset.price;

       const img = e.target.dataset.img;
    const quantity = document.getElementById("quantity").value;
    ;
    const phone = "923146903187";
    // const phone = "14258666070"

    const message = `Hello, I want to buy:

Name : ${name}
Price ${price}
quantity ${quantity}
Price ${price}
Image ${img}


`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  }
});

// ======================== BUY KNOW CODE END =======================

// ======================= ADD TO CARD CODE START ==================
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("addtocart")) {

    const productTitle = document.querySelector(".buyNowBtn").dataset.name;
    const price = document.querySelector(".buyNowBtn").dataset.price;
    const img = document.querySelector(".buyNowBtn").dataset.img;
    const quantity = document.getElementById("quantity").value;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // ✅ CHECK: product already exists?
    const alreadyExists = cart.some(item => item.name === productTitle);

    if (alreadyExists) {
      alert("⚠️ Product already added in cart!");
      return; // ❌ stop further execution
    }
  
 

    // ✅ New Product Object
    const product = {
      name: productTitle,
      price: Number(price),
      img: img,
      quantity: Number(quantity),
      total: Number(price) * Number(quantity),
    };

    // ✅ Add to cart
    cart.push(product);

    // ✅ Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));


    alert("✅ Product added to cart! 🛒");
    

  }
});
// ======================= ADD TO CARD CODE END =====================
          // console.log(s.data() );
// document.getElementById("price_inner").innerHTML=1;
        var quantity=document.getElementById("quantity");
        quantity.addEventListener("input",(e)=>{

          if(quantity.value == ""){
            quantity.value=1;

          }
          document.getElementById("price_inner").innerHTML=`Rs ${quantity.value*price}`
          
        })
        }
      });
    } catch (error) {
      console.log(error);
    }
    
 // ================= product_home_innerhtml_like code start ==================
var product_home_innerhtml_like = document.getElementById("product_home_innerhtml_like");
if (product_home_innerhtml_like) {
  // console.log(category_var);
  
  async function fetchProducts() {
    product_home_innerhtml_like.innerHTML = "";
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      if (productsSnapshot.empty) {
        product_home_innerhtml_like.innerHTML = `<tr><td colspan="6" class="text-center">No products found</td></tr>`;
        return;
      }

      let counter = 1;
      for (const docItem of productsSnapshot.docs) {
        const data = docItem.data();
        // console.log(data.category ,category_var);
 // ✅ FILTER: sirf exclusive = true wale dikhayein
        if (data.category == category_var|| data.status !== "active") continue;


        const docId = docItem.id;

        // Fetch store name from store collection
        let storeName = "";
        if (data.storeId) {
          const storeRef = doc(db, "products", data.storeId);
          const storeSnap = await getDoc(storeRef);
          storeName = storeSnap.exists()
            ? storeSnap.data().name
            : "Unknown Store";
        }
        // console.log(data.category);
        

        product_home_innerhtml_like.innerHTML += `
   <div class="col-lg-3 col-4 d-flex">
  <div class="card col-12 border-0 shadow-sm rounded-4 d-flex flex-column">

    <!-- IMAGE -->
    <div class="p-2">
      <img src="${data.img}" 
           class="img-fluid w-100 rounded-4 product_home_img"
           style="height:250px; object-fit:cover;">
    </div>

    <!-- CONTENT -->
    <div class="card-body d-flex flex-column text-center">

      <h5 class="fs-6 fw-medium mb-2">${data.productTitle}</h5>

      <!-- PRICE -->
      <div class="mb-3">
        <small>from</small>
        <div class="d-flex align-items-center">
          <del class="text-muted me-2">
            Rs ${data.discount_price || ""}
          </del>
          <span class=" col-org">
            Rs ${data.price || ""}
          </span>
        </div>
      </div>

      <!-- BUTTON (BOTTOM FIXED) -->
      <div class="mt-auto">
        <a href="product.html?=${data.slug}" 
           class="bg py-2 d-block text-center text-white text-decoration-none rounded-3">
          More Info
        </a>
      </div>

    </div>

  </div>
</div>
      `;
      }


    } catch (err) {
      console.error("Error fetching products:", err);
      product_home_innerhtml_like.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error loading products</td></tr>`;
    }
  }

  fetchProducts();
}
// ================= product_home_innerhtml_like code end =======================

  }
  getdata();
  // =============== GET A DATA OF SIGNLE CATEGORY CODE END ===============



























}

// ==================== Product.html CODE END ===============













// ==================== category/categories.html CODE START ===============
var loc_path = window.location;
if (loc_path.pathname == "/category/categories.html") {
  var categories_inner = document.getElementById("category_page_innerhtml");
  var page_name = loc_path.search.split("=")[1];
  var product_cat_page=document.getElementById("product_cat_page");
  // console.log(page_name);
  
  page_name = page_name.replace(/\s+/g, "");

  
  document.title = `${page_name} | Category`;

  var product_in_category = document.getElementById("product_in_category");
  //  console.log(page_name);

  // =============== GET A DATA OF SIGNLE CATEGORY CODE START ===============

  async function getdata() {
  

    try {
      const storeCollection = collection(db, "products");
      const snapshot = await getDocs(storeCollection);
      snapshot.forEach((s) => {
        // console.log(s.data().category.split("|")[1] , page_name );
        // console.log(s.data().name , page_name);
          document.getElementById("paged_name").innerHTML = s.data().category.split("|")[1].split(".html");

          product_cat_page.innerHTML= `
          <h2 class="text-center">No Result Found</h2>
          `;
        if ( s.data().category.split("|")[1] == page_name) {
          document.getElementById("paged_name").innerHTML = s.data().category.split("|")[0];
          //
          // console.log(s.data());
          // =============== product_cat_page code start ================
          product_cat_page.innerHTML= `
   <div class="col-lg-3 col-6 d-flex">
  <div class="card w-100 border-0 shadow-sm rounded-4 d-flex flex-column">

    <!-- IMAGE -->
    <div class="p-2">
      <img src="${s.data().img}" 
           class="img-fluid w-100 rounded-4 product_home_img"
           style="height:250px; object-fit:cover;">
    </div>

    <!-- CONTENT -->
    <div class="card-body d-flex flex-column text-center">

      <h5 class="fs-6 fw-medium mb-2">${s.data().productTitle}</h5>

      <!-- PRICE -->
      <div class="mb-3">
        <small>from</small>
        <div class="d-flex align-items-center">
          <del class="text-muted me-2">
            Rs ${s.data().discount_price || ""}
          </del>
          <span class=" col-org">
            Rs ${s.data().price || ""}
          </span>
        </div>
      </div>

      <!-- BUTTON (BOTTOM FIXED) -->
      <div class="mt-auto">
        <a href="product.html?=${s.data().slug}" 
           class="bg py-2 d-block text-center text-white text-decoration-none rounded-3">
          More Info
        </a>
      </div>

    </div>

  </div>
</div>
      `;
          // =============== product_cat_page code end ==================
          
const faqContainer = document.getElementById("faqs_store");
let faqHTML = s.data().faq || "";

const tempDiv = document.createElement("div");
tempDiv.innerHTML = faqHTML;

const cleanEditor = tempDiv.querySelector(".ql-editor");

if (cleanEditor) {
    cleanEditor.removeAttribute("contenteditable");

    faqContainer.innerHTML = cleanEditor.innerHTML;
} else {
    faqContainer.innerHTML = faqHTML;
}

        
          // =============== SEO CODE START ========================
           /* =========================
           TITLE
        ========================= */
        document.title =
          s.data().meta_title ||
          s.data().title_heading ||
          s.data().name ||
          "Default Page Title";


        /* =========================
           META DESCRIPTION
        ========================= */
       

        /* =========================
           META KEYWORDS
        ========================= */


        /* =========================
           CANONICAL URL
        ========================= */
        if (s.data().canonical_url) {
          setCanonical(s.data().canonical_url);
        }
// ===== META DESCRIPTION =====
let metaDescription = document.querySelector('meta[name="description"]');

if (metaDescription) {
  metaDescription.setAttribute(
    "content",
    s.data().meta_description || s.data().description || ""
  );
} else {
  metaDescription = document.createElement("meta");
  metaDescription.setAttribute("name", "description");
  metaDescription.setAttribute(
    "content",
    s.data().meta_description || s.data().description || ""
  );
  document.head.appendChild(metaDescription);
}


// ===== META KEYWORDS =====
if (s.data().meta_keywords) {
  let metaKeywords = document.querySelector('meta[name="keywords"]');

  if (metaKeywords) {
    metaKeywords.setAttribute("content", s.data().meta_keywords);
  } else {
    metaKeywords = document.createElement("meta");
    metaKeywords.setAttribute("name", "keywords");
    metaKeywords.setAttribute("content", s.data().meta_keywords);
    document.head.appendChild(metaKeywords);
  }
}


        /* =========================
           OPEN GRAPH (FACEBOOK)
        ========================= */
// ===== OG TITLE =====
let ogTitle = document.querySelector('meta[property="og:title"]');
if (ogTitle) {
  ogTitle.setAttribute("content", document.title);
} else {
  ogTitle = document.createElement("meta");
  ogTitle.setAttribute("property", "og:title");
  ogTitle.setAttribute("content", document.title);
  document.head.appendChild(ogTitle);
}


// ===== OG DESCRIPTION =====
let ogDesc = document.querySelector('meta[property="og:description"]');
if (ogDesc) {
  ogDesc.setAttribute(
    "content",
    s.data().meta_description || s.data().description || ""
  );
} else {
  ogDesc = document.createElement("meta");
  ogDesc.setAttribute("property", "og:description");
  ogDesc.setAttribute(
    "content",
    s.data().meta_description || s.data().description || ""
  );
  document.head.appendChild(ogDesc);
}


// ===== OG IMAGE =====
let ogImage = document.querySelector('meta[property="og:image"]');
if (ogImage) {
  ogImage.setAttribute("content", s.data().image || "");
} else {
  ogImage = document.createElement("meta");
  ogImage.setAttribute("property", "og:image");
  ogImage.setAttribute("content", s.data().image || "");
  document.head.appendChild(ogImage);
}


// ===== OG URL =====
let ogUrl = document.querySelector('meta[property="og:url"]');
if (ogUrl) {
  ogUrl.setAttribute("content", s.data().link || "");
} else {
  ogUrl = document.createElement("meta");
  ogUrl.setAttribute("property", "og:url");
  ogUrl.setAttribute("content", s.data().link || "");
  document.head.appendChild(ogUrl);
}


        /* =========================
           TWITTER CARD
        ========================= */
    // ===== TWITTER CARD =====
let twCard = document.querySelector('meta[name="twitter:card"]');
if (twCard) {
  twCard.setAttribute("content", "summary_large_image");
} else {
  twCard = document.createElement("meta");
  twCard.setAttribute("name", "twitter:card");
  twCard.setAttribute("content", "summary_large_image");
  document.head.appendChild(twCard);
}


// ===== TWITTER TITLE =====
let twTitle = document.querySelector('meta[name="twitter:title"]');
if (twTitle) {
  twTitle.setAttribute("content", document.title);
} else {
  twTitle = document.createElement("meta");
  twTitle.setAttribute("name", "twitter:title");
  twTitle.setAttribute("content", document.title);
  document.head.appendChild(twTitle);
}


// ===== TWITTER DESCRIPTION =====
let twDesc = document.querySelector('meta[name="twitter:description"]');
if (twDesc) {
  twDesc.setAttribute(
    "content",
    s.data().meta_description || s.data().description || ""
  );
} else {
  twDesc = document.createElement("meta");
  twDesc.setAttribute("name", "twitter:description");
  twDesc.setAttribute(
    "content",
    s.data().meta_description || s.data().description || ""
  );
  document.head.appendChild(twDesc);
}


// ===== TWITTER IMAGE =====
let twImg = document.querySelector('meta[name="twitter:image"]');
if (twImg) {
  twImg.setAttribute("content", s.data().image || "");
} else {
  twImg = document.createElement("meta");
  twImg.setAttribute("name", "twitter:image");
  twImg.setAttribute("content", s.data().image || "");
  document.head.appendChild(twImg);
}

          // =============== SEO CODE END ===========================
           
// =============== RIGHT SIDE BAR CODE START ========================
document.getElementById("name_store").innerHTML=`${s.data().name }
`
document.getElementById("name_store1").innerHTML=`${s.data().name }
`
document.getElementById("sider_about").innerHTML=`
 <h6>Why we love shopping at ${s.data().name }<i class="hgi hgi-stroke hgi-favourite fs-4 col-org "></i></h6>
    <p class="mb-0">${s.data().about}</p>
 

`
// =============== RIGHT SIDER BAR CODE END =========================

          categories_inner.innerHTML = `
    <div class="col-12 mx-auto py-4 round mx-0 bg-white p-2 text-center d-flex row justify-content-aroun">
                       <div class="col-lg-3 ">
                         <img src="${     
                           s.data().image ?   s.data().image:  s.data().img
                         }" class="img-fluid img_of_feature_stires bg-gray p-2 round col-lg-12" alt="">
                      
                       </div>
                        <div class="d-flex flex-column  col-lg-6 align-items-start">
                            <h5 class="mt-3 text-dark">${
                              s.data().
name
                            }</h5>
                            <h6 class="text-muted text-start text-wrap d-flex">${
s.data().about.split(" ").join(" ").slice(0,150)
                              
                            }</h6>
                       </div>
                       <div class="col-lg-2 d-flex flex-row align-items-center justify-content-end">
                        <a href="${s.data().
link
}" class="col-10">
                        <button class="bg text-white col-12 p-2 round pb-2 text-white btn">Visit Store</button>
                    </a>   
                    </div>
                    </div>`;
          // console.log(s.data() );

          async function getcop() {
            const productsSnapshot = await getDocs(collection(db, "products"));
            product_in_category.innerHTML = `No Data Found`;
            productsSnapshot.forEach((o) => {
           
              if (o.data().brandStore.split(" ").join("-") == s.data().name) {
                
        
             

                product_in_category.innerHTML += `
                        <div class="col-lg-12 bg-white py-3 mb-2 px-2 d-flex flex-lg-row rounded-3 ">
                    <div class="col-lg-2 col-2 bg-gray p-2 rounded-3">
                        <img src="${
                          o.data().image
                        }" class="img-fluid col-12 rounded-3 img_copoun" alt="">
                        <div class="bg small text-center text-white round mt-2">
                            Get Code
                        </div>
                    </div>
                    <div class="col-lg-8 col-7 ps-3 ps-lg-4">
                        <span class="badge border p-2 rounded text-dark">Verified</span>
                        
                        <h5 class="pt-2">${o.data().productTitle}</h5>
                        <h6>${o.data().description}</h6>
                        <div class="mt-4">
                            <button class="btn small border d-flex flex-row align-items-center  border-1" type="button" data-bs-toggle="collapse" data-bs-target="#collapse_${
                              o.data().productCode
                            }}" aria-expanded="false" aria-controls="collapse_${
                  o.data().productCode
                }}">
    <span class="small fs_6">Detais</span> <i class="hgi hgi-stroke hgi-arrow-down-01"></i>
  </button>
  <div class="collapse position-relative" id="collapse_${o.data().productCode}}">
  <div class="card card-body  small col-12 my-2">
     <h5 class="card-title small">Terms &amp; Conditions</h5>
      <ol class="mb-0 small">
        <li>Some exclusions apply.</li>
        <li>Cannot be used in conjunction with any other offer.</li>
        <li>For full Terms &amp; Conditions please see website.</li>
      </ol>
  </div>
</div>
                        </div>
                    </div>
                    <div class="col-lg-2 col-3 d-flex flex-column justify-content-center">
                   <button type="button"  data-desc="${o.data().description}"
  data-code="${o.data().productCode}"
  data-url="${o.data().affiliateURL}"
  data-store="${o.data().brandStore}"
  data-img="${o.data().image}"
  data-title="${o.data().productTitle}"
  onclick="fns(this)" class="btn col-12 bg text-white rounded" data-bs-toggle="modal" data-bs-target="#exampleModal">
  <span class="">Reveal Code</span>
</button>

<!-- =============== product INFO CODE START =================== -->
 <div class="modal fade " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog bg py-4 px-2 rounded-3">
    <div class="modal-content mb-2">
      <div class="modal-header border-bottom-0 text-center d-flex flex-column align-items-center">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        <h1 class="modal-title fs-5 text-center" id="exampleModalLabel">${
          o.data().description
        }</h1>
      </div>
      <div class="modal-body">
     <div>
     <button class="text-center col-12 coup_code_modal py-3 rounded-3" id="cop_inner">

     </button>

     <button class="col-12 my-2 py-2 bg text-white btn rounded-3" data-cpcode="${o.data().productCode}" id="copy_btn" onclick="copycode(this)">
        Copy Code
     </button>
     <button class="bg-gray col-12 btn rounded-3 shadow-sm py-2">
        Visit Store
     </button>
     <p class="fs-6 text-center py-3 fw-light">Copy the code above and use it at checkout to get your discount!</p>
     </div>
      </div>
    
    </div>

        <div class="modal-content">
     
      <div class="modal-body">
     <div class="d-flex flex-column align-items-center">
        <img src="https://res.cloudinary.com/deq6ngtkw/image/upload/v1766700977/and1h3udbtzb6f5kiffb.jpg" class="img-fluid col-8 mx-auto rounded-circle product_modal_img" alt="" id="modal_img_copon">
    <h6 class="mt-4 fs-5" id="get_more_product">

        Get More Mixtiles UK Deals!
    </h6>

<p>Subscribe to get exclusive offers and discounts</p>
     
     <input type="text" class="form-control" placeholder="Enter your Email to Subscribe">
     <button class="btn bg text-white col-12 mt-2" onclick="subs()">
        Subscribe
     </button>
     <span class="small mt-2">We respect your privacy. Unsubscribe at any time.</span>
      </div>
    </div>
  </div>
</div>

 <!-- ============== product INFO CODE END ======================== -->

                        <span class="col-org small text-end ">0 Used</span>
                    </div>

                </div>
        `;
              }
          
            });
          }
          getcop();
        }
      });
    } catch (error) {
      // console.log(error);
    }
    if(document.getElementById("copy_btn")){

      document.getElementById("copy_btn").innerHTML=" Copy product Code "

    }}
    window.subs =function(){
    
      Swal.fire("You Have Successfull subscribe");
    }
    window.fns = function (btn) {
 
      
      window.open( btn.dataset.url, "_blank");
      document.getElementById("exampleModalLabel").innerHTML = btn.dataset.desc;
      const desc = btn.dataset.desc;
      const code = btn.dataset.code;
      document.getElementById("cop_inner").innerHTML = btn.dataset.code;
      document.getElementById("copy_btn").setAttribute("data-cpcode",btn.dataset.code)
      const url = btn.dataset.url;
      const store = btn.dataset.store;
      const img = btn.dataset.img;
      const title = btn.dataset.title;
      document.getElementById("modal_img_copon").src=img;
      document.getElementById("get_more_product").innerHTML=`Get More ${title} Deals!`;
    };
  window.copycode = function (i) {


    document.getElementById("copy_btn").innerHTML;

    // console.log(i.getAttribute("data-cpcode"));
    document.getElementById("copy_btn").innerText=i.getAttribute("data-cpcode");
    navigator.clipboard.writeText(i.getAttribute("data-cpcode"));
    document.getElementById("copy_btn").innerHTML=" product Code is Copied ! "
Swal.fire("product Code is Copied !");
setTimeout(() => {
      document.getElementById("copy_btn").innerHTML=" Copy Code  "
}, 2500);

  };
  getdata();
  // =============== GET A DATA OF SIGNLE CATEGORY CODE END ===============
}

// ==================== category/categories.html CODE END ===============




















// ==================== best_selling CODE START ===============
var loc_path = window.location;
// console.log(loc_path.pathname );

if (loc_path.pathname == "/best_selling.html") {
  var categories_inner = document.getElementById("best_selling_page_innerhtml");
   console.log(page_name);
  
  //  console.log(page_name);

  // =============== GET A DATA OF SIGNLE CATEGORY CODE START ===============

   async function fetchProducts() {
    categories_inner.innerHTML = "";
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      if (productsSnapshot.empty) {
        categories_inner.innerHTML = `<tr><td colspan="6" class="text-center">No products found</td></tr>`;
        return;
      }

      let counter = 1;
      for (const docItem of productsSnapshot.docs) {
        const data = docItem.data();
        // console.log(data);
 // ✅ FILTER: sirf exclusive = true wale dikhayein
        if (!data.arrivals || data.status !== "active") continue;


        const docId = docItem.id;

        // Fetch store name from store collection
        let storeName = "";
        if (data.storeId) {
          const storeRef = doc(db, "products", data.storeId);
          const storeSnap = await getDoc(storeRef);
          storeName = storeSnap.exists()
            ? storeSnap.data().name
            : "Unknown Store";
        }

        categories_inner.innerHTML += `
   <div class="col-lg-3 col-6 d-flex">
  <div class="card w-100 border-0 shadow-sm rounded-4 d-flex flex-column">

    <!-- IMAGE -->
    <div class="p-2">
      <img src="${data.img}" 
           class="img-fluid w-100 rounded-4 product_home_img"
           style="height:250px; object-fit:cover;">
    </div>

    <!-- CONTENT -->
    <div class="card-body d-flex flex-column text-center">

      <h5 class="fs-6 fw-medium mb-2">${data.productTitle}</h5>

      <!-- PRICE -->
      <div class="mb-3">
        <small>from</small>
        <div class="d-flex align-items-center">
          <del class="text-muted me-2">
            Rs ${data.discount_price || ""}
          </del>
          <span class=" col-org">
            Rs ${data.price || ""}
          </span>
        </div>
      </div>

      <!-- BUTTON (BOTTOM FIXED) -->
      <div class="mt-auto">
        <a href="product.html?=${data.slug}" 
           class="bg py-2 d-block text-center text-white text-decoration-none rounded-3">
          More Info
        </a>
      </div>

    </div>

  </div>
</div>
      `;
      }


    } catch (err) {
      console.error("Error fetching products:", err);
      categories_inner.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error loading products</td></tr>`;
    }
  }

  fetchProducts();
  // =============== GET A DATA OF SIGNLE CATEGORY CODE END ===============
}

// ==================== best_selling CODE END ===============



// ==================== NEW ARRIVALS CODE END ===============
var loc_path = window.location;
// console.log(loc_path.pathname );

if (loc_path.pathname == "/new_arrivals.html") {
  var categories_inner = document.getElementById("new_arrivals_page_innerhtml");
   console.log(page_name);
  
  //  console.log(page_name);

  // =============== GET A DATA OF SIGNLE CATEGORY CODE START ===============

   async function fetchProducts() {
    categories_inner.innerHTML = "";
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      if (productsSnapshot.empty) {
        categories_inner.innerHTML = `<tr><td colspan="6" class="text-center">No products found</td></tr>`;
        return;
      }

      let counter = 1;
      for (const docItem of productsSnapshot.docs) {
        const data = docItem.data();

        if (!data.arrivals|| data.status !== "active") continue;


        const docId = docItem.id;

        // Fetch store name from store collection
        let storeName = "";
        if (data.storeId) {
          const storeRef = doc(db, "products", data.storeId);
          const storeSnap = await getDoc(storeRef);
          storeName = storeSnap.exists()
            ? storeSnap.data().name
            : "Unknown Store";
        }

        categories_inner.innerHTML += `
   <div class="col-lg-3 col-6 d-flex">
  <div class="card w-100 border-0 shadow-sm rounded-4 d-flex flex-column">

    <!-- IMAGE -->
    <div class="p-2">
      <img src="${data.img}" 
           class="img-fluid w-100 rounded-4 product_home_img"
           style="height:250px; object-fit:cover;">
    </div>

    <!-- CONTENT -->
    <div class="card-body d-flex flex-column text-center">

      <h5 class="fs-6 fw-medium mb-2">${data.productTitle}</h5>

      <!-- PRICE -->
      <div class="mb-3">
        <small>from</small>
        <div class="d-flex align-items-center">
          <del class="text-muted me-2">
            Rs ${data.discount_price || ""}
          </del>
          <span class=" col-org">
            Rs ${data.price || ""}
          </span>
        </div>
      </div>

      <!-- BUTTON (BOTTOM FIXED) -->
      <div class="mt-auto">
        <a href="product.html?=${data.slug}" 
           class="bg py-2 d-block text-center text-white text-decoration-none rounded-3">
          More Info
        </a>
      </div>

    </div>

  </div>
</div>
      `;
      }


    } catch (err) {
      console.error("Error fetching products:", err);
      categories_inner.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error loading products</td></tr>`;
    }
  }

  fetchProducts();
  // =============== GET A DATA OF SIGNLE CATEGORY CODE END ===============
}

// ==================== NEW ARRIVALS CODE END ===============


















// ==================== BLOG.HTML CODE START =============================================
var blogsCardsContainer = document.getElementById("blogsCardsContainer");
var categorySelect = document.getElementById("category");

if (blogsCardsContainer) {
const categoryCollection = collection(db, "blog_categories");
// Real-time listener to populate select
onSnapshot(categoryCollection, (snapshot) => {
  // Clear previous options except the first placeholder
  categorySelect.innerHTML = '<option value="">-- Select Category --</option>';

  snapshot.docs.forEach(docItem => {
    const data = docItem.data();

    const option = document.createElement("option");
    option.value = data.name;        // you can use ID as value
    option.textContent = data.name;   // name shown to user
    categorySelect.appendChild(option);
  });
});
  async function loadBlogsCards(filterCategoryId = "") {
    blogsCardsContainer.innerHTML = `
    
    `; // clear container

    const snapshot = await getDocs(collection(db, "blog"));

    snapshot.forEach((docSnap) => {
      const blog = docSnap.data();
      const id = docSnap.id;

      // Filter by category if a category is selected
      if (filterCategoryId && blog.category_id !== filterCategoryId) {
    blogsCardsContainer.innerHTML = "No Blog Found"; // clear container

        return; // skip blogs not in selected category
      }

      // Set SEO info dynamically for first blog only
      if (!filterCategoryId ) {
       

        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
     
     }


      blogsCardsContainer.innerHTML += `
      ${blog.featured !== "yes"?  `  <div class="col-lg-4 mb-4">
          <div class="card h-100 shadow-sm p-2 rounded-4">
            ${blog.image ? `<img src="${blog.image}" class="rounded-4" style="height:200px; object-fit:cover;">` : ""}
            <div class="mt-2 card-body text-muted d-flex justify-content-between align-items-center">
              <span class="badge bg">${blog.category_id}</span>
              <small>${new Date(blog.createdAt).toLocaleDateString()}</small>
            </div>
            <div class="card-body d-flex flex-column text-center">
              <h5 class="card-title">${blog.title || "-"}</h5>
              <p class="card-text">${blog.excerpt?.substring(0, 300) || ""}...</p>
              <div class="d-flex flex-row justify-content-between align-align-items-center">
                <a href="blog_detail.html?id=${id}" class="btn col-org  bg text-white">Continue <i class="hgi hgi-stroke hgi-arrow-right-03"></i></a>
             
              <p class=" "> By ${blog.author || "-"}</p>
                </div>
            </div>
            
          </div>
        </div>`:"No Blog Found"}
      `;
    });
  }

  // Load all blogs by default
  loadBlogsCards();

  // Listen for category change
  if (categorySelect) {
    categorySelect.addEventListener("change", () => {
      const selectedCategory = categorySelect.value;
      loadBlogsCards(selectedCategory); // reload blogs with category filter
    });
  }
}


// =================== BLOG_DETAIL.HTML CODE START ===========================
var blogContainer=document.getElementById("blogContainer");
if(blogContainer){var recom_div=document.getElementById("recom_div");
if(recom_div){
  const recomDiv = document.getElementById("recom_div");

async function loadRecommendedBlogs() {
  if (!recomDiv) return;

  recomDiv.innerHTML = ""; // clear container

  const snapshot = await getDocs(collection(db, "blog"));

  snapshot.forEach((docSnap) => {
    const blog = docSnap.data();

    // Show only recommended blogs
    if (blog.recommended) return;

    
    recomDiv.innerHTML += `
      <!-- ======================== SINGLE RECOM CODE START ================ -->
      <div class="p-2 bg-white rounded-4 mb-2"> 
        ${blog.image ? `<img src="${blog.image}" class="img-fluid rounded-4 recom_img" alt="">` : ""}
        <div class="d-flex flex-row my-2 justify-content-between align-items-center">
          <span class="badge text-dark fs_6 bg-gray">${blog.author || "-"}</span>
          <span class="fs_6">${new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
        <div class="my-4">
          <h6>${blog.title || "-"}</h6>
        </div>
        <div class="d-flex flex-row my-2 justify-content-between align-items-center">
          <a href="blog_detail.html?id=${docSnap.id}" class="text-decoration-none col-org  d-flex flex-row">
            <span class="fs_6">Continue Reading </span> <i class="hgi hgi-stroke hgi-arrow-right-03 fs-5 px-2"></i>
          </a>
          <span>${new Date(blog.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <!-- ======================== SINGLE RECOM CODE END ================ -->
    `;
  });
}

// Load recommended blogs on page load
loadRecommendedBlogs();

}
      // Get blog ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    const blogContainer = document.getElementById("blogContainer");

    async function loadBlog() {
      if (!blogId) {
        blogContainer.innerHTML = "<p class='text-danger'>Blog ID not found in URL.</p>";
        return;
      }

      const blogSnap = await getDoc(doc(db, "blog", blogId));

      if (!blogSnap.exists()) {
        blogContainer.innerHTML = "<p class='text-danger'>Blog not found.</p>";
        return;
      }

      const blog = blogSnap.data();
// Set SEO info dynamically
if (blog.seo) {
  // Set page title
  if (blog.seo.meta_title) {
    document.title = blog.seo.meta_title;
  } else {
    document.title = blog.title || "Blog Detail";
  }

  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', blog.seo.meta_description || "");

  // Update meta keywords
  let metaKeywords = document.querySelector('meta[name="keywords"]');
  if (!metaKeywords) {
    metaKeywords = document.createElement('meta');
    metaKeywords.setAttribute('name', 'keywords');
    document.head.appendChild(metaKeywords);
  }
  metaKeywords.setAttribute('content', blog.seo.meta_keywords || "");
}

      blogContainer.innerHTML = `
        <div class="card mb-4  border-0">
          ${blog.image ? `<img src="${blog.image}" class=" p-lg-2 rounded-4 blog_detail_img` : ""}
          <div class="card-body">
            <h2 class="card-title mb-2">${blog.title || "-"}</h2>
            <p class="text-muted mb-1"><strong>Author:</strong> ${blog.author || "-"}</p>
            <p class="text-muted mb-1"><strong>Status:</strong> ${blog.status}</p>
            <p class="text-muted mb-3"><strong>Featured:</strong> ${blog.featured ? "Yes" : "No"}</p>
            <p class="card-text mb-3">${blog.excerpt || ""}</p>
            <div>${blog.content || ""}</div>
          </div>
          <div class="card-footer">
            <small class="text-muted">Created At: ${new Date(blog.createdAt).toLocaleString()}</small>
          </div>
        </div>

      
      `;
    }

    loadBlog();
}
// =================== BLOG_DETAIL.HTML CODE END =============================  



// =================== home_cat_product CODE START =========================
// =================== home_cat_product CODE START =========================
const home_cat_product = document.getElementById("home_cat_product");

if (home_cat_product) {

  const categoriesRef = collection(db, "categories");
  const productContainer = document.getElementById("product_cat_home_innerhtml");

  async function fetchCategoriesForHome() {
    try {
      const categoriesSnap = await getDocs(categoriesRef);

      if (categoriesSnap.empty) {
        console.log("No categories found");
        return;
      }

      productContainer.innerHTML = "";

      // ✅ async-safe loop
      for (const catDoc of categoriesSnap.docs) {

        const categoryData = catDoc.data();

        // ✅ ONLY showHome === true
        if (!categoryData.showHome) continue;

        const categoryName = categoryData.pageTitle;

        // 🔥 Fetch products of this category
        const productQuery = query(
          collection(db, "products"),
          where("category", "==", categoryName)
        );

        const productsSnap = await getDocs(productQuery);

        if (productsSnap.empty) continue;

        // 🔹 Category + Row wrapper (IMPORTANT)
        const sectionId = `row_${catDoc.id}`;

        productContainer.innerHTML += `
          <div class="container my-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h2 class="mb-0">${categoryName}</h2>
              <a class="text-decoration-none" href="categories.html">
                View All
              </a>
            </div>

            <div class="row" id="${sectionId}"></div>
          </div>
        `;

        const rowContainer = document.getElementById(sectionId);

        // 🔹 products render under category
        productsSnap.docs.forEach((productDoc) => {
          const data = productDoc.data();

          rowContainer.innerHTML += `
            <!-- ========= product CARD CODE START ========== -->
          <div class="col-lg-3">
            <div class="card shadow-none border-0 rounded-4 col-12 p-2 mb-2">

                <div class="col-lg-12 mx-auto my-2">
                      <div class="col-12">
                    <img src="${data.image}" class="img-fluid col-12 rounded-4 product_home_img" alt="">
                </div>
                <h5 class="py-2 fs-6">${data.productTitle}</h5>
                <div class="d-flex flex-row justify-content-between align-items-center ">
                <div class="col-6">
                     <a href="${data.affiliateURL}" class="small d-flex fs_6 flex-row text-dark  align-items-center text-decoration-none">
              <i class="hgi hgi-stroke hgi-globe-02"></i>
              <span class="ms-1">    Visit Now   </span>
                </a>
                </div>
                <div class="col-6 text-end text-dark d-flex flex-row align-items-center justify-content-end">
<i class="hgi hgi-stroke hgi-timer-02 me-1"></i>
<span class="small fs_6">${data.dateAvailable}</span>
                </div>   
                </div>

                <!-- ======== REVEAL CODE START ======== -->
                 <div class="col-12 my-2 mt-3">
              <button type="button"  data-desc="${data.description}"
  data-code="${data.productCode}"
  data-url="${data.affiliateURL}"
  data-store="${data.brandStore}"
  data-img="${data.image}"
  data-title="${data.productTitle}"
  onclick="fns(this)" class="btn col-12 bg text-white rounded" data-bs-toggle="modal" data-bs-target="#exampleModal">
  <span class="">Reveal Code</span>
</button>


             <!-- ========= product MODAL CODE START ============= -->
     <div class="modal fade " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg bg py-4 px-2 rounded-3 d-flex flex-lg-row flex-column">
    <div class="modal-content mb-2">
      <div class="modal-header border-bottom-0 text-center d-flex flex-column align-items-center">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        <h1 class="modal-title fs-5 text-center" id="exampleModalLabel"></h1>
      </div>
      <div class="modal-body">
     <div>
     <button class="text-center col-12 coup_code_modal py-3 rounded-3" id="cop_inner">

     </button>

     <button class="col-12 my-2 py-2 bg text-white btn rounded-3" data-cpcode="" id="copy_btn" onclick="copycode(this)">
        Copy Code
     </button>
     <button class="bg-gray col-12 btn rounded-3 shadow-sm py-2">
        Visit Store
     </button>
     <p class="fs-6 text-center py-3 fw-light">Copy the code above and use it at checkout to get your discount!</p>
     </div>
      </div>
    
    </div>

        <div class="modal-content">
     
      <div class="modal-body">
     <div class="d-flex flex-column align-items-center">
        <img src="https://res.cloudinary.com/deq6ngtkw/image/upload/v1766700977/and1h3udbtzb6f5kiffb.jpg" class="img-fluid col-8 mx-auto rounded-circle product_modal_img" alt="" id="modal_img_copon">
    <h6 class="mt-4 fs-5" id="get_more_product">

        Get More Mixtiles UK Deals!
    </h6>

<p>Subscribe to get exclusive offers and discounts</p>
     
     <input type="text" class="form-control" placeholder="Enter your Email to Subscribe">
     <button class="btn bg text-white col-12 mt-2" onclick="subs()">
        Subscribe
     </button>
     <span class="small mt-2">We respect your privacy. Unsubscribe at any time.</span>
      </div>
    </div>
  </div>
</div>
</div>

             <!-- ========= product MODAL CODE END ============= -->

                 </div>
                <!-- ======== REVEAL CODE END ======== -->

                </div>
              
            </div>
          </div>
            <!-- ========= product CARD CODE END ========== -->
          `;
        });

      }

    } catch (error) {
      console.error("Error fetching home products:", error);
    }
  }

  fetchCategoriesForHome();
}
// =================== home_cat_product CODE END =========================

// =================== event_innerhtml CODE START ================================
var event_innerhtml=document.getElementById("event_innerhtml");

if(event_innerhtml){


// =================== event_innerhtml CODE START ================================
var event_innerhtml = document.getElementById("event_innerhtml");

if (event_innerhtml) {
  async function loadEventsCards() {
    try {
      const eventsRef = collection(db, "events");
      const snapshot = await getDocs(eventsRef);

      let html = ""; // temp variable to store innerHTML

      snapshot.forEach(doc => {
        const data = doc.data();

        html += `
          <div class="col-lg-3 mb-3">
            <div class="col-12 bg-white p-2 rounded-4 shadow-sm">
              <a href="single_events.html?id=${data.event_name}" class="text-decoration-none text-dark " >
                <img src="${data.images?.front || 'assets/placeholder.webp'}" class="img-fluid rounded-4 img_events" alt="${data.event_name || 'Event Image'}">
                <div class="mt-2">
                  <h5 class="fw-bolder">${data.event_name || 'Unnamed Event'}</h5>
                  <p>${data.content?.short || ''}</p>
                </div>
              </a>
            </div>
          </div>
        `;
      });

      // set all cards at once
      event_innerhtml.innerHTML = html;

    } catch (err) {
      console.error("Failed to load events for innerHTML:", err);
      event_innerhtml.innerHTML = "<p class='text-danger'>❌ Failed to load events.</p>";
    }
  }

  // call the function
  loadEventsCards();
}
// =================== event_innerhtml CODE END ==================================


}
// =================== event_innerhtmk code end ==================================


// =================== SINGLE EVENT CODE START =====================
var single_event_page_innerhtml=document.getElementById("single_event_page_innerhtml");
if(single_event_page_innerhtml){
const params = new URLSearchParams(window.location.search);
const eventName = params.get("id"); // ?id=Christmas-Deals

// ================= GET CONTAINER =================
const container = document.getElementById("single_event_content");

async function loadSingleEvent() {
  if (!container || !eventName) return;

  try {
    // query events collection for matching event_name
    const q = query(collection(db, "events"), where("event_name", "==", eventName));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = "<p class='text-center'>Event not found!</p>";
      return;
    }

    // take the first matching document
    const docSnap = snapshot.docs[0];
    const data = docSnap.data();
    // console.log(data.images.cover);
    

    // build innerHTML
    container.innerHTML = `
            <img src="${data.images.cover}" class="img-fluid banner_img" alt="">  
    `;

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p class='text-danger'>Failed to load event data.</p>";
  }
}

// call function
loadSingleEvent();
// =================== SINGLE EVENT productS CODE START =====================
var productContainer = document.getElementById("single_event_products");
if (productContainer && eventName) {
  async function loadEventproducts() {
    try {
      // query product collection for matching event_name
      console.log(eventName);
      
      const q = query(collection(db, "products"), where("events", "==", eventName));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        productContainer.innerHTML = "<p class='text-center'>No products found for this event!</p>";
        return;
      }

      // build innerHTML for each product
      let html = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(data);
        
        html += `
          <!-- ========= product CARD CODE START ========== -->
          <div class="col-lg-3">
            <div class="card shadow-sm border-0 rounded-4 col-12 p-2 mb-2">

                <div class="col-lg-12 mx-auto my-2">
                      <div class="col-12">
                    <img src="${data.image}" class="img-fluid col-12 rounded-4 product_home_img" alt="">
                </div>
                <h5 class="py-2 fs-6">${data.productTitle}</h5>
                <div class="d-flex flex-row justify-content-between align-items-center ">
                <div class="col-6">
                     <a href="${data.affiliateURL}" class="small d-flex fs_6 flex-row text-dark  align-items-center text-decoration-none">
              <i class="hgi hgi-stroke hgi-globe-02"></i>
              <span class="ms-1">    Visit Now   </span>
                </a>
                </div>
                <div class="col-6 text-end text-dark d-flex flex-row align-items-center justify-content-end">
<i class="hgi hgi-stroke hgi-timer-02 me-1"></i>
<span class="small fs_6">${data.dateAvailable}</span>
                </div>   
                </div>

                <!-- ======== REVEAL CODE START ======== -->
                 <div class="col-12 my-2 mt-3">
              <button type="button"  data-desc="${data.description}"
  data-code="${data.productCode}"
  data-url="${data.affiliateURL}"
  data-store="${data.brandStore}"
  data-img="${data.image}"
  data-title="${data.productTitle}"
  onclick="fns(this)" class="btn col-12 bg text-white rounded" data-bs-toggle="modal" data-bs-target="#exampleModal">
  <span class="">Reveal Code</span>
</button>


             <!-- ========= product MODAL CODE START ============= -->
     <div class="modal fade " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg bg py-4 px-2 rounded-3 d-flex flex-lg-row flex-column">
    <div class="modal-content mb-2">
      <div class="modal-header border-bottom-0 text-center d-flex flex-column align-items-center">
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        <h1 class="modal-title fs-5 text-center" id="exampleModalLabel"></h1>
      </div>
      <div class="modal-body">
     <div>
     <button class="text-center col-12 coup_code_modal py-3 rounded-3" id="cop_inner">

     </button>

     <button class="col-12 my-2 py-2 bg text-white btn rounded-3" data-cpcode="" id="copy_btn" onclick="copycode(this)">
        Copy Code
     </button>
     <button class="bg-gray col-12 btn rounded-3 shadow-sm py-2">
        Visit Store
     </button>
     <p class="fs-6 text-center py-3 fw-light">Copy the code above and use it at checkout to get your discount!</p>
     </div>
      </div>
    
    </div>

        <div class="modal-content">
     
      <div class="modal-body">
     <div class="d-flex flex-column align-items-center">
        <img src="https://res.cloudinary.com/deq6ngtkw/image/upload/v1766700977/and1h3udbtzb6f5kiffb.jpg" class="img-fluid col-8 mx-auto rounded-circle product_modal_img" alt="" id="modal_img_copon">
    <h6 class="mt-4 fs-5" id="get_more_product">

        Get More Mixtiles UK Deals!
    </h6>

<p>Subscribe to get exclusive offers and discounts</p>
     
     <input type="text" class="form-control" placeholder="Enter your Email to Subscribe">
     <button class="btn bg text-white col-12 mt-2" onclick="subs()">
        Subscribe
     </button>
     <span class="small mt-2">We respect your privacy. Unsubscribe at any time.</span>
      </div>
    </div>
  </div>
</div>
</div>

             <!-- ========= product MODAL CODE END ============= -->

                 </div>
                <!-- ======== REVEAL CODE END ======== -->

                </div>
              
            </div>
          </div>
  
        `;
      });

      productContainer.innerHTML = html;

    } catch (err) {
      console.error(err);
      productContainer.innerHTML = "<p class='text-danger'>Failed to load products.</p>";
    }
  }

  // call function
  loadEventproducts();
}

}
// =================== SINGLE EVENT CODE END =====================


// =================== TOP-DISCOUNT.HTML CODE START ===========================
var trend_store=document.getElementById("trend_store");
if(trend_store){
  var trend_store_inner=document.getElementById("trend_store_inner");
       async function loadStores() {
            try {
              const storeSnapshot = await getDocs(collection(db, "store"));
              storeSnapshot.forEach((doc) => {
                const data = doc.data();
                if(data.show_trending && data.status == "active"){
                
trend_store_inner.innerHTML+=`
    <div class="col-12">
        <div class="border rounded bg-white p-3 d-flex flex-lg-row flex-column align-items-center">

            <!-- Image -->
            <div class="col-lg-3 col-12 text-center mb-3 mb-lg-0">
                <img 
                    src="${data.img ? data.img : data.image}" 
                    class="img-fluid img_of_feature_stire p-1" 
                 
                    alt="${data.name}">
            </div>

            <!-- Content -->
            <div class="col-lg-6 col-12 text-start ps-lg-1">
                <h5 class="text-dark mb-2">${data.name}</h5>
                <p class="mb-0 text-muted">
                ${data.about}
                </p>
            </div>

            <!-- Button -->
            <div class="col-lg-3 col-12 text-lg-end text-center mt-3 mt-lg-0">
                <a href="/store/store.html?=${data.name}" class="btn bg text-white py-2 px-3 rounded-2">
                    View Store
                </a>
            </div>

        </div>
    </div>
`
                }
              
              });
            } catch (err) {
              console.error("Error fetching stores:", err);
              store_dropdown.innerHTML = `<option value="">Error loading stores</option>`;
            }
          }
          loadStores();
}
// =================== TOP-DISCOUNT.HTML CODE END ===========================




// =================== TOP-20-DISCOUNT.HTML CODE START ===========================
var trend_20_store=document.getElementById("trend_20_store");
if(trend_20_store){
  var trend_20_store_inner=document.getElementById("trend_20_store_inner");
       async function loadStores() {
            try {
             const q = query(collection(db, "store"), limit(20));
  const storeSnapshot = await getDocs(q);
   storeSnapshot.forEach((doc) => {
                const data = doc.data();
               
                
                if( data.status == "active"){
          
trend_20_store_inner.innerHTML+=`
    <div class="col-12">
        <div class="border rounded bg-white p-3 d-flex flex-lg-row flex-column align-items-center">

            <!-- Image -->
            <div class="col-lg-3 col-12 text-center mb-3 mb-lg-0">
                <img 
                    src="${data.img ? data.img : data.image}" 
                    class="img-fluid img_of_feature_stire p-1" 
                 
                    alt="${data.name}">
            </div>

            <!-- Content -->
            <div class="col-lg-6 col-12 text-start ps-lg-1">
                <h5 class="text-dark mb-2">${data.name}</h5>
                <p class="mb-0 text-muted">
                ${data.about}
                </p>
            </div>

            <!-- Button -->
            <div class="col-lg-3 col-12 text-lg-end text-center mt-3 mt-lg-0">
                <a href="${data.link}" target="_blank" class="btn bg text-white py-2 px-3 rounded-2">
                    View Store
                </a>
            </div>

        </div>
    </div>
`
                }
              
              });
            } catch (err) {
              console.error("Error fetching stores:", err);
              store_dropdown.innerHTML = `<option value="">Error loading stores</option>`;
            }
          }
          loadStores();
}
// =================== TOP-20-DISCOUNT.HTML CODE END ===========================


// =================== search_store_row code start =========
var search_store_row = document.getElementById("search_store_row");

if (search_store_row) {

    async function loadStores() {

        try {

            const storeSnapshot = await getDocs(collection(db, "store"));
            const stores = [];

            storeSnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.status === "active") {
                    stores.push(data);
                }
            });

            renderStores(stores);

            const searchInput = document.getElementById("searchInput");

            searchInput.addEventListener("input", () => {

                const searchValue = searchInput.value.toLowerCase();

                const filtered = stores.filter(store =>
                    store.name.toLowerCase().includes(searchValue)
                );

                renderStores(filtered);

            });

        } catch (err) {
            console.error("Error fetching stores:", err);
        }
    }

    function renderStores(storeList) {

        search_store_row.innerHTML = "";
  if (storeList.length === 0) {
        search_store_row.innerHTML = `
            <div class="col-12 text-center py-4">
                <h5 class="text-muted">No Result Found 😕</h5>
            </div>
        `;
        return;
    }
        storeList.forEach(data => {

            search_store_row.innerHTML += `
                <div class="col-lg-4">
                    <a class="col-12 d-flex bg-white py-2 bg-gray p-2 search_Card shadow-lg text-decoration-none text-dark" href="/store/store.html?=${data.name}">
                        <img src="${data.image ? data.image : data.img}" class="img-fluid img_searhc_Card" alt="img">
                        <div class="d-flex ps-2 flex-column">
                            <h6>${data.name}</h6>
                            <p class="lh-1 fs_6 fw-normal">Visit Now</p>
                        </div>
                    </a>
                </div>
            `;

        });

    }

    loadStores();
}
// =================== search_store_row code end ================



// ==================== checkout_page code start =========================
var checkout_page=document.getElementById("checkout_page");
// console.log(checkout_page);

if(checkout_page){
  document.addEventListener("DOMContentLoaded", loadCheckout);

function loadCheckout() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  console.log(cart);
  

  const container = document.getElementById("checkoutItems");
  const subTotalEl = document.getElementById("subTotal");
  const grandTotalEl = document.getElementById("grandTotal");

  if (cart.length === 0) {
    container.innerHTML = `<p class="text-center">No items in cart</p>`;
    subTotalEl.innerText = "Rs 0";
    grandTotalEl.innerText = "Rs 0";
    return;
  }

  let html = "";
  let subTotal = 0;

  cart.forEach((item) => {
    subTotal += item.total;
    console.log(item);
    

    html += `
      <div class="d-flex align-items-center mb-3 border-bottom pb-2">

        <!-- IMAGE -->
        <div class="position-relative me-3">
          <img src="${item.img}" width="60" class="rounded border">
          <span class="position-absolute top-0 start-100 translate-middle badge bg-dark">
            ${item.quantity}
          </span>
        </div>

        <!-- DETAILS -->
        <div class="flex-grow-1 small">
          <p class="mb-0 fw-bold">${item.name}</p>
        </div>

        <!-- PRICE -->
        <div class="fw-bold">
          Rs ${item.total}
        </div>

      </div>
    `;
  });

  // ✅ render items
  container.innerHTML = html;

  // ✅ totals
  subTotalEl.innerText = `Rs ${subTotal}`;

  const shipping = 200;
  const grandTotal = subTotal + shipping;

  grandTotalEl.innerText = `Rs ${grandTotal}`;
}
loadCheckout();
}
// ==================== checkout_page code end ===========================









// ================ CONTACT PAGE CODE START ======================
var contact_form=document.getElementById("contact_form");
if(contact_form){
const contactForm = document.querySelector("form");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // ðŸ”¹ get values
  const firstName = contactForm.querySelector('input[placeholder="Enter your first name"]').value;
  const lastName = contactForm.querySelector('input[placeholder="Enter your last name"]').value;
  const email = contactForm.querySelector('input[type="email"]').value;
  const phone = contactForm.querySelector('input[type="tel"]').value;

  const message = contactForm.querySelector("textarea").value;

  try {
    // ðŸ”¹ add to Firestore
    await addDoc(collection(db, "contact"), {
      firstName,
      lastName,
      email,
      phone,
     
      message,
      seen:"no",
      reply:"no",
      createdAt: new Date()
    });
 // ðŸ”¹ EmailJS send
  // emailjs.send("service_3vjhp2r", "template_w1a3q2g", {
  //     firstName,
  //     lastName,
  //     email,
  //     phone,
  //     message
  // }).then(function(response) {

  // }, function(error) {
  //     // console.error("EmailJS Error:", error);
  // });
 
Swal.fire({
  title: "Good job!",
  text: "Your Form Is Submited successfully!",
  icon: "success"
});
    contactForm.reset();

  } catch (error) {
    console.error("Error saving contact:", error);
    alert("Something went wrong. Try again!");
  }
});
}
// ================ CONTACT PAGE CODE END =======================

async function getData() {
  try {
    const response = await fetch("https://myapi-git-main-fasih-nasirs-projects-16b907a5.vercel.app/api/contact");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data);

  } catch (error) {
    console.error("Error:", error);
  }
}

getData();