var HOST_URL = 'http://open.mapquestapi.com';

var SAMPLE_POST = HOST_URL + '/nominatim/v1/search.php?format=json&json_callback=renderBasicSearchNarrative';
var searchType = '';


function showBasicSearchURL() {
    var safe = SAMPLE_POST + "&q=westminster+abbey";
    document.getElementById('divBasicSearchUrl').innerHTML = safe.replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

function doBasicSearchClick() {
	searchType = "helloworld";
    var newURL = SAMPLE_POST + "&q=westminster+abbey";
	var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = newURL;
    document.body.appendChild(script);
};

function renderBasicSearchNarrative(response) {
     var html = '';
    var i = 0;
    var j = 0;
	
	if(response){
		html += '<table><tr><th colspan="5">Search Results</th></tr>'
		html += '<tr><td><b>#</b></td><td><b>Type</b></td><td style="min-width:150px;"><b>Name</b></td><td><b>Lat/Long</b></td><td><b>Fields</b></td></tr>';
		html += '<tbody>'
		
		for(var i =0; i < response.length; i++){
			var result = response[i];
			var resultNum = i+1;			
			
			html += "<tr valign=\"top\">";
			html += "<td>" + resultNum + "</td>";
			html += "<td>" + result.type + "</td>";
			
			html += "<td>";
			if(result.display_name){
				var new_display_name = result.display_name.replace(/,/g, ",<br />")
				html += new_display_name;				
			}
			html += "</td>";
			
			html += "<td>" + result.lat + ", " + result.lon + "</td>";
			
			html += "<td>"
			if(result){
				for (var obj in result){
					var f = result[obj];
					html += "<b>" + obj + ":</b> " + f + "<br/>";					
				}
			}
			html += "</td></tr>";
		}		
		html += '</tbody></table>';
	}
	
    
    switch (searchType) {
		case "helloworld":
			document.getElementById('divBasicSearchResults').style.display = "";
			document.getElementById('divBasicSearchResults').innerHTML = html;
			break;
	}
}

function collapseResults(type) {
	switch(type) {
		case "helloworld":
			document.getElementById('divBasicSearchResults').style.display = "none";
			break;
	}
}