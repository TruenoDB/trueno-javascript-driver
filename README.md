
<img height="75" src="https://raw.githubusercontent.com/TruenoDB/trueno/master/assets/images/truenoDB.png" align="middle">

# trueno-javascript-driver
Javascript driver for the TruenoDB graph database.

###Creating a Graph
In order to create a graph **G=(V,E)** with 
> 1. **Vertices** V = [alice, aura, alison, peter, cat, bob]
> 2. **Edges** E = [alice->peter, aura->alice, aura->peter, aura->alison, alison->peter, peter->cat, peter->bob]

The following instructions will create the graph **G** show in the figure.

####Creating the Graph G:
```
  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('graphi');

  /* Adding properties and computed fields */
  g.setProperty('version', 1);

  /* persist g */
  g.create().then((result) => {
    console.log("Graph g created", result);
}, (s)=> {
  console.log('disconnected', s.id);
})

```

<p align="center">
  <img height="350" src="https://raw.githubusercontent.com/TruenoDB/trueno-javascript-driver/master/images/neighbors-example.png" align="middle">
</p>

