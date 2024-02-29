import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css"

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

function MyLocationMap() {
    const [position, setPosition] = useState<any>({ latitude: null, longitude: null });

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setPosition({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            }, null, {  enableHighAccuracy: true});
        } else {
            console.log("Geolocation is not available in your browser.");
        }
    }, []);

    console.log(position);

    return (
        <div className="h-full">
            <h2 className="font-semibold text-neutral-400">Vị trí hiện tại</h2>
            {position.latitude && position.longitude ? (
               <div className='h-full map-wrapper'>
               <MapContainer 
                center={[position.latitude,position.longitude ]} 
                zoom={100} 
                scrollWheelZoom={true}
                >
                    <TileLayer
                        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[position.latitude, position.longitude]}>
                        <Popup>
                            Vị trí của bạn
                        </Popup>
                    </Marker>
                </MapContainer>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default MyLocationMap;