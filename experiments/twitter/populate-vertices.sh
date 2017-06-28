#!/bin/bash

# Trueno Labs
# Populate vertices into twitter graph database (https://snap.stanford.edu/data/twitter-2010.html),
# Data must be already converted in json files 

# vertices
function vertices() {

   src=/tmp/data/vertices-*json
   dst=/tmp/data/proc

   for fn in $src
   do
      time node twitter-graph-populate-vertices.js ${fn}
      mv ${fn} ${dst}
   done 
}

vertices
  
