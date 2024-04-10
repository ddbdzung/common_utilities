const NUMBER = new Array(' không ', ' một ', ' hai ', ' ba ', ' bốn ', ' năm ', ' sáu ', ' bảy ', ' tám ', ' chín ');
const UNIT_MONEY = new Array('', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ');

const normalizeString = (str) => {
  return str.trim().replace(/\s+/g, ' ').replace(/,\s*/g, ',').replace(/,/g, ', ');
};

//1. Hàm đọc số có ba chữ số;
const readThreeDigitNumber = (number, isFirst) => {
  let hundreds;
  let tens;
  let units;
  let result = '';

  hundreds = parseInt(number / 100);
  tens = parseInt((number % 100) / 10);
  units = number % 10;

  if (hundreds == 0 && tens == 0 && units == 0) return '';

  if (hundreds != 0 || !isFirst) {
    result += NUMBER[hundreds] + ' trăm ';
    if (tens == 0 && units != 0) result += ' linh ';
  }

  if (tens != 0 && tens != 1) {
    result += NUMBER[tens] + ' mươi';
    if (tens == 0 && units != 0) result = result + ' linh ';
  }

  if (tens == 1) result += ' mười ';

  switch (units) {
    case 1:
      if (tens != 0 && tens != 1) {
        result += ' mốt ';
      } else {
        result += NUMBER[units];
      }
      break;

    case 5:
      if (tens == 0) {
        result += NUMBER[units];
      } else {
        result += ' lăm ';
      }
      break;

    default:
      if (units != 0) {
        result += NUMBER[units];
      }
      break;
  }

  return result;
};

//2. Hàm đọc số thành chữ (Sử dụng hàm đọc số có ba chữ số)
const readMoney = (amount) => {
  let count = 0;
  let i = 0;
  let number = 0;
  let result = '';
  let tmp = '';
  let pointer = new Array();

  if (amount < 0) return 'Số tiền âm!';
  if (amount == 0) return 'Không đồng!';

  number = amount > 0 ? amount : -amount;

  if (amount > Number.MAX_SAFE_INTEGER || !Number.isSafeInteger(amount)) {
    return 'Số quá lớn!'; // Handle numbers larger than the maximum supported value
  }

  pointer[5] = Math.floor(number / 1000000000000000);

  if (isNaN(pointer[5])) pointer[5] = '0';

  number = number - parseFloat(String(pointer[5])) * 1000000000000000;

  pointer[4] = Math.floor(number / 1000000000000);

  if (isNaN(pointer[4])) pointer[4] = '0';

  number = number - parseFloat(String(pointer[4])) * 1000000000000;

  pointer[3] = Math.floor(number / 1000000000);

  if (isNaN(pointer[3])) pointer[3] = '0';

  number = number - parseFloat(String(pointer[3])) * 1000000000;

  pointer[2] = parseInt(number / 1000000);

  if (isNaN(pointer[2])) pointer[2] = '0';

  pointer[1] = parseInt((number % 1000000) / 1000);

  if (isNaN(pointer[1])) pointer[1] = '0';

  pointer[0] = parseInt(number % 1000);

  if (isNaN(pointer[0])) pointer[0] = '0';

  if (pointer[5] > 0) {
    count = 5;
  } else if (pointer[4] > 0) {
    count = 4;
  } else if (pointer[3] > 0) {
    count = 3;
  } else if (pointer[2] > 0) {
    count = 2;
  } else if (pointer[1] > 0) {
    count = 1;
  } else {
    count = 0;
  }

  for (i = count; i >= 0; i--) {
    tmp = readThreeDigitNumber(pointer[i], i === count);
    result += tmp;
    if (pointer[i] > 0) result += UNIT_MONEY[i];
    if (i > 0 && tmp.length > 0) result += ','; //&& (!string.IsNullOrEmpty(tmp))
  }

  if (result.substring(result.length - 1) == ',') {
    result = result.substring(0, result.length - 1);
  }

  result = result.substring(1, 2).toUpperCase() + result.substring(2) + ' đồng';

  return normalizeString(result); //.substring(0, 1);//.toUpperCase();// + result.substring(1);
};

module.exports = readMoney;
