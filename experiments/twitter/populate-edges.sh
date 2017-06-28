#!/bin/bash

# Trueno Labs
# Populate edges into twitter graph database (https://snap.stanford.edu/data/twitter-2010.html),
# Data must be already converted in json files 

offset=0
inc=2000000

# edges 
function edges() {

   src=/tmp/data/edges-*json
   dst=/tmp/data/proc

   for fn in $src
   do
      time node twitter-graph-populate-edges ${fn} ${offset}
      mv ${fn} ${dst}
      offset=`expr ${offset} + ${inc}`
   done 
}

edges
  
