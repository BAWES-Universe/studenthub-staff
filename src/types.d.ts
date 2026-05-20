declare namespace google {
  namespace maps {
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    class Map {}
    class Marker {}
    class OverlayView {}
    class LatLng {}

    interface MapOptions {}
    interface MarkerOptions {}
  }
}

interface Window {
  google: typeof google;
}

interface PictureInPictureEvent extends Event {}
