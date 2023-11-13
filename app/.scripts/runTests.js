/**
 * Kill port 9998
 * Start the vite dev server with NODE_ENV=test on port 9998,
 * When the home page responds, run vitest
 */

import kill from "kill-port"
import { spawn } from 'child_process'

const runTests = async () => {
    await kill(9998);
    const server = spawn('npm', ['run', 'dev', '--', '--port', '9998'], { stdio: 'inherit' });
    server.on('error', (err) => {
        console.error(err);
    });
    server.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        if (data.includes('Server running at')) {
            exec('vitest', (err, stdout, stderr) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(stdout);
            });
        }
    });
}

runTests();