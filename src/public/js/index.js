const socket = io();

const form = document.getElementById("productForm");
const inputTitle = document.getElementById("title");
const inputDescription = document.getElementById("description");
const inputCode = document.getElementById("code");
const inputPrice = document.getElementById("price");
const inputStock = document.getElementById("stock");
const inputCategory = document.getElementById("category");
const inputThumbnails = document.getElementById("thumbnails");
const inputStatus = document.getElementById("status");
const messages = document.getElementById("messages");
const productsList = document.getElementById("products");
const deleteProductForm = document.getElementById("deleteProductForm");
const deleteProductById = document.getElementById("deleteProductById");

form.onsubmit = (e) => {
  e.preventDefault();

  const product = {
    title: inputTitle.value,
    description: inputDescription.value,
    code: inputCode.value,
    price: parseFloat(inputPrice.value),
    stock: parseInt(inputStock.value),
    category: inputCategory.value,
    thumbnails: inputThumbnails.value ? inputThumbnails.value.split(',') : [],
    status: inputStatus.checked,
  };

  socket.emit('createProduct', product);

  form.reset();
};

deleteProductForm.onsubmit = (e) => {
  e.preventDefault();

  const productId = deleteProductById.value;

  socket.emit('deleteProduct', productId);

  deleteProductForm.reset();
};

socket.on("productCreated", (product) => {
  messages.innerHTML = `Product created: ${product.title}`;
});

socket.on("error", (errorMessage) => {
  messages.innerHTML = `Error: ${errorMessage}`;
});

socket.on("arrayProducts", (array) => {
  let infoProducts = "";
  array.forEach((p) => {
    infoProducts += `
      <div>
          <strong>ID:</strong> ${p.id} <br>
          <strong>Title:</strong> ${p.title} <br>
          <strong>Code:</strong> ${p.code} <br>
          <strong>Description:</strong> ${p.description} <br>
          <strong>Price:</strong> $${p.price} <br>
          <strong>Stock:</strong> ${p.stock} <br>
          <strong>Category:</strong> ${p.category} <br>
          <strong>Status:</strong> ${p.status} <br>
          <strong>Thumbnails:</strong> ${p.thumbnails} <br>
          <hr>
      </div>
    `;
  });
  productsList.innerHTML = infoProducts;
});