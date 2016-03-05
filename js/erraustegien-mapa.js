var ErraustegienMapa = (function() {

    "use strict";

    var mapa,
        MapQuestOpen_OSM,
        geruzaEH;

    // http://blog.webkid.io/maps-with-leaflet-and-topojson/
    L.TopoJSON = L.GeoJSON.extend({
        addData: function(jsonData) {
            if (jsonData.type === "Topology") {
                for (var key in jsonData.objects) {
                    var geojson = topojson.feature(jsonData, jsonData.objects[key]);
                    L.GeoJSON.prototype.addData.call(this, geojson);
                }
            } else {
                L.GeoJSON.prototype.addData.call(this, jsonData);
            }
        }
    });

    function sortu(id, lat, lng, zoom) {

        mapa = L.map(id, {
            fullscreenControl: true
        }).setView([lat, lng], zoom);

        MapQuestOpen_OSM = L.tileLayer('http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.{ext}', {
            type: 'map',
            ext: 'jpg',
            attribution: 'Tiles Courtesy of <a href="http://www.mapquest.com/">MapQuest</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            subdomains: '1234'
        });

        MapQuestOpen_OSM.addTo(mapa);

        return mapa;

    }

    function gehituKredituak(kokapena, klasea, html) {

        var kredituak = L.control({position: kokapena});

        kredituak.onAdd = function (mapa) {

            var div = L.DomUtil.create('div', klasea);

            div.innerHTML = html;

            return div;
        };

        kredituak.addTo(mapa);

    }

    // http://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript
    function kargatuJSON(file, callback) {

        var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
        xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
        xobj.onreadystatechange = function () {
              if (xobj.readyState == 4 && xobj.status == "200") {
                // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
                callback(xobj.responseText);
              }
        };
        xobj.send(null);
    }

    function bistaratuEH() {

        kargatuJSON("topoJSON/herrialdeak.topo.json", function(response) {

            // TopoJSON objektua analizatu testu-kate bihurtzeko.
            var datuak = JSON.parse(response);

            geruzaEH = new L.TopoJSON(datuak, {
                style: function (feature) {
                    return {
                        color: "#555",
                        opacity: 1,
                        "fillOpacity": 0,
                        weight: 2
                    };
                }
            }).addTo(mapa);
        });

    }

    return {
        sortu: sortu,
        gehituKredituak: gehituKredituak,
        bistaratuEH: bistaratuEH
    };

})();
