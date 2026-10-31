// ดึงข้อมูลผู้ใช้จาก localStorage
let currentUser = JSON.parse(localStorage.getItem("numer_google_user") || "null");

// ----------------- GOOGLE AUTHENTICATION -----------------
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT parse error:", e);
    return null;
  }
}

function handleCredentialResponse(response) {
  const userObj = parseJwt(response.credential);
  if (userObj) {
    currentUser = {
      name: userObj.name || userObj.given_name || "User",
      picture: userObj.picture || ""
    };
    localStorage.setItem("numer_google_user", JSON.stringify(currentUser));
    updateAuthUI();
  }
}

function updateAuthUI() {
  const signInBtn = document.getElementById("googleSignInBtn");
  const profileDiv = document.getElementById("userProfile");
  const avatar = document.getElementById("userAvatar");
  const nameSpan = document.getElementById("userName");
  const notice = document.getElementById("authNotice");

  if (currentUser) {
    if (signInBtn) signInBtn.style.display = "none";
    if (profileDiv) profileDiv.style.display = "flex";
    if (avatar && currentUser.picture) {
      avatar.src = currentUser.picture;
      avatar.style.display = "block";
    }
    if (nameSpan) nameSpan.innerText = currentUser.name;
    if (notice) notice.innerHTML = `✅ กำลังใช้งานโดย: <b>${currentUser.name}</b> (ระบบจะบันทึกทุกปัญหาที่คุณแก้)`;
  } else {
    if (signInBtn) signInBtn.style.display = "block";
    if (profileDiv) profileDiv.style.display = "none";
    if (notice) notice.innerHTML = `ℹ️ ระบบจะบันทึกประวัติเฉพาะเมื่อคุณเข้าสู่ระบบด้วย Google เท่านั้น`;
  }
}

function logoutGoogle() {
  currentUser = null;
  localStorage.removeItem("numer_google_user");
  updateAuthUI();
}

function generateShortId() {
  return Math.random().toString(36).substring(2, 8);
}

// ----------------- SOLVER & CORE METHODS -----------------
const problemSolutions = {
  ROOT_OF_EQUATION: [
    { id: "BISECTION", name: "Bisection Method" },
    { id: "FALSE_POSITION", name: "False Position" },
    { id: "NEWTON_RAPHSON", name: "Newton Raphson" }
  ],
  LINEAR_ALGEBRA: [
    { id: "GAUSS_JORDAN", name: "Gauss-Jordan Elimination (RREF)" },
    { id: "CRAMER", name: "Cramer's Rule" }
  ],
  INTERPOLATION: [
    { id: "NEWTON_DIVIDED", name: "Newton's Divided Difference" },
    { id: "LAGRANGE", name: "Lagrange Interpolation" }
  ],
  EXTRAPOLATION: [
    { id: "LINEAR_REGRESSION", name: "Linear Regression (m*x + c)" },
    { id: "POLYNOMIAL_REGRESSION", name: "Polynomial Regression (Degree 2)" }
  ],
  INTEGRATION: [
    { id: "TRAPEZOIDAL", name: "Trapezoidal Rule" },
    { id: "SIMPSON", name: "Simpson's 1/3 Rule" }
  ],
  DIFFERENTIATION: [
    { id: "CENTRAL_DIFF", name: "Central Divided Difference" },
    { id: "FORWARD_DIFF", name: "Forward Divided Difference" },
    { id: "BACKWARD_DIFF", name: "Backward Divided Difference" }
  ]
};

function updateSolutionOptions() {
  const prob = document.getElementById("problemType").value;
  const solSelect = document.getElementById("solutionType");
  solSelect.innerHTML = "";

  problemSolutions[prob].forEach(sol => {
    const opt = document.createElement("option");
    opt.value = sol.id;
    opt.innerText = sol.name;
    solSelect.appendChild(opt);
  });

  renderDynamicInputs();
}

let matrixDimension = 3;

function renderDynamicInputs() {
  const prob = document.getElementById("problemType").value;
  const sol = document.getElementById("solutionType").value;
  const container = document.getElementById("dynamicInputs");

  if (prob === "ROOT_OF_EQUATION") {
    if (sol === "NEWTON_RAPHSON") {
      container.innerHTML = `
        <div class="grid-inputs">
          <div class="field-group">
            <label>ฟังก์ชัน f(x):</label>
            <input type="text" id="fnInput" placeholder="เช่น x^2 - 4">
          </div>
          <div class="field-group">
            <label>จุดเริ่มต้น X₀:</label>
            <input type="number" id="x0Input" placeholder="เช่น 3" step="any">
          </div>
          <div class="field-group">
            <label>Error Tolerance (%):</label>
            <input type="number" id="tolInput" placeholder="เช่น 0.0001" step="any">
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="grid-inputs">
          <div class="field-group">
            <label>ฟังก์ชัน f(x):</label>
            <input type="text" id="fnInput" placeholder="เช่น x^2 - 4">
          </div>
          <div class="field-group">
            <label>ขอบเขตล่าง (X_L):</label>
            <input type="number" id="xlInput" placeholder="เช่น 0" step="any">
          </div>
          <div class="field-group">
            <label>ขอบเขตบน (X_R):</label>
            <input type="number" id="xrInput" placeholder="เช่น 3" step="any">
          </div>
          <div class="field-group">
            <label>Error Tolerance (%):</label>
            <input type="number" id="tolInput" placeholder="เช่น 0.0001" step="any">
          </div>
        </div>
      `;
    }
  } else if (prob === "LINEAR_ALGEBRA") {
    container.innerHTML = `
      <div class="matrix-container">
        <div style="display: flex; gap: 1rem; align-items: center;">
          <label style="font-size: 0.85rem; font-weight: 600; color: var(--text-muted);">มิติของเมทริกซ์ (Matrix Size):</label>
          <select id="matrixDimSelect" onchange="changeMatrixDimension(this.value)" style="width: 100px;">
            <option value="2">2 × 2</option>
            <option value="3" selected>3 × 3</option>
            <option value="4">4 × 4</option>
          </select>
        </div>
        <div id="matrixInputGrid"></div>
      </div>
    `;
    buildMatrixInputs(matrixDimension);
  } else if (prob === "INTERPOLATION" || prob === "EXTRAPOLATION") {
    container.innerHTML = `
      <div class="grid-inputs">
        <div class="field-group" style="grid-column: 1 / -1;">
          <label>ชุดจุดข้อมูล (Points x, y คั่นด้วยบรรทัดใหม่):</label>
          <textarea id="pointsInput" rows="4" placeholder="เช่น&#10;0, 9.81&#10;20000, 9.7487&#10;40000, 9.6879&#10;80000, 9.5682"></textarea>
        </div>
        <div class="field-group">
          <label>ค่า x ที่ต้องการคำนวณ:</label>
          <input type="number" id="targetXInput" placeholder="เช่น 42285" step="any">
        </div>
      </div>
    `;
  } else if (prob === "INTEGRATION") {
    container.innerHTML = `
      <div class="grid-inputs">
        <div class="field-group">
          <label>ฟังก์ชัน f(x):</label>
          <input type="text" id="fnInput" placeholder="เช่น x^7 + 2*x^3 - 1">
        </div>
        <div class="field-group">
          <label>ขอบเขตล่าง (a):</label>
          <input type="number" id="aInput" placeholder="เช่น -1" step="any">
        </div>
        <div class="field-group">
          <label>ขอบเขตบน (b):</label>
          <input type="number" id="bInput" placeholder="เช่น 2" step="any">
        </div>
        <div class="field-group">
          <label>จำนวนช่วงย่อย (n):</label>
          <input type="number" id="nInput" placeholder="เช่น 6" min="1" step="1">
        </div>
      </div>
    `;
  } else if (prob === "DIFFERENTIATION") {
    container.innerHTML = `
      <div class="grid-inputs">
        <div class="field-group">
          <label>ฟังก์ชัน f(x):</label>
          <input type="text" id="fnInput" placeholder="เช่น e^x">
        </div>
        <div class="field-group">
          <label>จุดที่ต้องการหาอนุพันธ์ (x):</label>
          <input type="number" id="diffXInput" placeholder="เช่น 2" step="any">
        </div>
        <div class="field-group">
          <label>ขนาดก้าว Step size (h):</label>
          <input type="number" id="stepHInput" placeholder="เช่น 0.05" step="any">
        </div>
      </div>
    `;
  }
}

function changeMatrixDimension(dim) {
  matrixDimension = parseInt(dim);
  buildMatrixInputs(matrixDimension);
}

function buildMatrixInputs(dim) {
  const container = document.getElementById("matrixInputGrid");
  if (!container) return;

  let html = `<div class="matrix-grid" style="grid-template-columns: repeat(${dim + 2}, auto);">`;
  for (let r = 0; r < dim; r++) {
    for (let c = 0; c < dim; c++) {
      html += `<input type="number" id="mat_a_${r}_${c}" placeholder="A[${r+1},${c+1}]" step="any">`;
    }
    html += `<span class="matrix-equal">=</span>`;
    html += `<input type="number" id="mat_b_${r}" placeholder="B[${r+1}]" step="any">`;
  }
  html += `</div>`;
  container.innerHTML = html;
}

function evaluateFn(expr, xVal) {
  return math.evaluate(expr, { x: xVal, e: Math.E, pi: Math.PI });
}

// ----------------- SOLVE HANDLER -----------------
function solveProblem() {
  const prob = document.getElementById("problemType").value;
  const sol = document.getElementById("solutionType").value;
  const prec = parseInt(document.getElementById("precisionInput").value) || 6;

  try {
    let resultData = null;

    if (prob === "ROOT_OF_EQUATION") {
      resultData = runRootOfEquation(sol, prec);
    } else if (prob === "LINEAR_ALGEBRA") {
      resultData = runLinearAlgebra(sol, prec);
    } else if (prob === "INTERPOLATION") {
      resultData = runInterpolation(sol, prec);
    } else if (prob === "EXTRAPOLATION") {
      resultData = runExtrapolation(sol, prec);
    } else if (prob === "INTEGRATION") {
      resultData = runIntegration(sol, prec);
    } else if (prob === "DIFFERENTIATION") {
      resultData = runDifferentiation(sol, prec);
    }

    if (resultData) {
      displayFormulaNote(sol);

      // เงื่อนไข: จะบันทึกปัญหาลงตารางประวัติเฉพาะเมื่อผู้ใช้ล็อกอินเท่านั้น
      if (currentUser) {
        saveHistory({
          id: generateShortId(),
          problemJson: resultData.problemJson,
          user: currentUser.name,
          date: formatThaiDateTime(new Date()),
          iterations: resultData.iterations || 0
        });
      }
    }
  } catch (err) {
    alert("เกิดข้อผิดพลาดในการคำนวณ: " + err.message);
  }
}

function formatThaiDateTime(date) {
  const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const time = date.toTimeString().split(' ')[0];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear() + 543;
  return `${time} ${day} ${month} ${year}`;
}

// ----------------- ALGORITHMS IMPLEMENTATION -----------------
function runRootOfEquation(sol, prec) {
  const fnInput = document.getElementById("fnInput");
  const tolInput = document.getElementById("tolInput");
  if (!fnInput.value.trim() || !tolInput.value) {
    alert("กรุณากรอกสมการ f(x) และค่า Error Tolerance");
    return null;
  }

  const fnStr = fnInput.value.trim();
  const tol = parseFloat(tolInput.value);
  let steps = [], root = null, iters = 0;
  let pJson = "";

  if (sol === "BISECTION" || sol === "FALSE_POSITION") {
    let xl = parseFloat(document.getElementById("xlInput").value);
    let xr = parseFloat(document.getElementById("xrInput").value);
    pJson = JSON.stringify({ xStart: xl, xEnd: xr, errorFactor: tol, func: fnStr });

    let fL = evaluateFn(fnStr, xl), fR = evaluateFn(fnStr, xr);
    if (fL * fR > 0) {
      alert("คำเตือน: f(X_L) และ f(X_R) ต้องมีเครื่องหมายต่างกัน");
      return null;
    }

    let xm = 0, xmOld = null;
    while (iters < 100) {
      iters++;
      xm = (sol === "BISECTION") ? (xl + xr) / 2 : ((xl * fR) - (xr * fL)) / (fR - fL);
      let fM = evaluateFn(fnStr, xm);
      let error = (iters > 1 && xm !== 0) ? Math.abs((xm - xmOld) / xm) * 100 : null;

      steps.push({ iter: iters, xl, xr, xm, fM, error: error !== null ? error : "-" });
      if (Math.abs(fM) === 0 || (error !== null && error < tol)) { root = xm; break; }
      if (fL * fM < 0) { xr = xm; fR = fM; } else { xl = xm; fL = fM; }
      xmOld = xm; root = xm;
    }

    renderTable(["Iter", "X_L", "X_R", "X_M", "f(X_M)", "Error (%)"], steps, prec);
    renderRootGraph(fnStr, steps[0].xl, steps[0].xr, root);
  } else if (sol === "NEWTON_RAPHSON") {
    let xCurr = parseFloat(document.getElementById("x0Input").value);
    pJson = JSON.stringify({ x0: xCurr, errorFactor: tol, func: fnStr });
    let dExpr = null;
    try { dExpr = math.derivative(fnStr, 'x'); } catch {}

    while (iters < 100) {
      iters++;
      let fx = evaluateFn(fnStr, xCurr);
      let dfx = dExpr ? dExpr.evaluate({ x: xCurr }) : (evaluateFn(fnStr, xCurr + 1e-7) - evaluateFn(fnStr, xCurr - 1e-7)) / 2e-7;
      if (Math.abs(dfx) < 1e-12) break;

      let xNext = xCurr - (fx / dfx);
      let error = (xNext !== 0) ? Math.abs((xNext - xCurr) / xNext) * 100 : null;

      steps.push({ iter: iters, xCurr, fx, dfx, xNext, error: error !== null ? error : "-" });
      if (error !== null && error < tol) { root = xNext; break; }
      xCurr = xNext; root = xCurr;
    }

    renderTable(["Iter", "X_n", "f(X_n)", "f'(X_n)", "X_n+1", "Error (%)"], steps, prec);
    renderRootGraph(fnStr, parseFloat(document.getElementById("x0Input").value) - 2, parseFloat(document.getElementById("x0Input").value) + 2, root);
  }

  showResult(`Root Solution: x ≈ ${root.toFixed(prec)}`);
  return { problemJson: pJson, iterations: iters };
}

function runLinearAlgebra(sol, prec) {
  const dim = matrixDimension;
  let A = [], b = [];

  for (let r = 0; r < dim; r++) {
    A[r] = [];
    for (let c = 0; c < dim; c++) {
      let val = parseFloat(document.getElementById(`mat_a_${r}_${c}`).value);
      if (isNaN(val)) { alert("กรุณากรอกตัวเลข Matrix ให้ครบ"); return null; }
      A[r][c] = val;
    }
    let bVal = parseFloat(document.getElementById(`mat_b_${r}`).value);
    if (isNaN(bVal)) { alert("กรุณากรอกตัวเลข Matrix B ให้ครบ"); return null; }
    b[r] = bVal;
  }

  let solutions = [], steps = [];

  if (sol === "GAUSS_JORDAN") {
    let mat = A.map((row, i) => [...row, b[i]]);
    let lead = 0;
    for (let r = 0; r < mat.length; r++) {
      if (mat[0].length <= lead) break;
      let i = r;
      while (mat[i][lead] === 0) {
        i++;
        if (mat.length === i) { i = r; lead++; if (mat[0].length === lead) break; }
      }
      if (mat[0].length === lead) break;
      let tmp = mat[i]; mat[i] = mat[r]; mat[r] = tmp;
      let val = mat[r][lead];
      for (let j = 0; j < mat[0].length; j++) mat[r][j] /= val;
      for (let k = 0; k < mat.length; k++) {
        if (k === r) continue;
        let factor = mat[k][lead];
        for (let j = 0; j < mat[0].length; j++) mat[k][j] -= factor * mat[r][j];
      }
      lead++;
    }
    for (let i = 0; i < dim; i++) {
      solutions.push(mat[i][dim]);
      steps.push({ var: `x${i + 1}`, equation: `Row ${i + 1} Result`, value: mat[i][dim] });
    }
    renderTable(["Variable", "Description", "Value"], steps, prec);
  } else if (sol === "CRAMER") {
    let detA = math.det(A);
    for (let i = 0; i < dim; i++) {
      let Ai = A.map((row, rIdx) => row.map((val, cIdx) => cIdx === i ? b[rIdx] : val));
      let detAi = math.det(Ai);
      let xi = detAi / detA;
      solutions.push(xi);
      steps.push({ var: `x${i + 1}`, detAi, detA, result: xi });
    }
    renderTable(["Variable", "det(Ai)", "det(A)", "x_i"], steps, prec);
  }

  document.getElementById("graphContainer").style.display = "none";
  let solStr = solutions.map((s, idx) => `x${idx + 1} = ${s.toFixed(prec)}`).join(", ");
  showResult(`Solution: (${solStr})`);
  return { problemJson: JSON.stringify({ matrixA: A, matrixB: b }), iterations: dim };
}

function parsePoints() {
  const text = document.getElementById("pointsInput").value.trim();
  if (!text) { alert("กรุณากรอกชุดจุดข้อมูล"); return null; }
  let pts = [];
  for (let line of text.split("\n")) {
    let parts = line.split(",").map(v => parseFloat(v.trim()));
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      pts.push({ x: parts[0], y: parts[1] });
    }
  }
  return pts;
}

function runInterpolation(sol, prec) {
  const pts = parsePoints();
  if (!pts) return null;
  const targetX = parseFloat(document.getElementById("targetXInput").value);
  const n = pts.length;
  let estimatedY = 0, steps = [];

  if (sol === "NEWTON_DIVIDED") {
    let table = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) table[i][0] = pts[i].y;
    for (let j = 1; j < n; j++) {
      for (let i = 0; i < n - j; i++) {
        table[i][j] = (table[i + 1][j - 1] - table[i][j - 1]) / (pts[i + j].x - pts[i].x);
      }
    }
    estimatedY = table[0][0];
    let term = 1;
    steps.push({ order: 0, term: `b0 = ${table[0][0].toFixed(prec)}`, value: estimatedY });
    for (let j = 1; j < n; j++) {
      term *= (targetX - pts[j - 1].x);
      estimatedY += table[0][j] * term;
      steps.push({ order: j, term: `b${j} term`, value: estimatedY });
    }
    renderTable(["Order (n)", "Term Calculation", "Cumulative y"], steps, prec);
  } else if (sol === "LAGRANGE") {
    for (let i = 0; i < n; i++) {
      let L = 1;
      for (let j = 0; j < n; j++) if (i !== j) L *= (targetX - pts[j].x) / (pts[i].x - pts[j].x);
      let termVal = L * pts[i].y;
      estimatedY += termVal;
      steps.push({ i: i + 1, point: `(${pts[i].x}, ${pts[i].y})`, L_i: L, termVal });
    }
    renderTable(["i", "Point", "Weight L_i(x)", "L_i(x) * y_i"], steps, prec);
  }

  renderPointsGraph(pts, targetX, estimatedY, "Interpolation Curve");
  showResult(`Interpolation at x = ${targetX}: y ≈ ${estimatedY.toFixed(prec)}`);
  return { problemJson: JSON.stringify({ points: pts, targetX }), iterations: 0 };
}

function runExtrapolation(sol, prec) {
  const pts = parsePoints();
  if (!pts) return null;
  const targetX = parseFloat(document.getElementById("targetXInput").value);
  const n = pts.length;
  let estimatedY = 0, steps = [];

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  pts.forEach(p => { sumX += p.x; sumY += p.y; sumXY += p.x * p.y; sumX2 += p.x * p.x; });

  if (sol === "LINEAR_REGRESSION") {
    let m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    let c = (sumY - m * sumX) / n;
    estimatedY = m * targetX + c;
    steps.push({ param: "Slope (m)", value: m }, { param: "Intercept (c)", value: c }, { param: "Predicted y", value: estimatedY });
    renderTable(["Parameter", "Value"], steps, prec);
    renderPointsGraph(pts, targetX, estimatedY, `Linear Fit: y = ${m.toFixed(2)}x + ${c.toFixed(2)}`);
  } else {
    let sumX3 = 0, sumX4 = 0, sumX2Y = 0;
    pts.forEach(p => { sumX3 += Math.pow(p.x, 3); sumX4 += Math.pow(p.x, 4); sumX2Y += Math.pow(p.x, 2) * p.y; });
    let coeffs = math.lusolve([[n, sumX, sumX2], [sumX, sumX2, sumX3], [sumX2, sumX3, sumX4]], [sumY, sumXY, sumX2Y]).map(v => v[0]);
    estimatedY = coeffs[0] + coeffs[1] * targetX + coeffs[2] * Math.pow(targetX, 2);
    steps.push({ param: "a0", value: coeffs[0] }, { param: "a1", value: coeffs[1] }, { param: "a2", value: coeffs[2] }, { param: "Predicted y", value: estimatedY });
    renderTable(["Coefficient", "Value"], steps, prec);
    renderPointsGraph(pts, targetX, estimatedY, "Polynomial Fit");
  }

  showResult(`Extrapolation at x = ${targetX}: y ≈ ${estimatedY.toFixed(prec)}`);
  return { problemJson: JSON.stringify({ points: pts, targetX }), iterations: 0 };
}

function runIntegration(sol, prec) {
  const fnStr = document.getElementById("fnInput").value.trim();
  const a = parseFloat(document.getElementById("aInput").value);
  const b = parseFloat(document.getElementById("bInput").value);
  let n = parseInt(document.getElementById("nInput").value);

  if (sol === "SIMPSON" && n % 2 !== 0) {
    n += 1;
    document.getElementById("nInput").value = n;
  }

  const h = (b - a) / n;
  let xVals = [], yVals = [], weights = [];

  for (let i = 0; i <= n; i++) {
    let cx = a + i * h;
    xVals.push(cx);
    yVals.push(evaluateFn(fnStr, cx));
    weights.push(sol === "TRAPEZOIDAL" ? ((i === 0 || i === n) ? 1 : 2) : ((i === 0 || i === n) ? 1 : (i % 2 !== 0 ? 4 : 2)));
  }

  let sum = 0, steps = [];
  for (let i = 0; i <= n; i++) {
    let term = weights[i] * yVals[i];
    sum += term;
    steps.push({ i, x: xVals[i], fx: yVals[i], weight: weights[i], total: term });
  }

  let area = (sol === "TRAPEZOIDAL") ? (h / 2) * sum : (h / 3) * sum;
  renderTable(["i", "x_i", "f(x_i)", "Weight", "Weight * f(x_i)"], steps, prec);
  renderIntegrationGraph(fnStr, a, b, xVals, yVals);

  showResult(`Integration Result: I ≈ ${area.toFixed(prec)}`);
  return { problemJson: JSON.stringify({ func: fnStr, a, b, n }), iterations: n };
}

function runDifferentiation(sol, prec) {
  const fnStr = document.getElementById("fnInput").value.trim();
  const x = parseFloat(document.getElementById("diffXInput").value);
  const h = parseFloat(document.getElementById("stepHInput").value);

  let approx = 0, formulaDesc = "";
  if (sol === "FORWARD_DIFF") {
    approx = (evaluateFn(fnStr, x + h) - evaluateFn(fnStr, x)) / h;
    formulaDesc = "Forward";
  } else if (sol === "BACKWARD_DIFF") {
    approx = (evaluateFn(fnStr, x) - evaluateFn(fnStr, x - h)) / h;
    formulaDesc = "Backward";
  } else {
    approx = (evaluateFn(fnStr, x + h) - evaluateFn(fnStr, x - h)) / (2 * h);
    formulaDesc = "Central";
  }

  let steps = [
    { desc: "x Value", value: x },
    { desc: "Step size (h)", value: h },
    { desc: `Formula: ${formulaDesc}`, value: approx }
  ];

  renderTable(["Property", "Value"], steps, prec);
  renderDiffGraph(fnStr, x, approx);
  showResult(`f'(${x}) ≈ ${approx.toFixed(prec)}`);
  return { problemJson: JSON.stringify({ order: 1, error: "h", direction: formulaDesc.toLowerCase(), func: fnStr, x, h }), iterations: 0 };
}

// ----------------- PRESETS LOADER -----------------
function loadPreset(type) {
  if (type === 'root') {
    document.getElementById("problemType").value = "ROOT_OF_EQUATION";
    updateSolutionOptions();
    document.getElementById("solutionType").value = "BISECTION";
    renderDynamicInputs();
    document.getElementById("fnInput").value = "x^2 - 4";
    document.getElementById("xlInput").value = "0";
    document.getElementById("xrInput").value = "3";
    document.getElementById("tolInput").value = "0.0001";
  } else if (type === 'linear') {
    document.getElementById("problemType").value = "LINEAR_ALGEBRA";
    updateSolutionOptions();
    document.getElementById("solutionType").value = "GAUSS_JORDAN";
    renderDynamicInputs();
    const matrixA = [[-2, 3, 1], [3, 4, -5], [1, -2, 1]];
    const matrixB = [9, 0, -5];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) document.getElementById(`mat_a_${r}_${c}`).value = matrixA[r][c];
      document.getElementById(`mat_b_${r}`).value = matrixB[r];
    }
  } else if (type === 'interp' || type === 'extra') {
    document.getElementById("problemType").value = type === 'interp' ? "INTERPOLATION" : "EXTRAPOLATION";
    updateSolutionOptions();
    renderDynamicInputs();
    document.getElementById("pointsInput").value = "0, 9.81\n20000, 9.7487\n40000, 9.6879\n80000, 9.5682";
    document.getElementById("targetXInput").value = "42285";
  } else if (type === 'integ') {
    document.getElementById("problemType").value = "INTEGRATION";
    updateSolutionOptions();
    document.getElementById("solutionType").value = "SIMPSON";
    renderDynamicInputs();
    document.getElementById("fnInput").value = "x^7 + 2*x^3 - 1";
    document.getElementById("aInput").value = "-1";
    document.getElementById("bInput").value = "2";
    document.getElementById("nInput").value = "6";
  } else if (type === 'diff') {
    document.getElementById("problemType").value = "DIFFERENTIATION";
    updateSolutionOptions();
    document.getElementById("solutionType").value = "CENTRAL_DIFF";
    renderDynamicInputs();
    document.getElementById("fnInput").value = "e^x";
    document.getElementById("diffXInput").value = "2";
    document.getElementById("stepHInput").value = "0.05";
  }
}

// ----------------- FORMULA NOTE HELPER -----------------
function displayFormulaNote(sol) {
  const container = document.getElementById("formulaContent");
  if (!container) return;

  const formulaData = {
    BISECTION: {
      title: "Bisection Method (การแบ่งครึ่งช่วง)",
      desc: "แบ่งครึ่งช่วงเพื่อค้นหารากสมการ โดยตรวจสอบเงื่อนไข f(X_L) * f(X_R) < 0 เพื่อให้มั่นใจว่ามีรากคำตอบอยู่ในช่วง",
      formula: "จุดกึ่งกลาง: X_m = (X_L + X_R) / 2\nความคลาดเคลื่อน: ε_a = |(X_m_new - X_m_old) / X_m_new| × 100%"
    },
    FALSE_POSITION: {
      title: "False Position Method (การประมาณค่าเชิงเส้น)",
      desc: "เชื่อมเส้นตรงระหว่างจุดขอบเขตเพื่อหาจุดตัดแกน x สำหรับประมาณค่ารากสมการที่รวดเร็วกว่าการแบ่งครึ่งช่วง",
      formula: "จุดตัด: X_m = [X_L · f(X_R) - X_R · f(X_L)] / [f(X_R) - f(X_L)]\nความคลาดเคลื่อน: ε_a = |(X_m_new - X_m_old) / X_m_new| × 100%"
    },
    NEWTON_RAPHSON: {
      title: "Newton-Raphson Method",
      desc: "ใช้ความชันเส้นสัมผัส (Derivative) จากจุดเริ่มต้นเพื่อลู่เข้าหาคำตอบอย่างรวดเร็ว (Quadratic Convergence)",
      formula: "สูตรวนซ้ำ: X_{n+1} = X_n - [f(X_n) / f'(X_n)]\nความคลาดเคลื่อน: ε_a = |(X_{n+1} - X_n) / X_{n+1}| × 100%"
    },
    GAUSS_JORDAN: {
      title: "Gauss-Jordan Elimination (RREF)",
      desc: "แปลงเมทริกซ์แต่งเติม [A | b] ให้อยู่ในรูปขั้นบันไดลดรูป (Reduced Row Echelon Form) เพื่อหาค่าคำตอบ x1, x2, ..., xn โดยตรง",
      formula: "ขั้นตอนหลัก: 1) Partial Pivoting สลับแถว  2) นำ Pivot ไปหารทั้งแถว  3) กำจัดแถวอื่นด้วย Row Operations"
    },
    CRAMER: {
      title: "Cramer's Rule",
      desc: "หาคำตอบของระบบสมการเชิงเส้นโดยใช้ดีเทอร์มิแนนต์ (Determinant) ของเมทริกซ์",
      formula: "สูตรคำนวณ: x_i = det(A_i) / det(A)\n(โดยที่ A_i คือเมทริกซ์ A ที่ถูกแทนที่หลักที่ i ด้วยเวกเตอร์ b)"
    },
    NEWTON_DIVIDED: {
      title: "Newton's Divided Difference Interpolation",
      desc: "สร้างพหุนามการประมาณค่าในช่วงด้วยตารางผลต่างสืบเนื่อง",
      formula: "P(x) = f[x0] + f[x0, x1](x - x0) + f[x0, x1, x2](x - x0)(x - x1) + ..."
    },
    LAGRANGE: {
      title: "Lagrange Interpolation",
      desc: "ประมาณค่าฟังก์ชันในช่วงด้วยการถ่วงน้ำหนักพหุนามลากรองจ์ (Lagrange Polynomial Weights)",
      formula: "P(x) = Σ [L_i(x) · y_i]\nโดยที่ L_i(x) = Π [(x - x_j) / (x_i - x_j)] สำหรับทุก j ≠ i"
    },
    LINEAR_REGRESSION: {
      title: "Linear Regression (การถดถอยเชิงเส้น)",
      desc: "สร้างสมการเส้นตรงแนวโน้มที่สอดคล้องกับกลุ่มจุดข้อมูลมากที่สุดด้วยระเบียบวิธีกำลังสองน้อยสุด",
      formula: "สมการ: y = m·x + c\nความชัน: m = [nΣxy - ΣxΣy] / [nΣx² - (Σx)²]\nจุดตัดแกน y: c = [Σy - mΣx] / n"
    },
    POLYNOMIAL_REGRESSION: {
      title: "Polynomial Regression (Degree 2)",
      desc: "สร้างสมการพาราโบลาเส้นโค้งแนวโน้ม y = a0 + a1·x + a2·x²",
      formula: "แก้ระบบสมการ Normal Equations 3x3 ด้วย Least Squares"
    },
    TRAPEZOIDAL: {
      title: "Trapezoidal Rule (กฎสี่เหลี่ยมคางหมู)",
      desc: "ประมาณพื้นที่ใต้กราฟด้วยผลรวมของรูปสี่เหลี่ยมคางหมูย่อยจำนวน n ช่วง",
      formula: "ความกว้างช่วง: h = (b - a) / n\nสูตรคำนวณ: I = (h / 2) · [f(x0) + 2Σf(xi) + f(xn)]"
    },
    SIMPSON: {
      title: "Simpson's 1/3 Rule",
      desc: "ประมาณพื้นที่ใต้กราฟด้วยพหุนามกำลังสองพาดผ่านจุด (ต้องการจำนวนช่วง n เป็นเลขคู่เสมอ)",
      formula: "ความกว้างช่วง: h = (b - a) / n\nสูตรคำนวณ: I = (h / 3) · [f(x0) + 4Σf(x_odd) + 2Σf(x_even) + f(xn)]"
    },
    CENTRAL_DIFF: {
      title: "Central Divided Difference",
      desc: "ประมาณค่าความชัน f'(x) โดยใช้ค่าฟังก์ชันทั้งหน้าและหลังจุด x",
      formula: "สูตรคำนวณ: f'(x) ≈ [f(x + h) - f(x - h)] / (2h)"
    },
    FORWARD_DIFF: {
      title: "Forward Divided Difference",
      desc: "ประมาณค่าอนุพันธ์ f'(x) โดยใช้ค่าฟังก์ชันที่จุดถัดไป",
      formula: "สูตรคำนวณ: f'(x) ≈ [f(x + h) - f(x)] / h"
    },
    BACKWARD_DIFF: {
      title: "Backward Divided Difference",
      desc: "ประมาณค่าอนุพันธ์ f'(x) โดยใช้ค่าฟังก์ชันที่จุดก่อนหน้า",
      formula: "สูตรคำนวณ: f'(x) ≈ [f(x) - f(x - h)] / h"
    }
  };

  const info = formulaData[sol];
  if (!info) return;

  container.innerHTML = `
    <h4>${info.title}</h4>
    <p>${info.desc}</p>
    <div class="formula-code">${info.formula.replace(/\n/g, '<br>')}</div>
  `;
}

// ----------------- UI / PLOTLY HELPERS -----------------
function showResult(text) {
  document.getElementById("outputSection").style.display = "flex";
  document.getElementById("resultValue").innerText = text;
}

function renderTable(headers, rows, prec) {
  const thead = document.getElementById("tableHead");
  thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;

  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = rows.map(r => {
    const vals = Object.values(r);
    return `<tr>${vals.map(v => typeof v === 'number' ? `<td>${v.toFixed(prec)}</td>` : `<td>${v}</td>`).join('')}</tr>`;
  }).join('');
}

function renderRootGraph(fnStr, minX, maxX, root) {
  document.getElementById("graphContainer").style.display = "block";
  const padding = Math.abs(maxX - minX) * 0.4 || 2;
  const xStart = Math.min(minX, root) - padding;
  const xEnd = Math.max(maxX, root) + padding;
  let xPlot = [], yPlot = [];

  for (let i = 0; i <= 120; i++) {
    let x = xStart + i * ((xEnd - xStart) / 120);
    xPlot.push(x);
    try { yPlot.push(evaluateFn(fnStr, x)); } catch { yPlot.push(null); }
  }

  const traces = [
    { x: xPlot, y: yPlot, type: 'scatter', mode: 'lines', name: 'f(x)', line: { color: '#6366f1', width: 2.5 } },
    { x: [root], y: [evaluateFn(fnStr, root)], type: 'scatter', mode: 'markers', name: 'Root', marker: { color: '#34d399', size: 12, symbol: 'diamond' } }
  ];
  plotChart(traces);
}

function renderIntegrationGraph(fnStr, a, b, xVals, yVals) {
  document.getElementById("graphContainer").style.display = "block";
  let xPlot = [], yPlot = [];
  for (let i = 0; i <= 150; i++) {
    let x = a + i * ((b - a) / 150);
    xPlot.push(x);
    try { yPlot.push(evaluateFn(fnStr, x)); } catch { yPlot.push(null); }
  }

  const traces = [
    { x: xPlot, y: yPlot, type: 'scatter', mode: 'lines', fill: 'tozeroy', fillcolor: 'rgba(99, 102, 241, 0.25)', name: 'Area', line: { color: '#6366f1' } },
    { x: xVals, y: yVals, type: 'scatter', mode: 'markers', name: 'Subintervals', marker: { color: '#fb923c', size: 8 } }
  ];
  plotChart(traces);
}

function renderPointsGraph(pts, targetX, targetY, curveName) {
  document.getElementById("graphContainer").style.display = "block";
  pts.sort((a, b) => a.x - b.x);
  const traces = [
    { x: pts.map(p => p.x), y: pts.map(p => p.y), type: 'scatter', mode: 'lines+markers', name: curveName, line: { color: '#6366f1', shape: 'spline' }, marker: { size: 8 } },
    { x: [targetX], y: [targetY], type: 'scatter', mode: 'markers', name: 'Target Point', marker: { color: '#34d399', size: 12, symbol: 'star' } }
  ];
  plotChart(traces);
}

function renderDiffGraph(fnStr, x0, slope) {
  document.getElementById("graphContainer").style.display = "block";
  let y0 = evaluateFn(fnStr, x0);
  let xPlot = [], yPlot = [], tanX = [], tanY = [];
  for (let i = -60; i <= 60; i++) {
    let x = x0 + i * 0.05;
    xPlot.push(x);
    try { yPlot.push(evaluateFn(fnStr, x)); } catch { yPlot.push(null); }
    tanX.push(x);
    tanY.push(y0 + slope * (x - x0));
  }

  const traces = [
    { x: xPlot, y: yPlot, type: 'scatter', mode: 'lines', name: 'f(x)', line: { color: '#6366f1' } },
    { x: tanX, y: tanY, type: 'scatter', mode: 'lines', name: 'Tangent', line: { color: '#38bdf8', dash: 'dash' } },
    { x: [x0], y: [y0], type: 'scatter', mode: 'markers', name: 'Point', marker: { color: '#34d399', size: 10 } }
  ];
  plotChart(traces);
}

function plotChart(traces) {
  const layout = {
    paper_bgcolor: 'transparent',
    plot_bgcolor: '#111827',
    font: { color: '#9ca3af' },
    xaxis: { gridcolor: '#1f293d', zerolinecolor: '#475569' },
    yaxis: { gridcolor: '#1f293d', zerolinecolor: '#475569' },
    margin: { t: 20, r: 20, b: 40, l: 50 },
    hovermode: 'closest'
  };
  Plotly.newPlot('plotlyChart', traces, layout, { responsive: true });
}

// ----------------- HISTORY TABLE (5 MOST RECENT SOLVED PROBLEMS) -----------------
function saveHistory(item) {
  let history = JSON.parse(localStorage.getItem("numer_5_recent_problems") || "[]");
  history.unshift(item);
  if (history.length > 5) history.pop();
  localStorage.setItem("numer_5_recent_problems", JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("numer_5_recent_problems") || "[]");
  const historyBody = document.getElementById("historyBody");
  if (!historyBody) return;

  if (history.length === 0) {
    historyBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">ยังไม่มีประวัติการคำนวณที่บันทึกไว้</td></tr>`;
    return;
  }

  historyBody.innerHTML = history.map(item => `
    <tr>
      <td><span class="history-id-link">${item.id}</span></td>
      <td style="font-family: monospace; max-width: 320px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title='${item.problemJson}'>${item.problemJson}</td>
      <td style="color: #fff; font-weight: 600;">${item.user}</td>
      <td class="history-date">${item.date}</td>
      <td style="text-align: center;">${item.iterations}</td>
    </tr>
  `).join('');
}

function clearHistory() {
  if (confirm("ต้องการลบประวัติการคำนวณทั้งหมดหรือไม่?")) {
    localStorage.removeItem("numer_5_recent_problems");
    loadHistory();
  }
}

window.onload = function() {
  updateSolutionOptions();
  updateAuthUI();
  loadHistory();
};
