import {isEqual} from 'lodash';

export const checkFirstValue = (firstValue, secondValue) => {
  return isEqual(firstValue, secondValue) ? firstValue : secondValue;
};

export const checkLastValue = (firstValue, secondValue) => {
  return isEqual(firstValue, secondValue) ? secondValue : firstValue;
};

export const isArrayEqual = (firstArray, secondArray) =>
  JSON.stringify(firstArray) === JSON.stringify(secondArray);
