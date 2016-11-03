"use strict";

/**
 * @author Edgardo A. Barsallo Yi (ebarsallo)
 * This module decription
 * @module path/moduleFileName
 * @see module:path/referencedModuleName
 */

const Trueno = require('../lib/trueno');

/* Instantiate connection */
// let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});
let trueno = new Trueno({host: 'http://localhost', port: 8000, debug: false});

trueno.connect((s)=> {

  /* Create a new Graph */
  let g = trueno.Graph();
  g.setLabel("titan");
  g.open().then( (result) => {

    /* vertices */

    let saturn = g.addVertex();
    saturn.setLabel("titan");
    saturn.setProperty("name", "saturn");
    saturn.setProperty("age", 10000);
    saturn.setId(1);

    let sky = g.addVertex();
    sky.setLabel("location");
    sky.setProperty("name", "sky");
    sky.setId(2);

    let sea = g.addVertex();
    sea.setLabel("location");
    sea.setProperty("name", "sea");
    sea.setId(3);

    let jupiter = g.addVertex();
    jupiter.setLabel("god");
    jupiter.setProperty("name", "jupiter");
    jupiter.setProperty("age", 5000);
    jupiter.setId(4);

    let neptune = g.addVertex();
    neptune.setLabel("god");
    neptune.setProperty("name", "neptune");
    neptune.setProperty("age", 4500);
    neptune.setId(5);

    let hercules = g.addVertex();
    hercules.setLabel("demigod");
    hercules.setProperty("name", "hercules");
    hercules.setProperty("age", 30);
    hercules.setId(6);

    let alcmene = g.addVertex();
    alcmene.setLabel("human");
    alcmene.setProperty("name", "alcmene");
    alcmene.setProperty("age", 45);
    alcmene.setId(7);

    let pluto = g.addVertex();
    pluto.setLabel("god");
    pluto.setProperty("name", "pluto");
    pluto.setProperty("age", 4000);
    pluto.setId(8);

    let nemean = g.addVertex();
    nemean.setLabel("monster");
    nemean.setProperty("name", "nemean");
    nemean.setId(9);

    let hydra = g.addVertex();
    hydra.setLabel("monster");
    hydra.setProperty("name", "hydra");
    hydra.setId(10);

    let cerberus = g.addVertex();
    cerberus.setLabel("monster");
    cerberus.setProperty("name", "cerberus");
    cerberus.setId(11);

    let tartarus = g.addVertex();
    tartarus.setLabel("location");
    tartarus.setProperty("name", "tartarus");
    tartarus.setId(12);

    saturn.persist();
    sky.persist();
    sea.persist();
    jupiter.persist();
    neptune.persist();
    hercules.persist();
    alcmene.persist();
    pluto.persist();
    nemean.persist();
    hydra.persist();
    cerberus.persist();
    tartarus.persist();

    /* edges */

    let edge1 = g.addEdge(jupiter.getId(), saturn.getId());
    edge1.setLabel("father");
    edge1.setId(1);
    let edge2 = g.addEdge(jupiter.getId(), sky.getId());
    edge2.setLabel("lives");
    edge2.setProperty("reason", "loves fresh breezes");
    edge2.setId(2);
    let edge3 = g.addEdge(jupiter.getId(), neptune.getId());
    edge3.setLabel("brother");
    edge3.setId(3);
    let edge4 = g.addEdge(jupiter.getId(), pluto.getId());
    edge4.setLabel("brother");
    edge4.setId(4);

    let edge5 = g.addEdge(neptune.getId(), sea.getId());
    edge5.setLabel("lives");
    edge5.setProperty("reason", "loves waves");
    edge5.setId(5);
    let edge6 = g.addEdge(neptune.getId(), jupiter.getId());
    edge6.setLabel("brother");
    edge6.setId(6);
    let edge7 = g.addEdge(neptune.getId(), pluto.getId());
    edge7.setLabel("brother");
    edge7.setId(7);

    let edge8 = g.addEdge(hercules.getId(), jupiter.getId());
    edge8.setLabel("father");
    edge8.setId(8);
    let edge9 = g.addEdge(hercules.getId(), alcmene.getId());
    edge9.setLabel("mother");
    edge9.setId(9);
    let edge10 = g.addEdge(hercules.getId(), nemean.getId());
    edge10.setLabel("battled");
    edge10.setProperty("time", 1);
    edge10.setProperty("place", "Geoshape.point(38.1f, 23.7f)");
    edge10.setId(10);
    let edge11 = g.addEdge(hercules.getId(), hydra.getId());
    edge11.setLabel("battled");
    edge11.setProperty("time", 12);
    edge11.setProperty("place", "Geoshape.point(37.7f, 23.9f)");
    edge11.setId(11);
    let edge12 = g.addEdge(hercules.getId(), cerberus.getId());
    edge12.setLabel("battled");
    edge12.setProperty("time", 12);
    edge12.setProperty("place", "Geoshape.point(39f, 22f)");
    edge12.setId(12);

    let edge13 = g.addEdge(pluto.getId(), jupiter.getId());
    edge13.setLabel("brother");
    edge13.setId(13);
    let edge14 = g.addEdge(pluto.getId(), neptune.getId());
    edge14.setLabel("brother");
    edge14.setId(14);
    let edge15 = g.addEdge(pluto.getId(), tartarus.getId());
    edge15.setLabel("lives");
    edge15.setProperty("reason", "no fear of death");
    edge15.setId(15);
    let edge16 = g.addEdge(pluto.getId(), cerberus.getId());
    edge16.setLabel("pet");
    edge16.setId(16);

    let edge17 = g.addEdge(cerberus.getId(), tartarus.getId());
    edge17.setLabel("lives");
    edge17.setId(17);

    edge1.persist();
    edge2.persist();
    edge3.persist();
    edge4.persist();
    edge5.persist();
    edge6.persist();
    edge7.persist();
    edge8.persist();
    edge9.persist();
    edge10.persist();
    edge11.persist();
    edge12.persist();
    edge13.persist();
    edge14.persist();
    edge15.persist();
    edge16.persist();
    edge17.persist();

  });

}, (s)=> {
  console.log('disconnected', s.id);
});

