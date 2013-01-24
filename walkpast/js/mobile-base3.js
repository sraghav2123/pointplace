
// API key for http://openlayers.org. Please get your own at
// http://bingmapsportal.com/ and use that instead.
var apiKey = "AqTGBsziZHIJYYxgivLBf0hVdrAk9mWO5cQcb8Yux8sW5M8c8opEC2lZqKR1ZZXf";

// initialize map when page ready
var map;
var gg = new OpenLayers.Projection("EPSG:4326");
var sm = new OpenLayers.Projection("EPSG:900913");

var init = function (onSelectFeatureFunction) {


  
    // create map
    map = new OpenLayers.Map({
        div: "map",
        units: 'm',
        projection: sm,
        numZoomLevels: 18,
        controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            })
        ],
        // layers: [          
        //     new OpenLayers.Layer.OSM("OpenStreetMap", null, {
        //         transitionEffect: 'resize',
        //         tileOptions: {crossOriginKeyword: null},
        //     }),
        //     // new OpenLayers.Layer.Vector("Polygon", {
        //     //     strategies: [new OpenLayers.Strategy.Fixed()],
        //     //     protocol: new OpenLayers.Protocol.HTTP({
        //     //         url: "exm.osm",   //<-- relative or absolute URL to your .osm file
        //     //         format: new OpenLayers.Format.OSM()
        //     //     }),
        //     //     projection: new OpenLayers.Projection("EPSG:4326"),
        //     //     tileOptions: {crossOriginKeyword: null}
        //     // }),
            
        //     // new OpenLayers.Layer.Vector("Lines", {
        //     //     strategies: [new OpenLayers.Strategy.Fixed()],                
        //     //     protocol: new OpenLayers.Protocol.HTTP({
        //     //         url: "https://localhost:8080/home/sraghav/work/walkpast/nehru.json",
        //     //         format: new OpenLayers.Format.GeoJSON()
        //     //     }),
        //     // })
        // ],
        center: new OpenLayers.LonLat(0, 0),
        zoom: 1
    });

    var osm_layer = new OpenLayers.Layer.OSM("OpenStreetMap", null, {
                transitionEffect: 'resize',
                tileOptions: {crossOriginKeyword: null},
            });
    
    var geojson_format = new OpenLayers.Format.GeoJSON({
        'internalProjection': gg,
        'externalProjection': sm
    });

    geojson_layer = new OpenLayers.Layer.Vector("GeoJSON", {
        transitionEffect: 'resize',
        units: 'm',
        projection: gg,
        visibility: true,
        isBaseLayer: false,
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "./lines.geojson",
            format: geojson_format
        })
    });
 
    map.addLayers([ osm_layer, geojson_layer]);
    //geojson_layer.setVisibiltiy(true);

    // vectorLayer = new OpenLayers.Layer.Vector("MyLayer");
    // map.addLayer(vectorLayer);

    // function handler(request) {

    //     var geojson_format = new OpenLayers.Format.GeoJSON({
    //         'internalProjection': gg,
    //         'externalProjection': sm
    //     });

    //     vectorLayer.addFeatures(geojson_format.read(request.responseText));
    // }

    // var request = OpenLayers.Request.GET({
    //     url: "file:///home/sraghav/work/walkpast/nehru.json?callback=handler",
    // });
    
    // var vector_format = new OpenLayers.Format.GeoJSON({
    //     'internalProjection': gg,
    //     'externalProjection': sm
    // }); 
    // var vector_protocol = new OpenLayers.Protocol.HTTP({
    //     url: 'http://localhost/sraghav/walkpast/test.json',
    //     format: vector_format
    // });
    // var vector_strategies = [new OpenLayers.Strategy.Fixed()];
    // var vector_layer = new OpenLayers.Layer.Vector('More Advanced Vector Layer',{
    //     protocol: vector_protocol,
    //     strategies: vector_strategies,
    //     isBaseLayer: false,
    //     styleMap: new OpenLayers.StyleMap({
    //         externalGraphic: "img/bhudda4.png",
    //         graphicOpacity: 1.0,
    //         graphicWidth: 16,
    //         graphicHeight: 26,
    //         graphicYOffset: -26
    //     })
    // });

    // //vector_layer.setVisibiltiy(true);

    // map.addLayer(vector_layer);





    // var vector_strategies = [new OpenLayers.Strategy.Fixed()];
    // var vectors = new OpenLayers.Layer.Vector('More Advanced Vector Layer',{
    //     strategies: vector_strategies,
    //     isBaseLayer: false,
    //     tileOptions: {crossOriginKeyword: null},
    //     visibility: true,
    //     styleMap: new OpenLayers.StyleMap({
    //         externalGraphic: "img/bhudda4.png",
    //         graphicOpacity: 1.0,
    //         graphicWidth: 16,
    //         graphicHeight: 26,
    //         graphicYOffset: -26
    //     })
    // });
       
    // var geojson_format = new OpenLayers.Format.GeoJSON({
    //     'internalProjection': gg,
    //     'externalProjection': sm
    // });

    // $.getJSON("http://localhost/sraghav/walkpast/test.json", function(data) {
    //             //alert("sucess");


               
    //             var features = geojson_format.read(data, "FeatureCollection");

    //             //vectors.addFeatures requires an array, thus
    //             if(features.constructor != Array) {
    //                 features = [features];
    //             }

               
    //             vectors.addFeatures(features);
               
    //             //map.addLayer(vector_layer);
    // });
    // map.addLayer(vectors);
    //vectors.setVisibiltiy(true);
    

};
