$(document).ready(function(){
    cardapio.eventos.inicio();
})

var cardapio = {}

var MEU_CARRINHO = []

var CELULAR = '5562997796077';

var MEUS_ = null;

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 0;

cardapio.eventos = {
    inicio: () => {
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarDescricao();
        cardapio.metodos.carregarBotaoReserva();
        cardapio.metodos.carregarBotaoligar();
        cardapio.metodos.carregarBotaoWhatsapp();
    }
}



cardapio.metodos = {
    //obtem a lista dos itens do cardapio/catalogo/produtos
    
    obterItensCardapio: (categoria = 'equipamentos', vermais = false) =>{
            var filtro = MENU[categoria];
            console.log(filtro);

            if(!vermais){
                
                $('#itensCardapio').html('');
                $(" #btnVerMais").removeClass('hidden');
                
             }
                
              


            $.each(filtro, (i,e)=> {

                let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.nome)
                .replace(/\${dsc}/g, e.dsc)
                .replace(/\${preco}/g, e.preco.toFixed(2).replace('.',','))
                .replace(/\${id}/g, e.id)
              
                //botao ver mais foi clicado 
                if(vermais && i >= 8 && i < 12){
                    $('#itensCardapio').append(temp)
                    
                }
                    //paginação inicial
                if(!vermais && i < 8){
                    $('#itensCardapio').append(temp)
                }

             
            })

            //remove cor do botao

            $(".container-menu a").removeClass('active');

            // ativa o proximo menu

            $(" #menu-" + categoria).addClass('active');

           
    },

   
    //clique do btn de ver mais itens
    verMais: () => {
        var ativo =  $(".container-menu a.active").attr('id').split('menu-')[1];
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');
    },

 // botao de mais e menos na paginação de produtos
    diminuirQuant: (id) => {
        // converte para inteiro  e se for maior que zero subtrai 1 und
        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0){
            $("#qntd-" + id).text(qntdAtual - 1);
        }

    },

    aumentarQuant: (id) => {
          // converte para inteiro  e soma 1 und
        let qntdAtual = parseInt($("#qntd-" + id).text());

      
            $("#qntd-" + id).text(qntdAtual + 1);
        
    },

    adicionarAoCarrinho: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text());
         
        if (qntdAtual > 0){
            // obtem a categoria ativa
            var categoria =  $(".container-menu a.active").attr('id').split('menu-')[1];
            
            // obtem a lista de itens

            let filtro = MENU[categoria];

            // obter o item
            // Utiliza a função $.grep do jQuery para filtrar o array 'filtro'. 
            // A função de teste checa se o 'id' de cada elemento 'e' é igual ao 'id' especificado.
            // Retorna um novo array 'item' contendo todos os elementos que têm o mesmo 'id'.
            // Parâmetros da função de teste: e - o elemento atual sendo processado no array.  i - o índice do elemento atual.

            let item = $.grep(filtro, (e,i) => { return e.id == id})

            if (item.length > 0){

                //verificar a existencia do item no carrinho
                let existencia = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id})
                //se existir , somar as quantidades, senao add um novo
                if (existencia.length > 0){
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id))
                    MEU_CARRINHO[objIndex].qntd =  MEU_CARRINHO[objIndex].qntd + qntdAtual
                }else{
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0]);
                }
                //quero adicionar o nome do produto no alert
             
                cardapio.metodos.mensagem( qntdAtual + ' ' + item[0].nome +'(s)  Adicionado(s)  ao carrinho.', 'green');
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgeTotal();

               
            }

        }
      
  },

  atualizarBadgeTotal: () => {
    var total = 0;

   $.each(MEU_CARRINHO, (i,e) => {
    total += e.qntd;
   })

   if (total > 0) {
    $(".btn-carrinho").removeClass('hidden');
    $(".container-total-carrinho").removeClass('hidden');
   } else {
    $(".btn-carrinho").addClass('hidden');
    $(".container-total-carrinho").removeClass('hidden');
   }
   $(".badge-total-carrinho").html(total);

  },

abrirCarrinho: (abrir) =>{
    if (abrir) {
        $("#modalCarrinho").removeClass('hidden');
        cardapio.metodos.carregarCarrinho();
    } else {
        $("#modalCarrinho").addClass('hidden'); 
    }
},

//altera a etapa em que está o carrinho
carregarEtapa: (etapa) =>{
 if( etapa == 1){
     $("#lblTituloEtapa").text('Seu carrinho:');
     $("#ItensCarrinho").removeClass('hidden'); 
     $("#verificao").addClass('hidden');
     $("#resumoCarrinho").addClass('hidden'); 
     
     $(".etapa").removeClass('active');
     $(".etapa1").addClass('active');

     $("#btnEtapaPedido").removeClass('hidden') 
     $("#btnEtapaEndereco").addClass('hidden') 
     $("#btnEtapaResumo").addClass('hidden') 
     $("#btnVoltar").addClass('hidden') 
       
   }
   if( etapa == 2){
        $("#lblTituloEtapa").text('fazer login:');
        $("#ItensCarrinho").addClass('hidden'); 
        $("#verificao").removeClass('hidden');
        $("#resumoCarrinho").addClass('hidden'); 
        
        $(".etapa").removeClass('active');
        $(".etapa2").addClass('active');
        $(".etapa1").addClass('active');
   
        $("#btnEtapaPedido").addClass('hidden') 
        $("#btnEtapaEndereco").removeClass('hidden') 
        $("#btnEtapaResumo").addClass('hidden') 
        $("#btnVoltar").removeClass('hidden')  
   } 
        if( etapa == 3){
            $(".meus-pontos").removeClass('hidden');
        $("#lblTituloEtapa").text('Resumo do Pedido:');
        $("#ItensCarrinho").addClass('hidden'); 
        $("#verificao").addClass('hidden');
        $("#resumoCarrinho").removeClass('hidden'); 
        
        $(".etapa").removeClass('active');
        $(".etapa3").addClass('active');
        $(".etapa2").addClass('active');
        $(".etapa1").addClass('active');
   
        $("#btnEtapaPedido").addClass('hidden') 
        $("#btnEtapaEndereco").addClass('hidden') 
        $("#btnEtapaResumo").removeClass('hidden') 
        $("#btnVoltar").removeClass('hidden') 
       
   }
  
},
// ele volta etapas
voltarEtapa: () =>{
    let etapa = $(".etapa.active").length;

    cardapio.metodos.carregarEtapa(etapa-1)
},

//carrega as lista de itens do carrinho
carregarCarrinho: () => {

    cardapio.metodos.carregarEtapa(1);

    if (MEU_CARRINHO.length > 0) {

       $("#ItensCarrinho").html('');

       $.each(MEU_CARRINHO, (i,e) => {

        let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
        .replace(/\${nome}/g, e.nome)
        .replace(/\${preco}/g, e.preco.toFixed(2).replace('.',','))
        .replace(/\${id}/g, e.id)
        .replace(/\${qntd}/g, e.qntd)

        $("#ItensCarrinho").append(temp);

        //ultimo item carregado faça
        if((i + 1 ) == MEU_CARRINHO.length){
            cardapio.metodos.carregarValores();
        }
       })

    } else {
        $("#ItensCarrinho").html('<p class="carrinho-vazio"><i class="fas fa-shopping-bag"></i>Seu carrinho está vazio</p>');
        cardapio.metodos.carregarValores();
    }
},
// diminuir a quantidade do item no carrinho
diminuirQuantCarrinho: (id) =>{
    let qntdAtual = parseInt($("#qntd-carrinho" + id).text());

    if (qntdAtual > 1){ 
    $("#qntd-carrinho" + id).text(qntdAtual - 1);
    cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
    }else{
        cardapio.metodos.removerItemCarrinho(id);
    }
},
// aumentar a quantidade do item no carrinho
aumentarQuantCarrinho: (id) =>{
    let qntdAtual = parseInt($("#qntd-carrinho" + id).text());
    $("#qntd-carrinho" + id).text(qntdAtual + 1);

    cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);

},

removerItemCarrinho: (id) =>{
    MEU_CARRINHO = $.grep(MEU_CARRINHO, (e,i) => {
        return e.id != id
    });

    cardapio.metodos.carregarCarrinho()

    //atualiza o botao carrinho com a quantidade a atualizada 
    cardapio.metodos.atualizarBadgeTotal();
},

//atualiza o carrinho com a quantidade atual
atualizarCarrinho: (id, qntd) =>{
    let objIndex =MEU_CARRINHO.findIndex((obj => obj.id == id));
    MEU_CARRINHO[objIndex].qntd = qntd;
    //atualiza o botao carrinho com a quantidade a atualizada 
    cardapio.metodos.atualizarBadgeTotal();
    //Atualiza os valores totais do carrinho
    cardapio.metodos.carregarValores();
},

//carrega os valores de subtotal,Entrega e total
carregarValores: ()=>{
    VALOR_CARRINHO = 0;

    $("#lblSubTotal").text(' 0,00');
    $("#lblValorEntregra").text('+  0,00');
    $("#lblValorTotal").text(' 0,00');

    $.each( MEU_CARRINHO, (i,e) => {
        VALOR_CARRINHO += parseFloat(e.preco * e.qntd);

        if((i + 1 == MEU_CARRINHO.length)){
            $("#lblSubTotal").text(` ${VALOR_CARRINHO.toFixed(2).replace('.',',')}`);
            $("#lblValorEntregra").text(` ${VALOR_ENTREGA.toFixed(2).replace('.',',')}`);
            $("#lblValorTotal").text(` ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace('.',',')}`);

        }
    })

},

// carregar a etapa endereco
 carregarEndereco: ()=>{
    if(MEU_CARRINHO.length <=0){
        cardapio.metodos.mensagem('Seu carrinho está vazio.');
        return;
    }

    cardapio.metodos.carregarEtapa(2);
 },

 //API DE CEP
 buscarCep: ()=>{
    
    const cep = $("#txtCEP").val().trim().replace(/\D/g, '');
    const senha = $("#txtSenha").val().trim().replace(/\D/g, '');
  
//equanto a senha e o cep nao forem corretas nao passa pra proxima pagina
    if (cep !== "" || senha != "") {
        const validacep = 12345678910
        const validasenha = 123
        if (validacep == cep && validasenha == senha) {
            resumoPedido();
        } else {
            cardapio.metodos.mensagem("CEP ou senha  inválido.");
            $("#txtCEP").focus();
            $("#txtSenha").focus();
        }
    } else {
        cardapio.metodos.mensagem("Informe os dados, por favor.");
        $("#txtCEP").focus();
        $("#txtsenha").focus();
    }

 },
//validação antes de ir pra proxima etapa
 resumoPedido: () =>{
    let nome =  $("#txtNome").val().trim();
    let cep =  $("#txtCEP").val().trim();
    let senha =  $("#txtSenha").val().trim();
    if(cep.length <= 0){
        cardapio.metodos.mensagem("informe o CEP, por favor.");
        $("#txtCEP").focus();
      return;
    }

    if(nome.length <= 0){
        cardapio.metodos.mensagem("informe seu nome, por favor.");
        $("#txtNome").focus();
      return;
    }

    if(senha.length <= 0){
        cardapio.metodos.mensagem("informe a senha , por favor.");
        $("#txtSenha").focus();
      return;
    }

    MEUS_ = {
        cep: cep,
        nome: nome,
    }

    cardapio.metodos.carregarEtapa(3);
    cardapio.metodos.carregarResumo();

 },

 //carrega todos os itens preenchidos na ultima pagina
 carregarResumo: () =>{
    
    $("#listaItensResumo").html('');

    $.each(MEU_CARRINHO, (i,e) => {

        let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
        .replace(/\${nome}/g, e.nome)
        .replace(/\${preco}/g, e.preco.toFixed(2).replace('.',','))
        .replace(/\${qntd}/g, e.qntd)

        $("#listaItensResumo").append(temp);

        
       });

       $("#resumoEndereco").html(`${MEUS_.nome}, cpf: ${MEUS_.cep}`);
      

       cardapio.metodos.finalizarPedido();
      
 },


 finalizarPedido: () =>{
    if (MEU_CARRINHO.length > 0 && MEUS_ != null) {
        var itens = '';

        // Construir a string de itens
        $.each(MEU_CARRINHO, function(index, e) {
            itens += `*${e.qntd}x* ${e.nome} .......  ${e.preco.toFixed(2).replace('.', ',')}\n`;
        });

      // Após construir os itens, construir o texto do pedido
    var texto = `Olá,sou de ${MEUS_.nome} gostaria de solicitar o resgate dos  seguintes cupons:`;
    texto += `\n\n\n${itens}`;
    texto += '\n\n Meu cpf é:';
    texto += `${MEUS_.cep}`;
   

        // Converter a URL
        let encodedText = encodeURI(texto);
        let url = `https://wa.me/${CELULAR}?text=${encodedText}`;

        // Definir o href para o botão usando jQuery
        $("#btnEtapaResumo").attr('href', url);
    } else {
        console.log('Seu carrinho está vazio ou os dados não está definido.');
    }
 },

 carregarBotaoReserva: () =>{
    var texto = 'Olá gostaria de saber mais sobre vocês.';

    let encodedText = encodeURI(texto);
    let url = `https://wa.me/${CELULAR}?text=${encodedText}`;


    $("#btnReserva").attr('href', url);
 },

 carregarBotaoligar: () => {
    $("#btnLigar").attr('href', `tel:${CELULAR}`);
 },

 carregarBotaoWhatsapp: () => {
    var texto2 = 'Olá vim pelo *site*.';
    
    let encodedText = encodeURI(texto2);
    let url = `https://wa.me/${CELULAR}?text=${encodedText}`;

    $(".btnWhatsapp").attr('href', url);
 },

 abrirDepoimento: (depoimento) =>{

    $("#depoimento-1").addClass('hidden');
    $("#depoimento-2").addClass('hidden');
    $("#depoimento-3").addClass('hidden');

    $("#btnDepoimento-1").removeClass('active');
    $("#btnDepoimento-2").removeClass('active');
    $("#btnDepoimento-3").removeClass('active');

    $("#depoimento-" + depoimento).removeClass('hidden');
    $("#btnDepoimento-" + depoimento).addClass('active');

 },




  //efeito de aparecer e sumir mensagem 
  mensagem: (texto, cor = 'red',tempo = 3500 ) => {
   
    let id = Math.floor(Date.now() * Math.random()).toString();
 
    let msg = `<div id="${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;
    $("#container-mensagens").append(msg);
    
    setTimeout(()=>{
        $('#'+ id).removeClass('fadeInDown');
        $('#'+ id).addClass('fadeOutUp'); 
        setTimeout(()=>{
            $('#'+ id).remove();
        }, 1000)
       
    }, tempo)
  }

    
}



cardapio.templates = {

     item:  `
     <div class="col-12 col-lg-3  col-md-3 col-sm-6 mb-5" id="\${id}">
         <div class="card card-item ">
             <div class="img-produto">
                 <img src="\${img}" alt="">
             </div>
            
               <p class="desc text-center ">
                <b>
                  \${preco} pontos
                </b>
                </p>
             <p class="title-produto text-center mt-4 "><b>\${nome}</b></p>
             
             <div class="add-car">
                 <span class="btn-menos"><i class="fas fa-minus" onclick="cardapio.metodos.diminuirQuant('\${id}')"></i></span>
                 <span class="add-num-itens" id="qntd-\${id}">0</span>
                 <span class="btn-mais"><i class="fas fa-plus"  onclick="cardapio.metodos.aumentarQuant('\${id}')"></i></span>
                 <span class="btn btn-add"  onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')" ><i class="fas fa-shopping-bag"></i></span>

             </div>
         </div>
     </div>
     `,

     itemCarrinho: ` 
      <div class="col-12 item-carrinho">
     <div class="img-produto">
         <img src="\${img}">
     </div>
     <div class="dados-produto">
         <p class="title-produto"><b>\${nome}</b></p>
        
     </div>
     <div class="add-car">
     <span class="btn-menos"><i class="fas fa-minus" onclick="cardapio.metodos.diminuirQuantCarrinho('\${id}')"></i></span>
     <span class="add-num-itens" id="qntd-carrinho\${id}">\${qntd}</span>
        <span class="btn-mais"><i class="fas fa-plus"  onclick="cardapio.metodos.aumentarQuantCarrinho('\${id}')"></i></span>
         <span class="btn btn-remove"  onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fas fa-times"></i></span>

     </div>
 </div>`,

 itemResumo: `<div class="col-12 item-carrinho resumo">
 <div class="img-produto-resumo">
 <img src="\${img}">
 </div>

 <div class="dados-produto">
  <p class="title-produto-resumo">
  <b>\${nome}</b>
  </p>
  <p class="preco-produto-resumo">
 
  </p>
 </div>

 <p class="quantidade-produto-resumo">
   <b>X \${qntd}</b>
 </p>
</div>`,

itemDesc: `
<div class="col-12">
    <div class="">
        <p><b>\${nome}</b></p>
        <p class="text">\${dsc}</p>
    </div>
</div>
<div class="img-desc col-6">
    <div class="d-flex img-banner wow fadeIn delay-07s">
        <img class="wow fadeIn delay-07s" src="\${img}" alt="">
    </div>
</div>
`



}
