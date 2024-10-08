# generate-arrays

[![npm](https://img.shields.io/npm/v/generate-arrays)](https://www.npmjs.com/package/generate-arrays)
[![npm](https://img.shields.io/npm/dt/generate-arrays)](https://www.npmjs.com/package/generate-arrays)
[![npm](https://img.shields.io/npm/l/generate-arrays)](https://www.npmjs.com/package/generate-arrays)

Simple, flexible and lightweight array generation

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

```ts
import { GenerateArray } from 'generate-arrays';

GenerateArray.from(value); // Turns any value into an array

GenerateArray.empty(4); // [undefined, undefined, undefined, undefined]

GenerateArray.uniform(4, "Test"); // ["Test", "Test", "Test", "Test"]

GenerateArray.custom(() => Math.floor(Math.random() * 100), 4); // [37, 1, 93, 56]

GenerateArray.counting(1, 10, 2); // [1, 3, 5, 7, 9]

GenerateArray.integers(5, 10, 20); // [15, 17, 12, 19, 11]

GenerateArray.decimals(4, 3, 7); // [3.423553, 4.592846, 6.112083, 5.201873]

GenerateArray.strings(3, 4, 6, true); // ["s5%s#", "kAs*#4", "k2($"]
```

### Custom generators

```ts
import { GenerateArray } from 'generate-arrays';
import { integer, decimal, string, boolean, date,
    phone, uuid, ipAddress, email, url, name } from 'generate-arrays';

// You can define your own generators, or use built-in ones (above) for simplicity
const generators = [
    () => Math.floor(Math.random() * 100),
    () => `User${Math.floor(Math.random() * 100)}`,
    integer(1, 10),
    phone(true, true)
];
GenerateArray.generators(3, generators); // [7, "User37", "1-253-926-7302"]

const weightedGenerators = [
    { generator: () => Math.floor(Math.random() * 100), weight: 0.5 },
    { generator: name(), weight: 0.3 },
    { generator: boolean(), weight: 0.2 }
];
GenerateArray.weightedGenerators(4, weightedGenerators); // [false, 37, "John Smith" 75]

const fixedCountGenerators = [
    { generator: () => Math.floor(Math.random() * 100), count: 2 },
    { generator: () => ipAddress(), count: 1 },
    { generator: () => decimal(), count: 1 }
];
GenerateArray.fixedCountGenerators(fixedCountGenerators); // [17.24326, "192.158.1.38", 92, 28]
```

### Multi-dimensional arrays

```ts
import { GenerateArray } from 'generate-arrays';

GenerateArray.emptyND(2, 3); // [[[], []], [[], []]]

GenerateArray.uniformND(7, 3, 2) // [[7], [7], [7]]

GenerateArray.customND(() => Math.floor(Math.random() * 100), 3, 2); // [[37], [93], [12]]
```

### Utils

```ts
import { ArrayUtils } from 'generate-arrays';

ArrayUtils.flatten([[1, 2], [3, 4]]); // [1, 2, 3, 4]

ArrayUtils.addDimensions([1], 2); // [[[1]]]

ArrayUtils.multiplyLength([1, 2], 3); // [1, 2, 1, 2, 1, 2]

ArrayUtils.removeDuplicates([1, 2, 1, 3, 2]); // [1, 2, 3]
```
