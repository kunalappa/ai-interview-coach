// Coding problems. tests: [[arguments], expected result]
const PROBLEMS = [
  {
    id: 'two-sum', title: 'Two sum', difficulty: 'Easy', topic: 'Arrays',
    description: 'Given an array of numbers and a target, return the indices of the two numbers that add up to the target. Return the smaller index first. There is exactly one answer.\n\nExample: twoSum([2, 7, 11, 15], 9) returns [0, 1]',
    fnName: 'twoSum',
    starter: 'function twoSum(nums, target) {\n  // write your code here\n}\n',
    tests: [[[[2, 7, 11, 15], 9], [0, 1]], [[[3, 2, 4], 6], [1, 2]], [[[3, 3], 6], [0, 1]], [[[1, 5, 8, 3], 11], [2, 3]]],
  },
  {
    id: 'reverse-string', title: 'Reverse a string', difficulty: 'Easy', topic: 'Strings',
    description: 'Return the string reversed.\n\nExample: reverseString("hello") returns "olleh"',
    fnName: 'reverseString',
    starter: 'function reverseString(s) {\n  // write your code here\n}\n',
    tests: [[['hello'], 'olleh'], [[''], ''], [['a'], 'a'], [['Claude'], 'edualC']],
  },
  {
    id: 'palindrome-check', title: 'Palindrome check', difficulty: 'Easy', topic: 'Strings',
    description: 'Return true if the text reads the same forwards and backwards. Ignore upper or lower case and ignore anything that is not a letter or a number.\n\nExample: isPalindrome("A man, a plan, a canal: Panama") returns true',
    fnName: 'isPalindrome',
    starter: 'function isPalindrome(s) {\n  // write your code here\n}\n',
    tests: [[['A man, a plan, a canal: Panama'], true], [['race a car'], false], [[''], true], [['No lemon, no melon'], true]],
  },
  {
    id: 'fizzbuzz', title: 'FizzBuzz', difficulty: 'Easy', topic: 'Loops',
    description: 'Return an array of strings from 1 to n. For multiples of 3 use "Fizz", for multiples of 5 use "Buzz", and for multiples of both use "FizzBuzz". Otherwise use the number as a string.\n\nExample: fizzBuzz(5) returns ["1", "2", "Fizz", "4", "Buzz"]',
    fnName: 'fizzBuzz',
    starter: 'function fizzBuzz(n) {\n  // write your code here\n}\n',
    tests: [[[5], ['1', '2', 'Fizz', '4', 'Buzz']], [[3], ['1', '2', 'Fizz']], [[15], ['1', '2', 'Fizz', '4', 'Buzz', 'Fizz', '7', '8', 'Fizz', 'Buzz', '11', 'Fizz', '13', '14', 'FizzBuzz']]],
  },
  {
    id: 'valid-parentheses', title: 'Valid parentheses', difficulty: 'Medium', topic: 'Stacks',
    description: 'The text contains only the characters ( ) [ ] { }. Return true if every bracket is closed by the same type in the correct order.\n\nExample: isValid("()[]{}") returns true, isValid("(]") returns false',
    fnName: 'isValid',
    starter: 'function isValid(s) {\n  // write your code here\n}\n',
    tests: [[['()'], true], [['()[]{}'], true], [['(]'], false], [['([)]'], false], [['{[]}'], true]],
  },
  {
    id: 'longest-substring', title: 'Longest substring without repeats', difficulty: 'Medium', topic: 'Sliding window',
    description: 'Return the length of the longest part of the text that has no repeating characters.\n\nExample: lengthOfLongestSubstring("abcabcbb") returns 3',
    fnName: 'lengthOfLongestSubstring',
    starter: 'function lengthOfLongestSubstring(s) {\n  // write your code here\n}\n',
    tests: [[['abcabcbb'], 3], [['bbbbb'], 1], [['pwwkew'], 3], [[''], 0], [['dvdf'], 3]],
  },
  {
    id: 'max-subarray', title: 'Maximum subarray', difficulty: 'Medium', topic: 'Dynamic programming',
    description: 'Return the largest sum of any continuous part of the array. The array has at least one number.\n\nExample: maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) returns 6',
    fnName: 'maxSubArray',
    starter: 'function maxSubArray(nums) {\n  // write your code here\n}\n',
    tests: [[[[-2, 1, -3, 4, -1, 2, 1, -5, 4]], 6], [[[1]], 1], [[[5, 4, -1, 7, 8]], 23], [[[-3, -1, -2]], -1]],
  },
  {
    id: 'merge-intervals', title: 'Merge intervals', difficulty: 'Medium', topic: 'Sorting',
    description: 'You get a list of [start, end] intervals. Merge all overlapping intervals and return the result sorted by start.\n\nExample: merge([[1,3],[2,6],[8,10]]) returns [[1,6],[8,10]]',
    fnName: 'merge',
    starter: 'function merge(intervals) {\n  // write your code here\n}\n',
    tests: [[[[[1, 3], [2, 6], [8, 10], [15, 18]]], [[1, 6], [8, 10], [15, 18]]], [[[[1, 4], [4, 5]]], [[1, 5]]], [[[[5, 6], [1, 2]]], [[1, 2], [5, 6]]]],
  },
  {
    id: 'trapping-rain-water', title: 'Trapping rain water', difficulty: 'Hard', topic: 'Two pointers',
    description: 'The array shows the height of bars that are 1 unit wide. Return how many units of water are trapped between the bars after it rains.\n\nExample: trap([0,1,0,2,1,0,1,3,2,1,2,1]) returns 6',
    fnName: 'trap',
    starter: 'function trap(height) {\n  // write your code here\n}\n',
    tests: [[[[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], 6], [[[4, 2, 0, 3, 2, 5]], 9], [[[]], 0], [[[3, 0, 3]], 3]],
  },
];

module.exports = { PROBLEMS };
