var ErraustegienMapa = (function() {

    "use strict";

    var mapa,
        MapQuestOpen_OSM,
        geruzaEH,
        erraustegien_kontrolak,
        txertatzeko_botoia,
        kontrolak,
        lat = 43.183376,
        lng = -2.478662,
        zoom = 10,
        erraustegiak,
        zirkuluak,
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

    function sortu(id, erraustegien_datuak, zirkuluen_datuak, aukerak) {

        var url_parametroak = eskuratuURLParametroak(window.location.search.substr(1).split('&'));

        lat = url_parametroak.lat ? parseFloat(url_parametroak.lat) : lat;
        lng = url_parametroak.lng ? parseFloat(url_parametroak.lng) : lng;
        zoom = url_parametroak.zoom ? parseInt(url_parametroak.zoom) : zoom;
        zein = url_parametroak.zein ? url_parametroak.zein.split(",") : zein;

        if (url_parametroak.kontrolak === "false") {

            kontrolak = false;

        } else {

            kontrolak = true;

        }

        erraustegiak = erraustegien_datuak;

        zirkuluak = zirkuluen_datuak;

        gehituMapa(id);

        if (aukerak.kredituak) {

            gehituKredituak(aukerak.kredituak.kokapena, aukerak.kredituak.klaseak, aukerak.kredituak.html);

        }

        if (aukerak.erraustegien_kontrolak && kontrolak) {

            gehituErraustegienKontrolak(aukerak.erraustegien_kontrolak.kokapena, aukerak.erraustegien_kontrolak.klaseak);
            gehituErraustegienKontrolenManeiatzaileak();

        }

        if (aukerak.txertatzeko_botoia) {

            gehituTxertatzekoBotoia(aukerak.txertatzeko_botoia.kokapena, aukerak.txertatzeko_botoia.klaseak);

        }

        if (aukerak.bistaratu_Euskal_Herria) {

            gehituEuskalHerria();

        }

        gehituErraustegiak();

        return mapa;

    }

    function gehituMapa(id) {

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

    }

    function gehituErraustegiak() {

        for (var gakoa in erraustegiak) {

            erraustegiak[gakoa].erraustegia = new Erraustegia(mapa, erraustegiak[gakoa].izena, erraustegiak[gakoa].koordenatuak, zirkuluak);

            // Erraustegia bistaratu behar da?
            if (zein.indexOf(gakoa) > -1) {

                erraustegiak[gakoa].erraustegia.marraztuErraustegia();
                erraustegiak[gakoa].erraustegia.marraztuZirkuluak();
                erraustegiak[gakoa].erraustegia.gehituEtiketak();

            }

        }

    }

    function gehituKredituak(kokapena, klaseak, html) {

        var kredituak = L.control({position: kokapena});

        kredituak.onAdd = function (mapa) {

            var div = L.DomUtil.create('div', klaseak);

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

    function gehituEuskalHerria() {

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

    function gehituErraustegienKontrolak(kokapena, klaseak) {

        erraustegien_kontrolak = L.control({position: kokapena});

        erraustegien_kontrolak.onAdd = function(mapa) {

            var div = L.DomUtil.create("div", klaseak + " leaflet-bar");

            var kontrolak = "";

            var checked = "";

            for (var gakoa in erraustegiak) {

                checked = "";

                // Erraustegia bistaratu behar da?
                if (zein.indexOf(gakoa) > -1) {

                    checked = " checked";

                }

                kontrolak = kontrolak +
                            "<span>" +
                                "<input type='checkbox' id='" + gakoa + "'" + checked + ">" +
                                "<label for='" + gakoa + "'>" + gakoa + "</label>" +
                            "</span>";
            }

            div.innerHTML = kontrolak;

            return div;
        };

        erraustegien_kontrolak.addTo(mapa);

    }

    function gehituErraustegienKontrolenManeiatzaileak() {

        // Sortu ditugun kontrolei klik gertaeraren maneiatzailea gehituko diegu.
        for (var gakoa in erraustegiak) {

            (function(gakoa) {

                document.getElementById(gakoa).addEventListener("click", function(event) {

                    var checkbox = event.target;

                    if (checkbox.checked) {
                        erraustegiak[gakoa].erraustegia.marraztuErraustegia();
                        erraustegiak[gakoa].erraustegia.marraztuZirkuluak();
                        erraustegiak[gakoa].erraustegia.gehituEtiketak();
                    } else {
                        erraustegiak[gakoa].erraustegia.ezabatuErraustegia();
                        erraustegiak[gakoa].erraustegia.ezabatuZirkuluak();
                        erraustegiak[gakoa].erraustegia.ezabatuEtiketak();
                    }
                });
            })(gakoa);
        }
    }

    function gehituTxertatzekoBotoia(kokapena, klaseak) {

        txertatzeko_botoia = L.control({position: kokapena});

        txertatzeko_botoia.onAdd = function (map) {

            var div = L.DomUtil.create("div", klaseak + " leaflet-bar");

            div.innerHTML = "<a title='Txertatu mapa hau zure webgunean' href='#'></a>";

            L.DomEvent.on(div, "click", function(event) {

                event.preventDefault();

                var txertatzeko_kodearen_leihoa =  L.control.window(mapa, {
                    title: "Txertatzeko kodea",
                    content: "<p>Mapa hau zure webgunean bistaratu nahi baduzu erabili txertatzeko kode hau:</p>" +
                             "<textarea>&lt;iframe allowfullscreen='allowfullscreen' width='680' height='600' src='http://www.argia.eus/interaktiboak/2016-erraustegien-eraginpeko-zonaldeak/?lat=" + lat + "&lng=" + lng + "&zoom=" + zoom + "' frameBorder='0' scrolling='no'>&lt;/iframe></textarea>",
                    modal: true
                });

                txertatzeko_kodearen_leihoa.show();
            });

            return div;
        };

        txertatzeko_botoia.addTo(mapa);

    }

    return {
        sortu: sortu
    };

})();
