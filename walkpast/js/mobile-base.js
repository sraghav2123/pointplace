// API key for http://openlayers.org. Please get your own at
// http://bingmapsportal.com/ and use that instead.
var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

    var map;
    var lat=50.8467493;
    var lon=4.3524950;
    var zoom=11;

    function init() {
        map = new OpenLayers.Map('map_element', {
            div: "map"
            maxResolution: 156543.0399,
            numZoomLevels: 16,
            theme: null,
            units: 'm',
            projection: new OpenLayers.Projection("EPSG:900913"),
            displayProjection: new OpenLayers.Projection("EPSG:4326")});

        var osm_layer = new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize',
                tileOptions: {crossOriginKeyword: null},
            });

        //Initialise the vector layer using OpenLayers.Format.OSM
        var pois_layer = new OpenLayers.Layer.Vector("Brussels POIs", {
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                url: "exm.osm",   
                format: new OpenLayers.Format.OSM({
                    getNodes: function(doc) {
                        var node_list = doc.getElementsByTagName("node");
                        var nodes = {};
                        for (var i = 0; i < node_list.length; i++) {
                            var node = node_list[i];
                            if(node.getAttribute("visible")) {
                                var id = node.getAttribute("id");
                                nodes[id] = {
                                    'lat': node.getAttribute("lat"),
                                    'lon': node.getAttribute("lon"),
                                    'node': node
                                };
                            }
                        }
                        return nodes;
                    },
                })
                }),
                projection: new OpenLayers.Projection("EPSG:4326"),
                tileOptions: {crossOriginKeyword: null}
            });

        map.addLayers([osm_layer, pois_layer]);
        map.addControls([new OpenLayers.Control.LayerSwitcher({})]);

        var lonLat = new OpenLayers.LonLat(lon, lat).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
        map.setCenter (lonLat, zoom);
    }