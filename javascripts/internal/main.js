var MANAGER = {};
	MANAGER.quantity = 1;
	MANAGER.itemsHtml = "";
	MANAGER.initialPricesHtml = "";
	MANAGER.initialProductionHtml = "";
	MANAGER.itemUpgradeValue = 1;
	MANAGER.flagApplyToAllItems = false;
	
	//"{"Casa":{"name":"Casa","price":{"money":{"quantity":47069231989101}},"increment":"1.1","resource":[{"resource":"money","quantity":"100000000000"}],"quantity":282}}"
	var items = {};
	
	//"{"money":24798707680109930}"
	var resources = {};
	
	/*
	upgrade[nombre][item/"AllThePossibleItems"] = {};
	.type(sum, percentage, production, achievments, cost reduction, interest, cost deletion, addproduction);
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
		

		var itemName = $("");
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
				itemProduction[$(this).val()] = parseInt($(this).siblings()[1].value);
				//itemProduction.push({resource:$(this).val(),quantity:$(this).siblings().val()});
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
					$("#"+ this.name.replace(/ /g,"_") +"Production").text(productionToString(this.itemProduction));
				}
			}
			MANAGER.itemsHtml+="<div class='butt' onclick='buyItem(\"" + itemName +"\", "+ MANAGER.quantity +")'><label class='itemDescriptionLabel' id=" + itemName.replace(/ /g,"_") + ">"+ itemName +"</label><br><label class='itemDescriptionLabel' id='" + itemName.replace(/ /g,"_") + "Price'>"+ priceToString(itemPrice,1,1) +"</label><br><label class='itemDescriptionLabel' id='" + itemName.replace(/ /g,"_") + "Production'>"+ productionToString(itemProduction) +"</label></div>";
		

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
			stringPrice = 	'<div class="form-group">'+
		                      '<label class="col-md-4 control-label"></label>'+
		                      '<div class="col-md-4">'+
		                        '<input type="text" placeholder="Resource\'s name" class="form-control input-md initialPriceResource"> '+
		                        '<input type="text" placeholder="Amount" class="form-control input-md">'+
		                      '</div>'+
		                    '</div>';
			$("#initialPrices").append(stringPrice);
		});

		//add production item with an append
		$("#addProduction").click(function(){
			stringProdution ='	<div class="form-group">'+
	                              '<label class="col-md-4 control-label" ></label>'+
	                              '<div class="col-md-4">'+
	                                '<input type="text" placeholder="Resource\'s name or item" class="form-control input-md itemProduction" tooltip="you can place an item name here, to produce another item(derivative!!)"> '+
	                                '<p class="help-block">item should be already created</p>'+
	                                '<input type="text" placeholder="Amount" class="form-control input-md">'+
	                              '</div>'+
	                            '</div>';
			$("#productions").append(stringProdution)
		});
		createUpgrades();
		//start the timer of the game.
		var cualc = setInterval(function(){ runFunctions()}, 1000);
	
	}
	//initialize upgrades form
	function createUpgrades(){


		$("#addInitialPriceUpgrade").click(function(){
			stringPrice = 	'<div class="form-group">'+
		                      '<label class="col-md-4 control-label"></label>'+
		                      '<div class="col-md-4">'+
		                        '<input type="text" placeholder="Resource\'s name" class="form-control input-md initialPriceUpgrade"> '+
		                        '<input type="text" placeholder="Amount" class="form-control input-md">'+
		                      '</div>'+
		                    '</div>';
			$("#upgradeCosts").append(stringPrice);
		});

		//upgrade item selector, some item is selected, this will create some dynamic forms added.
		$('#upgradeItemSelector').on('change', function() {
		  //alert($(this).val()); // or $(this).val()

	  		if($($(this)).val()[0] == "Apply to all items" ){
	  			itemName = "Apply to all items"
	  			itemsTypesHtml = '<div  class="form-group form-group">'+
	                        '<label class="col-md-4 control-label" for="upgradeTypeSelector">Type of upgrade for ' + itemName + '</label>'+
	                        '<div class="col-md-4">'+
	                        '<select class="form-control selectUpgradeType" id="upgradeTypeFor'+ itemName +'"" item="' + itemName + '">'+
	                        	'<option>Select one</option>'+
	                            '<option value="percIncOneRes">'+'Percentage increase production one resource'+'</option>'+
	                            '<option value="percIncAllRes">'+'Percentage increase production all resources'+'</option>'+
	                            '<option value="costRedPercOneRes">'+'Cost reduction percentage one resource'+'</option>'+
	                            '<option value="costRedPercAllRes">'+'Cost reduction percentage all resources'+'</option>'+
	                        '</select>'+
	                        '</div>'+
	                    '</div>';
	            $("#itemsTypes").html(itemsTypesHtml);
	            MANAGER.flagApplyToAllItems = true;
	  		}
	  		else{
	  			//deletes the old html
	  			$("#itemsTypes").html("");
		  		$($(this).val()).each(function(index,element){
					itemName = element;

					//create upgrade type html per item selected
					itemsTypesHtml = '<div  class="form-group form-group">'+
	                        '<label class="col-md-4 control-label" for="upgradeTypeSelector">Type of upgrade for ' + itemName + '</label>'+
	                        '<div class="col-md-4">'+
	                        '<select class="form-control selectUpgradeType" item="' + itemName.replace(/ /g,"_") + '" index="'+ index +'">'+
	                        	'<option>Select one</option>'+
	                            '<option value="sumIncOneRes">'+'Sum increase production one resource'+'</option>'+
	                            '<option value="sumIncAllRes">'+'Sum increase production all resources'+'</option>'+
	                            '<option value="percIncOneRes">'+'Percentage increase production one resource'+'</option>'+
	                            '<option value="percIncAllRes">'+'Percentage increase production all resources'+'</option>'+
	                            '<option value="addProdType">'+'Add production type'+'</option>'+
	                            '<option value="costRedPercOneRes">'+'Cost reduction percentage one resource'+'</option>'+
	                            '<option value="costRedPercAllRes">'+'Cost reduction percentage all resources'+'</option>'+
	                        '</select>'+
	                        '</div>'+
	                    '</div>'+
	                    '<div id="'+ index+itemName.replace(/ /g,"_") +'"></div>';
					//appends the html
						$("#itemsTypes").append(itemsTypesHtml);
				});
			}
			$(".selectUpgradeType").on('change', function() {
				

				switch ($(this).val()) {
					case "sumIncOneRes":
						//create an input
					  	createInputs($(this).attr("index"),$(this).attr("item"),["resource","amount"],"inputUpgradeType",["Resource","Amount"]);

					    break;
					case "sumIncAllRes":
					  	createInputs($(this).attr("index"),$(this).attr("item"),["amount"],"inputUpgradeType");

					    break;
					case "percIncOneRes":
						createInputs($(this).attr("index"),$(this).attr("item"),["resource","percentage"],"inputUpgradeType");

					    break;
					case "percIncAllRes":
						createInputs($(this).attr("index"),$(this).attr("item"),["percentage"],"inputUpgradeType");

					    break;
					case "addProdType":
						createInputs($(this).attr("index"),$(this).attr("item"),["resource","amount"],"inputUpgradeType");
					     
					    break;
					case "costRedPercOneRes":
						createInputs($(this).attr("index"),$(this).attr("item"),["resource","percentage"],"inputUpgradeType");
					     
					    break;
					case "costRedPercAllRes":
						createInputs($(this).attr("index"),$(this).attr("item"),["percentage"],"inputUpgradeType");
					     
					    break;
					case "delCostType":
						createInputs($(this).attr("index"),$(this).attr("item"),["resource"],"inputUpgradeType");
					     
					    break;
					case "intOverRes":
						createInputs($(this).attr("index"),$(this).attr("item"),["resource","percentage","Ticks"],"inputUpgradeType");
					     
					    break;
					case "bonFromAchievments":
						createInputs($(this).attr("index"),$(this).attr("item"),["percentage"],"inputUpgradeType");
					     
					    break;
					default:
						alert("Select a correct option please");
					    //Statements executed when none of the values match the value of the expression
					    break;
				}




			});


		});
	};
	//temporary test function
	function takeUpgrades(){

		

		var upgradeName = $("#upgradeName");
		upgradeName = $(upgradeName).val();
		upgrades[upgradeName] = {};


		var itemsAffected = $("#upgradeItemSelector");
		$.each($(itemsAffected).val(),function(index, itemName){
			upgrades[upgradeName][itemName] = {};
		});



		var typeOfUpgradesForEachItem = $(".selectUpgradeType");
		typeOfUpgradesForEachItem.each(function(index,inputType){
			upgrades[upgradeName][$(inputType).attr("item")].type = $(inputType).val();

		});


		var resourcePrice = {};
		$(".initialPriceUpgrade").each(function(){
				resourcePrice[$(this).val()] = {};
				resourcePrice[$(this).val()].quantity = $(this).siblings().val();
				if(resources[$(this).val()] == null || resources[$(this).val()]<0){
					resources[$(this).val()] = 0;
					var resourcesDiv = $("#resources");
					resourcesDiv.html(resourcesDiv.html()+"  -  "+$(this).val()+": <label id='cantidad"+ $(this).val() +"'>"+0+"</label>");
				}
		});
		upgrades[upgradeName]["resourcePrice"] = resourcePrice;


		var inputsForEachType = $(".inputUpgradeType");

		inputsForEachType.each(function(index,element){
			datos = $(element).attr("id").split('-');
			//datos[0] is the item name, datos[1] is the input name
			upgrades[upgradeName][datos[0]][datos[1]]= $(element).val();

		});
		$('#upgradeItemSelector option').prop('selected', false);
		$("#itemsTypes").html("");

		//resource costs
		generateUpgradeHtml(upgradeName);
	}


	function generateUpgradeHtml(upgradeName){
		var tooltip = "";
		var html = upgradeName+"\n MouseOver to see description";
		var temporalVariable = true;
		for (var propertyName in upgrades[upgradeName]){
			

			if(propertyName != "resourcePrice"){
				tooltip += "Affects "+propertyName+"\n";
				if(upgrades[upgradeName][propertyName].type){
					tooltip+= ", type "+upgrades[upgradeName][propertyName].type
				}
				if(upgrades[upgradeName][propertyName].amount){
					tooltip+= ", amount "+upgrades[upgradeName][propertyName].amount
				}
				if(upgrades[upgradeName][propertyName].resource){
					tooltip+= ", resource "+upgrades[upgradeName][propertyName].resource
				}
				if(upgrades[upgradeName][propertyName].Percentage){
					tooltip+= ", percentage "+upgrades[upgradeName][propertyName].Percentage
				}
				if(upgrades[upgradeName][propertyName].Ticks){
					tooltip+= ", Ticks "+upgrades[upgradeName][propertyName].Ticks
				}
			}
		}
		if(upgrades[upgradeName]["resourcePrice"] && temporalVariable){
				tooltip+= ".\n Cost "+upgradePriceToString(upgrades[upgradeName][propertyName]);
				temporalVariable = false;
		}

		$("#upgrades").append("<div class='butt' title='"+ tooltip +"' id='upgrade"+ upgradeName +"' onclick='buyUpgrade(\""+ upgradeName +"\")'>"+html+"</div>");


	}

	function buyUpgrade(upgradeName){
		var upgrade = upgrades[upgradeName]
		for(itemName in upgrade){
			switch(upgrade[itemName].type){
					case "sumIncOneRes":
						//the quantity of the resource of the name in the upgrade of the item of the name "itemName" adds the upgrade amount
						var resourceToIncrease = upgrade[itemName].resource;
						items[itemName].resource[resourceToIncrease] += parseInt(upgrade[itemName].amount);
						var selector = "#upgrade"+upgradeName;
						$(selector)

					    break;
					case "sumIncAllRes":
					  	for(resourceName in items[itemName].resource){
					  		items[itemName].resource[resourceName] += upgrade[itemName].amount;
					  	}


					    break;
					case "percIncOneRes":
						var resourceToIncrease = upgrade[itemName].resource;
						items[itemName].resource[resourceToIncrease] *= parseInt(upgrade[itemName].percentage);

					    break;
					case "percIncAllRes":
						for(resourceName in items[itemName].resource){
					  		items[itemName].resource[resourceName] *= parseInt(upgrade[itemName].percentage);
					  	}

					    break;
					case "addProdType":
						items[itemName].resource[upgrade[itemName].resource] = parseInt(upgrade[itemName].amount);
						//items[itemName].resource.push({quantity:upgrade[itemName].amount,resource:upgrade[itemName].resource});
					     
					    break;
					case "costRedPercOneRes":
						var resourceToDecrease = upgrade[itemName].resource;
						items[itemName].price[resourceToDecrease] *= parseInt(upgrade[itemName].percentage);
					     
					    break;
					case "costRedPercAllRes":
						for(priceName in items[itemName].price){
					  		items[itemName].price[priceName] *= parseInt(upgrade[itemName].percentage);
					  	}
					     
					    break;
					case "delCostType":
						//createInputs($(this).attr("index"),$(this).attr("item"),["Resource"],"inputUpgradeType");
					     alert("upgrade type disabled because not included in 1.0")
					    break;
					case "intOverRes":
						//createInputs($(this).attr("index"),$(this).attr("item"),["Resource","Percentage","Ticks"],"inputUpgradeType");
					     alert("upgrade type disabled because not included in 1.0")
					    break;
					case "bonFromAchievments":
						//createInputs($(this).attr("index"),$(this).attr("item"),["Percentage"],"inputUpgradeType");
					     alert("upgrade type disabled because not included in 1.0")
					    break;
					default:
						//if the case not exist it could be the price to buy it.
						//alert("Select a correct option please");
					    //Statements executed when none of the values match the value of the expression
					    break;
			}







		}
	}
	

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
			htmlResourcesAddForm+= "<label>Add " + propertyName + "</label><input id='add" + propertyName + "' /><input type='button' onclick='addResource(\"" + propertyName + "\")' value='Accept' />";
		}
		$("#formAddResources").html(htmlResourcesAddForm);
	}
	
	function addResource(resource){
		resources[resource] += parseInt($("#add"+resource) .val());
	}
	
	
	
	function produceResources(){
		
		for(var propertyName in items) { //for each item you have
			var resourcesObject = items[propertyName].resource; //the resources of the object
			for (resourceName in resourcesObject) { //for each resource generated by the item, take each name of resource
				var resourceQuantity = resourcesObject[resourceName]; //get the amount of the resource to work by
				
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
		

		$(document).keydown(function(e) { //it triggers when I click(or push the button) a key, for now is just 16(control) and 17(shift). It starts when you press it,so the function doesnt trigger everytime while you press it.
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

		$(document).keyup(function(e) { //gets whenever you release a the key
		  eventHandler.keyAllowed [e.which] = true;
		  if(e.which == 17 ){
				MANAGER.quantity/=100;
				updateItems();
				if(MANAGER.quantity < 1){
					MANAGER.quantity = 1;
				}
				return;
			}
			if(e.which == 16){
				MANAGER.quantity/=10;
				if(MANAGER.quantity < 1){
					MANAGER.quantity = 1;
				}
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
		return priceString.substring(0, priceString.length - 2);//to delete the last comma if it is the last price
	}
	
	function upgradePriceToString(prices){
		var text = "";
		for(var propertyName in prices) {
			text+=propertyName+":"+prices[propertyName].quantity+" - ";
		}
		return text.substring(0, text.length -3); //to delete the last 3 spaces
	}
	
	function productionToString(resources){
		var resourcesString = "";
		for (resourceName in resources) { //for each resource similar to price
			resourcesString += ""+resourceName+": "+resources[resourceName]+", ";
		}
		return resourcesString.substring(0, resourcesString.length - 2); //to delete the last comma if it is the last resource
	}

	function createInputs(place,jquerySelector,inputNameArray,inputClass,labelArray){
		originDiv = $("#"+place+jquerySelector);
		html = "";
		inputNameArray.forEach(function(entry, index) {
			label = (labelArray)? labelArray[index] : inputNameArray[index];
			html+= '<div class="form-group">'+
                      '<label class="col-md-4 control-label">'+ entry +'</label>'+
                      '<div class="col-md-4">'+
                        '<input type="text" placeholder="Amount" class="form-control input-md '+ inputClass +'" id='+ jquerySelector+"-"+entry +'>'+
                      '</div>'+
		            '</div>';
		});
		originDiv.html(html);
	}


	
	function updateResource(resourceName){//update given resource html
		$("#cantidad"+resourceName).html(resources[resourceName]);
	}
	

	setTimeout(function(){ init();}, 1000);
