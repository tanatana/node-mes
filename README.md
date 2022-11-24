# Thrid-pirty MES file parser for Node.js (and the web)

## Install

Installation command is `npm install git+https://github.com/tanatana/node-mes.git`.

## Usage

```js
const mes = require('mes')
const fs = require('fs')

const mesFile = fs.readFileSync('path/to/mesfile')

const data = mes.parseSync(mesFile)
console.dir(data, { depth: null })
// {
//   targets: [
//     {
//       dataNo: 1,
//       label: 'Black Target',
//       reflectDataCount: 31,
//       reflectData: [
//         2.3345626990000405, 1.8383665482203166,
//         1.7726358970006306, 1.7612707217534382,
//         1.7666171391805015, 1.7424037059148154,
//         1.7286412318547568, 1.7216317256291709,
//      ...snip...
//      }
//   ],
//   samples: [
//    {
//      dataNo: 1,
//      label: 'Green Sample',
//      reflectDataCount: 39,
//      reflectData: [
//         29.99666666666667,  32.00666666666666,  27.96333333333334,
//         21.82666666666667, 17.130000000000003, 13.793333333333333,
//        11.580000000000002, 10.313333333333334,  9.896666666666667,
//    ...snip...
//    }
//   ]
// }
```
