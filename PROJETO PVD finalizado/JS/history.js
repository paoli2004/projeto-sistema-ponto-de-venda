let inputProduct = document.getElementById("select_product");
let inputAmount = document.getElementById("amount");
let inputTax = document.getElementById("category_tax");
let inputPrice = document.getElementById("unit_price");
let inputCategory = document.getElementById("category");


function getHistory() {
    let storedHistory = localStorage.getItem('history');
    return storedHistory = storedHistory ? JSON.parse(storedHistory) : [];
}

function saveHistory(historyData) {
    localStorage.setItem('history', JSON.stringify(historyData));
}

function listHistoryTable() {
    let tbody = document.getElementById('tbody_history');
    tbody.innerHTML = '';

    let historyTable = getHistory();
    //para cada compra, com seu codigo 
    historyTable.forEach((purchase, index) => {
        console.log(purchase);
        
        let tr = tbody.insertRow();
        
        //celula para o codigo da compra
        let td_index = tr.insertCell();
        td_index.innerText = `Compra ${index + 1}`;
        
        //quantos produtos comprados
        let td_productCount = tr.insertCell();
        td_productCount.innerText = purchase.length;

        let totalPurchase = 0;
        //para cada produto
        purchase.forEach(product => {
            //calculo do total de cada produto comprado
            let totalProduct = product.price * product.amount;
            //adicionado ao total do carrinho
            totalPurchase += totalProduct;
        });

        let td_total = tr.insertCell();
        td_total.innerText = totalPurchase.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        //calculo da taxa
        let totalWithTax = purchase.reduce((sum, product) => sum + product.total, 0);
        let td_tax = tr.insertCell();
        td_tax.innerText = (totalWithTax - totalPurchase).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        
        let td_totalWTax = tr.insertCell();
        td_totalWTax.innerText = totalWithTax.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        //data da compra
        let td_date = tr.insertCell();
        //garante que todos os produtos comprados de uma vez so tenham a mesma data
        td_date.innerText = purchase[0].date;

        //botão de visualização para o modal
        let td_view = tr.insertCell();
        let viewRowBtn = document.createElement('button');
        viewRowBtn.innerText = 'View';
        viewRowBtn.classList.add('btn-home-view-row');
        viewRowBtn.onclick = () => openModal(purchase);
        
        //adicionado a cada linha
        td_view.appendChild(viewRowBtn);
        
        //delete
        let td_delete = tr.insertCell();
        let deleteRowBtn = document.createElement('button');
        deleteRowBtn.innerText = 'Delete';
        deleteRowBtn.classList.add('btn-history-delete-product');
        deleteRowBtn.onclick = () => deleteHistory(index);

        //adicionado em cada linha
        td_delete.appendChild(deleteRowBtn);

    });
}
//função modal
function openModal(purchase) {
    let modal = document.getElementById('janela_modal'); 
    let modalContent = document.querySelector('.modal_content');


    console.log(purchase);
    //se não for uma array retorna um erro
    if (!purchase || !Array.isArray(purchase)) {
        console.error("Purchase não é um valor válido.");
        alert("Erro. Não foi possível carregar os dados da compra");;
        return;
    }
    //formação do cabeçalho da tabela
    let tableHtml = `<table border='1' id="modal_table">
                        <tr>
                            <th>Product</th>
                            <th>Amount</th>
                            <th>Unit Price</th>
                            <th>Tax</th>
                            <th>Total</th>
                        </tr>`
    //para cada produto 
    purchase.forEach(product => {
        //cria uma linha com cada info específicada em cada celula
        tableHtml += `<tr>
            <td>${product.name}</td>
            <td>${product.amount}</td>
            <td>${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
            <td>R$${product.tax.toFixed(2)}</td>
            <td>${product.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
        </tr>`
    });
    //somado ao cabeçalho
    tableHtml += `</table>`;

    //criação do botão para fechar o modal
    modalContent.innerHTML = `<button id="close">X</button><h1>Detalhe da compra</h1>` + tableHtml;
    modal.style.display = 'block'; //aparecendo

    //ao clicar
    document.getElementById('close').onclick = () => {
        modal.style.display = 'none'; //modal desaparece
    }
    
    //clicar fora da tabela, mesmo do close
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none'; 
        }
    }

}

//deletar de acordo com o codigo(endereço)
function deleteHistory(index) {
    let historyTable = getHistory();
    historyTable.splice(index, 1);
    saveHistory(historyTable);
    listHistoryTable();
}

function clearHistory () {
    if(confirm("Limpar histórico?")){
        localStorage.removeItem('history');
        listHistoryTable();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    listHistoryTable();
});

