const fs = require('fs');
const path = require('path');

const directories = [
  'd:/Sharma/Ev_Charger_Booking_System_Puducherry/Frontend/Admin/src',
  'd:/Sharma/Ev_Charger_Booking_System_Puducherry/Frontend/User/src'
];

function replaceInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('http://localhost:8080')) {
    const newContent = content.replace(/http:\/\/localhost:8080/g, '${import.meta.env.VITE_API_BASE_URL}');
    
    // Many fetch calls look like: fetch('http://localhost:8080/api/...')
    // If we just replace it, we get: fetch('${import.meta.env.VITE_API_BASE_URL}/api/...')
    // We need to change the single quotes around the URL to backticks if we use ${...}
    // Alternatively, a safer replacement is: import.meta.env.VITE_API_BASE_URL + '
    // So 'http://localhost:8080/api/...' -> import.meta.env.VITE_API_BASE_URL + '/api/...'

    // Let's do a smarter replace.
    // Replace 'http://localhost:8080 or "http://localhost:8080 with import.meta.env.VITE_API_BASE_URL + ' or "
    let updated = content.replace(/'http:\/\/localhost:8080/g, "import.meta.env.VITE_API_BASE_URL + '");
    updated = updated.replace(/"http:\/\/localhost:8080/g, 'import.meta.env.VITE_API_BASE_URL + "');
    updated = updated.replace(/`http:\/\/localhost:8080/g, "`${import.meta.env.VITE_API_BASE_URL}");
    
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('Updated:', filePath);
  }
}

function traverseDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseDir(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      replaceInFile(fullPath);
    }
  }
}

directories.forEach(traverseDir);
console.log("Done");
