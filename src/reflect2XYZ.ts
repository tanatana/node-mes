export type XYZ = {
  X: number
  Y: number
  Z: number
}

export type ReflectData = {
  '360nm': number
  '370nm': number
  '380nm': number
  '390nm': number
  '400nm': number
  '410nm': number
  '420nm': number
  '430nm': number
  '440nm': number
  '450nm': number
  '460nm': number
  '470nm': number
  '480nm': number
  '490nm': number
  '500nm': number
  '510nm': number
  '520nm': number
  '530nm': number
  '540nm': number
  '550nm': number
  '560nm': number
  '570nm': number
  '580nm': number
  '590nm': number
  '600nm': number
  '610nm': number
  '620nm': number
  '630nm': number
  '640nm': number
  '650nm': number
  '660nm': number
  '670nm': number
  '680nm': number
  '690nm': number
  '700nm': number
  '710nm': number
  '720nm': number
  '730nm': number
  '740nm': number
}

export function reflectDataMapCM25d(d: number[]): ReflectData {
  return {
    '360nm': d[0] * 0.01,
    '370nm': d[0] * 0.01,
    '380nm': d[0] * 0.01,
    '390nm': d[0] * 0.01,
    '400nm': d[0] * 0.01,
    '410nm': d[1] * 0.01,
    '420nm': d[2] * 0.01,
    '430nm': d[3] * 0.01,
    '440nm': d[4] * 0.01,
    '450nm': d[5] * 0.01,
    '460nm': d[6] * 0.01,
    '470nm': d[7] * 0.01,
    '480nm': d[8] * 0.01,
    '490nm': d[9] * 0.01,
    '500nm': d[10] * 0.01,
    '510nm': d[11] * 0.01,
    '520nm': d[12] * 0.01,
    '530nm': d[13] * 0.01,
    '540nm': d[14] * 0.01,
    '550nm': d[15] * 0.01,
    '560nm': d[16] * 0.01,
    '570nm': d[17] * 0.01,
    '580nm': d[18] * 0.01,
    '590nm': d[19] * 0.01,
    '600nm': d[20] * 0.01,
    '610nm': d[21] * 0.01,
    '620nm': d[22] * 0.01,
    '630nm': d[23] * 0.01,
    '640nm': d[24] * 0.01,
    '650nm': d[25] * 0.01,
    '660nm': d[26] * 0.01,
    '670nm': d[27] * 0.01,
    '680nm': d[28] * 0.01,
    '690nm': d[29] * 0.01,
    '700nm': d[30] * 0.01,
    '710nm': d[30] * 0.01,
    '720nm': d[30] * 0.01,
    '730nm': d[30] * 0.01,
    '740nm': d[30] * 0.01,
  }
}

export function reflectDataMapCM2500d(d: number[]): ReflectData {
  return {
    '360nm': d[0] * 0.01,
    '370nm': d[1] * 0.01,
    '380nm': d[2] * 0.01,
    '390nm': d[3] * 0.01,
    '400nm': d[4] * 0.01,
    '410nm': d[5] * 0.01,
    '420nm': d[6] * 0.01,
    '430nm': d[7] * 0.01,
    '440nm': d[8] * 0.01,
    '450nm': d[9] * 0.01,
    '460nm': d[10] * 0.01,
    '470nm': d[11] * 0.01,
    '480nm': d[12] * 0.01,
    '490nm': d[13] * 0.01,
    '500nm': d[14] * 0.01,
    '510nm': d[15] * 0.01,
    '520nm': d[16] * 0.01,
    '530nm': d[17] * 0.01,
    '540nm': d[18] * 0.01,
    '550nm': d[19] * 0.01,
    '560nm': d[20] * 0.01,
    '570nm': d[21] * 0.01,
    '580nm': d[22] * 0.01,
    '590nm': d[23] * 0.01,
    '600nm': d[24] * 0.01,
    '610nm': d[25] * 0.01,
    '620nm': d[26] * 0.01,
    '630nm': d[27] * 0.01,
    '640nm': d[28] * 0.01,
    '650nm': d[29] * 0.01,
    '660nm': d[30] * 0.01,
    '670nm': d[31] * 0.01,
    '680nm': d[32] * 0.01,
    '690nm': d[33] * 0.01,
    '700nm': d[34] * 0.01,
    '710nm': d[35] * 0.01,
    '720nm': d[36] * 0.01,
    '730nm': d[37] * 0.01,
    '740nm': d[38] * 0.01,
  }
}

export function reflectDataMapCM26d(d: number[]): ReflectData {
  return {
    '360nm': d[0] * 0.01,
    '370nm': d[1] * 0.01,
    '380nm': d[2] * 0.01,
    '390nm': d[3] * 0.01,
    '400nm': d[4] * 0.01,
    '410nm': d[5] * 0.01,
    '420nm': d[6] * 0.01,
    '430nm': d[7] * 0.01,
    '440nm': d[8] * 0.01,
    '450nm': d[9] * 0.01,
    '460nm': d[10] * 0.01,
    '470nm': d[11] * 0.01,
    '480nm': d[12] * 0.01,
    '490nm': d[13] * 0.01,
    '500nm': d[14] * 0.01,
    '510nm': d[15] * 0.01,
    '520nm': d[16] * 0.01,
    '530nm': d[17] * 0.01,
    '540nm': d[18] * 0.01,
    '550nm': d[19] * 0.01,
    '560nm': d[20] * 0.01,
    '570nm': d[21] * 0.01,
    '580nm': d[22] * 0.01,
    '590nm': d[23] * 0.01,
    '600nm': d[24] * 0.01,
    '610nm': d[25] * 0.01,
    '620nm': d[26] * 0.01,
    '630nm': d[27] * 0.01,
    '640nm': d[28] * 0.01,
    '650nm': d[29] * 0.01,
    '660nm': d[30] * 0.01,
    '670nm': d[31] * 0.01,
    '680nm': d[32] * 0.01,
    '690nm': d[33] * 0.01,
    '700nm': d[34] * 0.01,
    '710nm': d[35] * 0.01,
    '720nm': d[36] * 0.01,
    '730nm': d[37] * 0.01,
    '740nm': d[38] * 0.01,
  }
}

type E308WeightMapEntry = { x: number; y: number; z: number }
type E308WeightMap = { [key in string]: E308WeightMapEntry }

// ASTM E308
// Table 5.19: illuminant D65, 1964 Observer, 10nm interval
// SpectraMagic do not use over 750nm??
export const Table5_19: { [key in string]: { x: number; y: number; z: number } } = {
  '360nm': { x: 0.0, y: 0.0, z: 0.0 },
  '370nm': { x: 0.0, y: 0.0, z: 0.0 },
  '380nm': { x: 0.0, y: 0.0, z: -0.002 },
  '390nm': { x: 0.008, y: 0.001, z: 0.033 },
  '400nm': { x: 0.137, y: 0.014, z: 0.612 },
  '410nm': { x: 0.676, y: 0.069, z: 3.11 },
  '420nm': { x: 1.603, y: 0.168, z: 7.627 },
  '430nm': { x: 2.451, y: 0.3, z: 12.095 },
  '440nm': { x: 3.418, y: 0.554, z: 17.537 },
  '450nm': { x: 3.699, y: 0.89, z: 19.888 },
  '460nm': { x: 3.063, y: 1.29, z: 17.695 },
  '470nm': { x: 1.933, y: 1.838, z: 13.0 },
  '480nm': { x: 0.802, y: 2.52, z: 7.699 },
  '490nm': { x: 0.156, y: 3.226, z: 3.938 },
  '500nm': { x: 0.039, y: 4.32, z: 2.046 },
  '510nm': { x: 0.347, y: 5.621, z: 1.049 },
  '520nm': { x: 1.07, y: 6.907, z: 0.544 },
  '530nm': { x: 2.17, y: 8.059, z: 0.278 },
  '540nm': { x: 3.397, y: 8.668, z: 0.122 },
  '550nm': { x: 4.732, y: 8.855, z: 0.035 },
  '560nm': { x: 6.07, y: 8.581, z: 0.001 },
  '570nm': { x: 7.311, y: 7.951, z: 0.0 },
  '580nm': { x: 8.291, y: 7.106, z: 0.0 },
  '590nm': { x: 8.634, y: 6.004, z: 0.0 },
  '600nm': { x: 8.672, y: 5.079, z: 0.0 },
  '610nm': { x: 7.93, y: 4.065, z: 0.0 },
  '620nm': { x: 6.446, y: 2.999, z: 0.0 },
  '630nm': { x: 4.669, y: 2.042, z: 0.0 },
  '640nm': { x: 3.095, y: 1.29, z: 0.0 },
  '650nm': { x: 1.859, y: 0.746, z: 0.0 },
  '660nm': { x: 1.056, y: 0.417, z: 0.0 },
  '670nm': { x: 0.57, y: 0.223, z: 0.0 },
  '680nm': { x: 0.274, y: 0.107, z: 0.0 },
  '690nm': { x: 0.121, y: 0.047, z: 0.0 },
  '700nm': { x: 0.058, y: 0.023, z: 0.0 },
  '710nm': { x: 0.028, y: 0.011, z: 0.0 },
  '720nm': { x: 0.012, y: 0.005, z: 0.0 },
  '730nm': { x: 0.006, y: 0.002, z: 0.0 },
  '740nm': { x: 0.003, y: 0.001, z: 0.0 },
  '750nm': { x: 0.001, y: 0.001, z: 0.0 },
  '760nm': { x: 0.001, y: 0.0, z: 0.0 },
  '770nm': { x: 0.0, y: 0.0, z: 0.0 },
  '780nm': { x: 0.0, y: 0.0, z: 0.0 },
}

export function calcXYZFromReflectData(table: E308WeightMap, d: ReflectData): XYZ {
  return Object.entries(d).reduce(
    (xyz, [k, v]) => {
      const w = table[k]
      xyz.X += w.x * v
      xyz.Y += w.y * v
      xyz.Z += w.z * v
      return xyz
    },
    { X: 0, Y: 0, Z: 0 }
  )
}
