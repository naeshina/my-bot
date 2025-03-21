const childProcess = require('child_process');
const os = require('os');
const path = require('path');

async function start() {
  let isRunning = false;
  let args = [path.join(__dirname, 'index.js'), ...process.argv.slice(2)];
  let p = childProcess.spawn(process.argv[0], args, {
    stdio: ['inherit', 'inherit', 'inherit', 'ipc']
  })
    .on('message', (data) => {
      switch (data) {
        case "reset":
          {
            os.platform() === "win32" ? p.kill("SIGINT") : p.kill();
            isRunning = false;
            console.log(p)
            start()
            console.log("[System] Restarting bot...");
          }
          break;
        case "uptime":
          {
            p.send(process.uptime());
          }
          break;
      }
    })
    .on('exit', (code) => {
      console.error('Exited with code:', code)
      if (code == '.' || code == 1 || code == 0) start()
    })
}

start();