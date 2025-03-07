
let inputCategory = document.getElementById("category_name");
let inputTax = document.getElementById("category_tax");

function getCategories() {
    return JSON.parse(localStorage.getItem('category')) ?? [];
}
function saveCategories(categoryTable) {
    localStorage.setItem('category', JSON.stringify(categoryTable));
}

function getProduct() {
    return JSON.parse(localStorage.getItem('product')) ?? [];
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
inputCategory.addEventListener("keypress", function (e) {
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

function validaCategoriesStorage() {
    let categoryTable = getCategories();
    console.log(inputCategory.value);
    let confirm = searchCategoryStorage(categoryTable, inputCategory.value); //procura pela categoria
    if (confirm >= 0) {
        //se tiver um confirm de 1 para acima, foi encontrado uma categoria ou mais
        alert("Categoria ja cadastrada.");
        return true;
    } else {
        alert("Categoria cadastrada com sucesso!");
        return false;
    }
}

function searchCategoryStorage(array, category) {
    //inicia com -1 por causa do confirm
    let cont = -1;
    for (let i = 0; i < array.length; i++) {
        //se achar um numero i de nomes na categoria, o cont passa ser esse i
        if (array[i].name == category) {
            cont = i;
            console.log(cont);
            return cont;
        }
    }
    return cont;
}
//coletar as informações das categorias
function setCategories() {
    let categoryTable = getCategories();

    let i = categoryTable.length;
    //esquema de codigo 
    if (categoryTable.length == 0) {
        i = 1;
    } else {
        i = categoryTable[i - 1].code;
        i++;
    }

    if (!validateString(inputCategory.value) || !validateNumber(inputTax.value)) {
        alert("Valores INVÁLIDOS.");
        inputTax.value = "";
        inputCategory.value = "";
        return;
    }
   
    if(inputTax.value > 100 || inputTax.value < 0) {
        alert("Preencha uma taxa válida.");
        return;
    }
    if (validaCategoriesStorage(inputCategory.value)) {
        return 0;
    }
    //infos da categoria 
    const categoryInfos = {
        name: inputCategory.value,
        tax: inputTax.value,
        code: i
    };
    // manda as infos do categoryInfos para o categoryTable
    categoryTable.push(categoryInfos);
    saveCategories(categoryTable);

    listCategoryTable();
    //zera os inputs
    inputTax.value = "";
    inputCategory.value = "";
}
//listar as informações coletadas de cada categoria
function listCategoryTable() {
    let tbody = document.getElementById('category_tbody');
    tbody.innerHTML = ''; // inicia o tbody em branco

    let categoryTable = getCategories();

    categoryTable.forEach(category => {
        //para cada categoria é 
        //inserido uma linha 
        let tr = tbody.insertRow();
        //inserido uma celula
        let td_code = tr.insertCell();
        let td_category = tr.insertCell();
        let td_tax = tr.insertCell();
        let td_delete = tr.insertCell();
        //inserção do conteudo de cada celula
        td_code.innerHTML = category.code;
        td_category.innerHTML = category.name;
        td_tax.innerHTML = category.tax + "%";
        
        td_code.classList.add('center');

        //botão de delete para cada linha
        let deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'Delete';
        deleteBtn.classList.add('btn-delete-button');
        deleteBtn.onclick = function () {
            deleteCategory(category.code);
        };
        //adição do botão em cada linha
        td_delete.appendChild(deleteBtn);
    });
}
function deleteCategory(code) {
    let categoryTable = getCategories();
    let productTable = getProduct();
    //vasculha a categoria pelo seu codigo
    let categoryToDelete = categoryTable.find(category => category.code === code);
    //vasculha o produto pela categoria encontrada em categoryToDelete
    let hasProducts = productTable.some(product => product.category === categoryToDelete.name);
    //se há o produto, impede a exclusão
    if (hasProducts) {
        alert("Impossível realizar a exclusão, há um produto com a categoria cadastrada.");
        return;
    }
    
    categoryTable = categoryTable.filter(category => category.code !== code);
    saveCategories(categoryTable);
    listCategoryTable();
}

function clearCategories() {
    if (confirm("Limpar todas as categorias?")) {
        localStorage.removeItem('category');
        listCategoryTable();
    }
}
//mantem as categorias listadas quando sai e entra na pagina
listCategoryTable();