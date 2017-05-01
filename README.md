
<img height="75" src="https://raw.githubusercontent.com/TruenoDB/trueno/master/assets/images/truenoDB.png" align="middle">

# trueno-javascript-driver
Javascript driver for the TruenoDB graph database.

### Creating a Graph
In order to create a graph **G=(V,E)** with 
> 1. **Vertices** V = [alice, aura, alison, peter, cat, bob]
> 2. **Edges** E = [alice->peter, aura->alice, aura->peter, aura->alison, alison->peter, peter->cat, peter->bob]

The following instructions are necessary:

#### Creating the Graph **G**:
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

#### Creating the Vertices **V**:
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

#### Creating the Edges **E**:
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
  <img height="500" src="https://raw.githubusercontent.com/TruenoDB/trueno-javascript-driver/master/images/neighbors-example.png" align="middle">
</p>

#### Persisting vertices in the backend
```js
   /* persist v1 (alice) */
    v1.persist().then((result) => {
      console.log('Vertex successfully created with id: ', result);
    }, (error) => {
      console.log('Vertex persistence error: ',error);
    });
```

####Persisting edges in the backend
```js
   /* persist e1 */
    e1.persist().then((result) => {
      console.log('Edge successfully created with id: ', e1.getId());
    }, (error) => {
      console.log('Edge persistence error: ',error);
    });
```

### Neighbors

Formally, the neighbourhood of a vertex **v** in a graph **G** is the induced subgraph of G consisting of all vertices adjacent to **v**. We can look for adjacent vertices of **v** in TruenoDB with the following instructions:

#### Creating all vertices
```js
  /* Create a new Graph */
  let g = trueno.Graph();
  g.setId(1);
  g.setLabel("graphi");

  let v = g.addVertex();
  v.setId(4);

  let alice = g.addVertex();
  alice.setId(1);

  let aura = g.addVertex();
  aura.setId(2);

  let alison = g.addVertex();
  alison.setId(3);

  let peter = g.addVertex();
  peter.setId(4);

  let cat = g.addVertex();
  cat.setId(5);

  let bob = g.addVertex();
  bob.setId(6);
  
```

#### Creating filter and finding incoming neighbors of [alice]
```js
  /* Example from Vertex.id = 2 [aura] */
  let filter2 = g.filter()
                 .term('prop.name', 'aura');
  alice.in('v', filter2).then((vertices)=> {
    console.log("Incoming vertices to alice");
    vertices.forEach((v)=> {
        console.log(v);
    });
  });
  /* Result is: Vertex.id = 3  | (2) -> (1)   | (aura) -> (alice) */
```

Our results will show the following:

<p align="center">
  <img height="500" src="https://raw.githubusercontent.com/TruenoDB/trueno-javascript-driver/master/images/neighbors-example-aura-alice.png" align="middle">
</p>

#### Creating filter and finding outgoing neighbors of [alice]
```js
  /* Example from Vertex.id = 1 [alice] */
  let filterAlice = g.filter()
                     .term('prop.name', 'peter');
  alice.out('v',filterAlice).then((vertices)=> {
    console.log("Outgoing vertices from alice");
    vertices.forEach((v)=> {
        console.log(v);
    });
  });
  /* Result is: Vertex.id = 4  | (1) -> (4)   | (alice) -> (peter) */
```

Our results will show the following:

<p align="center">
  <img height="500" src="https://raw.githubusercontent.com/TruenoDB/trueno-javascript-driver/master/images/neighbors-example-alice-peter.png" align="middle">
</p>


## Compute

### Deploying jobs in the Spark-Cluster
```js
  /* Create a new Graph */
  let g = trueno.Graph();
  g.setId(1);
  g.setLabel("graphi");

  let c = g.getCompute(Enums.algorithmType.DEPENDENCIES);

  /* Get the compute of the algorithm */
  c.deploy().then((jobId)=> {
    console.log('JobId: ', jobId);

     var x = setInterval(function () {
       c.jobStatus(jobId).then((status)=> {
          console.log('Job Status: ', status);
          if (status == "FINISHED") {
             c.jobResult(jobId).then((result)=> {
               console.log('Job Result: ', result);
               clearInterval(x);
             });
          }
       });
    }, 10000);

  });
```
