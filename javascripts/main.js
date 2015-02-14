var MANAGER = {};
	MANAGER.quantity = 1;
	
	var items = {};
	
	var resources = {};
	
	var upgrades = {};
	
	function init(){
	
		keyDownEventsInit();
		
		
	
		var html = ""
		
	
		var itemPromptName = prompt("Please enter item name, or press cancel to exit the item creator","Name");
		while(itemPromptName != null){ //this while keeps recording as far as theitem ca build another resource, we have to think about some help here for the user input
			var itemPromptPrice = prompt("Please enter initial price item by using name:quantity;otherName:otherQuantity","money:50");
		var itemPromptIncrement = prompt("Please enter increment like \" 1.05  \" that will increase the price of the item  ","1.05");
		var itemPromptResource = prompt("Please enter the name of the resource this item will create, it can be other item too; then enter a comma \",\" and then enter the amount of that resource. Press enter, you will be asked to input another resource if you want, to stop this process click cancel","money,10");
			var itemResources = [];
			while (itemPromptResource != null){
				datos = itemPromptResource.split(',');//beside each resource separated in some inputs, also its separated for the quantity with a comma
				
				itemResources.push({resource:datos[0],quantity:datos[1]});
				itemPromptResource = prompt("Please enter the name of the resource this item will create, it can be other item too; then enter a comma \",\" and then enter the amount of that resource. Press enter, you will be asked to input another resource if you want, to stop this process click cancel","money");
			}
			var itemPrices = {}; //for the multiple item prices go here, maybe i have to base it like the resources in a multiple input based, but for now its name:quantity;othername:quantity2;name3:quantity3
			resourceType = itemPromptPrice.split(';');//first split the pair of name:quantity
			
			for (index = 0; index < resourceType.length; ++index) {
				priceResourceQuantity = resourceType[index].split(':');//then splits the name:quantity, to get the name and the quantity, i will use this later
				itemPrices[priceResourceQuantity[0]] = {};
				itemPrices[priceResourceQuantity[0]].quantity = priceResourceQuantity[1];  //i will use an strategy to get the resource and the name later in the buying on the item, i will let the html for later, that it will be hard with this multiprice based
			}
			
			
			items[itemPromptName] = {
				nombre: itemPromptName,
				price: itemPrices,
				increment: itemPromptIncrement,
				resource: itemResources,
				quantity: 0,
				updateHtml : function(){
					$("#"+ this.nombre +"").text(this.nombre+": "+this.quantity);
					$("#"+ this.nombre +"Price").text(priceToString(this.price,MANAGER.quantity,this.increment));   //check viability
				}
			}
			html+="<div class='butt' onclick='buyItem(\"" + itemPromptName +"\", "+ MANAGER.quantity +")'><label id=" + itemPromptName + ">"+ itemPromptName +"</label><br/><label id='" + itemPromptName + "Price'>"+ priceToString(itemPrices,1,1) +"</label><br/><label>"+ resourcesToString(itemResources) +"</label></div>";
		
			
		
			itemPromptName = prompt("Please enter item name, or press cancel to exit the item creator","Name");
		}
		$("#items").html(html);
		//runFunctions();
		x = 1;
		var initialResourcePrompt = prompt("Please enter your number "+ x +" initial resource NAME in this game, press cancel to exit","");
		while (initialResourcePrompt != null){
			initialResourceQuantityPrompt = prompt("Please enter your number "+ x +" initial resource QUANTITY in this game, press cancel to exit","");

			resources[initialResourcePrompt]  = parseInt(initialResourceQuantityPrompt);


			$("#resources").html($("#resources").html()+"  -  "+ initialResourcePrompt +": <label id='cantidad"+ initialResourcePrompt +"'>"+ initialResourceQuantityPrompt +"</label>");
			x++;
			initialResourcePrompt = prompt("Please enter your number "+ x +" initial resource in this game, press cancel to exit","");
		}
		
		//var upgradesPrompt = prompt('add your wanted upgrades : [{"name":"upgrade1","affects":"Casa","increase":"1.2","augments":"4"},{"name":"upgrade2","affects":"Casa","increase":"1.1","augments":"5"}]','[{"name":"upgrade1","affects":"Casa","increase":"1.2","augments":"4"},{"name":"upgrade2","affects":"Casa","increase":"1.1","augments":"5"}]');
		//upgradesArray = $.parseJSON(upgradesPrompt);
		//[{name:"upgrade1",affects:"Casa",increase:1.2,augments:4,cost:{money:50,tierra:10}},{name:"upgrade2",affects:"Casa",increase:1.1,augments:5,cost:{money:50,tierra:10}}]
		
		
		var cualc = setInterval(function(){ runFunctions()}, 1000);
		//prompt("test",JSON.stringify(items));
	
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
			if(resources[propertyName] ==null || resources[propertyName] < items[name].price[propertyName].quantity*quantity){ //asks if it exists the necessary resource, and if it have the necessary amount
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
				items[name].price[propertyName].quantity *= Math.floor(Math.pow(items[name].increment,quantity));
				
				
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
	
	function resourcesToString(resources){
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
