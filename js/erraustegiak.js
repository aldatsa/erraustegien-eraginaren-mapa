var Erraustegia = function(mapa, datuak) {
    "use strict";

    this.mapa = mapa;

    this.izena = datuak.izena;
    this.koordenatuak = datuak.koordenatuak;

    this.zirkuluak = [];
    this.etiketak = [];
};

Erraustegia.prototype.marraztuZirkuluak = function(zirkuluak) {

    var self = this;

    zirkuluak.forEach(function(element, index, array) {

        self.zirkuluak.push(L.circle(self.koordenatuak, element.distantzia, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: element.opakotasuna
        }).addTo(self.mapa));

        var etiketa = new L.Label();
        etiketa.setContent(self.izena + "tik " + element.distantzia / 1000 + " km");
        etiketa.setLatLng([self.zirkuluak[index].getBounds().getCenter().lat, self.zirkuluak[index].getBounds().getEast()]);

        self.mapa.showLabel(etiketa);
        self.etiketak.push(etiketa);
    });

};

Erraustegia.prototype.ezabatuZirkuluak = function() {

    var self = this;

    self.zirkuluak.forEach(function(element, index, array) {

        self.mapa.removeLayer(element);

    });

    self.etiketak.forEach(function(element, index, array) {

        self.mapa.removeLayer(element);

    });

};
