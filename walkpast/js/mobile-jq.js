// Start with the map page
//window.location.replace(window.location.href.split("#")[0] + "#mappage");



$("#plus").live('click', function(){
    map.zoomIn();
});

$("#minus").live('click', function(){
    map.zoomOut();
});

$('#mappage').live('pageshow',function (){
    fixContentHeight();
});

//$(window).bind("orientationchange resize pageshow", fixContentHeight);

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
        initLayerList();
    }
}

function initLayerList() {
    $('#layerspage').page();
    $('<li>', {
            "data-role": "list-divider",
            text: "Base Layers"
        })
        .appendTo('#layerslist');
    var baseLayers = map.getLayersBy("isBaseLayer", true);
    $.each(baseLayers, function() {
        addLayerToList(this);
    });

    $('<li>', {
            "data-role": "list-divider",
            text: "Overlay Layers"
        })
        .appendTo('#layerslist');
    var overlayLayers = map.getLayersBy("isBaseLayer", false);
    $.each(overlayLayers, function() {
        addLayerToList(this);
    });
    $('#layerslist').listview('refresh');
    
    map.events.register("addlayer", this, function(e) {
        addLayerToList(e.layer);
    });
}