const { exec } = require('child_process');
const open = require('open').default; // Access the default export

const server = exec('node server.js');

server.stdout.on('data', async (data) => {
    console.log(`server: ${data}`);
    if (data.includes('Server is running on')) {
        await open('http://localhost:3000');
    }
});

server.stderr.on('data', (data) => {
    console.error(`server error: ${data}`);
});
