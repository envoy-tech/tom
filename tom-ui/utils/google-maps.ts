export const getZoom = (sw, ne, pixelWidth: number) => {
  var GLOBE_WIDTH = 256; // a constant in Google's map projection
  var west = sw.lng();
  var east = ne.lng();
  var angle = east - west;
  if (angle < 0) {
    angle += 360;
  }
  var zoom = Math.round(
    Math.log((pixelWidth * 360) / angle / GLOBE_WIDTH) / Math.LN2
  );

  return zoom;
};
