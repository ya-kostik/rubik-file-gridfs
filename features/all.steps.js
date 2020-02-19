const fs = require('fs');
const path = require('path');
const assert = require('assert');

const { Then, After, defineParameterType } = require('cucumber');

const waitForStream = require('../lib/waitForStream');
const isFileExists = require('../lib/isFileExists');

defineParameterType({
  name: 'has',
  regexp: /(has|hasn't|should|shouldn't)/,
  transformer: (state) => {
    return state === 'has' || state === 'should';
  }
});

Then('file {string} {has} exists in {string}', async function(fileName, state, dirPath) {
  assert(state === await isFileExists(path.join(__dirname, dirPath, fileName)));
});

Then('content of key {string} in bucket {string} will be equal to content of {string}', async function(fileKey, bucketName, filePath) {

});

Then('content of the returned readable stream will be equal to content of {string}', async function (filePath) {
  let fileContent = '';
  this.readStream.on('data', (chunk) => fileContent += chunk);
  await waitForStream(this.readStream);

  const expectedFileContent = await fs.promises.readFile(
    path.join(__dirname, filePath),
    'utf-8'
  );

  assert.strictEqual(expectedFileContent, fileContent);
});

After(async function() {
  const filesPath = path.join(__dirname, '../files/main/');
  return fs.promises.rmdir(filesPath, { recursive: true }).catch();
});
