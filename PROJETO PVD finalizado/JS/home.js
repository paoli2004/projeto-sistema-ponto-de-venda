
let inputProduct = document.getElementById("select_product");
let inputAmount = document.getElementById("amount");
let inputTax = document.getElementById("category_tax");
let inputPrice = document.getElementById("unit_price");
let inputFinalTax = document.getElementById("final_tax");
let inputFinalPrice = document.getElementById("final_total");

//data em que a compra foi feita
const todayDate = Date.now();
const formatDate = new Date(todayDate).toLocaleDateString("pt-BR");

//criação do carrinho
let cart = {
    code: 0,
    productList: [],
    totalCartPrice: 0,
    totalCartTax: 0
};

//atualização do estoque após a compra
function updateStorage() {
    let homeTable = getHome();
    let findProducts = getProduct();

    homeTable.forEach(homeProduct => {
        let confirm = searchProductStorage(findProducts, homeProduct.name);

        if (confirm >= 0) {
            if (findProducts[confirm].amount >= homeProduct.amount) {
                //subtração da quantidade do estoque com o que foi comprado
                findProducts[confirm].amount -= homeProduct.amount;
            } else {
                alert(`Estoque insuficiente para o produto: ${homeProduct.name}`);
                return false;
            }
        }
    });

    saveProduct(findProducts);
    return true;
}

function searchProductStorage(array, productName) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].name === productName) {
            return i;
        }
    }
    return -1;
}

//caso ja tenha um produto no carrinho, aumentada a quantidade, taxa total e preço total
function validStorageHome(product) {
    let homeTable = getHome();
    let confirm = searchHomeStorage(homeTable, product);
    if (confirm >= 0) {
        let newAmount = homeTable[confirm].amount + parseFloat(inputAmount.value);
        let newTax = calTax(product, newAmount);
        let newTotal = newAmount * homeTable[confirm].price + newTax;
        
        homeTable[confirm].amount = newAmount;
        homeTable[confirm].tax = newTax;
        homeTable[confirm].total = newTotal;

        alert("Produto já incluído no carrinho. Quantidade alterada");
        saveHome(homeTable);
        return false;
    }
    return true;

}

function searchHomeStorage(array, product) {
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

function saveProduct(productTable) {
    localStorage.setItem('product', JSON.stringify(productTable));
}

function getHistory() {
    let storedHistory = localStorage.getItem('history');
    return storedHistory = storedHistory ? JSON.parse(storedHistory) : [];
}

function saveHistory(historyData) {
    localStorage.setItem('history', JSON.stringify(historyData));
}

function getCategories() {
    let storedCategories = localStorage.getItem('category');
    return storedCategories ? JSON.parse(storedCategories) : []; // se nao tiver retorna uma string vazia
}

function getProduct() {
    let storedProducts = localStorage.getItem('product');
    return storedProducts ? JSON.parse(storedProducts) : [];
}

//carrega os produtos do localstorage
function loadProducts() { 
    let products = getProduct();

    inputProduct.innerHTML = '<option value="">Product</option>';
    products.forEach(product => { //criar opções dos produtos ja cadastrados
        let option = document.createElement("option");
        option.value = product.name;
        option.textContent = product.name;
        inputProduct.appendChild(option);
    });
}

function getHome() {
    let storedHome = localStorage.getItem('home');
    let parsedHome = storedHome ? JSON.parse(storedHome) : [];

    return Array.isArray(parsedHome) ? parsedHome : []; //garante que retorne uma array
}
function saveHome(products) {
    localStorage.setItem('home', JSON.stringify(products));
}

function setHome() {
    let homeTable = getHome();

    if (!Array.isArray(homeTable)) {
        homeTable = [];
    }

    let productName = inputProduct.value;

    let amount = parseFloat(inputAmount.value);
    let unit_price = parseFloat(inputPrice.value);
    let taxValue = calTax(productName, amount);
    let totalPrice = unit_price * amount;
    let totalWithTax = totalPrice + taxValue;

    //esquema de calculo para o produto
    let i = homeTable?.length ?? 0;

    if (homeTable?.length == 0) {
        i = 1;
    } else {
        i = homeTable?.at(-1).code;
        i++;
    }
    //infos de home
    const homeInfos = {
        code: i,
        name: productName,
        date: formatDate,
        price: unit_price,
        amount: amount,
        total: totalWithTax,
        tax: taxValue

    }

    //passa as informações do homeInfos para a lista de produtos do carrinho
    cart.productList.push(homeInfos);

    
    cart.totalCartPrice += homeInfos.price; //é adicionado o preço do homeInfos no preço total
    cart.totalCartTax += taxValue; //add a taxa do homeInfos na taxa total
    console.log(cart);

    if (isNaN(amount) || !productName) {
        alert("Insira valores numéricos para amount e product.");
        return;
    } else if (validStorageHome(productName)) {
        homeTable.push(homeInfos);
        saveHome(homeTable);
    }
    let products = getProduct();
        //percorre cada item na array
        for (let item of homeTable) {
            //verifica se algum produto tem o mesmo nome do no input
            let exists = products.some(product => product.name === item.name);
            if (!exists) {
                alert("Impossivel realizar a compra com um produto inexistente.");
                return;
            }
        }
    listHomeTable();
}

function listHomeTable() {
    let tbody = document.getElementById('home_tbody');
    tbody.innerHTML = '';
    let homeTable = getHome();
    console.log(homeTable);
    
    let totalTax = 0;
    let totalPrice = 0;

    homeTable.forEach(product => {
        let tr = tbody.insertRow();

        let td_name = tr.insertCell(); //insere celulas
        let td_unitPrice = tr.insertCell();
        let td_amount = tr.insertCell();
        let td_tax = tr.insertCell();
        let td_total = tr.insertCell();
        let td_delete = tr.insertCell();

        td_name.innerText = product.name; //insere o conteudo nas celulas
        td_unitPrice.innerText = product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        td_amount.innerText = product.amount;
        td_tax.innerText = product.tax.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        td_total.innerText = product.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        //adicionado a taxa e o total dos produtos no total do preço e taxa do carrinho
        totalTax += product.tax;
        totalPrice += product.total;

        let deleteProductBtn = document.createElement('button'); // processo de criação e funcionamento do botão delete
        deleteProductBtn.innerText = 'Delete';
        deleteProductBtn.classList.add('btn-home-delete-product');
        deleteProductBtn.onclick = () => deleteProduct(product.name);

        td_delete.appendChild(deleteProductBtn);
    });
    //mostrando nos inputs
    inputFinalTax.value = totalTax.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    inputFinalPrice.value = totalPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function deleteProduct(name) {
    let productTable = getHome();
    productTable = productTable.filter(product => product.name !== name);
    saveHome(productTable);
    listHomeTable();
}

function taxAndPrice() { //mostra no input restrito os calculos de cada produto
    let selectedProduct = inputProduct.value;

    let tax = getTax(selectedProduct);
    let price = getProductPrice(selectedProduct);

    inputTax.value = tax;
    inputPrice.value = price;
}

function getTax(productName) {
    let products = getProduct(); // pega os produtos
    let categories = getCategories(); // pega as categorias 

    let product = products.find(product => product.name === productName); // vasculha até achar o produto especifico
    if (!product) return 0;// se nao achar retorna 0

    let categoryProduct = categories.find(category => category.name === product.category);
    return categoryProduct ? categoryProduct.tax : 0;// se nao achar a taxa retorna 0 
}
//calculo da taxa
function calTax(productName, amount) {
    let products = getProduct();
    let product = products.find(product => product.name === productName);
    if (!product) return 0;
    
    let productTax = getTax(productName);
    return (product.unitPrice * (Number(productTax) / 100)) * amount; //garante que productTax seja um numero
}
//função que captura o preço de cada produto
function getProductPrice(productName) {
    let products = getProduct();

    let product = products.find(product => product.name === productName);
    if (!product) return 0;
    return product ? product.unitPrice : 0;
}

//botão de cancelar(limpar) o carrinho
function cancelBtn() {
    if (confirm("Deseja excluir todos os produtos do seu carrinho?")) {
        homeInfos = [];
        saveHome(homeInfos);
        listHomeTable();
        inputFinalPrice.value = ""; //zera os inputs
        inputFinalTax.value = "";
    }
}

//botão de finalizar a compra, envia para o historico
function finishBtn() {
    if (confirm("Concluir compra?")) {

        let homeTable = getHome();

        if (!inputProduct.value) {
            alert("Selecione um produto");
            return;
        }
        //atualização do historico
        let attStorage = updateStorage()
        if (!attStorage) {
            return;
        }
        
        let historyTable = getHistory();
        historyTable.push(homeTable);
        saveHistory(historyTable);
        let homeInfos = [];
        saveHome(homeInfos);
        listHomeTable();
        inputFinalPrice.value = "";
        inputFinalTax.value = "";
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadProducts();
    inputProduct.addEventListener('change', taxAndPrice);
});
listHomeTable();