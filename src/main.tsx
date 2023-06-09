import Two from 'two.js';
import './index.css';

const two = new Two({
  fullscreen: true,
  autostart: true,
}).appendTo(document.getElementById('root')!);

const focalLength = 2000 as const;
const scale = 30 as const;

function rotateCoordinateAroundCenter(x: number, y: number, z: number, rotation: number) {
  const centerPoint = [two.width / 2, two.height / 2, 0];
  // rotate coordinate around center y axis
  const x1 = centerPoint[0] + (x - centerPoint[0]) * Math.cos(rotation) - (z - centerPoint[2]) * Math.sin(rotation);
  const z1 = centerPoint[2] + (x - centerPoint[0]) * Math.sin(rotation) + (z - centerPoint[2]) * Math.cos(rotation);
  return [x1, y, z1];
}

function getCubeFaceCoordinates(xOffset: number, yOffset: number, zOffset: number, rotation = 0) {
  const vertex1 = rotateCoordinateAroundCenter(xOffset, yOffset, zOffset, rotation);
  const vertex2 = rotateCoordinateAroundCenter(xOffset + scale, yOffset, zOffset, rotation);
  const vertex3 = rotateCoordinateAroundCenter(xOffset + scale, yOffset + scale, zOffset, rotation);
  const vertex4 = rotateCoordinateAroundCenter(xOffset, yOffset + scale, zOffset, rotation);
  const vertex5 = rotateCoordinateAroundCenter(xOffset, yOffset, zOffset + scale, rotation);
  const vertex6 = rotateCoordinateAroundCenter(xOffset + scale, yOffset, zOffset + scale, rotation);
  const vertex7 = rotateCoordinateAroundCenter(xOffset + scale, yOffset + scale, zOffset + scale, rotation);
  const vertex8 = rotateCoordinateAroundCenter(xOffset, yOffset + scale, zOffset + scale, rotation);

  return [
    [vertex3, vertex4, vertex8, vertex7],
    [vertex5, vertex6, vertex7, vertex8],
    [vertex2, vertex3, vertex7, vertex6],
    [vertex4, vertex1, vertex5, vertex8],
    [vertex1, vertex2, vertex6, vertex5],
    [vertex1, vertex2, vertex3, vertex4],
  ];
}
function worldToScreen(x: number, y: number, z: number) {
  return [(focalLength * x) / (z + focalLength), (focalLength * y) / (z + focalLength)];
}

function drawCube(xOffset: number, yOffset: number, zOffset: number, rotation = 0, color?: string) {
  const cubeFaces = getCubeFaceCoordinates(xOffset * scale + two.width / 2, two.height / 2 - yOffset * scale, zOffset * scale, rotation);
  return cubeFaces.map((face) => {
    const anchorPoints = face.map((vertex) => {
      const screenCoord = worldToScreen(vertex[0], vertex[1], vertex[2]);
      return new Two.Anchor(screenCoord[0], screenCoord[1]);
    });
    const path = two.makePath(anchorPoints);
    if (color) {
      path.fill = color;
      path.stroke = color;
    } else {
      path.fill = 'white';
      path.stroke = 'white';
    }
    return path;
  });
}
const items: ReturnType<typeof drawCube>[] = [];

const smileCoordinates = [
  [-1.5, 4.5, 0],
  [1.5, 4.5, 0],
  [-0.5, 0, 0],
  [0.5, 0, 0],
  [-1.5, 1, 0],
  [1.5, 1, 0],
  [-2.5, 1.7, 0],
  [2.5, 1.7, 0],
];

const flowerTopCoordinates = [
  [1, -5, 0],
  [2, -5, 0],
  [2, -5, 1],
  [1, -5, 1],
  [1, -4, 2],
  [2, -4, 2],
  [1, -4, -1],
  [2, -4, -1],
  [3, -4, 0],
  [3, -4, 1],
  [0, -4, 0],
  [0, -4, 1],
];
const flowerRootCoordinates = [
  [1.5, -6, 0.5],
  [1.5, -7, 0.5],
  [1.5, -8, 0.5],
];

two.bind('update', function () {
  const rotation = (Date.now() / 1000) % 360;
  items.forEach((item) => item.forEach((p) => p.remove()));
  items.push(...smileCoordinates.map((coord) => drawCube(coord[0], coord[1], coord[2], rotation, 'orange')));
  items.push(...flowerRootCoordinates.map((coord) => drawCube(coord[0] + 4, coord[1], coord[2], rotation, 'green')));
  items.push(...flowerTopCoordinates.map((coord) => drawCube(coord[0] + 4, coord[1], coord[2], rotation, 'red')));
});
