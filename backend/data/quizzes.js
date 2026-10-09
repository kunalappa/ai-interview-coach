// Quiz bank. answer = index of the correct option (starting at 0)
const QUIZZES = [
  {
    id: 'javascript-basics', title: 'JavaScript basics', topic: 'JavaScript', difficulty: 'Easy',
    questions: [
      { text: 'What does typeof null return?', options: ['null', 'object', 'undefined', 'number'], answer: 1 },
      { text: 'Which array method adds an item to the end?', options: ['push', 'pop', 'shift', 'unshift'], answer: 0 },
      { text: 'What does === check?', options: ['Value only', 'Type only', 'Value and type', 'Memory address only'], answer: 2 },
      { text: 'Which keyword declares a block-scoped variable that cannot be reassigned?', options: ['var', 'let', 'static', 'const'], answer: 3 },
      { text: 'What does Array.map return?', options: ['A single value', 'A new array', 'The same array', 'undefined'], answer: 1 },
    ],
  },
  {
    id: 'react-essentials', title: 'React essentials', topic: 'React', difficulty: 'Medium',
    questions: [
      { text: 'Which hook is used for side effects such as fetching data?', options: ['useState', 'useRef', 'useEffect', 'useMemo'], answer: 2 },
      { text: 'Why do list items need a key?', options: ['To style them', 'To help React identify which items changed', 'To sort them', 'To fetch their data'], answer: 1 },
      { text: 'Which of these must you never change directly?', options: ['State', 'A CSS class', 'An import', 'A constant'], answer: 0 },
      { text: 'What happens when you change ref.current?', options: ['The component re-renders', 'State resets', 'The component unmounts', 'Nothing re-renders'], answer: 3 },
      { text: 'What is JSX?', options: ['A database language', 'A syntax extension for JavaScript', 'A CSS preprocessor', 'A bundler'], answer: 1 },
    ],
  },
  {
    id: 'sql-databases', title: 'SQL and databases', topic: 'Databases', difficulty: 'Medium',
    questions: [
      { text: 'Which clause filters rows after grouping?', options: ['WHERE', 'ORDER BY', 'HAVING', 'LIMIT'], answer: 2 },
      { text: 'What does a foreign key do?', options: ['Encrypts a column', 'Links a row to the primary key of another table', 'Makes every query faster', 'Stores a password'], answer: 1 },
      { text: 'Which join returns only rows that match in both tables?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'CROSS JOIN'], answer: 0 },
      { text: 'An index mainly improves what?', options: ['Disk size', 'Security', 'Write speed', 'Read lookup speed'], answer: 3 },
      { text: 'What does the A in ACID stand for?', options: ['Availability', 'Atomicity', 'Accuracy', 'Authority'], answer: 1 },
    ],
  },
  {
    id: 'java-core', title: 'Java core', topic: 'Java', difficulty: 'Hard',
    questions: [
      { text: 'Which of these is NOT a primitive type in Java?', options: ['int', 'boolean', 'String', 'double'], answer: 2 },
      { text: 'Which collection does not allow duplicate elements?', options: ['ArrayList', 'HashSet', 'LinkedList', 'Vector'], answer: 1 },
      { text: 'What does the final keyword on a class mean?', options: ['It cannot be extended', 'It cannot be instantiated', 'It must be abstract', 'It is thread-safe'], answer: 0 },
      { text: 'Which keyword declares the exceptions a method may throw?', options: ['try', 'catch', 'finally', 'throws'], answer: 3 },
      { text: 'What is the default value of an int field in a class?', options: ['null', '-1', '0', 'undefined'], answer: 2 },
    ],
  },
];

module.exports = { QUIZZES };
