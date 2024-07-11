import React, { useEffect, useRef } from 'react';

function Map({ location, onLocationChange }) {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: location,
        zoom: 15,
        // mapTypeId: "satellite"
      });

      const marker = new window.google.maps.Marker({
        position: location,
        map,
        draggable: true,
      });

      map.addListener('click', (e) => {
        const newLocation = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        marker.setPosition(newLocation);
        onLocationChange(newLocation);
      });

      marker.addListener('dragend', (e) => {
        const newLocation = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        onLocationChange(newLocation);
      });
    };

    if (window.google && window.google.maps) {
      loadMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.onload = loadMap;
      document.head.appendChild(script);
    }
  }, [location, onLocationChange]);

  return <div ref={mapRef} className="w-full h-64 mt-4"></div>;
}

export default Map;
