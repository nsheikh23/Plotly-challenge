// Initializing the page and calling the other functions
function startup() {
    d3.json("samples.json").then(function(samplesData){
        var names = samplesData.names;

        d3.selectAll('#selDataset')
            .selectAll('option')
            .data(names)
            .enter()
            .append('option')
            .attr('value', d => d)
            .text(d => d);

        // Take in the first name upon loading the page
        var starter = names[0];

        // Call other functions using starter name
        buildPlots(starter);
        demographics(starter);

    }).catch(error => console.log(error));
}


// Building Bar Chart and Bubble Chart
function buildPlots(id) {
    // Reading in the json dataset
    d3.json("samples.json").then(function(samplesData){
        // console.log(samplesData);
        // Filtering for the id selected
        var filtered = samplesData.samples.filter(patient => patient.id == id);
        var response = filtered[0];
        // console.log(filtered)
        // console.log(response)

        // creating variables and storing the top 10 in an array

        Data = [];
        for (i=0; i<response.sample_values.length; i++){
            Data.push({
                id: `OTU ${response.otu_ids[i]}`,
                value: response.sample_values[i],
                label: response.otu_labels[i]
            });
        }
        // console.log(Data);

        // Sorting the data and slicing for top10
        var Sorted = Data.sort(function sortFunction(a,b){
            return b.value - a.value;
        }).slice(0,10);
        // console.log(Sorted)

        // Since horizontal bar chart, need to reverse to display from top to bottom in descending order
        var reversed = Sorted.sort(function sortFunction(a,b){
            return a.value - b.value;
        })
        // console.log(reversed);

        // Trace for Horizontal Bar Chart
        var traceBar = {
            type: "bar",
            orientation: 'h',
            x: reversed.map(row=> row.value),
            y: reversed.map(row => row.id),
            text: reversed.map(row => row.label),
            mode: 'markers'
          };
        
        var Bardata = [traceBar];
          
        var Barlayout = {
            title: `Top 10 OTUs for Sample ${id}` ,
            xaxis: {autorange: true, title: 'Sample Values'},
            yaxis: {autorange: true}
          };
        
        // Creating the Horizontal Bar Chart
        Plotly.newPlot("bar", Bardata, Barlayout);


        var traceBubble = {
            x: response.otu_ids,
            y: response.sample_values,
            mode: 'markers',
            marker: {
                size: response.sample_values,
                color: response.otu_ids
            },
            text: response.otu_labels
        };

        var Bubbledata = [traceBubble]

        var Bubblelayout = {
            title: `OTU Data for Sample ${id}`,
            xaxis: {autorange: true, title:'OTU'},
            yaxis: {autorange: true}
        };

        // Creating Bubble Chart
        Plotly.newPlot('bubble', Bubbledata, Bubblelayout);

    }).catch(error => console.log(error));
}
buildPlots(940)

// Demographics
function demographics(id) {
    // To build the demographics section we need to import the data again
    d3.json('samples.json').then(function(samplesData){
        var filtered = samplesData.metadata.filter(patient => patient.id == id);
        
        // Selecting the meta-data id on the html page
        var selection = d3.select('#sample-metadata');

        // Clear any data already present
        selection.html('');

        // Appending data extracted into the panel
        var list = selection.append('ul')
        Object.entries(filtered[0]).forEach(function(k,v){
            var item = list.append('li');
            item.html(k,v)
        })
    }).catch(error => console.log(error));
}
demographics(940)