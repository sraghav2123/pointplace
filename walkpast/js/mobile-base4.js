
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


var mapXmlData = null;
var building_id = '-502';
var floors;

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

            
            

            var level_layer_0 = new OpenLayers.Layer.Vector("Indoor_Level_0", {
                projection: gg,
                strategies: [new OpenLayers.Strategy.Fixed()],
                protocol: new OpenLayers.Protocol.HTTP({
                    url: "khanM_shops2.xml",
                    format:  new OpenLayers.Format.Indoor({
                        building_id: building_id,
                        floor_id: '0',
                    }),
                })
            });

            var level_layer_1 = new OpenLayers.Layer.Vector("Indoor_Level_0", {
                projection: gg,
                strategies: [new OpenLayers.Strategy.Fixed()],
                protocol: new OpenLayers.Protocol.HTTP({
                    url: "khanM_shops2.xml",
                    format:  new OpenLayers.Format.Indoor({
                        building_id: building_id,
                        floor_id: '1',
                    }),
                }),
                visibility: false,
            });

            map.addLayers([lay_osm, level_layer_0, level_layer_1]);


            map.addLayer(lay_osm);
            map.setCenter(new OpenLayers.LonLat(lon, lat).transform(gg, sm), zoom);

            map.addControl(new OpenLayers.Control.Attribution());
            map.addControl(new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    enableKinetic: true
                }
            }));


            var panel = new OpenLayers.Control.Panel({
                createControlMarkup: function(control) {
                    var button = document.createElement('button'),
                        iconSpan = document.createElement('span'),
                        textSpan = document.createElement('span');
                    iconSpan.innerHTML = '&nbsp;';
                    button.appendChild(iconSpan);
                    if (control.text) {
                        textSpan.innerHTML = control.text;
                    }
                    button.appendChild(textSpan);
                    return button;
                }
            });

            var floors = 2;;
            for (var i=0; i < floors; i++){
                panel.addControls(new OpenLayers.Control.Button({
                    text: i.toString(),
                    displayClass: 'levelControlButton',
                    trigger: levelControlfunc,
                }));
                
            }
            //panel.addControls(sel_levelbuttons);
            map.addControl(panel);

};

function levelControlfunc() {
    var floor = parseInt(this.text);
    floor++;
    for(var i=1; i < map.layers.length; i++){
        map.layers[i].setVisibility(false);
    }
    map.layers[floor].setVisibility(true);
}
// function serialize() {
//     $("#popupPanel").popup("close");
//     var Msg = geojson_layer.selectedFeatures[0].attributes["name"] + ": ";
//     Msg    += geojson_layer.selectedFeatures[0].attributes["value"];
//     $("#popupPanelName").innerHTML = Msg;
//     $("#popupPanel").popup("open");
//     //document.getElementById("info").innerHTML = Msg;
// }








OpenLayers.Format.Indoor = OpenLayers.Class(OpenLayers.Format.XML, {
    
    
    checkTags: false,
    interestingTagsExclude: null, 
    areaTags: null, 
    floor_id: null,
    building_id: null,
  
    initialize: function(options) {
        var layer_defaults = {
          'interestingTagsExclude': ['source', 'source_ref', 
              'source:ref', 'history', 'attribution', 'created_by'],
          'areaTags': ['area', 'building', 'leisure', 'tourism', 'ruins',
              'historic', 'landuse', 'military', 'natural', 'sport'] 
        };
          
        layer_defaults = OpenLayers.Util.extend(layer_defaults, options);
        
        var interesting = {};
        for (var i = 0; i < layer_defaults.interestingTagsExclude.length; i++) {
            interesting[layer_defaults.interestingTagsExclude[i]] = true;
        }
        layer_defaults.interestingTagsExclude = interesting;
        
        var area = {};
        for (var i = 0; i < layer_defaults.areaTags.length; i++) {
            area[layer_defaults.areaTags[i]] = true;
        }
        layer_defaults.areaTags = area;

        // OSM coordinates are always in longlat WGS84
        this.externalProjection = new OpenLayers.Projection("EPSG:4326");
        
        OpenLayers.Format.XML.prototype.initialize.apply(this, [layer_defaults]);
    },
    
 
    read: function(doc) {
        if (typeof doc == "string") { 
            doc = OpenLayers.Format.XML.prototype.read.apply(this, [doc]);
        }

        var nodes = this.getNodes(doc);

        var floors = this.getFloors(doc);
        if(this.floor_id){
            var ways = this.getWays(doc, floors[parseInt(this.floor_id)]);
        } else {
            //var ways = this.getWays(doc);
        }
        
        
        
        // Geoms will contain at least ways.length entries.
        var feat_list = new Array(ways.length);
        
        for (var i = 0; i < ways.length; i++) {
            // We know the minimal of this one ahead of time. (Could be -1
            // due to areas/polygons)
            var point_list = new Array(ways[i].nodes.length);
            
            var poly = this.isWayArea(ways[i]) ? 1 : 0; 
            for (var j = 0; j < ways[i].nodes.length; j++) {
               var node = nodes[ways[i].nodes[j]];
               
               var point = new OpenLayers.Geometry.Point(node.lon, node.lat);
               
               // Since OSM is topological, we stash the node ID internally. 
               point.osm_id = parseInt(ways[i].nodes[j]);
               point_list[j] = point;
               
               // We don't display nodes if they're used inside other 
               // elements.
               node.used = true; 
            }
            var geometry = null;
            if (poly) { 
                geometry = new OpenLayers.Geometry.Polygon(
                    new OpenLayers.Geometry.LinearRing(point_list));
            } else {    
                geometry = new OpenLayers.Geometry.LineString(point_list);
            }
            if (this.internalProjection && this.externalProjection) {
                geometry.transform(this.externalProjection, 
                    this.internalProjection);
            }        
            var feat = new OpenLayers.Feature.Vector(geometry,
                ways[i].tags);
            feat.osm_id = parseInt(ways[i].id);
            feat.fid = "way." + feat.osm_id;
            feat_list[i] = feat;
        } 
        for (var node_id in nodes) {
            var node = nodes[node_id];
            if (!node.used || this.checkTags) {

                if(this.floor_id){
                    continue;
                }
                var tags = null;
                
                if (this.checkTags) {
                    var result = this.getTags(node.node, true);
                    if (node.used && !result[1]) {
                        continue;
                    }
                    tags = result[0];
                } else { 
                    tags = this.getTags(node.node);
                }    
                
                var feat = new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.Point(node['lon'], node['lat']),
                    tags);
                if (this.internalProjection && this.externalProjection) {
                    feat.geometry.transform(this.externalProjection, 
                        this.internalProjection);
                }        
                feat.osm_id = parseInt(node_id); 
                feat.fid = "node." + feat.osm_id;
                feat_list.push(feat);
            }   
            // Memory cleanup
            node.node = null;
        }        
        return feat_list;
    },

   
    getNodes: function(doc) {
        var node_list = doc.getElementsByTagName("node");
        var nodes = {};
        for (var i = 0; i < node_list.length; i++) {
            var node = node_list[i];
            var id = node.getAttribute("id");
            nodes[id] = {
                'lat': node.getAttribute("lat"),
                'lon': node.getAttribute("lon"),
                'node': node
            };
        }
        return nodes;
    },

 
    getWays: function(doc, floorid) {
       // var way_list = doc.getElementsByTagName("way");
        var floor_node = doc.getElementById(floorid);
        var member_list = floor_node.getElementsByTagName('member');
        var return_ways = [];

        for(var i=0; i < member_list.length; i++) {
            var way_id = member_list[i].getAttribute('ref');
            var way = doc.getElementById(way_id);
            var way_object = {
              id: way.getAttribute("id")
            };
            
            way_object.tags = this.getTags(way);
            
            var node_list = way.getElementsByTagName("nd");
            
            way_object.nodes = new Array(node_list.length);
            
            for (var j = 0; j < node_list.length; j++) {
                way_object.nodes[j] = node_list[j].getAttribute("ref");
            }  
            return_ways.push(way_object);
        }

       return return_ways; 
        
    },  
    
  
    getTags: function(dom_node, interesting_tags) {
        var tag_list = dom_node.getElementsByTagName("tag");
        var tags = {};
        var interesting = false;
        for (var j = 0; j < tag_list.length; j++) {
            var key = tag_list[j].getAttribute("k");
            tags[key] = tag_list[j].getAttribute("v");
            if (interesting_tags) {
                if (!this.interestingTagsExclude[key]) {
                    interesting = true;
                }
            }    
        }  
        return interesting_tags ? [tags, interesting] : tags;     
    },

    getFloors: function(doc) {
        var floors = {} ;
        if(this.building_id){
            var building_node = doc.getElementById(this.building_id);
            var level_member_nodes = building_node.getElementsByTagName('member');
            for(i=0;i < level_member_nodes.length; i++){
                var role = level_member_nodes[i].getAttribute('role');
                if(role.substring(0,5) == "level") {
                   floors[i] = level_member_nodes[i].getAttribute('ref');
                }
                
            } 
        }       
        return floors;
    },
  
    isWayArea: function(way) { 
        var poly_shaped = false;
        var poly_tags = false;
        
        if (way.nodes[0] == way.nodes[way.nodes.length - 1]) {
            poly_shaped = true;
        }
        if (this.checkTags) {
            for(var key in way.tags) {
                if (this.areaTags[key]) {
                    poly_tags = true;
                    break;
                }
            }
        }    
        return poly_shaped && (this.checkTags ? poly_tags : true);            
    }, 

 
    /**
     * Method: setState 
     * OpenStreetMap has a convention that 'state' is stored for modification or deletion.
     * This allows the file to be uploaded via JOSM or the bulk uploader tool.
     *
     * Parameters:
     * feature - {<OpenLayers.Feature.Vector>}
     * node - {DOMNode}
     */
    setState: function(feature, node) {
        if (feature.state) {
            var state = null;
            switch(feature.state) {
                case OpenLayers.State.UPDATE:
                    state = "modify";
                case OpenLayers.State.DELETE:
                    state = "delete";
            }
            if (state) {
                node.setAttribute("action", state);
            }
        }    
    },

    CLASS_NAME: "OpenLayers.Format.Indoor" 
});     