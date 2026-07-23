const https = require('https');

// First, let's check all dealers to get an ID, then check bids for a vehicle
// We'll just fetch the swagger to see the response schema for bids
https.get('https://lane-16-api.fly.dev/docs-json', (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const d = JSON.parse(body);
    // Check response schemas for bid endpoints
    Object.entries(d.paths).forEach(([p,v]) => {
      if(p.toLowerCase().includes('bid')) {
        const methods = Object.keys(v);
        methods.forEach(method => {
          const op = v[method];
          const resp200 = op.responses?.['200'];
          if(resp200?.content?.['application/json']?.schema) {
            const schema = resp200.content['application/json'].schema;
            console.log(`\nRESPONSE ${method.toUpperCase()} ${p}:`);
            if(schema.$ref) {
              const name = schema.$ref.split('/').pop();
              console.log("Schema:", name, JSON.stringify(d.components.schemas[name], null, 2));
            } else if(schema.items?.$ref) {
              const name = schema.items.$ref.split('/').pop();
              console.log("Array of Schema:", name, JSON.stringify(d.components.schemas[name], null, 2));
            } else {
              console.log(JSON.stringify(schema, null, 2));
            }
          }
        });
      }
    });
  });
});
