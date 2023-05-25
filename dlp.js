const DLP = require("@google-cloud/dlp");

// Instantiates a client
const dlp = new DLP.DlpServiceClient();
const path = require("path");

// The string to inspect
const string = "Robert Frost";

// The project ID to run the API call under
// const projectId = 'my-project';

async function quickStart() {
  process.env["GOOGLE_APPLICATION_CREDENTIALS"] = path.join(
    __dirname,
    "service-account.json"
  );

  // The minimum likelihood required before returning a match
  const minLikelihood = "LIKELIHOOD_UNSPECIFIED";

  // The maximum number of findings to report (0 = server maximum)
  const maxFindings = 1;

  // The infoTypes of information to match
  const infoTypes = [{ name: "PERSON_NAME" }, { name: "US_STATE" }];

  // Whether to include the matching string
  const includeQuote = true;

  // Construct item to inspect
  const item = { value: string };
  const projectId = "elba-prod-347713";

  // Construct request
  const request = {
    parent: `projects/${projectId}/locations/global`,
    inspectConfig: {
      infoTypes: infoTypes,
      minLikelihood: minLikelihood,
      limits: {
        maxFindingsPerRequest: maxFindings,
      },
      includeQuote: includeQuote,
    },
    item: item,
  };

  // Run request
  const [response] = await dlp.inspectContent(request);
  const findings = response.result.findings;
  if (findings.length > 0) {
    console.log("Findings:");
    findings.forEach((finding) => {
      if (includeQuote) {
        console.log(`\tQuote: ${finding.quote}`);
      }
      console.log(`\tInfo type: ${finding.infoType.name}`);
      console.log(`\tLikelihood: ${finding.likelihood}`);
    });
  } else {
    console.log("No findings.");
  }
}
quickStart();
