var MANAGER = {};
	MANAGER.quantity = 1;
	MANAGER.itemsHtml = "";
	MANAGER.initialPricesHtml = "";
	MANAGER.initialProductionHtml = "";
	MANAGER.itemUpgradeValue = 1;
	
	//"{"Casa":{"name":"Casa","price":{"money":{"quantity":47069231989101}},"increment":"1.1","resource":[{"resource":"money","quantity":"100000000000"}],"quantity":282}}"
	var items = {};
	
	//"{"money":24798707680109930}"
	var resources = {};
	
	/*
	upgrade[nombre][item/"AllThePossibleItems"] = {};
	.type(sum, percentage, production, achievments, cost reduction, interest, cost deletion, addproduction);
	.item;
	.productresource
	.costresource
	.quantity(or interest)
	.resource
	.ticks
	.buyingCost
	*/

	//multi select
	/*
		$("#lstSelect").change(function(){
	  	var selectedValues = [];    
	    $("#lstSelect :selected").each(function(){
	        selectedValues.push($(this).val()); 
	    });
	    alert(selectedValues);
	    return false;
		});
	*/

	var upgrades = {};
	
	//first function called.
	function init(){

		MANAGER.initialPricesHtml = $("#initialPrices").html();
		MANAGER.initialProductionHtml = $("#productions").html();
	
		keyDownEventsInit();
		

		itemName = $("");
		//Submit the item construction TODO refresh inputs not refreshed
		$("#submitItem").click(function(){
			itemName = $("#inputItemName").val();

			itemPrice = {};
			$(".initialPriceResource").each(function(){
				itemPrice[$(this).val()] = {};
				itemPrice[$(this).val()].quantity = $(this).siblings().val();
				if(resources[$(this).val()] == null || resources[$(this).val()]<0){
					resources[$(this).val()] = 0;
					var resourcesDiv = $("#resources");
					resourcesDiv.html(resourcesDiv.html()+"  -  "+$(this).val()+": <label id='cantidad"+ $(this).val() +"'>"+0+"</label>");
				}
			});

			itemIncrement = $("#inputItemIcrement").val();

			itemProduction = [];
			$(".itemProduction").each(function(){
				itemProduction.push({resource:$(this).val(),quantity:$(this).siblings().val()});
			});

			items[itemName] = {
				name: itemName,
				price: itemPrice,
				increment: itemIncrement,
				resource: itemProduction,
				quantity: 0,
				updateHtml : function(){
					$("#"+ this.name.replace(/ /g,"_") +"").text(this.name+": "+this.quantity);
					$("#"+ this.name.replace(/ /g,"_") +"Price").text(priceToString(this.price,MANAGER.quantity,this.increment));   //check viability
				}
			}
			MANAGER.itemsHtml+="<div class='butt' onclick='buyItem(\"" + itemName +"\", "+ MANAGER.quantity +")'><label class='itemDescriptionLabel' id=" + itemName.replace(/ /g,"_") + ">"+ itemName +"</label><label class='itemDescriptionLabel' id='" + itemName.replace(/ /g,"_") + "Price'>"+ priceToString(itemPrice,1,1) +"</label><label class='itemDescriptionLabel' >"+ productionToString(itemProduction) +"</label></div>";
		

			$("#items").html(MANAGER.itemsHtml);
			for(var propertyName in items) {
				items[propertyName].updateHtml();
			}
			$("#initialPrices").html(MANAGER.initialPricesHtml);
			$("#productions").html(MANAGER.initialProductionHtml);
			
			updateResourcesAddForm();
			//agrega el item recien creado a el combo de items para los upgrades
			$("#upgradeItemSelector").append("<option value="+ itemName +">"+ itemName +"</option>");
			MANAGER.itemUpgradeValue++;
		});
		
		//$("#submitItem").click(function(){});

		//add cost item with an append
		$("#addInitialPrice").click(function(){
			stringPrice = 	'<div class="control-group">'+
		                      '<label class="control-label"></label>'+
		                      '<div class="controls">'+
		                        '<input type="text" placeholder="Tipo de recurso" class="input-xlarge initialPriceResource"> '+
		                        '<input type="text" placeholder="Cantidad" class="input-xlarge">'+
		                      '</div>'+
		                    '</div>';
			$("#initialPrices").append(stringPrice);
		});

		//add production item with an append
		$("#addProduction").click(function(){
			stringProdution ='	<div class="control-group">'+
	                              '<label class="control-label" ></label>'+
	                              '<div class="controls">'+
	                                '<input type="text" placeholder="Tipo de recurso o item" class="input-xlarge itemProduction"> '+
	                                '<input type="text" placeholder="Cantidad" class="input-xlarge">'+
	                              '</div>'+
	                            '</div>';
			$("#productions").append(stringProdution)
		});
		
		//start the timer of the game.
		var cualc = setInterval(function(){ runFunctions()}, 1000);
	
	}

	function createUpgrades(){
		$('#upgradeItemSelector').on('change', function() {
		  alert($(this).val()); // or $(this).val()
		});
	};
	
	

	var runFunctions = function(){
	
		produceResources();
		updateItems();
		
	}
	
	function updateItems(){
		for(var propertyName in items) {
			items[propertyName].updateHtml();
		}
	}
	
	function updateResourcesAddForm(){
		htmlResourcesAddForm = "";
		for(var propertyName in resources) {
			htmlResourcesAddForm+= "<label>Agregar " + propertyName + "</label><input id='add" + propertyName + "' /><input type='button' onclick='addResource(\"" + propertyName + "\")' value='aceptar' />";
		}
		$("#formAddResources").html(htmlResourcesAddForm);
	}
	
	function addResource(resource){
		resources[resource] += parseInt($("#add"+resource) .val());
	}
	
	
	
	function produceResources(){
		
		for(var propertyName in items) { //for each item you have
			var resourcesArray = items[propertyName].resource; //the resources of the array
			for (index = 0; index < resourcesArray.length; ++index) { //for each resource generated by the item
				var resourceName = resourcesArray[index].resource; //get the name of the resource to work by
				var resourceQuantity = resourcesArray[index].quantity; //get the amount of the resource to work by
				
				if(items[resourceName] != null){ //if exist an item of the given resource name, then, add that item quantity based on production
					items[resourceName].quantity += items[propertyName].quantity*resourceQuantity;
				}else{  //if not then search if the resource is already created, if its already created adds to that resource quantity, else,  change that quantity with the amount generated and add the necessary html
					if(resources[resourceName] != null && resources[resourceName]>=0 ){
						resources[resourceName] += items[propertyName].quantity*resourceQuantity;
						$("#cantidad"+resourceName).html(resources[resourceName]);
					}else{
						resources[resourceName] = items[propertyName].quantity*resourceQuantity;
						var resourcesDiv = $("#resources");
						resourcesDiv.html(resourcesDiv.html()+"  -  "+resourceName+": <label id='cantidad"+ resourceName +"'>"+items[propertyName].quantity*resourceQuantity+"</label>");
					}
				}
			}
		}
	}
	
	
	
	function keyDownEventsInit(){ //eventhandler
		var eventHandler = {};
		eventHandler.keyAllowed = {};
		

		$(document).keydown(function(e) { //se dispara cuando toco una tecla, por ahora solo agarra el 16 y el 17 control y shift respectivamente. posee un control para saber cuando lo tiene apretado y cuando lo suelta, asi la funcionalidad no se dispara multiples veces
			if (eventHandler.keyAllowed [e.which] === false) return;
			eventHandler.keyAllowed [e.which] = false;
			if(e.which == 17 ){
				MANAGER.quantity*=100;
				updateItems();
				return;
			}
			if(e.which == 16){
				MANAGER.quantity*=10;
				updateItems();
				return;
			}
		});

		$(document).keyup(function(e) { //chequea cuando se suelta la tecla.
		  eventHandler.keyAllowed [e.which] = true;
		  if(e.which == 17 ){
				MANAGER.quantity/=100;
				updateItems();
				return;
			}
			if(e.which == 16){
				MANAGER.quantity/=10;
				updateItems();
				return;
			}
		});

		$(document).focus(function(e) { 
		  eventHandler.keyAllowed = {};
		});
		
	}
	
	var buyItem = function(name){
		quantity = MANAGER.quantity;
		
		for(var propertyName in items[name].price) { //for each resource to buy the item
			if(resources[propertyName] ==null || resources[propertyName] < Math.floor(items[name].price[propertyName].quantity*(Math.pow(items[name].increment,quantity)-1)/(items[name].increment-1))){ //asks if it exists the necessary resource, and if it have the necessary amount
				console.log("no puedo");
				return;
			}
		}
		
		for(var propertyName in items[name].price) { //another for each to reduce the resources spent into the buying
				resources[propertyName] -= Math.floor(items[name].price[propertyName].quantity*(Math.pow(items[name].increment,quantity)-1)/(items[name].increment-1));
				updateResource(propertyName);
				/*
				for(i=1;i <= quantity;i++){ //for each item bought increment the price of the item based on the factor, i have to search a mathematical way of doing this FASTER
					items[name].price[propertyName].quantity *= items[name].increment; 
					items[name].price[propertyName].quantity = Math.floor(items[name].price[propertyName].quantity);
				}
				*/
				//mathematical way of doing it FASTER.
				items[name].price[propertyName].quantity = Math.floor(items[name].price[propertyName].quantity*Math.pow(items[name].increment,quantity));
				
				
		}
		items[name].quantity += quantity; //add the boughts items
		items[name].updateHtml();
		
	}


	function priceToString(itemPrices,quantity,increment){
		var priceString = "";
		for(var propertyName in itemPrices) { //a for each to take each one of this and transform it into a readeable string
				priceString+= propertyName+": "+Math.floor(itemPrices[propertyName].quantity*(Math.pow(increment,quantity)-1)/(increment-1))+", "; 
				
		}
		return priceString.substring(0, priceString.length - 2);
	}
	
	function productionToString(resources){
		var resourcesString = "";
		for (index = 0; index < resources.length; ++index) { //for each resource
			resourcesString += ""+resources[index].resource+": "+resources[index].quantity+", ";
		}
		return resourcesString.substring(0, resourcesString.length - 2);
	}
	
	function updateResource(resourceName){//update given resource html
		$("#cantidad"+resourceName).html(resources[resourceName]);
	}
	

	setTimeout(function(){ init();}, 5000);
