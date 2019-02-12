function queryString(parameter) { 
  var loc = location.search.substring(1, location.search.length);
  var param_value = false;

  var params = loc.split("&");
  for (i=0; i<params.length;i++) {
      param_name = params[i].substring(0,params[i].indexOf('='));
      if (param_name == parameter) {
          param_value = params[i].substring(params[i].indexOf('=')+1)
      }
  }
  if (param_value) {
      return param_value;
  }
  else {
      return false; //Here determine return if no parameter is found
  }
}

function checkCurrentUserInGroup(groupName, callback){
	var siteUrl = _spPageContextInfo.siteAbsoluteUrl;
    $.ajax({
        url: siteUrl + "/_api/web/currentUser?$select=Groups/Title&$expand=Groups",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            //console.log(data.d.Groups.results);            
            if (searchObjInArray(groupName,"Title",data.d.Groups.results)!=null)
            {
            	//console.log("Group Found");
            	callback(true);
            }
            else
            {
            	callback(false);            
            }
            
        },
        error: function(error) {
            console.log(error);
            callback(false,ext);
        }
    });    
}

/*---------------------------------------------------------------------------------------------------*/
/*
  This operation is to check whether Users is exist within Sharepoint Group we trying to search for
  If it's does then it will return a bool value.
*/
function chkCurrentUserInGroup(groupName){
	var siteUrl = _spPageContextInfo.siteAbsoluteUrl;    
    $.ajax({
        url: siteUrl + "/_api/web/currentUser?$select=Groups/Title&$expand=Groups",
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            console.log(data.d.Groups.results);            
            if (searchObjInArray(groupName,"Title",data.d.Groups.results)!=null)
            {
            	returnVal = true;
            	console.log("Group Found: " + returnVal );            	            	
            }
            else{
            	returnVal = false;
            }           
        },
        error: function(error) {
            console.log(error);
        }
    });    
    return returnVal;
}

/*---------------------------------------------------------------------------------------------------*/

function getUser(id, url , success, failure){
	var siteUrl = url; 
	  $.ajax({
	   		url:  siteUrl + "/_api/Web/GetUserById(" + id + ")",
	 		method: "GET",
    		headers: { "Accept": "application/json; odata=verbose"},       
        	success: function (data) {
        		//console.log(data);
        		success(data);
        	},
	        error: function (data) {
	            failure(data);
	        }
	  });   
}

/*---------------------------------------------------------------------------------------------------*/
/*
  This operation is to search an Object within an Array which you have to provide key & property for 
  this to search.
  Usage:
  	searchObjInArray("Title","Key",currUserDataArray); 
  	//We trying to search for Position Title for the current User.
  
*/
function searchObjInArray(nameKey, prop, myArray) {
    //console.log (nameKey,prop, myArray);
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i][prop] == nameKey) {
            return myArray[i];
        }
    }
    return null;
}
/*---------------------------------------------------------------------------------------------------*/
function GenerateCAMLQuery(searchObj){

    var sQuery = "";
    if (searchObj.length > 0)
    {
        var itemCount = 0;
        
        $.each(searchObj, function(key, item) {
    		//if there is any value in the criteria then include it in the search
    		//alert(item.Field +":" + item.Value);
    		     		
    		if (item.Value.length>0  && (item.Value!="undefined-undefined-")){
    		
				itemCount++;
    		
				//Date specific case
    			var sDate = "";
	    		if (item.Type == "Date"){
	    		sDate = "IncludeTimeValue='false'";
	    		}
	    		
	    		//Create field crtieria
	    		sQuery += "<" + item.Op + "><FieldRef Name='" + item.Field + "' /><Value " + sDate + " Type='" + item.Type + "'>" + item.Value + "</Value></" + item.Op + ">";
	    		
	    		//Append the Joins
	    		if (itemCount >= 2){
	                sQuery = "<" + item.Join + ">" + sQuery + "</" + item.Join + ">";
	            }
   			}
		});
	
		sQuery = "<Where>" + sQuery + "</Where>";
    }
	
    return sQuery;
}
/*---------------------------------------------------------------------------------------------------*/
function convertSPDate(inputFormat) {
/*return new Date(d).toLocaleDateString("en-AU");*/
	if(inputFormat != null){
		function pad(s) { return (s < 10) ? '0' + s : s; }
  		var d = new Date(inputFormat);
  		console.log("parse date: "+d);
  		return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
  	}
  	else{
  	    return "";
  	}
}
/*---------------------------------------------------------------------------------------------------*/
function getFormattedDate(input) {
    var pattern = /(.*?)\/(.*?)\/(.*?)$/;
    if(input != null){
	    var result = input.replace(pattern,function(match,p1,p2,p3){
	        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	        return p1 + " " + months[(p2-1)] + " " + p3;
	    });	
	    return result;
    }
}
/*---------------------------------------------------------------------------------------------------*/

function convertSPDateNew(d) {    
	if(d != null){
	    console.log("parse New date: "+d);
		var dateParts = d.split('/');		
		return dateParts[1]+ "/" + dateParts[0] +"/"+ dateParts[2];
		//return dateParts[2]+ "-" + dateParts[1] +"-"+ dateParts[0];
	}
	else
	   return "";
}
/*---------------------------------------------------------------------------------------------------*/
function convertiCalDate(d) {    
	if(d != null){
	    console.log("parse New date: "+d);
		var dateParts = d.split('/');		
		return dateParts[2]+ "-" + dateParts[1] +"-"+ dateParts[0];
		//return dateParts[2]+ "-" + dateParts[1] +"-"+ dateParts[0];
	}
	else
	   return "";
}
/*---------------------------------------------------------------------------------------------------*/

function convertSPDateTime(d) {
	var vDate =  new Date(d);
	return vDate.toLocaleDateString("en-AU")+ " " + vDate.toLocaleTimeString("en-AU");
}
/*---------------------------------------------------------------------------------------------------*/
function convertSPDateAU(d) {
    if(d != null){
    	var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		var vDate =  new Date(d);
		return vDate.toLocaleDateString("en-AU", options);
	}
}
/*---------------------------------------------------------------------------------------------------*/
function convertStDate(d) {
    if(d != null){
    	var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		var vDate =  new Date(d);
		return vDate;
	}
}

/*---------------------------------------------------------------------------------------------------*/
// CREATE Operation
// listName: The name of the list you want to get items from
// weburl: The url of the web that the list is in. 
// newItemTitle: New Item title.
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function CreateListItemWithDetails(listName, webUrl, itemProperties, itemType ,success, failure) {
    //var itemType = GetItemTypeForListName(listName);
    //var itemType = "Behavior Plan";
    itemProperties["__metadata"] = { "type": itemType };
    console.log(itemProperties); 	
    
    
    $.ajax({
        url: webUrl + "/_api/web/lists/getbytitle('" + listName + "')/items",
        type: "POST",
        contentType: "application/json;odata=verbose",
        data: JSON.stringify(itemProperties),
        headers: {
            "Accept": "application/json;odata=verbose",
            "X-RequestDigest": $("#__REQUESTDIGEST").val()
        },
        success: function (data) {
            success(data);
        },
        error: function (data) {
            failure(data);
        }
    });
}
/*---------------------------------------------------------------------------------------------------*/ 
// Get List Item Type metadata
function GetItemTypeForListName(name) {
    return "SP.Data." + name.charAt(0).toUpperCase() + name.split(" ").join("").slice(1) + "ListItem";
}
/*---------------------------------------------------------------------------------------------------*/
// READ SPECIFIC ITEM operation
// itemId: The id of the item to get
// listName: The name of the list you want to get items from
// siteurl: The url of the site that the list is in. 
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function getListItemWithId(itemId, column, listName, siteurl, success, failure) {
    var url = siteurl + "/_api/web/lists/getbytitle('" + listName + "')/items?$filter="+column+" eq " + itemId;
    console.log(url);
    $.ajax({
        url: url,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
        console.log(data);
            if (data.d.results.length == 1) {
                success(data.d.results[0]);
            }
            else {
                failure("Multiple results obtained for the specified Id value or no result found.");
            }
        },
        error: function (data) {
            failure(data);
        }
    });
}
/*---------------------------------------------------------------------------------------------------*/
// READ operation
// listName: The name of the list you want to get items from
// siteurl: The url of the site that the list is in. 
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function getAllListItems(listName, siteurl,success, failure) {
    var searchURL  = siteurl + "/_api/web/lists/getbytitle('" + listName + "')/items?$select=*&$top=1000";
    //console.log(searchURL);
    $.ajax({
        url: searchURL ,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            console.log(data);
            success(data);
        },
        error: function (data) {
            failure(data);
        }
    });
}
/*---------------------------------------------------------------------------------------------------*/

// occurs when a user clicks the read button
function ReadAll(listName, url) {
    //var listName = "MyList";
 
    getListItems(listName, url, function (data) {
        var items = data.d.results;
 
        // Add all the new items
        for (var i = 0; i < items.length; i++) {
            console.log(items[i].Title + ":" + items[i].Id);
        }
    }, function (data) {
        alert("Ooops, an error occured. Please try again");
    });
}
/*---------------------------------------------------------------------------------------------------*/
// occurs when a user clicks the read button
function Read() {
    var listName = "MyList";
    var url = _spPageContextInfo.webAbsoluteUrl;
 
    getListItems(listName, url, function (data) {
        var items = data.d.results;
 
        // Add all the new items
        for (var i = 0; i < items.length; i++) {
            alert(items[i].Title + ":" + items[i].Id);
        }
    }, function (data) {
        alert("Ooops, an error occured. Please try again");
    });
}
/*---------------------------------------------------------------------------------------------------*/
 
// READ operation
// listName: The name of the list you want to get items from
// siteurl: The url of the site that the list is in. 
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function getListItems(listName, siteurl, criteria, columns,order, success, failure) {
    var searchURL  = siteurl + "/_api/web/lists/getbytitle('" + listName + "')/items?$select=" +columns + "&$filter=" +criteria + "&$orderby=" +order+"&$top=1000";
    //console.log(searchURL);
    $.ajax({
        url: searchURL ,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            success(data);
        },
        error: function (data) {
            failure(data);
        }
    });
}
/*---------------------------------------------------------------------------------------------------*/
function getCalItems(listName, siteurl, criteria, columns,order, success, failure) {
    var searchURL  = siteurl + "/_api/web/lists/getbytitle('" + listName + "')/items?$select=*&$filter=" +criteria + "&$orderby=" +order +"&$top=1000";

    //console.log(searchURL);
    $.ajax({
        url: searchURL ,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            success(data);
        },
        error: function (data) {
            failure(data);
        }
    });
}
/*---------------------------------------------------------------------------------------------------*/


function getListItemsALL(listName, siteurl, criteria, columns, order, success, failure) {
    //GetByTitle('ListTitle')/items?$select=*&exclude=Title
    var searchURL  = siteurl + "/_api/web/lists/getbytitle('" + listName + "')/items?$select=*"+ "&$orderby=" + order +"&$top=1000";
    
    //console.log(searchURL);
    $.ajax({
        url: searchURL ,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            success(data);
        },
        error: function (data) {
            failure(data);
        }
    });
}
/*---------------------------------------------------------------------------------------------------*/
function getListFieldbyID(listID, siteurl, criteria, columns,order, success, failure) {
    var searchURL  = siteurl + "/_api/web/lists(guid'" + listID + "')/fields()";
    //console.log(searchURL);
    $.ajax({
    	url: searchURL,
   		method: "GET",
    	headers: { "Accept": "application/json; odata=verbose"},       
        success: function (data) {
	        success(data);            
        },
        error: function (data) {
            failure(data);
        }
    });
}


/*---------------------------------------------------------------------------------------------------*/
function getListItemsWithExpand(listName, siteurl, criteria, columns,order,expand , success, failure) {
    var searchURL  = siteurl + "/_api/web/lists/getbytitle('" + listName + "')/items?$select=" +columns + "&$filter=" +criteria + "&$orderby=" +order + "&$expand=" +expand ;
    //console.log(searchURL);
    $.ajax({
        url: searchURL ,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            success(data);
        },
        error: function (data) {
            failure(data);
        }
    });
}

/*---------------------------------------------------------------------------------------------------*/
// READ operation
// listName: The name of the list you want to get items from
// siteurl: The url of the site that the list is in. 
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function getListItemsbyCount(listName, siteurl, criteria, columns,order,count, success, failure) {
    var searchURL  = siteurl + "/_api/web/lists/getbytitle('" + listName + "')/items?$select=" +columns + "&$filter=" +criteria + "&$top="+ count +"&$orderby=" +order;
    																																		
    //console.log(searchURL);
    $.ajax({
        url: searchURL ,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            success(data);
        },
        error: function (data) {
            failure(data);
        }
    });
}





/*---------------------------------------------------------------------------------------------------*/

// occurs when a user clicks the update button
function Update() {
    var listName = "MyList";
    var url = _spPageContextInfo.webAbsoluteUrl;
    var itemId = "1"; // Update Item Id here
    var title = "New Updated Title";
    updateListItem(itemId, listName, url, title, function () {
        alert("Item updated, refreshing available items");
    }, function () {
        alert("Ooops, an error occured. Please try again");
    });
}
/*---------------------------------------------------------------------------------------------------*/ 
// Update Operation
// listName: The name of the list you want to get items from
// siteurl: The url of the site that the list is in. // title: The value of the title field for the new item
// itemId: the id of the item to update
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function updateListItem(itemId, listName, siteUrl, itemProperties,itemType , successFunction, failureFunction) {
    //var itemType = GetItemTypeForListName(listName);
 
if (itemType)
{   
	itemProperties["__metadata"] = { "type": itemType };
}  
   
   /* var item = {
        "__metadata": { "type": itemType },
        "Title": title
    };*/
 
    getListItemWithId(itemId, "ID", listName, siteUrl, function (data) {
        $.ajax({
            url: data.__metadata.uri,
            type: "POST",
            contentType: "application/json;odata=verbose",
            data: JSON.stringify(itemProperties),
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "X-HTTP-Method": "MERGE",
                "If-Match": data.__metadata.etag
            },
            success: function (successdata) {
                successFunction(successdata);
            },
            error: function (faildata) {
                failureFunction(faildata);
            }
        });
    }, function (data) {
        console.log(data);
    });
}

/*---------------------------------------------------------------------------------------------------*/
// occurs when a user clicks the delete button
function Delete() {
    var listName = "MyList";
    var url = _spPageContextInfo.webAbsoluteUrl;
    var itemId = "1"; // Update Item ID here
    deleteListItem(itemId, listName, url, function () {
        alert("Item deleted successfully");
    }, function () {
        alert("Ooops, an error occured. Please try again");
    });
}
/*---------------------------------------------------------------------------------------------------*/ 
// Delete Operation
// itemId: the id of the item to delete
// listName: The name of the list you want to delete the item from
// siteurl: The url of the site that the list is in. 
// success: The function to execute if the call is sucesfull
// failure: The function to execute if the call fails
function deleteListItem(itemId, listName, siteUrl, success, failure) {
    getListItemWithId(itemId, listName, siteUrl, function (data) {
        $.ajax({
            url: data.__metadata.uri,
            type: "POST",
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-Http-Method": "DELETE",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "If-Match": data.__metadata.etag
            },
            success: function (data) {
                success(data);
            },
            error: function (data) {
                failure(data);
            }
        });
    },
   function (data) {
       failure(data);
   });
}
/*---------------------------------------------------------------------------------------------------*/
function DelListItems(itemId, listName, siteurl, success, failure) {
    //GetByTitle('ListTitle')/items?$select=*&exclude=Title
    var searchURL  = siteurl + "/_api/web/lists/getbytitle('" + listName + "')/items('" + itemId + "')";    
    //console.log(searchURL);
    $.ajax({
        url: searchURL ,
        type: "POST",
            headers: {
                "Accept": "application/json;odata=verbose",
                "X-Http-Method": "DELETE",
                "X-RequestDigest": $("#__REQUESTDIGEST").val(),
                "If-Match": "*"        
        },
        success: function (data) {
            success(data);
        },
        error: function (data) {
            failure(data);
        }
    });
}

/*---------------------------------------------------------------------------------------------------*/
function tableRowsToJSON (tableSelector, ignoreRows) {
      var item, attr, cleanAttrdata, _JSON = [];
     
      $( 'tr', tableSelector).each(function(index, tr) {
        item = {};
        console.log(index);
        
        if (index>(ignoreRows-1))
        {
	        $('td', $(this)).each(function(index, td) {
	          attr = $(td).find("input").attr('id');
	          
	          if (attr != undefined && attr != null) {
	            cleanAttr = attr.split('_')[0].substring(3);
	            data = $("#"+attr).val();
	            item[cleanAttr] = data;
	          }
	        });
	        if(!$.isEmptyObject(item))
	        {
	        	console.log(item);
	        	_JSON.push(item);
	        }	
        }
      });
      return _JSON;
    }

  
  Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}
/*---------------------------------------------------------------------------------------------------*/
function tableToJSONTXT(tableSelector)
{
	var item, attr, cleanAttrdata, _JSON = [];
	
	
	$(tableSelector + " tr input").each(function(index, its){
		 item = {};
		 var cleanAttr = this.id;
		 cleanAttr = cleanAttr.split('_')[0].substring(3)
		 data = $(this).val();		 
	     item[cleanAttr] = data;
	     //console.log(data);
	     if(!$.isEmptyObject(item))
	     {
	       	//console.log(item);
	       	_JSON.push(item);
	     }		     
	});	
	return _JSON;
}
/*---------------------------------------------------------------------------------------------------*/
function tableRowsToJSONTXT(tableSelector, ignoreRows) {
      var item, attr, cleanAttr, _JSON = [];
     
     $( 'tr', tableSelector).each(function(index, tr) {
        item = {};
        //console.log(index);
        
        if (index >(ignoreRows-1))
        {
	        $('td', $(this)).each(function(index, td) {
	          attr = $(td).find("textarea").attr('id');
	          
	          if (attr != undefined && attr != null) {
	            cleanAttr = attr.split('_')[0].substring(3);
	            data = $("#"+attr).val();
	            item[cleanAttr] = data;
	            //console.log(data);
	          }
	        });
	        if(!$.isEmptyObject(item))
	        {
	        	console.log(item);
	        	_JSON.push(item);
	        }	
        }
        
      });
      return _JSON;
    }
  
    Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

/*---------------------------------------------------------------------------------------------------*/

function GetCurrentDateTime(){

 var d = new Date,
        dformat = [ (d.getMonth()+1).padLeft(),
                    d.getDate().padLeft(),
                    d.getFullYear()].join('/')+
                    ' ' +
                  [ d.getHours().padLeft(),
                    d.getMinutes().padLeft(),
                    d.getSeconds().padLeft()].join(':');
                    
                    return dformat;
                    
            }
            
            
/*---------------------------------------------------------------------------------------------------*/            
function chatBoxToJSON (selector) {
   var item, attr, cleanAttrdata, _JSON = [];
   console.log("chatBoxToJSON ");
      $( '.item', selector).each(function(index, divItem) {
        item = {};
        console.log(index);
        
       
          item.UserLogin = $(divItem).find("img").attr('alt');
          item.UserTitle = $(divItem).find("usertitle").text();
          item.Text = $(divItem).find("span").text();
		  item.CreatedOn = $(divItem).find("small").text().trim();
		  if ($(divItem).find(".review-section").html())
		  item.Section =  $(divItem).find(".review-section").html().trim();
		
        
        console.log(item);
        _JSON.push(item);
        
      });
   return _JSON;
}
            
/*---------------------------------------------------------------------------------------------------*/            
function getDataWithCaml(url, listName, caml, callback) {
    var endpoint = url + "/_api/web/lists/GetByTitle('"
        + listName + "')/GetItems";
    var requestData = { "query" :  {"__metadata": { "type": "SP.CamlQuery" }, "ViewXml": caml } };
    jQuery.ajax({
        url: endpoint,
        method: "POST",
        data: JSON.stringify(requestData),
        headers: {
            "X-RequestDigest": $("#__REQUESTDIGEST").val(),
            "Accept": "application/json; odata=verbose",
            "Content-Type": "application/json; odata=verbose"
        },
		success: function (data) {
		callback(data);
		},
		error: function (error) {
		console.log(error);
		}
    });
}
/*---------------------------------------------------------------------------------------------------*/

function GetJsonTemplate(siteurl, formmName,success, failure)
{
	//https://worxonline.sharepoint.com/sites/councillor/_api/web/lists/getbytitle('FormHtmlTemplate')/items?$filter=Title+eq+%27ExpenseForm%27
	var criteria = "Title eq '" + formmName + "'";
	var searchURL  = siteurl + "/_api/web/lists/getbytitle('FormHtmlTemplate')/items?$select=Title,JsonData&$filter=" +criteria;
    																																		
    console.log(searchURL);
    $.ajax({
        url: searchURL ,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            success(data);
        },
        error: function (data) {
            failure(data);
        }
    });
}
/*---------------------------------------------------------------------------------------------------*/
function GetEmailTemplate(siteurl, formmName,success, failure)
{
	//https://worxonline.sharepoint.com/sites/councillor/_api/web/lists/getbytitle('FormHtmlTemplate')/items?$filter=Title+eq+%27ExpenseForm%27
	var criteria = "Title eq '" + formmName + "'";		
	
	var searchURL  = siteurl + "/_api/web/lists/getbytitle('FormHtmlTemplate')/items?$select=Title,BodyEmail,CcEmail,ToExternalEmail,FromEmail,SubjectEmail,ToEmailGroup/ID&$expand=ToEmailGroup&$filter=" +criteria;
    																																		
    //console.log(searchURL);
    $.ajax({
        url: searchURL ,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            success(data);
        },
        error: function (data) {
            failure(data);
        }
    });
}
/*---------------------------------------------------------------------------------------------------*/
function GetNotiTemplate(siteurl, formmName,success, failure)
{
	//https://worxonline.sharepoint.com/sites/councillor/_api/web/lists/getbytitle('FormHtmlTemplate')/items?$filter=Title+eq+%27ExpenseForm%27
	var criteria = "ListName eq '" + formmName + "'";		
	
	var searchURL  = siteurl + "/_api/web/lists/getbytitle('Notifications')/items?$select=ListName,Title,BodyEmail,CcEmail,ToExternalEmail,FromEmail,SubjectEmail,MailSent,ToEmailGroup/ID&$expand=ToEmailGroup&$filter=" +criteria;
    																																		
    //console.log(searchURL);
    $.ajax({
        url: searchURL ,
        method: "GET",
        headers: { "Accept": "application/json; odata=verbose" },
        success: function (data) {
            success(data);
        },
        error: function (data) {
            failure(data);
        }
    });
}
/*---------------------------------------------------------------------------------------------------*/

function PrepareFromDateSearch(d) {
var dateParts = d.split('/');
return dateParts[2]+ "-" + dateParts[1]+ "-"  + dateParts[0] + "T00:00:00.000Z";
}
/*---------------------------------------------------------------------------------------------------*/
function PrepareToDateSearch(d) {
var dateParts = d.split('/');
return dateParts[2]+ "-" + dateParts[1]+ "-"  + dateParts[0] + "T23:59:59.000Z";
}
/*---------------------------------------------------------------------------------------------------*/
function GetAccountName(displayName, url){
	var accountName;
	url = _spPageContextInfo.webAbsoluteUrl;
	var requestUri = url +
				  "/_api/web/siteusers?$select=*&$filter=Title eq '"+displayName+"'";
				  
	//execute AJAX request
	$.ajax({
		url: requestUri,
		type: "GET",
		headers: { "ACCEPT": "application/json;odata=verbose" },
		async: false,
		success: function (data) {
			if(data.d.results.length>0){
				accountName = { Name: data.d.results[0].Title,
				                Id: data.d.results[0].Id,
				                login:data.d.results[0].LoginName
				              }
				console.log(data.d.results);
			}
			
		},
		error: function () {
			//alert("Failed to get details");                
		}
	});
	return accountName;
}
/*--------------------------------------------------------------------------------------*/
function GetAllUser(success, failure){
	var accountName;
	var url = "https://georgesriver-my.sharepoint.com";//_spPageContextInfo.webAbsoluteUrl;
	//https://{tenantName}-my.sharepoint.com/_api/Web/siteusers
	var requestUri = url + "/_api/Web/siteusers?$select=*&$top=1000";
				  
	//execute AJAX request
	$.ajax({
		url: requestUri,
		type: "GET",
		headers: { "ACCEPT": "application/json;odata=verbose" },
		async: false,		
      	success: function (data) {
            success(data);
        },
        error: function (data) {
            failure(data);
        }
	});
	
}

/*--------------------------------------------------------------------------------------*/
function GetDisplayName(id, url){
	var accountName;
	var requestUri = url + "/_api/web/siteusers?$select=*&$filter=Id eq "+id;
				  
	//execute AJAX request
	$.ajax({
		url: requestUri,
		type: "GET",
		headers: { "ACCEPT": "application/json;odata=verbose" },
		async: false,
		success: function (data) {
		//console.log(data);

			if(data.d.results.length>0){
				accountName = data.d.results[0].Title
				//console.log(accountName);
			}
			
		},
		error: function () {
			//alert("Failed to get details");                
		}
	});
	return accountName;
}
/*---------------------------------------------------------------------------------------------------*/
function GetName(id){
	var accountName = {};
	var url = _spPageContextInfo.webAbsoluteUrl;
	var requestUri = url + "/_api/web/siteusers?$select=*&$filter=Id eq "+id;
	//url + "/_api/web/siteusers?$select=*&$filter=Id eq "+id;
				  
	//execute AJAX request
	$.ajax({
		url: requestUri,
		type: "GET",
		headers: { "ACCEPT": "application/json;odata=verbose" },
		async: false,
		success: function (data) {
		console.log(data.d.results);

			if(data.d.results.length>0){
				accountName = { Name: data.d.results[0].Title,
				                login: data.d.results[0].LoginName,				                
				                Email:data.d.results[0].Email
				               };

				//console.log(data.d.results[0]);
			}
			
		},
		error: function () {
			//alert("Failed to get details"); 
			console.log("Get Name Data Failed: ");               
		}
	});
	return accountName;
}
/*---------------------------------------------------------------------------------------------------*/
/*
  This operation is where we trying to identifying the user by their login name given
*/
function GetUserByLogin(login){
//https://georgesriver.sharepoint.com/sites/rivernet/_api/web/siteusers(@v)?@v='i%3A0%23.f%7Cmembership%7Csmclean%40georgesriver.nsw.gov.au'
   	var trimLogin = login.replace("i:0#.f|","i%3A0%23.f%7C");
   	trimLogin = trimLogin.replace("@","%40");
   	trimLogin = trimLogin.replace("|","%7C");   	
   	var requestUri = "https://georgesriver.sharepoint.com/sites/rivernet/_api/web/siteusers(@v)?@v='"+trimLogin +"'";
   	
   	//console.log(requestUri);
	var accountName = {};
	//execute AJAX request
	$.ajax({
		url: requestUri,
		type: "GET",
		headers: { "ACCEPT": "application/json;odata=verbose" },
		async: false,
		success: function (data) {
			accountName = { 
					name: data.d.Title,
				        id: data.d.Id,
				        login: data.d.LoginName,
				        Email: data.d.Email				                
				       };
			console.log(accountName);
			
		},
		error: function () {
			console.log("Get User Data Failed for : "+login);  			             
		}
	});
	return accountName;
}
/*---------------------------------------------------------------------------------------------------*/
function GetUserProfileByLogin(login){
//https://georgesriver.sharepoint.com/sites/rivernet/_api/web/siteusers(@v)?@v='i%3A0%23.f%7Cmembership%7Csmclean%40georgesriver.nsw.gov.au'
   	var trimLogin = login.replace("i:0#.f|","i%3A0%23.f%7C");
   	trimLogin = trimLogin.replace("@","%40");
   	trimLogin = trimLogin.replace("|","%7C");   	
   	var requestUri = "https://georgesriver.sharepoint.com/sites/rivernet/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='"+trimLogin +"'";
   	
   	//console.log(requestUri);
	var accountName = "";
	//execute AJAX request
	$.ajax({
		url: requestUri,
		type: "GET",
		headers: { "ACCEPT": "application/json;odata=verbose" },
		async: false,
		success: function (data) {
			accountName = data.d;//{ Name: data.d.Title,
				                //Id: data.d.Id};
			console.log(data);
			
		},
		error: function () {
			console.log("Get User Profile Data Failed for : "+login);               
		}
	});
	return accountName;
}

/*---------------------------------------------------------------------------------------------------*/
/*
   This operation used for search entire organisation on sharepoint
   USAGE:
	$('#txtRequesterName').autocomplete({
  		source: search,
  		minLength: 3,
  		select: function(event, data){
  			var sdata = data.item;
  			console.log(sdata);
  			$('#txtRequesterName').val(sdata.value);
  			$('#RequesterID').val(sdata.Id);
  		}
	});

   
*/

function search(request,response) {
 //var appweburl = decodeURIComponent(getQueryStringParameter('SPAppWebUrl'));
 //var hostweburl = decodeURIComponent(getQueryStringParameter('SPHostUrl'));
 var serverUrl = _spPageContextInfo.webAbsoluteUrl;
 var restSource = serverUrl+ "/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser";
 // var principalType = this.element[0].getAttribute('principalType');
 $.ajax(
 {
  'url':restSource,
  'method':'POST',
  'data':JSON.stringify({
   'queryParams':{
    '__metadata':{
     'type':'SP.UI.ApplicationPages.ClientPeoplePickerQueryParameters'
    },
    'AllowEmailAddresses':true,
    'AllowMultipleEntities':false,
    'AllUrlZones':false,
    'MaximumEntitySuggestions':50,
    'PrincipalSource':1,
    'PrincipalType': 15,
    'QueryString':request.term
   }
  }),
  'headers':{
   'accept':'application/json;odata=verbose',
   'content-type':'application/json;odata=verbose',
   'X-RequestDigest':$("#__REQUESTDIGEST").val()
  },
  'success':function (data) {
   var d = data;
   

   var results = JSON.parse(data.d.ClientPeoplePickerSearchUser);
   if (results.length > 0) {
    	response($.map(results, function (item) {
     
     console.log(item);
    	 return {
	     			label:item.DisplayText,
	     			value:item.DisplayText,
	     			Id:item.EntityData.SPUserID,
	     			login:item.Description,
	     			Position:item.EntityData.Title,
	     			Department:item.EntityData.Department,
	     			Email:item.EntityData.Email
       			}
    	}));
   }
  },
  'error':function (err) {
   alert("search:"+JSON.stringify(err));
  }
 });  
}
/*---------------------------------------------------------------------------------------------------*/
function getDayofweek(day)
{
	var weekday = new Array(7);
		weekday[0] =  "Sunday";
		weekday[1] = "Monday";
		weekday[2] = "Tuesday";
		weekday[3] = "Wednesday";
		weekday[4] = "Thursday";
		weekday[5] = "Friday";
		weekday[6] = "Saturday";
	return weekday[day.getDay()];		
}
/*---------------------------------------------------------------------------------------------------*/
function padzero(str, max) {
  str = str.toString();
  return str.length < max ? padzero("0" + str, max) : str;
}
/*---------------------------------------------------------------------------------------------------*/
/*
    This operation is used for creating html option list value from an Object Array.
*/
function LoadComboJSON(data,jqControl,code,title,defaultValue){
	jqControl.empty();
	jqControl.append("<option value=''>Select..</option>");
	
	$.each(data, function (key, item) {
	    jqControl.append("<option value='" + item[code] + "' >" + item[title] + "</option>");
	});
	
	if (defaultValue!=null){
		jqControl.val(defaultValue);
	}

} 
/*---------------------------------------------------------------------------------------------------*/
//Send Mail directly from the script instead of using workflow.
/*
    Note: this API Email sender does not have capability for file Attachment.
*/
function SendEmail(from, to, body, subject) {

	
	var siteurl = _spPageContextInfo.webServerRelativeUrl;

	var urlTemplate = siteurl + "/_api/SP.Utilities.Utility.SendEmail";
	$.ajax({
	   contentType: 'application/json',
	   url: urlTemplate,
	   type: "POST",
	   data: JSON.stringify({
	       'properties': {
	           '__metadata': { 'type': 'SP.Utilities.EmailProperties' },
	           'From': from,
	           'To': { 'results': [to] },
	           'Body': body,
	           'Subject': subject
	       }
	   }
	 ),
	   headers: {
	       "Accept": "application/json;odata=verbose",
	       "content-type": "application/json;odata=verbose",
	       "X-RequestDigest": $("#__REQUESTDIGEST").val()
	   },
	   success: function (data) {
	    	console.log("email sent successfully from portal");
	   },
	   error: function (err) {				    
       		console.log(err.responseText);
	   }
	});
}
/*---------------------------------------------------------------------------------------------------*/
function isValidEmailAddress(emailAddress) {
    var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    return pattern.test(emailAddress);
}
/*---------------------------------------------------------------------------------------------------*/
function searchDir(request, response) {
 //var appweburl = decodeURIComponent(getQueryStringParameter('SPAppWebUrl'));
 //var hostweburl = decodeURIComponent(getQueryStringParameter('SPHostUrl'));
 var serverUrl = _spPageContextInfo.webAbsoluteUrl;
 var restSource = serverUrl+ "/_api/SP.UI.ApplicationPages.ClientPeoplePickerWebServiceInterface.clientPeoplePickerSearchUser";
 // var principalType = this.element[0].getAttribute('principalType');
 $.ajax(
 {
  'url':restSource,
  'method':'POST',
  'data':JSON.stringify({
   'queryParams':{
    '__metadata':{
     'type':'SP.UI.ApplicationPages.ClientPeoplePickerQueryParameters'
    },
    'AllowEmailAddresses':true,
    'AllowMultipleEntities':false,
    'AllUrlZones':false,
    'MaximumEntitySuggestions':50,
    'PrincipalSource':1,
    'PrincipalType': 15,
    'QueryString':request.term
   }
  }),
  'headers':{
   'accept':'application/json;odata=verbose',
   'content-type':'application/json;odata=verbose',
   'X-RequestDigest':$("#__REQUESTDIGEST").val()
  },
  'success':function (data) {
   var d = data;
   

   var results = JSON.parse(data.d.ClientPeoplePickerSearchUser);
   if (results.length > 0) {
    	response($.map(results, function (item) {     
         //console.log(item);
         
		         	if(item.EntityData.Title){
		            	if(item.EntityData.Title.includes('Director')){
			    	 		return {
				     			label:item.DisplayText,
				     			value:item.DisplayText,
				     			Id:item.EntityData.SPUserID,
				     			login:item.Description,
				     			Position:item.EntityData.Title,
				     			Department:item.EntityData.Department,
				     			Email:item.EntityData.Email
			       			}
		       			}
		       		}         		


    	}));
    	
   }
  },
  'error':function (err) {
   alert("search:"+JSON.stringify(err));
  }
 });  
}
/*---------------------------------------------------------------------------------------------------*/
