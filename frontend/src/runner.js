// Runs the code you write for a coding problem inside a Web Worker,
// so an infinite loop cannot freeze the page. It stops after 3 seconds.
function workerMain() {
  self.onmessage = function (e) {
    var d = e.data;
    var fn;
    try {
      fn = new Function(d.code + '\nreturn ' + d.fnName + ';')();
    } catch (err) {
      var missing = err.name === 'ReferenceError' && err.message.indexOf(d.fnName) === 0;
      self.postMessage({ error: missing ? 'Could not find a function named ' + d.fnName + '. Keep the function name from the starter code.' : err.message });
      return;
    }
    if (typeof fn !== 'function') {
      self.postMessage({ error: 'Could not find a function named ' + d.fnName + '. Keep the function name from the starter code.' });
      return;
    }
    var results = d.tests.map(function (t) {
      try {
        var out = fn.apply(null, JSON.parse(JSON.stringify(t[0])));
        return { ok: JSON.stringify(out) === JSON.stringify(t[1]), got: String(JSON.stringify(out)) };
      } catch (err) {
        return { ok: false, got: 'Error: ' + err.message };
      }
    });
    self.postMessage({ results: results });
  };
}

export function runTests(code, fnName, tests) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(new Blob(['(' + workerMain.toString() + ')()'], { type: 'text/javascript' }));
    const worker = new Worker(url);
    let timer = null;
    const done = (value) => {
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(value);
    };
    timer = setTimeout(() => done({ error: 'Time limit exceeded (3 seconds). Check your code for an infinite loop.' }), 3000);
    worker.onmessage = (e) => done(e.data);
    worker.onerror = (e) => done({ error: e.message || 'Your code crashed.' });
    worker.postMessage({ code, fnName, tests });
  });
}
