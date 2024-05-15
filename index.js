const batchLengthLimit = 500
const maxRecordSize = 1024 * 1024 // 1 MB in bytes
const maxBatchSize = 5 * 1024 * 1024 // 5 MB in bytes

const getRecordByteLength = (record) => {
  return Buffer.byteLength(record, 'utf8')
}

const checkRecordSize = (record) => {
  const bytes = getRecordByteLength(record)

  return bytes <= maxRecordSize
}

const checkBatchSize = (currentBatchSize, record) => {
  return currentBatchSize + getRecordByteLength(record) <= maxBatchSize
}

const batchify = (data) => {
  const batches = []
  let currentBatch = []
  let currentBatchSize = 0

  for (i = 0; i < data.length; i++) {
    const record = data[i]

    if (!checkRecordSize(record)) {
      continue
    }

    if (!checkBatchSize(currentBatchSize, record)) {
      batches.push(currentBatch)
      currentBatch = []
      currentBatchSize = 0
    }

    currentBatch.push(record)
    currentBatchSize += getRecordByteLength(record)

    if (currentBatch.length === batchLengthLimit) {
        batches.push(currentBatch)
        currentBatch = []
        currentBatchSize = 0
    }

  }

  if (currentBatch.length > 0) {
    batches.push(currentBatch)
  }
  
  return batches
}

module.exports = batchify