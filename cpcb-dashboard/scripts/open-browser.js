#!/usr/bin/env node

/**
 * Script to automatically open the Source Identifier page in a new browser tab
 * This runs when the dev server starts
 */

const { exec } = require('child_process');

// URL to open - the Flask server with Source Identifier
const SOURCE_IDENTIFIER_URL = 'http://localhost:5000';

// Wait a bit for the server to start
setTimeout(() => {
    console.log('\n🚀 Opening Source Identifier in browser...');
    console.log(`   URL: ${SOURCE_IDENTIFIER_URL}\n`);

    // Detect platform and open browser accordingly
    const platform = process.platform;
    let command;

    if (platform === 'win32') {
        // Windows
        command = `start ${SOURCE_IDENTIFIER_URL}`;
    } else if (platform === 'darwin') {
        // macOS
        command = `open ${SOURCE_IDENTIFIER_URL}`;
    } else {
        // Linux
        command = `xdg-open ${SOURCE_IDENTIFIER_URL}`;
    }

    exec(command, (error) => {
        if (error) {
            console.error('❌ Could not open browser automatically:', error.message);
            console.log(`   Please manually open: ${SOURCE_IDENTIFIER_URL}`);
        } else {
            console.log('✅ Browser tab opened successfully!');
        }
    });
}, 2000); // Wait 2 seconds for server to be ready
