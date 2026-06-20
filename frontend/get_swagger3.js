const https = require('https');

https.get('https://lane-16-api.fly.dev/docs-json', (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const d = JSON.parse(body);
    
    const bidEndpoints = ['/dealers/bids/vehicle/{id}', '/dealers/bids/{id}'];

    bidEndpoints.forEach(p => {
        const v = d.paths[p];
        if (v && v.get) {
            console.log(`\nGET ${p}`);
            const resp200 = v.get.responses?.['200'];
            if(resp200?.content?.['application/json']?.schema) {
                const schema = resp200.content['application/json'].schema;
                if(schema.$ref) {
                    const name = schema.$ref.split('/').pop();
                    console.log("Schema:", name, JSON.stringify(d.components.schemas[name], null, 2));
                } else if(schema.items?.$ref) {
                    const name = schema.items.$ref.split('/').pop();
                    console.log("Array of Schema:", name, JSON.stringify(d.components.schemas[name], null, 2));
                } else {
                    console.log(JSON.stringify(schema, null, 2));
                }
            } else {
                console.log("No 200 JSON schema found");
            }
        }
    });
  });
});
