import { ArrowBackCircleSvg } from '@src/assets';
import { INITIAL_REGION } from '@src/constants';
import { LocationPickerScreenProps } from '@src/navigation/types';
import { useAppSelector } from '@src/redux/hooks';
import { getDistance } from 'geolib';
import { useRef, useState } from 'react';
import { View, StatusBar, TouchableOpacity } from 'react-native';
import MapView, { Region, Details, LatLng } from 'react-native-maps';

import { selectMapType } from '../mapSlice';
import { FakeMarker, LocationPickerTracer } from './components';
import PickerButton from './components/PickerButton';

const LocationPickerScreen = ({ navigation, route }: LocationPickerScreenProps) => {
  const mapRef = useRef<MapView>(null);
  const mapType = useAppSelector(selectMapType);
  const [centerCoordinates, setCenterCoordinates] = useState<LatLng>();
  const [markers, setMarkers] = useState<LatLng[]>([]);

  const onRegionChange = (region: Region, _: Details) => {
    setCenterCoordinates(region);
  };

  async function handlePickLocation() {
    if (markers.length === 2) {
      console.log('SET MARKER'); // TO-DO: Next step, get form info
    } else {
      const camera = await mapRef.current?.getCamera();
      if (camera?.center) {
        setMarkers([...markers, camera.center]);
      }
    }
  }

  function onMapReady() {
    if (route.params.camera) mapRef.current?.setCamera(route.params.camera);
  }

  return (
    <View className="relative h-full">
      <StatusBar barStyle="dark-content" />
      <MapView
        className="flex-1"
        provider="google"
        mapType={mapType}
        onRegionChange={onRegionChange}
        onMapReady={onMapReady}
        initialRegion={INITIAL_REGION}
        ref={mapRef}
        showsMyLocationButton={false}
        showsUserLocation>
        {markers.length > 0 && centerCoordinates !== undefined && (
          <LocationPickerTracer center={centerCoordinates} markers={markers} />
        )}
      </MapView>

      {markers.length <= 1 && (
        <FakeMarker
          distance={
            markers[0] && centerCoordinates ? getDistance(markers[0], centerCoordinates) : undefined
          }
        />
      )}

      <TouchableOpacity
        className="absolute left-3 top-12 w-12 h-12 bg-gray-600 rounded-full"
        onPress={() => navigation.goBack()}>
        <ArrowBackCircleSvg color="#e7e5e4" className="fill-neutral-200" />
      </TouchableOpacity>

      <PickerButton markersLength={markers.length} onPress={handlePickLocation} />
    </View>
  );
};

export default LocationPickerScreen;
