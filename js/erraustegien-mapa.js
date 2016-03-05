var ErraustegienMapa = (function() {

    "use strict";

    var mapa,
        MapQuestOpen_OSM,
        geruzaEH,
        lat = 43.183376,
        lng = -2.478662,
        zoom = 10,
        // Zein erraustegi bistaratu behar diren. Ez bada besterik esaten guztiak (atzerakako bateragarritasuna mantentzeko).
        // Array lehenetsia eskuz sartzea ez da oso dotorea. Horren ondorioz bi lekutan sartu behar da erraustegien zerrenda,
        // hemen eta erraustegiak aldagaian. Bateratzea komeni da.
        zein = ["Añorga", "Arrigorriaga", "Benesse-Maremne", "Lemoa", "Zabalgarbi", "Zubieta"];

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

    // http://stackoverflow.com/a/3855394/2855012
    function eskuratuURLParametroak(a) {
        if (a === "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i)
        {
            var p=a[i].split('=', 2);
            if (p.length == 1)
                b[p[0]] = "";
            else
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    }

    function sortu(id) {

        var url_parametroak = eskuratuURLParametroak(window.location.search.substr(1).split('&'));

        lat = url_parametroak.lat ? parseFloat(url_parametroak.lat) : lat;
        lng = url_parametroak.lng ? parseFloat(url_parametroak.lng) : lng;
        zoom = url_parametroak.zoom ? parseInt(url_parametroak.zoom) : zoom;
        zein = url_parametroak.zein ? url_parametroak.zein.split(",") : zein;

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
