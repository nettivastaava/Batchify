const splitIntoBatches = require('../index.js')
const generateRecords = require('./utils.js')

describe('splitIntoBatches function', () => {
  test('does not start a new batch if the current one does not exceed 500 records', () => {
    const data = generateRecords(500, 'a')
    const batchifiedData = splitIntoBatches(data)

    expect(batchifiedData.length).toBe(1)
    expect(batchifiedData[0].length).toBe(500)
  })

  test('starts a new batch if the current one exceeds 500 records', () => {
    const data = generateRecords(501, 'a')
    const batchifiedData = splitIntoBatches(data)

    expect(batchifiedData.length).toBe(2)
    expect(batchifiedData[0].length).toBe(500)
    expect(batchifiedData[1].length).toBe(1)
  })

  test('fits all data to one batch if the size does not exceed 5 MB', () => {
    const record = 'a'.repeat(1024 * 1024)
    const data = generateRecords(5, record)
    const batchifiedData = splitIntoBatches(data)

    expect(batchifiedData.length).toBe(1)
    expect(batchifiedData[0].length).toBe(5)
})

  test('starts a new batch if the current one exceeds 5 MB', () => {
    const record = 'a'.repeat(1024 * 1024)
    const data = generateRecords(5, record)
    data.push('a')
    const batchifiedData = splitIntoBatches(data)

    expect(batchifiedData.length).toBe(2)
    expect(batchifiedData[0].length).toBe(5)
    expect(batchifiedData[1].length).toBe(1)
  })

  test('discards the record if its size exceeds 1 MB', () => {
    const data = ['a'.repeat(1024 * 1024 + 1)]
    const batchifiedData = splitIntoBatches(data)

    expect(batchifiedData.length).toBe(0)
  })

  test('maintains the order of the records', () => {
    const data = ['1', '2', '3', '4', '5']
    const expectedOutput = [['1', '2', '3', '4', '5']]
    const batchifiedData = splitIntoBatches(data)
    
    expect(batchifiedData).toStrictEqual(expectedOutput)
  })
})