function eventload(id,nome,data){
	 
		localStorage.setItem('event',id);
		localStorage.setItem('event_name',nome);
		localStorage.setItem('event_date',data);

	console.log('event registered: ' + localStorage.getItem('event_name'));
	$.mobile.changePage('#confirmar');
}

$('#home').live('pagebeforeshow', function() {
 	var evento = localStorage.getItem('event_name');
	console.log(evento);
	$('#nome_evento','#home').html(evento);
});


$('#evento').live('pageinit', 'pageshow', function() {

 
 //carregar todos os eventos 
 	  var url = $.apiurl+'/loadProxEventos';
 var $ul = $( '#eventos' );
$.mobile.showPageLoadingMsg();
var html = ' <li data-role="list-divider" role="heading">Selecione seu Evento - ';
 $.ajax({
                url: url, 
                dataType: "jsonp",
                crossDomain: true, 
            })
            .then( function ( response ) {
				html += response.month + '/'+ response.ano + ' </li>';
                $.each( response.events, function ( i, val ) {
                    html += "<li data-theme=\"a\"><a href=\"javascript:eventload('"+val.id+"','"+val.name+"','"+ val.day+"/"+response.month_def+"/"+response.ano+"')\" data-transition=\"slide\">" + val.name + "</a></li>";
                });
                $ul.html( html );
                $ul.listview( "refresh" );
                $ul.trigger( "updatelayout");
$.mobile.hidePageLoadingMsg();
            });
 });


$('#cadastrar').live('pagebeforeshow', function() {
	//carregar Cargos
 	  var url = $.apiurl+'/listacargos';

	var cargoselect = $('#cargo'),
	html = "";

	$.ajax({
                url: url, 
                dataType: "jsonp",
                crossDomain: true, 
				async: false,
            })
            .then( function ( response ) {
                 $.each( response.cargos, function ( i, val ) {
                    html += "<option value ='"+val.id+"'>"+  val.name + "</option>";
                });
				cargoselect.html(html);
				cargoselect.selectmenu('refresh');
				cargoselect.trigger( "updatelayout");
            });

	url = $.apiurl+'/listasegmentos';
	 var segmentoSelect = $('#segmento');
	html2 = "";

	$.ajax({
                url: url, 
                dataType: "jsonp",
                crossDomain: true, 
	async:false,
            })
            .then( function ( response ) {
                 $.each( response.segmentos, function ( i, val ) {
                    html2 += "<option value ='"+val.id+"'>"+  val.name + "</option>";
                });
				segmentoSelect.html(html2);
				segmentoSelect.selectmenu('refresh');
				segmentoSelect.trigger( "updatelayout");
            });

	 


});	

function cadastrar() {
	console.log('cadastrar');

	var evento = localStorage.getItem('event');
	//dados da Empresa
	var empresa = $('#empresa','#cadastrar').val(),
	website =  $('#website','#cadastrar').val(),
	telefones_empresa = $('#telefones','#cadastrar').val(),
	email_empresa = $('#email_empresa','#cadastrar').val(),
	endereco = $('#endereco','#cadastrar').val(),
	segmento = $('#segmento','#cadastrar').val(),
	cep = $('#cep','#cadastrar').val();

	//campo obrigatório
	if((empresa == '')) {
		$('#erroCadastro').popup('open');
		return false;
 	}
	//dados da pessoa
	var name = $('#name','#cadastrar').val(),
	cargo  = $('#cargo','#cadastrar').val(),
	email_pessoa = $('#email_pessoa','#cadastrar').val(),
	telefones_pessoa = $('#telefones_pessoa','#cadastrar').val(),
	aniversario = $('#aniversario','#cadastrar').val(),
	obs = $('#observacoes','#cadastrar').val();
	if((name == '')) {
		$('#erroCadastro').popup('open');
 		return false;
 	}
 	$.mobile.showPageLoadingMsg();
	var url = $.apiurl+'/cadastrar';
		$.ajax({
                url: url, 
                dataType: "jsonp",
                crossDomain: true,
                data: {
                    empresa: empresa,
					telefones_empresa:telefones_empresa,
					email_empresa:email_empresa,
					website: website,
					segmento: segmento, 
					endereco: endereco,
					cep: cep,
					name: name,
					cargo: cargo,
					email_pessoa: email_pessoa,
					telefones_pessoa: telefones_pessoa,
					aniversario: aniversario,
					obs: obs,
					evento: evento
                }
            })
            .then( function ( response ) {
				//popoup de sucesso
				$.mobile.hidePageLoadingMsg();
				$('#sucessoCadastro').popup('open');
				$('input').val('');

				//reset all campos 
            });
}

function confirmar(id,nome,empresa){
	var evento = localStorage.getItem('event');
	var nome_evento = localStorage.getItem('event_name');
 $.mobile.showPageLoadingMsg();
var url = $.apiurl+'/confirmar';
		$.ajax({
                url: url, 
                dataType: "jsonp",
                crossDomain: true,
                data: {
					empresa: empresa,
                    evento: evento,
					id:id
                }
            })
            .then( function ( response ) {
				//popoup de sucesso
 				//reset all campos    
 			if(response.status == 'ok') {      
				$('#user'+id).remove();

				$('#nomeusuario').html(nome);	
				$('#event_name').html(nome_evento);
				$.mobile.hidePageLoadingMsg();
				$('#confirmado').popup('open');
				$ul = $('#autocomplete'); 
				$ul.listview( "refresh" );
				$ul.trigger( "updatelayout");

			}else {

			}
	    });
}
$('#login').live('pagebeforeshow', function() {
	$('#loginform').hide();
	 $("#loginlogo").delay(800).animate({
            width: "50%",
            marginBottom: "20px",
            marginTop: "0px",
        },
        "fast",
        function() {
            $("#loginform").fadeIn("slow")
        })

    $('#loginBtn').click(function(e){
     var url = $.userurl + '/login'
 
  		var j = $("#username,", "#login").val();
        var c = $("#password,", "#login").val();
        $.mobile.showPageLoadingMsg();
          $.ajax({
            type: "GET",
            url: url,
            dataType: "jsonp",
            success: function(e) {
            	if(e.status == 'ok') { 
            		$.mobile.hidePageLoadingMsg();
               		 $.mobile.changePage('#evento');
               		 $.loggedin = true;
                }
                else  {
                $.loggedin = false;
                	$('#erroLogin').popup('open');
                }
            },
            error:function(e){
            	console.log(e);
            	$('#erroLogin').popup('open');
            },
            data: {
                u: j,
                p: c
            },
            async: false
        })
    });

});


function loadPresentes(filtro,tipo) {
	  var url = $.apiurl+'/listapresentes';
	  var evento = localStorage.getItem('event');
	  var nome_evento = localStorage.getItem('event_name');
 var $ul = $( '#presenteslist' );
$.mobile.showPageLoadingMsg();
$ul.fadeOut();
 var html = ' <li data-role="list-divider" role="heading" data-theme=\"a\">Lista de Presença - ';
 $.ajax({
                url: url, 
                dataType: "jsonp",
                crossDomain: true,
				data: {
					filtro: filtro,
					tipo: tipo,
					evento : evento
				} 
            })
            .then( function ( response ) {
				html += nome_evento + ' </li>';
                $.each( response.presentes, function ( i, val ) {
                  //  html += "<li data-theme=\"a\">"+ val.name + "</li>";
	                if(filtro != 1 ) {
						html += "<li><h2>" + val.name + " </h2><br/> <p class=\"ui-li-desc\"> Empresa: "+val.empresa+" <strong>(";
				        html+= ""+val.tipo.tipo+")</strong></p>";    
				   }else {
				   	//apenas empresas
				   		html += "<li><h2>" + val.empresa + " </h2><br/> <p class=\"ui-li-desc\"> Membros: "+val.membros+"</p>";
				    
				   }
				});
                $ul.html( html );
                $ul.listview( "refresh" );
                $ul.trigger( "updatelayout");
				$.mobile.hidePageLoadingMsg();
				$ul.fadeIn();
            });
}
$('#presentes').live('pagebeforeshow', function() {
	console.log('presentes');
	$('#tipo_empresas').hide();
	$('input:radio[name="tipoLista"]', '#presentes').change(function(e) {
        var destino = $('input:radio[name="tipoLista"]:checked', '#presentes').val();
        if(destino == 1){
      		$('#tipo_empresas').fadeIn();
	        var tipo  = $('input:radio[name="tipoEmpresa"]:checked', '#presentes').val();
	        loadPresentes(destino,tipo);
	       }else if(destino == 3){
	       	loadPresentes(destino,67); // 67 = visitantes
	       	$('#tipo_empresas').fadeOut();
	       }else {
	       	loadPresentes(destino,0);
	       	$('#tipo_empresas').fadeOut();
	       }
         
    });

    	$('input:radio[name="tipoEmpresa"]', '#presentes').change(function(e) {
		var destino = $('input:radio[name="tipoLista"]:checked', '#presentes').val();
        var tipo  = $('input:radio[name="tipoEmpresa"]:checked', '#presentes').val();
        loadPresentes(destino,tipo);
		}); 

	loadPresentes(2); // pessoas carrega primeiro

}); 
$('#confirmar').live('pagebeforeshow', function() {
		 
		 //carregar todos os eventos 
	  var url = $.apiurl+'/listamembros';
	 $( "#autocomplete" ).on( "listviewbeforefilter", function ( e, data ) {
        var $ul = $( this ),
            $input = $( data.input ),
            value = $input.val(),
            html = "";
        $ul.html( "" );
$.mobile.showPageLoadingMsg();
        if ( value && value.length > 2 ) {
            $ul.html( "<li><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
            $ul.listview( "refresh" );
            $.ajax({
                url: url, 
                dataType: "jsonp",
                crossDomain: true,
                data: {
                    q: $input.val(),
					evento: localStorage.getItem('event')
                }
            })
            .then( function ( response ) {
                $.each( response.membros, function ( i, val ) {
                    html += "<li id=\"user"+val.id+"\"><a href=\"#\"><h2 class=\"ui-li-heading\">" + val.name + " </h2><br/> <p class=\"ui-li-desc\"> Empresa: "+val.empresa+" <strong>(";
					html+= ""+val.empresa_tipo.tipo+")</strong></p></a><a href=\"javascript:confirmar('"+val.id+"','"+val.name+"','"+val.empresa_id+"')\">Confirmar</a></li>";
                });
                $ul.html( html );
                $ul.listview( "refresh" );
                $ul.trigger( "updatelayout");
$.mobile.hidePageLoadingMsg();
            });
        }
    });
 });

