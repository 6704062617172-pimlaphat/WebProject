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
            <label>ค่าความคลาดเคลื่อนที่ยอมรับ (Error Tolerance %):</label>
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
            <label>ค่าความคลาดเคลื่อนที่ยอมรับ (Error Tolerance %):</label>
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
          <label>ค่า x ที่ต้องการหาค่า y:</label>
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
          <input type="text" id="fnInput" placeholder="เช่น e^x หรือ x^3 + 2*x">
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

// ----------------- MAIN SOLVE HANDLER -----------------
function solveProblem() {
  const prob = document.getElementById("problemType").value;
  const sol = document.getElementById("solutionType").value;
  const prec = parseInt(document.getElementById("precisionInput").value) || 6;

  try {
    let resultText = "";
    let payload = "";

    if (prob === "ROOT_OF_EQUATION") {
      resultText = runRootOfEquation(sol, prec);
      payload = document.getElementById("fnInput") ? document.getElementById("fnInput").value : "";
    } else if (prob === "LINEAR_ALGEBRA") {
      resultText = runLinearAlgebra(sol, prec);
      payload = `Matrix ${matrixDimension}x${matrixDimension}`;
    } else if (prob === "INTERPOLATION") {
      resultText = runInterpolation(sol, prec);
      payload = `x = ${document.getElementById("targetXInput").value}`;
    } else if (prob === "EXTRAPOLATION") {
      resultText = runExtrapolation(sol, prec);
      payload = `x = ${document.getElementById("targetXInput").value}`;
    } else if (prob === "INTEGRATION") {
      resultText = runIntegration(sol, prec);
      payload = document.getElementById("fnInput") ? document.getElementById("fnInput").value : "";
    } else if (prob === "DIFFERENTIATION") {
      resultText = runDifferentiation(sol, prec);
      payload = `f'(${document.getElementById("diffXInput").value})`;
    }

    if (resultText) {
      saveHistory({
        time: new Date().toLocaleTimeString('th-TH'),
        type: prob,
        method: sol,
        problem: payload,
        result: resultText
      });
    }
  } catch (err) {
    alert("เกิดข้อผิดพลาดในการคำนวณ: " + err.message);
  }
}

// ----------------- 1. ROOT OF EQUATION -----------------
function runRootOfEquation(sol, prec) {
  const fnInput = document.getElementById("fnInput");
  const tolInput = document.getElementById("tolInput");
  if (!fnInput.value.trim() || !tolInput.value) {
    alert("กรุณากรอกสมการ f(x) และค่า Error Tolerance");
    return null;
  }

  const fnStr = fnInput.value.trim();
  const tol = parseFloat(tolInput.value);
  let steps = [];
  let root = null;

  if (sol === "BISECTION" || sol === "FALSE_POSITION") {
    let xl = parseFloat(document.getElementById("xlInput").value);
    let xr = parseFloat(document.getElementById("xrInput").value);

    let fL = evaluateFn(fnStr, xl);
    let fR = evaluateFn(fnStr, xr);
    if (fL * fR > 0) {
      alert("คำเตือน: f(X_L) และ f(X_R) ต้องมีเครื่องหมายตรงกันข้ามกัน (f(a) * f(b) < 0)");
      return null;
    }

    let xm = 0, xmOld = null, iter = 0;
    while (iter < 100) {
      iter++;
      xm = (sol === "BISECTION") ? (xl + xr) / 2 : ((xl * fR) - (xr * fL)) / (fR - fL);
      let fM = evaluateFn(fnStr, xm);
      let error = (iter > 1 && xm !== 0) ? Math.abs((xm - xmOld) / xm) * 100 : null;

      steps.push({ iter, xl, xr, xm, fM, error: error !== null ? error : "-" });

      if (Math.abs(fM) === 0 || (error !== null && error < tol)) {
        root = xm;
        break;
      }
      if (fL * fM < 0) { xr = xm; fR = fM; } else { xl = xm; fL = fM; }
      xmOld = xm;
      root = xm;
    }

    renderTable(["Iter", "X_L", "X_R", "X_M", "f(X_M)", "Error (%)"], steps, prec);
    renderRootGraph(fnStr, steps[0].xl, steps[0].xr, root);
  } else if (sol === "NEWTON_RAPHSON") {
    let xCurr = parseFloat(document.getElementById("x0Input").value);
    let iter = 0;
    let dExpr = null;
    try { dExpr = math.derivative(fnStr, 'x'); } catch {}

    while (iter < 100) {
      iter++;
      let fx = evaluateFn(fnStr, xCurr);
      let dfx = dExpr ? dExpr.evaluate({ x: xCurr }) : (evaluateFn(fnStr, xCurr + 1e-7) - evaluateFn(fnStr, xCurr - 1e-7)) / 2e-7;

      if (Math.abs(dfx) < 1e-12) {
        alert("f'(x) เข้าใกล้ 0 ไม่สามารถคำนวณต่อได้");
        break;
      }

      let xNext = xCurr - (fx / dfx);
      let error = (xNext !== 0) ? Math.abs((xNext - xCurr) / xNext) * 100 : null;

      steps.push({ iter, xCurr, fx, dfx, xNext, error: error !== null ? error : "-" });
      if (error !== null && error < tol) { root = xNext; break; }
      xCurr = xNext;
      root = xCurr;
    }

    renderTable(["Iter", "X_n", "f(X_n)", "f'(X_n)", "X_n+1", "Error (%)"], steps, prec);
    renderRootGraph(fnStr, parseFloat(document.getElementById("x0Input").value) - 2, parseFloat(document.getElementById("x0Input").value) + 2, root);
  }

  showResult(`Root Solution: x ≈ ${root.toFixed(prec)}`);
  return `x ≈ ${root.toFixed(prec)}`;
}

// ----------------- 2. LINEAR ALGEBRA EQUATION -----------------
function runLinearAlgebra(sol, prec) {
  const dim = matrixDimension;
  let A = [], b = [];

  for (let r = 0; r < dim; r++) {
    A[r] = [];
    for (let c = 0; c < dim; c++) {
      let val = parseFloat(document.getElementById(`mat_a_${r}_${c}`).value);
      if (isNaN(val)) { alert("กรุณากรอกตัวเลขใน Matrix A ให้ครบถ้วน"); return null; }
      A[r][c] = val;
    }
    let bVal = parseFloat(document.getElementById(`mat_b_${r}`).value);
    if (isNaN(bVal)) { alert("กรุณากรอกตัวเลขใน Matrix B ให้ครบถ้วน"); return null; }
    b[r] = bVal;
  }

  let solutions = [];
  let steps = [];

  if (sol === "GAUSS_JORDAN") {
    // Augmented Matrix [A | b]
    let mat = [];
    for (let i = 0; i < dim; i++) {
      mat[i] = [...A[i], b[i]];
    }

    // อัลกอริทึม RREF ตามเอกสารรายงาน
    let lead = 0;
    for (let r = 0; r < mat.length; r++) {
      if (mat[0].length <= lead) break;
      let i = r;
      while (mat[i][lead] === 0) {
        i++;
        if (mat.length === i) {
          i = r;
          lead++;
          if (mat[0].length === lead) break;
        }
      }
      if (mat[0].length === lead) break;

      let tmp = mat[i]; mat[i] = mat[r]; mat[r] = tmp;
      let val = mat[r][lead];
      for (let j = 0; j < mat[0].length; j++) {
        mat[r][j] = mat[r][j] / val;
      }
      for (let i = 0; i < mat.length; i++) {
        if (i === r) continue;
        let factor = mat[i][lead];
        for (let j = 0; j < mat[0].length; j++) {
          mat[i][j] = mat[i][j] - factor * mat[r][j];
        }
      }
      lead++;
    }

    for (let i = 0; i < dim; i++) {
      solutions.push(mat[i][dim]);
      steps.push({
        var: `x${i + 1}`,
        equation: `Row ${i + 1} Result`,
        value: mat[i][dim]
      });
    }

    renderTable(["Variable", "Description", "Value"], steps, prec);
  } else if (sol === "CRAMER") {
    let detA = math.det(A);
    if (Math.abs(detA) < 1e-12) {
      alert("det(A) = 0 ระบบสมการไม่มีคำตอบเดี่ยว (Cramer's Rule ไม่สามารถใช้ได้)");
      return null;
    }

    for (let i = 0; i < dim; i++) {
      let Ai = A.map((row, rIdx) => row.map((val, cIdx) => cIdx === i ? b[rIdx] : val));
      let detAi = math.det(Ai);
      let xi = detAi / detA;
      solutions.push(xi);
      steps.push({
        var: `x${i + 1}`,
        detAi: detAi,
        detA: detA,
        result: xi
      });
    }

    renderTable(["Variable", "det(Ai)", "det(A)", "x_i = det(Ai) / det(A)"], steps, prec);
  }

  // ซ่อนกราฟเพราะเป็น Linear System หลายมิติ
  document.getElementById("graphContainer").style.display = "none";
  let solStr = solutions.map((s, idx) => `x${idx + 1} = ${s.toFixed(prec)}`).join(", ");
  showResult(`Solution: (${solStr})`);
  return solStr;
}

// ----------------- 3. INTERPOLATION -----------------
function parsePoints() {
  const text = document.getElementById("pointsInput").value.trim();
  if (!text) { alert("กรุณากรอกชุดจุดข้อมูล x, y"); return null; }
  const lines = text.split("\n");
  let pts = [];
  for (let line of lines) {
    let parts = line.split(",").map(v => parseFloat(v.trim()));
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      pts.push({ x: parts[0], y: parts[1] });
    }
  }
  if (pts.length < 2) { alert("ต้องมีจุดข้อมูลอย่างน้อย 2 จุด"); return null; }
  return pts;
}

function runInterpolation(sol, prec) {
  const pts = parsePoints();
  if (!pts) return null;
  const targetXInput = document.getElementById("targetXInput");
  if (!targetXInput.value) { alert("กรุณากรอกค่า x ที่ต้องการคำนวณ"); return null; }
  const targetX = parseFloat(targetXInput.value);

  const n = pts.length;
  let estimatedY = 0;
  let steps = [];

  if (sol === "NEWTON_DIVIDED") {
    // Divided Difference Table
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
      let addVal = table[0][j] * term;
      estimatedY += addVal;
      steps.push({ order: j, term: `b${j} * product(x - x_i)`, value: estimatedY });
    }

    renderTable(["Order (n)", "Term Calculation", "Cumulative y"], steps, prec);
  } else if (sol === "LAGRANGE") {
    for (let i = 0; i < n; i++) {
      let L = 1;
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          L *= (targetX - pts[j].x) / (pts[i].x - pts[j].x);
        }
      }
      let termVal = L * pts[i].y;
      estimatedY += termVal;
      steps.push({ i: i + 1, point: `(${pts[i].x}, ${pts[i].y})`, L_i: L, termVal: termVal });
    }

    renderTable(["i", "Point (x_i, y_i)", "Lagrange Weight L_i(x)", "L_i(x) * y_i"], steps, prec);
  }

  renderPointsGraph(pts, targetX, estimatedY, "Interpolation Curve");
  showResult(`Interpolation at x = ${targetX}: y ≈ ${estimatedY.toFixed(prec)}`);
  return `y ≈ ${estimatedY.toFixed(prec)}`;
}

// ----------------- 4. EXTRAPOLATION (REGRESSION) -----------------
function runExtrapolation(sol, prec) {
  const pts = parsePoints();
  if (!pts) return null;
  const targetXInput = document.getElementById("targetXInput");
  if (!targetXInput.value) { alert("กรุณากรอกค่า x ที่ต้องการคำนวณ"); return null; }
  const targetX = parseFloat(targetXInput.value);

  const n = pts.length;
  let estimatedY = 0;
  let steps = [];

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  pts.forEach(p => {
    sumX += p.x; sumY += p.y;
    sumXY += p.x * p.y; sumX2 += p.x * p.x;
  });

  if (sol === "LINEAR_REGRESSION") {
    // y = m*x + c
    let m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    let c = (sumY - m * sumX) / n;
    estimatedY = m * targetX + c;

    steps.push({ param: "Slope (m)", value: m });
    steps.push({ param: "Intercept (c)", value: c });
    steps.push({ param: "Target x", value: targetX });
    steps.push({ param: "Predicted y = m*x + c", value: estimatedY });

    renderTable(["Parameter", "Value"], steps, prec);
    renderPointsGraph(pts, targetX, estimatedY, `Linear Fit: y = ${m.toFixed(2)}x + ${c.toFixed(2)}`);
  } else if (sol === "POLYNOMIAL_REGRESSION") {
    // Degree 2: y = a0 + a1*x + a2*x^2
    let sumX3 = 0, sumX4 = 0, sumX2Y = 0;
    pts.forEach(p => {
      sumX3 += Math.pow(p.x, 3);
      sumX4 += Math.pow(p.x, 4);
      sumX2Y += Math.pow(p.x, 2) * p.y;
    });

    let matA = [
      [n, sumX, sumX2],
      [sumX, sumX2, sumX3],
      [sumX2, sumX3, sumX4]
    ];
    let matB = [sumY, sumXY, sumX2Y];
    let coeffs = math.lusolve(matA, matB).map(v => v[0]);

    let a0 = coeffs[0], a1 = coeffs[1], a2 = coeffs[2];
    estimatedY = a0 + a1 * targetX + a2 * Math.pow(targetX, 2);

    steps.push({ param: "a0 (Constant)", value: a0 });
    steps.push({ param: "a1 (x)", value: a1 });
    steps.push({ param: "a2 (x²)", value: a2 });
    steps.push({ param: "Predicted y", value: estimatedY });

    renderTable(["Coefficient", "Value"], steps, prec);
    renderPointsGraph(pts, targetX, estimatedY, "Polynomial Degree 2 Fit");
  }

  showResult(`Predicted Extrapolation at x = ${targetX}: y ≈ ${estimatedY.toFixed(prec)}`);
  return `y ≈ ${estimatedY.toFixed(prec)}`;
}

// ----------------- 5. INTEGRATION -----------------
function runIntegration(sol, prec) {
  const fnInput = document.getElementById("fnInput");
  const aInput = document.getElementById("aInput");
  const bInput = document.getElementById("bInput");
  const nInput = document.getElementById("nInput");

  if (!fnInput.value.trim() || !aInput.value || !bInput.value || !nInput.value) {
    alert("กรุณากรอกข้อมูล a, b, n และ f(x) ให้ครบถ้วน");
    return null;
  }

  const fnStr = fnInput.value.trim();
  const a = parseFloat(aInput.value);
  const b = parseFloat(bInput.value);
  let n = parseInt(nInput.value);

  if (sol === "SIMPSON" && n % 2 !== 0) {
    n += 1;
    document.getElementById("nInput").value = n;
    alert("Simpson's 1/3 Rule ต้องใช้ช่วง n เป็นเลขคู่ ได้ปรับเป็น " + n + " ให้แล้วครับ");
  }

  const h = (b - a) / n;
  let xVals = [], yVals = [], weights = [];

  for (let i = 0; i <= n; i++) {
    let cx = a + i * h;
    xVals.push(cx);
    yVals.push(evaluateFn(fnStr, cx));

    if (sol === "TRAPEZOIDAL") {
      weights.push((i === 0 || i === n) ? 1 : 2);
    } else {
      if (i === 0 || i === n) weights.push(1);
      else if (i % 2 !== 0) weights.push(4);
      else weights.push(2);
    }
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
  return `I ≈ ${area.toFixed(prec)}`;
}

// ----------------- 6. DIFFERENTIATION -----------------
function runDifferentiation(sol, prec) {
  const fnInput = document.getElementById("fnInput");
  const xInput = document.getElementById("diffXInput");
  const hInput = document.getElementById("stepHInput");

  if (!fnInput.value.trim() || !xInput.value || !hInput.value) {
    alert("กรุณากรอก f(x), x และค่า step size h ให้ครบถ้วน");
    return null;
  }

  const fnStr = fnInput.value.trim();
  const x = parseFloat(xInput.value);
  const h = parseFloat(hInput.value);

  let approx = 0;
  let formulaDesc = "";

  if (sol === "FORWARD_DIFF") {
    approx = (evaluateFn(fnStr, x + h) - evaluateFn(fnStr, x)) / h;
    formulaDesc = "[f(x+h) - f(x)] / h";
  } else if (sol === "BACKWARD_DIFF") {
    approx = (evaluateFn(fnStr, x) - evaluateFn(fnStr, x - h)) / h;
    formulaDesc = "[f(x) - f(x-h)] / h";
  } else if (sol === "CENTRAL_DIFF") {
    approx = (evaluateFn(fnStr, x + h) - evaluateFn(fnStr, x - h)) / (2 * h);
    formulaDesc = "[f(x+h) - f(x-h)] / (2h)";
  }

  // Exact Derivative ผ่าน Symbolic ของ Math.js เพื่อเปรียบเทียบ Error
  let exact = null, trueError = null;
  try {
    const dExpr = math.derivative(fnStr, 'x');
    exact = dExpr.evaluate({ x: x });
    if (exact !== 0) {
      trueError = Math.abs((exact - approx) / exact) * 100;
    }
  } catch {}

  let steps = [
    { desc: "x Value", value: x },
    { desc: "Step size (h)", value: h },
    { desc: `Formula: ${formulaDesc}`, value: approx },
    { desc: "Exact Derivative f'(x)", value: exact !== null ? exact : "N/A" },
    { desc: "True Relative Error (%)", value: trueError !== null ? trueError : "N/A" }
  ];

  renderTable(["Property", "Value"], steps, prec);
  renderDiffGraph(fnStr, x, approx);

  showResult(`Numerical Derivative f'(${x}) ≈ ${approx.toFixed(prec)}`);
  return `f'(${x}) ≈ ${approx.toFixed(prec)}`;
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
    // Default 3x3 Matrix ตัวอย่างจากรายงาน
    const matrixA = [[-2, 3, 1], [3, 4, -5], [1, -2, 1]];
    const matrixB = [9, 0, -5];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        document.getElementById(`mat_a_${r}_${c}`).value = matrixA[r][c];
      }
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
    return `<tr>${vals.map((v, i) => {
      if (typeof v === 'number') return `<td>${v.toFixed(prec)}</td>`;
      return `<td>${v}</td>`;
    }).join('')}</tr>`;
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
    { x: [targetX], y: [targetY], type: 'scatter', mode: 'markers', name: 'Interpolated/Predicted Point', marker: { color: '#34d399', size: 12, symbol: 'star' } }
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
    { x: tanX, y: tanY, type: 'scatter', mode: 'lines', name: 'Tangent (ความชัน)', line: { color: '#38bdf8', dash: 'dash' } },
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

// ----------------- LOCALSTORAGE HISTORY -----------------
function saveHistory(item) {
  let history = JSON.parse(localStorage.getItem("numer_calc_history") || "[]");
  history.unshift(item);
  if (history.length > 10) history.pop();
  localStorage.setItem("numer_calc_history", JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("numer_calc_history") || "[]");
  const historyBody = document.getElementById("historyBody");
  if (!historyBody) return;

  if (history.length === 0) {
    historyBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">ยังไม่มีประวัติการคำนวณ</td></tr>`;
    return;
  }

  historyBody.innerHTML = history.map(item => `
    <tr>
      <td style="color: var(--text-muted);">${item.time}</td>
      <td><span style="color: var(--accent-blue);">${item.type}</span></td>
      <td>${item.method}</td>
      <td style="font-family: monospace;">${item.problem}</td>
      <td style="color: var(--accent-green); font-weight: 600;">${item.result}</td>
    </tr>
  `).join('');
}

function clearHistory() {
  if (confirm("ต้องการลบประวัติการคำนวณทั้งหมดหรือไม่?")) {
    localStorage.removeItem("numer_calc_history");
    loadHistory();
  }
}

window.onload = function() {
  updateSolutionOptions();
  loadHistory();
};