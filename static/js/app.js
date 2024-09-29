// Retrieve subject data based on subject ID
function getSubjectData(subjectID, allData) {
  function match(oneItem) {
    return oneItem.id == subjectID;
  }
  return allData.filter(match)[0];  
}


// Build the metadata panel
function buildMetadata(subjectID) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(`buildMetadata: ${subjectID}`)

    // Get the metadata field
    let allMetadata = data.metadata;
    let selectedMetadata = getSubjectData(subjectID, allMetadata);

    // Use d3 to select the panel with id of `#sample-metadata`
    let metadataDivTag = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    metadataDivTag.html("")

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(selectedMetadata).forEach(entry => {
      let key = entry[0];
      let value = entry[1];
      metadataDivTag.append('h6').text(`${key.toUpperCase()}: ${value}`);
    });
  });
}


// Function to build both charts
function buildCharts(subjectID) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(`buildCharts: ${subjectID}`)

    // Get the samples field
    let allSamples = data.samples;
    let subjectSample = getSubjectData(subjectID, allSamples);
    
    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = subjectSample.otu_ids;
    let otu_labels = subjectSample.otu_labels;
    let sample_values = subjectSample.sample_values;
    console.log(otu_ids);
    console.log(otu_labels);
    console.log(sample_values);

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {size: sample_values, color: otu_ids, colorscale: 'Earth'}
    };

    let bubbleLayout = {
      title: 'Bateria Cultures per Sample',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bateria'},
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barValues = sample_values.slice(0,10).reverse();
    let barLabels = otu_ids.slice(0,10).reverse().map(otu => `OTU ${otu}`);

    let barTrace = {
      x: barValues,
      y: barLabels,
      text: barLabels,
      type: "bar",
      orientation: 'h',
      marker: {color: '#4169E1'}
    };

    let barLayout = {
      title: 'Top 10 Bateria Cultures Found',
      xaxis: {title: 'Number of Bateria'},
      yaxis: {title: 'OTU ID'},
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", [barTrace], barLayout);

  });
}


// Function for event listener
function optionChanged(selectedSubjectID) {
  console.log(`optionChanged: ${selectedSubjectID}`);
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(selectedSubjectID);
  buildCharts(selectedSubjectID);
}


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Populate dropdown
    // Get the names field
    let allSubjectIDs = data.names;

    // Use d3 to select the dropdown with id of `#selDataset
    let selectTag = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    allSubjectIDs.forEach(id => {
      selectTag.append('option').attr('value', id).text(id);
    });

    // Get the first sample from the list
    // Fill in metadata and charts for first subject
    let firstSubjectID = allSubjectIDs[0];
    optionChanged(firstSubjectID);
  });
}


// Initialize the dashboard
init();