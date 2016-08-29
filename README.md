
<img height="75" src="https://raw.githubusercontent.com/TruenoDB/trueno/master/assets/images/truenoDB.png" align="middle">

# trueno-javascript-driver
Javascript driver for the TruenoDB graph database.

###Creating a Graph
In order to create a graph **G=(V,E)** with 
> 1. **Vertices** V = [alice, aura, alison, peter, cat, bob]
> 2. **Edges** E = [alice->peter, aura->alice, aura->peter, aura->alison, alison->peter, peter->cat, peter->bob]

The following instructions will create the graph **G** shown in the figure.

####Creating the Graph **G**:
```js
  /* Create a new Graph */
  let g = trueno.Graph();

  /* Set label: very important */
  g.setLabel('graphi');

  /* Adding properties and computed fields */
  g.setProperty('version', 1);

  /* persist g */
  g.create().then((result) => {
    console.log("Graph g created", result);
  });
```

####Creating the Vertices **V**:
```js
    let v1 = g.addVertex();
    let v2 = g.addVertex();
    let v3 = g.addVertex();
    let v4 = g.addVertex();
    let v5 = g.addVertex();
    let v6 = g.addVertex();

    /* Set custom ids */
    v1.setId(1);
    v2.setId(2);
    v3.setId(3);
    v4.setId(4);
    v5.setId(5);
    v6.setId(6);

    /* Adding properties and computed fields */
    v1.setProperty('name', 'alice');
    v1.setProperty('age', '25');

    v2.setProperty('name', 'aura');
    v2.setProperty('age', '30');

    v3.setProperty('name', 'alison');
    v3.setProperty('age', '35');

    v4.setProperty('name', 'peter');
    v4.setProperty('age', '20');

    v5.setProperty('name', 'cat');
    v5.setProperty('age', '65');

    v6.setProperty('name', 'bob');
    v6.setProperty('age', '50');

```

####Creating the Edges **E**:
```js
    /* Edges */
    let e1 = g.addEdge(1,4);//alice -> peter
    let e2 = g.addEdge(2,1);//aura -> alice
    let e3 = g.addEdge(2,3);//aura -> alison
    let e4 = g.addEdge(2,4);//aura -> peter
    let e5 = g.addEdge(3,4);//alison -> peter
    let e6 = g.addEdge(4,5);//peter -> cat
    let e7 = g.addEdge(4,6);//peter -> bob

    /* Adding properties and labels */
    e1.setLabel('knows');
    e2.setLabel('knows');
    e3.setLabel('knows');
    e4.setLabel('knows');
    e5.setLabel('knows');
    e6.setLabel('knows');
    e7.setLabel('knows');

    e1.setProperty('since', 20);
    e2.setProperty('since', 15);
    e3.setProperty('since', 25);
    e4.setProperty('since', 20);
    e5.setProperty('since', 30);
    e6.setProperty('since', 10);
    e7.setProperty('since', 20);
```

The instructions above will generate the following Graph **G**
<p align="center">
  <img height="400" src="https://raw.githubusercontent.com/TruenoDB/trueno-javascript-driver/master/images/neighbors-example.png" align="middle">
</p>

