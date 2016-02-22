var Erraustegia = function(mapa, erraustegia, zirkuluak) {
    "use strict";

    var self = this;

    this.mapa = mapa;

    this.izena = erraustegia.izena;
    this.koordenatuak = erraustegia.koordenatuak;
    this.zirkuluak = zirkuluak;

    this.leaflet_zirkuluak = [];
    this.etiketak = [];

    this.mapa.on('zoomend', function() {

        // Zirkuluak txikiak direnean etiketak ezkutatu, bestela elkarren gainean ikusten dira.
        if (mapa.getZoom() < 11) {

            if (self.etiketakIkusgai()) {

                self.ezabatuEtiketak();

            }
        } else {

            if (self.zirkuluakIkusgai() && !self.etiketakIkusgai()) {

                self.gehituEtiketak();

            }
        }
    });
};

Erraustegia.prototype.marraztuZirkuluak = function() {

    var self = this;

    self.zirkuluak.forEach(function(element, index, array) {

        self.leaflet_zirkuluak.push(L.circle(self.koordenatuak, element.distantzia, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: element.opakotasuna
        }).addTo(self.mapa));

        self.gehituEtiketa(self.leaflet_zirkuluak[index].getBounds().getCenter().lat, self.leaflet_zirkuluak[index].getBounds().getEast(), element.distantzia);

    });

};

Erraustegia.prototype.gehituEtiketak = function() {

    var self = this;

    self.zirkuluak.forEach(function(element, index, array) {

        self.gehituEtiketa(self.leaflet_zirkuluak[index].getBounds().getCenter().lat, self.leaflet_zirkuluak[index].getBounds().getEast(), element.distantzia);

    });
};

Erraustegia.prototype.gehituEtiketa = function(lat, lng, distantzia) {

    var etiketa = new L.Label();

    etiketa.setContent(distantzia / 1000 + " km");
    etiketa.setLatLng([lat, lng]);

    this.mapa.showLabel(etiketa);
    this.etiketak.push(etiketa);

};

Erraustegia.prototype.ezabatuZirkuluak = function() {

    var self = this;

    self.leaflet_zirkuluak.forEach(function(element, index, array) {

        self.mapa.removeLayer(element);

    });

    self.zirkuluak = [];

    self.ezabatuEtiketak();

};
Erraustegia.prototype.ezabatuEtiketak = function () {

    var self = this;

    self.etiketak.forEach(function(element, index, array) {

        self.mapa.removeLayer(element);

    });

    self.etiketak = [];

};

Erraustegia.prototype.zirkuluakIkusgai = function () {

    return this.leaflet_zirkuluak.length > 0;

};

Erraustegia.prototype.etiketakIkusgai = function () {

    return this.etiketak.length > 0;

};
