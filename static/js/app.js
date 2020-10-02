// Initializing the page and calling the other functions
function startup() {

    // Grabbing the dropdown element
    var selector = d3.select('#selDataset');

    d3.json("samples.json").then(function(samplesData){
        var names = samplesData.names;

        selector.selectAll('option')
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
};

// Dynamic changing of plots and demographics upon change in dropdown
function optionChanged(newID){
    buildPlots(newID);
    demographics(newID);
};

// Building Bar Chart and Bubble Chart
function buildPlots(id) {
    // Reading in the json dataset
    d3.json("samples.json").then(function(samplesData){
        // console.log(samplesData);
        // Filtering for the id selected
        var filtered = samplesData.samples.filter(sample => sample.id == id);
        var result = filtered[0];
        // console.log(filtered)
        // console.log(result)

        // creating variables and storing the top 10 in an array

        Data = [];
        for (i=0; i<result.sample_values.length; i++){
            Data.push({
                id: `OTU ${result.otu_ids[i]}`,
                value: result.sample_values[i],
                label: result.otu_labels[i]
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
        var colors = ['#fff100', '#ff8c00', '#e81123', '#ec008c', '#68217a', '#00188f', '#00bcf2', '#00b294', '#009e49', '#bad80a']
        var traceBar = {
            type: "bar",
            orientation: 'h',
            x: reversed.map(row=> row.value),
            y: reversed.map(row => row.id),
            text: reversed.map(row => row.label),
            mode: 'markers',
            marker: {
                color: colors
            }
          };
        
        var Bardata = [traceBar];
          
        var Barlayout = {
            title: `<span style='font-size:1em; color:#00bcf2'><b>Top 10 OTUs for Subject ${id}<b></span>`,
            xaxis: {autorange: true, title: 'Sample Values'},
            yaxis: {autorange: true},
            width: 500,
            height: 500
          };
        
        // Creating the Horizontal Bar Chart
        Plotly.newPlot("bar", Bardata, Barlayout);

        // Bubble Chart
        var traceBubble = {
            x: result.otu_ids,
            y: result.sample_values,
            mode: 'markers',
            marker: {
                size: result.sample_values,
                color: result.otu_ids,
                colorscale: 'Jet'
            },
            text: result.otu_labels
        };

        var Bubbledata = [traceBubble]

        var Bubblelayout = {
            title: `<span style='font-size:1em; color:#00bcf2'><b>OTU Data for Subject ${id}<b></span>`,
            xaxis: {title:'OTU ID'},
            yaxis: {title: 'Sample Values'},
            width: window.width
        };

        // Creating Bubble Chart
        Plotly.newPlot('bubble', Bubbledata, Bubblelayout);

    }).catch(error => console.log(error));
}

// Cleaning up the demographic keys
function proper(str){
    return str.toLowerCase().split(' ').map(letter => {
        return (letter.charAt(0).toUpperCase() + letter.slice(1));
    }).join(' ');
}

// Demographics
function demographics(id) {
    // To build the demographics section we need to import the data again
    d3.json('samples.json').then(function(samplesData){
        var filtered = samplesData.metadata.filter(sample => sample.id == id);
        
        // Selecting the meta-data id on the html page
        var selection = d3.select('#sample-metadata');

        // Clear any data already present
        selection.html('');

        // Appending data extracted into the panel
        Object.entries(filtered[0]).forEach(([k,v]) => {
            // console.log(k,v)
            selection.append('h5')
                .text(`${proper(k)}: ${v}`);
        });

        
        // Gauge Chart is easier to do it with demographics as the wash frequency is found under metadata
        var traceGauge = {
            type: 'indicator',
            mode: 'gauge+number',
            title: {
                text: `<span style='font-size:0.8em; color:#00bcf2'><b>Belly Button Washing Frequency<b><br>From Subject ${id}<br># of Scrubs</span>`
            },
            subtitle: {text: `# Scrubs per week`},
            domain: {
                x: [0,5],
                y: [0,1]
            },
            value: filtered[0].wfreq,
            gauge: {
                axis: {
                    range: [null, 9]
                },
                steps: [
                    {range: [0,2], color: '#e81123'},
                    {range: [2,4], color: '#ff8c00'},
                    {range: [4,6], color: '#fff100'},
                    {range: [6,8], color: '#00b294'},
                    {range: [8,10], color: '#009e49'}   
                ],
                threshold: {
                    line: {color: 'red', width: 4},
                    thickness: 0.75,
                    value: 6
                }
            }
        };

        var Gaugedata = [traceGauge];

        var Gaugelayout = {
            width: 350,
            height: 350,
            margin: {t: 25, r:10, l:25, b:25}
        };

        // Creating Gauge Chart
        Plotly.newPlot('gauge', Gaugedata, Gaugelayout);
    }).catch(error => console.log(error));
}

startup();