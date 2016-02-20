var Erraustegia = function(mapa, datuak) {
    "use strict";

    this.mapa = mapa;

    this.izena = datuak.izena;
    this.koordenatuak = datuak.koordenatuak;
    
    this.zirkuluak = [];
};

Erraustegia.prototype.marraztuZirkuluak = function(zirkuluak) {

    var self = this;

    zirkuluak.forEach(function(element, index, array) {

        self.zirkuluak.push(L.circle(self.koordenatuak, element.distantzia, {
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
