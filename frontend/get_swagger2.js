const https = require('https');

https.get('https://lane-16-api.fly.dev/docs-json', (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const d = JSON.parse(body);
    
    console.log("DEALER ENDPOINTS:");
    Object.keys(d.paths).forEach(p => {
        if(p.includes('dealer')) {
            console.log(p);
        }
    });

    console.log("\nBID ENDPOINTS:");
    Object.keys(d.paths).forEach(p => {
        if(p.includes('bid')) {
            console.log(p);
        }
    });
  });
});
