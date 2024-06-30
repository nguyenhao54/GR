import { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import "leaflet/dist/leaflet.css"

import icon from 'leaflet/dist/images/marker-icon.png';
import "./index.css"

let DefaultIcon = L.icon({
    iconUrl: icon,
});

L.Marker.prototype.options.icon = DefaultIcon;

function MyLocationMap({classLocation}: any) {
    const [position, setPosition] = useState<any>({ latitude: null, longitude: null });

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                setPosition({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
            }, function (error) {
                alert(error.message);
            },
                { enableHighAccuracy: true });
        } else {
            alert("Geolocation is not available in your browser.");
        }
    }, []);

    return (
        <div className="h-full w-full p-0 pb-4">
            <h2 className="text-neutral-400 text-xs mb-2">Vị trí hiện tại</h2>
            {position.latitude && position.longitude ? (
                <div className='min-h-[300px] h-[300px] w-full map-wrapper'>
                    <MapContainer
                        center={[position.latitude, position.longitude]}
                        zoom={100}
                        scrollWheelZoom={true}
                    >
                        <TileLayer
                            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        <Marker position={[position.latitude, position.longitude]}>
                            <Popup className='font-nunitoSans'>
                                Vị trí của bạn
                            </Popup>
                        </Marker>
                        <Marker position={classLocation.coordinates}>
                            <Popup className='font-nunitoSans'>
                                Vị trí lớp học
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>
            ) : (
                <p>Không thể xác định vị trí hiện tại, vui lòng cho phép truy cập vị trí hoặc thử lại sau.</p>
            )}
        </div>
    );
}

export default MyLocationMap;