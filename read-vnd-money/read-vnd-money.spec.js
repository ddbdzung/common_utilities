const readMoney = require('./read-vnd-money');

const testCases = [
  {
    amount: 0,
    expected: 'Không đồng!',
  },
  {
    amount: 1,
    expected: 'Một đồng',
  },
  {
    amount: 5,
    expected: 'Năm đồng',
  },
  {
    amount: 105,
    expected: 'Một trăm linh năm đồng',
  },
  {
    amount: 1_005,
    expected: 'Một nghìn, không trăm linh năm đồng',
  },
  {
    amount: 1_405,
    expected: 'Một nghìn, bốn trăm linh năm đồng',
  },
  {
    amount: 10_005,
    expected: 'Mười nghìn, không trăm linh năm đồng',
  },
  {
    amount: 100_005,
    expected: 'Một trăm nghìn, không trăm linh năm đồng',
  },
  {
    amount: 1_000_005,
    expected: 'Một triệu, không trăm linh năm đồng',
  },
  {
    amount: 12_345,
    expected: 'Mười hai nghìn, ba trăm bốn mươi lăm đồng',
  },
  {
    amount: 1_005_865_030,
    expected: 'Một tỷ, không trăm linh năm triệu, tám trăm sáu mươi lăm nghìn, không trăm ba mươi đồng',
  },
  {
    amount: 1_000_000_000_000,
    expected: 'Một nghìn tỷ đồng',
  },
  {
    amount: 1_000_000_000_000_000,
    expected: 'Một triệu tỷ đồng',
  },
  {
    amount: 8_234_567_789_000_025,
    expected:
      'Tám triệu tỷ, hai trăm ba mươi bốn nghìn tỷ, năm trăm sáu mươi bảy tỷ, bảy trăm tám mươi chín triệu, không trăm hai mươi lăm đồng',
  },
  {
    amount: 10_234_567_789_000_025,
    expected: 'Số quá lớn!',
  },
  {
    amount: 1_567_789_000_025.123,
    expected:
      'Một nghìn tỷ, năm trăm sáu mươi bảy tỷ, bảy trăm tám mươi chín triệu, không trăm hai mươi lăm đồng phẩy một hai ba',
  },
  {
    amount: -1,
    expected: 'Số tiền âm!',
  },
];
testCases.forEach((testCase) => {
  console.assert(
    readMoney(testCase.amount) === testCase.expected,
    `Failed test case: ${testCase.amount}. 
    Expect: ${testCase.expected}
    Actual: ${readMoney(testCase.amount)}\n`,
  );
});
