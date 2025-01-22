"use client";

import { useState, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Autocomplete,
} from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100vh",
};

const defaultMapOptions = {
  zoomControl: true,
  gestureHandling: "auto",
  mapTypeId: "roadmap",
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

const MapWithAutocomplete = () => {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [info, setInfo] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  const onMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });
    fetchLocationDetails({ lat, lng });
  };

  const fetchLocationDetails = async ({ lat, lng }) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        setInfo({
          address: results[0].formatted_address,
          position: { lat, lng },
        });
      } else {
        console.error("Error fetching location details:", status);
      }
    });
  };

  const onPlaceSelected = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setMarker({ lat, lng });
      setInfo({
        address: place.formatted_address,
        position: { lat, lng },
      });
      map.panTo({ lat, lng });
    }
  };

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onAutocompleteLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  return (
    <div>
      <div
        style={{
          marginBottom: "10px",
          padding: "10px",
          backgroundColor: "white",
          zIndex: 1,
          width: "100%",
        }}
      >
        <Autocomplete
          onLoad={onAutocompleteLoad}
          onPlaceChanged={onPlaceSelected}
        >
          <input
            type="text"
            placeholder="Search for a location"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "14px",
            }}
          />
        </Autocomplete>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={16}
        onLoad={onLoad}
        onClick={onMapClick}
        options={defaultMapOptions}
      >
        {marker && <Marker position={marker} />}

        {info && (
          <InfoWindow
            position={info.position}
            onCloseClick={() => setInfo(null)}
          >
            <div>
              <p>
                <strong>Address:</strong> {info.address}
              </p>
              <p>
                <strong>Coordinates:</strong> {info.position.lat},{" "}
                {info.position.lng}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export default MapWithAutocomplete;
