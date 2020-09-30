// Bubble Chart

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

    
        var traceBar = {
            type: "bar",
            orientation: 'h',
            x: reversed.map(row=> row.value),
            y: reversed.map(row => row.id),
            text: reversed.map(row => row.label),
            mode: 'markers'
          };
          
        var data = [traceBar];
          
        var layout = {
            title: `Top 10 OTUs for Sample ${id}` ,
            xaxis: {autorange: true},
            yaxis: {autorange: true}
          };
          
        Plotly.newPlot("bar", data, layout);
    })
}

buildPlots(940)