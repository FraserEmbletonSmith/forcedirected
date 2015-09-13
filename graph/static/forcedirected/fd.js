<script type="text/javascript">
    var h=500,
        w=1000,
        data={},
        running=false,
        textVar;
    var border=0;
    var bordercolor='black'
    var Edges = [];
    var Nodes= [];
    var force=d3.layout.force()
        .charge(-120)
        .linkDistance(30)
        .size([w, h])
        .friction(0.5)
        .on("tick", tick);

    var svg = d3.select("#grapharea").append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("border",border);

    var borderPath = svg.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", h)
        .attr("width", w)
        .style("stroke", bordercolor)
        .style("fill", "none")
        .style("stroke-width", border);

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");
    var Aboxes=[];
    Aboxes=document.getElementsByClassName("box");
    for (var i=0;i<Aboxes.length;i++){
        console.log(Aboxes.item(i));
        check(Aboxes.item(i).id);
    }
    var tooltip = d3.select("#grapharea")            // NEW
        .append('div')                             // NEW
        .attr('class', 'tooltip')
        .attr('opacity',0);

   // tooltip.append('div')                        // NEW
     //   .attr('class', 'label')
      //  .style('opacity',0);                 // NEW

    //tooltip.append('div')                        // NEW
       // .attr('class', 'count')
       // .style('opacity',0);                 // NEW

    //tooltip.append('div')                        // NEW
       // .attr('class', 'percent')
        //.style('opacity',0);



    //for (i=0;)
    d3.json("{% url 'JSON' %}",function(json) {
    json.edges.forEach(function (e) {
            var sourceNode = json.nodes.filter(function (n) {
                    return n.id === e.source;
                })[0],
                targetNode = json.nodes.filter(function (n) {
                    return n.id === e.target;
                })[0];

            Edges.push({source: sourceNode, target: targetNode, value: e.value});
        });
        json.nodes.forEach(function (e) {
           Nodes.push({name: e.name, time: e.time, uk: e.id, chrono: e.chronology, text: e.text});
            data = {Nodes: Nodes, Edges: Edges};
        });

        console.log(data);
        update();
        return data;
    });
    function update() {
        textVar=data.Nodes[1].text;
        document.getElementById('viewPane').innerHTML="";
        document.getElementById('AuthorName').innerHTML="Click on a node to read a text"
        if (running==true){
            force.stop();
        }
        var nodes = threshold();
        nodes=filterBoxes(nodes);
        var links = linkFinder(nodes);
        force
            .nodes(nodes)
            .links(links)
            .start();
        link = link.data(links);
        link.exit().remove();
        link.enter().append("line")
            .attr("class", "link")
            .attr("x1", function (d) {
                return d.source.x;
            })
            .attr("y1", function (d) {
                return d.source.y;
            })
            .attr("x2", function (d) {
                return d.target.x;
            })
            .attr("y2", function (d) {
                return d.target.y;
            });

        node = node.data(nodes, function (d) {
            return d.uk;
        });
        node.exit().remove();

        node
            .enter().append("circle")
            .attr("class", "node")
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            })
            .attr("r", function (d) {
                return Math.sqrt(d.size) / 10 || 4.5;
            })

            .on("click", function(d){
            click(d.text,d.name);
        })
            .on("mouseover", function(d){
                tooltip.transition().duration(200).style("opacity", .9);
                tooltip.html(d.name);
                    //tooltip.style("left", (d3.event.pageX) + "px");
                    //tooltip.style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout",function(d){
                tooltip.transition().duration(500).style("opacity", 0);
            })
        .call(force.drag);

        running=true;
    }
    function tick() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });


    }


    function threshold(){
        var threshold;
        var transient=[];
        threshold = document.getElementById("timeSlider").value;
        if (document.getElementById("timeThresh").checked==true) {
            for (var i=0;i<data.Nodes.length;i++){
                if (data.Nodes[i].time>=threshold) {
                    //transient.push(data[i].nodes);
                    var tempObject = {};
                    tempObject = {name: data.Nodes[i].name, time: data.Nodes[i].time, uk: data.Nodes[i].uk, chrono: data.Nodes[i].chrono, text:data.Nodes[i].text};
                }
                else{
                    continue;
                }
                transient.push(tempObject);
                //nodes.push(data.nodes[i]);

            }
        }
        else if (document.getElementById("chronoThresh").checked==true){

            for (var l=0;l<data.Nodes.length;l++){
                console.log("loopy");
                console.log(threshold);
                console.log(data.Nodes[l].chrono);
                if (data.Nodes[l].chrono>=threshold) {
                    //transient.push(data[i].nodes);
                    var tempObject = {};
                    tempObject = {name: data.Nodes[l].name, time: data.Nodes[l].time, uk: data.Nodes[l].uk, chrono: data.Nodes[l].chrono, text:data.Nodes[l].text};
                }
                else{
                    continue;
                }
                transient.push(tempObject);
                //nodes.push(data.nodes[i]);

            }
        }



        return transient;




    }

    function linkFinder(nodes){
        //takes an array of nodes and returns the links associated with them as an array.
        var AssociatedLinks=[];
        var trueSource;
        var trueTarget;


        for (var i=0;i<data.Edges.length;i++) {
            var Tempcount = 0;
            var counter1=-1;
            var counter2=-1;

            for (var j = 0; j < nodes.length; j++) {
                counter1++;

                if (data.Edges[i].source.id == nodes[j].uk) {
                    Tempcount++;
                    trueSource=counter1;
                }
            }
            for (var m = 0; m < nodes.length; m++) {
                counter2++;
                if (data.Edges[i].target.id == nodes[m].uk) {
                    Tempcount++;
                    trueTarget=counter2;
                }
            }

            if (Tempcount == 2) {
                var tempObject = {};
                tempObject = {
                    source: trueSource,
                    target: trueTarget,
                    value: data.Edges[i].value
                };
                AssociatedLinks.push(tempObject);
            }
            Tempcount=0;

        }
        return AssociatedLinks;
    }

    function filterBoxes(nodes){
        var transient=[];

        for (var i=0;i<nodes.length;i++){
            for (var j=0;j<Aboxes.length;j++){
                var tempObject = {};
                if (nodes[i].name==Aboxes.item(j).name && Aboxes.item(j).checked == true) {
                        tempObject = {name: nodes[i].name, time: nodes[i].time, uk: nodes[i].uk, text: nodes[i].text};
                        transient.push(tempObject);
                }
                else{
                    continue;
                }
            }
        }
        return transient;
    }

    function check(id) { //checks the box with id equal to id
        document.getElementById(id).checked = true;
    }
    function frameUpdate(text,author){
        var url=author+"/";
        //var testurl='<a href=\"'+url+'\"/>';
        //console.log(testurl);
        document.getElementById('viewPane').src=url;
        document.getElementById('AuthorName').innerHTML=author;
    }
    function click(text,author){
        frameUpdate(text,author);
   console.log(document.getElementById("viewPane").contentDocument.location.href)
    }
