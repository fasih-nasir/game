import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth,signInWithEmailAndPassword , onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";  // ✅ Removed 'auth' from import
  import { getFirestore,addDoc, collection, getDocs,getDoc,doc ,deleteDoc, updateDoc} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
 
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


// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Initialize Auth
const auth = getAuth(app);

const db = getFirestore(app);
// ✅ Check Auth State
onAuthStateChanged(auth, (user) => {
  if (!user) {
    // window.location.href = 'login.html'; 
  }
});

// =================== CHECK CURRENT USER CODE END ===========================


// ============ LOGOUT CODE START =======================
 const logoutBtn = document.getElementById('logout-btn');

  if(logoutBtn){
      logoutBtn.addEventListener('click', () => {
            signOut(auth).then(() => {
                // Redirect to login page after successful logout
                if(!window.location.pathname.split("/dashboard/")[1] == "login.html" ){
                  window.location.href = 'login.html'; // Adjust path to login.html if needed
                }
            }).catch((error) => {
                // Handle errors (optional)
                console.error("Error logging out: ", error);
            });
        })
  }
// ============ LOGOUT CODE END =========================


// ============= nav_pills code start ===========
var nav_pills=document.getElementById("nav_pills");
if(nav_pills){
    fetch("nav_pills.html")
    .then(res => res.text())
    .then((e)=>{
        nav_pills.innerHTML=e;
        // ============ DROPDOWN SHOW CODE START =============
      

        // ============ DROPDOWM SHOW CODE END =============== 
        // ============= PILLS TOGGLE CODE START =============

    // const offcanvas = document.getElementById('offcanvasScrolling');
    // const sidebar = document.getElementById('nav_pills');
    // const contents = document.querySelectorAll('.tab-content');

    // if (offcanvas && sidebar && contents.length > 0) {

    //     offcanvas.addEventListener('hidden.bs.offcanvas', function () {

    //         sidebar.classList.remove('col-lg-2');

    //         contents.forEach(content => {
    //             content.classList.remove('col-lg-10');
    //             content.classList.add('col-lg-12');
    //         });

    //     });

    //     offcanvas.addEventListener('shown.bs.offcanvas', function () {

    //         sidebar.classList.add('col-lg-2');

    //         contents.forEach(content => {
    //             content.classList.remove('col-lg-12');
    //             content.classList.add('col-lg-10');
    //         });

    //     });

    // }


    //     // ============= PILLS TOGGLE CODE END =============

        // ======================== NAV-LINK ACTIVE CODE START =================
const currentPage = window.location.pathname.split('/').pop();
const navLinks = document.querySelectorAll('.nav_pills_link');

navLinks.forEach(link => {
  const hrefPage = link.getAttribute('href')?.split('/').pop(); // get only the filename from href

  if (hrefPage === currentPage) {
    link.classList.add('active');
  } else {
    link.classList.remove('active');
  }
});

        // ======================== NAV-LINK ACTIVE CODE END ===================
    })
}
// ============= nav_pills code end =============


// ===================== categoryselect code start ======================
const categoryselect = document.querySelectorAll(".categoryselect");

if (categoryselect.length > 0) {

  async function loadCategories() {
    try {
      const snapshot = await getDocs(collection(db, "categories"));

      categoryselect.forEach(select => {
        // Default option
        select.innerHTML = `<option value="">Select Category</option>`;

        snapshot.forEach(doc => {
          const data = doc.data();
       
          

          // 👇 new keys ke hisaab se (name use karo)
          select.innerHTML += `<option value="${data.name}|${data.slug}">${data.name}</option>`;
        });
      });

    } catch (err) {
      console.error("Error fetching categories:", err);

      categoryselect.forEach(select => {
        select.innerHTML = `<option value="">Error loading Category</option>`;
      });
    }
  }

  loadCategories();
}

// ===================== categoryselect code end ==========================

         // ========== DOM References ==========
         if( document.getElementById("category_lenght")){
         document.getElementById("category_lenght").innerHTML=`  <div class="spinner-border text-center" role="status">
 <span class="visually-hidden">Loading...</span>
 </div>`;
      const categorySnapshot = await getDocs(collection(db, "store"));
var num=0;
      categorySnapshot.forEach(doc => {
num++;
        document.getElementById("category_lenght").innerHTML=num;

      });


         }
// ========== FETCH PRODUCT IS HOME PAGE START ================
if(document.getElementById("product_lenght")){
document.getElementById("product_lenght").innerHTML=`  <div class="spinner-border text-center" role="status">
<span class="visually-hidden">Loading...</span>
</div>`;
async function fetchProducts() {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));

      let count = 0;
      querySnapshot.forEach((doc,index) => {

        count++;
document.getElementById("product_lenght").innerHTML=count;
document.getElementById("total_product").innerHTML=count
       
      });
    } catch (error) {
    
    }
  }

  fetchProducts();
}


// ============= CODE STARR top_20" ================
var top_20=document.getElementById("top_20");
if(top_20){

  
}
// ============= CODE END top_20 =============


// ============= stats code start ===================
var stats=document.getElementById("stats");
if(stats){
    fetch("stats.html")
    .then(res => res.text())
    .then((e)=>{
        stats.innerHTML=e;
      async function getCollectionCount(collectionName, elementId) {
    const snapshot = await getDocs(collection(db, collectionName));
    document.getElementById(elementId).innerText = snapshot.size;
}

// Call for each collection
getCollectionCount("products", "productCount");
getCollectionCount("store", "storeCount");
getCollectionCount("categories", "categoryCount");
getCollectionCount("blog", "blogCount");
getCollectionCount("events", "eventCount");

      })
      }
// ============= stats code end ======================



// ======================== LOGIN.HTML CODE START ======================
    // Handle Login Form
    // console.log(window.location.pathname.split("/dashboard/")[1] == "login.html" );
    
    const loginForm = document.getElementById("loginForm");
    if(loginForm){
      const message = document.getElementById("message");

    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      try {
        await signInWithEmailAndPassword(auth, email, password);
        message.classList.remove("text-danger");
        message.classList.add("text-success");
        message.textContent = "✅ Login successful!";

      
                  setTimeout(() => {
          location.href="dashboard.html"
        }, 1000);
       
      } catch (error) {
        message.classList.remove("text-success");
        message.classList.add("text-danger");
        message.textContent = "❌ " + error.message;
      }
    });
    }
// ======================== LOGIN.HTML CODE END ===========================



// ======================== ADD CATEGORY CODE START =======================

var add_categories=document.getElementById("add_categories");


if(add_categories){
// ============================
// Get Form & Elements
// ============================
const categoryForm = document.getElementById("categoryForm");
const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("image_preview");

// ============================
// Image Preview
// ============================
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    imagePreview.src = URL.createObjectURL(file);
  } else {
    imagePreview.src = "https://placehold.co/600x400";
  }
});

// ============================
// Form Submit
// ============================
categoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // ============================
  // Get All Field Values
  // ============================
  const name = document.getElementById("name").value.trim();
  const slug = document.getElementById("slug").value.trim();
  const content = document.getElementById("content").value.trim();

  const meta_title = document.getElementById("meta_title").value.trim();
  const meta_keywords = document.getElementById("meta_keywords").value.trim();
  const meta_desc = document.getElementById("meta_desc").value.trim();
  const canonical = document.getElementById("canonical").value.trim();
  const schema = document.getElementById("schema").value.trim();

  const show_home = document.getElementById("show_home").checked;
  const recommended = document.getElementById("recommended").checked;
  const feature = document.getElementById("feature").checked;
  const status = document.getElementById("Status").value;

  const file = imageInput.files[0];

  try {
    let imageUrl = "";

    // ============================
    // Upload Image to Cloudinary
    // ============================
    if (file) {
      const cloudName = "dnob3deih";      // Your Cloudinary cloud_name
      const uploadPreset = "games-acc";      // Your unsigned preset

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      imageUrl = data.secure_url;
    }

    // ============================
    // Firestore Save
    // ============================
    const storeCollection = collection(db, "categories");

    const storeData = {
      name: name,
      slug: slug,
      content: content,

      meta_title: meta_title,
      meta_keywords: meta_keywords,
      meta_desc: meta_desc,
      canonical: canonical,
      schema: schema,

      img: imageUrl,

      show_home: show_home,
      recommended: recommended,
      feature: feature,
      status: status,

      createdAt: new Date().toISOString()
    };

    await addDoc(storeCollection, storeData);

    // ============================
    // Reset Form + Preview
    // ============================
    alert("✅ Category saved successfully!");
    categoryForm.reset();
    imagePreview.src = "https://placehold.co/600x400";

  } catch (err) {
    console.error(err);
    alert("❌ Error uploading image or saving data!");
  }
});;
}
 
// ======================== ADD CATEGORY CODE END =======================


// ========================= VIEW CATEGORY CODE START =======================
var categorieshtml=document.getElementById("categories.html");
if(categorieshtml){
  // ============================
// Table Body
// ============================
const storeTableBody = document.querySelector("#storeTable tbody");

// ============================
// FETCH CATEGORIES
// ============================
async function fetchStoreData() {
  storeTableBody.innerHTML = ""; // Clear previous data

  try {
    const storeCollection = collection(db, "categories");
    const snapshot = await getDocs(storeCollection);

    if (snapshot.empty) {
      storeTableBody.innerHTML = `<tr><td colspan="8" class="text-center">No categories found</td></tr>`;
      return;
    }

    let counter = 1;

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const docId = docSnap.id;
      const createdAt = data.createdAt ? new Date(data.createdAt).toLocaleString() : "";

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${counter++}</td>
        <td>${data.name || ""}</td>
        <td><a href="${data.slug || "#"}" target="_blank">${data.slug || ""}</a></td>
        <td>${data.meta_title || ""}</td>
        <td>${data.img ? `<img src="${data.img}" width="100" class="img-thumbnail"/>` : ""}</td>
        <td class="text-center">
          <span class="${data.status === "active" ? "bg-success text-white p-1 rounded" : "bg-danger text-white p-1 rounded"}">
            ${data.status === "active" ? "Active" : "Disable"}
          </span>
        </td>
        <td>${createdAt}</td>
        <td>
          <a href="edit_categories.html?id=${docId}">
            <button class="btn btn-sm bg-white p-1 shadow-lg me-1 edit-bt mb-2" data-id="${docId}">
              <i class="hgi hgi-stroke hgi-pencil-edit-02"></i>
            </button>
          </a>
          <button class="btn btn-sm bg-white p-1 shadow-lg delete-btn" data-id="${docId}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;

      storeTableBody.appendChild(row);
    });

  } catch (err) {
    console.error("Error fetching category data:", err);
    storeTableBody.innerHTML = `<tr><td colspan="8" class="text-center text-danger">Error loading data</td></tr>`;
  }
}

// ============================
// DELETE FUNCTION
// ============================
async function deleteStore(docId) {
  if (!confirm("Are you sure you want to delete this category?")) return;

  try {
    await deleteDoc(doc(db, "categories", docId));
    alert("Category deleted successfully!");
    fetchStoreData(); // Refresh table
  } catch (err) {
    console.error("Error deleting category:", err);
    alert("Failed to delete category!");
  }
}

// ============================
// EVENT DELEGATION
// ============================
storeTableBody.addEventListener("click", (e) => {
  const btn = e.target.closest(".delete-btn");
  if (btn) {
    const id = btn.dataset.id;
    deleteStore(id);
  }
});

// ============================
// INITIAL FETCH
// ============================
fetchStoreData();
}
// ========================= VIEW CATEGORY CODE END ==========================


//=========================== edit_categories.html code start =========================
var edit_categories=document.getElementById("edit_categories");
if(edit_categories){
  var page_id=window.location.href.split("?id=")[1];

  const imgPreview = document.getElementById("image_preview");


          const docRef = doc(db, "categories",page_id); // Example: collection "users", document ID "alovelace"
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {

const data = docSnap.data();
   // ======= Basic Info =======
      document.getElementById("name").value = data.name || "";
      document.getElementById("slug").value = data.slug || "";
      document.getElementById("content").value = data.content || "";

      // ======= SEO Fields =======
      document.getElementById("meta_title").value = data.meta_title || "";
      document.getElementById("meta_keywords").value = data.meta_keywords || "";
      document.getElementById("meta_desc").value = data.meta_desc || "";
      document.getElementById("canonical").value = data.canonical || "";
      document.getElementById("schema").value = data.schema || "";

      // ======= Toggle / Checkbox Fields =======
      document.getElementById("show_home").checked = data.show_home ?? false;
      document.getElementById("recommended").checked = data.recommended ?? false;
      document.getElementById("feature").checked = data.feature ?? false;

      // Status select dropdown
      document.getElementById("Status").value = data.status || "";

      // ======= Image Preview =======
      if (imgPreview && data.img) {
        imgPreview.src = data.img;
        imgPreview.classList.remove("d-none");
      }

      // ======= Update preview on file select =======
      const fileInput = document.getElementById("image");
      fileInput.addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
          imgPreview.src = URL.createObjectURL(file);
          imgPreview.classList.remove("d-none");
        }
      });

    } else {
      console.log("No document found with ID:", page_id);
    }

  


        //  ========== GET DATA ACCORDING TO ID CODE END ==========



        //  ============== ADD STORE CODE START ====================
   const categoryForm = document.getElementById("categoryForm");
const preview = document.getElementById("preview");

categoryForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const slug = document.getElementById("slug").value.trim();
  const content = document.getElementById("content").value.trim();

  const meta_title = document.getElementById("meta_title").value.trim();
  const meta_keywords = document.getElementById("meta_keywords").value.trim();
  const meta_desc = document.getElementById("meta_desc").value.trim();
  const canonical = document.getElementById("canonical").value.trim();
  const schema = document.getElementById("schema").value.trim();

  const show_home = document.getElementById("show_home").checked;
  const recommended = document.getElementById("recommended").checked;
  const feature = document.getElementById("feature").checked;
  const status = document.getElementById("Status").value.trim();
  const fileInput = document.getElementById("image");

  const file = fileInput.files[0];


  try {
    // ✅ Cloudinary config
    const cloudName = "dnob3deih";      // your Cloudinary cloud_name
    const uploadPreset = "games-acc";      // your unsigned preset

  
    let imageUrl = imgPreview.src;
if (file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData
  });
  const data = await res.json();
  imageUrl = data.secure_url; // new uploaded image
}
   
     const docRef = doc(db, "categories", page_id);
    await updateDoc(docRef, {
   name: name,
      slug: slug,
      content: content,

      meta_title: meta_title,
      meta_keywords: meta_keywords,
      meta_desc: meta_desc,
      canonical: canonical,
      schema: schema,

      img: imageUrl,

      show_home: show_home,
      recommended: recommended,
      feature: feature,
      status: status,

  createdAt: new Date().toISOString()
    });
   

// Save to Firebase
// await addDoc(storeCollection, storeData);


    alert("✅ Category Update successfully!");
    categoryForm.reset();

  } catch (err) {
    console.error(err);
    alert("❌ Error uploading image or saving data!");
  }
});
    
}
// ========================== edit_categories.html code end -===========================




// =========================== add_product code start =========================
var add_product=document.getElementById("add_product");
if(add_product){


  // ============================
// Get Form + Elements
// ============================
const storeForm = document.getElementById("storeForm");
const imageInput = document.getElementById("storeImg");
const imagePreview = document.getElementById("image_preview");

// ============================
// Image Preview
// ============================
imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    imagePreview.src = URL.createObjectURL(file);
  }
});

// ============================
// Form Submit
// ============================
storeForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // ============================
  // Get Form Values
  // ============================
  const productTitle = document.getElementById("productTitle").value.trim();
  const category = document.getElementById("categoryselect").value;
  const productCode = document.getElementById("productCode").value.trim();
  const slug = document.getElementById("slug").value.trim();

  const price = document.getElementById("price").value;
  const discount_price = document.getElementById("discount_price").value;
  const rating = document.getElementById("rating").value;

  const stock = document.getElementById("stock").value;
  const submittedBy = document.getElementById("submittedBy").value.trim();

  const description = document.getElementById("description").value.trim();

  const meta_title = document.getElementById("meta_title").value.trim();
  const meta_keywords = document.getElementById("meta_keywords").value.trim();
  const meta_desc = document.getElementById("meta_desc").value.trim();
  const canonical = document.getElementById("canonical").value.trim();
  const schema = document.getElementById("schema").value.trim();

  // ============================
  // Toggles
  // ============================
  const show_home = document.getElementById("show_home").checked;
  const arrivals = document.getElementById("arrivals").checked;
  const best_selling = document.getElementById("best_selling").checked;
  const feature = document.getElementById("feature").checked;
  const status = document.getElementById("Status").value;

  const file = imageInput.files[0];

  try {
    let imageUrl = "";

    // ============================
    // Upload Image (Cloudinary)
    // ============================
    if (file) {
      const cloudName = "dnob3deih";
      const uploadPreset = "games-acc";

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
      imageUrl = data.secure_url;
    }

    // ============================
    // Save to Firestore (products)
    // ============================
    const productCollection = collection(db, "products");

    const productData = {
      productTitle,
      category,
      productCode,

      price,
      discount_price,
      rating,

      stock,
      submittedBy,

      description,
 slug ,

      meta_title,
      meta_keywords,
      meta_desc,
      canonical,
      schema,

      img: imageUrl,

      show_home,
      arrivals,
      best_selling,
      feature,
      status,

      createdAt: new Date().toISOString()
    };

    await addDoc(productCollection, productData);

    // ============================
    // Reset Form
    // ============================
    alert("✅ Product added successfully!");
    storeForm.reset();
    imagePreview.src = "https://placehold.co/600x400";

  } catch (err) {
    console.error(err);
    alert("❌ Error saving product!");
  }
});
}
// =========================== add_product code end ============================



// ============================= view_product code start =======================
var view_product=document.getElementById("view_product");
if(view_product){


  // ===================== PRODUCTS TABLE CODE START ======================

const productTableBody = document.getElementById("prodcut_of_home_page");

// FETCH PRODUCTS
async function fetchProducts() {
  productTableBody.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "products"));

    if (snapshot.empty) {
      productTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center">No Products Found</td>
        </tr>`;
      return;
    }

    let counter = 1;

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const docId = docSnap.id;

      const row = document.createElement("tr");

      row.innerHTML= `
        <td>${counter++}</td>
        <td>${data.productTitle || ""}</td>
        <td>${data.productCode || ""}</td>
        <td>${data.category || ""}</td>
        <td>${data.submittedBy || ""}</td>

        <td>
          ${
            data.img
              ? `<img src="${data.img}" class="img-thumbnail" style="width:70px;height:70px;object-fit:cover;">`
              : "No Image"
          }
        </td>

        <td>
          <span class="${
            data.status === "active"
              ? "bg-success text-white p-1 rounded-2"
              : "bg-danger text-white p-1 rounded-2"
          }">
            ${data.status === "active" ? "Active" : "Inactive"}
          </span>
        </td>

        <td class="d-flex">
          <a href="edit_product.html?id=${docId}">
            <button class="btn btn-sm shadow p-2 rounded me-1">
              <i class="hgi hgi-stroke hgi-pencil-edit-02"></i>
            </button>
          </a>

          <button class="btn btn-sm shadow p-2 rounded delete-btn" data-id="${docId}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;

      productTableBody.appendChild(row);
    });

  } catch (err) {
    console.error("Error fetching products:", err);
    productTableBody.innerHTML = `
      <tr>
        <td colspan="8" class="text-danger text-center">Error loading products</td>
      </tr>`;
  }
}

// ===================== DELETE FUNCTION ======================
async function deleteProduct(docId) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    await deleteDoc(doc(db, "products", docId));
    alert("✅ Product deleted!");
    fetchProducts();
  } catch (err) {
    console.error(err);
    alert("❌ Failed to delete product!");
  }
}

// ===================== EVENT DELEGATION ======================
productTableBody.addEventListener("click", (e) => {
  const btn = e.target.closest(".delete-btn");
  if (btn) {
    const id = btn.dataset.id;
    deleteProduct(id);
  }
});

// ===================== INITIAL CALL ======================
fetchProducts();

// ===================== PRODUCTS TABLE CODE END ======================
}
// ============================= view_product code end =========================
// ============================ edit_product code start =======================
var edit_product = document.getElementById("edit_product");

if (edit_product) {

  const storeForm = document.getElementById("storeForm");
  const page_id = window.location.href.split("?id=")[1];

  const imgPreview = document.getElementById("image_preview");
  const imageInput = document.getElementById("storeImg");

  // ✅ FIX: GLOBAL VARIABLE (top pe)
  let existingImageUrl = "";

  // ================= FETCH PRODUCT =================
  const docRef = doc(db, "products", page_id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {

    const data = docSnap.data();
 document.getElementById("slug").value=data.slug||"";

    document.getElementById("productTitle").value = data.productTitle || "";
    document.getElementById("productCode").value = data.productCode || "";
    document.getElementById("submittedBy").value = data.submittedBy || "";
    document.getElementById("description").value = data.description || "";

    document.getElementById("categoryselect").value = data.category || "";

    document.getElementById("price").value = data.price || "";
    document.getElementById("discount_price").value = data.discount_price || "";
    document.getElementById("rating").value = data.rating || "";
    document.getElementById("stock").value = data.stock || "";

    document.getElementById("meta_title").value = data.meta_title || "";
    document.getElementById("meta_keywords").value = data.meta_keywords || "";
    document.getElementById("meta_desc").value = data.meta_desc || "";
    document.getElementById("canonical").value = data.canonical || "";
    document.getElementById("schema").value = data.schema || "";

    document.getElementById("show_home").checked = data.show_home ?? false;
    document.getElementById("arrivals").checked = data.arrivals ?? false;
    document.getElementById("best_selling").checked = data.best_selling ?? false;
    document.getElementById("feature").checked = data.feature ?? false;

    document.getElementById("Status").value = data.status || "";

    // ✅ SAVE EXISTING IMAGE
    existingImageUrl = data.img || "";

    if (imgPreview && data.img) {
      imgPreview.src = data.img;
    }

  }

  // ================= IMAGE PREVIEW =================
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
      imgPreview.src = URL.createObjectURL(file);
    }
  });

  // ================= SUBMIT UPDATE =================
  storeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const productTitle = document.getElementById("productTitle").value.trim();
    const productCode = document.getElementById("productCode").value.trim();
    const submittedBy = document.getElementById("submittedBy").value.trim();
    const description = document.getElementById("description").value.trim();
  const slug = document.getElementById("slug").value.trim();

    const category = document.getElementById("categoryselect").value;

    const price = document.getElementById("price").value;
    const discount_price = document.getElementById("discount_price").value;
    const rating = document.getElementById("rating").value;
    const stock = document.getElementById("stock").value;

    const meta_title = document.getElementById("meta_title").value.trim();
    const meta_keywords = document.getElementById("meta_keywords").value.trim();
    const meta_desc = document.getElementById("meta_desc").value.trim();
    const canonical = document.getElementById("canonical").value.trim();
    const schema = document.getElementById("schema").value.trim();

    const show_home = document.getElementById("show_home").checked;
    const arrivals = document.getElementById("arrivals").checked;
    const best_selling = document.getElementById("best_selling").checked;
    const feature = document.getElementById("feature").checked;

    const status = document.getElementById("Status").value;

    const file = imageInput.files[0];

    let imageUrl = existingImageUrl; // ✅ now works

    try {

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "games-acc");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dnob3deih/image/upload",
          { method: "POST", body: formData }
        );

        const imgData = await res.json();
        imageUrl = imgData.secure_url;
      }

      await updateDoc(doc(db, "products", page_id), {
        productTitle,
        productCode,
        submittedBy,
        description,
        category,
        price,slug,
        discount_price,
        rating,
        stock,
        meta_title,
        meta_keywords,
        meta_desc,
        canonical,
        schema,
        img: imageUrl,
        show_home,
        arrivals,
        best_selling,
        feature,
        status,
        updatedAt: new Date().toISOString()
      });

      alert("✅ Product updated successfully!");

    } catch (err) {
      console.error(err);
      alert("❌ Update failed!");
    }
  });

}
// ============================ edit_product code end =======================

















// ============================= view_contact code start =======================
var view_contact=document.getElementById("view_contact");
if(view_contact){


  // ===================== PRODUCTS TABLE CODE START ======================

const productTableBody = document.getElementById("prodcut_of_home_page");


async function loadContacts() {
 productTableBody.innerHTML = ""; // clear table
  let count = 1;

  try {
    const snapshot = await getDocs(collection(db, "contact"));

    if (snapshot.empty) {
     productTableBody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center text-muted">
            No contact records found
          </td>
        </tr>`;
      return;
    }

    snapshot.forEach(doc => {
      document.getElementById("total_contact").innerHTML=snapshot.size;
      const data = doc.data();

  const docId = doc.id;
     productTableBody.innerHTML += `
        <tr>
          <td>${count++}</td>
          <td>${data.firstName || "-"}</td>
          <td>${data.lastName || "-"}</td>
          <td>${data.email || "-"}</td>
          <td>${data.phone || "-"}</td>

          <td>${data.message || "-"}</td>
          <td>${data.createdAt 
              ? new Date(data.createdAt.seconds * 1000).toLocaleString()
              : "-"}</td>
           <td>
              <button class="btn btn-sm btn-delete" data-id="${(docId)
              }">
                <i class="hgi hgi-stroke hgi-delete-01 fs-5 text-danger"></i>
              </button>
            </td>
        </tr>
      `;
    });

      // Attach delete event listeners
      document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", async () => {
          const docId = btn.dataset.id;
          await deleteContact(docId);
        });
      });

  } catch (error) {
    console.error("Error loading contacts:", error);
  } // ---------------- DELETE FUNCTION ----------------
  async function deleteContact(docId) {


    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      await deleteDoc(doc(db, "contact", docId));

      alert("Contact deleted successfully ✅");
loadContacts();

      // Remove row from table instantly
      const row = document.getElementById(`row-${docId}`);
      if (row) row.remove();

    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact ❌");
    }
  }

}

// call function
loadContacts();
}

// ===================== PRODUCTS TABLE CODE END ======================

// ============================= view_contact code end =========================




// ============================= view_query code start =======================
var view_query=document.getElementById("view_query");
if(view_query){


  // ===================== PRODUCTS TABLE CODE START ======================

const productTableBody = document.getElementById("prodcut_of_home_page");


async function loadContacts() {
 productTableBody.innerHTML = ""; // clear table
  let count = 1;

  try {
    const snapshot = await getDocs(collection(db, "ask_question"));

    if (snapshot.empty) {
     productTableBody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center text-muted">
            No contact records found
          </td>
        </tr>`;
      return;
    }

    snapshot.forEach(doc => {
      document.getElementById("total_Query").innerHTML=snapshot.size;
      const data = doc.data();
      // console.log(data);
      

  const docId = doc.id;
     productTableBody.innerHTML += `
     <tr>
  <td>${count++}</td>

  <td>${data.name || "-"}</td>
  <td>${data.email || "-"}</td>
  <td>${data.phone || "-"}</td>
  <td>${data.message || "-"}</td>
  <td>${data.product || "-"}</td>


  <td>
    ${
      data.createdAt
        ? new Date(data.createdAt).toLocaleString()
        : "-"
    }
  </td>

  <td>
    <button class="btn btn-sm btn-delete" data-id="${docId}">
      <i class="hgi hgi-stroke hgi-delete-01 fs-5 text-danger"></i>
    </button>
  </td>
</tr>
      `;
    });

      // Attach delete event listeners
      document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", async () => {
          const docId = btn.dataset.id;
          await deleteContact(docId);
        });
      });

  } catch (error) {
    console.error("Error loading contacts:", error);
  } // ---------------- DELETE FUNCTION ----------------
  async function deleteContact(docId) {


    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      await deleteDoc(doc(db, "ask_question", docId));

      alert("Contact deleted successfully ✅");
loadContacts();

      // Remove row from table instantly
      const row = document.getElementById(`row-${docId}`);
      if (row) row.remove();

    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact ❌");
    }
  }

}

// call function
loadContacts();
}

// ===================== PRODUCTS TABLE CODE END ======================

// ============================= view_query code end =========================













// ========================== REVIEW CODE START =============================





// ============================= view_contact code start =======================
var view_review=document.getElementById("view_review");
if(view_review){


  // ===================== PRODUCTS TABLE CODE START ======================

const productTableBody = document.getElementById("prodcut_of_home_page");


async function loadContacts() {
 productTableBody.innerHTML = ""; // clear table
  let count = 1;

  try {
    const snapshot = await getDocs(collection(db, "review"));

    if (snapshot.empty) {
     productTableBody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center text-muted">
            No review records found
          </td>
        </tr>`;
      return;
    }

    snapshot.forEach(doc => {
      document.getElementById("total_contact").innerHTML=snapshot.size;
      const data = doc.data();
console.log(data);

  const docId = doc.id;
     productTableBody.innerHTML += `
        <tr>
          <td>${count++}</td>
          <td>${data.name || "-"}</td>
          <td>${data.email || "-"}</td>

          <td>${data.review || "-"}</td>
          <td>${data.rating || "-"}</td>

         <td>
  ${data.createdAt 
    ? new Date(data.createdAt).toLocaleString()
    : "-"}
</td>
         
          <td>
          
          
            <button class="btn btn-sm ${data.approved ? 'btn-success' : 'btn-danger'} btn-approve"
    data-id="${docId}"
    data-status="${data.approved}">
    
    ${data.approved ? "Approved" : "Approve"}
  </button>
          </td>
<td>
              <button class="btn btn-sm btn-delete" data-id="${(docId)
              }">
                <i class="hgi hgi-stroke hgi-delete-01 fs-5 text-danger"></i>
              </button>
            </td>
        </tr>
      `;
    });

      // Attach delete event listeners
      document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", async () => {
          const docId = btn.dataset.id;
          await deleteContact(docId);
        });
      });
      document.querySelectorAll(".btn-approve").forEach(btn => {
  btn.addEventListener("click", async () => {

    const docId = btn.dataset.id;
    const currentStatus = btn.dataset.status === "true";

    try {
      await updateDoc(doc(db, "review", docId), {
        approved: !currentStatus
      });

      alert("Review status updated ✅");

      loadContacts(); // reload table

    } catch (error) {
      console.error(error);
      alert("Failed to update ❌");
    }

  });
});

  } catch (error) {
    console.error("Error loading contacts:", error);
  } // ---------------- DELETE FUNCTION ----------------
  async function deleteContact(docId) {


    if (!confirm("Are you sure you want to delete this contact?")) return;

    try {
      await deleteDoc(doc(db, "contact", docId));

      alert("Contact deleted successfully ✅");
loadContacts();

      // Remove row from table instantly
      const row = document.getElementById(`row-${docId}`);
      if (row) row.remove();

    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact ❌");
    }
  }

}

// call function
loadContacts();
}

// ===================== PRODUCTS TABLE CODE END ======================

// ============================= view_review code end =========================

// ========================== REVIDE CODE END= =======================================