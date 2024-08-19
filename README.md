# generate-arrays

[![npm](https://img.shields.io/npm/v/generate-arrays)](https://www.npmjs.com/package/generate-arrays)
[![npm](https://img.shields.io/npm/dt/generate-arrays)](https://www.npmjs.com/package/generate-arrays)
[![npm](https://img.shields.io/npm/l/generate-arrays)](https://www.npmjs.com/package/generate-arrays)

Simple, flexible, lightweight and fast array generation

## 📦 Installation

```bash
npm i generate-arrays

# Or
pnpm i generate-arrays

# Or
yarn add generate-arrays
```

## 📘Usage

### Basic functions

```js
import { GenerateArray } from 'generate-arrays';

GenerateArray.uniform(4, "Test"); // ["Test", "Test", "Test", "Test"]

GenerateArray.custom(() => Math.floor(Math.random() * 100), 4); // [37, 1, 93, 56]

GenerateArray.counting(1, 10, 2); // [1, 3, 5, 7, 9]

GenerateArray.integers(5, 10, 20); // [15, 17, 12, 19, 11]

GenerateArray.decimals(4, 3, 7); // [3.423553, 4.592846, 6.112083, 5.201873]

GenerateArray.strings(3, 4, 6, true); // ["s5%s#", "kAs*#4", "k2($"]
```

### Custom generators

```js
import { GenerateArray } from 'generate-arrays';

const generators = [
    () => Math.floor(Math.random() * 100),
    () => Math.random() * 100, () => Math.random() > 0.5
];
GenerateArray.generators(3, generators); // [37, 93.2, true]

const weightedGenerators = [
    { generator: () => Math.floor(Math.random() * 100), weight: 0.5 },
    { generator: () => Math.random() * 100, weight: 0.3 },
    { generator: () => Math.random() > 0.5, weight: 0.2 }
];
GenerateArray.weightedGenerators(5, weightedGenerators); // [37, 93.2, true, 37, 93.2]

const fixedCountGenerators = [
    { generator: () => Math.floor(Math.random() * 100), count: 2 },
    { generator: () => Math.random() * 100, count: 2 },
    { generator: () => Math.random() > 0.5, count: 1 }
];
GenerateArray.fixedCountGenerators(5, fixedCountGenerators); // [17.2, false, 92, 28, 67.3]
```

### Multi-dimensional arrays

```js
import { GenerateArray } from 'generate-arrays';

GenerateArray.emptyND(2, 3); // [[[], []], [[], []]]

GenerateArray.uniformND(7, 3, 2) // [[7], [7], [7]]

GenerateArray.customND(() => Math.floor(Math.random() * 100), 3, 2); // [[37], [93], [12]]
```
