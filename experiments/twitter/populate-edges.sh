#!/bin/bash

# Trueno Labs
# Populate edges into twitter graph database (https://snap.stanford.edu/data/twitter-2010.html),
# Data must be already converted in json files 

#offset=0   # 0 (pdsl??)
#offset=200000000   # 1 (pdsl??)
#offset=400000000   # 2 (pdsl??)
#offset=600000000   # 3 (pdsl??)
#offset=800000000   # 4 (pdsl??)
#offset=1000000000  # 5 (pdsl??)
#offset=1200000000  # 6 (pdsl??)
#offset=1400000000  # 7 (pdsl14)

offset=1400000000
inc=200000

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
  
