// server/routes/execute.js
// -----------------------------------------------------------------------------
// POST /api/execute
// Dynamically compiles and runs code for supported languages:
// - JavaScript (Node.js)
// - Python
// - C++ (via g++)
// Accepts optional stdin and returns the stdout or errors
// -----------------------------------------------------------------------------

const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const WORKSPACE = path.join(__dirname, "../temp");
if (!fs.existsSync(WORKSPACE)) fs.mkdirSync(WORKSPACE);

const isWindows = process.platform === "win32";

// Language configuration
const LANG_CONFIG = {
  javascript: {
    file: "Main.js",
    run: "node Main.js",
  },
  python: {
    file: "Main.py",
    run: isWindows ? "python Main.py" : "python3 Main.py",
  },
  c_cpp: {
    file: "Main.cpp",
    compile: isWindows ? "g++ Main.cpp -o Main.exe" : "g++ Main.cpp -o Main",
    run: isWindows ? "Main.exe" : "./Main",
  },
};

router.post("/", (req, res) => {
  const { language, code, input = "" } = req.body;
  const cfg = LANG_CONFIG[language];

  if (!cfg) {
    return res
      .status(400)
      .json({ output: `Unsupported language: ${language}` });
  }

  const filePath = path.join(WORKSPACE, cfg.file);
  fs.writeFileSync(filePath, code);

  // Compile (if needed)
  const compile = cfg.compile
    ? new Promise((resolve, reject) => {
      exec(
        cfg.compile,
        { cwd: WORKSPACE, timeout: 5000 },
        (err, stdout, stderr) =>
          err ? reject(stderr || err.message) : resolve()
      );
    })
    : Promise.resolve();

  compile
    .then(() => {
      let cmd = cfg.run;

      // Sanitize input for piping
      const safeInput = input.replace(/"/g, '\\"');

      // Handle stdin piping cross-platform
      if (input) {
        if (language === "python" || language === "javascript") {
          cmd = isWindows
            ? `cmd /c "echo ${safeInput} | ${cfg.run}"`
            : `echo "${safeInput}" | ${cfg.run}`;
        } else if (language === "c_cpp") {
          cmd = isWindows
            ? `echo ${safeInput} | .\\Main.exe`
            : `echo "${safeInput}" | ./Main`;
        }
      } else {
        if (language === "c_cpp" && isWindows) {
          cmd = ".\\Main.exe";
        }
      }

      // Execute final command
      exec(
        cmd,
        { cwd: WORKSPACE, timeout: 5000 },
        (err, stdout, stderr) => {
          if (err) return res.json({ output: stderr || err.message });
          res.json({ output: stdout });
        }
      );
    })
    .catch((err) => {
      res.json({ output: err.toString() });
    });
});

module.exports = router;
