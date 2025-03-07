
let inputProduct = document.getElementById("select_product");
let inputAmount = document.getElementById("amount");
let inputPrice = document.getElementById("unit_price");
let inputCategory = document.getElementById("category");

function getHome() {
    let storedHome = localStorage.getItem('home');
    let parsedHome = storedHome ? JSON.parse(storedHome) : [];

    return Array.isArray(parsedHome) ? parsedHome : []; //garante que retorne uma array
}

function getProduct() {
    return JSON.parse(localStorage.getItem('product')) ?? [];
}
function saveProduct(productTable) {
    localStorage.setItem('product', JSON.stringify(productTable));
}

function getCategories() {
    let storedCategories = localStorage.getItem('category');
    return storedCategories ? JSON.parse(storedCategories) : [];
}
function loadCategories() {
    let categories = getCategories();
    inputCategory.innerHTML = '<option value="">Category</option>';

    categories.forEach(category => {
        let option = document.createElement("option");
        option.value = category.name;
        option.textContent = category.name;
        inputCategory.appendChild(option);
    });
}

function validProductsStorage() {
    let productTable = getProduct();
    console.log(inputProduct.value);
    let confirm = searchProductStorage(productTable, inputProduct.value);
    if (confirm >= 0) {
        productTable[confirm].amount = parseFloat(productTable[confirm].amount) + parseFloat(inputAmount.value);
        alert("Esse produto já se encontra cadastrado. Quantidade disponível aumentada!");
        localStorage.setItem('product', JSON.stringify(productTable));
        return 0;
    } else {
        alert("Produto cadastrado com sucesso!");
        return 1;
    }
}

function searchProductStorage(array, product) {
    let cont = -1;
    for (let i = 0; i < array.length; i++) {
        if (array[i].name == product) {
            cont = i;
            console.log(cont);
            return cont;
        }
    }
    return cont;
}

function validateString(string) {
    let limit = 30;

    if (string == "") {
        return 0;
    } else if (string.length > limit) {
        return 0;
    } else if (!isNaN(string)) {
        return 0;
    }
    return 1;
}

function validateNumber(number) {
    if (isNaN(number) || number.length > 9) {
        return 0;
    } else if (number == "" || number < 0) {
        return 0;
    }
    return 1;
}

inputProduct.addEventListener("keypress", function (e) {
    if (!checkChar(e)) {
        e.preventDefault();
    }
});

function checkChar(e) {
    const char = String.fromCharCode(e.keyCode);
    const pattern = '^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$';

    if (char.match(pattern)) {
        return true;
    }
}

function setProduct() {
    let productTable = getProduct();
    let categorySelected = inputCategory.value;

    let amount = parseFloat(inputAmount.value);
    let unitPrice = parseFloat(inputPrice.value);

    let i = productTable?.length ?? 0;

    if (productTable?.length == 0) {
        i = 1;
    } else {
        i = productTable?.at(-1).code;
        i++;
    }

    if (!validateString(inputProduct.value) || !validateNumber(inputAmount.value) || !validateNumber(inputPrice.value) || !inputCategory.value) {
        alert("Valores INVÁLIDOS");
        inputProduct.value = "";
        inputAmount.value = "";
        inputPrice.value = "";
        inputCategory = "";
        return;
    }

    const productInfo = {
        code: i,
        name: inputProduct.value,
        category: categorySelected,
        amount: amount,
        unitPrice: unitPrice,
        total: amount * unitPrice
    }

    if (validProductsStorage()) {
        productTable.push(productInfo);
        saveProduct(productTable);
    }

    listProductTable();
    inputProduct.value = "";
    inputAmount.value = "";
    inputPrice.value = "";
    inputCategory.value = "";
}

function listProductTable() {
    let tbody = document.getElementById('product_tbody');
    tbody.innerHTML = '';

    let productTable = getProduct();

    productTable.forEach(product => {
        let tr = tbody.insertRow();

        let td_code = tr.insertCell();
        let td_name = tr.insertCell();
        let td_unitPrice = tr.insertCell()
        let td_amount = tr.insertCell();
        let td_category = tr.insertCell();
        let td_total = tr.insertCell();
        let td_delete = tr.insertCell();

        td_code.innerText = product.code;
        td_name.innerText = product.name;
        td_unitPrice.innerText = product.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        td_amount.innerText = product.amount;
        td_category.innerText = product.category;
        td_total.innerText = parseFloat(product.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        td_code.classList.add('center');

        let deleteProductBtn = document.createElement('button');
        deleteProductBtn.innerText = 'Delete';
        deleteProductBtn.classList.add('btn-product-delete-button');
        deleteProductBtn.onclick = () => deleteProduct(product.code)

        td_delete.appendChild(deleteProductBtn);
    });
}

function deleteProduct(code) {
    let productTable = getProduct();
    let homeTable = getHome();

    let productToDelete = productTable.find(product => product.code === code);
    let hasHome = homeTable.some(product => product.name === productToDelete.name);
    console.log(hasHome);
    if (hasHome) {
        alert("Impossivel realizar a exclusão, este produto se encontra no carrinho");
        return;
    }
    productTable = productTable.filter(product => product.code !== code);
    saveProduct(productTable);
    listProductTable();
}

function cleanProducts() {
    if (confirm("Limpar todos os produtos?")) {
        localStorage.removeItem('product');
        listProductTable();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadCategories();
    listProductTable();
});
