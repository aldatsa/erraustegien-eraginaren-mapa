var Erraustegia = function(izena, mapa) {
    "use strict";

    this.latLng = {
        "Zubieta": [43.256308, -2.040659],
        "Rezola": [43.285839, -1.997300]
    };

    this.izena = izena;
    this.mapa = mapa;
};

Erraustegia.prototype.marraztuZirkuluak = function(zirkuluak) {

    var self = this;

    zirkuluak.forEach(function(element, index, array) {

        L.circle(self.latLng[self.izena], element.distantzia, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: element.opakotasuna
        }).addTo(self.mapa);
    });

};
