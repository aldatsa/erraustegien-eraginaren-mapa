var Erraustegia = function(izena, mapa) {
    "use strict";

    this.latLng = {
        "Zubieta": [43.256308, -2.040659],
        "Rezola": [43.285839, -1.997300]
    };

    this.izena = izena;
    this.mapa = mapa;
    this.zirkuluak = [];
};

Erraustegia.prototype.marraztuZirkuluak = function(zirkuluak) {

    var self = this;

    zirkuluak.forEach(function(element, index, array) {

        self.zirkuluak.push(L.circle(self.latLng[self.izena], element.distantzia, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: element.opakotasuna
        }).addTo(self.mapa));
    });

};

Erraustegia.prototype.ezabatuZirkuluak = function() {

    var self = this;

    self.zirkuluak.forEach(function(element, index, array) {

        self.mapa.removeLayer(element);

    });

};
