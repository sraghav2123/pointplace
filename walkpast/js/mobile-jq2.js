// Start with the map page
window.location.replace(window.location.href.split("#")[0] + "#mappage");

var selectedFeature = null;

// fix height of content
function fixContentHeight() {
    var footer = $("div[data-role='footer']:visible"),
        content = $("div[data-role='content']:visible:visible"),
        viewHeight = $(window).height(),
        contentHeight = viewHeight - footer.outerHeight();

    if ((content.outerHeight() + footer.outerHeight()) !== viewHeight) {
        contentHeight -= (content.outerHeight() - content.height() + 1);
        content.height(contentHeight);
    }

    if (window.map && window.map instanceof OpenLayers.Map) {
        map.updateSize();
    } else {
        // initialize map
        init(function(feature) { 
            selectedFeature = feature; 
            $.mobile.changePage("#popup", "pop"); 
        });
        //initLayerList();
    }
}

// one-time initialisation of button handlers 

$("#plus").live('click', function(){
    map.zoomIn();
});

$("#minus").live('click', function(){
    map.zoomOut();
});


//fix the content height AFTER jQuery Mobile has rendered the map page
$('#mappage').live('pageshow',function (){
    fixContentHeight();
});

$(window).bind("orientationchange resize pageshow", fixContentHeight);    

$('#popup').live('pageshow',function(event, ui){
    var li = "";
    for(var attr in selectedFeature.attributes){
        li += "<li><div style='width:25%;float:left'>" + attr + "</div><div style='width:75%;float:right'>" 
        + selectedFeature.attributes[attr] + "</div></li>";
    }
    $("ul#details-list").empty().append(li).listview("refresh");
});

$('#searchpage').live('pageshow',function(event, ui){
    $('#query').bind('change', function(e){
        $('#search_results').empty();
        if ($('#query')[0].value === '') {
            return;
        }
        $.mobile.showPageLoadingMsg();

        // Prevent form send
        e.preventDefault();

        var searchUrl = 'http://open.mapquestapi.com/nominatim/v1/search.php?format=json&=westminster+abbey&q=';
        searchUrl += $('#query')[0].value;
        //searchUrl += '&callback=?';

        $.getJSON(searchUrl, function(data) {
            alert("success");
            $.each(data, function() {
                var place = this;
                $('<li>')
                    .hide()
                    .append($('<h2 />', {
                        text: place.display_name
                    }))
                    .append($('<p />', {
                        html: '<b>' + place.countryName + '</b> ' + place.fcodeName
                    }))
                    .appendTo('#search_results')
                    .click(function() {
                        $.mobile.changePage('#mappage');
                        var lonlat = new OpenLayers.LonLat(place.lon, place.lat);
                        map.setCenter(lonlat.transform(gg, sm), 15);
                    })
                    .show();
            });
            $('#search_results').listview('refresh');
            $.mobile.hidePageLoadingMsg();
        });
    });
    // only listen to the first event triggered
    $('#searchpage').die('pageshow', arguments.callee);
});

$( "#popupPanel" ).live({
    popupbeforeposition: function() {
        var h = $( window ).width();

        $( "#popupPanel" ).css( "width", h );
    }
});
