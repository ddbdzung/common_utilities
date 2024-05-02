const { clearEscAndSpecialChars } = require('./excel.util');

const testCases = [
  {
    value: 'Hello, World!',
    expected: 'Hello, World!',
  },
  {
    value: 'Hello\x1B, World!',
    expected: 'Hello, World!',
  },
  {
    value: 'Hello\x1B\x1B\x1B, World!',
    expected: 'Hello, World!',
  },
  {
    value: 'Hello\x1B\x1B\x1B, World!\x1B',
    expected: 'Hello, World!',
  },
  {
    value: 'Hello\x1B\x1B\x1B, World!\x1B\x1B\x1B',
    expected: 'Hello, World!',
  },
  {
    value: ` \nKSX-10002\n`,
    expected: ' KSX-10002',
  },
  {
    value: ` \nKSX-10002 \n`,
    expected: ' KSX-10002 ',
  },
  {
    value: ` \nKSX-10002 \n\n\n`,
    expected: ' KSX-10002 ',
  },
];

testCases.forEach((testCase, index) => {
  const { value, expected } = testCase;
  const result = clearEscAndSpecialChars(value);
  console.log(`Test case ${index + 1}`);
  console.assert(result === expected, { value, expected, result });
  console.log(`\n`);
});
