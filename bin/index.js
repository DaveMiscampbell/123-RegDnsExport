const zonefile = require("dns-zonefile");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");

const csvWriter = createCsvWriter({
  path: "./dns.csv",
  header: [
    { id: "cname", title: "cname" },
    { id: "fqdn", title: "fqdn" },
  ],
});

const cnames = [];

fs.readdir("./", (err, files) => {
  const zoneFiles = files.filter((x) => x.endsWith("zone"));
  zoneFiles.forEach((value, index) => {
    console.log(`Processing DNS records for ${value} (${index + 1}/${zoneFiles.length})`);
    const zoneFileContents = fs.readFileSync(value, "utf8");
    const zoneFileJson = zonefile.parse(zoneFileContents);
    if (zoneFileJson.cname && zoneFileJson.cname.length) {
        zoneFileJson.cname.forEach((cname, index) => {
            cnames.push({ cname: cname.name, fqdn: cname.alias });
        });
        console.log(`${zoneFileJson.cname.length} CNAME records added`);
    } else {
        console.log('No CNAMEs found for this domain');
    }
  });
  csvWriter.writeRecords(cnames);
});
