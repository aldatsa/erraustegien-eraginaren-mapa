var ErraustegienMapa = (function() {

    "use strict";

    var mapa,
        MapQuestOpen_OSM;

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

    return {
        sortu: sortu
    };
    
})();
