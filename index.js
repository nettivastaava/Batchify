const batchLengthLimit = 500
const maxRecordSize = 1024 * 1024 // 1 MB in bytes
const maxBatchSize = 5 * 1024 * 1024 // 5 MB in bytes

const getRecordByteLength = record => {
  return Buffer.byteLength(record, 'utf8')
}

const checkRecordSize = record => {
  return getRecordByteLength(record) <= maxRecordSize
}

const checkBatchSize = (currentBatchSize, record) => {
  return currentBatchSize + getRecordByteLength(record) <= maxBatchSize
}

const filterValidRecords = data => {
  return data.filter(record => checkRecordSize(record))
}

const addRecordToBatch = (batch, record, currentBatchSize) => ({
  batch: [...batch, record],
  size: currentBatchSize + getRecordByteLength(record)
})

const finalizeBatch = (batches, currentBatch) => (
  currentBatch.batch.length > 0 ? [...batches, currentBatch.batch] : batches
)

const processRecords = records => {
  const initialState = { 
    batches: [], 
    currentBatch: { 
      batch: [], 
      size: 0 
    } 
  }

  return records.reduce((state, record) => {
    const { batches, currentBatch } = state

    if (!checkBatchSize(currentBatch.size, record) || currentBatch.batch.length === batchLengthLimit) {
      const updatedBatches = finalizeBatch(batches, currentBatch)
      const newBatch = addRecordToBatch([], record, 0)

      return { batches: updatedBatches, currentBatch: newBatch }
    }

    const updatedBatch = addRecordToBatch(currentBatch.batch, record, currentBatch.size)

    return { batches, currentBatch: updatedBatch }
  }, initialState)
}

const splitIntoBatches = records => {
  const filteredRecords = filterValidRecords(records)
  const { batches, currentBatch } = processRecords(filteredRecords)
  
  return finalizeBatch(batches, currentBatch)
}

module.exports = splitIntoBatches