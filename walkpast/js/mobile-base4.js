
// API key for http://openlayers.org. Please get your own at
// http://bingmapsportal.com/ and use that instead.
var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

// initialize map when page ready
var map;
var gg = new OpenLayers.Projection("EPSG:4326");
var sm = new OpenLayers.Projection("EPSG:900913");
//var lon = 77.25;
//var lat = 28.54;
var zoom = 15;
var lat = 28.60013;
var lon = 77.22695;
var geojson_layer;

var init = function (onSelectFeatureFunction) {
    var context = {
        getColour: function(feature) {
            return feature.attributes["colour"];
        }
    };

    var template = {
        fillOpacity: 0.9,
        strokeColor: "#555555",
        strokeWidth: 1,
        fillColor: "${getColour}"
    };

    var style = new OpenLayers.Style(template, {context: context});
    var styleMap = new OpenLayers.StyleMap({'default': style});

            map = new OpenLayers.Map('map', {
                units: 'm',
                numZoomLevels: 19,
                controls: [],                  
                projection: sm,
                displayProjection: gg,
            });

            

            var lay_osm = new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize',
                tileOptions: {crossOriginKeyword: null},
            });

            geojson_layer = new OpenLayers.Layer.Vector("Indoor_Layer", {
                projection: gg,
                strategies: [new OpenLayers.Strategy.Fixed()],
                styleMap: styleMap,
                protocol: new OpenLayers.Protocol.HTTP({
                    url: "khanM_shops_level0_copy_2.osm",
                    format: new OpenLayers.Format.OSM(),
                })
            });
       
            map.addLayers([lay_osm, geojson_layer]);

            map.setCenter(new OpenLayers.LonLat(lon, lat).transform(gg, sm), zoom);

            map.addControl(new OpenLayers.Control.Attribution());
            map.addControl(new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }));

            var options = {
                hover: false,
                onSelect: serialize
            };

            var select = new OpenLayers.Control.SelectFeature(geojson_layer, options);
            map.addControl(select);
            select.activate();
  
    
};

function serialize() {
    $("#popupPanel").popup("close");
    var Msg = geojson_layer.selectedFeatures[0].attributes["name"] + ": ";
    Msg    += geojson_layer.selectedFeatures[0].attributes["value"];
    $("#popupPanelName").innerHTML = Msg;
    $("#popupPanel").popup("open");
    //document.getElementById("info").innerHTML = Msg;
}
