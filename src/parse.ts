import Encoding from 'encoding-japanese'
import {
  calcXYZFromReflectData,
  reflectDataMapCM2500d,
  reflectDataMapCM25d,
  reflectDataMapCM26d,
  Table5_19,
} from './reflect2XYZ'

function searchAll(data: Buffer, marker: Buffer): number[] {
  let match = []
  for (let i = 0; i < data.length; i++) {
    // 枝刈り
    if (data[i] !== marker[0]) {
      continue
    }

    const candidate = data.subarray(i, i + marker.length)
    if (candidate.equals(marker)) {
      match.push(i)
    }
  }
  return match
}

function search(data: Buffer, marker: Buffer): number {
  let match = -1
  for (let i = 0; i < data.length; i++) {
    // 枝刈り
    if (data[i] !== marker[0]) {
      continue
    }

    const candidate = data.subarray(i, i + marker.length)
    if (candidate.equals(marker)) {
      match = i
      break
    }
  }
  return match
}

function slice(data: Buffer, start: number, length: number): [Buffer, number] {
  return [data.subarray(start, start + length), start + length]
}

function getTargetData(data: Buffer): Data[] {
  // find 04-TGTS marker
  const tgtsMarkerIndex = search(data, Buffer.from([0x04, 0x54, 0x47, 0x54, 0x53]))
  // find 04-TGTE marker
  const tgteMarkerIndex = search(data, Buffer.from([0x04, 0x54, 0x47, 0x54, 0x45]))

  if (tgtsMarkerIndex === -1) {
    throw new Error('04-TGTS marker not found')
  }
  if (tgteMarkerIndex === -1) {
    throw new Error('04-TGTE marker not found')
  }

  const tgtsBuffer = data.subarray(tgtsMarkerIndex, tgteMarkerIndex + 5)

  // find ALL 04-DATS marker
  const tgtDatsMarker = searchAll(tgtsBuffer, Buffer.from([0x04, 0x44, 0x41, 0x54, 0x53]))
  // find ALL 04-DATE marker
  const tgtDateMarker = searchAll(tgtsBuffer, Buffer.from([0x04, 0x44, 0x41, 0x54, 0x45]))

  if (tgtDatsMarker.length !== tgtDateMarker.length) {
    throw new Error('[TGT] 04-DATS and 04-DATE counts do not match.')
  }
  const dataCursors = tgtDatsMarker.map((cursor, i) => {
    return [cursor, tgtDateMarker[i]]
  })

  const targetData = dataCursors.map((cursor) => {
    return unmarshalData(tgtsBuffer.subarray(...cursor), true)
  })
  return targetData
}

function getSampleData(data: Buffer): Data[] {
  // find 04-SPLS marker
  const splsMarkerIndex = search(data, Buffer.from([0x04, 0x53, 0x50, 0x4c, 0x53]))
  // find 04-SPLE marker
  const spleMarkerIndex = search(data, Buffer.from([0x04, 0x53, 0x50, 0x4c, 0x45]))

  if (splsMarkerIndex === -1) {
    throw new Error('04-TGTS marker not found')
  }
  if (spleMarkerIndex === -1) {
    throw new Error('04-TGTE marker not found')
  }

  const splsBuffer = data.subarray(splsMarkerIndex, spleMarkerIndex + 5)

  // find ALL 04-DATS marker
  const splDatsMarker = searchAll(splsBuffer, Buffer.from([0x04, 0x44, 0x41, 0x54, 0x53]))
  // find ALL 04-DATE marker
  const splDateMarker = searchAll(splsBuffer, Buffer.from([0x04, 0x44, 0x41, 0x54, 0x45]))

  if (splDatsMarker.length !== splDateMarker.length) {
    throw new Error('[SPL] 04-DATS and 04-DATE counts do not match.')
  }
  const dataCursors = splDatsMarker.map((cursor, i) => {
    return [cursor, splDateMarker[i]]
  })

  const sampleData = dataCursors.map((cursor) => {
    return unmarshalData(splsBuffer.subarray(...cursor), false)
  })
  return sampleData
}

function getXYZFromReflectData(deviceName: string, reflectData: number[]): { X: number; Y: number; Z: number } {
  switch (deviceName) {
    case 'CM-25d':
      return calcXYZFromReflectData(Table5_19, reflectDataMapCM25d(reflectData))
    case 'CM-26d':
      return calcXYZFromReflectData(Table5_19, reflectDataMapCM26d(reflectData))
    case 'CM-2500d':
      return calcXYZFromReflectData(Table5_19, reflectDataMapCM2500d(reflectData))
  }

  return { X: 0, Y: 0, Z: 0 }
}

type Data = {
  dataNo: number
  label: string
  comment: string
  reflectDataCount: number
  reflectData: number[]
  X: number
  Y: number
  Z: number
  uv1: Buffer // 4byte
  uv2a: Buffer // 4byte
  uv2b: Buffer // 4byte
  uv3: Buffer //  1byte
  uv4: Buffer // 12byte
  uv5: Buffer // 12byte
  property: {
    deviceName: string
    deviceVariation: string
    deviceSerialNo: string
    romVersion: string
    captureDate: string
    calibrationDate: string
    specularComponentVal: number
    specularComponent: string
    captureMethodVal: number
    captureMethod: string
    geometryVal: number
    geometry: string
    specularComponentProcessVal: number
    specularComponentProcess: string
    captureCircleVal: number
    captureCircle: string
    underInvestigation: UnderInvestigationProperty[]
  }
  targetDataNo: number
  targetDataLabel: string
  managementData: [string, number][]
  numericalData: [string, number][]
  threshold?: Threshold
  parameters?: Parameters
}

type ThresholdItem = { values: [number, number]; active: boolean }
type Threshold = {
  cmc: ThresholdItem
  dEab: ThresholdItem
  dL: ThresholdItem
  da: ThresholdItem
  db: ThresholdItem
}

const parametersIndex = ['cmc-c', 'cmc-l', 'dE94-l', 'dE94-c', 'dE94-h', 'dE00-l', 'dE00-c', 'dE00-h'] as const
type ParametersKey = typeof parametersIndex[number]
type Parameters = { [key in ParametersKey]: number }

type UnderInvestigationProperty = {
  mark: Buffer
  value: number
  text: string
}

function unmarshalThresholdData(d: Buffer, mark: Buffer): [[number, number], boolean, number] {
  const curr = search(d, mark)
  if (curr === -1) {
    throw new Error(`marker is not found: ${mark}`)
  }

  const [_, markNextCurr] = slice(d, curr, mark.length)
  const [markVal1, markVal1NextCurr] = slice(d, markNextCurr, 4)
  const [markVal2, markVal2NextCurr] = slice(d, markVal1NextCurr, 4)
  const [active, activeNextCurr] = slice(d, markVal2NextCurr, 1)
  return [[markVal1.readFloatLE(), markVal2.readFloatLE()], active.equals(Buffer.from([0x01])), activeNextCurr]
}

function unmarshalDataProperty(d: Buffer, mark: Buffer): [number, string] {
  const curr = search(d, mark)
  if (curr === -1) {
    throw new Error(`marker is not found`)
  }

  const [_, markNextCurr] = slice(d, curr, mark.length)
  const [markVal, markValNextCurr] = slice(d, markNextCurr, 4)
  const [markTextLengthBuff, markTextLengthNextCurr] = slice(d, markValNextCurr, 1)
  const [markTextBuff] = slice(d, markTextLengthNextCurr, markTextLengthBuff.readInt8())
  const markText = Encoding.convert(markTextBuff, { from: 'SJIS', to: 'UNICODE', type: 'string' })

  return [markVal.readInt32LE(), markText]
}

function unmarshalManagementData(d: Buffer, mark: Buffer): [string, number] {
  const curr = search(d, mark)
  if (curr === -1) {
    return ['', -1]
  }
  const dataCurr = curr + mark.length
  const data = d.subarray(dataCurr, dataCurr + 2).readInt16LE()

  return [Encoding.convert(mark.subarray(1), { from: 'SJIS', to: 'UNICODE', type: 'string' }), data]
}

function unmarshalNumericalData(d: Buffer, mark: Buffer): [string, number] {
  const curr = search(d, mark)
  if (curr === -1) {
    return ['', -1]
  }
  const dataCurr = curr + mark.length
  const data = d.subarray(dataCurr, dataCurr + 1).readInt8()

  return [Encoding.convert(mark.subarray(1), { from: 'SJIS', to: 'UNICODE', type: 'string' }), data]
}

function unmarshalData(d: Buffer, isTarget: boolean): Data {
  const dataNo = d.subarray(5, 9).readInt32LE()

  const labelLength = d.subarray(9, 10).readInt8()
  const [labelBuffer, labelNextCurr] = slice(d, 10, labelLength)
  const label = Encoding.convert(labelBuffer, { from: 'SJIS', to: 'UNICODE', type: 'string' })

  // label の次はコメントが入る
  const [commentLengthBuf, commentLengthNextCurr] = slice(d, labelNextCurr, 1)
  const commentLength = commentLengthBuf.readInt8()
  const [commentBuf, commentNextCurr] = slice(d, commentLengthNextCurr, commentLength)
  const comment = String(commentBuf)

  // afterLabel sequence
  // seq2 - Target: 0x00, Sample: 0x01
  const [afterLabelSeq2] = slice(d, commentNextCurr, 1)
  if (!(afterLabelSeq2.equals(Buffer.from([0x00])) || afterLabelSeq2.equals(Buffer.from([0x01])))) {
    console.log(label, 'afterLabelSeq2 is not [0x00] or [0x01]', afterLabelSeq2)
  }

  // seq3 - 0x02 or 0x07
  // I don't know more detail.
  const [afterLabelSeq3, afterLabelSeqNextCurr] = slice(d, commentNextCurr + 1, 1)
  if (!afterLabelSeq3.equals(Buffer.from([0x02]))) {
    console.log(label, 'afterLabelSeq3 is not [0x02]', afterLabelSeq3)
  }

  // dataCount
  const [reflectCountBuff, reflectCountNextCurr] = slice(d, afterLabelSeqNextCurr, 4)
  const reflectDataCount = reflectCountBuff.readInt32LE()

  // reflectance for each frequency
  let reflectData: number[] = []
  for (let i = 0; i < reflectDataCount; i++) {
    const s = reflectCountNextCurr + i * 8
    const [reflectanceBuff, _] = slice(d, s, 8)
    reflectData.push(reflectanceBuff.readDoubleLE())
  }

  let [reflectPaddBuff, reflectPaddNextCurr] = slice(d, reflectCountNextCurr + reflectDataCount * 8, 16)
  if (
    !reflectPaddBuff.equals(
      Buffer.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
    )
  ) {
    console.log(label, 'reflectancePadding is not [0x00 * 16]', reflectPaddBuff)
  }

  const [uv1, uv1NextCurr] = slice(d, reflectPaddNextCurr, 4)
  const [uv2a, uv2aNextCurr] = slice(d, uv1NextCurr, 4)
  const [uv2b, uv2bNextCurr] = slice(d, uv2aNextCurr, 4)
  const [uv3, uv3NextCurr] = slice(d, uv2bNextCurr, 1)
  if (!uv3.equals(Buffer.from([0x00]))) {
    console.log(label, 'uv5 is not [0x00]', uv3)
  }

  const [uv4, uv4NextCurr] = slice(d, uv3NextCurr, 12)
  if (!uv4.equals(Buffer.from([0xff, 0xff, 0x7f, 0x7f, 0xff, 0xff, 0x7f, 0x7f, 0x00, 0x00, 0x00, 0x00]))) {
    console.log(label, 'uv4 is not [0xff, 0xff, 0x7f, 0x7f, 0xff, 0xff, 0x7f, 0x7f, 0x00, 0x00, 0x00, 0x00]', uv4)
  }

  const [uv5, uv5NextCurr] = slice(d, uv4NextCurr, 4)
  if (!uv5.equals(Buffer.from([0x1e, 0x00, 0x00, 0x00]))) {
    console.log(label, 'uv5 is not [0x1e, 0x00, 0x00, 0x00]', uv5)
  }

  const metaBlock = d.subarray(uv5NextCurr)
  const [, deviceName] = unmarshalDataProperty(metaBlock, Buffer.from([0xd0, 0x7, 0x00, 0x00]))
  const [, deviceVariation] = unmarshalDataProperty(metaBlock, Buffer.from([0xd1, 0x7, 0x00, 0x00]))
  const [, deviceSerialNo] = unmarshalDataProperty(metaBlock, Buffer.from([0xd2, 0x7, 0x00, 0x00]))
  const [, romVersion] = unmarshalDataProperty(metaBlock, Buffer.from([0xd3, 0x7, 0x00, 0x00]))
  const [, captureDate] = unmarshalDataProperty(metaBlock, Buffer.from([0xd5, 0x7, 0x00, 0x00]))
  const [, calibrationDate] = unmarshalDataProperty(metaBlock, Buffer.from([0xd6, 0x7, 0x00, 0x00]))
  const [specularComponentVal, specularComponent] = unmarshalDataProperty(
    metaBlock,
    Buffer.from([0xda, 0x7, 0x00, 0x00])
  )
  const [captureMethodVal, captureMethod] = unmarshalDataProperty(metaBlock, Buffer.from([0xdb, 0x7, 0x00, 0x00]))
  const [geometryVal, geometry] = unmarshalDataProperty(metaBlock, Buffer.from([0xdc, 0x7, 0x00, 0x00]))
  const [specularComponentProcessVal, specularComponentProcess] = unmarshalDataProperty(
    metaBlock,
    Buffer.from([0xdd, 0x7, 0x00, 0x00])
  )

  const [captureCircleVal, captureCircle] = unmarshalDataProperty(metaBlock, Buffer.from([0xde, 0x7, 0x00, 0x00]))

  // Under investigation properties
  // UV条件, 視野, 主光源,第2光源,データ番号,コメント,温度値(CM-512m3),ユーザー校正(CM-512m3A
  const uniderInvestigationMarkers = [
    Buffer.from([0xdf, 0x07, 0x00, 0x00]),
    Buffer.from([0xe6, 0x07, 0x00, 0x00]),
    Buffer.from([0xe7, 0x07, 0x00, 0x00]),
    Buffer.from([0xe8, 0x07, 0x00, 0x00]),
    Buffer.from([0xf9, 0x07, 0x00, 0x00]),
    Buffer.from([0xfd, 0x07, 0x00, 0x00]),
    Buffer.from([0x02, 0x08, 0x00, 0x00]),
    Buffer.from([0xfa, 0x07, 0x00, 0x00]),
    Buffer.from([0xee, 0x07, 0x00, 0x00]),
    Buffer.from([0xef, 0x07, 0x00, 0x00]),
    Buffer.from([0xf1, 0x07, 0x00, 0x00]),
    Buffer.from([0xf2, 0x07, 0x00, 0x00]),
    Buffer.from([0xf3, 0x07, 0x00, 0x00]),
    Buffer.from([0xf4, 0x07, 0x00, 0x00]),
    Buffer.from([0xf5, 0x07, 0x00, 0x00]),
    Buffer.from([0xf6, 0x07, 0x00, 0x00]),
    Buffer.from([0xf7, 0x07, 0x00, 0x00]),
  ]

  const underInvestigation = uniderInvestigationMarkers.map((mark): UnderInvestigationProperty => {
    const [value, text] = unmarshalDataProperty(metaBlock, mark)
    return { mark, value, text }
  })

  // Are there 2 pattern markers? it's really confusing
  // Or is there some definition in some other part of the data?
  // Whatever we need to check the 2 pattern markes.
  let [targetDataNo, targetDataLabel] = [-1, '']
  try {
    ;[targetDataNo, targetDataLabel] = unmarshalDataProperty(metaBlock, Buffer.from([0x90, 0x01, 0x00, 0x00]))
  } catch (e) {
    try {
      ;[targetDataNo, targetDataLabel] = unmarshalDataProperty(metaBlock, Buffer.from([0x68, 0x01, 0x00, 0x00]))
    } catch (e) {
      throw new Error('there are no target data marker: [0x90, 0x01, 0x00, 0x00] or [0x68, 0x01, 0x00, 0x00]')
    }
  }

  // for TGT entity
  let threshold: Threshold | undefined = undefined
  let parameters: Parameters | undefined = undefined
  if (isTarget) {
    const [cmc, cmcActive] = unmarshalThresholdData(metaBlock, Buffer.from([0x7f, 0xc1, 0xff, 0xff]))
    const [dEab, dEabActive] = unmarshalThresholdData(metaBlock, Buffer.from([0x80, 0xc1, 0xff, 0xff]))
    const [dL, dlActive] = unmarshalThresholdData(metaBlock, Buffer.from([0xa1, 0xd4, 0xff, 0xff]))
    const [da, daActive] = unmarshalThresholdData(metaBlock, Buffer.from([0xa2, 0xd4, 0xff, 0xff]))
    const [db, dbActive, dbNextCurr] = unmarshalThresholdData(metaBlock, Buffer.from([0xa3, 0xd4, 0xff, 0xff]))

    threshold = {
      cmc: { values: cmc, active: cmcActive },
      dEab: { values: dEab, active: dEabActive },
      db: { values: dL, active: dlActive },
      da: { values: da, active: daActive },
      dL: { values: db, active: dbActive },
    }

    const [paramsLengthBuff, paramsNextCurr] = slice(metaBlock, dbNextCurr, 4)
    const paramsLength = paramsLengthBuff.readInt32LE()
    if (paramsLength !== 8) {
      throw new Error('unexpected length of color conversion parameters')
    }
    parameters = {
      'cmc-c': 2.0,
      'cmc-l': 1.0,
      'dE94-l': 1.0,
      'dE94-c': 1.0,
      'dE94-h': 1.0,
      'dE00-l': 1.0,
      'dE00-c': 1.0,
      'dE00-h': 1.0,
    }
    for (let i = 0; i < paramsLength; i++) {
      const [v] = slice(metaBlock, paramsNextCurr + i * 4, 4)
      const k = parametersIndex[i]
      parameters[k] = v.readFloatLE()
    }
  }

  const managementDataMarkers = [
    Buffer.from([0x0b, 0x8a, 0xc7, 0x97, 0x9d, 0x83, 0x52, 0x81, 0x5b, 0x83, 0x68, 0x31]),
    Buffer.from([0x0b, 0x8a, 0xc7, 0x97, 0x9d, 0x83, 0x52, 0x81, 0x5b, 0x83, 0x68, 0x32]),
    Buffer.from([0x0b, 0x8a, 0xc7, 0x97, 0x9d, 0x83, 0x52, 0x81, 0x5b, 0x83, 0x68, 0x33]),
    Buffer.from([0x0b, 0x8a, 0xc7, 0x97, 0x9d, 0x83, 0x52, 0x81, 0x5b, 0x83, 0x68, 0x34]),
    Buffer.from([0x0b, 0x8a, 0xc7, 0x97, 0x9d, 0x83, 0x52, 0x81, 0x5b, 0x83, 0x68, 0x35]),
  ]
  const managementData = managementDataMarkers.map((mark) => {
    return unmarshalManagementData(metaBlock, mark)
  })

  const numericalDataMarkers = [
    Buffer.from([0x05, 0x90, 0x94, 0x92, 0x6c, 0x31]),
    Buffer.from([0x05, 0x90, 0x94, 0x92, 0x6c, 0x32]),
    Buffer.from([0x05, 0x90, 0x94, 0x92, 0x6c, 0x33]),
    Buffer.from([0x05, 0x90, 0x94, 0x92, 0x6c, 0x34]),
    Buffer.from([0x05, 0x90, 0x94, 0x92, 0x6c, 0x35]),
  ]
  const numericalData = numericalDataMarkers.map((mark) => {
    return unmarshalNumericalData(metaBlock, mark)
  })

  const XYZ = getXYZFromReflectData(deviceName, reflectData)

  return {
    dataNo,
    label,
    comment,
    reflectDataCount,
    reflectData,
    ...XYZ,
    uv1,
    uv2a,
    uv2b,
    uv3,
    uv4,
    uv5,
    property: {
      deviceName,
      deviceVariation,
      deviceSerialNo,
      romVersion,
      captureDate,
      calibrationDate,
      specularComponentVal,
      specularComponent,
      captureMethodVal,
      captureMethod,
      geometryVal,
      geometry,
      specularComponentProcessVal,
      specularComponentProcess,
      captureCircleVal,
      captureCircle,
      underInvestigation,
    },
    targetDataNo,
    targetDataLabel,
    managementData,
    numericalData,
    threshold,
    parameters,
  }
}

type MesData = {
  targets: Data[]
  samples: Data[]
}
const parseSync = function (data: Buffer): MesData {
  const tgtData = getTargetData(data)
  const splData = getSampleData(data)

  return {
    targets: tgtData,
    samples: splData,
  }
}

export { parseSync }
