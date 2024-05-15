const batchify = require('../index.js')

describe('batchify function', () => {
  test('does not start a new batch if the current one does not exceed 500 records', () => {
    const data = new Array(500).fill('a')
    const batchifiedData = batchify(data)

    expect(batchifiedData.length).toBe(1)
    expect(batchifiedData[0].length).toBe(500)
  })

  test('starts a new batch if the current one exceeds 500 records', () => {
    const data = new Array(501).fill('a')
    const batchifiedData = batchify(data)

    expect(batchifiedData.length).toBe(2)
    expect(batchifiedData[0].length).toBe(500)
    expect(batchifiedData[1].length).toBe(1)
  })

  test('fits all data to one batch if the size does not exceed 5 MB', () => {
    const record = 'a'.repeat(1024 * 1024)
    const data = new Array(5).fill(record)
    const batchifiedData = batchify(data)

    expect(batchifiedData.length).toBe(1)
    expect(batchifiedData[0].length).toBe(5)
})

  test('starts a new batch if the current one exceeds 5 MB', () => {
    const record = 'a'.repeat(1024 * 1024)
    const data = new Array(5).fill(record)
    data.push('a')
    const batchifiedData = batchify(data)

    expect(batchifiedData.length).toBe(2)
    expect(batchifiedData[0].length).toBe(5)
    expect(batchifiedData[1].length).toBe(1)
  })

  test('discards the record if its size exceeds 1 MB', () => {
    const data = ['a'.repeat(1024 * 1024 + 1)]
    const batchifiedData = batchify(data)

    expect(batchifiedData.length).toBe(0)
  })

  test('maintains the order of the records', () => {
    const data = ['1', '2', '3', '4', '5']
    const expectedOutput = [['1', '2', '3', '4', '5']]
    const batchifiedData = batchify(data)
    
    expect(batchifiedData).toStrictEqual(expectedOutput)
  })
})