# Batchify

This is a lightweight Node.js library that provides function _splitIntoBatches_ for splitting an array of records into batches suitable for delivery to systems with specific limits on record size and batch size. The function accepts as parameter a list of records and return a list of lists.

Installation is done using npm install command: `npm install batchify-va`

## Example usage

```js
const batchify = require("batchify-va")

const data = ['record1', 'record2', 'record3']

const batches = splitIntoBatches(data)

console.log(batches)
```
