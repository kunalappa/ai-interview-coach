// Interview question bank. Each item: [question, keywords to look for, short ideal answer]
const RAW = {
  'Full Stack Developer': {
    beginner: [
      ['What is a REST API, and which HTTP methods do you use most?', ['get', 'post', 'put', 'delete', 'resource', 'status code', 'stateless'], 'A REST API exposes resources through URLs. GET reads, POST creates, PUT updates and DELETE removes. It is stateless and replies with status codes such as 200, 201 and 404.'],
      ['What happens when a user submits a login form on your website?', ['request', 'hash', 'database', 'token', 'response', 'https'], 'The browser sends the credentials over HTTPS. The server finds the user and compares the password hash, then returns a session or token. The page updates based on the response.'],
      ['What is the difference between SQL and NoSQL databases?', ['table', 'schema', 'document', 'join', 'scale', 'relational'], 'SQL databases are relational, with tables, fixed schemas and joins. NoSQL stores flexible documents or key-value pairs and often scales out more easily. Choose based on the shape of your data.'],
    ],
    intermediate: [
      ['Compare JWT authentication with session-based authentication.', ['token', 'cookie', 'session', 'stateless', 'expire', 'signature', 'httponly'], 'Sessions keep state on the server and send a cookie. JWTs are signed tokens the client sends back, so the server stays stateless. Tokens need expiry and safe storage, such as an httpOnly cookie.'],
      ['What is CORS and why does the browser enforce it?', ['origin', 'browser', 'header', 'preflight', 'allow', 'policy'], 'CORS is a browser policy that blocks pages from reading responses from another origin unless the server allows it with headers. Some requests send a preflight OPTIONS request first.'],
      ['How would you model a many-to-many relationship in a database?', ['join table', 'foreign key', 'primary key', 'index', 'normalization'], 'Use a join table holding two foreign keys, one to each table, with a composite primary key. Add indexes on the foreign keys so lookups stay fast.'],
    ],
    advanced: [
      ['Design a URL shortener that can handle millions of links.', ['hash', 'database', 'cache', 'redis', 'load balancer', 'collision', 'analytics', 'scaling'], 'Generate a short unique code, for example base62 of an ID. Store code to URL in a database and put a cache like Redis in front for reads. Use a load balancer, handle collisions, and record clicks asynchronously for analytics.'],
      ['Two users try to book the same appointment slot at the same moment. How do you prevent a double booking?', ['transaction', 'lock', 'isolation', 'unique constraint', 'optimistic', 'version', 'idempotent'], 'Put a unique constraint on the slot, or lock the row inside a transaction. Optimistic locking with a version field also works. The losing request gets a clear conflict error, and retries are idempotent.'],
      ['How do you secure a full stack application end to end?', ['validation', 'sanitization', 'injection', 'xss', 'csrf', 'rate limit', 'hashing', 'https', 'secrets'], 'Validate and sanitize all input, use parameterized queries against injection, and escape output to stop XSS. Add CSRF protection, rate limits, password hashing, HTTPS, and keep secrets out of the code.'],
    ],
  },
  'Java Developer': {
    beginner: [
      ['What is the difference between the JDK, the JRE and the JVM?', ['compiler', 'javac', 'runtime', 'bytecode', 'virtual machine', 'development kit'], 'The JDK is the full kit with the compiler and tools. The JRE is what you need to run Java programs. The JVM runs bytecode, which makes Java platform independent.'],
      ['What is the difference between an abstract class and an interface?', ['abstract', 'interface', 'multiple inheritance', 'default method', 'implements', 'extends'], 'A class extends one abstract class but can implement many interfaces. Abstract classes can hold state and constructors. Interfaces define a contract, and since Java 8 they can have default methods.'],
      ['How does a HashMap work internally?', ['hash', 'bucket', 'key', 'equals', 'collision', 'hashcode'], 'HashMap calls hashCode on the key to pick a bucket. Keys that land in the same bucket are compared with equals. Collisions are stored in a list or tree, which keeps lookups close to constant time.'],
    ],
    intermediate: [
      ['What is the difference between checked and unchecked exceptions?', ['runtime', 'compile', 'throws', 'try', 'catch', 'checked', 'unchecked'], 'Checked exceptions must be caught or declared with throws, and the compiler enforces it. Unchecked exceptions extend RuntimeException and usually show programming errors.'],
      ['What is dependency injection in Spring, and why is it useful?', ['injection', 'bean', 'container', 'loose coupling', 'autowired', 'testing', 'inversion of control'], 'Spring creates objects (beans) and injects their dependencies, so classes do not build them. This is inversion of control. It gives loose coupling and makes testing easier because you can inject mocks.'],
      ['How do you make a class thread-safe?', ['synchronized', 'volatile', 'lock', 'atomic', 'immutable', 'concurrent'], 'Prefer immutable objects. Otherwise protect shared state with synchronized blocks or locks, use atomic classes and concurrent collections, and use volatile for simple visibility.'],
    ],
    advanced: [
      ['How does garbage collection work in the JVM, and how would you tune it?', ['heap', 'generation', 'young', 'old', 'gc', 'pause', 'g1', 'memory leak'], 'Objects start in the young generation and move to the old generation if they survive. Collectors like G1 balance pause time and throughput. Tune heap size and pause goals, and use GC logs to find leaks.'],
      ['Design a rate limiter for a Spring Boot REST API.', ['token bucket', 'redis', 'filter', 'sliding window', 'per user', '429', 'distributed'], 'Use a filter or interceptor that counts requests per user or key with a token bucket or sliding window. Keep counters in Redis so it works across servers, and return 429 with a Retry-After header.'],
      ['A Spring Boot service has become slow in production. How do you find the cause?', ['profiling', 'thread dump', 'database', 'query', 'index', 'cache', 'metrics', 'connection pool'], 'Check metrics and logs first, then take thread dumps and profile. Look at slow queries and missing indexes, connection pool exhaustion and cache misses. Fix the biggest bottleneck and measure again.'],
    ],
  },
  'React Developer': {
    beginner: [
      ['What is the virtual DOM?', ['virtual', 'diff', 'reconciliation', 'update', 'real dom', 'render'], 'The virtual DOM is a lightweight copy of the UI in memory. React compares the new tree with the old one (diffing) and updates only the parts of the real DOM that changed.'],
      ['What is the difference between props and state?', ['props', 'state', 'immutable', 'parent', 'rerender', 'local'], 'Props are inputs passed from a parent and are read-only. State is data owned by a component that can change, and changing it triggers a re-render.'],
      ['What is useEffect and when does it run?', ['side effect', 'dependency', 'mount', 'cleanup', 'render', 'array'], 'useEffect runs side effects such as fetching data after render. The dependency array controls when it re-runs, an empty array means only on mount, and the returned function does cleanup.'],
    ],
    intermediate: [
      ['How do you avoid unnecessary re-renders in React?', ['memo', 'usememo', 'usecallback', 'key', 'state', 'split'], 'Keep state close to where it is used and split large components. Use React.memo, useMemo and useCallback where measurements show a problem, and use stable keys in lists.'],
      ['What is the difference between controlled and uncontrolled components?', ['controlled', 'uncontrolled', 'value', 'onchange', 'ref', 'form'], 'A controlled input gets its value from React state and updates through onChange. An uncontrolled input keeps its own value in the DOM and you read it with a ref.'],
      ['How do you manage global state in a React app?', ['context', 'redux', 'zustand', 'prop drilling', 'reducer', 'server state'], 'Use context for simple shared values and a store such as Redux or Zustand for complex state. Avoid prop drilling, and keep server data in a data-fetching library instead of global state.'],
    ],
    advanced: [
      ['Explain reconciliation and why keys matter in lists.', ['reconciliation', 'key', 'fiber', 'diff', 'identity', 'list'], 'React diffs the old and new trees. Keys give list items a stable identity so React can reorder them instead of recreating them. Using array indexes as keys can cause wrong state and bugs.'],
      ['How would you structure a large React app for performance and maintainability?', ['code splitting', 'lazy', 'suspense', 'feature', 'folder', 'bundle', 'memo', 'testing'], 'Organize by feature, share a small design system, and split code with lazy and Suspense to keep the bundle small. Measure before using memo, and cover key flows with tests.'],
      ['A React page is slow or leaking memory. How do you debug it?', ['profiler', 'cleanup', 'subscription', 'listener', 'devtools', 'render', 'virtualization'], 'Use the React Profiler and browser devtools to find slow renders. Check effects for missing cleanup of listeners, timers and subscriptions, and virtualize long lists.'],
    ],
  },
  'Data Engineer': {
    beginner: [
      ['What is ETL?', ['extract', 'transform', 'load', 'source', 'warehouse', 'pipeline'], 'ETL means extract data from sources, transform it by cleaning and reshaping, then load it into a destination such as a data warehouse. A pipeline automates these steps.'],
      ['What is the difference between OLTP and OLAP?', ['transaction', 'analytics', 'row', 'column', 'warehouse', 'read'], 'OLTP systems handle many small transactions, such as orders. OLAP systems run large analytical queries over historical data, often in a column-based warehouse.'],
      ['What are a primary key and an index?', ['unique', 'lookup', 'speed', 'index', 'key', 'duplicate'], 'A primary key uniquely identifies each row and prevents duplicates. An index is a structure that speeds up lookups on a column, at the cost of slower writes and extra storage.'],
    ],
    intermediate: [
      ['When would you choose batch processing over streaming?', ['batch', 'stream', 'latency', 'kafka', 'real-time', 'schedule'], 'Use batch when results can wait, such as a nightly report, because it is simpler and cheaper. Use streaming, for example with Kafka, when you need low latency or real-time results.'],
      ['How do you make sure the data in your pipeline is good quality?', ['validation', 'null', 'duplicate', 'schema', 'monitor', 'alert', 'test'], 'Validate the schema, check for nulls and duplicates, and add tests on key columns. Monitor row counts and freshness, and alert when something breaks.'],
      ['What is partitioning and why does it help?', ['partition', 'scan', 'date', 'performance', 'shuffle', 'cost'], 'Partitioning splits a table by a column such as date. Queries then scan only the partitions they need, which improves performance and lowers cost.'],
    ],
    advanced: [
      ['Design a pipeline that ingests 100 million rows every day.', ['idempotent', 'partition', 'incremental', 'retry', 'orchestration', 'airflow', 'schema', 'backfill'], 'Load incrementally into date partitions and make every step idempotent so retries are safe. Use an orchestrator such as Airflow, handle schema changes, and support backfills.'],
      ['How do you handle slowly changing dimensions?', ['scd', 'type 2', 'history', 'surrogate key', 'effective date', 'dimension'], 'With SCD Type 2 you keep history by adding a new row for each change, with a surrogate key and effective start and end dates, plus a current flag.'],
      ['A Spark job is running very slowly. How do you investigate?', ['skew', 'shuffle', 'partition', 'cache', 'broadcast', 'executor', 'spark ui'], 'Open the Spark UI to find slow stages. Look for data skew and heavy shuffles, tune partitions and executors, broadcast small tables, and cache data that is reused.'],
    ],
  },
};

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const ROLES = Object.keys(RAW);
const ALL = [];

ROLES.forEach((role) => {
  LEVELS.forEach((level) => {
    RAW[role][level].forEach((item, i) => {
      ALL.push({
        id: role.toLowerCase().replace(/[^a-z]+/g, '-') + '-' + level + '-' + (i + 1),
        role,
        level,
        text: item[0],
        keywords: item[1],
        sample: item[2],
      });
    });
  });
});

function getQuestions(role, level) {
  return ALL.filter((q) => q.role === role && q.level === level);
}

function findQuestion(id) {
  return ALL.find((q) => q.id === id);
}

module.exports = { ROLES, LEVELS, getQuestions, findQuestion };
