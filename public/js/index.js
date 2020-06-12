const testUrl = "https://raw.githubusercontent.com/teamdigitale/api-starter-kit-python/master/openapi/simple.yaml.src";

function parseUrl() {
  url = document.getElementById('oas_url').value;
  if (url == "") {
    url = testUrl
    document.getElementById('oas_url').value = testUrl
  }
  lintUrl(url);
}

function clearUrl() {
  document.getElementById('oas_url').value = '';
}

function renderStatistics(statistics) {
  e = statistics[0];
  w = statistics[1];

  document.getElementById('errors-badge').classList = !e ? "badge badge-success" : "badge badge-danger"
  document.getElementById('warnings-badge').classList = !w ? "badge badge-success" : "badge badge-warning"

  // Show/Hide the Success badge.
  if (!e && !w) {
    document.getElementById('badge-valid-oas').classList.remove("d-none");
  } else {
    document.getElementById('badge-valid-oas').classList.add("d-none");
  }
  document.getElementById('errors-count').innerHTML = e;
  document.getElementById('warnings-count').innerHTML = w;
}

async function parseText() {
  // unmark old errored lines
  console.log("Unmark old errored lines.")
  marked_lines = document.getElementsByClassName('line-error')
  Array.prototype.forEach.call(marked_lines, (x) => { x.classList.remove("line-error") })

  oasText = editor.getValue();
  document.getElementById('error-lines').innerHTML = '';
  document.getElementById('header-error-lines').innerHTML = '';
  await lintSpec(oasText);
}

async function lintSpec(oas) {
  const lint = await api_oas_checker.parse(oas, window.location.href + '/spectral.yml');
  console.log("lint: ", lint);

  // mark errored lines
  lint.length == 0 || createHeader();
  lint.forEach(highlightError);

  // Count errors and warnings.
  var statistics = { 0: 0, 1: 0, 2: 0 };
  lint.forEach((e) => {
    statistics[e.severity] += 1;
  });
  console.debug("error statistics", statistics);
  renderStatistics(statistics);
}
function lintUrl(url) {
  const myUrl = url
  fetch(myUrl).then(function (r) {
    r.text().then(function (oas) {
      console.log("Updating editor.");
      editor.getDoc().setValue(oas);
      return lintSpec(oas);
    });
  });
};

function createHeader() {
  const s = `
    <div class="col-sm-1"></div>
    <div class="col-sm-1">line</div>
    <div class="col-sm-4">error</div>
    <div class="col-sm-6">message</div>
  `;
  document.getElementById('header-error-lines').innerHTML = s;
}

function highlightError(entry) {
  line = entry.range.start.line;
  ch = entry.range.start.character
  console.log("line:" + line);
  editor.addLineClass(line, 'background', 'line-error');
  switch (entry.severity) {
    case 0:
      severityStyle = "danger";
      severityIcon = "error"
      break;
    case 1:
      severityStyle = "warning";
      severityIcon = "warning-circle";
      break;
    default:
      severityStyle = "primary";
      severityIcon = "help"
  }

  tooltip = "errored path: #/" + entry.path.join("/");
  message_md = marked(entry.message);
  error_line = `<div class="row text-${severityStyle}" onClick="show_error(${line},${ch});"
		data-toggle="tooltip" title="${tooltip}">`
    + `<div class="col-sm-1" >`
    + `<svg class="icon align-middle">`
    + `<use xlink:href="svg/sprite.svg#it-${severityIcon}"></use></svg>`
    + `</div>`
    + `<div class="col-sm-1">${line + 1}</div>`
    + `<div class="col-sm-4">${entry.code}</div>`
    + `<div class="col-sm-6 text-break">${message_md}</div>`
    + `</div>`;

  document.getElementById('error-lines').innerHTML += error_line;
}

/**
 * Focus CodeMirror on the errored line.
 */
function show_error(line, ch) {
  editor.focus();
  editor.setCursor({ line: line, ch: ch });
}

var myTextarea = document.getElementById('oas_text');
var editor = CodeMirror.fromTextArea(myTextarea, {
  lineNumbers: true,
  styleSelected: true,
  mode: "text/x-yaml",
  theme: "darcula",
  extraKeys: {
    "Tab": function(cm){
      cm.replaceSelection("   " , "end");
    }
  }
});

var counter = Date.now();
function selectivelyParse() {
  const refresh_interval = 5000;  // milliseconds
  if ((Date.now() - counter) < refresh_interval) {
    console.log("too early");
    return;
  }
  counter = Date.now();
  parseText();
}
editor.on('change', (event) => { selectivelyParse(); });

window.addEventListener('load', function() {
    pageUrl = new URL(window.location.href);
    if(pageUrl.searchParams.get('url')){
        document.getElementById('oas_url').value = pageUrl.searchParams.get('url');
        parseUrl();
    }
})
